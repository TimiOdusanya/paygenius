import type { Wallet } from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface WalletResponse {
  wallet: Wallet;
}
