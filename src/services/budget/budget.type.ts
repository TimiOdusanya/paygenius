import type { Budget } from '@/types';

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
