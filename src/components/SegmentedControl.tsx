import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type SegmentedControlProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  const { isDark } = useTheme();
  const { hs, ms, fs } = useResponsive();
  const track = isDark ? '#2A2238' : '#E9E9F9';
  const inactive = isDark ? '#AAAAAA' : '#858585';

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: track,
          height: ms(44),
          borderRadius: ms(24),
          paddingHorizontal: hs(12),
          paddingVertical: ms(8),
        },
      ]}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.pill,
              {
                height: ms(28),
                borderRadius: ms(46),
                backgroundColor: active ? (isDark ? '#191970' : option === 'Expense log' ? '#03055B' : '#191970') : 'transparent',
              },
            ]}
          >
            <Text
              style={{
                color: active ? '#FFFFFF' : inactive,
                fontSize: fs(10),
                fontWeight: '400',
              }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
