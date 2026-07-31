export const PROFILE_ENDPOINTS = {
  GET: {
    ROUTE: '/api/profile/',
    QUERY_KEY: ['profile'],
  },
  CHECK_USERNAME: {
    ROUTE: '/api/profile/check-username',
    QUERY_KEY: ['profile', 'check-username'],
  },
  SETUP: {
    ROUTE: '/api/profile/setup',
    MUTATION_KEY: ['profile', 'setup'],
  },
  VERIFY_ADDRESS: {
    ROUTE: '/api/profile/verify-address',
    MUTATION_KEY: ['profile', 'verify-address'],
  },
  VERIFY_IDENTITY: {
    ROUTE: '/api/profile/verify-identity',
    MUTATION_KEY: ['profile', 'verify-identity'],
  },
  UPLOAD_SELFIE: {
    ROUTE: '/api/profile/upload-selfie',
    MUTATION_KEY: ['profile', 'upload-selfie'],
  },
  SETUP_PIN: {
    ROUTE: '/api/profile/setup-pin',
    MUTATION_KEY: ['profile', 'setup-pin'],
  },
  ENABLE_BIOMETRIC: {
    ROUTE: '/api/profile/enable-biometric',
    MUTATION_KEY: ['profile', 'enable-biometric'],
  },
} as const;
