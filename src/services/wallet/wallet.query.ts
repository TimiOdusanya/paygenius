import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { WALLET_ENDPOINTS } from './wallet.endpoints';
import { getWalletAPI } from './wallet.api';
import type { WalletResponse } from './wallet.type';

export function useGetWalletQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<WalletResponse>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: WALLET_ENDPOINTS.GET.QUERY_KEY,
    queryFn: getWalletAPI,
    ...options,
  });
}
