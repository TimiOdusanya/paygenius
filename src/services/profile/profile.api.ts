import { paygeniusAPI } from '../api/http';
import { PROFILE_ENDPOINTS } from './profile.endpoints';
import type {
  ApiResponse,
  ProfileResponse,
  ProfileSetupPayload,
  VerifyIdentityPayload,
  UploadSelfiePayload,
  SetupPinPayload,
} from './profile.type';
import type { Address } from '@/types';

export const getProfileAPI = async (): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.GET.ROUTE
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
  return response.data;
};

export const verifyAddressAPI = async (
  data: Address
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.VERIFY_ADDRESS.ROUTE,
    data
  );
  return response.data;
};

export const verifyIdentityAPI = async (
  data: VerifyIdentityPayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.VERIFY_IDENTITY.ROUTE,
    data
  );
  return response.data;
};

export const uploadSelfieAPI = async (
  data: UploadSelfiePayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.UPLOAD_SELFIE.ROUTE,
    data
  );
  return response.data;
};

export const setupPinAPI = async (
  data: SetupPinPayload
): Promise<ApiResponse<ProfileResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.SETUP_PIN.ROUTE,
    data
  );
  return response.data;
};

export const enableBiometricAPI = async (): Promise<
  ApiResponse<ProfileResponse>
> => {
  const response = await paygeniusAPI.post<ApiResponse<ProfileResponse>>(
    PROFILE_ENDPOINTS.ENABLE_BIOMETRIC.ROUTE
  );
  return response.data;
};
