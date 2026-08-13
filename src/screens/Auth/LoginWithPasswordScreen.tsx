import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { FormInput, PasswordInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { PhoneNumberField } from '@/components/PhoneNumberField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useLoginMutation, useLoginBiometricMutation } from '@/services/auth/auth.query';
import { navigateAfterAuth } from '@/navigation/navigateAfterAuth';
import { useAuthStore, usePreferencesStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/errors';
import { isValidLocalPhone, toE164, toLocalDigits } from '@/utils/phone';
import FaceIdIcon from '../../../assets/images/auth/faceid-icon.svg';

const FINGERPRINT_IMG = require('../../../assets/images/auth/fingerprint.png');

type Props = NativeStackScreenProps<RootStackParamList, 'LoginWithPassword'>;

export function LoginWithPasswordScreen({ navigation, route }: Props) {
  useTrackOnboardingRoute('LoginWithPassword');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const region = usePreferencesStore((s) => s.region);

  const lastPhoneNumber = usePreferencesStore((s) => s.lastPhoneNumber);
  const rememberedEmail = user?.email?.trim() ?? '';
  const rememberedPhone =
    user?.phoneNumber?.trim() || lastPhoneNumber?.trim() || '';
  const incomingPhone = route.params?.phoneNumber?.trim() ?? '';

  const [inputMode, setInputMode] = useState<'phone' | 'other'>(
    rememberedEmail && !rememberedPhone && !incomingPhone ? 'other' : 'phone'
  );
  const [phoneInput, setPhoneInput] = useState(
    incomingPhone
      ? toLocalDigits(incomingPhone, region)
      : rememberedPhone
        ? toLocalDigits(rememberedPhone, region)
        : ''
  );
  const [otherInput, setOtherInput] = useState(rememberedEmail);
  const [password, setPassword] = useState('');
  const [supportsFingerprint, setSupportsFingerprint] = useState(false);
  const [supportsFaceId, setSupportsFaceId] = useState(false);

  useEffect(() => {
    const stored = incomingPhone || rememberedPhone;
    if (!stored) return;
    setPhoneInput((current) =>
      current ? current : toLocalDigits(stored, region)
    );
  }, [incomingPhone, rememberedPhone, region]);

  const loginMutation = useLoginMutation();
  const loginBiometricMutation = useLoginBiometricMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const biometricLabelColor = '#6D6D8C';
  const fingerprintBg = isDark ? '#1E3A2F' : '#AFE9D6';
  const fingerprintBorderColor = isDark ? '#2E5040' : '#D8C4FA';
  const avatarBg = isDark ? '#4A3A6A' : '#E5D8FB';
  const displayName = user?.firstName?.trim() ?? '';

  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) return;
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) return;
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setSupportsFaceId(
          types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
        );
        setSupportsFingerprint(
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        );
      } catch {}
    })();
  }, []);

  const identifier =
    inputMode === 'other'
      ? otherInput.trim()
      : toE164(phoneInput, region) || rememberedPhone;

  const identifierReady =
    inputMode === 'other' ? otherInput.trim().length >= 3 : isValidLocalPhone(phoneInput, region);

  const handleBiometric = async () => {
    const biometricId = rememberedPhone || (inputMode === 'phone' ? identifier : '');
    if (!biometricId) {
      Alert.alert(
        'Sign in first',
        'Enter the phone number you registered with, then use biometrics.'
      );
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use password',
      });
      if (result.success) {
        loginBiometricMutation.mutate(
          { phoneNumber: biometricId },
          {
            onSuccess: () => navigateAfterAuth(navigation),
            onError: (err) => {
              Alert.alert('Error', getApiErrorMessage(err, 'Biometric login failed. Please try again.'));
            },
          }
        );
      }
    } catch {
      Alert.alert('Error', 'Biometric authentication failed.');
    }
  };

  const handleLogin = () => {
    if (!identifierReady) {
      Alert.alert(
        'Required',
        inputMode === 'other'
          ? 'Enter the email or username you registered with.'
          : 'Enter the phone number you registered with.'
      );
      return;
    }
    if (password.length < 6) return;

    loginMutation.mutate(
      { identifier, password },
      {
        onSuccess: () => navigateAfterAuth(navigation),
        onError: (err) => {
          Alert.alert('Login Failed', getApiErrorMessage(err, 'Login failed. Please check your details.'));
        },
      }
    );
  };

  const isLoading = loginMutation.isPending || loginBiometricMutation.isPending;
  const canSubmit = identifierReady && password.length >= 6;

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
            paddingBottom: Math.max(insets.bottom, vs(32)),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { paddingHorizontal: hs(21) }]}>
          <Header
            onBack={() => navigation.goBack()}
            title={displayName ? `Welcome Back ${displayName}` : 'Welcome Back'}
            description="Please enter your password"
          />

          <View style={[styles.avatarWrap, { marginTop: vs(20) }]}>
            <View
              style={[
                styles.avatarCircle,
                {
                  width: vs(69),
                  height: vs(69),
                  borderRadius: vs(35),
                  backgroundColor: avatarBg,
                  shadowColor: '#E3B9F5',
                  shadowOpacity: 0.7,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 0 },
                },
              ]}
            >
              <Text style={{ fontSize: vs(32) }}>
                {displayName ? displayName[0].toUpperCase() : '😊'}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: vs(24), width: '100%' }}>
            {inputMode === 'phone' ? (
              <PhoneNumberField value={phoneInput} onChangeText={setPhoneInput} />
            ) : (
              <FormInput
                label="Email or Username"
                value={otherInput}
                onChangeText={setOtherInput}
                placeholder="you@email.com or @username"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            )}
            <Pressable
              onPress={() => {
                setInputMode((m) => (m === 'phone' ? 'other' : 'phone'));
                setPhoneInput('');
                setOtherInput('');
              }}
              style={{ marginTop: vs(8), alignSelf: 'flex-end' }}
              hitSlop={8}
            >
              <Text style={[styles.toggleLink, { color: isDark ? '#A0A0FF' : '#191970', fontSize: fs(11) }]}>
                {inputMode === 'phone' ? 'Use email or username instead' : 'Use phone number instead'}
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: vs(16), width: '100%' }}>
            <PasswordInput
              label="Enter password"
              value={password}
              onChangeText={setPassword}
              placeholder="********"
            />
          </View>

          {supportsFingerprint && (
            <View style={[styles.biometricWrap, { marginTop: vs(24) }]}>
              <Text style={[styles.biometricLabel, { color: biometricLabelColor, fontSize: fs(12) }]}>
                or use fingerprint
              </Text>
              <Pressable onPress={handleBiometric} style={[styles.fingerprintBtn, { marginTop: vs(12) }]}>
                <View
                  style={[
                    styles.fingerprintCircle,
                    {
                      width: vs(68),
                      height: vs(68),
                      borderRadius: vs(34),
                      backgroundColor: fingerprintBg,
                      borderColor: fingerprintBorderColor,
                      borderWidth: 4,
                    },
                  ]}
                >
                  <Image source={FINGERPRINT_IMG} style={{ width: vs(38), height: vs(38) }} resizeMode="contain" />
                </View>
              </Pressable>
            </View>
          )}

          {supportsFaceId && (
            <View style={[styles.biometricWrap, { marginTop: vs(20) }]}>
              <Text style={[styles.biometricLabel, { color: biometricLabelColor, fontSize: fs(12) }]}>
                Face ID
              </Text>
              <Pressable onPress={handleBiometric} style={[styles.fingerprintBtn, { marginTop: vs(12) }]}>
                <FaceIdIcon width={vs(40)} height={vs(40)} color={isDark ? '#FFFFFF' : '#000000'} />
              </Pressable>
            </View>
          )}

          <View style={styles.footer}>
            <PrimaryButton
              title={loginMutation.isPending ? 'Logging in…' : 'Continue'}
              onPress={handleLogin}
              disabled={!canSubmit || isLoading}
              style={!canSubmit ? styles.btnDisabled : undefined}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  inner: { flex: 1, alignItems: 'center' },
  avatarWrap: { alignItems: 'center' },
  avatarCircle: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  toggleLink: { fontWeight: '400', textDecorationLine: 'underline' },
  biometricWrap: { alignItems: 'center', width: '100%' },
  biometricLabel: { fontWeight: '400', textAlign: 'center' },
  fingerprintBtn: { alignItems: 'center', justifyContent: 'center' },
  fingerprintCircle: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8, width: '100%' },
  btnDisabled: { opacity: 0.6 },
});
