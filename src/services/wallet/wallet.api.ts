import { paygeniusAPI } from '../api/http';
import { WALLET_ENDPOINTS } from './wallet.endpoints';
import type { ApiResponse } from '@/types';
import type { WalletResponse } from './wallet.type';

export const getWalletAPI = async (): Promise<ApiResponse<WalletResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<WalletResponse>>(
    WALLET_ENDPOINTS.GET.ROUTE
  );
  return response.data;
};
