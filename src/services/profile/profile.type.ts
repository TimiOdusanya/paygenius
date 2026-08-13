import type { User } from '@/types';

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

export type CheckUsernameResponse = {
  username: string;
  available: boolean;
  reason: 'available' | 'taken' | 'invalid';
};

export type VerifyIdentityPayload = {
  type: 'BVN' | 'NIN';
  number: string;
  /** Required for BVN only */
  phoneNumber?: string;
};

export type UploadSelfiePayload = { selfieImages: string[] };
export type SetupPinPayload = { pin: string; confirmPin: string };

export type UpdateProfilePayload = {
  username?: string;
  profilePicture?: string;
};
