import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuthStore } from '@/stores';
import { useGetDashboardQuery } from '@/services/home/home.query';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import {
  useGetNotificationPreferencesQuery,
  useGetUnreadCountQuery,
} from '@/services/notifications/notifications.query';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { Budget, Transaction } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { HomeBalanceCard } from './HomeBalanceCard';
import { HomeBudgetCard } from './HomeBudgetCard';
import { HomeTransactionRow } from './HomeTransactionRow';
import { homeStyles as styles } from './homeScreen.styles';
import NotificationIcon from '../../../assets/images/home/notification.svg';
import CardReceive from '../../../assets/images/home/card-receive.svg';
import CardReceiveDark from '../../../assets/images/home/card-receive-dark.svg';
import CardEdit from '../../../assets/images/home/card-edit.svg';
import CardEditDark from '../../../assets/images/home/card-edit-dark.svg';
import CardSend from '../../../assets/images/home/card-send.svg';
import PlusIcon from '../../../assets/images/home/plus.svg';

const DEFAULT_AVATAR = require('../../../assets/images/home/avatar.png');

type Props = BottomTabScreenProps<MainTabParamList, 'HomeTab'> & {
  navigation: CompositeNavigationProp<
    BottomTabScreenProps<MainTabParamList, 'HomeTab'>['navigation'],
    NativeStackNavigationProp<RootStackParamList>
  >;
};

