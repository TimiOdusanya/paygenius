import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { HOME_ENDPOINTS } from './home.endpoints';
import {
  getDashboardAPI,
  getExpenseAnalyticsAPI,
  getMonthTransactionsAPI,
} from './home.api';
import type {
  ExpenseAnalyticsData,
  HomeDashboardData,
  MonthTransactionsData,
} from './home.type';

export function useGetDashboardQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<HomeDashboardData>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: HOME_ENDPOINTS.DASHBOARD.QUERY_KEY,
    queryFn: getDashboardAPI,
    ...options,
  });
}

export function useGetMonthTransactionsQuery(month: number, year: number) {
  return useQuery<ApiResponse<MonthTransactionsData>, AxiosError<unknown>>({
    queryKey: [...HOME_ENDPOINTS.TRANSACTIONS.QUERY_KEY, month, year],
    queryFn: () => getMonthTransactionsAPI(month, year),
  });
}

export function useGetExpenseAnalyticsQuery(month: number, year: number) {
  return useQuery<ApiResponse<ExpenseAnalyticsData>, AxiosError<unknown>>({
    queryKey: [...HOME_ENDPOINTS.ANALYTICS.QUERY_KEY, month, year],
    queryFn: () => getExpenseAnalyticsAPI(month, year),
  });
}
