import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuthStore } from '@/stores';
import { useGetDashboardQuery } from '@/services/home/home.query';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { Budget, Transaction } from '@/types';

type Props = BottomTabScreenProps<MainTabParamList, 'HomeTab'> & {
  navigation: CompositeNavigationProp<
    BottomTabScreenProps<MainTabParamList, 'HomeTab'>['navigation'],
    NativeStackNavigationProp<RootStackParamList>
  >;
};

const BUDGET_COLORS: Record<string, { border: string; progress: string }> = {
  default: { border: '#3A3A8A', progress: '#3A3A8A' },
  FOOD: { border: '#3A3A8A', progress: '#3A3A8A' },
  GROCERIES: { border: '#3A3A8A', progress: '#3A3A8A' },
  DATA: { border: '#064A34', progress: '#064A34' },
  TRANSPORTATION: { border: '#064A34', progress: '#064A34' },
  FUEL: { border: '#3A3A8A', progress: '#3A3A8A' },
  UTILITY: { border: '#064A34', progress: '#064A34' },
  ENTERTAINMENT: { border: '#3A3A8A', progress: '#3A3A8A' },
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

const TX_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  FOOD: 'fast-food-outline',
  GROCERIES: 'cart-outline',
  DATA: 'wifi-outline',
  TRANSPORTATION: 'car-outline',
  FUEL: 'flame-outline',
  UTILITY: 'flash-outline',
  ENTERTAINMENT: 'film-outline',
  TRANSFER: 'swap-horizontal-outline',
  default: 'receipt-outline',
};

