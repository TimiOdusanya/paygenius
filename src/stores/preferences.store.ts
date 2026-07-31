import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppRoute, MarketingStep } from '@/navigation/onboardingResume';

export type AppRegion = 'USA' | 'NGN';

export type OnboardingRouteParams = {
  phoneNumber?: string;
};

type PreferencesState = {
  region: AppRegion | null;
  hasCompletedMarketingOnboarding: boolean;
  marketingStep: MarketingStep | null;
  /** Phone mid-registration (OTP / create password) before token exists */
  pendingPhoneNumber: string | null;
  registrationStep: 'OTPVerification' | 'CreatePassword' | null;
  /** Exact screen the user was last on during onboarding/KYC */
  lastOnboardingRoute: AppRoute | null;
  lastOnboardingParams: OnboardingRouteParams | null;
  biometricSkipped: boolean;
  hasHydrated: boolean;
  setRegion: (region: AppRegion) => void;
  setMarketingStep: (step: MarketingStep) => void;
  completeMarketingOnboarding: () => void;
  setRegistrationProgress: (
    phoneNumber: string,
    step: 'OTPVerification' | 'CreatePassword'
  ) => void;
  clearRegistrationProgress: () => void;
  setLastOnboardingRoute: (
    route: AppRoute,
    params?: OnboardingRouteParams | null
  ) => void;
  clearLastOnboardingRoute: () => void;
  setBiometricSkipped: (skipped: boolean) => void;
  markOnboardingFinished: () => void;
  currency: () => 'USD' | 'NGN' | null;
  setHasHydrated: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      region: null,
      hasCompletedMarketingOnboarding: false,
      marketingStep: null,
      pendingPhoneNumber: null,
      registrationStep: null,
      lastOnboardingRoute: null,
      lastOnboardingParams: null,
      biometricSkipped: false,
      hasHydrated: false,

      setRegion: (region) => set({ region }),

      setMarketingStep: (marketingStep) => set({ marketingStep }),

      completeMarketingOnboarding: () =>
        set({
          hasCompletedMarketingOnboarding: true,
          marketingStep: null,
        }),

      setRegistrationProgress: (pendingPhoneNumber, registrationStep) =>
        set({ pendingPhoneNumber, registrationStep }),

      clearRegistrationProgress: () =>
        set({ pendingPhoneNumber: null, registrationStep: null }),

      setLastOnboardingRoute: (lastOnboardingRoute, lastOnboardingParams = null) =>
        set({
          lastOnboardingRoute,
          lastOnboardingParams: lastOnboardingParams ?? null,
        }),

      clearLastOnboardingRoute: () =>
        set({ lastOnboardingRoute: null, lastOnboardingParams: null }),

      setBiometricSkipped: (biometricSkipped) => set({ biometricSkipped }),

      markOnboardingFinished: () =>
        set({
          lastOnboardingRoute: null,
          lastOnboardingParams: null,
          pendingPhoneNumber: null,
          registrationStep: null,
          biometricSkipped: false,
        }),

      currency: () => {
        const region = get().region;
        if (region === 'USA') return 'USD';
        if (region === 'NGN') return 'NGN';
        return null;
      },

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'paygenius-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        region: state.region,
        hasCompletedMarketingOnboarding: state.hasCompletedMarketingOnboarding,
        marketingStep: state.marketingStep,
        pendingPhoneNumber: state.pendingPhoneNumber,
        registrationStep: state.registrationStep,
        lastOnboardingRoute: state.lastOnboardingRoute,
        lastOnboardingParams: state.lastOnboardingParams,
        biometricSkipped: state.biometricSkipped,
      }),
      onRehydrateStorage: () => () => {
        usePreferencesStore.setState({ hasHydrated: true });
      },
    }
  )
);
