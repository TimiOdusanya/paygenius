export type BillCategory = 'AIRTIME' | 'DATA' | 'ELECTRICITY' | 'TELEVISION';
export type PaymentSource = 'WALLET' | 'BUDGET';
export type MeterType = 'prepaid' | 'postpaid';

export type Biller = {
  code: string;
  name: string;
  category: BillCategory;
  image?: string;
  minAmount?: number;
  maxAmount?: number;
};

export type DataPlan = {
  code: string;
  name: string;
  amount: number;
  billerCode: string;
};

export type BillPayment = {
  _id: string;
  reference: string;
  amount: number;
  category: BillCategory;
  description: string;
  customerId: string;
  customerName?: string;
  planName?: string;
  billerName: string;
  billerCode: string;
  paymentMethod: PaymentSource;
  paymentMethodLabel: string;
  token?: string;
  units?: string;
  createdAt: string;
};

export type BillPayDraft = {
  category: BillCategory;
  billerCode: string;
  customerId: string;
  amount: number;
  paymentSource: PaymentSource;
  budgetId?: string;
  planCode?: string;
  planName?: string;
  meterType?: MeterType;
};

export type PayBillPayload = BillPayDraft & {
  pin?: string;
  useBiometric?: boolean;
};

export type ValidateCustomerPayload = {
  category: BillCategory;
  billerCode: string;
  customerId: string;
  meterType?: MeterType;
};

export type ValidateCustomerResult = {
  valid: boolean;
  customerId: string;
  customerName?: string;
  customerAddress?: string;
};