function formatBalance(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, fs, ms } = useResponsive();
  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const hidePrefApplied = React.useRef(false);
  const user = useAuthStore((s) => s.user);

  const { data: dashboardData, isLoading: dashboardLoading } =
    useGetDashboardQuery();
  const { data: walletData } = useGetWalletQuery();
  const { data: unreadData } = useGetUnreadCountQuery();
  const { data: prefData } = useGetNotificationPreferencesQuery();
  const unreadCount = unreadData?.data?.count ?? 0;

  React.useEffect(() => {
    if (hidePrefApplied.current || !prefData?.data?.preferences) return;
    hidePrefApplied.current = true;
    if (prefData.data.preferences.hideBalance) {
      setBalanceVisible(false);
    }
  }, [prefData]);

  const firstName = user?.firstName ?? 'there';
  const balance = walletData?.data?.wallet?.availableBalance ?? 0;
  const accountNumber =
    walletData?.data?.wallet?.virtualAccountNumber ?? '—';
  const budgets: Budget[] = dashboardData?.data?.budgets ?? [];
  const transactions: Transaction[] =
    dashboardData?.data?.recentTransactions ?? [];
  const avatarUri = user?.profilePicture;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const headerBg = isDark ? '#2A1A3E' : '#F2EBFD';
  const textPrimary = isDark ? '#FFFFFF' : '#1A1D23';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const linkColor = isDark ? '#A78BFA' : '#191970';
  const pillBg = isDark ? '#2A2A2A' : '#EDEDED';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View
        style={[
          styles.headerBanner,
          { backgroundColor: headerBg, paddingTop: insets.top + 12 },
        ]}
      >
        <View
          style={[
            styles.headerRow,
            {
              paddingHorizontal: hs(22),
              paddingBottom: 88,
            },
          ]}
        >
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Image
              source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
              style={{
                width: ms(40),
                height: ms(40),
                borderRadius: ms(20),
              }}
            />
          </Pressable>
          <Text
            style={[
              styles.greeting,
              {
                color: isDark ? '#FFFFFF' : '#000000',
                fontSize: fs(16),
                letterSpacing: -0.32,
                marginLeft: hs(4),
              },
            ]}
          >
            Hi, {firstName}
          </Text>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => navigation.navigate('NotificationInbox')}
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
            style={{ width: ms(40), height: ms(40) }}
          >
            <NotificationIcon width={ms(40)} height={ms(40)} />
            {unreadCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: ms(16),
                  height: ms(16),
                  borderRadius: ms(8),
                  backgroundColor: '#E05353',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: fs(8), fontWeight: '700' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: -77, paddingHorizontal: hs(22) }}>
        <HomeBalanceCard
          accountNumber={accountNumber}
          balanceLabel={balanceVisible ? formatBalance(balance) : '₦*****'}
          onToggleBalance={() => setBalanceVisible((v) => !v)}
          onPayBills={() => navigation.navigate('PayBills')}
          hs={hs}
          fs={fs}
          ms={ms}
        />
      </View>

      <View
        style={[
          styles.quickActionsRow,
          {
            marginTop: 14,
            paddingHorizontal: hs(22),
            gap: isDark ? hs(40) : hs(27),
            justifyContent: isDark ? 'center' : 'flex-start',
          },
        ]}
      >
        {isDark ? (
          <Pressable
            onPress={() => navigation.navigate('PayBills')}
            style={[
              styles.quickBtn,
              { backgroundColor: '#191970', width: hs(91), flex: 0 },
            ]}
          >
            <CardSend width={ms(24)} height={ms(24)} />
            <Text style={[styles.quickBtnText, { color: '#FFFFFF', fontSize: fs(12) }]}>
              Spend
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => navigation.navigate('SavingsHub')}
          style={[
            styles.quickBtn,
            {
              backgroundColor: isDark ? '#1E1E1E' : pillBg,
              width: isDark ? hs(91) : undefined,
              flex: isDark ? 0 : 1,
            },
          ]}
        >
          {isDark ? (
            <CardReceiveDark width={ms(24)} height={ms(24)} />
          ) : (
            <CardReceive width={ms(24)} height={ms(24)} />
          )}
          <Text
            style={[
              styles.quickBtnText,
              { color: isDark ? '#E0E0E0' : '#000000', fontSize: fs(12) },
            ]}
          >
            Save
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('LendHub')}
          style={[
            styles.quickBtn,
            {
              backgroundColor: isDark ? '#1E1E1E' : pillBg,
              width: isDark ? hs(91) : undefined,
              flex: isDark ? 0 : 1,
            },
          ]}
        >
          {isDark ? (
            <CardEditDark width={ms(24)} height={ms(24)} />
          ) : (
            <CardEdit width={ms(24)} height={ms(24)} />
          )}
          <Text
            style={[
              styles.quickBtnText,
              { color: isDark ? '#E0E0E0' : '#000000', fontSize: fs(12) },
            ]}
          >
            Lend
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, marginTop: 16, minHeight: 0 }}>
        <View
          style={[
            styles.sectionHeaderRow,
            { paddingHorizontal: hs(22) },
          ]}
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 },
              ]}
            >
              Budget
            </Text>
            <Text
              style={[
                styles.sectionSub,
                { color: textSecondary, fontSize: fs(10) },
              ]}
            >
              Plan your money
            </Text>
          </View>
          {budgets.length > 0 ? (
            <Pressable
              onPress={() => (navigation as any).navigate('BudgetDashboard')}
            >
              <Text style={[styles.viewAll, { color: linkColor, fontSize: fs(10) }]}>
                + Add more
              </Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: hs(21),
            gap: hs(18),
            alignItems: 'center',
          }}
          style={{ marginTop: 8, flexGrow: 0 }}
        >
          {dashboardLoading ? (
            <ActivityIndicator color="#191970" size="small" />
          ) : budgets.length === 0 ? (
            <View style={{ width: hs(220) }}>
              <EmptyState
                variant="budgets"
                compact
                title="No budgets yet"
                subtitle="Give your money a plan."
              />
            </View>
          ) : (
            budgets.map((b) => (
              <HomeBudgetCard
                key={b._id}
                budget={b}
                isDark={isDark}
                ms={ms}
                fs={fs}
              />
            ))
          )}
          <Pressable
            onPress={() => (navigation as any).navigate('BudgetCreation')}
            style={[
              styles.budgetAddBtn,
              {
                borderColor: isDark ? '#3B3B3B' : '#EDEDED',
                width: ms(93),
                height: ms(86),
                borderRadius: ms(10),
              },
            ]}
          >
            <PlusIcon width={ms(19)} height={ms(19)} />
          </Pressable>
        </ScrollView>

        <View
          style={[
            styles.sectionHeaderRow,
            { marginTop: 12, paddingHorizontal: hs(22) },
          ]}
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 },
              ]}
            >
              Transactions
            </Text>
            <Text
              style={[
                styles.sectionSub,
                { color: textSecondary, fontSize: fs(10) },
              ]}
            >
              Check out your expenses
            </Text>
          </View>
          {transactions.length > 0 ? (
            <Pressable onPress={() => navigation.navigate('AnalyticsTab')}>
              <Text style={[styles.viewAll, { color: linkColor, fontSize: fs(10) }]}>
                View all
              </Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          style={{ flex: 1, marginTop: 8, minHeight: 0 }}
          contentContainerStyle={{
            paddingHorizontal: hs(22),
            paddingBottom: 8,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {dashboardLoading ? (
            <ActivityIndicator color="#191970" style={{ marginTop: 16 }} />
          ) : transactions.length > 0 ? (
            <View style={{ gap: 10 }}>
              {transactions.map((tx) => (
                <HomeTransactionRow
                  key={tx._id}
                  tx={tx}
                  isDark={isDark}
                  ms={ms}
                  fs={fs}
                  hs={hs}
                />
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.transactionsEmpty,
                {
                  flex: 1,
                  backgroundColor: isDark
                    ? 'rgba(42,34,56,0.55)'
                    : 'rgba(249,247,255,0.9)',
                  borderRadius: ms(14),
                  minHeight: 168,
                  paddingVertical: 8,
                },
              ]}
            >
              <EmptyState
                variant="transactions"
                compact
                title="No transactions yet"
                subtitle="Your spending story starts here."
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
