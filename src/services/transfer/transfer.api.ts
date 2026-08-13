import { paygeniusAPI } from '../api/http';
import { TRANSFER_ENDPOINTS } from './transfer.endpoints';
import type { ApiResponse } from '@/types';
import type {
  ResolvedTransferAccount,
  SendTransferPayload,
  TransferBeneficiary,
  TransferRail,
  TransferRecord,
  TransferUser,
} from './transfer.type';

export const lookupTransferUsersAPI = async (
  q: string
): Promise<ApiResponse<{ users: TransferUser[] }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ users: TransferUser[] }>>(
    TRANSFER_ENDPOINTS.LOOKUP.ROUTE,
    { params: { q } }
  );
  return response.data;
};

export const resolveTransferAccountAPI = async (params: {
  accountNumber: string;
  rail?: TransferRail;
  bankCode?: string;
  bankName?: string;
}): Promise<ApiResponse<{ account: ResolvedTransferAccount }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ account: ResolvedTransferAccount }>>(
    TRANSFER_ENDPOINTS.RESOLVE.ROUTE,
    { params }
  );
  return response.data;
};

export const getTransferBeneficiariesAPI = async (
  rail?: TransferRail
): Promise<ApiResponse<{ beneficiaries: TransferBeneficiary[] }>> => {
  const response = await paygeniusAPI.get<
    ApiResponse<{ beneficiaries: TransferBeneficiary[] }>
  >(TRANSFER_ENDPOINTS.BENEFICIARIES.ROUTE, {
    params: rail ? { rail } : undefined,
  });
  return response.data;
};

export const sendTransferAPI = async (
  data: SendTransferPayload
): Promise<ApiResponse<{ transfer: TransferRecord }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ transfer: TransferRecord }>>(
    TRANSFER_ENDPOINTS.SEND.ROUTE,
    data
  );
  return response.data;
};

export const getTransferAPI = async (
  id: string
): Promise<ApiResponse<{ transfer: TransferRecord }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ transfer: TransferRecord }>>(
    TRANSFER_ENDPOINTS.DETAIL.ROUTE(id)
  );
  return response.data;
};
