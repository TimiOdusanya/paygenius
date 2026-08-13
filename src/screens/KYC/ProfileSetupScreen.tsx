import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { DateOfBirthField } from '@/components/DateOfBirthField';
import { FormInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import {
  useCheckUsernameQuery,
  useSetupProfileMutation,
} from '@/services/profile/profile.query';
import { getApiErrorMessage } from '@/utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

function normalizeUsername(value: string) {
  return value.trim().replace(/^@+/, '');
}

export function ProfileSetupScreen({ navigation }: Props) {
  useTrackOnboardingRoute('ProfileSetup');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [dob, setDob] = useState<Date | null>(null);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const avatarBg = isDark ? '#2E1A5E' : '#AFE9D6';
  const avatarBorder = isDark ? '#8855DD' : '#D8C4FA';
  const availableColor = isDark ? '#6EE7B7' : '#059669';
  const takenColor = isDark ? '#FCA5A5' : '#DC2626';
  const checkingColor = isDark ? '#CCCCCC' : '#858585';

  const normalizedUsername = normalizeUsername(username);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(normalizedUsername);
    }, 400);
    return () => clearTimeout(timer);
  }, [normalizedUsername]);

  const usernameFormatValid =
    normalizedUsername.length >= 3 &&
    normalizedUsername.length <= 30 &&
    USERNAME_REGEX.test(normalizedUsername);

  const {
    data: usernameCheck,
    isFetching: isCheckingUsername,
    isError: usernameCheckError,
  } = useCheckUsernameQuery(debouncedUsername, {
    enabled: usernameFormatValid && debouncedUsername === normalizedUsername,
  });

  const usernameStatus = (() => {
    if (!normalizedUsername) return null;
    if (normalizedUsername.length < 3) {
      return { message: 'Username must be at least 3 characters', color: checkingColor };
    }
    if (!USERNAME_REGEX.test(normalizedUsername) || normalizedUsername.length > 30) {
      return {
        message: 'Only letters, numbers, and underscores (3–30 characters)',
        color: takenColor,
      };
    }
    if (debouncedUsername !== normalizedUsername || isCheckingUsername) {
      return { message: 'Checking availability…', color: checkingColor };
    }
    if (usernameCheckError) {
      return { message: 'Could not check username. Try again.', color: takenColor };
    }
    const reason = usernameCheck?.data?.reason;
    if (reason === 'taken') {
      return { message: 'Username is already taken', color: takenColor };
    }
    if (reason === 'invalid') {
      return {
        message: 'Only letters, numbers, and underscores (3–30 characters)',
        color: takenColor,
      };
    }
    if (reason === 'available' || usernameCheck?.data?.available) {
      return { message: 'Username is available', color: availableColor };
    }
    return null;
  })();

  const usernameAvailable =
    usernameFormatValid &&
    debouncedUsername === normalizedUsername &&
    !isCheckingUsername &&
    !usernameCheckError &&
    Boolean(usernameCheck?.data?.available);

  const setupProfileMutation = useSetupProfileMutation();

  const isReady =
    Boolean(firstName.trim() && lastName.trim() && dob) && usernameAvailable;

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
            title="Set up your Profile"
            description="Fill the following details"
          />

          {/* Avatar illustration */}
          <View style={[styles.illustrationWrap, { marginTop: vs(20) }]}>
            <View style={[styles.outerRing, { width: vs(165), height: vs(165), borderRadius: vs(82), borderColor: isDark ? '#6633CC' : '#D8C4FA', borderStyle: 'dashed' }]}>
              <View style={[styles.innerRing, { width: vs(145), height: vs(145), borderRadius: vs(72), borderColor: avatarBorder }]}>
                <View style={[styles.avatar, { width: vs(109), height: vs(109), borderRadius: vs(55), backgroundColor: avatarBg, borderColor: avatarBorder }]}>
                  <Ionicons name="person" size={vs(48)} color={isDark ? '#8855DD' : '#7C3AED'} />
                </View>
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={[styles.form, { marginTop: vs(16) }]}>
            <FormInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              autoCapitalize="words"
            />
            <FormInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              autoCapitalize="words"
              containerStyle={{ marginTop: vs(12) }}
            />
            <FormInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginTop: vs(12) }}
            />
            {usernameStatus ? (
              <Text
                style={{
                  marginTop: vs(6),
                  marginLeft: hs(2),
                  fontSize: fs(11),
                  fontWeight: '400',
                  color: usernameStatus.color,
                }}
              >
                {usernameStatus.message}
              </Text>
            ) : null}

            <View style={{ marginTop: vs(12) }}>
              <DateOfBirthField value={dob} onChange={setDob} />
            </View>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title="Continue"
              onPress={() => {
                if (!isReady || !dob || !usernameAvailable) return;
                setupProfileMutation.mutate(
                  {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: normalizedUsername,
                    dateOfBirth: dob.toISOString(),
                  },
                  {
                    onSuccess: () => navigation.navigate('AddressVerification'),
                    onError: (err) => {
                      Alert.alert(
                        'Error',
                        getApiErrorMessage(err, 'Profile setup failed. Please try again.')
                      );
                    },
                  }
                );
              }}
              disabled={!isReady || setupProfileMutation.isPending}
              style={!isReady ? styles.btnDisabled : undefined}
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
  illustrationWrap: { alignItems: 'center' },
  outerRing: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  innerRing: { borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  avatar: { borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  form: {},
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
  btnDisabled: { opacity: 0.6 },
});
