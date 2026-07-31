import { paygeniusAPI } from '../api/http';
import { AUTH_ENDPOINTS } from './auth.endpoints';
import type {
  ApiResponse,
  AuthData,
  MeResponse,
  SendVerificationPayload,
  VerifyPhonePayload,
  RegisterPayload,
  LoginPayload,
  LoginBiometricPayload,
  GoogleAuthPayload,
  GoogleCodePayload,
  AppleAuthPayload,
} from './auth.type';
import { useAuthStore } from '@/stores/auth.store';

export const sendVerificationAPI = async (
  data: SendVerificationPayload
): Promise<ApiResponse<void>> => {
  const response = await paygeniusAPI.post(AUTH_ENDPOINTS.SEND_VERIFICATION.ROUTE, data);
  return response.data;
};

export const verifyPhoneAPI = async (
  data: VerifyPhonePayload
): Promise<ApiResponse<void>> => {
  const response = await paygeniusAPI.post(AUTH_ENDPOINTS.VERIFY_PHONE.ROUTE, data);
  return response.data;
};

export const registerAPI = async (
  data: RegisterPayload
): Promise<ApiResponse<AuthData>> => {
  const response = await paygeniusAPI.post<ApiResponse<AuthData>>(
    AUTH_ENDPOINTS.REGISTER.ROUTE,
    data
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setAuth(res.data.token, res.data.user);
  }
  return res;
};

export const loginAPI = async (data: LoginPayload): Promise<ApiResponse<AuthData>> => {
  // Send as `identifier` so the backend can accept phone / email / username
  const response = await paygeniusAPI.post<ApiResponse<AuthData>>(
    AUTH_ENDPOINTS.LOGIN.ROUTE,
    { identifier: data.identifier, password: data.password }
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setAuth(res.data.token, res.data.user);
  }
  return res;
};

export const loginBiometricAPI = async (
  data: LoginBiometricPayload
): Promise<ApiResponse<AuthData>> => {
  const response = await paygeniusAPI.post<ApiResponse<AuthData>>(
    AUTH_ENDPOINTS.LOGIN_BIOMETRIC.ROUTE,
    data
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setAuth(res.data.token, res.data.user);
  }
  return res;
};

export const googleAuthAPI = async (
  data: GoogleAuthPayload
): Promise<ApiResponse<AuthData>> => {
  const response = await paygeniusAPI.post<ApiResponse<AuthData>>(
    AUTH_ENDPOINTS.GOOGLE.ROUTE,
    data
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setAuth(res.data.token, res.data.user);
  }
  return res;
};

export const googleCodeAPI = async (
  data: GoogleCodePayload
): Promise<ApiResponse<AuthData>> => {
  const response = await paygeniusAPI.post<ApiResponse<AuthData>>(
    AUTH_ENDPOINTS.GOOGLE_CODE.ROUTE,
    data
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setAuth(res.data.token, res.data.user);
  }
  return res;
};

export const appleAuthAPI = async (
  data: AppleAuthPayload
): Promise<ApiResponse<AuthData>> => {
  const response = await paygeniusAPI.post<ApiResponse<AuthData>>(
    AUTH_ENDPOINTS.APPLE.ROUTE,
    data
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setAuth(res.data.token, res.data.user);
  }
  return res;
};

export const getMeAPI = async (): Promise<ApiResponse<MeResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<MeResponse>>(
    AUTH_ENDPOINTS.ME.ROUTE
  );
  const res = response.data;
  if (res.success && res.data) {
    useAuthStore.getState().setUser(res.data.user);
  }
  return res;
};
