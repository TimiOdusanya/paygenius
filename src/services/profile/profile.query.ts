import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { Address, ApiResponse } from '@/types';
import { PROFILE_ENDPOINTS } from './profile.endpoints';
import {
  getProfileAPI,
  setupProfileAPI,
  verifyAddressAPI,
  verifyIdentityAPI,
  uploadSelfieAPI,
  setupPinAPI,
  enableBiometricAPI,
} from './profile.api';
import type {
  ProfileResponse,
  ProfileSetupPayload,
  VerifyIdentityPayload,
  UploadSelfiePayload,
  SetupPinPayload,
} from './profile.type';

export function useGetProfileQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<ProfileResponse>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: PROFILE_ENDPOINTS.GET.QUERY_KEY,
    queryFn: getProfileAPI,
    ...options,
  });
}

export function useSetupProfileMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ProfileResponse>,
      AxiosError<unknown>,
      ProfileSetupPayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: PROFILE_ENDPOINTS.SETUP.MUTATION_KEY,
    mutationFn: setupProfileAPI,
    ...options,
  });
}

export function useVerifyAddressMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<ProfileResponse>, AxiosError<unknown>, Address>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: PROFILE_ENDPOINTS.VERIFY_ADDRESS.MUTATION_KEY,
    mutationFn: verifyAddressAPI,
    ...options,
  });
}

export function useVerifyIdentityMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ProfileResponse>,
      AxiosError<unknown>,
      VerifyIdentityPayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: PROFILE_ENDPOINTS.VERIFY_IDENTITY.MUTATION_KEY,
    mutationFn: verifyIdentityAPI,
    ...options,
  });
}

export function useUploadSelfieMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ProfileResponse>,
      AxiosError<unknown>,
      UploadSelfiePayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: PROFILE_ENDPOINTS.UPLOAD_SELFIE.MUTATION_KEY,
    mutationFn: uploadSelfieAPI,
    ...options,
  });
}

export function useSetupPinMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ProfileResponse>,
      AxiosError<unknown>,
      SetupPinPayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: PROFILE_ENDPOINTS.SETUP_PIN.MUTATION_KEY,
    mutationFn: setupPinAPI,
    ...options,
  });
}

export function useEnableBiometricMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<ProfileResponse>, AxiosError<unknown>, void>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: PROFILE_ENDPOINTS.ENABLE_BIOMETRIC.MUTATION_KEY,
    mutationFn: enableBiometricAPI,
    ...options,
  });
}
