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
import {
  useSendVerificationMutation,
  useAppleAuthMutation,
} from '@/services/auth/auth.query';
import { navigateAfterAuth } from '@/navigation/navigateAfterAuth';
import { usePreferencesStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/errors';
import { isValidLocalPhone, toE164 } from '@/utils/phone';
import GoogleLogo from '../../../assets/images/auth/google-logo.svg';
import AppleLogo from '../../../assets/images/auth/apple-logo.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export function CreateAccountScreen({ navigation }: Props) {
  useTrackOnboardingRoute('CreateAccount');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);
  const region = usePreferencesStore((s) => s.region);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const btnBorder = isDark ? '#3B3B3B' : '#191970';
  const socialTextColor = isDark ? '#FFFFFF' : '#1A1D23';
  const linkSecondary = isDark ? '#AAAAAA' : '#6D6D8C';
  const linkAccent = isDark ? '#8888FF' : '#191970';

  const sendVerification = useSendVerificationMutation();
  const googleSignIn = useGoogleSignIn();
  const appleAuthMutation = useAppleAuthMutation();

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const fullPhoneNumber = toE164(phoneNumber, region);
  const phoneReady = isValidLocalPhone(phoneNumber, region);

  const handleContinue = () => {
    if (!phoneReady) {
      Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
      return;
    }
    sendVerification.mutate(
      { phoneNumber: fullPhoneNumber },
      {
        onSuccess: () => {
          usePreferencesStore
            .getState()
            .setRegistrationProgress(fullPhoneNumber, 'OTPVerification');
          navigation.navigate('OTPVerification', { phoneNumber: fullPhoneNumber });
        },
        onError: (err) => {
          Alert.alert(
            'Error',
            getApiErrorMessage(err, 'Failed to send verification code. Please try again.')
          );
        },
      }
    );
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
      if (result.error !== 'cancelled') {
        Alert.alert('Apple Sign-In Failed', result.error);
      }
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

  const isLoading =
    sendVerification.isPending ||
    googleSignIn.isPending ||
    appleAuthMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + vs(16), paddingBottom: Math.max(insets.bottom, vs(32)) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: hs(21) }}>
          <Header
            onBack={() => navigation.goBack()}
            title="Create an account"
            description="Choose sign up method"
          />
        </View>

        <View style={[styles.fieldGroup, { marginTop: vs(30), paddingHorizontal: hs(21) }]}>
          <PhoneNumberField value={phoneNumber} onChangeText={setPhoneNumber} />

          <View style={{ marginTop: vs(16) }}>
            <PrimaryButton
              title="Continue"
              onPress={handleContinue}
              disabled={!phoneReady || isLoading}
              style={!phoneReady ? { opacity: 0.6 } : undefined}
            />
          </View>
        </View>

        <View style={[styles.socialGroup, { marginTop: vs(24), paddingHorizontal: hs(21) }]}>
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            style={[
              styles.socialBtn,
              {
                borderColor: btnBorder,
                borderWidth: 0.4,
                borderRadius: ms(12),
                height: vs(44),
              },
            ]}
          >
            {googleSignIn.isPending ? (
              <ActivityIndicator size="small" color={titleColor} />
            ) : (
              <GoogleLogo width={24} height={24} />
            )}
            <Text style={[styles.socialBtnText, { color: socialTextColor, fontSize: fs(10) }]}>
              Sign up with Google
            </Text>
          </Pressable>

          {appleAvailable && (
            <Pressable
              onPress={handleAppleSignIn}
              disabled={isLoading}
              style={[
                styles.socialBtn,
                {
                  borderColor: btnBorder,
                  borderWidth: 0.4,
                  borderRadius: ms(12),
                  height: vs(44),
                  marginTop: vs(16),
                },
              ]}
            >
              {appleAuthMutation.isPending ? (
                <ActivityIndicator size="small" color={titleColor} />
              ) : (
                <AppleLogo width={20} height={24} color={socialTextColor} />
              )}
              <Text style={[styles.socialBtnText, { color: socialTextColor, fontSize: fs(10) }]}>
                Sign up with Apple
              </Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.loginRow, { marginTop: vs(20) }]}>
          <Text style={[styles.loginText, { color: linkSecondary, fontSize: fs(12) }]}>
            Already have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={[styles.loginLink, { color: linkAccent }]}
            >
              Click here to login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  fieldGroup: {},
  socialGroup: {},
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialBtnText: { fontWeight: '400' },
  loginRow: { alignItems: 'center' },
  loginText: { textAlign: 'center', fontWeight: '400' },
  loginLink: { fontWeight: '400' },
});
