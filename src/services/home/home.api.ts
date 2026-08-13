import { paygeniusAPI } from '../api/http';
import { HOME_ENDPOINTS } from './home.endpoints';
import type { ApiResponse } from '@/types';
import type {
  ExpenseAnalyticsData,
  HomeDashboardData,
  MonthTransactionsData,
} from './home.type';

export const getDashboardAPI = async (): Promise<
  ApiResponse<HomeDashboardData>
> => {
  const response = await paygeniusAPI.get<ApiResponse<HomeDashboardData>>(
    HOME_ENDPOINTS.DASHBOARD.ROUTE
  );
  return response.data;
};

export const getMonthTransactionsAPI = async (
  month: number,
  year: number
): Promise<ApiResponse<MonthTransactionsData>> => {
  const response = await paygeniusAPI.get<ApiResponse<MonthTransactionsData>>(
    HOME_ENDPOINTS.TRANSACTIONS.ROUTE,
    { params: { month, year } }
  );
  return response.data;
};

export const getExpenseAnalyticsAPI = async (
  month: number,
  year: number
): Promise<ApiResponse<ExpenseAnalyticsData>> => {
  const response = await paygeniusAPI.get<ApiResponse<ExpenseAnalyticsData>>(
    HOME_ENDPOINTS.ANALYTICS.ROUTE,
    { params: { month, year } }
  );
  return response.data;
};
