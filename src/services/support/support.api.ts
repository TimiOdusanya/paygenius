import { paygeniusAPI } from '../api/http';
import type { ApiResponse } from '@/types';
import { SUPPORT_ENDPOINTS } from './support.endpoints';
import type { AboutInfo, FaqItem, SupportMessage, SupportTopic } from './support.type';

export const getFaqsAPI = async (): Promise<ApiResponse<{ faqs: FaqItem[] }>> => {
  const response = await paygeniusAPI.get<ApiResponse<{ faqs: FaqItem[] }>>(
    SUPPORT_ENDPOINTS.FAQS.ROUTE
  );
  return response.data;
};

export const getAboutAPI = async (): Promise<ApiResponse<AboutInfo>> => {
  const response = await paygeniusAPI.get<ApiResponse<AboutInfo>>(
    SUPPORT_ENDPOINTS.ABOUT.ROUTE
  );
  return response.data;
};

export const getContactAPI = async (): Promise<
  ApiResponse<{ email: string; phone: string }>
> => {
  const response = await paygeniusAPI.get<
    ApiResponse<{ email: string; phone: string }>
  >(SUPPORT_ENDPOINTS.CONTACT.ROUTE);
  return response.data;
};

export const getSupportChatAPI = async (): Promise<
  ApiResponse<{ messages: SupportMessage[] }>
> => {
  const response = await paygeniusAPI.get<ApiResponse<{ messages: SupportMessage[] }>>(
    SUPPORT_ENDPOINTS.CHAT.ROUTE
  );
  return response.data;
};

export const sendSupportChatAPI = async (payload: {
  body: string;
  topic?: SupportTopic;
}): Promise<
  ApiResponse<{ userMessage: SupportMessage; supportMessage: SupportMessage }>
> => {
  const response = await paygeniusAPI.post<
    ApiResponse<{ userMessage: SupportMessage; supportMessage: SupportMessage }>
  >(SUPPORT_ENDPOINTS.CHAT.ROUTE, payload);
  return response.data;
};
