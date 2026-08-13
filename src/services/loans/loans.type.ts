export type LoanHealth = 'HEALTHY' | 'UNHEALTHY';
export type LoanFrequency = 'WEEK' | 'MONTH';

export type LoanProvider = {
  code: string;
  name: string;
};

export type Loan = {
  _id: string;
  userId: string;
  providerName: string;
  providerCode: string;
  accountName: string;
  accountLast4: string;
  principalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string;
  automate: boolean;
  repaymentFrequency?: LoanFrequency;
  reminderEnabled: boolean;
  isActive: boolean;
  progress: number;
  health: LoanHealth;
  createdAt?: string;
  updatedAt?: string;
};

export type LoansListResponse = {
  loans: Loan[];
  totalOutstanding: number;
};

export type LinkLoanPayload = {
  providerCode: string;
  providerName: string;
  accountName: string;
  accountNumber: string;
  bvn: string;
};

export type UpdateLoanPayload = {
  automate?: boolean;
  repaymentFrequency?: LoanFrequency | null;
  reminderEnabled?: boolean;
};
