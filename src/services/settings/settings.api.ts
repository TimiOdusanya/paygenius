import { paygeniusAPI } from '../api/http';
import type { ApiResponse } from '@/types';
import { SETTINGS_ENDPOINTS } from './settings.endpoints';
import type {
  AppSettings,
  ChangePasswordPayload,
  ChangePinPayload,
  ReferralDetails,
  SubmitReviewPayload,
} from './settings.type';

export const getSettingsAPI = async (): Promise<
  ApiResponse<{ settings: AppSettings }>
> => {
  const response = await paygeniusAPI.get<ApiResponse<{ settings: AppSettings }>>(
    SETTINGS_ENDPOINTS.GET.ROUTE
  );
  return response.data;
};

export const updateSettingsAPI = async (
  payload: Partial<
    Pick<AppSettings, 'dailySpendLimit' | 'dailyTransferLimit' | 'faceIdEnabled'>
  >
): Promise<ApiResponse<{ settings: AppSettings }>> => {
  const response = await paygeniusAPI.patch<ApiResponse<{ settings: AppSettings }>>(
    SETTINGS_ENDPOINTS.GET.ROUTE,
    payload
  );
  return response.data;
};

export const changePasswordAPI = async (
  payload: ChangePasswordPayload
): Promise<ApiResponse<unknown>> => {
  const response = await paygeniusAPI.post<ApiResponse<unknown>>(
    SETTINGS_ENDPOINTS.CHANGE_PASSWORD.ROUTE,
    payload
  );
  return response.data;
};

export const changePinAPI = async (
  payload: ChangePinPayload
): Promise<ApiResponse<unknown>> => {
  const response = await paygeniusAPI.post<ApiResponse<unknown>>(
    SETTINGS_ENDPOINTS.CHANGE_PIN.ROUTE,
    payload
  );
  return response.data;
};

export const setBiometricAPI = async (
  enabled: boolean
): Promise<ApiResponse<unknown>> => {
  const response = await paygeniusAPI.post<ApiResponse<unknown>>(
    SETTINGS_ENDPOINTS.BIOMETRIC.ROUTE,
    { enabled }
  );
  return response.data;
};

export const deactivateAccountAPI = async (): Promise<
  ApiResponse<{ deactivated: boolean }>
> => {
  const response = await paygeniusAPI.post<ApiResponse<{ deactivated: boolean }>>(
    SETTINGS_ENDPOINTS.DEACTIVATE.ROUTE
  );
  return response.data;
};

export const deleteAccountAPI = async (
  password?: string
): Promise<ApiResponse<{ deleted: boolean }>> => {
  const response = await paygeniusAPI.delete<ApiResponse<{ deleted: boolean }>>(
    SETTINGS_ENDPOINTS.ACCOUNT.ROUTE,
    { data: password ? { password } : {} }
  );
  return response.data;
};

export const getReferralsAPI = async (): Promise<ApiResponse<ReferralDetails>> => {
  const response = await paygeniusAPI.get<ApiResponse<ReferralDetails>>(
    SETTINGS_ENDPOINTS.REFERRALS.ROUTE
  );
  return response.data;
};

export const submitReviewAPI = async (
  payload: SubmitReviewPayload
): Promise<ApiResponse<{ review: unknown }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ review: unknown }>>(
    SETTINGS_ENDPOINTS.RATE.ROUTE,
    payload
  );
  return response.data;
};
