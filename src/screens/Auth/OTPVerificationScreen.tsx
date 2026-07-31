import React, { useState, useEffect } from 'react';
import {
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
import { Header } from '@/components/Header';
import { OTPInput } from '@/components/OTPInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import {
  useVerifyPhoneMutation,
  useSendVerificationMutation,
} from '@/services/auth/auth.query';
import { usePreferencesStore } from '@/stores/preferences.store';
import { getApiErrorMessage } from '@/utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

const OTP_LENGTH = 4;

export function OTPVerificationScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  useTrackOnboardingRoute('OTPVerification', { phoneNumber });
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();

  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(59);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const resendColor = isDark ? '#8888FF' : '#191970';

  const verifyMutation = useVerifyPhoneMutation();
  const sendVerification = useSendVerificationMutation();

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const isComplete = otp.length === OTP_LENGTH;

  const handleVerify = () => {
    if (!isComplete) return;
    verifyMutation.mutate(
      { phoneNumber, code: otp },
      {
        onSuccess: () => {
          usePreferencesStore
            .getState()
            .setRegistrationProgress(phoneNumber, 'CreatePassword');
          navigation.navigate('CreatePassword', { phoneNumber });
        },
        onError: (err) => {
          Alert.alert(
            'Verification Failed',
            getApiErrorMessage(err, 'Invalid verification code. Please try again.')
          );
          setOtp('');
        },
      }
    );
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    sendVerification.mutate(
      { phoneNumber },
      {
        onSuccess: () => {
          setResendCountdown(59);
          setOtp('');
          Alert.alert('Code Sent', 'A new verification code has been sent.');
        },
        onError: (err) => {
          Alert.alert(
            'Error',
            getApiErrorMessage(err, 'Failed to resend code. Please try again.')
          );
        },
      }
    );
  };

  const maskedPhone = phoneNumber.replace(/(\+\d{3})\d{4}(\d{4})/, '$1****$2');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + vs(16),
            paddingBottom: Math.max(insets.bottom, vs(32)),
            paddingHorizontal: hs(21),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header
          onBack={() => navigation.goBack()}
          title="Verify Phone"
          description={`Enter the 4-digit code sent to ${maskedPhone}`}
        />

        <View style={{ marginTop: vs(32) }}>
          <OTPInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
        </View>

        <View style={[styles.resendRow, { marginTop: vs(16) }]}>
          {resendCountdown > 0 ? (
            <Text style={[styles.resendText, { color: subtitleColor, fontSize: fs(12) }]}>
              Resend code in{' '}
              <Text style={{ color: resendColor, fontWeight: '600' }}>
                {resendCountdown}s
              </Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend} disabled={sendVerification.isPending}>
              <Text
                style={[
                  styles.resendText,
                  { color: resendColor, fontSize: fs(12), fontWeight: '500' },
                ]}
              >
                Resend Code
              </Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.footer, { marginTop: vs(32) }]}>
          <PrimaryButton
            title={verifyMutation.isPending ? 'Verifying...' : 'Continue'}
            onPress={handleVerify}
            disabled={!isComplete || verifyMutation.isPending}
            style={!isComplete ? { opacity: 0.6 } : undefined}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  resendRow: { alignItems: 'center' },
  resendText: { fontWeight: '400' },
  footer: {},
});
