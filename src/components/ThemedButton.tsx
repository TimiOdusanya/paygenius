import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ThemedButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'medium' | 'small';
};

/**
 * Button using theme colors. Background and text switch with light/dark automatically.
 */
export function ThemedButton({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  ...props
}: ThemedButtonProps) {
  const { colors } = useTheme();

  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';
  const borderColor = variant === 'outline' ? colors.border : 'transparent';
  const textColor =
    variant === 'outline' ? colors.text : colors.primaryContrast;

  const buttonStyle: ViewStyle = {
    backgroundColor: bg,
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor,
    paddingVertical: size === 'small' ? 8 : 12,
    paddingHorizontal: size === 'small' ? 14 : 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && { opacity: 0.85 },
        StyleSheet.flatten(style as ViewStyle),
      ]}
      {...props}
    >
      <Text
        style={{
          color: textColor,
          fontSize: size === 'small' ? 14 : 16,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
