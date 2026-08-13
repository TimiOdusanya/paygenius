import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { SAVINGS_ENDPOINTS } from './savings.endpoints';
import {
  addLinkedCardAPI,
  createSavingsGoalAPI,
  deleteLinkedCardAPI,
  getLinkedCardsAPI,
  getSavingsGoalAPI,
  getSavingsGoalsAPI,
  updateSavingsGoalAPI,
} from './savings.api';
import type {
  AddCardPayload,
  CreateGoalPayload,
  LinkedCard,
  SavingsGoal,
  SavingsListResponse,
} from './savings.type';

export function useGetSavingsGoalsQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<SavingsListResponse>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: SAVINGS_ENDPOINTS.LIST.QUERY_KEY,
    queryFn: getSavingsGoalsAPI,
    ...options,
  });
}

export function useGetSavingsGoalQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ goal: SavingsGoal }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: SAVINGS_ENDPOINTS.DETAIL.QUERY_KEY(id),
    queryFn: () => getSavingsGoalAPI(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateSavingsGoalMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ goal: SavingsGoal }>,
      AxiosError<unknown>,
      CreateGoalPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: SAVINGS_ENDPOINTS.CREATE.MUTATION_KEY,
    mutationFn: createSavingsGoalAPI,
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_ENDPOINTS.LIST.QUERY_KEY });
      onSuccess?.(...args);
    },
  });
}

export function useUpdateSavingsGoalMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ goal: SavingsGoal }>,
      AxiosError<unknown>,
      { id: string; description?: string }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: SAVINGS_ENDPOINTS.UPDATE.MUTATION_KEY,
    mutationFn: ({ id, description }) => updateSavingsGoalAPI(id, { description }),
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_ENDPOINTS.LIST.QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: SAVINGS_ENDPOINTS.DETAIL.QUERY_KEY(args[1].id),
      });
      onSuccess?.(...args);
    },
  });
}

export function useGetLinkedCardsQuery(
  options?: Omit<
    UseQueryOptions<ApiResponse<{ cards: LinkedCard[] }>, AxiosError<unknown>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: SAVINGS_ENDPOINTS.CARDS.QUERY_KEY,
    queryFn: getLinkedCardsAPI,
    ...options,
  });
}

export function useAddLinkedCardMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ card: LinkedCard }>,
      AxiosError<unknown>,
      AddCardPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: SAVINGS_ENDPOINTS.CARDS.MUTATION_KEY,
    mutationFn: addLinkedCardAPI,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_ENDPOINTS.CARDS.QUERY_KEY });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useDeleteLinkedCardMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ card: LinkedCard }>,
      AxiosError<unknown>,
      string
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation({
    mutationKey: SAVINGS_ENDPOINTS.DELETE_CARD.MUTATION_KEY,
    mutationFn: deleteLinkedCardAPI,
    ...rest,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_ENDPOINTS.CARDS.QUERY_KEY });
      onSuccess?.(...args);
    },
  });
}
