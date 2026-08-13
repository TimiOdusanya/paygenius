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
import { BILL_ENDPOINTS } from './bills.endpoints';
import {
  getBillersAPI,
  getBillPaymentAPI,
  getDataPlansAPI,
  payBillAPI,
  validateBillCustomerAPI,
} from './bills.api';
import type {
  Biller,
  BillCategory,
  BillPayment,
  DataPlan,
  PayBillPayload,
  ValidateCustomerPayload,
  ValidateCustomerResult,
} from './bills.type';

export function useGetBillersQuery(
  category?: BillCategory,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ billers: Biller[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...BILL_ENDPOINTS.BILLERS.QUERY_KEY, category ?? ''],
    queryFn: () => getBillersAPI(category),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useGetDataPlansQuery(
  billerCode?: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ plans: DataPlan[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...BILL_ENDPOINTS.PLANS.QUERY_KEY, billerCode ?? ''],
    queryFn: () => getDataPlansAPI(billerCode),
    enabled: !!billerCode,
    ...options,
  });
}

export function useValidateBillCustomerMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ValidateCustomerResult>,
      AxiosError<unknown>,
      ValidateCustomerPayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: BILL_ENDPOINTS.VALIDATE.MUTATION_KEY,
    mutationFn: validateBillCustomerAPI,
    ...options,
  });
}

export function usePayBillMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ payment: BillPayment }>,
      AxiosError<unknown>,
      PayBillPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: BILL_ENDPOINTS.PAY.MUTATION_KEY,
    mutationFn: payBillAPI,
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: WALLET_ENDPOINTS.GET.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: HOME_ENDPOINTS.DASHBOARD.QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUDGET_ENDPOINTS.LIST.QUERY_KEY });
      onSuccess?.(...args);
    },
  });
}

export function useGetBillPaymentQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ payment: BillPayment }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: BILL_ENDPOINTS.DETAIL.QUERY_KEY(id),
    queryFn: () => getBillPaymentAPI(id),
    enabled: !!id,
    ...options,
  });
}
