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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PasswordInput } from '@/components/FormInput';
import { BackButton } from '@/components/BackButton';
import { PasswordStrengthBar, getPasswordStrength } from '@/components/PasswordStrengthBar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useRegisterMutation } from '@/services/auth/auth.query';

const LOCK_ICON = require('../../../assets/images/auth/lock-icon.png');

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePassword'>;

export function CreatePasswordScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMismatch, setShowMismatch] = useState(false);

  const registerMutation = useRegisterMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const hintColor = isDark ? '#666666' : '#C4C4C4';

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
          navigation.navigate('ProfileIntroduction');
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Registration failed. Please try again.';
          Alert.alert('Error', msg);
        },
      }
    );
  };

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
          {/* Back */}
          <BackButton onPress={() => navigation.goBack()} />

          {/* Title */}
          <View style={{ marginTop: vs(16), alignItems: 'center' }}>
            <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20), textAlign: 'center' }]}>
              Create your password
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
              At least 8–12 characters
            </Text>
          </View>

          {/* Illustration – dashed ring + inner circle + lock icon */}
          <View style={[styles.illustrationWrap, { marginTop: vs(24), height: vs(168) }]}>
            <View style={[
              styles.illustrationOuter,
              {
                width: vs(165),
                height: vs(165),
                borderRadius: vs(82),
                borderColor: isDark ? '#6633CC' : '#D8C4FA',
                borderStyle: 'dashed',
              }
            ]}>
              <View style={[
                styles.illustrationInner,
                {
                  width: vs(109),
                  height: vs(109),
                  borderRadius: vs(55),
                  backgroundColor: isDark ? '#2E1A5E' : '#AFE9D6',
                  borderColor: isDark ? '#8855DD' : '#D8C4FA',
                }
              ]}>
                <Image
                  source={LOCK_ICON}
                  style={{ width: vs(60), height: vs(60) }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* Password fields */}
          <View style={[styles.form, { marginTop: vs(28) }]}>
            <PasswordInput
              label="Enter password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
            />

            {/* Strength bar */}
            <View style={{ marginTop: vs(8) }}>
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
              containerStyle={{ marginTop: vs(16) }}
            />

            {/* Error state */}
            {showMismatch && (
              <View style={[styles.errorCard, { marginTop: vs(12) }]}>
                <Text style={[styles.errorTitle, { fontSize: fs(14) }]}>Error</Text>
                <Text style={[styles.errorMsg, { fontSize: fs(10) }]}>Password does not match</Text>
              </View>
            )}

            {/* Hint */}
            <View style={{ marginTop: vs(16) }}>
              <Text style={[styles.hint, { color: hintColor, fontSize: fs(10) }]}>
                {'Your Password should include:\n1 Uppercase letter\n1 Number\n1 Special Character'}
              </Text>
            </View>
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
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400' },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationOuter: {
    borderWidth: 1,
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
  hint: { fontWeight: '400', lineHeight: 16 },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
  btnDisabled: { opacity: 0.6 },
});
