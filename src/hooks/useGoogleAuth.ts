import { Platform, TurboModuleRegistry } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { discovery } from 'expo-auth-session/providers/google';
import {
  useGoogleAuthMutation,
  useGoogleCodeMutation,
} from '@/services/auth/auth.query';

WebBrowser.maybeCompleteAuthSession();

export type GoogleAuthResult =
  | { success: true; kind: 'idToken'; idToken: string }
  | { success: true; kind: 'code'; code: string; redirectUri: string }
  | { success: false; error: string };

function hasNativeGoogleSignIn(): boolean {
  try {
    return TurboModuleRegistry.get('RNGoogleSignin') != null;
  } catch {
    return false;
  }
}

async function signInWithNativeGoogle(): Promise<GoogleAuthResult> {
  const {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
  } = await import('@react-native-google-signin/google-signin');

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  if (!webClientId) {
    return { success: false, error: 'Google Sign-In is not configured yet.' };
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: false,
  });

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      return { success: false, error: 'cancelled' };
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      return { success: false, error: 'No ID token received from Google' };
    }

    return { success: true, kind: 'idToken', idToken };
  } catch (err: unknown) {
    if (isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED) {
      return { success: false, error: 'cancelled' };
    }
    const message = err instanceof Error ? err.message : 'Google sign-in failed';
    return { success: false, error: message };
  }
}

async function signInWithAuthSession(): Promise<GoogleAuthResult> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  if (!webClientId) {
    return { success: false, error: 'Google Sign-In is not configured yet.' };
  }

  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const clientId =
    Platform.OS === 'ios' && iosClientId ? iosClientId : webClientId;

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'paygenius',
    path: 'oauthredirect',
  });

  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
    extraParams: {
      include_granted_scopes: 'true',
    },
  });

  const result = await request.promptAsync(discovery);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { success: false, error: 'cancelled' };
  }

  if (result.type !== 'success' || !result.params.code) {
    const description =
      result.type === 'error' ? result.params?.error_description : undefined;
    return { success: false, error: description || 'Google sign-in failed' };
  }

  return {
    success: true,
    kind: 'code',
    code: result.params.code,
    redirectUri,
  };
}

export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  if (hasNativeGoogleSignIn()) {
    return signInWithNativeGoogle();
  }
  return signInWithAuthSession();
}

export function useGoogleSignIn() {
  const idTokenMutation = useGoogleAuthMutation();
  const codeMutation = useGoogleCodeMutation();

  const signIn = async (handlers: {
    onSuccess: () => void;
    onError: (message: string) => void;
  }) => {
    const result = await signInWithGoogle();
    if (!result.success) {
      if (result.error !== 'cancelled') {
        handlers.onError(result.error);
      }
      return;
    }

    const options = {
      onSuccess: handlers.onSuccess,
      onError: (err: any) => {
        handlers.onError(
          err?.response?.data?.message ?? 'Google authentication failed.'
        );
      },
    };

    if (result.kind === 'idToken') {
      idTokenMutation.mutate({ idToken: result.idToken }, options);
    } else {
      codeMutation.mutate(
        { code: result.code, redirectUri: result.redirectUri },
        options
      );
    }
  };

  return {
    signIn,
    isPending: idTokenMutation.isPending || codeMutation.isPending,
  };
}
