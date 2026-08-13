import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, Platform } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/services/api/http';
import { useAuthStore } from '@/stores';
import { NOTIFICATION_ENDPOINTS } from '@/services/notifications/notifications.endpoints';
import { registerDeviceAPI } from '@/services/notifications/notifications.api';
import type { AppNotification } from '@/services/notifications/notifications.type';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type Banner = Pick<AppNotification, '_id' | 'title' | 'body' | 'type'>;

type NotificationContextValue = {
  banner: Banner | null;
  dismissBanner: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function socketUrl() {
  return BASE_URL.replace(/\/$/, '');
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [banner, setBanner] = useState<Banner | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissBanner = useCallback(() => {
    setBanner(null);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const showBanner = useCallback((next: Banner) => {
    setBanner(next);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBanner(null), 5200);
  }, []);

  const refreshLists = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.LIST.QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.UNREAD.QUERY_KEY });
  }, [queryClient]);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(socketUrl(), {
      transports: ['websocket'],
      auth: { token },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
    socketRef.current = socket;

    socket.on('notification:new', (payload: AppNotification) => {
      refreshLists();
      if (payload?.title) {
        showBanner({
          _id: payload._id,
          title: payload.title,
          body: payload.body,
          type: payload.type,
        });
      }
    });
    socket.on('notification:unread-count', refreshLists);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, refreshLists, showBanner]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const permission = await Notifications.requestPermissionsAsync();
        if (!permission.granted || cancelled) return;
        const push = await Notifications.getExpoPushTokenAsync();
        if (!push.data || cancelled) return;
        await registerDeviceAPI({
          token: push.data,
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
        });
      } catch {
        // Expo Go / simulator may not issue a push token.
      }
    })();

    const sub = Notifications.addNotificationReceivedListener((event) => {
      const content = event.request.content;
      showBanner({
        _id: String(content.data?.notificationId ?? Date.now()),
        title: content.title ?? 'PayGenius',
        body: content.body ?? '',
        type: (content.data?.type as Banner['type']) ?? 'SYSTEM',
      });
      refreshLists();
    });

    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshLists();
    });

    return () => {
      cancelled = true;
      sub.remove();
      appSub.remove();
    };
  }, [token, refreshLists, showBanner]);

  const value = useMemo(
    () => ({ banner, dismissBanner }),
    [banner, dismissBanner]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotificationCenter() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationCenter must be used within NotificationProvider');
  }
  return ctx;
}
