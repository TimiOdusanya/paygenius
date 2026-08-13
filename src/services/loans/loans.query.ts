import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { LOAN_ENDPOINTS } from './loans.endpoints';
import {
  getLoanAPI,
  getLoanProvidersAPI,
  getLoansAPI,
  linkLoanAPI,
  updateLoanAPI,
} from './loans.api';
import type {
  LinkLoanPayload,
  Loan,
  LoanProvider,
  LoansListResponse,
  UpdateLoanPayload,
} from './loans.type';

export function useGetLoansQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<LoansListResponse>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: LOAN_ENDPOINTS.LIST.QUERY_KEY,
    queryFn: getLoansAPI,
    ...options,
  });
}

export function useGetLoanProvidersQuery(
  q?: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ providers: LoanProvider[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...LOAN_ENDPOINTS.PROVIDERS.QUERY_KEY, q ?? ''],
    queryFn: () => getLoanProvidersAPI(q),
    ...options,
  });
}

export function useGetLoanQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ loan: Loan }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: LOAN_ENDPOINTS.DETAIL.QUERY_KEY(id),
    queryFn: () => getLoanAPI(id),
    enabled: !!id,
    ...options,
  });
}

export function useLinkLoanMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ loan: Loan }>,
      AxiosError<unknown>,
      LinkLoanPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: LOAN_ENDPOINTS.CREATE.MUTATION_KEY,
    mutationFn: linkLoanAPI,
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: LOAN_ENDPOINTS.LIST.QUERY_KEY });
      onSuccess?.(...args);
    },
  });
}

export function useUpdateLoanMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ loan: Loan }>,
      AxiosError<unknown>,
      { id: string } & UpdateLoanPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: LOAN_ENDPOINTS.UPDATE.MUTATION_KEY,
    mutationFn: ({ id, ...data }) => updateLoanAPI(id, data),
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: LOAN_ENDPOINTS.LIST.QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: LOAN_ENDPOINTS.DETAIL.QUERY_KEY(args[1].id),
      });
      onSuccess?.(...args);
    },
  });
}
