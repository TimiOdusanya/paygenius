/**
 * API client for PayGenius backend.
 * Base URL: set via EXPO_PUBLIC_API_URL or default for Expo Go.
 */
import type {
  ApiResponse,
  AuthData,
  User,
  HomeDashboardData,
  Wallet,
  Budget,
  Address,
} from '../types';

interface ProfileSetupData {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  profilePicture?: string;
}

interface CreateBudgetBody {
  name: string;
  category: string;
  totalAmount: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  accountId: string;
}

const getBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Expo Go: use your machine's IP and backend port (e.g. 5000)
  return 'http://localhost:5000';
};

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;
  const base = getBaseUrl().replace(/\/$/, '');
  const url = params
    ? `${base}${path}?${new URLSearchParams(params).toString()}`
    : `${base}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) ?? {}),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  if (!res.ok) {
    throw new Error(json.message ?? json.error ?? `HTTP ${res.status}`);
  }
  return json;
}

// Typed API methods (align with backend routes)
export const api = {
  health: () => request<{ message: string }>('/health'),

  auth: {
    sendVerification: (body: { phoneNumber: string }) =>
      request('/api/auth/send-verification', { method: 'POST', body: JSON.stringify(body) }),
    verifyPhone: (body: { phoneNumber: string; code: string }) =>
      request('/api/auth/verify-phone', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: { phoneNumber: string; password: string }) =>
      request<{ data: AuthData }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { phoneNumber: string; password: string }) =>
      request<{ data: AuthData }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    loginBiometric: (body: { phoneNumber: string }) =>
      request<{ data: AuthData }>('/api/auth/login-biometric', { method: 'POST', body: JSON.stringify(body) }),
    google: (body: { idToken: string }) =>
      request<{ data: AuthData }>('/api/auth/google', { method: 'POST', body: JSON.stringify(body) }),
    googleCode: (body: { code: string }) =>
      request<{ data: AuthData }>('/api/auth/google-code', { method: 'POST', body: JSON.stringify(body) }),
    apple: (body: { identityToken: string; fullName?: string }) =>
      request<{ data: AuthData }>('/api/auth/apple', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request<{ data: { user: User } }>('/api/auth/me'),
  },

  home: {
    dashboard: () =>
      request<{ data: HomeDashboardData }>('/api/home/dashboard'),
  },

  profile: {
    get: () => request<{ data: { user: User } }>('/api/profile/'),
    setup: (body: ProfileSetupData) =>
      request<{ data: { user: User } }>('/api/profile/setup', { method: 'POST', body: JSON.stringify(body) }),
    verifyAddress: (body: Address) =>
      request('/api/profile/verify-address', { method: 'POST', body: JSON.stringify(body) }),
    verifyIdentity: (body: { type: 'BVN' | 'NIN'; number: string; phoneNumber: string }) =>
      request('/api/profile/verify-identity', { method: 'POST', body: JSON.stringify(body) }),
    uploadSelfie: (body: { selfieImages: string[] }) =>
      request('/api/profile/upload-selfie', { method: 'POST', body: JSON.stringify(body) }),
    setupPin: (body: { pin: string; confirmPin: string }) =>
      request('/api/profile/setup-pin', { method: 'POST', body: JSON.stringify(body) }),
    enableBiometric: () =>
      request('/api/profile/enable-biometric', { method: 'POST' }),
  },

  budget: {
    list: () => request<{ data: { budgets: Budget[] } }>('/api/budget/'),
    create: (body: CreateBudgetBody) =>
      request<{ data: { budget: Budget } }>('/api/budget/', { method: 'POST', body: JSON.stringify(body) }),
  },

  wallet: {
    get: () => request<{ data: { wallet: Wallet } }>('/api/wallet/'),
  },
};
