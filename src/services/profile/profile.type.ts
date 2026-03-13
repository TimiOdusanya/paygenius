import type { User, Address } from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ProfileResponse {
  user: User;
}

export type ProfileSetupPayload = {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  profilePicture?: string;
};

export type VerifyIdentityPayload = {
  type: 'BVN' | 'NIN';
  number: string;
  phoneNumber: string;
};

export type UploadSelfiePayload = { selfieImages: string[] };
export type SetupPinPayload = { pin: string; confirmPin: string };
