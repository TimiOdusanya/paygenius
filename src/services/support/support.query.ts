import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SUPPORT_ENDPOINTS } from './support.endpoints';
import {
  getAboutAPI,
  getContactAPI,
  getFaqsAPI,
  getSupportChatAPI,
  sendSupportChatAPI,
} from './support.api';
import type { SupportTopic } from './support.type';
import { useAuthStore } from '@/stores';

export function useGetFaqsQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: SUPPORT_ENDPOINTS.FAQS.QUERY_KEY,
    queryFn: getFaqsAPI,
    staleTime: 30 * 60 * 1000,
    enabled: !!token,
  });
}

export function useGetAboutQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: SUPPORT_ENDPOINTS.ABOUT.QUERY_KEY,
    queryFn: getAboutAPI,
    staleTime: 30 * 60 * 1000,
    enabled: !!token,
  });
}

export function useGetContactQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: SUPPORT_ENDPOINTS.CONTACT.QUERY_KEY,
    queryFn: getContactAPI,
    staleTime: 30 * 60 * 1000,
    enabled: !!token,
  });
}

export function useGetSupportChatQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: SUPPORT_ENDPOINTS.CHAT.QUERY_KEY,
    queryFn: getSupportChatAPI,
    enabled: !!token,
  });
}

export function useSendSupportChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { body: string; topic?: SupportTopic }) =>
      sendSupportChatAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_ENDPOINTS.CHAT.QUERY_KEY });
    },
  });
}
