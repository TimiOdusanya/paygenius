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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { FormInput } from '@/components/FormInput';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useSetupProfileMutation } from '@/services/profile/profile.query';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

export function ProfileSetupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const avatarBg = isDark ? '#2E1A5E' : '#AFE9D6';
  const avatarBorder = isDark ? '#8855DD' : '#D8C4FA';
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const inputText = isDark ? '#FFFFFF' : '#000000';
  const placeholderColor = isDark ? 'rgba(133,133,133,0.6)' : 'rgba(133,133,133,0.6)';
  const dobBoxBg = inputBg;

  const setupProfileMutation = useSetupProfileMutation();

  const isReady = firstName.trim() && lastName.trim() && username.trim() && dob;

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
          {/* Back */}
          <BackButton onPress={() => navigation.goBack()} />

          {/* Title */}
          <View style={{ marginTop: vs(16), alignItems: 'center' }}>
            <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20), textAlign: 'center' }]}>
              Set up your Profile
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
              Fill the following details
            </Text>
          </View>

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
              containerStyle={{ marginTop: vs(12) }}
            />

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
                if (!isReady || !dob) return;
                setupProfileMutation.mutate(
                  {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.trim(),
                    dateOfBirth: dob.toISOString(),
                  },
                  {
                    onSuccess: () => navigation.navigate('AddressVerification'),
                    onError: (err: any) => {
                      Alert.alert('Error', err?.response?.data?.message ?? 'Profile setup failed.');
                    },
                  }
                );
              }}
              disabled={!isReady}
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
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400' },
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
