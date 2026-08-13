import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { usePreferencesStore } from '@/stores';
import { digitsOnly, getDialInfo } from '@/utils/phone';

const FLAG_USA = require('../../assets/images/region/flag-usa.png');
const FLAG_NIGERIA = require('../../assets/images/region/flag-nigeria.png');

type PhoneNumberFieldProps = {
  value: string;
  onChangeText: (localDigits: string) => void;
  label?: string;
};

export function PhoneNumberField({
  value,
  onChangeText,
  label = 'Phone number',
}: PhoneNumberFieldProps) {
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const region = usePreferencesStore((s) => s.region);
  const dial = getDialInfo(region);

  const labelColor = isDark ? '#CCCCCC' : '#1A1D23';
  const inputBg = isDark ? '#1E1E2E' : '#FAFAFC';
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputText = isDark ? '#FFFFFF' : '#1A1D23';
  const flagBg = isDark ? '#2A2A5A' : '#C0C0F1';
  const prefixColor = isDark ? '#A0A0A0' : '#C4C4C4';

  return (
    <View style={{ width: '100%' }}>
      <Text style={[styles.label, { color: labelColor, fontSize: fs(10) }]}>{label}</Text>
      <View style={[styles.row, { marginTop: vs(8), gap: hs(6) }]}>
        <View
          style={[
            styles.flagBox,
            {
              backgroundColor: flagBg,
              borderColor: inputBorder,
              borderRadius: ms(12),
              height: vs(44),
              minWidth: ms(73),
              paddingHorizontal: hs(10),
            },
          ]}
        >
          <Image
            source={dial.region === 'USA' ? FLAG_USA : FLAG_NIGERIA}
            style={{ width: ms(20), height: ms(20), borderRadius: ms(10) }}
            resizeMode="cover"
          />
          <Text style={[styles.flagLabel, { color: '#FFFFFF', fontSize: fs(11) }]}>
            {dial.label}
          </Text>
        </View>
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: inputBg,
              borderColor: inputBorder,
              borderRadius: ms(12),
              height: vs(44),
              flex: 1,
            },
          ]}
        >
          <Text style={[styles.prefix, { color: prefixColor, fontSize: fs(11) }]}>
            {dial.dialCode}
          </Text>
          <TextInput
            value={value}
            onChangeText={(text) => onChangeText(digitsOnly(text).slice(0, dial.localMaxLength))}
            placeholder={dial.placeholder}
            placeholderTextColor={isDark ? '#666' : '#C4C4C4'}
            keyboardType="phone-pad"
            maxLength={dial.localMaxLength}
            style={[styles.input, { color: inputText, fontSize: fs(11), flex: 1 }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '400' },
  row: { flexDirection: 'row', alignItems: 'center' },
  flagBox: {
    borderWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  flagLabel: { fontWeight: '400' },
  inputBox: {
    borderWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  prefix: { fontWeight: '400' },
  input: { fontWeight: '400' },
});
