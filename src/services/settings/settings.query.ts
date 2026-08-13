import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { SETTINGS_ENDPOINTS } from './settings.endpoints';
import {
  changePasswordAPI,
  changePinAPI,
  deactivateAccountAPI,
  deleteAccountAPI,
  getReferralsAPI,
  getSettingsAPI,
  setBiometricAPI,
  submitReviewAPI,
  updateSettingsAPI,
} from './settings.api';
import type {
  AppSettings,
  ChangePasswordPayload,
  ChangePinPayload,
  ReferralDetails,
  SubmitReviewPayload,
} from './settings.type';
import { useAuthStore } from '@/stores';

export function useGetSettingsQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<{ settings: AppSettings }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: SETTINGS_ENDPOINTS.GET.QUERY_KEY,
    queryFn: getSettingsAPI,
    ...options,
    enabled: !!token && (options?.enabled ?? true),
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettingsAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_ENDPOINTS.GET.QUERY_KEY });
    },
  });
}

export function useChangePasswordMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<unknown>, AxiosError<unknown>, ChangePasswordPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: SETTINGS_ENDPOINTS.CHANGE_PASSWORD.MUTATION_KEY,
    mutationFn: changePasswordAPI,
    ...options,
  });
}

export function useChangePinMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<unknown>, AxiosError<unknown>, ChangePinPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: SETTINGS_ENDPOINTS.CHANGE_PIN.MUTATION_KEY,
    mutationFn: changePinAPI,
    ...options,
  });
}

export function useSetBiometricMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: SETTINGS_ENDPOINTS.BIOMETRIC.MUTATION_KEY,
    mutationFn: setBiometricAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_ENDPOINTS.GET.QUERY_KEY });
    },
  });
}

export function useDeactivateAccountMutation() {
  return useMutation({
    mutationKey: SETTINGS_ENDPOINTS.DEACTIVATE.MUTATION_KEY,
    mutationFn: deactivateAccountAPI,
  });
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationKey: SETTINGS_ENDPOINTS.ACCOUNT.MUTATION_KEY,
    mutationFn: deleteAccountAPI,
  });
}

export function useGetReferralsQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: SETTINGS_ENDPOINTS.REFERRALS.QUERY_KEY,
    queryFn: getReferralsAPI,
    enabled: !!token,
  });
}

export function useSubmitReviewMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ review: unknown }>,
      AxiosError<unknown>,
      SubmitReviewPayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: SETTINGS_ENDPOINTS.RATE.MUTATION_KEY,
    mutationFn: submitReviewAPI,
    ...options,
  });
}

export type { ReferralDetails };
