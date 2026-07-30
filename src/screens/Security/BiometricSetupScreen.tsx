import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useEnableBiometricMutation } from '@/services/profile/profile.query';

const FINGERPRINT_IMG = require('../../../assets/images/auth/fingerprint.png');
const FACEID_IMG = require('../../../assets/images/auth/faceid-icon.png');

type BiometricType = 'fingerprint' | 'faceid' | 'none';
type Props = NativeStackScreenProps<RootStackParamList, 'BiometricSetup'>;

export function BiometricSetupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [biometricType, setBiometricType] = useState<BiometricType>('none');

  const enableBiometricMutation = useEnableBiometricMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const innerBg = isDark ? '#1E3A2F' : '#AFE9D6';
  const outerBorder = isDark ? '#2E5040' : '#D8C4FA';

  useEffect(() => {
    (async () => {
      try {
        const hasHw = await LocalAuthentication.hasHardwareAsync();
        if (!hasHw) return;
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) return;
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('faceid');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        }
      } catch {}
    })();
  }, []);

  const isFaceId = biometricType === 'faceid';
  const isFingerprint = biometricType === 'fingerprint';
  const hasBiometric = biometricType !== 'none';

  const handleEnable = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${isFaceId ? 'Face ID' : 'fingerprint'} login`,
        fallbackLabel: 'Use PIN',
      });
      if (result.success) {
        enableBiometricMutation.mutate(undefined, {
          onSuccess: () => navigation.replace('AccountCreated'),
          onError: () => navigation.replace('AccountCreated'),
        });
      } else {
        navigation.replace('AccountCreated');
      }
    } catch {
      navigation.replace('AccountCreated');
    }
  };

  const handleSkip = () => {
    navigation.replace('AccountCreated');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: insets.top + vs(24),
          paddingBottom: Math.max(insets.bottom, vs(24)),
        },
      ]}
    >
      <View style={[styles.inner, { paddingHorizontal: hs(21) }]}>
        {/* Back */}
        <BackButton onPress={() => navigation.goBack()} />

        {/* Title */}
        <View style={{ marginTop: vs(16), alignItems: 'center' }}>
          <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20), textAlign: 'center' }]}>
            {isFaceId ? 'Face ID' : 'Biometrics'}
          </Text>
          <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
            {isFaceId ? 'Set your face ID' : 'Click on your finger print sensor'}
          </Text>
        </View>

        {/* Biometric illustration */}
        <View style={[styles.illustrationWrap, { marginTop: vs(40) }]}>
          <View
            style={[
              styles.outerRing,
              {
                width: vs(165),
                height: vs(165),
                borderRadius: vs(82),
                borderColor: outerBorder,
              },
            ]}
          >
            <View
              style={[
                styles.innerRing,
                {
                  width: vs(128),
                  height: vs(128),
                  borderRadius: vs(64),
                  backgroundColor: innerBg,
                  borderColor: outerBorder,
                },
              ]}
            >
              {isFaceId ? (
                <Image
                  source={FACEID_IMG}
                  style={{ width: vs(60), height: vs(60) }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={FINGERPRINT_IMG}
                  style={{ width: vs(60), height: vs(60) }}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
        </View>

        {/* Description */}
        <Text
          style={[
            styles.description,
            {
              color: subtitleColor,
              fontSize: fs(12),
              textAlign: 'center',
              marginTop: vs(24),
              lineHeight: fs(18),
            },
          ]}
        >
          {isFaceId
            ? 'Use your Face ID for quick and secure access to your account'
            : 'Use your fingerprint for quick and secure access to your account'}
        </Text>

        {/* Buttons */}
        <View style={styles.footer}>
          {hasBiometric ? (
            <PrimaryButton
              title={
                enableBiometricMutation.isPending
                  ? 'Setting up...'
                  : isFaceId
                  ? 'Enable Face ID'
                  : 'Enable Fingerprint'
              }
              onPress={handleEnable}
              disabled={enableBiometricMutation.isPending}
            />
          ) : (
            <PrimaryButton title="Skip" onPress={handleSkip} />
          )}
          {hasBiometric && (
            <Pressable onPress={handleSkip} style={{ marginTop: vs(12), alignItems: 'center' }}>
              <Text style={{ color: subtitleColor, fontSize: fs(12) }}>Skip for now</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400' },
  illustrationWrap: { alignItems: 'center' },
  outerRing: { borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  innerRing: { borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  description: { fontWeight: '400' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
});
