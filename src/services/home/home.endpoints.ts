export const HOME_ENDPOINTS = {
  DASHBOARD: {
    ROUTE: '/api/home/dashboard',
    QUERY_KEY: ['home', 'dashboard'],
  },
  TRANSACTIONS: {
    ROUTE: '/api/home/transactions',
    QUERY_KEY: ['home', 'transactions'],
  },
  ANALYTICS: {
    ROUTE: '/api/home/analytics',
    QUERY_KEY: ['home', 'analytics'],
  },
} as const;
