export const SETTINGS_ENDPOINTS = {
  GET: {
    ROUTE: '/api/settings',
    QUERY_KEY: ['settings'] as const,
  },
  CHANGE_PASSWORD: {
    ROUTE: '/api/settings/change-password',
    MUTATION_KEY: ['settings', 'change-password'] as const,
  },
  CHANGE_PIN: {
    ROUTE: '/api/settings/change-pin',
    MUTATION_KEY: ['settings', 'change-pin'] as const,
  },
  BIOMETRIC: {
    ROUTE: '/api/settings/biometric',
    MUTATION_KEY: ['settings', 'biometric'] as const,
  },
  ACCOUNT: {
    ROUTE: '/api/settings/account',
    MUTATION_KEY: ['settings', 'delete-account'] as const,
  },
  DEACTIVATE: {
    ROUTE: '/api/settings/account/deactivate',
    MUTATION_KEY: ['settings', 'deactivate-account'] as const,
  },
  REFERRALS: {
    ROUTE: '/api/settings/referrals',
    QUERY_KEY: ['settings', 'referrals'] as const,
  },
  RATE: {
    ROUTE: '/api/settings/rate',
    MUTATION_KEY: ['settings', 'rate'] as const,
  },
} as const;
