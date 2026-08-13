import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { LoanAccountCard } from '@/components/LoanAccountCard';
import { useGetLoansQuery } from '@/services/loans/loans.query';
import EyeToggle from '../../../assets/images/home/eye-toggle.svg';
import AddLoan from '../../../assets/images/lend/add-loan.svg';
import AddMore from '../../../assets/images/lend/add-more.svg';

const CARD_BG = require('../../../assets/images/home/balance-dots.png');

type Props = NativeStackScreenProps<RootStackParamList, 'LendHub'>;

function formatMoney(amount: number) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatShort(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function formatDue(date?: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

export function LendHubScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [visible, setVisible] = React.useState(true);
  const { data } = useGetLoansQuery();

  const loans = data?.data?.loans ?? [];
  const total = data?.data?.totalOutstanding ?? 0;
  const isEmpty = loans.length === 0;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const headerBg = isDark ? 'rgba(124,58,237,0.2)' : '#F2EBFD';
  const titleColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#E0E0E0' : '#858585';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={[styles.banner, { backgroundColor: headerBg, paddingTop: insets.top }]}>
        <View
          style={[
            styles.headerRow,
            { paddingHorizontal: hs(22), paddingTop: vs(16), paddingBottom: vs(72) },
          ]}
        >
          <BackButton onPress={() => navigation.goBack()} />
        </View>
      </View>

      <View style={{ marginTop: -vs(60), paddingHorizontal: hs(22) }}>
        <View style={[styles.balanceCard, { height: ms(152), borderRadius: ms(10) }]}>
          <LinearGradient
            colors={['#7C3AED', '#191970']}
            start={{ x: 0.05, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Image
            source={CARD_BG}
            fadeDuration={0}
            style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
            resizeMode="cover"
          />
          <Text style={[styles.cardLabel, { fontSize: fs(16), letterSpacing: -0.32 }]}>
            {isEmpty ? 'Total Outstanding' : 'Total Loan Balance'}
          </Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amount, { fontSize: fs(32), letterSpacing: -0.64 }]}>
              {visible ? formatMoney(total) : '****'}
            </Text>
            <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
              <EyeToggle width={ms(20)} height={ms(18)} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: hs(22), marginTop: vs(29) }}>
        <Text style={[styles.sectionTitle, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
          Loan Accounts
        </Text>
        <Text style={[styles.sectionSub, { color: subColor, fontSize: fs(10) }]}>
          {isEmpty ? 'Your Loan Providers' : 'Your Loan Cards'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(22),
          paddingTop: vs(10),
          paddingBottom: vs(24),
          gap: vs(12),
        }}
        showsVerticalScrollIndicator={false}
      >
        {loans.map((loan) => (
          <LoanAccountCard
            key={loan._id}
            providerName={loan.providerName}
            paid={formatShort(loan.paidAmount)}
            owing={formatShort(loan.outstandingAmount)}
            dueDate={formatDue(loan.dueDate)}
            onPress={() => navigation.navigate('LoanDetail', { loanId: loan._id })}
          />
        ))}

        <Pressable
          onPress={() => navigation.navigate('LinkLoanProvider')}
          style={isEmpty ? { width: hs(168), height: vs(130) } : { alignSelf: 'flex-end' }}
        >
          {isEmpty ? (
            <AddLoan width={hs(168)} height={vs(130)} />
          ) : (
            <AddMore width={hs(124)} height={vs(35)} />
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { width: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  balanceCard: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: { color: '#FFFFFF', fontWeight: '500' },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  amount: { color: '#FFFFFF', fontWeight: '500' },
  sectionTitle: { fontWeight: '500' },
  sectionSub: { fontWeight: '400', marginTop: 2 },
});
