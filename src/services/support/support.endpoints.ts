export const SUPPORT_ENDPOINTS = {
  FAQS: {
    ROUTE: '/api/support/faqs',
    QUERY_KEY: ['support', 'faqs'] as const,
  },
  ABOUT: {
    ROUTE: '/api/support/about',
    QUERY_KEY: ['support', 'about'] as const,
  },
  CONTACT: {
    ROUTE: '/api/support/contact',
    QUERY_KEY: ['support', 'contact'] as const,
  },
  CHAT: {
    ROUTE: '/api/support/chat',
    QUERY_KEY: ['support', 'chat'] as const,
  },
} as const;
