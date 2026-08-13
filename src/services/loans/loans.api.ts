import { paygeniusAPI } from '../api/http';
import { LOAN_ENDPOINTS } from './loans.endpoints';
import type { ApiResponse } from '@/types';
import type {
  LinkLoanPayload,
  Loan,
  LoanProvider,
  LoansListResponse,
  UpdateLoanPayload,
} from './loans.type';

export const getLoansAPI = async (): Promise<ApiResponse<LoansListResponse>> => {
  const response = await paygeniusAPI.get<ApiResponse<LoansListResponse>>(
    LOAN_ENDPOINTS.LIST.ROUTE
  );
  return response.data;
};

export const getLoanProvidersAPI = async (
  q?: string
): Promise<ApiResponse<{ providers: LoanProvider[] }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ providers: LoanProvider[] }>>(
    LOAN_ENDPOINTS.PROVIDERS.ROUTE,
    { params: q ? { q } : undefined }
  );
  return response.data;
};

export const getLoanAPI = async (
  id: string
): Promise<ApiResponse<{ loan: Loan }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ loan: Loan }>>(
    LOAN_ENDPOINTS.DETAIL.ROUTE(id)
  );
  return response.data;
};

export const linkLoanAPI = async (
  data: LinkLoanPayload
): Promise<ApiResponse<{ loan: Loan }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ loan: Loan }>>(
    LOAN_ENDPOINTS.CREATE.ROUTE,
    data
  );
  return response.data;
};

export const updateLoanAPI = async (
  id: string,
  data: UpdateLoanPayload
): Promise<ApiResponse<{ loan: Loan }>> => {
  const response = await paygeniusAPI.patch<ApiResponse<{ loan: Loan }>>(
    LOAN_ENDPOINTS.UPDATE.ROUTE(id),
    data
  );
  return response.data;
};
