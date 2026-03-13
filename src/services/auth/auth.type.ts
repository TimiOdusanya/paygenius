import type { User } from '@/types';

export interface ApiResponse<T> {
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

export type SendVerificationPayload = { phoneNumber: string };
export type VerifyPhonePayload = { phoneNumber: string; code: string };
export type RegisterPayload = { phoneNumber: string; password: string };
export type LoginPayload = { phoneNumber: string; password: string };
export type LoginBiometricPayload = { phoneNumber: string };
export type GoogleAuthPayload = { idToken: string };
export type GoogleCodePayload = { code: string };
export type AppleAuthPayload = { identityToken: string; fullName?: string };

export interface MeResponse {
  user: User;
}
