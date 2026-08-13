import type { PaymentSource } from '@/services/bills/bills.type';

export type TransferRail = 'PAYGENIUS' | 'BANK';
export type { PaymentSource };

export type TransferUser = {
  _id: string;
  name: string;
  handle?: string;
  profilePicture?: string;
  avatarColor?: string;
  rail: 'PAYGENIUS';
  accountNumber?: string;
};

export type TransferBeneficiary = {
  _id: string;
  rail: TransferRail;
  name: string;
  handle?: string;
  recipientUserId?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  avatarColor?: string;
};

export type ResolvedTransferAccount = {
  rail: TransferRail;
  recipientUserId?: string;
  name: string;
  handle?: string;
  accountNumber: string;
  bankCode?: string;
  bankName?: string;
};

export type TransferRecord = {
  _id: string;
  reference: string;
  amount: number;
  status: string;
  rail?: TransferRail;
  recipientName?: string;
  recipientHandle?: string;
  recipientAccount?: string;
  bankName?: string;
  source?: PaymentSource;
  sourceLabel?: string;
  note?: string;
  createdAt: string;
};

export type TransferDraft = {
  rail: TransferRail;
  amount: number;
  note?: string;
  recipientUserId?: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  bankName?: string;
  bankLogo?: string;
  paymentSource: PaymentSource;
  budgetId?: string;
  budgetName?: string;
  saveBeneficiary?: boolean;
};

export type SendTransferPayload = TransferDraft & {
  pin?: string;
  useBiometric?: boolean;
};
