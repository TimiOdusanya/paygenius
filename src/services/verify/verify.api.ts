import { paygeniusAPI } from '../api/http';
import { VERIFY_ENDPOINTS } from './verify.endpoints';
import type { ApiResponse } from '@/types';
import type { Bank, ResolvedAccount, ResolvedCardBin } from './verify.type';

export const getBanksAPI = async (): Promise<ApiResponse<{ banks: Bank[] }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ banks: Bank[] }>>(
    VERIFY_ENDPOINTS.BANKS.ROUTE
  );
  return response.data;
};

export const resolveAccountAPI = async (
  accountNumber: string,
  bankCode: string
): Promise<ApiResponse<{ account: ResolvedAccount }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ account: ResolvedAccount }>>(
    VERIFY_ENDPOINTS.ACCOUNT.ROUTE,
    { params: { accountNumber, bankCode } }
  );
  return response.data;
};

export const resolveCardBinAPI = async (
  bin: string
): Promise<ApiResponse<{ card: ResolvedCardBin }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ card: ResolvedCardBin }>>(
    VERIFY_ENDPOINTS.CARD_BIN.ROUTE(bin)
  );
  return response.data;
};
