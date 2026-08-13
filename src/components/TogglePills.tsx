import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Option<T extends string> = { value: T; label: string };

type TogglePillsProps<T extends string> = {
  options: [Option<T>, Option<T>];
  value: T | null;
  onChange: (value: T) => void;
};

export function TogglePills<T extends string>({
  options,
  value,
  onChange,
}: TogglePillsProps<T>) {
  const { isDark } = useTheme();
  const { fs, vs, ms } = useResponsive();
  const unselected = isDark ? '#AAAAAA' : '#858585';

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.pill,
              {
                height: vs(41),
                borderRadius: ms(11),
                backgroundColor: selected ? '#191970' : 'transparent',
                borderColor: selected ? '#191970' : unselected,
              },
            ]}
          >
            <Text
              style={{
                color: selected ? '#FFFFFF' : unselected,
                fontSize: fs(12),
                fontWeight: '400',
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 23 },
  pill: {
    flex: 1,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
