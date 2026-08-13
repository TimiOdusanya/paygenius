import type { User } from '@/types';
import type { RootStackParamList } from '@/navigation/RootNavigator';

export type AppRoute = keyof RootStackParamList;

export type MarketingStep =
  | 'Onboarding1'
  | 'Onboarding2'
  | 'Onboarding3'
  | 'Onboarding4'
  | 'RegionSelector';

/** Ordered onboarding / KYC flow used for resume validation. */
export const ONBOARDING_FLOW: AppRoute[] = [
  'Onboarding1',
  'Onboarding2',
  'Onboarding3',
  'Onboarding4',
  'RegionSelector',
  'Login',
  'CreateAccount',
  'OTPVerification',
  'CreatePassword',
  'LoginWithPassword',
  'ProfileIntroduction',
  'ProfileSetup',
  'AddressVerification',
  'IdentityVerification',
  'VerificationCompleted',
  'SelfieIntroduction',
  'TakeSelfie',
  'SecuritySetup',
  'BiometricSetup',
  'AccountCreated',
  'Main',
];

export function isTrackedOnboardingRoute(route: string): route is AppRoute {
  return ONBOARDING_FLOW.includes(route as AppRoute);
}

/**
 * Earliest incomplete KYC/security step from backend flags.
 * Intro screens are included so resume can land on them.
 */
export function getKycResumeRoute(
  user: User,
  options?: { biometricSkipped?: boolean }
): AppRoute {
  if (!user.isProfileComplete) return 'ProfileIntroduction';
  if (!user.isAddressVerified) return 'AddressVerification';
  if (!user.isIdentityVerified) return 'IdentityVerification';
  if (!user.selfieImages?.length) return 'SelfieIntroduction';
  if (!user.setTransactionPin) return 'SecuritySetup';
  if (!options?.biometricSkipped && !user.isBiometricSetup && !user.biometricEnabled) {
    return 'BiometricSetup';
  }
  return 'Main';
}

export function isOnboardingComplete(
  user: User | null | undefined,
  biometricSkipped = false
): boolean {
  if (!user) return false;
  return getKycResumeRoute(user, { biometricSkipped }) === 'Main';
}

type ResumeInput = {
  token: string | null;
  user: User | null;
  hasCompletedMarketingOnboarding: boolean;
  marketingStep: MarketingStep | null;
  region: 'USA' | 'NGN' | null;
  pendingPhoneNumber: string | null;
  registrationStep: 'OTPVerification' | 'CreatePassword' | null;
  lastOnboardingRoute: AppRoute | null;
  lastOnboardingParams: { phoneNumber?: string } | null;
  biometricSkipped: boolean;
};

function flowIndex(route: AppRoute): number {
  return ONBOARDING_FLOW.indexOf(route);
}

/** Cold-start destination after splash. */
export function getResumeRoute(input: ResumeInput): {
  route: AppRoute;
  params?: RootStackParamList[AppRoute];
} {
  const {
    token,
    user,
    hasCompletedMarketingOnboarding,
    marketingStep,
    region,
    pendingPhoneNumber,
    registrationStep,
    lastOnboardingRoute,
    lastOnboardingParams,
    biometricSkipped,
  } = input;

  // Authenticated: resume exact last KYC screen when still valid
  if (token && user) {
    const minRoute = getKycResumeRoute(user, { biometricSkipped });
    const last = lastOnboardingRoute;

    if (last && isTrackedOnboardingRoute(last) && last !== 'Main') {
      const lastIdx = flowIndex(last);
      const minIdx = flowIndex(minRoute);
      // Don't send them behind completed work; prefer the furthest valid step
      if (lastIdx >= minIdx) {
        if (
          (last === 'OTPVerification' || last === 'CreatePassword') &&
          lastOnboardingParams?.phoneNumber
        ) {
          return {
            route: last,
            params: {
              phoneNumber: lastOnboardingParams.phoneNumber,
            } as RootStackParamList['OTPVerification'],
          };
        }
        return { route: last };
      }
    }

    return { route: minRoute };
  }

  // Mid phone-registration (before auth token exists)
  if (pendingPhoneNumber && registrationStep === 'CreatePassword') {
    return {
      route: 'CreatePassword',
      params: { phoneNumber: pendingPhoneNumber },
    };
  }
  if (pendingPhoneNumber && registrationStep === 'OTPVerification') {
    return {
      route: 'OTPVerification',
      params: { phoneNumber: pendingPhoneNumber },
    };
  }

  // Exact last pre-auth screen (e.g. CreateAccount / Login)
  if (lastOnboardingRoute && !token) {
    // OTP / CreatePassword: we need the phone number to resume correctly
    if (
      lastOnboardingRoute === 'OTPVerification' ||
      lastOnboardingRoute === 'CreatePassword'
    ) {
      const phone =
        lastOnboardingParams?.phoneNumber ?? pendingPhoneNumber ?? null;
      if (phone) {
        return {
          route: lastOnboardingRoute,
          params: {
            phoneNumber: phone,
          } as RootStackParamList['OTPVerification'],
        };
      }
      // No phone available – fall back to login
      return { route: 'Login' };
    }

    if (
      lastOnboardingRoute === 'Login' ||
      lastOnboardingRoute === 'CreateAccount' ||
      lastOnboardingRoute === 'LoginWithPassword'
    ) {
      return { route: lastOnboardingRoute };
    }

    // lastOnboardingRoute is a post-auth KYC screen (e.g. ProfileSetup).
    // The user must log in first; after auth navigateAfterAuth will resume here.
    if (hasCompletedMarketingOnboarding && region) {
      return { route: 'Login' };
    }
  }

  if (!hasCompletedMarketingOnboarding) {
    if (marketingStep) return { route: marketingStep };
    if (
      lastOnboardingRoute &&
      [
        'Onboarding1',
        'Onboarding2',
        'Onboarding3',
        'Onboarding4',
        'RegionSelector',
      ].includes(lastOnboardingRoute)
    ) {
      return { route: lastOnboardingRoute };
    }
    return { route: 'Onboarding1' };
  }

  if (!region) return { route: 'RegionSelector' };

  return { route: 'Login' };
}
