export const VERIFY_ENDPOINTS = {
  BANKS: {
    ROUTE: '/api/verify/banks',
    QUERY_KEY: ['verify', 'banks'] as const,
  },
  ACCOUNT: {
    ROUTE: '/api/verify/account',
    QUERY_KEY: (accountNumber: string, bankCode: string) =>
      ['verify', 'account', accountNumber, bankCode] as const,
  },
  CARD_BIN: {
    ROUTE: (bin: string) => `/api/verify/card-bin/${bin}`,
    QUERY_KEY: (bin: string) => ['verify', 'card-bin', bin] as const,
  },
} as const;
