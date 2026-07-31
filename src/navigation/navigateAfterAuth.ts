import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { getResumeRoute } from '@/navigation/onboardingResume';
import { useAuthStore } from '@/stores/auth.store';
import { usePreferencesStore } from '@/stores/preferences.store';

/** After login/register/social auth — resume KYC where the user left off. */
export function navigateAfterAuth(
  navigation: NavigationProp<ParamListBase>
) {
  const auth = useAuthStore.getState();
  const prefs = usePreferencesStore.getState();

  const { route } = getResumeRoute({
    token: auth.token,
    user: auth.user,
    hasCompletedMarketingOnboarding: true,
    marketingStep: null,
    region: prefs.region,
    pendingPhoneNumber: null,
    registrationStep: null,
    lastOnboardingRoute: prefs.lastOnboardingRoute,
    lastOnboardingParams: prefs.lastOnboardingParams,
    biometricSkipped: prefs.biometricSkipped,
  });

  if (route === 'Main') {
    prefs.markOnboardingFinished();
  }

  navigation.reset({
    index: 0,
    routes: [{ name: route }],
  });
}
