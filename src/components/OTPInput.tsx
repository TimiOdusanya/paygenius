import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type OTPInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  containerStyle?: ViewStyle;
};

/**
 * Figma OTP cells: ~48×48, 8px gap, 12px radius, thin navy border — centered, not stretched.
 */
export function OTPInput({
  length = 4,
  value,
  onChange,
  containerStyle,
}: OTPInputProps) {
  const { isDark } = useTheme();
  const { vs, ms, fs } = useResponsive();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) digits.push('');

  const borderColor = isDark ? '#5C5CA4' : '#191970';
  const activeBorder = isDark ? '#8888FF' : '#191970';
  const bgColor = isDark ? '#1E1E2E' : '#FAFAFC';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';

  const cellWidth = ms(56);
  const cellHeight = ms(52);

  const handleChange = (text: string, index: number) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    const newDigits = [...digits];

    if (sanitized.length > 1) {
      const pastedDigits = sanitized.slice(0, length - index);
      for (let i = 0; i < pastedDigits.length; i++) {
        newDigits[index + i] = pastedDigits[i];
      }
      onChange(newDigits.join(''));
      const nextIndex = Math.min(index + pastedDigits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = sanitized;
    onChange(newDigits.join(''));

    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      onChange(newDigits.join(''));
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.box,
            {
              width: cellWidth,
              height: cellHeight,
              borderRadius: 8,
              borderColor: digits[i] ? activeBorder : borderColor,
              backgroundColor: bgColor,
            },
          ]}
        >
          <TextInput
            ref={(ref) => {
              inputRefs.current[i] = ref;
            }}
            value={digits[i]}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, i)
            }
            keyboardType="number-pad"
            maxLength={1}
            style={[
              styles.input,
              { color: textColor, fontSize: fs(20), fontWeight: '600' },
            ]}
            textAlign="center"
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  box: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    padding: 0,
  },
});
