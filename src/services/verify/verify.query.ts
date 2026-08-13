import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { VERIFY_ENDPOINTS } from './verify.endpoints';
import { getBanksAPI, resolveAccountAPI, resolveCardBinAPI } from './verify.api';
import type { Bank, ResolvedAccount, ResolvedCardBin } from './verify.type';

export function useGetBanksQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<{ banks: Bank[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: VERIFY_ENDPOINTS.BANKS.QUERY_KEY,
    queryFn: getBanksAPI,
    staleTime: 60 * 60 * 1000,
    ...options,
  });
}

export function useResolveAccountQuery(
  accountNumber?: string,
  bankCode?: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ account: ResolvedAccount }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const ready = !!accountNumber && accountNumber.length === 10 && !!bankCode;
  return useQuery({
    queryKey: VERIFY_ENDPOINTS.ACCOUNT.QUERY_KEY(accountNumber ?? '', bankCode ?? ''),
    queryFn: () => resolveAccountAPI(accountNumber!, bankCode!),
    enabled: ready,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useResolveCardBinQuery(
  bin?: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ card: ResolvedCardBin }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  const ready = !!bin && bin.length >= 6;
  return useQuery({
    queryKey: VERIFY_ENDPOINTS.CARD_BIN.QUERY_KEY(bin ?? ''),
    queryFn: () => resolveCardBinAPI(bin!.slice(0, 6)),
    enabled: ready,
    retry: false,
    staleTime: 30 * 60 * 1000,
    ...options,
  });
}
