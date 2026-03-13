import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { AUTH_ENDPOINTS } from './auth.endpoints';
import {
  sendVerificationAPI,
  verifyPhoneAPI,
  registerAPI,
  loginAPI,
  loginBiometricAPI,
  googleAuthAPI,
  googleCodeAPI,
  appleAuthAPI,
  getMeAPI,
} from './auth.api';
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

export function useSendVerificationMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, AxiosError<unknown>, SendVerificationPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.SEND_VERIFICATION.MUTATION_KEY,
    mutationFn: sendVerificationAPI,
    ...options,
  });
}

export function useVerifyPhoneMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, AxiosError<unknown>, VerifyPhonePayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.VERIFY_PHONE.MUTATION_KEY,
    mutationFn: verifyPhoneAPI,
    ...options,
  });
}

export function useRegisterMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthData>, AxiosError<unknown>, RegisterPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.REGISTER.MUTATION_KEY,
    mutationFn: registerAPI,
    ...options,
  });
}

export function useLoginMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthData>, AxiosError<unknown>, LoginPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.LOGIN.MUTATION_KEY,
    mutationFn: loginAPI,
    ...options,
  });
}

export function useLoginBiometricMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthData>, AxiosError<unknown>, LoginBiometricPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.LOGIN_BIOMETRIC.MUTATION_KEY,
    mutationFn: loginBiometricAPI,
    ...options,
  });
}

export function useGoogleAuthMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthData>, AxiosError<unknown>, GoogleAuthPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.GOOGLE.MUTATION_KEY,
    mutationFn: googleAuthAPI,
    ...options,
  });
}

export function useGoogleCodeMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthData>, AxiosError<unknown>, GoogleCodePayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.GOOGLE_CODE.MUTATION_KEY,
    mutationFn: googleCodeAPI,
    ...options,
  });
}

export function useAppleAuthMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<AuthData>, AxiosError<unknown>, AppleAuthPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: AUTH_ENDPOINTS.APPLE.MUTATION_KEY,
    mutationFn: appleAuthAPI,
    ...options,
  });
}

export function useGetMeQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<MeResponse>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: AUTH_ENDPOINTS.ME.QUERY_KEY,
    queryFn: getMeAPI,
    ...options,
  });
}
