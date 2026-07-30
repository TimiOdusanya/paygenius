import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export type GoogleAuthResult =
  | { success: true; code: string; redirectUri: string }
  | { success: false; error: string };

export function useGoogleAuth(onResult: (result: GoogleAuthResult) => void) {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'paygenius' });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    redirectUri,
    responseType: 'code',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success' && response.params?.code) {
      onResult({ success: true, code: response.params.code, redirectUri });
    } else if (response.type === 'error') {
      onResult({ success: false, error: response.error?.message ?? 'Google sign-in failed' });
    } else if (response.type === 'cancel' || response.type === 'dismiss') {
      // User cancelled – no-op
    }
  }, [response]);

  return { request, promptAsync };
}
