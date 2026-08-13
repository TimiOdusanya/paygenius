import React, { useState } from 'react';
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
import { FormInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useSetupPinMutation } from '@/services/profile/profile.query';
import { getApiErrorMessage } from '@/utils/errors';
import WalletKey from '../../../assets/images/security/wallet-key.svg';
import WalletRings from '../../../assets/images/security/wallet-rings.svg';
import FaceIdIcon from '../../../assets/images/security/faceid-icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SecuritySetup'>;

const PIN_LENGTH = 4;

function digitsOnly(value: string) {
  return value.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
}

export function SecuritySetupScreen({ navigation }: Props) {
  useTrackOnboardingRoute('SecuritySetup');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms, hs } = useResponsive();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const setupPinMutation = useSetupPinMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const linkColor = isDark ? '#CCCCCC' : '#6D6D8C';
  const accentColor = isDark ? '#A78BFA' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#6D6D8C';

  const goToBiometrics = () => navigation.navigate('BiometricSetup');

  const handleContinue = () => {
    if (pin.length < PIN_LENGTH) {
      setError('PIN must be 4 digits');
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
        onError: (err) => {
          Alert.alert(
            'Error',
            getApiErrorMessage(err, 'Failed to set up PIN. Please try again.')
          );
        },
      }
    );
  };

  const isValid = pin.length === PIN_LENGTH && pin === confirmPin;

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
        <View style={{ paddingHorizontal: hs(21) }}>
          <Header
            onBack={() => navigation.goBack()}
            title="Secure your wallet"
            description="Create a transaction pin or use biometrics"
            descriptionColor={subtitleColor}
          />
        </View>

        <View style={[styles.iconWrap, { marginTop: vs(24) }]}>
          <WalletRings width={ms(164)} height={ms(165)} />
          <View style={styles.keyOverlay} pointerEvents="none">
            <WalletKey width={ms(109)} height={ms(109)} />
          </View>
        </View>

        <View
          style={{
            marginTop: vs(12),
            paddingHorizontal: hs(21),
            gap: vs(4),
          }}
        >
          <FormInput
            label="Enter your Pin"
            value={pin}
            onChangeText={(v) => {
              setPin(digitsOnly(v));
              setError('');
            }}
            placeholder="****"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            textContentType="oneTimeCode"
          />
          <FormInput
            label="Enter your Pin again"
            value={confirmPin}
            onChangeText={(v) => {
              setConfirmPin(digitsOnly(v));
              setError('');
            }}
            placeholder="****"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            textContentType="oneTimeCode"
          />
        </View>

        {error ? (
          <Text
            style={[
              styles.errorText,
              {
                color: '#FF4D4F',
                fontSize: fs(11),
                marginTop: vs(4),
                paddingHorizontal: hs(21),
              },
            ]}
          >
            {error}
          </Text>
        ) : null}

        <View style={[styles.biometricLinks, { marginTop: vs(28) }]}>
          <Pressable onPress={goToBiometrics} hitSlop={8}>
            <Text style={[styles.biometricText, { fontSize: fs(12), color: linkColor }]}>
              Click here to{' '}
              <Text style={{ color: accentColor }}>Set Biometrics</Text>
            </Text>
          </Pressable>
          <Pressable
            onPress={goToBiometrics}
            hitSlop={8}
            style={{ marginTop: vs(20) }}
          >
            <Text style={[styles.biometricText, { fontSize: fs(12), color: linkColor }]}>
              Or <Text style={{ color: accentColor }}>Face ID</Text>
            </Text>
          </Pressable>
          <Pressable
            onPress={goToBiometrics}
            style={{ marginTop: vs(12) }}
            hitSlop={8}
          >
            <FaceIdIcon width={ms(31)} height={ms(31)} />
          </Pressable>
        </View>

        <View
          style={[
            styles.footer,
            {
              paddingHorizontal: hs(21),
              paddingTop: vs(24),
            },
          ]}
        >
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
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { fontWeight: '400' },
  biometricLinks: { alignItems: 'center' },
  biometricText: { fontWeight: '400', textAlign: 'center' },
  footer: { marginTop: 'auto' },
});
