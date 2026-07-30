import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs } = useResponsive();
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + vs(16) }]}>
      <Text style={[styles.title, { color: textColor, fontSize: fs(22) }]}>Wallet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 32 },
  title: { fontWeight: '600' },
});
