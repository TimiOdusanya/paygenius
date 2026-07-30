import { paygeniusAPI } from '../api/http';
import { HOME_ENDPOINTS } from './home.endpoints';
import type { ApiResponse } from '@/types';
import type { HomeDashboardData } from './home.type';

export const getDashboardAPI = async (): Promise<
  ApiResponse<HomeDashboardData>
> => {
  const response = await paygeniusAPI.get<ApiResponse<HomeDashboardData>>(
    HOME_ENDPOINTS.DASHBOARD.ROUTE
  );
  return response.data;
};
