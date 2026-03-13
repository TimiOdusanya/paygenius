import type { Budget } from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type CreateBudgetPayload = {
  name: string;
  category: string;
  totalAmount: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  accountId: string;
};

export interface BudgetListResponse {
  budgets: Budget[];
}

export interface CreateBudgetResponse {
  budget: Budget;
}
