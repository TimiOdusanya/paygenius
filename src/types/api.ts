/**
 * Types aligned with paygenius-backend (src/types/index.ts).
 * Use these for API requests/responses.
 */

export interface User {
  _id: string;
  phoneNumber: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  address?: Address;
  identityVerification?: IdentityVerification;
  selfieImages?: string[];
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  isIdentityVerified: boolean;
  isAddressVerified: boolean;
  isBiometricSetup: boolean;
  setTransactionPin?: boolean;
  biometricEnabled: boolean;
  wallet?: Wallet;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  houseNumber: string;
  streetName: string;
  city: string;
  state: string;
  localGovernmentArea: string;
}

export interface IdentityVerification {
  type: 'BVN' | 'NIN';
  number: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface Wallet {
  _id: string;
  userId: string;
  totalBalance: number;
  availableBalance: number;
  virtualAccountNumber: string;
  bankName: string;
  accountName: string;
  paystackCustomerId: string;
  paystackDedicatedAccountId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Account {
  _id: string;
  userId: string;
  accountNumber: string;
  accountType: 'WALLET' | 'SAVINGS' | 'CURRENT';
  balance: number;
  currency: 'NGN' | 'USD';
  isActive: boolean;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  _id: string;
  userId: string;
  accountId: string;
  name: string;
  category: string;
  totalAmount: number;
  spentAmount: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  backgroundColor?: string;
  progressColor?: string;
  isActive: boolean;
  progress?: number;
  remainingAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  accountId: string;
  budgetId?: string;
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER';
  category: string;
  subCategory?: string;
  merchant?: string;
  description?: string;
  amount: number;
  currency: 'NGN' | 'USD';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'WALLET' | 'BILL_PAYMENT' | 'OTHER';
  reference?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthData {
  user: User;
  token: string;
  refreshToken?: string;
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
