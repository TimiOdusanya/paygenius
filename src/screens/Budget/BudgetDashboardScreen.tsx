import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import { BackButton } from '@/components/BackButton';
import type { Budget } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BudgetDashboard'>;

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

const BUDGET_BORDER_COLORS: Record<string, string> = {
  default: '#3A3A8A',
  FOOD: '#3A3A8A',
  GROCERIES: '#3A3A8A',
  DATA: '#064A34',
  TRANSPORTATION: '#064A34',
  FUEL: '#3A3A8A',
  UTILITY: '#064A34',
  ENTERTAINMENT: '#3A3A8A',
};

interface BudgetGridCardProps {
  budget: Budget;
  isDark: boolean;
  ms: (n: number) => number;
  vs: (n: number) => number;
  fs: (n: number) => number;
  hs: (n: number) => number;
  onPress?: () => void;
}

function BudgetGridCard({ budget, isDark, ms, vs, fs, onPress }: BudgetGridCardProps) {
  const cat = (budget.category ?? 'default').toUpperCase();
  const iconName = BUDGET_ICONS[cat] ?? BUDGET_ICONS.default;
  const borderColor = BUDGET_BORDER_COLORS[cat] ?? BUDGET_BORDER_COLORS.default;
  const progress = budget.progress ?? 0;
  const remaining = budget.remainingAmount ?? (budget.totalAmount - budget.spentAmount);
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const subColor = '#858585';

  return (
    <Pressable
      onPress={onPress}
      style={[
      styles.gridCard,
      {
        backgroundColor: cardBg,
        borderColor,
        borderWidth: 1,
        borderRadius: ms(10),
        padding: ms(14),
        flex: 1,
        margin: ms(5),
      },
    ]}>
      <View style={styles.cardTopRow}>
        <Text style={[styles.cardName, { color: textColor, fontSize: fs(16) }]} numberOfLines={1}>
          {budget.name}
        </Text>
        <Ionicons name={iconName} size={ms(18)} color={borderColor} />
      </View>
      <Text style={[styles.cardRemaining, { color: subColor, fontSize: fs(10), marginTop: vs(2) }]}>
        ₦{remaining.toLocaleString('en-NG')} left
      </Text>
      <View style={[styles.progressTrack, {
        backgroundColor: isDark ? '#2A2A2A' : '#D9D9D9',
        marginTop: vs(18),
        borderRadius: ms(5),
      }]}>
        <View style={[styles.progressFill, {
          width: `${Math.min(progress, 100)}%`,
          backgroundColor: borderColor,
          borderRadius: ms(5),
        }]} />
      </View>
      <Text style={[styles.progressPercent, { color: subColor, fontSize: fs(10), marginTop: vs(4) }]}>
        {progress}%
      </Text>
    </Pressable>
  );
}

export function BudgetDashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { data, isLoading } = useGetBudgetsQuery();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textPrimary = isDark ? '#FFFFFF' : '#191970';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const addCardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const addBorderColor = isDark ? '#3A3A8A' : '#191970';

  const budgets: Budget[] = data?.data?.budgets ?? [];

  // Group budgets in pairs for the 2-column grid
  const pairs: [Budget, Budget | null][] = [];
  for (let i = 0; i < budgets.length; i += 2) {
    pairs.push([budgets[i], budgets[i + 1] ?? null]);
  }

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitles}>
          <Text style={[styles.title, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
            Budget Dashboard
          </Text>
          <Text style={[styles.subtitle, { color: textSecondary, fontSize: fs(12) }]}>
            My Budgets
          </Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: hs(16), paddingBottom: vs(24) }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator color="#191970" style={{ marginTop: vs(40) }} />
        ) : (
          <>
            {/* Budget grid */}
            {pairs.map(([left, right], idx) => (
              <View key={idx} style={styles.gridRow}>
                <BudgetGridCard
                  budget={left}
                  isDark={isDark}
                  ms={ms}
                  vs={vs}
                  fs={fs}
                  hs={hs}
                  onPress={() =>
                    navigation.navigate('TransferHub', {
                      source: 'BUDGET',
                      budgetId: left._id,
                      budgetName: left.name,
                    })
                  }
                />
                {right ? (
                  <BudgetGridCard
                    budget={right}
                    isDark={isDark}
                    ms={ms}
                    vs={vs}
                    fs={fs}
                    hs={hs}
                    onPress={() =>
                      navigation.navigate('TransferHub', {
                        source: 'BUDGET',
                        budgetId: right._id,
                        budgetName: right.name,
                      })
                    }
                  />
                ) : (
                  <View style={{ flex: 1, margin: ms(5) }} />
                )}
              </View>
            ))}

            {/* Add new budget card */}
            <View style={styles.gridRow}>
              {budgets.length % 2 === 0 && (
                <Pressable
                  onPress={() => navigation.navigate('BudgetCreation')}
                  style={[
                    styles.gridCard,
                    {
                      backgroundColor: addCardBg,
                      borderColor: addBorderColor,
                      borderWidth: 1,
                      borderRadius: ms(10),
                      padding: ms(14),
                      flex: 1,
                      margin: ms(5),
                      height: ms(113),
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <Ionicons name="add" size={ms(22)} color={addBorderColor} />
                </Pressable>
              )}
              {budgets.length % 2 === 1 && (
                <>
                  <View style={{ flex: 1, margin: ms(5) }} />
                  <Pressable
                    onPress={() => navigation.navigate('BudgetCreation')}
                    style={[
                      styles.gridCard,
                      {
                        backgroundColor: addCardBg,
                        borderColor: addBorderColor,
                        borderWidth: 1,
                        borderRadius: ms(10),
                        padding: ms(14),
                        flex: 1,
                        margin: ms(5),
                        height: ms(113),
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Ionicons name="add" size={ms(22)} color={addBorderColor} />
                  </Pressable>
                </>
              )}
              {budgets.length === 0 && (
                <>
                  <Pressable
                    onPress={() => navigation.navigate('BudgetCreation')}
                    style={[
                      styles.gridCard,
                      {
                        backgroundColor: addCardBg,
                        borderColor: addBorderColor,
                        borderWidth: 1,
                        borderRadius: ms(10),
                        flex: 1,
                        margin: ms(5),
                        height: ms(113),
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Ionicons name="add" size={ms(22)} color={addBorderColor} />
                  </Pressable>
                  <View style={{ flex: 1, margin: ms(5) }} />
                </>
              )}
            </View>
          </>
        )}

        {/* Continue button */}
        <Pressable
          onPress={() => navigation.navigate('BudgetCreation')}
          style={[styles.continueBtn, { backgroundColor: '#191970', borderRadius: ms(14), marginTop: vs(32) }]}
        >
          <Text style={[styles.continueBtnText, { fontSize: fs(12) }]}>+ Create Budget</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12 },
  headerTitles: { flex: 1, alignItems: 'center' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400', marginTop: 2 },
  gridRow: { flexDirection: 'row' },
  gridCard: { overflow: 'hidden' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontWeight: '500', flex: 1, marginRight: 4 },
  cardRemaining: { fontWeight: '400' },
  progressTrack: { height: 7, width: '100%' },
  progressFill: { height: 7 },
  progressPercent: { fontWeight: '400', textAlign: 'center' },
  continueBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginHorizontal: 5,
  },
  continueBtnText: { color: '#FFFFFF', fontWeight: '600' },
});
