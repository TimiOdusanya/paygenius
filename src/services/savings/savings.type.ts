export type SavingType = 'ONE_TIME' | 'RECURRING';
export type SavingFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type SavingSource = 'PAYGENIUS' | 'LINKED_ACCOUNT';
export type SavingAccent = 'navy' | 'green';

export type SavingsGoal = {
  _id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  targetDate?: string;
  savingType: SavingType;
  frequency?: SavingFrequency;
  installmentAmount: number;
  maturityDate?: string;
  sourceType: SavingSource;
  linkedAccountId?: string;
  shareSlug: string;
  accent: SavingAccent;
  isActive: boolean;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
};

export type LinkedCard = {
  _id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  last4: string;
  brand: string;
  bankCode?: string;
  bankName?: string;
  expiryMonth: string;
  expiryYear: string;
};

export type CreateGoalPayload = {
  name: string;
  targetAmount: number;
  description?: string;
  targetDate?: string;
  savingType: SavingType;
  frequency?: SavingFrequency;
  installmentAmount: number;
  maturityDate?: string;
  sourceType: SavingSource;
  linkedAccountId?: string;
};

export type AddCardPayload = {
  accountName?: string;
  accountNumber: string;
  bankCode: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
};

export type SavingsListResponse = {
  goals: SavingsGoal[];
  totalBalance: number;
};

export type SaveGoalDraft = CreateGoalPayload;
