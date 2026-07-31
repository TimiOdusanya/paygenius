import { useEffect } from 'react';
import type { AppRoute } from '@/navigation/onboardingResume';
import {
  usePreferencesStore,
  type OnboardingRouteParams,
} from '@/stores/preferences.store';

/**
 * Persist the current onboarding/KYC screen so cold starts resume here.
 * Call once per tracked screen with that screen's route name.
 */
export function useTrackOnboardingRoute(
  route: AppRoute,
  params?: OnboardingRouteParams | null
) {
  useEffect(() => {
    usePreferencesStore.getState().setLastOnboardingRoute(route, params ?? null);
  }, [route, params?.phoneNumber]);
}
