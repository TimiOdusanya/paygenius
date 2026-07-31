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
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useLoginMutation, useLoginBiometricMutation } from '@/services/auth/auth.query';
import { navigateAfterAuth } from '@/navigation/navigateAfterAuth';
import { useAuthStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/errors';

const FINGERPRINT_IMG = require('../../../assets/images/auth/fingerprint.png');
const FACEID_IMG = require('../../../assets/images/auth/faceid-icon.png');

type BiometricType = 'fingerprint' | 'faceid' | null;
type Props = NativeStackScreenProps<RootStackParamList, 'LoginWithPassword'>;

export function LoginWithPasswordScreen({ navigation }: Props) {
  useTrackOnboardingRoute('LoginWithPassword');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>(null);

  const loginMutation = useLoginMutation();
  const loginBiometricMutation = useLoginBiometricMutation();
  const user = useAuthStore((s) => s.user);

  // When the user is already known, prefill identifier from the cache
  const cachedPhone = user?.phoneNumber ?? null;
  const hasKnownUser = !!cachedPhone;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#AAAAAA' : '#6D6D8C';
  const biometricLabelColor = '#6D6D8C';
  const fingerprintBg = isDark ? '#1E3A2F' : '#AFE9D6';
  const fingerprintBorderColor = isDark ? '#2E5040' : '#D8C4FA';

  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) return;
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) return;
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setHasBiometrics(true);
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('faceid');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        }
      } catch {}
    })();
  }, []);

  const handleBiometric = async () => {
    if (!cachedPhone) {
      Alert.alert('Error', 'No phone number found. Please enter your details below.');
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use password',
      });
      if (result.success) {
        loginBiometricMutation.mutate(
          { phoneNumber: cachedPhone },
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
    // When user is known use cached phone; otherwise use what they typed
    const loginIdentifier = hasKnownUser ? cachedPhone! : identifier.trim();
    if (!loginIdentifier) {
      Alert.alert('Required', 'Please enter your phone number, email, or username.');
      return;
    }
    if (password.length < 6) return;
    loginMutation.mutate(
      { identifier: loginIdentifier, password },
      {
        onSuccess: () => navigateAfterAuth(navigation),
        onError: (err) => {
          Alert.alert('Login Failed', getApiErrorMessage(err, 'Login failed. Please check your details.'));
        },
      }
    );
  };

  const isLoading = loginMutation.isPending || loginBiometricMutation.isPending;
  const displayName = user?.firstName ?? '';

  // Button enabled when: known user → just need password; unknown → need both fields
  const canSubmit = hasKnownUser
    ? password.length >= 6
    : identifier.trim().length >= 3 && password.length >= 6;

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
            title={displayName ? `Welcome back, ${displayName}` : 'Welcome back'}
            description="Enter your password to continue"
          />

          {/* Avatar — only when we know who the user is */}
          {hasKnownUser && (
            <View style={[styles.avatarWrap, { marginTop: vs(20) }]}>
              <View
                style={[
                  styles.avatarCircle,
                  {
                    width: vs(69),
                    height: vs(69),
                    borderRadius: vs(35),
                    backgroundColor: isDark ? '#4A3A6A' : '#E5D8FB',
                  },
                ]}
              >
                <Text style={{ fontSize: vs(32) }}>
                  {displayName ? displayName[0].toUpperCase() : '😊'}
                </Text>
              </View>
              {displayName ? (
                <Text style={[styles.userName, { color: titleColor, fontSize: fs(14), marginTop: vs(8) }]}>
                  Hi, {displayName}
                </Text>
              ) : null}
            </View>
          )}

          {/* Identifier field — shown only when the device has no cached user */}
          {!hasKnownUser && (
            <View style={{ marginTop: vs(24), width: '100%' }}>
              <Text style={[styles.noAccountNote, { color: subtitleColor, fontSize: fs(12) }]}>
                Enter your phone number, email, or username to log in.
              </Text>
              <View style={{ marginTop: vs(12) }}>
                <FormInput
                  label="Phone / Email / Username"
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="+2348012345678 or you@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          {/* Password field */}
          <View style={{ marginTop: vs(hasKnownUser ? 24 : 12), width: '100%' }}>
            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />
          </View>

          {/* Biometric — only when user is already known */}
          {hasKnownUser && hasBiometrics && biometricType === 'fingerprint' && (
            <View style={[styles.biometricWrap, { marginTop: vs(20) }]}>
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

          {hasKnownUser && hasBiometrics && biometricType === 'faceid' && (
            <View style={[styles.biometricWrap, { marginTop: vs(20) }]}>
              <Text style={[styles.biometricLabel, { color: biometricLabelColor, fontSize: fs(12) }]}>
                Face ID
              </Text>
              <Pressable onPress={handleBiometric} style={[styles.fingerprintBtn, { marginTop: vs(12) }]}>
                <View
                  style={[
                    styles.fingerprintCircle,
                    {
                      width: vs(68),
                      height: vs(68),
                      borderRadius: vs(34),
                      backgroundColor: isDark ? '#3A2A6A' : '#E5D8FB',
                      borderColor: fingerprintBorderColor,
                      borderWidth: 4,
                    },
                  ]}
                >
                  <Image source={FACEID_IMG} style={{ width: vs(40), height: vs(40) }} resizeMode="contain" />
                </View>
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
  userName: { fontWeight: '500', textAlign: 'center' },
  noAccountNote: { textAlign: 'center', fontWeight: '400', lineHeight: 20 },
  biometricWrap: { alignItems: 'center', width: '100%' },
  biometricLabel: { fontWeight: '400', textAlign: 'center' },
  fingerprintBtn: { alignItems: 'center', justifyContent: 'center' },
  fingerprintCircle: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8, width: '100%' },
  btnDisabled: { opacity: 0.6 },
});
