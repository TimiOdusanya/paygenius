import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useNotificationCenter } from '@/context/NotificationContext';
import type { RootStackParamList } from '@/navigation/RootNavigator';

export function InAppNotificationBanner() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { banner, dismissBanner } = useNotificationCenter();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!banner) return null;

  return (
    <Pressable
      onPress={() => {
        dismissBanner();
        navigation.navigate('NotificationInbox');
      }}
      style={[
        styles.wrap,
        {
          top: insets.top + vs(8),
          marginHorizontal: hs(16),
          backgroundColor: isDark ? '#2A1A3E' : '#FFFFFF',
          borderRadius: ms(12),
          paddingHorizontal: hs(14),
          paddingVertical: vs(12),
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: isDark ? '#FFFFFF' : '#191970', fontSize: fs(13), fontWeight: '600' }}>
          {banner.title}
        </Text>
        <Text
          numberOfLines={2}
          style={{ color: isDark ? '#CCCCCC' : '#858585', fontSize: fs(11), marginTop: 3 }}
        >
          {banner.body}
        </Text>
      </View>
      <Pressable onPress={dismissBanner} hitSlop={8}>
        <Text style={{ color: '#7C3AED', fontSize: fs(11) }}>Dismiss</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
