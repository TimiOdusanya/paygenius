import { paygeniusAPI } from '../api/http';
import { PROFILE_ENDPOINTS } from './profile.endpoints';
import { useAuthStore } from '@/stores/auth.store';
import type { Address, ApiResponse } from '@/types';
import type {
  ProfileResponse,
  ProfileSetupPayload,
  VerifyIdentityPayload,
  UploadSelfiePayload,
  SetupPinPayload,
  CheckUsernameResponse,
} from './profile.type';

function syncUserFromResponse(res: ApiResponse<ProfileResponse>) {
  if (res.success && res.data?.user) {
    useAuthStore.getState().setUser(res.data.user);
  }
  return res;
}

export const getProfileAPI = async (): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.GET.ROUTE
  );
  return syncUserFromResponse(response.data);
};

export const checkUsernameAPI = async (
  username: string
): Promise<ApiResponse<CheckUsernameResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<CheckUsernameResponse>>(
    PROFILE_ENDPOINTS.CHECK_USERNAME.ROUTE,
    { params: { username } }
  );
  return response.data;
};

export const setupProfileAPI = async (
  data: ProfileSetupPayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.SETUP.ROUTE,
    data
  );
  return syncUserFromResponse(response.data);
};

export const verifyAddressAPI = async (
  data: Address
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.VERIFY_ADDRESS.ROUTE,
    data
  );
  return syncUserFromResponse(response.data);
};

export const verifyIdentityAPI = async (
  data: VerifyIdentityPayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.VERIFY_IDENTITY.ROUTE,
    data
  );
  return syncUserFromResponse(response.data);
};

export const uploadSelfieAPI = async (
  data: UploadSelfiePayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.UPLOAD_SELFIE.ROUTE,
    data
  );
  return syncUserFromResponse(response.data);
};

export const setupPinAPI = async (
  data: SetupPinPayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.SETUP_PIN.ROUTE,
    data
  );
  return syncUserFromResponse(response.data);
};

export const enableBiometricAPI = async (): Promise<
  ApiResponse<ProfileResponse>
> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.ENABLE_BIOMETRIC.ROUTE
  );
  return syncUserFromResponse(response.data);
};
