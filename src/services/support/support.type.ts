export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type AboutInfo = {
  appName: string;
  version: string;
  email: string;
  phone: string;
  legal: {
    terms: string;
    privacy: string;
  };
};

export type SupportMessage = {
  _id: string;
  userId: string;
  role: 'user' | 'support';
  topic?: string;
  body: string;
  createdAt?: string;
};

export type SupportTopic =
  | 'failed_transaction'
  | 'card_request'
  | 'account_issue'
  | 'esims'
  | 'overdraft'
  | 'gift_cards'
  | 'savings'
  | 'invest'
  | 'general';
