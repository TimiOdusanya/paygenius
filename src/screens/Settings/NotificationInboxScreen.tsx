import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { EmptyState } from '@/components/EmptyState';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  useDeleteNotificationMutation,
  useGetNotificationPreferencesQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/services/notifications/notifications.query';
import type { AppNotification } from '@/services/notifications/notifications.type';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationInbox'>;

function timeLabel(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (sameDay) {
    return date.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

export function NotificationInboxScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { data, isLoading, refetch, isRefetching } = useGetNotificationsQuery(1);
  const { data: prefData } = useGetNotificationPreferencesQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();
  const remove = useDeleteNotificationMutation();
  const items = data?.data?.notifications ?? [];
  const requireFaceId = prefData?.data?.preferences?.requireFaceId ?? false;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#1A1D23';
  const bodyColor = isDark ? '#AAAAAA' : '#858585';
  const border = isDark ? '#4A4A4A' : '#858585';
  const unreadBg = isDark ? '#2A1A3E' : '#F2EBFD';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(16),
        }}
      >
        <ScreenTitleBar
          title="Notifications"
          subtitle="Your latest updates"
          onBack={() => navigation.goBack()}
          right={
            items.some((n) => !n.readAt) ? (
              <Pressable onPress={() => markAll.mutate()} hitSlop={8}>
                <Text style={{ color: '#7C3AED', fontSize: fs(10), fontWeight: '500' }}>
                  Read all
                </Text>
              </Pressable>
            ) : null
          }
        />
      </View>

      {isLoading && items.length === 0 ? (
        <ActivityIndicator color="#191970" style={{ marginTop: vs(40) }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{
            paddingHorizontal: hs(21),
            paddingBottom: insets.bottom + vs(24),
            flexGrow: 1,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <EmptyState
              variant="history"
              title="You're all caught up"
              subtitle="Bill payments, security alerts, and Genie tips will show up here."
            />
          }
          renderItem={({ item }: { item: AppNotification }) => (
            <Pressable
              onPress={async () => {
                if (
                  requireFaceId &&
                  (item.type === 'TRANSACTION' || item.type === 'SECURITY')
                ) {
                  try {
                    const result = await LocalAuthentication.authenticateAsync({
                      promptMessage: 'Confirm to view this alert',
                    });
                    if (!result.success) return;
                  } catch {
                    return;
                  }
                }
                if (!item.readAt) markRead.mutate(item._id);
              }}
              onLongPress={() => remove.mutate(item._id)}
              style={[
                styles.card,
                {
                  borderColor: border,
                  backgroundColor: item.readAt ? 'transparent' : unreadBg,
                  minHeight: ms(58),
                  borderRadius: ms(8),
                  paddingHorizontal: hs(16),
                  paddingVertical: vs(12),
                },
              ]}
            >
              <View style={styles.row}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: item.readAt ? 'transparent' : '#7C3AED',
                      width: ms(8),
                      height: ms(8),
                      borderRadius: ms(4),
                      marginRight: hs(10),
                    },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: titleColor, fontSize: fs(14) }]}>
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={[styles.body, { color: bodyColor, fontSize: fs(10), marginTop: 4 }]}
                  >
                    {item.body}
                  </Text>
                </View>
                <Text style={{ color: bodyColor, fontSize: fs(8), marginLeft: hs(8) }}>
                  {timeLabel(item.createdAt)}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { borderWidth: 0.5, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: { marginTop: 5 },
  title: { fontWeight: '500' },
  body: { fontWeight: '400' },
});
