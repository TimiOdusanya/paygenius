import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type RadioOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function RadioOption({ label, selected, onPress }: RadioOptionProps) {
  const { isDark } = useTheme();
  const { fs, ms } = useResponsive();
  const size = ms(16);
  const border = selected ? '#7C3AED' : isDark ? '#AAAAAA' : '#858585';

  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{
              width: size * 0.5,
              height: size * 0.5,
              borderRadius: size * 0.25,
              backgroundColor: '#7C3AED',
            }}
          />
        ) : null}
      </View>
      <Text
        style={[
          styles.label,
          { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(12), marginLeft: 8 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 18,
  },
  label: {
    fontWeight: '400',
    flexShrink: 1,
  },
});
