export type GenieProfile = {
  occupation?: string;
  payFrequency?: string;
  monthlyIncome?: string;
  topSpends?: string[];
  trackingHabit?: string;
  spendingStyle?: string;
  goals?: string[];
  goalTimeline?: string;
  helpFocus?: string;
  checkInPreference?: string;
  allowPeek?: string;
  onboardingCompleted: boolean;
};

export type GenieMessage = {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type GenieChat = {
  _id: string;
  title: string;
  messages: GenieMessage[];
  updatedAt?: string;
};

export type GenieChatPreview = {
  _id: string;
  title: string;
  updatedAt?: string;
  preview?: string;
};
