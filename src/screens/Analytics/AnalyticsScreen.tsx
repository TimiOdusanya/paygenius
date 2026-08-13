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
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { SegmentedControl } from '@/components/SegmentedControl';
import { HomeTransactionRow } from '@/screens/Home/HomeTransactionRow';
import {
  useGetExpenseAnalyticsQuery,
  useGetMonthTransactionsQuery,
} from '@/services/home/home.query';
import { formatNaira, MONTH_NAMES } from '@/utils/money';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import { EmptyState } from '@/components/EmptyState';
import { ExpenseChart } from './ExpenseChart';
import { SpendBreakdown } from './SpendBreakdown';
import ArrowIn from '../../../assets/images/analytics/arrow-in.svg';
import ArrowOut from '../../../assets/images/analytics/arrow-out.svg';
import TrendUp from '../../../assets/images/analytics/trend-up.svg';

const TABS = ['Transaction History', 'Expense log'] as const;

type Props = BottomTabScreenProps<MainTabParamList, 'AnalyticsTab'>;

export function AnalyticsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const now = new Date();
  const [tab, setTab] = React.useState<(typeof TABS)[number]>('Transaction History');
  const [month, setMonth] = React.useState(now.getMonth());
  const [year, setYear] = React.useState(now.getFullYear());

  const { data: txData, isLoading: txLoading } = useGetMonthTransactionsQuery(
    month,
    year
  );
  const { data: expData, isLoading: expLoading } = useGetExpenseAnalyticsQuery(
    month,
    year
  );

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textPrimary = isDark ? '#FFFFFF' : '#1A1D23';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const transactions = txData?.data?.transactions ?? [];
  const amountIn = txData?.data?.amountIn ?? 0;
  const amountOut = txData?.data?.amountOut ?? 0;
  const analytics = expData?.data;
  const [selectedWeek, setSelectedWeek] = React.useState(1);

  const shiftMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  };

  return (
    <View style={[styles.root, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(24) }]}>
        <BackButton onPress={() => navigation.navigate('HomeTab')} />
      </View>

      <View style={{ paddingHorizontal: hs(20), marginTop: vs(20) }}>
        <SegmentedControl
          options={[...TABS]}
          value={tab}
          onChange={(v) => setTab(v as (typeof TABS)[number])}
        />
      </View>

      {tab === 'Transaction History' ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: hs(22),
            paddingTop: vs(16),
            paddingBottom: vs(24),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.monthRow}>
            <Pressable onPress={() => shiftMonth(-1)} hitSlop={8}>
              <Ionicons name="chevron-back" size={ms(10)} color={textSecondary} />
            </Pressable>
            <Text
              style={{
                color: textPrimary,
                fontSize: fs(16),
                fontWeight: '500',
                letterSpacing: -0.32,
                lineHeight: fs(20),
                marginHorizontal: 4,
              }}
            >
              {MONTH_NAMES[month]}
            </Text>
            <Pressable onPress={() => shiftMonth(1)} hitSlop={8}>
              <Ionicons name="chevron-forward" size={ms(10)} color={textSecondary} />
            </Pressable>
          </View>

          <View style={[styles.summaryRow, { marginTop: vs(8) }]}>
            <View style={{ width: hs(48) }}>
              <Text style={{ color: textSecondary, fontSize: fs(8), textAlign: 'center' }}>
                Amount in
              </Text>
              <View style={[styles.amountLine, { marginTop: 2 }]}>
                <Text style={{ color: '#00C292', fontSize: fs(8) }}>
                  {formatNaira(amountIn)}
                </Text>
                <ArrowIn width={ms(8)} height={ms(8)} />
              </View>
            </View>
            <View style={{ width: hs(52), marginLeft: hs(4) }}>
              <View style={styles.amountLine}>
                <Text style={{ color: '#FF4D4F', fontSize: fs(8) }}>
                  {formatNaira(amountOut)}
                </Text>
                <ArrowOut width={ms(8)} height={ms(8)} />
              </View>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: fs(8),
                  textAlign: 'center',
                  marginTop: 2,
                }}
              >
                Amount out
              </Text>
            </View>
          </View>

          <View style={{ marginTop: vs(16), gap: 10 }}>
            {txLoading ? (
              <ActivityIndicator color="#191970" style={{ marginTop: 24 }} />
            ) : transactions.length === 0 ? (
              <EmptyState
                variant="transactions"
                title="No transactions this month"
                subtitle="When money moves, it will show up here."
              />
            ) : (
              transactions.map((tx) => (
                <HomeTransactionRow
                  key={tx._id}
                  tx={tx}
                  isDark={isDark}
                  ms={ms}
                  fs={fs}
                  hs={hs}
                />
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: hs(20),
            paddingTop: vs(16),
            paddingBottom: vs(32),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.expenseCard,
              {
                borderColor: isDark ? '#3B3B3B' : '#858585',
                width: hs(168),
                height: ms(83),
                borderRadius: ms(9),
                paddingHorizontal: hs(14),
                paddingVertical: vs(12),
              },
            ]}
          >
            <View style={styles.expenseLabelRow}>
              <TrendUp width={ms(17)} height={ms(17)} />
              <Text
                style={{
                  color: isDark ? '#AAAAAA' : '#6D6D8C',
                  fontSize: fs(12),
                  marginLeft: 4,
                }}
              >
                Expenses
              </Text>
            </View>
            <Text
              style={{
                color: isDark ? '#FFFFFF' : '#7A7A7A',
                fontSize: fs(16),
                marginTop: 3,
              }}
            >
              {formatNaira(analytics?.totalExpenses ?? 0)}
            </Text>
            <View style={styles.expenseLabelRow}>
              <Text style={{ color: '#00C292', fontSize: fs(10) }}>
                {(analytics?.changePercent ?? 0) >= 0 ? '+' : ''}
                {analytics?.changePercent ?? 0}%
              </Text>
              <Text
                style={{
                  color: isDark ? '#AAAAAA' : '#7A7A7A',
                  fontSize: fs(10),
                  marginLeft: 4,
                }}
              >
                VS Last month
              </Text>
            </View>
          </View>

          <View style={[styles.monthSelectRow, { marginTop: vs(26) }]}>
            <Pressable
              onPress={() => shiftMonth(-1)}
              style={[
                styles.monthChip,
                {
                  backgroundColor: isDark ? 'rgba(122,122,122,0.25)' : 'rgba(122,122,122,0.2)',
                  width: hs(94),
                  height: ms(28),
                  borderRadius: ms(9),
                },
              ]}
            >
              <Text
                style={{
                  color: isDark ? '#FFFFFF' : '#1A1A2F',
                  fontSize: fs(12),
                  fontWeight: '500',
                }}
              >
                {MONTH_NAMES[month]}
              </Text>
              <Ionicons
                name="chevron-down"
                size={ms(10)}
                color={isDark ? '#FFFFFF' : '#1A1A2F'}
              />
            </Pressable>
            <Text style={{ color: isDark ? '#AAAAAA' : '#6D6D8C', fontSize: fs(8) }}>
              {year}
            </Text>
          </View>

          {expLoading ? (
            <ActivityIndicator color="#191970" style={{ marginTop: 32 }} />
          ) : (analytics?.totalExpenses ?? 0) === 0 ? (
            <EmptyState
              variant="spend"
              title="No expenses this month"
              subtitle="When you spend, your weekly rhythm will live here."
            />
          ) : (
            <>
              <ExpenseChart
                weeks={analytics?.weeks ?? []}
                selectedWeek={selectedWeek}
                isDark={isDark}
                hs={hs}
                fs={fs}
                ms={ms}
              />
              <SpendBreakdown
                weeks={analytics?.weeks ?? []}
                categories={analytics?.categories ?? []}
                selectedWeek={selectedWeek}
                onSelectWeek={setSelectedWeek}
                isDark={isDark}
                hs={hs}
                fs={fs}
                ms={ms}
              />
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center' },
  monthRow: { flexDirection: 'row', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start' },
  amountLine: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  expenseCard: { borderWidth: 0.5, justifyContent: 'center' },
  expenseLabelRow: { flexDirection: 'row', alignItems: 'center' },
  monthSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
