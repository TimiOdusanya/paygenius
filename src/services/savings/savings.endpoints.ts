export const SAVINGS_ENDPOINTS = {
  LIST: {
    ROUTE: '/api/savings/',
    QUERY_KEY: ['savings', 'list'],
  },
  CREATE: {
    ROUTE: '/api/savings/',
    MUTATION_KEY: ['savings', 'create'],
  },
  DETAIL: {
    ROUTE: (id: string) => `/api/savings/${id}`,
    QUERY_KEY: (id: string) => ['savings', 'detail', id],
  },
  UPDATE: {
    ROUTE: (id: string) => `/api/savings/${id}`,
    MUTATION_KEY: ['savings', 'update'],
  },
  CARDS: {
    ROUTE: '/api/savings/cards',
    QUERY_KEY: ['savings', 'cards'],
    MUTATION_KEY: ['savings', 'cards', 'create'],
  },
  DELETE_CARD: {
    ROUTE: (id: string) => `/api/savings/cards/${id}`,
    MUTATION_KEY: ['savings', 'cards', 'delete'],
  },
} as const;
