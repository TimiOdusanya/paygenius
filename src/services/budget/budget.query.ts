import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { BUDGET_ENDPOINTS } from './budget.endpoints';
import { getBudgetsAPI, createBudgetAPI } from './budget.api';
import type {
  ApiResponse,
  BudgetListResponse,
  CreateBudgetResponse,
  CreateBudgetPayload,
} from './budget.type';

export function useGetBudgetsQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<BudgetListResponse>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: BUDGET_ENDPOINTS.LIST.QUERY_KEY,
    queryFn: getBudgetsAPI,
    ...options,
  });
}

export function useCreateBudgetMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CreateBudgetResponse>,
      AxiosError<unknown>,
      CreateBudgetPayload
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationKey: BUDGET_ENDPOINTS.CREATE.MUTATION_KEY,
    mutationFn: createBudgetAPI,
    ...options,
  });
}