function formatBalance(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatAmount(amount: number, type: string): string {
  const sign = type === 'CREDIT' ? '+' : '-';
  return `${sign}${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true });
}

interface BudgetCardProps {
  budget: Budget;
  isDark: boolean;
  ms: (n: number) => number;
  vs: (n: number) => number;
  fs: (n: number) => number;
  hs: (n: number) => number;
}

function BudgetCard({ budget, isDark, ms, vs, fs, hs }: BudgetCardProps) {
  const cat = budget.category?.toUpperCase() || 'default';
  const colors = BUDGET_COLORS[cat] || BUDGET_COLORS.default;
  const iconName = BUDGET_ICONS[cat] || BUDGET_ICONS.default;
  const progress = budget.progress ?? 0;
  const remaining = budget.remainingAmount ?? (budget.totalAmount - budget.spentAmount);
  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  return (
    <View style={[
      styles.budgetCard,
      {
        backgroundColor: cardBg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: ms(10),
        width: ms(163),
        padding: ms(14),
        marginRight: hs(10),
      },
    ]}>
      <View style={styles.budgetCardRow}>
        <Text style={[styles.budgetCardName, { color: textColor, fontSize: fs(16) }]} numberOfLines={1}>
          {budget.name}
        </Text>
        <Ionicons name={iconName} size={ms(18)} color={colors.border} />
      </View>
      <Text style={[styles.budgetCardAmount, { color: subColor, fontSize: fs(10), marginTop: vs(2) }]}>
        ₦{remaining.toLocaleString('en-NG')} left
      </Text>
      <View style={[styles.progressTrack, { backgroundColor: isDark ? '#2A2A2A' : '#D9D9D9', marginTop: vs(12), borderRadius: ms(5) }]}>
        <View style={[
          styles.progressFill,
          {
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: colors.progress,
            borderRadius: ms(5),
          },
        ]} />
      </View>
      <Text style={[styles.budgetPercent, { color: subColor, fontSize: fs(10), marginTop: vs(4) }]}>
        {progress}%
      </Text>
    </View>
  );
}

interface TransactionRowProps {
  tx: Transaction;
  isDark: boolean;
  ms: (n: number) => number;
  vs: (n: number) => number;
  fs: (n: number) => number;
  hs: (n: number) => number;
}

function TransactionRow({ tx, isDark, ms, vs, fs, hs }: TransactionRowProps) {
  const cat = tx.category?.toUpperCase() || 'default';
  const iconName = TX_ICONS[cat] || TX_ICONS.default;
  const rowBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#AAAAAA' : '#858585';
  const amtColor = tx.type === 'CREDIT' ? '#10B981' : '#FF4646';

  return (
    <View style={[
      styles.txRow,
      {
        backgroundColor: rowBg,
        borderRadius: ms(8),
        paddingHorizontal: hs(12),
        paddingVertical: vs(10),
        marginBottom: vs(8),
        flexDirection: 'row',
        alignItems: 'center',
      },
    ]}>
      <View style={[styles.txIconWrap, { width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: isDark ? '#2A2A3E' : '#F2EBFD' }]}>
        <Ionicons name={iconName} size={ms(18)} color={isDark ? '#A78BFA' : '#7C3AED'} />
      </View>
      <View style={{ flex: 1, marginLeft: hs(10) }}>
        <Text style={[styles.txMerchant, { color: textColor, fontSize: fs(12) }]} numberOfLines={1}>
          {tx.merchant || tx.description || 'Transaction'}
        </Text>
        <Text style={[styles.txCategory, { color: subColor, fontSize: fs(10) }]}>
          {tx.category}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.txTime, { color: subColor, fontSize: fs(10) }]}>
          {formatTime(tx.createdAt)}
        </Text>
        <Text style={[styles.txAmount, { color: amtColor, fontSize: fs(12), fontWeight: '500' }]}>
          {formatAmount(tx.amount, tx.type)}
        </Text>
      </View>
    </View>
  );
}

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const user = useAuthStore((s) => s.user);

  const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardQuery();
  const { data: walletData } = useGetWalletQuery();

  const firstName = user?.firstName ?? 'there';
  const balance = walletData?.data?.wallet?.availableBalance ?? 0;
  const accountNumber = walletData?.data?.wallet?.virtualAccountNumber ?? '—';
  const budgets: Budget[] = dashboardData?.data?.budgets ?? [];
  const transactions: Transaction[] = dashboardData?.data?.recentTransactions ?? [];

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const headerBg = isDark ? '#2A1A3E' : '#F2EBFD';
  const textPrimary = isDark ? '#FFFFFF' : '#1A1D23';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const avatarBg = isDark ? '#4A3A6A' : '#E5D8FB';
  const avatarIconColor = isDark ? '#A78BFA' : '#7C3AED';
  const notifBg = isDark ? '#3A2A5E' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top, paddingBottom: vs(24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner */}
        <View style={[styles.headerBanner, { backgroundColor: headerBg, height: vs(232) }]}>
          <View style={[styles.headerRow, { marginTop: vs(98), paddingHorizontal: hs(22) }]}>
            <View style={[styles.avatar, { width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: avatarBg }]}>
              <Ionicons name="person" size={ms(20)} color={avatarIconColor} />
            </View>
            <Text style={[styles.greeting, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32, marginLeft: hs(8) }]}>
              Hi, {firstName}
            </Text>
            <View style={{ flex: 1 }} />
            <View style={[styles.notifBtn, { width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: notifBg }]}>
              <Ionicons name="notifications-outline" size={ms(20)} color={isDark ? '#FFFFFF' : '#1A1D23'} />
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={{ paddingHorizontal: hs(21), marginTop: -vs(80) }}>
          <View style={[styles.balanceCard, { borderRadius: ms(10), overflow: 'hidden', height: vs(152) }]}>
            <View style={[styles.balanceGradient, {
              backgroundColor: '#191970',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: ms(10),
            }]} />
            <View style={[styles.accountRow, { paddingTop: vs(14), paddingHorizontal: hs(14) }]}>
              <Text style={[styles.accountId, { color: 'rgba(255,255,255,0.7)', fontSize: fs(10), letterSpacing: 0.4 }]}>
                {accountNumber}
              </Text>
              <Pressable onPress={() => {}} style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={ms(12)} color="rgba(255,255,255,0.7)" />
              </Pressable>
            </View>
            <Pressable
              onPress={() => setBalanceVisible((v) => !v)}
              style={[styles.balanceRow, { paddingHorizontal: hs(14), marginTop: vs(6) }]}
            >
              <Text style={[styles.balanceText, { color: '#FFFFFF', fontSize: fs(32), letterSpacing: -0.64 }]}>
                {balanceVisible ? formatBalance(balance) : '₦•••,•••.••'}
              </Text>
              <Ionicons
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size={ms(18)}
                color="rgba(255,255,255,0.7)"
                style={{ marginLeft: hs(8) }}
              />
            </Pressable>
            <View style={[styles.cardBtnsRow, { paddingHorizontal: hs(14), marginTop: vs(12), gap: hs(12) }]}>
              <Pressable style={[styles.cardBtn, { borderColor: '#F5F5F5' }]}>
                <Ionicons name="wallet-outline" size={ms(16)} color="#FFFFFF" />
                <Text style={[styles.cardBtnText, { color: '#FFFFFF', fontSize: fs(10), letterSpacing: 0.4 }]}>
                  Transfer +
                </Text>
              </Pressable>
              <Pressable style={[styles.cardBtn, { borderColor: '#00E5E5' }]}>
                <Ionicons name="receipt-outline" size={ms(16)} color="#00E5E5" />
                <Text style={[styles.cardBtnText, { color: '#00E5E5', fontSize: fs(10), letterSpacing: 0.4 }]}>
                  Pay Bills
                </Text>
                <Ionicons name="arrow-forward" size={ms(12)} color="#00E5E5" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActionsRow, { marginTop: vs(12), paddingHorizontal: hs(21), gap: hs(27) }]}>
          <Pressable style={[styles.quickBtn, { backgroundColor: isDark ? '#2A2A2A' : '#EDEDED' }]}>
            <Ionicons name="card-outline" size={ms(20)} color={textPrimary} />
            <Text style={[styles.quickBtnText, { color: textPrimary, fontSize: fs(12) }]}>Save</Text>
          </Pressable>
          <Pressable style={[styles.quickBtn, { backgroundColor: isDark ? '#2A2A2A' : '#EDEDED' }]}>
            <Ionicons name="cash-outline" size={ms(20)} color={textPrimary} />
            <Text style={[styles.quickBtnText, { color: textPrimary, fontSize: fs(12) }]}>Lend</Text>
          </Pressable>
        </View>

        {/* Budget section */}
        <View style={[styles.sectionHeaderRow, { marginTop: vs(20), paddingHorizontal: hs(22) }]}>
          <View>
            <Text style={[styles.sectionTitle, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
              Budget
            </Text>
            <Text style={[styles.sectionSub, { color: textSecondary, fontSize: fs(10) }]}>
              Plan your money
            </Text>
          </View>
          <Pressable onPress={() => (navigation as any).navigate('BudgetDashboard')}>
            <Text style={[styles.viewAll, { color: '#191970', fontSize: fs(10) }]}>
              + Add more
            </Text>
          </Pressable>
        </View>

        {/* Budget horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: hs(21), marginTop: vs(8), gap: hs(10) }}
          style={{ marginTop: vs(4) }}
        >
          {dashboardLoading ? (
            <ActivityIndicator color="#191970" size="small" style={{ marginLeft: hs(8) }} />
          ) : budgets.length > 0 ? (
            budgets.map((b) => (
              <BudgetCard key={b._id} budget={b} isDark={isDark} ms={ms} vs={vs} fs={fs} hs={hs} />
            ))
          ) : null}

          {/* Add budget button */}
          <Pressable
            onPress={() => (navigation as any).navigate('BudgetCreation')}
            style={[
              styles.budgetAddBtn,
              {
                borderColor: isDark ? '#3B3B3B' : '#EDEDED',
                width: ms(93),
                height: vs(86),
                borderRadius: ms(10),
              },
            ]}
          >
            <Ionicons name="add" size={ms(22)} color={isDark ? '#FFFFFF' : '#1A1D23'} />
          </Pressable>
        </ScrollView>

        {/* Transactions section */}
        <View style={[styles.sectionHeaderRow, { marginTop: vs(16), paddingHorizontal: hs(22) }]}>
          <View>
            <Text style={[styles.sectionTitle, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
              Transactions
            </Text>
            <Text style={[styles.sectionSub, { color: textSecondary, fontSize: fs(10) }]}>
              Check out your expenses
            </Text>
          </View>
          <Pressable>
            <Text style={[styles.viewAll, { color: '#191970', fontSize: fs(10) }]}>View all</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: hs(21), marginTop: vs(8) }}>
          {dashboardLoading ? (
            <ActivityIndicator color="#191970" style={{ marginTop: vs(16) }} />
          ) : transactions.length > 0 ? (
            transactions.map((tx) => (
              <TransactionRow key={tx._id} tx={tx} isDark={isDark} ms={ms} vs={vs} fs={fs} hs={hs} />
            ))
          ) : (
            <View style={[
              styles.transactionsEmpty,
              {
                backgroundColor: isDark ? 'rgba(58,58,58,0.6)' : 'rgba(237,237,237,0.6)',
                borderRadius: ms(10),
                height: vs(120),
              },
            ]}>
              <Text style={[styles.emptyText, { color: isDark ? 'rgba(133,133,133,0.5)' : 'rgba(109,109,140,0.3)', fontSize: fs(14) }]}>
                No Transactions yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  headerBanner: { width: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  greeting: { fontWeight: '400' },
  notifBtn: { alignItems: 'center', justifyContent: 'center' },
  balanceCard: {},
  balanceGradient: {},
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  accountId: { fontWeight: '400' },
  copyBtn: { padding: 2 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceText: { fontWeight: '500' },
  cardBtnsRow: { flexDirection: 'row' },
  cardBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  cardBtnText: { fontWeight: '400' },
  quickActionsRow: { flexDirection: 'row' },
  quickBtn: {
    flex: 1,
    height: 35,
    borderRadius: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickBtnText: { fontWeight: '400' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '500' },
  sectionSub: { fontWeight: '400', marginTop: 2 },
  viewAll: { fontWeight: '400' },
  budgetCard: {},
  budgetCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  budgetCardName: { fontWeight: '500', flex: 1 },
  budgetCardAmount: { fontWeight: '400' },
  progressTrack: { height: 7, width: '100%' },
  progressFill: { height: 7 },
  budgetPercent: { fontWeight: '400' },
  budgetAddBtn: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  txRow: {},
  txIconWrap: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  txMerchant: { fontWeight: '400' },
  txCategory: { fontWeight: '400', marginTop: 2 },
  txTime: { fontWeight: '400' },
  txAmount: {},
  transactionsEmpty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontWeight: '400' },
});
