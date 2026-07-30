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
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { signInWithApple, isAppleSignInAvailable } from '@/hooks/useAppleAuth';
import {
  useSendVerificationMutation,
  useGoogleCodeMutation,
  useAppleAuthMutation,
} from '@/services/auth/auth.query';
import GoogleLogo from '../../../assets/images/auth/google-logo.svg';
import AppleLogo from '../../../assets/images/auth/apple-logo.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export function CreateAccountScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const inputBg = isDark ? '#1E1E2E' : '#FAFAFC';
  const inputBorderColor = isDark ? '#3B3B3B' : '#191970';
  const labelColor = isDark ? '#CCCCCC' : '#1A1D23';
  const flagBg = isDark ? '#2A2A5A' : '#C0C0F1';
  const btnBorder = isDark ? '#3B3B3B' : '#191970';
  const socialTextColor = isDark ? '#FFFFFF' : '#1A1D23';
  const linkSecondary = isDark ? '#AAAAAA' : '#6D6D8C';
  const linkAccent = isDark ? '#8888FF' : '#191970';

  const sendVerification = useSendVerificationMutation();
  const googleCodeMutation = useGoogleCodeMutation();
  const appleAuthMutation = useAppleAuthMutation();

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const fullPhoneNumber = cleanPhone ? `+234${cleanPhone}` : '';

  const handleContinue = () => {
    if (cleanPhone.length < 7) {
      Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
      return;
    }
    sendVerification.mutate(
      { phoneNumber: fullPhoneNumber },
      {
        onSuccess: () => {
          navigation.navigate('OTPVerification', { phoneNumber: fullPhoneNumber });
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Failed to send verification code.';
          Alert.alert('Error', msg);
        },
      }
    );
  };

  const { request: googleRequest, promptAsync: promptGoogle } = useGoogleAuth(
    async (result) => {
      if (!result.success) {
        if (result.error !== 'cancelled') {
          Alert.alert('Google Sign-In Failed', result.error);
        }
        return;
      }
      googleCodeMutation.mutate(
        { code: result.code, redirectUri: result.redirectUri },
        {
          onSuccess: () => navigation.replace('Main'),
          onError: (err: any) => {
            Alert.alert('Error', err?.response?.data?.message ?? 'Google authentication failed.');
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
      if (result.error !== 'cancelled') {
        Alert.alert('Apple Sign-In Failed', result.error);
      }
      return;
    }
    appleAuthMutation.mutate(
      { identityToken: result.identityToken, fullName: result.fullName },
      {
        onSuccess: () => navigation.replace('Main'),
        onError: (err: any) => {
          Alert.alert('Error', err?.response?.data?.message ?? 'Apple authentication failed.');
        },
      }
    );
  };

  const isLoading =
    sendVerification.isPending ||
    googleCodeMutation.isPending ||
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
        {/* Back */}
        <View style={{ paddingHorizontal: hs(21) }}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        {/* Title */}
        <View style={[styles.titleBlock, { paddingHorizontal: hs(21), marginTop: vs(8) }]}>
          <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
            Create an account
          </Text>
          <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4) }]}>
            Choose sign up method
          </Text>
        </View>

        {/* Phone number field */}
        <View style={[styles.fieldGroup, { marginTop: vs(30), paddingHorizontal: hs(21) }]}>
          <Text style={[styles.fieldLabel, { color: labelColor, fontSize: fs(10) }]}>
            Phone number
          </Text>
          <View style={[styles.phoneRow, { marginTop: vs(8), gap: hs(6) }]}>
            {/* Country flag + code */}
            <View
              style={[
                styles.flagBtn,
                {
                  backgroundColor: flagBg,
                  borderColor: inputBorderColor,
                  borderWidth: 0.4,
                  borderRadius: ms(12),
                  height: vs(44),
                  paddingHorizontal: hs(12),
                  minWidth: ms(73),
                },
              ]}
            >
              <Text style={{ fontSize: ms(14) }}>🇳🇬</Text>
              <Text style={[styles.flagText, { color: '#FFFFFF', fontSize: fs(11), letterSpacing: 0.25 }]}>
                NGN
              </Text>
            </View>

            {/* Phone input */}
            <TextInput
              style={[
                styles.phoneInput,
                {
                  flex: 1,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBg,
                  color: isDark ? '#FFFFFF' : '#1A1D23',
                  fontSize: fs(11),
                  height: vs(44),
                  borderRadius: ms(12),
                  paddingHorizontal: hs(14),
                  borderWidth: 0.4,
                },
              ]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="9151864174"
              placeholderTextColor={isDark ? '#666' : '#C4C4C4'}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          {/* Continue button */}
          <View style={{ marginTop: vs(16) }}>
            <PrimaryButton
              title="Continue"
              onPress={handleContinue}
              disabled={cleanPhone.length < 7 || isLoading}
              style={cleanPhone.length < 7 ? { opacity: 0.6 } : undefined}
            />
          </View>
        </View>

        {/* Social sign-up */}
        <View style={[styles.socialGroup, { marginTop: vs(24), paddingHorizontal: hs(21) }]}>
          {/* Google */}
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={!googleRequest || isLoading}
            style={[
              styles.socialBtn,
              {
                borderColor: btnBorder,
                borderWidth: 0.4,
                borderRadius: ms(12),
                height: vs(44),
                opacity: !googleRequest ? 0.7 : 1,
              },
            ]}
          >
            {googleCodeMutation.isPending ? (
              <ActivityIndicator size="small" color={titleColor} />
            ) : (
              <GoogleLogo width={24} height={24} />
            )}
            <Text style={[styles.socialBtnText, { color: socialTextColor, fontSize: fs(10) }]}>
              Sign up with Google
            </Text>
          </Pressable>

          {/* Apple (iOS only) */}
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
                <AppleLogo width={20} height={24} />
              )}
              <Text style={[styles.socialBtnText, { color: socialTextColor, fontSize: fs(10) }]}>
                Sign up with Apple
              </Text>
            </Pressable>
          )}
        </View>

        {/* Login link */}
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
  backBtn: { height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  titleBlock: {},
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400' },
  fieldGroup: {},
  fieldLabel: { fontWeight: '400' },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  flagBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flagText: { fontWeight: '400' },
  phoneInput: { fontWeight: '400' },
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
