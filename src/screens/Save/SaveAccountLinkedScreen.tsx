import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'SaveAccountLinked'>;

export function SaveAccountLinkedScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms } = useResponsive();
  const { goalName, goalId } = route.params;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const cardBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('GoalCreated', { goalName, goalId });
    }, 1800);
    return () => clearTimeout(timer);
  }, [goalId, goalName, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            width: ms(297),
            borderRadius: ms(21),
            paddingVertical: vs(32),
            paddingHorizontal: ms(24),
          },
        ]}
      >
        <Text style={{ color: titleColor, fontSize: fs(20), fontWeight: '600', textAlign: 'center' }}>
          Account Linked
        </Text>
        <Text
          style={{
            color: subColor,
            fontSize: fs(12),
            textAlign: 'center',
            marginTop: vs(8),
            lineHeight: fs(16),
          }}
        >
          you have successfully Linked an external account for your savings Goal
        </Text>
        <View style={{ alignItems: 'center', marginTop: vs(20) }}>
          <Ionicons name="thumbs-up" size={ms(78)} color="#7C3AED" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
});
