import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { GENIE_ENDPOINTS } from './genie.endpoints';
import {
  createGenieChatAPI,
  getGenieChatAPI,
  getGenieProfileAPI,
  listGenieChatsAPI,
  saveGenieProfileAPI,
  sendGenieMessageAPI,
} from './genie.api';
import type { GenieMessagePayload, GenieProfile } from './genie.type';
import { useAuthStore } from '@/stores';

export function useGetGenieProfileQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: GENIE_ENDPOINTS.PROFILE.QUERY_KEY,
    queryFn: getGenieProfileAPI,
    enabled: !!token,
  });
}

export function useSaveGenieProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: GENIE_ENDPOINTS.PROFILE.MUTATION_KEY,
    mutationFn: (payload: Partial<GenieProfile>) => saveGenieProfileAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GENIE_ENDPOINTS.PROFILE.QUERY_KEY });
    },
  });
}

export function useListGenieChatsQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: GENIE_ENDPOINTS.CHATS.QUERY_KEY,
    queryFn: listGenieChatsAPI,
    enabled: !!token,
  });
}

export function useGetGenieChatQuery(id: string | null) {
  return useQuery({
    queryKey: GENIE_ENDPOINTS.CHAT.QUERY_KEY(id || 'none'),
    queryFn: () => getGenieChatAPI(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateGenieChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGenieChatAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GENIE_ENDPOINTS.CHATS.QUERY_KEY });
    },
  });
}

export function useSendGenieMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: GENIE_ENDPOINTS.MESSAGE.MUTATION_KEY,
    mutationFn: async ({
      chatId,
      ...payload
    }: GenieMessagePayload & { chatId: string | null }) => {
      let id = chatId;
      if (!id) {
        const created = await createGenieChatAPI();
        id = created.data?.chat?._id ?? null;
        if (!id) throw new Error('Could not start a chat');
      }
      const sent = await sendGenieMessageAPI(id, payload);
      return { ...sent, chatId: id };
    },
    onSuccess: (data) => {
      const id = data.data?.chat?._id || data.chatId;
      if (id) {
        queryClient.setQueryData(GENIE_ENDPOINTS.CHAT.QUERY_KEY(id), {
          success: data.success,
          message: data.message,
          data: { chat: data.data?.chat },
        });
      }
      queryClient.invalidateQueries({ queryKey: GENIE_ENDPOINTS.CHATS.QUERY_KEY });
    },
  });
}
