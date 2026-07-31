import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const getBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Fallback: use your Mac's LAN IP when env is missing
  return 'http://172.20.10.4:8000';
};

export const BASE_URL = getBaseUrl();

// Log the resolved base URL once at startup so you can confirm in Metro console
console.log('[API] Base URL:', BASE_URL);

export const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  // Request interceptor – attach token + log every outgoing call
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(
        `[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        config.data ? JSON.stringify(config.data) : ''
      );
      return config;
    },
    (error) => {
      console.log('[API →] Request error:', error.message);
      return Promise.reject(error);
    }
  );

  // Response interceptor – log every response or error
  client.interceptors.response.use(
    (res) => {
      console.log(`[API ←] ${res.status} ${res.config.url}`, res.data?.message ?? '');
      // Dev-only: log OTP code returned by backend when Twilio is not configured
      if (res.data?.devCode) {
        console.log(`[DEV OTP CODE] ${res.data.devCode}`);
      }
      return res;
    },
    (error) => {
      if (error.response) {
        const status = error.response.status;
        // Use console.log for expected client errors (4xx) so React Native LogBox
        // does not flash a red/yellow popup for normal validation failures.
        const log =
          status >= 500 ? console.error : console.log;
        log(
          `[API ✗] ${status} ${error.config?.url}`,
          error.response.data?.message ?? error.message
        );
        if (status === 401) {
          useAuthStore.getState().clearAuth();
        }
      } else if (error.request) {
        console.log('[API ✗] No response received – is the backend running?', error.message);
      } else {
        console.log('[API ✗] Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const paygeniusAPI = createApiClient(BASE_URL);
