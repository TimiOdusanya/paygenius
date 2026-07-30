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
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { FormInput } from '@/components/FormInput';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useVerifyAddressMutation } from '@/services/profile/profile.query';

const STATES_NG = ['Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

type Props = NativeStackScreenProps<RootStackParamList, 'AddressVerification'>;

export function AddressVerificationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const avatarBg = isDark ? '#2E4A4A' : '#AFE9D6';
  const avatarBorder = isDark ? '#8855DD' : '#D8C4FA';
  const selectBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const selectBorder = isDark ? '#3B3B3B' : '#191970';
  const selectText = isDark ? '#FFFFFF' : '#1A1D23';
  const placeholderText = isDark ? 'rgba(133,133,133,0.6)' : 'rgba(133,133,133,0.6)';

  const verifyAddressMutation = useVerifyAddressMutation();

  const isReady = houseNumber.trim() && streetName.trim() && state.trim() && lga.trim();

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
              Verify Address
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
              Help us confirm your address
            </Text>
          </View>

          {/* Location illustration */}
          <View style={[styles.illustrationWrap, { marginTop: vs(20) }]}>
            <View style={[styles.outerRing, { width: vs(165), height: vs(165), borderRadius: vs(82), borderColor: isDark ? '#6633CC' : '#D8C4FA', borderStyle: 'dashed' }]}>
              <View style={[styles.avatar, { width: vs(109), height: vs(109), borderRadius: vs(55), backgroundColor: avatarBg, borderColor: avatarBorder }]}>
                <Ionicons name="location" size={vs(52)} color={isDark ? '#8855DD' : '#7C3AED'} />
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={[styles.form, { marginTop: vs(16) }]}>
            <FormInput
              label="House Number"
              value={houseNumber}
              onChangeText={setHouseNumber}
              placeholder="14"
              keyboardType="number-pad"
            />
            <FormInput
              label="Street Name"
              value={streetName}
              onChangeText={setStreetName}
              placeholder="Broad street"
              autoCapitalize="words"
              containerStyle={{ marginTop: vs(12) }}
            />

            {/* State Selector */}
            <View style={{ marginTop: vs(12) }}>
              <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(11) }]}>
                State
              </Text>
              <Pressable
                style={[
                  styles.selectBox,
                  {
                    backgroundColor: selectBg,
                    borderColor: selectBorder,
                    height: vs(44),
                    borderRadius: ms(12),
                    marginTop: vs(5),
                  },
                ]}
                onPress={() => {}}
              >
                <Text style={[styles.selectText, { color: state ? selectText : placeholderText, fontSize: fs(11), flex: 1 }]}>
                  {state || 'Lagos State'}
                </Text>
                <Text style={{ color: selectText, fontSize: fs(12) }}>▾</Text>
              </Pressable>
            </View>

            {/* LGA Selector */}
            <View style={{ marginTop: vs(12) }}>
              <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(11) }]}>
                Local Government Area
              </Text>
              <Pressable
                style={[
                  styles.selectBox,
                  {
                    backgroundColor: selectBg,
                    borderColor: selectBorder,
                    height: vs(44),
                    borderRadius: ms(12),
                    marginTop: vs(5),
                  },
                ]}
                onPress={() => {}}
              >
                <Text style={[styles.selectText, { color: lga ? selectText : placeholderText, fontSize: fs(10), flex: 1 }]}>
                  {lga || 'Lagos Island East'}
                </Text>
                <Text style={{ color: selectText, fontSize: fs(12) }}>▾</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title="Continue"
              onPress={() => {
                if (!isReady) return;
                verifyAddressMutation.mutate(
                  {
                    houseNumber: houseNumber.trim(),
                    streetName: streetName.trim(),
                    city: state.trim(),
                    state: state.trim(),
                    localGovernmentArea: lga.trim(),
                  },
                  {
                    onSuccess: () => navigation.navigate('IdentityVerification'),
                    onError: (err: any) => {
                      Alert.alert('Error', err?.response?.data?.message ?? 'Address verification failed.');
                    },
                  }
                );
              }}
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
  avatar: { borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  form: {},
  fieldLabel: { fontWeight: '400', letterSpacing: 0.25 },
  selectBox: { borderWidth: 0.4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  selectText: { fontWeight: '400' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
});
