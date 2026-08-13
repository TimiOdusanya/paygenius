export const LOAN_ENDPOINTS = {
  LIST: {
    ROUTE: '/api/loans/',
    QUERY_KEY: ['loans', 'list'],
  },
  PROVIDERS: {
    ROUTE: '/api/loans/providers',
    QUERY_KEY: ['loans', 'providers'],
  },
  CREATE: {
    ROUTE: '/api/loans/',
    MUTATION_KEY: ['loans', 'create'],
  },
  DETAIL: {
    ROUTE: (id: string) => `/api/loans/${id}`,
    QUERY_KEY: (id: string) => ['loans', 'detail', id],
  },
  UPDATE: {
    ROUTE: (id: string) => `/api/loans/${id}`,
    MUTATION_KEY: ['loans', 'update'],
  },
} as const;
