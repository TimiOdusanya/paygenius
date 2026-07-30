import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

export type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong' | 'very_strong';

const STRENGTH_CONFIG: Record<PasswordStrength, {
  segments: number;
  color: string;
  label: string;
  labelColor: string;
}> = {
  none: { segments: 0, color: '#E1E1E1', label: '', labelColor: '#E1E1E1' },
  weak: { segments: 1, color: '#FF4D4F', label: 'Weak, use 6+ characters including 1 Uppercase letter, 1 Number and 1 Special Character', labelColor: '#FF4D4F' },
  medium: { segments: 2, color: '#FFB01C', label: 'Medium, add 1 Number and 1 Special Character', labelColor: '#FFB01C' },
  strong: { segments: 3, color: '#00C292', label: 'Strong', labelColor: '#00C292' },
  very_strong: { segments: 4, color: '#00C292', label: 'Very Strong', labelColor: '#00C292' },
};

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'none';
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score === 2) return 'medium';
  if (score === 3 || score === 4) return 'strong';
  return 'very_strong';
}

type PasswordStrengthBarProps = {
  strength: PasswordStrength;
  containerStyle?: ViewStyle;
};

export function PasswordStrengthBar({ strength, containerStyle }: PasswordStrengthBarProps) {
  const { hs, vs, fs } = useResponsive();
  const config = STRENGTH_CONFIG[strength];

  if (strength === 'none') return null;

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      <View style={[styles.barsRow, { gap: hs(5) }]}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                height: vs(7),
                borderRadius: 5,
                flex: 1,
                backgroundColor:
                  i < config.segments ? config.color : '#E1E1E1',
              },
            ]}
          />
        ))}
      </View>
      {config.label ? (
        <Text
          style={[
            styles.label,
            { color: config.labelColor, fontSize: fs(10), marginTop: vs(4) },
          ]}
        >
          {config.label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  segment: {},
  label: {
    fontWeight: '400',
  },
});
