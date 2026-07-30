import { paygeniusAPI } from '../api/http';
import { BUDGET_ENDPOINTS } from './budget.endpoints';
import type { ApiResponse } from '@/types';
import type {
  BudgetListResponse,
  CreateBudgetResponse,
  CreateBudgetPayload,
} from './budget.type';

export const getBudgetsAPI = async (): Promise<
  ApiResponse<BudgetListResponse>
> => {
  const response = await paygeniusAPI.get<ApiResponse<BudgetListResponse>>(
    BUDGET_ENDPOINTS.LIST.ROUTE
  );
  return response.data;
};

export const createBudgetAPI = async (
  data: CreateBudgetPayload
): Promise<ApiResponse<CreateBudgetResponse>> => {
  const response = await paygeniusAPI.post<ApiResponse<CreateBudgetResponse>>(
    BUDGET_ENDPOINTS.CREATE.ROUTE,
    data
  );
  return response.data;
};
