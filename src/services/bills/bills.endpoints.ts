export const BILL_ENDPOINTS = {
  BILLERS: {
    ROUTE: '/api/bills/billers',
    QUERY_KEY: ['bills', 'billers'] as const,
  },
  PLANS: {
    ROUTE: '/api/bills/plans',
    QUERY_KEY: ['bills', 'plans'] as const,
  },
  VALIDATE: {
    ROUTE: '/api/bills/validate',
    MUTATION_KEY: ['bills', 'validate'] as const,
  },
  PAY: {
    ROUTE: '/api/bills/pay',
    MUTATION_KEY: ['bills', 'pay'] as const,
  },
  DETAIL: {
    ROUTE: (id: string) => `/api/bills/${id}`,
    QUERY_KEY: (id: string) => ['bills', 'detail', id] as const,
  },
} as const;
