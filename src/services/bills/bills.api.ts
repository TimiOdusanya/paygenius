import { paygeniusAPI } from '../api/http';
import { BILL_ENDPOINTS } from './bills.endpoints';
import type { ApiResponse } from '@/types';
import type {
  Biller,
  BillCategory,
  BillPayment,
  DataPlan,
  PayBillPayload,
  ValidateCustomerPayload,
  ValidateCustomerResult,
} from './bills.type';

export const getBillersAPI = async (
  category?: BillCategory
): Promise<ApiResponse<{ billers: Biller[] }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ billers: Biller[] }>>(
    BILL_ENDPOINTS.BILLERS.ROUTE,
    { params: category ? { category } : undefined }
  );
  return response.data;
};

export const getDataPlansAPI = async (
  billerCode?: string
): Promise<ApiResponse<{ plans: DataPlan[] }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ plans: DataPlan[] }>>(
    BILL_ENDPOINTS.PLANS.ROUTE,
    { params: billerCode ? { billerCode } : undefined }
  );
  return response.data;
};

export const validateBillCustomerAPI = async (
  data: ValidateCustomerPayload
): Promise<ApiResponse<ValidateCustomerResult>> => {
  const response = await paygeniusAPI.post<ApiResponse<ValidateCustomerResult>>(
    BILL_ENDPOINTS.VALIDATE.ROUTE,
    data
  );
  return response.data;
};

export const payBillAPI = async (
  data: PayBillPayload
): Promise<ApiResponse<{ payment: BillPayment }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ payment: BillPayment }>>(
    BILL_ENDPOINTS.PAY.ROUTE,
    data
  );
  return response.data;
};

export const getBillPaymentAPI = async (
  id: string
): Promise<ApiResponse<{ payment: BillPayment }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ payment: BillPayment }>>(
    BILL_ENDPOINTS.DETAIL.ROUTE(id)
  );
  return response.data;
};
