import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { NOTIFICATION_ENDPOINTS } from './notifications.endpoints';
import {
  deleteNotificationAPI,
  getNotificationPreferencesAPI,
  getNotificationsAPI,
  getUnreadCountAPI,
  markAllNotificationsReadAPI,
  markNotificationReadAPI,
  registerDeviceAPI,
  updateNotificationPreferencesAPI,
} from './notifications.api';
import type {
  AppNotification,
  NotificationListData,
  NotificationPreferences,
  PreferenceUpdates,
} from './notifications.type';
import { useAuthStore } from '@/stores';

export function useGetNotificationsQuery(
  page = 1,
  options?: Omit<
    UseQueryOptions<ApiResponse<NotificationListData>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: [...NOTIFICATION_ENDPOINTS.LIST.QUERY_KEY, page],
    queryFn: () => getNotificationsAPI(page),
    ...options,
    enabled: !!token && (options?.enabled ?? true),
  });
}

export function useGetUnreadCountQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<{ count: number }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: NOTIFICATION_ENDPOINTS.UNREAD.QUERY_KEY,
    queryFn: getUnreadCountAPI,
    refetchInterval: 60_000,
    ...options,
    enabled: !!token && (options?.enabled ?? true),
  });
}

export function useGetNotificationPreferencesQuery(
  options?: Omit<
    UseQueryOptions<
      ApiResponse<{ preferences: NotificationPreferences }>,
      AxiosError<unknown>
    >,
    'queryKey' | 'queryFn'
  >
) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: NOTIFICATION_ENDPOINTS.PREFERENCES.QUERY_KEY,
    queryFn: getNotificationPreferencesAPI,
    ...options,
    enabled: !!token && (options?.enabled ?? true),
  });
}

export function useUpdateNotificationPreferencesMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ preferences: NotificationPreferences }>,
      AxiosError<unknown>,
      PreferenceUpdates
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['notifications', 'preferences', 'update'],
    mutationFn: updateNotificationPreferencesAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_ENDPOINTS.PREFERENCES.QUERY_KEY,
      });
    },
    ...options,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: NOTIFICATION_ENDPOINTS.READ.MUTATION_KEY,
    mutationFn: markNotificationReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.LIST.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.UNREAD.QUERY_KEY });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: NOTIFICATION_ENDPOINTS.READ_ALL.MUTATION_KEY,
    mutationFn: markAllNotificationsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.LIST.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.UNREAD.QUERY_KEY });
    },
  });
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: NOTIFICATION_ENDPOINTS.DELETE.MUTATION_KEY,
    mutationFn: deleteNotificationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.LIST.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_ENDPOINTS.UNREAD.QUERY_KEY });
    },
  });
}

export function useRegisterDeviceMutation() {
  return useMutation({
    mutationKey: NOTIFICATION_ENDPOINTS.DEVICES.MUTATION_KEY,
    mutationFn: registerDeviceAPI,
  });
}

export type { AppNotification };
