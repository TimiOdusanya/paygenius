import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PasswordInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { PasswordStrengthBar, getPasswordStrength } from '@/components/PasswordStrengthBar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useRegisterMutation } from '@/services/auth/auth.query';
import { usePreferencesStore } from '@/stores/preferences.store';
import { getApiErrorMessage } from '@/utils/errors';
import LockGlyph from '../../../assets/images/auth/lock-glyph.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePassword'>;

export function CreatePasswordScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  useTrackOnboardingRoute('CreatePassword', { phoneNumber });
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMismatch, setShowMismatch] = useState(false);

  const registerMutation = useRegisterMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const outerRing = isDark ? '#6633CC' : '#D8C4FA';
  const innerBg = isDark ? '#2E1A5E' : '#AFE9D6';
  const innerBorder = isDark ? '#8855DD' : '#D8C4FA';

  const strength = getPasswordStrength(password);
  const isReady = password.length >= 6 && strength !== 'weak';
  const passwordsMatch = password === confirmPassword;

  const handleContinue = () => {
    if (!isReady) return;
    if (!confirmPassword) return;
    if (!passwordsMatch) {
      setShowMismatch(true);
      return;
    }
    setShowMismatch(false);
    registerMutation.mutate(
      { phoneNumber, password },
      {
        onSuccess: () => {
          usePreferencesStore.getState().clearRegistrationProgress();
          navigation.navigate('ProfileIntroduction');
        },
        onError: (err) => {
          Alert.alert(
            'Error',
            getApiErrorMessage(err, 'Registration failed. Please try again.')
          );
        },
      }
    );
  };

  const outerSize = ms(165);
  const innerSize = ms(109);

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
            title="Create your password"
            description="At least 8–12 characters"
          />

          {/* Dashed orbit + filled circle + lock glyph (Figma 1:9150) */}
          <View style={[styles.illustrationWrap, { marginTop: vs(24), height: outerSize }]}>
            <View
              style={[
                styles.illustrationOuter,
                {
                  width: outerSize,
                  height: outerSize,
                  borderRadius: outerSize / 2,
                  borderColor: outerRing,
                },
              ]}
            >
              <View
                style={[
                  styles.illustrationInner,
                  {
                    width: innerSize,
                    height: innerSize,
                    borderRadius: innerSize / 2,
                    backgroundColor: innerBg,
                    borderColor: innerBorder,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 2,
                    elevation: 4,
                  },
                ]}
              >
                <LockGlyph width={ms(40)} height={ms(49)} />
              </View>
            </View>
          </View>

          <View style={[styles.form, { marginTop: vs(28) }]}>
            <PasswordInput
              label="Enter password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />

            {/* Strength checker sits directly under the first password field */}
            <View style={{ marginTop: vs(8), minHeight: vs(28) }}>
              <PasswordStrengthBar strength={strength} />
            </View>

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setShowMismatch(false);
              }}
              placeholder="••••••••"
              containerStyle={{ marginTop: vs(12) }}
            />

            {showMismatch && (
              <View style={[styles.errorCard, { marginTop: vs(12) }]}>
                <Text style={[styles.errorTitle, { fontSize: fs(14) }]}>Error</Text>
                <Text style={[styles.errorMsg, { fontSize: fs(10) }]}>
                  Password does not match
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={registerMutation.isPending ? 'Creating account...' : 'Continue'}
              onPress={handleContinue}
              style={!isReady ? styles.btnDisabled : undefined}
              disabled={!isReady || registerMutation.isPending}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  inner: { flex: 1 },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationOuter: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationInner: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {},
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  errorTitle: {
    color: '#FF4D4F',
    fontWeight: '400',
    marginTop: 8,
  },
  errorMsg: {
    color: '#FF8283',
    fontWeight: '400',
    marginTop: 4,
  },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
  btnDisabled: { opacity: 0.6 },
});
