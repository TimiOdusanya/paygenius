import type { Account, Budget, Transaction } from '@/types';

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

export interface MonthTransactionsData {
  transactions: Transaction[];
  total: number;
  month: number;
  year: number;
  amountIn: number;
  amountOut: number;
}

export interface ExpenseWeek {
  week: number;
  total: number;
  categories: Record<string, number>;
}

export interface ExpenseAnalyticsData {
  month: number;
  year: number;
  totalExpenses: number;
  previousMonthExpenses: number;
  changePercent: number;
  weeks: ExpenseWeek[];
  categories: { name: string; amount: number }[];
}
