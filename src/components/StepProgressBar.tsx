import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type StepProgressBarProps = {
  total: number;
  current: number;
};

export function StepProgressBar({ total, current }: StepProgressBarProps) {
  const { isDark } = useTheme();
  const { hs, ms } = useResponsive();
  const inactive = isDark ? '#3B3B3B' : '#EDEDED';

  return (
    <View style={[styles.row, { gap: hs(10), paddingHorizontal: hs(10) }]}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: hs(78),
            height: ms(8),
            borderRadius: ms(16),
            backgroundColor: index === current - 1 ? '#7C3AED' : inactive,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
