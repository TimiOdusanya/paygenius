import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  const { isDark } = useTheme();
  const { fs, vs } = useResponsive();
  const color = isDark ? '#FFFFFF' : '#1A1D23';

  return (
    <View style={{ marginBottom: vs(47) }}>
      <Text
        style={[
          styles.title,
          { color, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20), marginBottom: vs(28) },
        ]}
      >
        {title}
      </Text>
      <View style={styles.list}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
  list: {
    gap: 8,
  },
});
