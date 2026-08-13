export type AppSettings = {
  dailySpendLimit: number;
  dailyTransferLimit: number;
  faceIdEnabled: boolean;
  biometricEnabled: boolean;
  setTransactionPin: boolean;
  referralCode: string;
};

export type ReferralDetails = {
  code: string;
  rewardAmount: number;
  shareMessage: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePinPayload = {
  currentPin: string;
  newPin: string;
};

export type SubmitReviewPayload = {
  rating: number;
  review?: string;
  enjoyed?: boolean;
};
