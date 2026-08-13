import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { NetworkProviderRow } from '@/components/NetworkProviderRow';
import { SoftField } from '@/components/SoftField';
import { WalletSourceField, type WalletSourceOption } from '@/components/WalletSourceField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import { useGetBillersQuery } from '@/services/bills/bills.query';
import { getApiErrorMessage } from '@/utils/errors';
import { digitsOnly, formatPhoneGroups, parseAmountSafe, sortNetworkBillers, walletOptions } from './bills.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'BillAirtime'>;

export function AirtimeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const { data } = useGetBudgetsQuery();
  const { data: billerData, isLoading, isError, error, refetch } = useGetBillersQuery('AIRTIME');
  const budgets = data?.data?.budgets ?? [];
  const options = walletOptions(budgets, 'AIRTIME');
  const billers = sortNetworkBillers(billerData?.data?.billers ?? []);

  const [network, setNetwork] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [source, setSource] = React.useState<WalletSourceOption>(options[0]);

  React.useEffect(() => {
    if (network && !billers.some((item) => item.code === network)) {
      setNetwork('');
    }
  }, [billers, network]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const heading = isDark ? '#FFFFFF' : '#1A1D23';
  const sub = isDark ? '#AAAAAA' : '#858585';
  const selected = billers.find((item) => item.code === network);
  const showForm = !!selected;

  const continuePay = () => {
    const customerId = digitsOnly(phone);
    const value = parseAmountSafe(amount);
    if (!selected) {
      Alert.alert('Network', 'Select a network provider.');
      return;
    }
    if (!/^0[7-9]\d{8,10}$/.test(customerId)) {
      Alert.alert('Phone number', 'Enter a valid Nigerian phone number.');
      return;
    }
    const minimum = selected.minAmount && selected.minAmount > 0 ? selected.minAmount : 50;
    if (value < minimum) {
      Alert.alert('Amount', `Enter an amount of at least ₦${minimum}.`);
      return;
    }
    if (selected.maxAmount && value > selected.maxAmount) {
      Alert.alert('Amount', `Amount cannot exceed ₦${selected.maxAmount}.`);
      return;
    }
    if (source.source === 'BUDGET' && !source.budgetId) {
      Alert.alert('Budget', 'Create an airtime budget first to pay from it.');
      return;
    }
    navigation.navigate('BillPin', {
      category: 'AIRTIME',
      billerCode: selected.code,
      customerId,
      amount: value,
      paymentSource: source.source,
      budgetId: source.budgetId,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
          <ScreenTitleBar title="Airtime" onBack={() => navigation.goBack()} />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: hs(22),
            paddingTop: vs(21),
            paddingBottom: vs(24),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.section, { color: heading, fontSize: fs(16), letterSpacing: -0.32 }]}>
            Network Providers
          </Text>
          <Text style={[styles.sub, { color: sub, fontSize: fs(10), marginTop: vs(2) }]}>
            Select Network Providers
          </Text>
          <View style={{ marginTop: vs(12) }}>
            {isLoading ? (
              <ActivityIndicator color="#191970" style={{ marginVertical: vs(16) }} />
            ) : isError ? (
              <Text
                onPress={() => refetch()}
                style={[styles.sub, { color: '#7C3AED', fontSize: fs(12), marginVertical: vs(8) }]}
              >
                {getApiErrorMessage(error, 'Could not load networks. Tap to retry.')}
              </Text>
            ) : (
              <NetworkProviderRow selected={network} onSelect={setNetwork} billers={billers} />
            )}
          </View>

          {showForm ? (
            <>
              <Text
                style={[
                  styles.section,
                  { color: heading, fontSize: fs(16), letterSpacing: -0.32, marginTop: vs(24) },
                ]}
              >
                Input Details
              </Text>
              <Text style={[styles.sub, { color: sub, fontSize: fs(10), marginTop: vs(2) }]}>
                Enter your Number and Amount
              </Text>
              <SoftField
                label="Input Phone Number"
                placeholder="090 000 000 00"
                keyboardType="phone-pad"
                value={formatPhoneGroups(phone)}
                onChangeText={setPhone}
                containerStyle={{ marginTop: vs(12) }}
              />
              <SoftField
                label="Amount"
                placeholder="#500"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                containerStyle={{ marginTop: vs(12) }}
              />
              <View style={{ marginTop: vs(24) }}>
                <WalletSourceField value={source} options={options} onChange={setSource} />
              </View>
            </>
          ) : null}
        </ScrollView>

        {showForm ? (
          <View
            style={{
              paddingHorizontal: hs(22),
              paddingBottom: Math.max(insets.bottom, vs(16)),
            }}
          >
            <PrimaryButton title="Continue" onPress={continuePay} />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    fontWeight: '500',
    textAlign: 'left',
  },
  sub: {
    fontWeight: '400',
    textAlign: 'left',
  },
});
