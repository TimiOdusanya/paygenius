import { paygeniusAPI } from '../api/http';
import { SAVINGS_ENDPOINTS } from './savings.endpoints';
import type { ApiResponse } from '@/types';
import type {
  AddCardPayload,
  CreateGoalPayload,
  LinkedCard,
  SavingsGoal,
  SavingsListResponse,
} from './savings.type';

export const getSavingsGoalsAPI = async (): Promise<
  ApiResponse<SavingsListResponse>
> => {
  const response = await paygeniusAPI.get<ApiResponse<SavingsListResponse>>(
    SAVINGS_ENDPOINTS.LIST.ROUTE
  );
  return response.data;
};

export const getSavingsGoalAPI = async (
  id: string
): Promise<ApiResponse<{ goal: SavingsGoal }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ goal: SavingsGoal }>>(
    SAVINGS_ENDPOINTS.DETAIL.ROUTE(id)
  );
  return response.data;
};

export const createSavingsGoalAPI = async (
  data: CreateGoalPayload
): Promise<ApiResponse<{ goal: SavingsGoal }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ goal: SavingsGoal }>>(
    SAVINGS_ENDPOINTS.CREATE.ROUTE,
    data
  );
  return response.data;
};

export const updateSavingsGoalAPI = async (
  id: string,
  data: { description?: string }
): Promise<ApiResponse<{ goal: SavingsGoal }>> => {
  const response = await paygeniusAPI.patch<ApiResponse<{ goal: SavingsGoal }>>(
    SAVINGS_ENDPOINTS.UPDATE.ROUTE(id),
    data
  );
  return response.data;
};

export const getLinkedCardsAPI = async (): Promise<
  ApiResponse<{ cards: LinkedCard[] }>
> => {
  const response = await paygeniusAPI.get<ApiResponse<{ cards: LinkedCard[] }>>(
    SAVINGS_ENDPOINTS.CARDS.ROUTE
  );
  return response.data;
};

export const addLinkedCardAPI = async (
  data: AddCardPayload
): Promise<ApiResponse<{ card: LinkedCard }>> => {
  const response = await paygeniusAPI.post<ApiResponse<{ card: LinkedCard }>>(
    SAVINGS_ENDPOINTS.CARDS.ROUTE,
    data
  );
  return response.data;
};

export const deleteLinkedCardAPI = async (
  id: string
): Promise<ApiResponse<{ card: LinkedCard }>> => {
  const response = await paygeniusAPI.delete<ApiResponse<{ card: LinkedCard }>>(
    SAVINGS_ENDPOINTS.DELETE_CARD.ROUTE(id)
  );
  return response.data;
};
