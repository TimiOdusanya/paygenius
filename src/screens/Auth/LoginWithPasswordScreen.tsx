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
import { PasswordInput } from '@/components/FormInput';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useLoginMutation, useLoginBiometricMutation } from '@/services/auth/auth.query';
import { useAuthStore } from '@/stores';

const FINGERPRINT_IMG = require('../../../assets/images/auth/fingerprint.png');
const FACEID_IMG = require('../../../assets/images/auth/faceid-icon.png');

type BiometricType = 'fingerprint' | 'faceid' | null;
type Props = NativeStackScreenProps<RootStackParamList, 'LoginWithPassword'>;

export function LoginWithPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [password, setPassword] = useState('');
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>(null);

  const loginMutation = useLoginMutation();
  const loginBiometricMutation = useLoginBiometricMutation();
  const user = useAuthStore((s) => s.user);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
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
    if (!user?.phoneNumber) {
      Alert.alert('Error', 'No phone number associated with your account.');
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use password',
      });
      if (result.success) {
        loginBiometricMutation.mutate(
          { phoneNumber: user.phoneNumber },
          {
            onSuccess: () => navigation.replace('Main'),
            onError: (err: any) => {
              Alert.alert('Error', err?.response?.data?.message ?? 'Biometric login failed.');
            },
          }
        );
      }
    } catch {
      Alert.alert('Error', 'Biometric authentication failed.');
    }
  };

  const handleLogin = () => {
    if (password.length < 6) return;
    const phoneNumber = user?.phoneNumber;
    if (!phoneNumber) {
      Alert.alert('Error', 'No phone number found. Please log in again.');
      return;
    }
    loginMutation.mutate(
      { phoneNumber, password },
      {
        onSuccess: () => navigation.replace('Main'),
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Login failed. Please check your password.';
          Alert.alert('Login Failed', msg);
        },
      }
    );
  };

  const isLoading = loginMutation.isPending || loginBiometricMutation.isPending;
  const displayName = user?.firstName ? `${user.firstName}` : 'there';

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
          {/* Back */}
          <BackButton onPress={() => navigation.goBack()} />

          {/* Title block */}
          <View style={[styles.titleBlock, { marginTop: vs(16) }]}>
            <Text
              style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20) }]}
            >
              Welcome Back {displayName}
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4) }]}>
              Please enter your password
            </Text>
          </View>

          {/* Avatar */}
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
                {user?.firstName ? user.firstName[0].toUpperCase() : '😊'}
              </Text>
            </View>
            {user?.firstName && (
              <Text style={[styles.userName, { color: titleColor, fontSize: fs(14), marginTop: vs(8) }]}>
                Hi, {displayName}
              </Text>
            )}
          </View>

          {/* Password field */}
          <View style={{ marginTop: vs(24), width: '100%' }}>
            <PasswordInput
              label="Enter password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />
          </View>

          {/* Biometric section - fingerprint */}
          {hasBiometrics && biometricType === 'fingerprint' && (
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
                  <Image
                    source={FINGERPRINT_IMG}
                    style={{ width: vs(38), height: vs(38) }}
                    resizeMode="contain"
                  />
                </View>
              </Pressable>
            </View>
          )}

          {/* Biometric section - Face ID */}
          {hasBiometrics && biometricType === 'faceid' && (
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
                  <Image
                    source={FACEID_IMG}
                    style={{ width: vs(40), height: vs(40) }}
                    resizeMode="contain"
                  />
                </View>
              </Pressable>
            </View>
          )}

          <View style={styles.footer}>
            <PrimaryButton
              title={loginMutation.isPending ? 'Logging in...' : 'Continue'}
              onPress={handleLogin}
              disabled={password.length < 6 || isLoading}
              style={password.length < 6 ? styles.btnDisabled : undefined}
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
  backBtn: { width: '100%', height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  titleBlock: { alignItems: 'center', width: '100%' },
  title: { fontWeight: '600', textAlign: 'center' },
  subtitle: { fontWeight: '400', textAlign: 'center' },
  avatarWrap: { alignItems: 'center' },
  avatarCircle: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  userName: { fontWeight: '500', textAlign: 'center' },
  biometricWrap: { alignItems: 'center', width: '100%' },
  biometricLabel: { fontWeight: '400', textAlign: 'center' },
  fingerprintBtn: { alignItems: 'center', justifyContent: 'center' },
  fingerprintCircle: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8, width: '100%' },
  btnDisabled: { opacity: 0.6 },
});
