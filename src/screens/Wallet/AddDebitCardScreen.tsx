import React, { useState } from 'react';
import {
  Alert,
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
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDebitCard'>;

interface FormInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  secureTextEntry?: boolean;
  isDark: boolean;
  ms: (n: number) => number;
  vs: (n: number) => number;
  fs: (n: number) => number;
  hs: (n: number) => number;
  showToggle?: boolean;
  maskPrefix?: string;
}

function FormInputField({
  label, value, onChangeText, placeholder, keyboardType = 'default',
  secureTextEntry = false, isDark, ms, vs, fs, hs, showToggle = false, maskPrefix,
}: FormInputFieldProps) {
  const [visible, setVisible] = useState(!secureTextEntry);
  const inputBg = isDark ? '#1A1A1A' : '#FAFAFC';
  const inputBorder = isDark ? '#4A4A8A' : '#191970';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';
  const labelColor = isDark ? '#FFFFFF' : '#000000';
  const placeholderColor = 'rgba(133,133,133,0.7)';

  return (
    <View style={{ marginBottom: vs(16) }}>
      <Text style={[styles.fieldLabel, { color: labelColor, fontSize: fs(11) }]}>
        {label}
      </Text>
      <View style={[
        styles.fieldWrap,
        {
          backgroundColor: inputBg,
          borderColor: inputBorder,
          borderWidth: 0.4,
          borderRadius: ms(12),
          height: vs(44),
          marginTop: vs(8),
        },
      ]}>
        {maskPrefix && (
          <Text style={[styles.maskPrefix, { color: placeholderColor, fontSize: fs(11), paddingLeft: hs(16) }]}>
            {maskPrefix}
          </Text>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !visible}
          style={[
            styles.fieldInput,
            {
              flex: 1,
              color: textColor,
              fontSize: fs(11),
              paddingHorizontal: hs(16),
              height: '100%',
            },
          ]}
        />
        {showToggle && (
          <Pressable onPress={() => setVisible((v) => !v)} style={{ paddingHorizontal: hs(12) }} hitSlop={8}>
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              size={ms(16)}
              color={isDark ? '#AAAAAA' : '#858585'}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function AddDebitCardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textPrimary = isDark ? '#FFFFFF' : '#191970';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const inputBorder = isDark ? '#4A4A8A' : '#191970';
  const expiryInputBg = isDark ? '#1A1A1A' : '#FAFAFC';
  const placeholderColor = 'rgba(133,133,133,0.7)';
  const disclaimerColor = isDark ? '#AAAAAA' : '#858585';

  const handleSave = () => {
    if (!accountName.trim() || !accountNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Success', 'Account details saved. This feature will be fully activated soon.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerTitles}>
            <Text style={[styles.title, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
              Add Account
            </Text>
            <Text style={[styles.subtitle, { color: textSecondary, fontSize: fs(12) }]}>
              Add a bank account that's linked to your BVN
            </Text>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: hs(21), paddingBottom: vs(24) }}
        >
          {/* Fields */}
          <View style={{ marginTop: vs(16) }}>
            <FormInputField
              label="Account Name"
              value={accountName}
              onChangeText={setAccountName}
              isDark={isDark} ms={ms} vs={vs} fs={fs} hs={hs}
            />
            <FormInputField
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              isDark={isDark} ms={ms} vs={vs} fs={fs} hs={hs}
            />
            <FormInputField
              label="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              secureTextEntry
              showToggle
              maskPrefix="**** **** **** "
              isDark={isDark} ms={ms} vs={vs} fs={fs} hs={hs}
            />

            {/* Expiry Date row */}
            <View style={{ marginBottom: vs(16) }}>
              <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(11) }]}>
                Expiry Date
              </Text>
              <View style={[styles.expiryRow, { marginTop: vs(8), gap: hs(16) }]}>
                <View style={[
                  styles.expiryInput,
                  {
                    backgroundColor: expiryInputBg,
                    borderColor: inputBorder,
                    borderWidth: 0.4,
                    borderRadius: ms(12),
                    height: vs(44),
                    flex: 1,
                  },
                ]}>
                  <TextInput
                    value={expiryMonth}
                    onChangeText={setExpiryMonth}
                    placeholder="Month"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    maxLength={2}
                    style={[styles.expiryTextInput, { color: isDark ? '#FFFFFF' : '#1A1D23', fontSize: fs(11), paddingHorizontal: hs(16), height: '100%' }]}
                  />
                </View>
                <View style={[
                  styles.expiryInput,
                  {
                    backgroundColor: expiryInputBg,
                    borderColor: inputBorder,
                    borderWidth: 0.4,
                    borderRadius: ms(12),
                    height: vs(44),
                    flex: 1,
                  },
                ]}>
                  <TextInput
                    value={expiryYear}
                    onChangeText={setExpiryYear}
                    placeholder="Year"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.expiryTextInput, { color: isDark ? '#FFFFFF' : '#1A1D23', fontSize: fs(11), paddingHorizontal: hs(16), height: '100%' }]}
                  />
                </View>
              </View>
            </View>

            <FormInputField
              label="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              secureTextEntry
              showToggle
              isDark={isDark} ms={ms} vs={vs} fs={fs} hs={hs}
            />
          </View>

          {/* Disclaimer */}
          <Text style={[styles.disclaimer, { color: disclaimerColor, fontSize: fs(10), textAlign: 'center' }]}>
            The issuer of your debit card may request{'\n'}
            that you type in your card PIN for validation. PayGenius does not have access to your card PIN and we do not store this personal information.
          </Text>
        </ScrollView>

        {/* Save button */}
        <View style={{ paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
          <PrimaryButton title="Save" onPress={handleSave} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 4 },
  headerTitles: { flex: 1, alignItems: 'center' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400', marginTop: 2 },
  fieldLabel: { fontWeight: '400', letterSpacing: 0.25 },
  fieldWrap: { flexDirection: 'row', alignItems: 'center' },
  maskPrefix: { fontWeight: '400' },
  fieldInput: { fontWeight: '400' },
  expiryRow: { flexDirection: 'row' },
  expiryInput: { overflow: 'hidden' },
  expiryTextInput: { fontWeight: '400' },
  disclaimer: { fontWeight: '400', lineHeight: 16, marginTop: 8 },
});
