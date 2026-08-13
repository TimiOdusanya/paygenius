export const NOTIFICATION_ENDPOINTS = {
  LIST: {
    ROUTE: '/api/notifications',
    QUERY_KEY: ['notifications', 'list'] as const,
  },
  UNREAD: {
    ROUTE: '/api/notifications/unread-count',
    QUERY_KEY: ['notifications', 'unread'] as const,
  },
  PREFERENCES: {
    ROUTE: '/api/notifications/preferences',
    QUERY_KEY: ['notifications', 'preferences'] as const,
  },
  READ: {
    ROUTE: (id: string) => `/api/notifications/${id}/read`,
    MUTATION_KEY: ['notifications', 'read'] as const,
  },
  READ_ALL: {
    ROUTE: '/api/notifications/read-all',
    MUTATION_KEY: ['notifications', 'read-all'] as const,
  },
  DELETE: {
    ROUTE: (id: string) => `/api/notifications/${id}`,
    MUTATION_KEY: ['notifications', 'delete'] as const,
  },
  DEVICES: {
    ROUTE: '/api/notifications/devices',
    MUTATION_KEY: ['notifications', 'devices'] as const,
  },
} as const;
