/**
 * Chat list + send are isolated here so the upcoming
 * get-chats / send-chat endpoints can replace these routes only.
 */
export const GENIE_ENDPOINTS = {
  PROFILE: {
    ROUTE: '/api/genie/profile',
    QUERY_KEY: ['genie', 'profile'],
    MUTATION_KEY: ['genie', 'profile', 'save'],
  },
  CHATS: {
    ROUTE: '/api/genie/chats',
    QUERY_KEY: ['genie', 'chats'],
  },
  CHAT: {
    ROUTE: (id: string) => `/api/genie/chats/${id}`,
    QUERY_KEY: (id: string) => ['genie', 'chat', id],
  },
  MESSAGE: {
    ROUTE: (id: string) => `/api/genie/chats/${id}/messages`,
    MUTATION_KEY: ['genie', 'message'],
  },
} as const;
