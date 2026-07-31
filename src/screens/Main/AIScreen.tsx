import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export function AIScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms } = useResponsive();
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top + vs(16) }]}>
      <View style={[styles.iconWrap, { marginTop: vs(80) }]}>
        <View
          style={[
            styles.iconCircle,
            {
              width: ms(72),
              height: ms(72),
              borderRadius: ms(36),
              backgroundColor: '#191970',
            },
          ]}
        >
          <Ionicons name="sparkles" size={ms(32)} color="#FFFFFF" />
        </View>
      </View>
      <Text style={[styles.title, { color: textColor, fontSize: fs(22), marginTop: vs(20) }]}>
        PayGenius AI
      </Text>
      <Text style={[styles.subtitle, { color: subColor, fontSize: fs(12), marginTop: vs(8) }]}>
        Coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  iconWrap: { alignItems: 'center' },
  iconCircle: { alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '600', textAlign: 'center' },
  subtitle: { fontWeight: '400', textAlign: 'center' },
});
