export const AUTH_ENDPOINTS = {
  SEND_VERIFICATION: {
    ROUTE: '/api/auth/send-verification',
    MUTATION_KEY: ['auth', 'send-verification'],
  },
  VERIFY_PHONE: {
    ROUTE: '/api/auth/verify-phone',
    MUTATION_KEY: ['auth', 'verify-phone'],
  },
  REGISTER: {
    ROUTE: '/api/auth/register',
    MUTATION_KEY: ['auth', 'register'],
  },
  LOGIN: {
    ROUTE: '/api/auth/login',
    MUTATION_KEY: ['auth', 'login'],
  },
  LOGIN_BIOMETRIC: {
    ROUTE: '/api/auth/login-biometric',
    MUTATION_KEY: ['auth', 'login-biometric'],
  },
  GOOGLE: {
    ROUTE: '/api/auth/google',
    MUTATION_KEY: ['auth', 'google'],
  },
  GOOGLE_CODE: {
    ROUTE: '/api/auth/google-code',
    MUTATION_KEY: ['auth', 'google-code'],
  },
  APPLE: {
    ROUTE: '/api/auth/apple',
    MUTATION_KEY: ['auth', 'apple'],
  },
  ME: {
    ROUTE: '/api/auth/me',
    QUERY_KEY: ['auth', 'me'],
  },
} as const;
