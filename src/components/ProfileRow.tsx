import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type ProfileRowProps = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
};

export function ProfileRow({ icon, label, onPress, right }: ProfileRowProps) {
  const { isDark } = useTheme();
  const { hs, fs, ms } = useResponsive();
  const border = isDark ? '#3B3B3B' : '#191970';
  const text = isDark ? '#C8C8C8' : '#858585';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.row,
        {
          height: ms(42),
          borderBottomColor: border,
          paddingHorizontal: hs(12),
        },
      ]}
    >
      <View style={[styles.icon, { width: ms(16) }]}>{icon}</View>
      {right && !label.trim() ? (
        <View style={{ flex: 1, marginLeft: hs(6) }}>{right}</View>
      ) : (
        <>
          <Text
            numberOfLines={1}
            style={[styles.label, { color: text, fontSize: fs(10), marginLeft: hs(6) }]}
          >
            {label}
          </Text>
          {right}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontWeight: '400' },
});
