import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

export type AppleAuthResult =
  | { success: true; identityToken: string; fullName?: string; email?: string }
  | { success: false; error: string };

export async function signInWithApple(): Promise<AppleAuthResult> {
  if (Platform.OS !== 'ios') {
    return { success: false, error: 'Apple Sign-In is only available on iOS' };
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { success: false, error: 'No identity token received from Apple' };
    }

    const fullName = [
      credential.fullName?.givenName,
      credential.fullName?.familyName,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      success: true,
      identityToken: credential.identityToken,
      fullName: fullName || undefined,
      email: credential.email ?? undefined,
    };
  } catch (err: any) {
    if (err.code === 'ERR_CANCELED') {
      return { success: false, error: 'cancelled' };
    }
    return { success: false, error: err.message ?? 'Apple sign-in failed' };
  }
}

export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  return AppleAuthentication.isAvailableAsync();
}
