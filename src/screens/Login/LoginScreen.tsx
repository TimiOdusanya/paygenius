import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Header } from '@/components/Header';
import { PhoneNumberField } from '@/components/PhoneNumberField';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useGoogleSignIn } from '@/hooks/useGoogleAuth';
import { signInWithApple, isAppleSignInAvailable } from '@/hooks/useAppleAuth';
import { useAppleAuthMutation } from '@/services/auth/auth.query';
import { navigateAfterAuth } from '@/navigation/navigateAfterAuth';
import { useAuthStore, usePreferencesStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/errors';
import { isValidLocalPhone, toE164, toLocalDigits } from '@/utils/phone';
import GoogleLogo from '../../../assets/images/auth/google-logo.svg';
import AppleLogo from '../../../assets/images/auth/apple-logo.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  useTrackOnboardingRoute('Login');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [phone, setPhone] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);
  const region = usePreferencesStore((s) => s.region);
  const lastPhoneNumber = usePreferencesStore((s) => s.lastPhoneNumber);
  const cachedPhone = useAuthStore((s) => s.user?.phoneNumber);

  useEffect(() => {
    const stored = lastPhoneNumber || cachedPhone;
    if (!stored) return;
    setPhone((current) =>
      current ? current : toLocalDigits(stored, region)
    );
  }, [lastPhoneNumber, cachedPhone, region]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const loginTextColor = isDark ? '#A0A0C8' : '#6D6D8C';
  const loginLinkColor = isDark ? '#A0C4FF' : '#191970';
  const socialborder = isDark ? '#3B3B3B' : '#191970';
  const socialText = isDark ? '#FFFFFF' : '#000000';

  const googleSignIn = useGoogleSignIn();
  const appleAuthMutation = useAppleAuthMutation();

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const fullPhoneNumber = toE164(phone, region);
  const phoneReady = isValidLocalPhone(phone, region);

  const handleContinue = () => {
    if (!phoneReady) return;
    usePreferencesStore.getState().setLastPhoneNumber(fullPhoneNumber);
    navigation.navigate('LoginWithPassword', {
      phoneNumber: fullPhoneNumber,
    });
  };

  const handleGoogleSignIn = () => {
    googleSignIn.signIn({
      onSuccess: () => navigateAfterAuth(navigation),
      onError: (message) => Alert.alert('Google Sign-In Failed', message),
    });
  };

  const handleAppleSignIn = async () => {
    const result = await signInWithApple();
    if (!result.success) {
      if (result.error !== 'cancelled') Alert.alert('Apple Sign-In Failed', result.error);
      return;
    }
    appleAuthMutation.mutate(
      {
        identityToken: result.identityToken,
        fullName: result.fullName,
        user: {
          email: result.email,
          name: result.fullName,
        },
      },
      {
        onSuccess: () => navigateAfterAuth(navigation),
        onError: (err) => {
          Alert.alert(
            'Error',
            getApiErrorMessage(err, 'Apple authentication failed. Please try again.')
          );
        },
      }
    );
  };

  const isLoading = googleSignIn.isPending || appleAuthMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + vs(24),
            paddingBottom: Math.max(insets.bottom, vs(24)),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { paddingHorizontal: hs(21) }]}>
          <Header
            onBack={() => navigation.goBack()}
            title="Welcome back"
            description="Sign in to continue"
          />

          <View style={[styles.form, { marginTop: vs(30) }]}>
            <PhoneNumberField value={phone} onChangeText={setPhone} />

            <Pressable
              style={[
                styles.socialBtn,
                {
                  borderColor: socialborder,
                  borderRadius: ms(12),
                  height: vs(44),
                  marginTop: vs(16),
                },
              ]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              {googleSignIn.isPending ? (
                <ActivityIndicator size="small" color={titleColor} />
              ) : (
                <GoogleLogo width={24} height={24} />
              )}
              <Text style={[styles.socialText, { color: socialText, fontSize: fs(10) }]}>
                Sign in with Google
              </Text>
            </Pressable>

            {appleAvailable && (
              <Pressable
                style={[
                  styles.socialBtn,
                  {
                    borderColor: socialborder,
                    borderRadius: ms(12),
                    height: vs(44),
                    marginTop: vs(12),
                  },
                ]}
                onPress={handleAppleSignIn}
                disabled={isLoading}
              >
                {appleAuthMutation.isPending ? (
                  <ActivityIndicator size="small" color={titleColor} />
                ) : (
                  <AppleLogo width={20} height={24} color={socialText} />
                )}
                <Text style={[styles.socialText, { color: socialText, fontSize: fs(10) }]}>
                  Sign in with Apple
                </Text>
              </Pressable>
            )}
          </View>

          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            style={{ marginTop: vs(24), opacity: phoneReady ? 1 : 0.6 }}
            disabled={!phoneReady || isLoading}
          />

          <View style={[styles.loginRow, { marginTop: vs(16) }]}>
            <Text style={[styles.loginText, { color: loginTextColor, fontSize: fs(12) }]}>
              Don't have an account?{' '}
              <Text
                onPress={() => navigation.navigate('CreateAccount')}
                style={[styles.loginLink, { color: loginLinkColor }]}
              >
                Click here to register
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  inner: { flex: 1 },
  form: {},
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0.4,
    paddingHorizontal: 16,
  },
  socialText: { fontWeight: '400' },
  loginRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: { fontWeight: '400', textAlign: 'center' },
  loginLink: { fontWeight: '400' },
});
