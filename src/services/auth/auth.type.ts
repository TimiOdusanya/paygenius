import type { User } from '@/types';

export type { ApiResponse } from '@/types';

export interface AuthData {
  user: User;
  token: string;
  refreshToken?: string;
}

export type SendVerificationPayload = { phoneNumber: string };
export type VerifyPhonePayload = { phoneNumber: string; code: string };
export type RegisterPayload = { phoneNumber: string; password: string };
export type LoginPayload = { identifier: string; password: string };
export type LoginBiometricPayload = { phoneNumber: string };
export type GoogleAuthPayload = { idToken: string };
export type GoogleCodePayload = { code: string; redirectUri?: string };
export type AppleAuthPayload = {
  identityToken: string;
  fullName?: string;
  user?: { email?: string; name?: string };
};

export interface MeResponse {
  user: User;
}
