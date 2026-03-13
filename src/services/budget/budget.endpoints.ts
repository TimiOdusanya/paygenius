export const BUDGET_ENDPOINTS = {
  LIST: {
    ROUTE: '/api/budget/',
    QUERY_KEY: ['budget', 'list'],
  },
  CREATE: {
    ROUTE: '/api/budget/',
    MUTATION_KEY: ['budget', 'create'],
  },
} as const;
