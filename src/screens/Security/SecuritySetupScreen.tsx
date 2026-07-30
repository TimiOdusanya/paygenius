import React, { useState } from 'react';
import {
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
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useSetupPinMutation } from '@/services/profile/profile.query';

const LOCK_ICON = require('../../../assets/images/auth/lock-icon.png');

type Props = NativeStackScreenProps<RootStackParamList, 'SecuritySetup'>;

export function SecuritySetupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms, hs } = useResponsive();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const setupPinMutation = useSetupPinMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#6D6D8C';
  const inputBg = isDark ? '#1E1E2E' : '#FAFAFC';
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const labelColor = isDark ? '#CCCCCC' : '#1A1D23';
  const placeholderColor = isDark ? 'rgba(133,133,133,0.6)' : 'rgba(133,133,133,0.6)';
  const linkColor = '#6D6D8C';
  const accentColor = '#191970';

  const handleContinue = () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match. Try again.');
      setConfirmPin('');
      return;
    }
    setError('');
    setupPinMutation.mutate(
      { pin, confirmPin: pin },
      {
        onSuccess: () => navigation.navigate('BiometricSetup'),
        onError: (err: any) => {
          Alert.alert('Error', err?.response?.data?.message ?? 'Failed to set up PIN.');
        },
      }
    );
  };

  const isValid = pin.length >= 4 && pin === confirmPin;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + vs(8),
            paddingBottom: Math.max(insets.bottom, vs(24)),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <View style={{ paddingHorizontal: hs(21) }}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        {/* Title */}
        <View style={[styles.titleBlock, { paddingHorizontal: hs(21), marginTop: vs(8), alignItems: 'center' }]}>
          <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, textAlign: 'center' }]}>
            Secure your wallet
          </Text>
          <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
            Create a transaction pin or use biometrics
          </Text>
        </View>

        {/* Key illustration */}
        <View style={[styles.iconWrap, { marginTop: vs(24) }]}>
          {/* Outer orbit circles */}
          <View
            style={[
              styles.orbitOuter,
              {
                width: ms(165),
                height: ms(165),
                borderRadius: ms(82),
                borderColor: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(213,199,247,0.4)',
                borderWidth: 1,
                borderStyle: 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={[
                styles.orbitInner,
                {
                  width: ms(146),
                  height: ms(146),
                  borderRadius: ms(73),
                  borderColor: isDark ? 'rgba(124,58,237,0.25)' : 'rgba(213,199,247,0.6)',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? 'rgba(175,233,220,0.1)' : 'rgba(198,240,226,0.3)',
                },
              ]}
            >
              <Image
                  source={LOCK_ICON}
                  style={{ width: ms(60), height: ms(60) }}
                  resizeMode="contain"
                />
            </View>
          </View>
        </View>

        {/* Enter your Pin */}
        <View style={[styles.fieldGroup, { marginTop: vs(16), paddingHorizontal: hs(22) }]}>
          <Text style={[styles.fieldLabel, { color: labelColor, fontSize: fs(11), letterSpacing: 0.25 }]}>
            Enter your Pin
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: isDark ? '#FFFFFF' : '#1A1D23',
                fontSize: fs(14),
                height: vs(44),
                borderRadius: ms(12),
                marginTop: vs(8),
                paddingHorizontal: hs(16),
              },
            ]}
            value={pin}
            onChangeText={(v) => { setPin(v); setError(''); }}
            placeholder="****"
            placeholderTextColor={placeholderColor}
            secureTextEntry
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Enter your Pin again */}
        <View style={[styles.fieldGroup, { marginTop: vs(8), paddingHorizontal: hs(22) }]}>
          <Text style={[styles.fieldLabel, { color: labelColor, fontSize: fs(11), letterSpacing: 0.25 }]}>
            Enter your Pin again
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: error ? '#FF4D4F' : inputBorder,
                color: isDark ? '#FFFFFF' : '#1A1D23',
                fontSize: fs(14),
                height: vs(44),
                borderRadius: ms(12),
                marginTop: vs(8),
                paddingHorizontal: hs(16),
              },
            ]}
            value={confirmPin}
            onChangeText={(v) => { setConfirmPin(v); setError(''); }}
            placeholder="****"
            placeholderTextColor={placeholderColor}
            secureTextEntry
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: '#FF4D4F', fontSize: fs(11), marginTop: vs(4), paddingHorizontal: hs(22) }]}>
            {error}
          </Text>
        ) : null}

        {/* Biometric links */}
        <View style={[styles.biometricLinks, { marginTop: vs(12) }]}>
          <Pressable onPress={() => navigation.navigate('BiometricSetup')}>
            <Text style={[styles.biometricText, { fontSize: fs(12), color: linkColor }]}>
              Click here to{' '}
              <Text style={{ color: accentColor, fontWeight: '500' }}>Set Biometrics</Text>
            </Text>
          </Pressable>
          <View style={{ marginTop: vs(8) }}>
            <Text style={[styles.biometricText, { fontSize: fs(12), color: linkColor }]}>
              Or{' '}
              <Text style={{ color: accentColor, fontWeight: '500' }}>Face ID</Text>
            </Text>
          </View>
          <View style={[styles.faceIdIcon, { marginTop: vs(8), backgroundColor: isDark ? '#2A1A4A' : '#EDE8FF', borderRadius: ms(8), padding: ms(8) }]}>
            <Text style={{ fontSize: ms(20) }}>🪪</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingHorizontal: hs(21), marginTop: vs(24) }]}>
            <PrimaryButton
                title={setupPinMutation.isPending ? 'Setting up...' : 'Continue'}
                onPress={handleContinue}
                disabled={!isValid || setupPinMutation.isPending}
                style={!isValid ? { opacity: 0.6 } : undefined}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  backBtn: { height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  titleBlock: {},
  title: { fontWeight: '600', textAlign: 'center' },
  subtitle: { fontWeight: '400', textAlign: 'center' },
  iconWrap: { alignItems: 'center' },
  orbitOuter: {},
  orbitInner: {},
  fieldGroup: {},
  fieldLabel: { fontWeight: '400' },
  input: {
    borderWidth: 0.4,
    fontWeight: '400',
  },
  errorText: { fontWeight: '400' },
  biometricLinks: { alignItems: 'center' },
  biometricText: { fontWeight: '400', textAlign: 'center' },
  faceIdIcon: { alignItems: 'center', justifyContent: 'center' },
  footer: {},
});
