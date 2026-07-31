import React, { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
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
  const { hs, vs, fs, ms } = useResponsive();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const avatarBg = isDark ? '#2E1A5E' : '#AFE9D6';
  const avatarBorder = isDark ? '#8855DD' : '#D8C4FA';
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const inputText = isDark ? '#FFFFFF' : '#000000';
  const placeholderColor = isDark ? 'rgba(133,133,133,0.6)' : 'rgba(133,133,133,0.6)';
  const dobBoxBg = inputBg;
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

  const formatDobPart = (type: 'day' | 'month' | 'year') => {
    if (!dob) return '';
    if (type === 'day') return String(dob.getDate()).padStart(2, '0');
    if (type === 'month') return dob.toLocaleString('en', { month: 'short' });
    return String(dob.getFullYear());
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

            {/* Date of Birth */}
            <View style={{ marginTop: vs(12) }}>
              <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(11) }]}>
                Date of Birth
              </Text>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View style={[styles.dobRow, { marginTop: vs(8) }]}>
                  {(['day', 'month', 'year'] as const).map((part) => (
                    <View
                      key={part}
                      style={[
                        styles.dobBox,
                        {
                          backgroundColor: dobBoxBg,
                          borderColor: inputBorder,
                          borderRadius: ms(12),
                          height: vs(44),
                          flex: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dobText,
                          {
                            color: dob ? inputText : placeholderColor,
                            fontSize: fs(11),
                          },
                        ]}
                      >
                        {dob ? formatDobPart(part) : (part === 'day' ? 'DD' : part === 'month' ? 'Month' : 'YYYY')}
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dob ?? new Date(2000, 0, 1)}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setDob(date);
              }}
            />
          )}

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
  fieldLabel: { fontWeight: '400', letterSpacing: 0.25 },
  dobRow: { flexDirection: 'row', gap: 12 },
  dobBox: { borderWidth: 0.4, alignItems: 'center', justifyContent: 'center' },
  dobText: { fontWeight: '400', textAlign: 'center' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
  btnDisabled: { opacity: 0.6 },
});
