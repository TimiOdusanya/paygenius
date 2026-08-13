import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { WALLET_ENDPOINTS } from '../wallet/wallet.endpoints';
import { HOME_ENDPOINTS } from '../home/home.endpoints';
import { BUDGET_ENDPOINTS } from '../budget/budget.endpoints';
import { TRANSFER_ENDPOINTS } from './transfer.endpoints';
import {
  getTransferAPI,
  getTransferBeneficiariesAPI,
  lookupTransferUsersAPI,
  resolveTransferAccountAPI,
  sendTransferAPI,
} from './transfer.api';
import type {
  ResolvedTransferAccount,
  SendTransferPayload,
  TransferBeneficiary,
  TransferRail,
  TransferRecord,
  TransferUser,
} from './transfer.type';

export function useLookupTransferUsersQuery(
  q: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ users: TransferUser[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const query = q.trim();
  return useQuery({
    queryKey: [...TRANSFER_ENDPOINTS.LOOKUP.QUERY_KEY, query],
    queryFn: () => lookupTransferUsersAPI(query),
    enabled: query.length >= 2,
    ...options,
  });
}

export function useResolveTransferAccountQuery(
  params: {
    accountNumber?: string;
    rail?: TransferRail;
    bankCode?: string;
    bankName?: string;
  },
  options?: Omit<
    UseQueryOptions<ApiResponse<{ account: ResolvedTransferAccount }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const accountNumber = params.accountNumber ?? '';
  const ready =
    accountNumber.length === 10 &&
    (params.rail === 'PAYGENIUS' || !!params.bankCode);
  return useQuery({
    queryKey: [
      ...TRANSFER_ENDPOINTS.RESOLVE.QUERY_KEY,
      params.rail ?? '',
      accountNumber,
      params.bankCode ?? '',
    ],
    queryFn: () =>
      resolveTransferAccountAPI({
        accountNumber,
        rail: params.rail,
        bankCode: params.bankCode,
        bankName: params.bankName,
      }),
    enabled: ready,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGetTransferBeneficiariesQuery(
  rail?: TransferRail,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ beneficiaries: TransferBeneficiary[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...TRANSFER_ENDPOINTS.BENEFICIARIES.QUERY_KEY, rail ?? ''],
    queryFn: () => getTransferBeneficiariesAPI(rail),
    ...options,
  });
}

export function useSendTransferMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ transfer: TransferRecord }>,
      AxiosError<unknown>,
      SendTransferPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: TRANSFER_ENDPOINTS.SEND.MUTATION_KEY,
    mutationFn: sendTransferAPI,
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: WALLET_ENDPOINTS.GET.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: HOME_ENDPOINTS.DASHBOARD.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUDGET_ENDPOINTS.LIST.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSFER_ENDPOINTS.BENEFICIARIES.QUERY_KEY });
      onSuccess?.(...args);
    },
  });
}

export function useGetTransferQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ transfer: TransferRecord }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: TRANSFER_ENDPOINTS.DETAIL.QUERY_KEY(id),
    queryFn: () => getTransferAPI(id),
    enabled: !!id,
    ...options,
  });
}
