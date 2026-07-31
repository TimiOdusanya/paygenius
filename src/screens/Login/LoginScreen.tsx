import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Header } from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { signInWithApple, isAppleSignInAvailable } from '@/hooks/useAppleAuth';
import {
  useSendVerificationMutation,
  useGoogleCodeMutation,
  useAppleAuthMutation,
} from '@/services/auth/auth.query';
import { navigateAfterAuth } from '@/navigation/navigateAfterAuth';
import { usePreferencesStore } from '@/stores/preferences.store';
import { getApiErrorMessage } from '@/utils/errors';
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

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputText = isDark ? '#FFFFFF' : '#000000';
  const labelColor = isDark ? '#FFFFFF' : '#000000';
  const countryBg = isDark ? '#3B3B3B' : '#C0C0F1';
  const loginTextColor = isDark ? '#A0A0C8' : '#6D6D8C';
  const loginLinkColor = isDark ? '#A0C4FF' : '#191970';
  const socialborder = isDark ? '#3B3B3B' : '#191970';
  const socialText = isDark ? '#FFFFFF' : '#000000';
  const dividerColor = isDark ? '#3B3B3B' : '#EDEDED';

  const sendVerification = useSendVerificationMutation();
  const googleCodeMutation = useGoogleCodeMutation();
  const appleAuthMutation = useAppleAuthMutation();

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhoneNumber = cleanPhone ? `+234${cleanPhone}` : '';

  const handleContinue = () => {
    if (cleanPhone.length < 7) return;
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

  const { request: googleRequest, promptAsync: promptGoogle } = useGoogleAuth(
    async (result) => {
      if (!result.success) {
        if (result.error !== 'cancelled') Alert.alert('Google Sign-In Failed', result.error);
        return;
      }
      googleCodeMutation.mutate(
        { code: result.code, redirectUri: result.redirectUri },
        {
          onSuccess: () => navigateAfterAuth(navigation),
          onError: (err) => {
            Alert.alert(
              'Error',
              getApiErrorMessage(err, 'Google authentication failed. Please try again.')
            );
          },
        }
      );
    }
  );

  const handleGoogleSignIn = () => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
      Alert.alert('Configuration Error', 'Google Sign-In is not configured yet.');
      return;
    }
    promptGoogle();
  };

  const handleAppleSignIn = async () => {
    const result = await signInWithApple();
    if (!result.success) {
      if (result.error !== 'cancelled') Alert.alert('Apple Sign-In Failed', result.error);
      return;
    }
    appleAuthMutation.mutate(
      { identityToken: result.identityToken, fullName: result.fullName },
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
    sendVerification.isPending || googleCodeMutation.isPending || appleAuthMutation.isPending;

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

          {/* Sign up section */}
          <View style={[styles.form, { marginTop: vs(30) }]}>
            <Text style={[styles.fieldLabel, { color: labelColor, fontSize: fs(10) }]}>
              Phone number
            </Text>
            <View style={[styles.phoneRow, { marginTop: vs(10) }]}>
              {/* Country code */}
              <View
                style={[
                  styles.countryBox,
                  {
                    backgroundColor: countryBg,
                    borderColor: inputBorder,
                    borderRadius: ms(12),
                    height: vs(44),
                    width: hs(73),
                  },
                ]}
              >
                <Image
                  source={require('../../../assets/images/region/flag-nigeria.png')}
                  style={{ width: ms(20), height: ms(20), borderRadius: ms(10) }}
                  resizeMode="cover"
                />
                <Text style={[styles.countryCode, { color: '#FFFFFF', fontSize: fs(11) }]}>NGN</Text>
              </View>
              {/* Phone TextInput */}
              <View
                style={[
                  styles.phoneInputBox,
                  {
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                    borderRadius: ms(12),
                    height: vs(44),
                    flex: 1,
                    marginLeft: hs(8),
                  },
                ]}
              >
                <Text style={[styles.phonePrefix, { color: isDark ? '#A0A0A0' : '#C4C4C4', fontSize: fs(11) }]}>
                  +234
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(133,133,133,0.6)'}
                  keyboardType="phone-pad"
                  style={[styles.phoneInput, { color: inputText, fontSize: fs(11), flex: 1 }]}
                  maxLength={11}
                />
              </View>
            </View>

            {/* Google Sign In */}
            <Pressable
              style={[
                styles.socialBtn,
                {
                  borderColor: socialborder,
                  borderRadius: ms(12),
                  height: vs(44),
                  marginTop: vs(16),
                  opacity: !googleRequest ? 0.7 : 1,
                },
              ]}
              onPress={handleGoogleSignIn}
              disabled={!googleRequest || isLoading}
            >
              {googleCodeMutation.isPending ? (
                <ActivityIndicator size="small" color={titleColor} />
              ) : (
                <GoogleLogo width={24} height={24} />
              )}
              <Text style={[styles.socialText, { color: socialText, fontSize: fs(10) }]}>
                Sign in with Google
              </Text>
            </Pressable>

            {/* Apple Sign In (iOS only) */}
            {appleAvailable && (
              <Pressable
                style={[
                  styles.socialBtn,
                  { borderColor: socialborder, borderRadius: ms(12), height: vs(44), marginTop: vs(12) },
                ]}
                onPress={handleAppleSignIn}
                disabled={isLoading}
              >
                {appleAuthMutation.isPending ? (
                  <ActivityIndicator size="small" color={titleColor} />
                ) : (
                  <AppleLogo width={20} height={24} />
                )}
                <Text style={[styles.socialText, { color: socialText, fontSize: fs(10) }]}>
                  Sign in with Apple
                </Text>
              </Pressable>
            )}
          </View>

          <PrimaryButton
            title={sendVerification.isPending ? 'Sending...' : 'Continue'}
            onPress={handleContinue}
            style={{ marginTop: vs(24), opacity: cleanPhone.length < 7 ? 0.6 : 1 }}
            disabled={cleanPhone.length < 7 || isLoading}
          />

          {/* Login link */}
          <View style={[styles.loginRow, { marginTop: vs(16) }]}>
            <Text style={[styles.loginText, { color: loginTextColor, fontSize: fs(12) }]}>
              Already have an account?{' '}Click here to{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('LoginWithPassword')}>
              <Text style={[styles.loginLink, { color: loginLinkColor, fontSize: fs(12) }]}>login</Text>
            </Pressable>
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
  fieldLabel: { fontWeight: '400' },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  countryBox: {
    borderWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  countryCode: { fontWeight: '400' },
  phoneInputBox: {
    borderWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  phonePrefix: { fontWeight: '400' },
  phoneInput: { fontWeight: '400' },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginText: { fontWeight: '400' },
  loginLink: { fontWeight: '400' },
});
