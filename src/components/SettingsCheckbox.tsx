import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
};

/** Figma 18×18 rounded checkbox, #858585 border, navy fill when checked. */
export function SettingsCheckbox({ value, onValueChange }: Props) {
  const { isDark } = useTheme();
  const { ms } = useResponsive();
  const size = ms(18);
  const border = isDark ? '#888888' : '#858585';
  const fill = isDark ? '#7C3AED' : '#191970';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
    >
      <View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: ms(4),
            borderColor: value ? fill : border,
            backgroundColor: value ? fill : 'transparent',
          },
        ]}
      >
        {value ? <Ionicons name="checkmark" size={ms(12)} color="#FFFFFF" /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
