import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { CheckboxOption } from '@/components/CheckboxOption';
import { LoanDonut } from '@/components/LoanDonut';
import { SelectRangeSheet } from '@/components/SelectRangeSheet';
import { useGetLoanQuery, useUpdateLoanMutation } from '@/services/loans/loans.query';
import EyeToggle from '../../../assets/images/home/eye-toggle.svg';

const FAIRMONEY = require('../../../assets/images/lend/fairmoney.png');

type Props = NativeStackScreenProps<RootStackParamList, 'LoanDetail'>;

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

export function LoanDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { loanId } = route.params;
  const { data, isLoading } = useGetLoanQuery(loanId);
  const updateLoan = useUpdateLoanMutation();
  const [visible, setVisible] = React.useState(true);
  const [rangeOpen, setRangeOpen] = React.useState(false);

  const loan = data?.data?.loan;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const heading = isDark ? '#FFFFFF' : '#1A1D23';
  const sub = isDark ? '#AAAAAA' : '#858585';
  const cardBorder = isDark ? '#3B3B3B' : 'rgba(133,133,133,0.7)';
  const amountColor = isDark ? '#FFFFFF' : '#03055B';
  const providerColor = isDark ? '#C8C8C8' : '#6D6D8C';
  const healthy = loan?.health === 'HEALTHY';

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(24) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
          Outstanding Amount
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {isLoading || !loan ? (
        <ActivityIndicator color="#191970" style={{ marginTop: vs(40) }} />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: hs(22),
            paddingTop: vs(16),
            paddingBottom: Math.max(insets.bottom, vs(24)),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.card,
              {
                height: vs(151),
                borderRadius: ms(8),
                borderColor: cardBorder,
              },
            ]}
          >
            <View style={styles.providerRow}>
              <View style={styles.logoStack}>
                <View
                  style={[
                    styles.pBadge,
                    { width: ms(25), height: ms(25), borderRadius: ms(13) },
                  ]}
                >
                  <Text style={{ color: '#03055B', fontSize: fs(16) }}>P</Text>
                </View>
                <Image
                  source={FAIRMONEY}
                  style={{
                    width: ms(23),
                    height: ms(23),
                    borderRadius: ms(12),
                    borderWidth: 0.3,
                    borderColor: '#37A477',
                    marginLeft: -8,
                  }}
                />
              </View>
              <Text style={{ color: providerColor, fontSize: fs(14), marginLeft: hs(8) }}>
                {loan.providerName}
              </Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={[styles.amount, { color: amountColor, fontSize: fs(24), letterSpacing: -0.48 }]}>
                {visible ? formatMoney(loan.outstandingAmount) : '₦****'}
              </Text>
              <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
                <EyeToggle width={ms(19)} height={ms(19)} />
              </Pressable>
            </View>
            <Text style={[styles.due, { fontSize: fs(8) }]}>
              <Text style={{ color: '#03055B' }}>Due Date</Text>
              <Text style={{ color: '#7A7A7A' }}>: {formatDue(loan.dueDate)}</Text>
            </Text>
          </View>

          <View style={[styles.statusRow, { marginTop: vs(23) }]}>
            <View>
              <Text style={[styles.sectionTitle, { color: heading, fontSize: fs(16), letterSpacing: -0.32 }]}>
                Loan Status
              </Text>
              <Text style={[styles.sectionSub, { color: sub, fontSize: fs(10) }]}>
                Check how well you are doing
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: healthy ? 'rgba(16,185,129,0.1)' : 'rgba(255,77,79,0.1)',
                  width: hs(72),
                  height: vs(21),
                  borderRadius: ms(4),
                },
              ]}
            >
              <Text
                style={{
                  color: healthy ? '#00C292' : '#FF4D4F',
                  fontSize: fs(10),
                }}
              >
                {healthy ? 'Healthy' : 'Unhealthy'}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: vs(20) }}>
            <LoanDonut
              paid={loan.paidAmount}
              remaining={loan.outstandingAmount}
              paidLabel={formatShort(loan.paidAmount)}
              remainingLabel={formatShort(loan.outstandingAmount)}
            />
          </View>

          <View style={{ marginTop: vs(24) }}>
            <Text style={[styles.sectionTitle, { color: heading, fontSize: fs(16), letterSpacing: -0.32 }]}>
              Repayment Plan
            </Text>
            <Text style={[styles.sectionSub, { color: sub, fontSize: fs(10) }]}>
              Automate your repayment
            </Text>
            <View style={{ marginTop: vs(12) }}>
              <CheckboxOption
                label="Automate"
                selected={!!loan.automate}
                showCheck={false}
                onPress={() => {
                  if (loan.automate) {
                    updateLoan.mutate({ id: loan._id, automate: false, repaymentFrequency: null });
                    return;
                  }
                  setRangeOpen(true);
                }}
              />
            </View>
          </View>

          <View
            style={[
              styles.reminder,
              {
                marginTop: vs(28),
                height: vs(58),
                borderRadius: ms(8),
                paddingHorizontal: hs(10),
              },
            ]}
          >
            <Text style={{ color: sub, fontSize: fs(14) }}>Reminder</Text>
            <Switch
              value={!!loan.reminderEnabled}
              onValueChange={(value) =>
                updateLoan.mutate({ id: loan._id, reminderEnabled: value })
              }
              trackColor={{ false: '#C4C4C4', true: '#7C3AED' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </ScrollView>
      )}

      <SelectRangeSheet
        visible={rangeOpen}
        onClose={() => setRangeOpen(false)}
        onSelect={(range) => {
          setRangeOpen(false);
          updateLoan.mutate({
            id: loanId,
            automate: true,
            repaymentFrequency: range,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '600', textAlign: 'center' },
  card: {
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  providerRow: { flexDirection: 'row', alignItems: 'center' },
  logoStack: { flexDirection: 'row', alignItems: 'center' },
  pBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.3,
    borderColor: '#03055B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  amount: { fontWeight: '500' },
  due: { position: 'absolute', right: 16, bottom: 10 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontWeight: '500' },
  sectionSub: { fontWeight: '400', marginTop: 2 },
  badge: { alignItems: 'center', justifyContent: 'center' },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
