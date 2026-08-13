import { paygeniusAPI } from '../api/http';
import type { ApiResponse } from '@/types';
import { NOTIFICATION_ENDPOINTS } from './notifications.endpoints';
import type {
  AppNotification,
  NotificationListData,
  NotificationPreferences,
  PreferenceUpdates,
} from './notifications.type';

export const getNotificationsAPI = async (
  page = 1,
  limit = 30
): Promise<ApiResponse<NotificationListData>> => {
  const response = await paygeniusAPI.get<ApiResponse<NotificationListData>>(
    NOTIFICATION_ENDPOINTS.LIST.ROUTE,
    { params: { page, limit } }
  );
  return response.data;
};

export const getUnreadCountAPI = async (): Promise<
  ApiResponse<{ count: number }>
> => {
  const response = await paygeniusAPI.get<ApiResponse<{ count: number }>>(
    NOTIFICATION_ENDPOINTS.UNREAD.ROUTE
  );
  return response.data;
};

export const getNotificationPreferencesAPI = async (): Promise<
  ApiResponse<{ preferences: NotificationPreferences }>
> => {
  const response = await paygeniusAPI.get<
    ApiResponse<{ preferences: NotificationPreferences }>
  >(NOTIFICATION_ENDPOINTS.PREFERENCES.ROUTE);
  return response.data;
};

export const updateNotificationPreferencesAPI = async (
  payload: PreferenceUpdates
): Promise<ApiResponse<{ preferences: NotificationPreferences }>> => {
  const response = await paygeniusAPI.patch<
    ApiResponse<{ preferences: NotificationPreferences }>
  >(NOTIFICATION_ENDPOINTS.PREFERENCES.ROUTE, payload);
  return response.data;
};

export const markNotificationReadAPI = async (
  id: string
): Promise<ApiResponse<{ notification: AppNotification }>> => {
  const response = await paygeniusAPI.patch<
    ApiResponse<{ notification: AppNotification }>
  >(NOTIFICATION_ENDPOINTS.READ.ROUTE(id));
  return response.data;
};

export const markAllNotificationsReadAPI = async (): Promise<
  ApiResponse<{ modified: number }>
> => {
  const response = await paygeniusAPI.post<ApiResponse<{ modified: number }>>(
    NOTIFICATION_ENDPOINTS.READ_ALL.ROUTE
  );
  return response.data;
};

export const deleteNotificationAPI = async (
  id: string
): Promise<ApiResponse<{ notification: AppNotification }>> => {
  const response = await paygeniusAPI.delete<
    ApiResponse<{ notification: AppNotification }>
  >(NOTIFICATION_ENDPOINTS.DELETE.ROUTE(id));
  return response.data;
};

export const registerDeviceAPI = async (payload: {
  token: string;
  platform: 'ios' | 'android' | 'web';
}): Promise<ApiResponse<{ device: unknown }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ device: unknown }>>(
    NOTIFICATION_ENDPOINTS.DEVICES.ROUTE,
    payload
  );
  return response.data;
};

export const unregisterDeviceAPI = async (
  token: string
): Promise<ApiResponse<{ device: unknown }>> => {
  const response = await paygeniusAPI.delete<ApiResponse<{ device: unknown }>>(
    NOTIFICATION_ENDPOINTS.DEVICES.ROUTE,
    { data: { token } }
  );
  return response.data;
};
