import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useResponsive } from "@/hooks/useResponsive";

export function HomeScreen() {
  const { hs, vs, fs } = useResponsive();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          padding: hs(24),
          paddingTop: vs(60),
        },
      ]}
    >
      <ThemedText
        variant="primary"
        style={[styles.title, { fontSize: fs(28), marginBottom: vs(8) }]}
      >
        PayGenius
      </ThemedText>
      <ThemedText
        variant="secondary"
        style={[styles.subtitle, { fontSize: fs(16), marginBottom: vs(24) }]}
      >
        Home — connect to /api/home/dashboard when authenticated
      </ThemedText>
      <ThemeToggle />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {},
});
