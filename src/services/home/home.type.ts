import type { Account, Budget, Transaction } from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface HomeDashboardData {
  account: Account;
  budgets: Budget[];
  recentTransactions: Transaction[];
  summary?: {
    totalIncome: number;
    totalExpenses: number;
    monthlySpending: number;
  };
}
