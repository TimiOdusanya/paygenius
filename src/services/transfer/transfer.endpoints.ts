export const TRANSFER_ENDPOINTS = {
  LOOKUP: {
    ROUTE: '/api/transfers/lookup',
    QUERY_KEY: ['transfers', 'lookup'] as const,
  },
  RESOLVE: {
    ROUTE: '/api/transfers/resolve',
    QUERY_KEY: ['transfers', 'resolve'] as const,
  },
  BENEFICIARIES: {
    ROUTE: '/api/transfers/beneficiaries',
    QUERY_KEY: ['transfers', 'beneficiaries'] as const,
  },
  SEND: {
    ROUTE: '/api/transfers',
    MUTATION_KEY: ['transfers', 'send'] as const,
  },
  DETAIL: {
    ROUTE: (id: string) => `/api/transfers/${id}`,
    QUERY_KEY: (id: string) => ['transfers', 'detail', id] as const,
  },
} as const;
