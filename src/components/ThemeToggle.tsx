import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme, type ThemeMode } from "@/context/ThemeContext";

/**
 * Cycle through light / dark / system. Use in settings or header.
 */
export function ThemeToggle() {
  const { mode, setMode, isDark, colors } = useTheme();

  const cycle: ThemeMode[] = ["light", "dark", "system"];
  const next = cycle[(cycle.indexOf(mode) + 1) % cycle.length];

  return (
    <Pressable
      style={[
        styles.wrap,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
      ]}
      onPress={() => setMode(next)}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Theme: {mode}
      </Text>
      <Text style={[styles.value, { color: colors.text }]}>{next} →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600" },
});
