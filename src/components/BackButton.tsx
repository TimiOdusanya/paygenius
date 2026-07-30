import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/context/ThemeContext';

/** Figma back control: soft purple circle + chevron */
const BACK_BG_LIGHT = 'rgba(192, 192, 241, 0.3)';
const BACK_BG_DARK = 'rgba(192, 192, 241, 0.15)';
const BACK_ICON_COLOR = '#949494';
const BACK_ICON_SIZE = 12;
const BACK_SIZE = 22;

type BackButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
};

export function BackButton({ onPress, style, size = BACK_SIZE }: BackButtonProps) {
  const { isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? BACK_BG_DARK : BACK_BG_LIGHT,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Ionicons name="chevron-back" size={BACK_ICON_SIZE} color={BACK_ICON_COLOR} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
