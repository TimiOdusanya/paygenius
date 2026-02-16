import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ThemedViewProps = ViewProps & {
  /** Use 'background' | 'surface' | 'surfaceElevated' for main containers */
  variant?: 'background' | 'surface' | 'surfaceElevated';
};

/**
 * View that uses theme colors. No need to pass backgroundColor — it switches with light/dark automatically.
 */
export function ThemedView({ style, variant = 'background', ...props }: ThemedViewProps) {
  const { colors } = useTheme();
  const bg =
    variant === 'surface'
      ? colors.surface
      : variant === 'surfaceElevated'
        ? colors.surfaceElevated
        : colors.background;
  return <View style={[{ backgroundColor: bg }, style]} {...props} />;
}
