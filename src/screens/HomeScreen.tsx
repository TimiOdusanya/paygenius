import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { ThemeToggle } from '../components/ThemeToggle';

export function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="primary" style={styles.title}>
        PayGenius
      </ThemedText>
      <ThemedText variant="secondary" style={styles.subtitle}>
        Home — connect to /api/home/dashboard when authenticated
      </ThemedText>
      <ThemeToggle />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
});
