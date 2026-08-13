import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Budget } from '@/types';

const BUDGET_COLORS: Record<string, string> = {
  default: '#3A3A8A',
  FOOD: '#3A3A8A',
  GROCERIES: '#3A3A8A',
  DATA: '#064A34',
  TRANSPORTATION: '#064A34',
  FUEL: '#3A3A8A',
  UTILITY: '#064A34',
  ENTERTAINMENT: '#3A3A8A',
};

const BUDGET_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  default: 'wallet-outline',
  FOOD: 'fast-food-outline',
  GROCERIES: 'cart-outline',
  DATA: 'wifi-outline',
  TRANSPORTATION: 'car-outline',
  FUEL: 'flame-outline',
  UTILITY: 'flash-outline',
  ENTERTAINMENT: 'film-outline',
};

type Props = {
  budget: Budget;
  isDark: boolean;
  ms: (n: number) => number;
  fs: (n: number) => number;
  onPress?: () => void;
};

export function HomeBudgetCard({ budget, isDark, ms, fs, onPress }: Props) {
  const cat = budget.category?.toUpperCase() || 'default';
  const accent = BUDGET_COLORS[cat] || BUDGET_COLORS.default;
  const iconName = BUDGET_ICONS[cat] || BUDGET_ICONS.default;
  const progress = budget.progress ?? 0;
  const remaining =
    budget.remainingAmount ?? budget.totalAmount - budget.spentAmount;
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const subColor = isDark ? '#AAAAAA' : '#858585';
  const size = ms(93);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: accent,
          width: size,
          height: ms(86),
          borderRadius: ms(10),
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[styles.name, { color: textColor, fontSize: fs(10) }]}
          numberOfLines={1}
        >
          {budget.name}
        </Text>
        <Ionicons name={iconName} size={ms(11)} color={accent} />
      </View>
      <Text style={[styles.left, { color: subColor, fontSize: fs(8) }]}>
        ₦{remaining.toLocaleString('en-NG')} left
      </Text>
      <View style={styles.progressWrap}>
        <View
          style={[
            styles.track,
            { backgroundColor: isDark ? '#2A2A2A' : '#D9D9D9' },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: accent,
              },
            ]}
          />
        </View>
        <Text style={[styles.percent, { color: subColor, fontSize: fs(8) }]}>
          {progress}%
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingTop: 12,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { fontWeight: '500', flex: 1, letterSpacing: 0.4, marginRight: 4 },
  left: { fontWeight: '400', marginTop: 2 },
  progressWrap: { marginTop: 'auto', marginBottom: 8 },
  track: { height: 5, width: '100%', borderRadius: 10, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 10 },
  percent: { fontWeight: '400', textAlign: 'center', marginTop: 2 },
});
