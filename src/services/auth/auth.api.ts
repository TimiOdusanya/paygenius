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
import type { User } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { usePreferencesStore } from '@/stores/preferences.store';

function persistAuth(token: string, user: User) {
  useAuthStore.getState().setAuth(token, user);
  if (user.phoneNumber) {
    usePreferencesStore.getState().setLastPhoneNumber(user.phoneNumber);
  }
}

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
    persistAuth(res.data.token, res.data.user);
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
    persistAuth(res.data.token, res.data.user);
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
    persistAuth(res.data.token, res.data.user);
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
    persistAuth(res.data.token, res.data.user);
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
    persistAuth(res.data.token, res.data.user);
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
    persistAuth(res.data.token, res.data.user);
  }
  return res;
};

export const getMeAPI = async (): Promise<ApiResponse<MeResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<MeResponse | User>>(
    AUTH_ENDPOINTS.ME.ROUTE
  );
  const res = response.data;
  if (res.success && res.data) {
    const payload = res.data as MeResponse | User;
    const user =
      payload && typeof payload === 'object' && 'user' in payload && payload.user
        ? payload.user
        : (payload as User);
    if (user?._id) {
      useAuthStore.getState().setUser(user);
      if (user.phoneNumber) {
        usePreferencesStore.getState().setLastPhoneNumber(user.phoneNumber);
      }
    }
  }
  return res as ApiResponse<MeResponse>;
};
