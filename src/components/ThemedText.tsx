import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type ThemedTextProps = TextProps & {
  /** 'primary' = main text, 'secondary' = de-emphasized, 'muted' = hint, 'inverse' = on dark bg */
  variant?: "primary" | "secondary" | "muted" | "inverse";
};

/**
 * Text that uses theme colors. Color updates automatically when switching light/dark.
 */
export function ThemedText({
  style,
  variant = "primary",
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();
  const color =
    variant === "secondary"
      ? colors.textSecondary
      : variant === "muted"
        ? colors.textMuted
        : variant === "inverse"
          ? colors.textInverse
          : colors.text;
  return (
    <Text style={[{ color } as Record<string, unknown>, style]} {...props} />
  );
}
