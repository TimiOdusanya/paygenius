import { paygeniusAPI } from '../api/http';
import { GENIE_ENDPOINTS } from './genie.endpoints';
import type { ApiResponse } from '@/types';
import type {
  GenieChat,
  GenieChatPreview,
  GenieMessagePayload,
  GenieProfile,
} from './genie.type';

export const getGenieProfileAPI = async (): Promise<
  ApiResponse<{ profile: GenieProfile | null; onboardingCompleted: boolean }>
> => {
  const response = await paygeniusAPI.get(GENIE_ENDPOINTS.PROFILE.ROUTE);
  return response.data;
};

export const saveGenieProfileAPI = async (
  payload: Partial<GenieProfile>
): Promise<ApiResponse<{ profile: GenieProfile; onboardingCompleted: boolean }>> => {
  const response = await paygeniusAPI.put(GENIE_ENDPOINTS.PROFILE.ROUTE, payload);
  return response.data;
};

export const listGenieChatsAPI = async (): Promise<
  ApiResponse<{ chats: GenieChatPreview[] }>
> => {
  const response = await paygeniusAPI.get(GENIE_ENDPOINTS.CHATS.ROUTE);
  return response.data;
};

export const getGenieChatAPI = async (
  id: string
): Promise<ApiResponse<{ chat: GenieChat | null }>> => {
  const response = await paygeniusAPI.get(GENIE_ENDPOINTS.CHAT.ROUTE(id));
  return response.data;
};

export const createGenieChatAPI = async (): Promise<
  ApiResponse<{ chat: GenieChat }>
> => {
  const response = await paygeniusAPI.post(GENIE_ENDPOINTS.CHATS.ROUTE);
  return response.data;
};

export const sendGenieMessageAPI = async (
  chatId: string,
  payload: GenieMessagePayload
): Promise<ApiResponse<{ chat: GenieChat }>> => {
  const response = await paygeniusAPI.post(
    GENIE_ENDPOINTS.MESSAGE.ROUTE(chatId),
    payload,
    { timeout: 60000 }
  );
  return response.data;
};
