import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { HOME_ENDPOINTS } from './home.endpoints';
import { getDashboardAPI } from './home.api';
import type { HomeDashboardData } from './home.type';

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
