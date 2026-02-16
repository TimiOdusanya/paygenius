import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { ThemedButton } from '../components/ThemedButton';

export function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="primary" style={styles.title}>
        Sign in
      </ThemedText>
      <ThemedText variant="secondary" style={styles.subtitle}>
        Use /api/auth for phone, Google, Apple
      </ThemedText>
      <ThemedButton
        title="Login (placeholder)"
        onPress={() => {}}
        style={styles.button}
      />
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
  button: {
    marginTop: 16,
  },
});
