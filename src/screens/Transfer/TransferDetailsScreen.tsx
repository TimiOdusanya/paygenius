import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import { useResolveTransferAccountQuery } from '@/services/transfer/transfer.query';
import { BankLogo } from '@/components/BankLogo';
import { TransferField } from './TransferField';
import {
  availableForTransfer,
  budgetChipIcon,
  digitsOnly,
  formatAmountInput,
  formatNaira,
  parseAmountSafe,
} from './transfer.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferDetails'>;

export function TransferDetailsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const params = route.params;
  const [accountNumber, setAccountNumber] = React.useState('');
  const [amountText, setAmountText] = React.useState('');
  const [note, setNote] = React.useState('');
  const [budgetOpen, setBudgetOpen] = React.useState(true);
  const [budgetId, setBudgetId] = React.useState(params.budgetId);
  const { data: budgetData } = useGetBudgetsQuery();
  const { data: walletData, isFetched: walletFetched } = useGetWalletQuery();
  const budgets = budgetData?.data?.budgets ?? [];
  const walletBalance = walletData?.data?.wallet?.availableBalance ?? 0;

  const resolve = useResolveTransferAccountQuery({
    accountNumber: digitsOnly(accountNumber),
    rail: params.rail,
    bankCode: params.bankCode,
    bankName: params.bankName,
  });

  const account = resolve.data?.data?.account;
  const amount = parseAmountSafe(amountText);
  const selectedBudget = budgets.find((item) => item._id === budgetId);
  const paymentSource = budgetId ? 'BUDGET' : params.paymentSource ?? 'WALLET';
  const available = availableForTransfer({
    walletBalance,
    paymentSource,
    budget: selectedBudget,
  });
  const insufficient = walletFetched && amount > 0 && amount > available;
  const canConfirm = !!account?.name && amount >= 100 && walletFetched && !insufficient;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const labelColor = isDark ? '#FFFFFF' : '#000000';

  const onContinue = () => {
    if (!account || !canConfirm) return;
    navigation.navigate('TransferReview', {
      rail: account.rail,
      amount,
      note: note.trim() || undefined,
      recipientUserId: account.recipientUserId,
      accountNumber: account.accountNumber,
      accountName: account.name,
      bankCode: account.bankCode ?? params.bankCode,
      bankName: account.bankName ?? params.bankName,
      bankLogo: params.bankLogo,
      paymentSource,
      budgetId,
      budgetName: selectedBudget?.name ?? params.budgetName,
      saveBeneficiary: true,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
        <ScreenTitleBar
          title="Make Transfers"
          subtitle="Select an account"
          onBack={() => navigation.goBack()}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: hs(21),
            paddingTop: vs(36),
            paddingBottom: vs(24),
            gap: vs(12),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: vs(4) }}>
            <BankLogo
              uri={params.bankLogo}
              size={ms(32)}
              paygenius={params.rail === 'PAYGENIUS'}
            />
            <Text style={{ color: labelColor, fontSize: fs(13), fontWeight: '500' }}>
              {params.bankName || (params.rail === 'PAYGENIUS' ? 'PayGenius' : 'Bank')}
            </Text>
          </View>
          <TransferField
            label="Enter Account Number"
            focused
            value={accountNumber}
            onChangeText={(value) => setAccountNumber(digitsOnly(value).slice(0, 10))}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="10-digit account number"
          />

          <View>
            <TransferField
              label="Account Name"
              value={account?.name ?? ''}
              editable={false}
              placeholder={
                resolve.isFetching
                  ? 'Resolving…'
                  : resolve.isError
                    ? 'Account not found'
                    : 'Name appears after resolve'
              }
            />
            {resolve.isFetching ? (
              <ActivityIndicator
                size="small"
                color="#191970"
                style={{ position: 'absolute', right: hs(16), top: vs(36) }}
              />
            ) : null}
          </View>

          <View>
            <TransferField
              label="Enter Amount"
              value={amountText}
              onChangeText={(value) => setAmountText(formatAmountInput(value))}
              keyboardType="decimal-pad"
              placeholder="₦200,000"
            />
            <Text
              style={{
                color: insufficient ? '#E05353' : isDark ? '#AAAAAA' : '#858585',
                fontSize: fs(10),
                marginTop: vs(6),
              }}
            >
              {!walletFetched
                ? 'Checking balance…'
                : insufficient
                  ? `Insufficient balance. Available ${formatNaira(available)}`
                  : `Available balance ${formatNaira(available)}`}
            </Text>
          </View>

          <TransferField
            label="Description"
            value={note}
            onChangeText={setNote}
            placeholder="Optional"
            tall
          />

          {budgets.length > 0 ? (
            <View style={{ marginTop: vs(8) }}>
              <Pressable onPress={() => setBudgetOpen((open) => !open)} style={styles.budgetHeader}>
                <Text
                  style={{
                    color: labelColor,
                    fontSize: fs(11),
                    fontWeight: '700',
                    letterSpacing: 0.25,
                  }}
                >
                  Budget Category
                </Text>
                <Ionicons
                  name={budgetOpen ? 'chevron-up' : 'chevron-forward'}
                  size={ms(14)}
                  color={labelColor}
                />
              </Pressable>
              {budgetOpen ? (
                <View style={[styles.chips, { marginTop: vs(16), gap: hs(11) }]}>
                  {budgets.map((budget) => {
                    const selected = budget._id === budgetId;
                    return (
                      <Pressable
                        key={budget._id}
                        onPress={() => setBudgetId(selected ? undefined : budget._id)}
                        style={[
                          styles.chip,
                          {
                            width: hs(103),
                            height: vs(41),
                            borderRadius: ms(75),
                            backgroundColor: selected ? '#191970' : isDark ? '#2A2A2A' : '#EDEDED',
                          },
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            color: selected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#000000',
                            fontSize: fs(10),
                            fontWeight: '500',
                            letterSpacing: 0.4,
                            maxWidth: hs(68),
                          }}
                        >
                          {budget.name}
                        </Text>
                        <Ionicons
                          name={budgetChipIcon(budget)}
                          size={ms(11)}
                          color={selected ? '#FFFFFF' : isDark ? '#CCCCCC' : '#000000'}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: hs(21),
            paddingBottom: Math.max(insets.bottom, vs(18)),
          }}
        >
          <Pressable
            disabled={!canConfirm}
            onPress={onContinue}
            style={[
              styles.confirm,
              {
                height: vs(54),
                borderRadius: ms(14),
                backgroundColor: canConfirm ? '#191970' : '#EDEDED',
              },
            ]}
          >
            <Text
              style={{
                fontSize: fs(12),
                fontWeight: '600',
                color: canConfirm ? '#FFFFFF' : '#000000',
              }}
            >
              Confirm
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirm: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
