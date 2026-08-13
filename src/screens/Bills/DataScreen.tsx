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
import { OptionPickerSheet } from '@/components/OptionPickerSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import { useGetBillersQuery, useGetDataPlansQuery } from '@/services/bills/bills.query';
import { getApiErrorMessage } from '@/utils/errors';
import { digitsOnly, formatPhoneGroups, sortNetworkBillers, walletOptions } from './bills.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'BillData'>;

export function DataScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const { data: budgetData } = useGetBudgetsQuery();
  const { data: billerData, isLoading, isError, error, refetch } = useGetBillersQuery('DATA');
  const budgets = budgetData?.data?.budgets ?? [];
  const options = walletOptions(budgets, 'DATA');
  const billers = sortNetworkBillers(billerData?.data?.billers ?? []);

  const [network, setNetwork] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [planCode, setPlanCode] = React.useState('');
  const [planOpen, setPlanOpen] = React.useState(false);
  const [source, setSource] = React.useState<WalletSourceOption>(options[0]);

  const { data: planData, isLoading: plansLoading } = useGetDataPlansQuery(network || undefined);
  const plans = planData?.data?.plans ?? [];
  const selectedPlan = plans.find((plan) => plan.code === planCode);
  const selected = billers.find((item) => item.code === network);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const heading = isDark ? '#FFFFFF' : '#1A1D23';
  const sub = isDark ? '#AAAAAA' : '#858585';
  const showForm = !!selected;

  const continuePay = () => {
    const customerId = digitsOnly(phone);
    if (!selected) {
      Alert.alert('Network', 'Select a network provider.');
      return;
    }
    if (!/^0[7-9]\d{8,10}$/.test(customerId)) {
      Alert.alert('Phone number', 'Enter a valid Nigerian phone number.');
      return;
    }
    if (!selectedPlan) {
      Alert.alert('Data plan', 'Select a data plan to continue.');
      return;
    }
    if (source.source === 'BUDGET' && !source.budgetId) {
      Alert.alert('Budget', 'Create a data budget first to pay from it.');
      return;
    }
    navigation.navigate('BillPin', {
      category: 'DATA',
      billerCode: selected.code,
      customerId,
      amount: selectedPlan.amount,
      paymentSource: source.source,
      budgetId: source.budgetId,
      planCode: selectedPlan.code,
      planName: selectedPlan.name,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
          <ScreenTitleBar title="Data" onBack={() => navigation.goBack()} />
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
              <NetworkProviderRow
                selected={network}
                onSelect={(code) => {
                  setNetwork(code);
                  setPlanCode('');
                }}
                billers={billers}
              />
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
                label="Data plan"
                placeholder={plansLoading ? 'Loading plans…' : 'Select data plan'}
                value={selectedPlan?.name ?? ''}
                showChevron
                onPress={() => !plansLoading && setPlanOpen(true)}
                containerStyle={{ marginTop: vs(12) }}
              />
              <View style={{ marginTop: vs(24) }}>
                <WalletSourceField
                  value={source}
                  options={options}
                  onChange={setSource}
                />
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

      <OptionPickerSheet
        visible={planOpen}
        title="Select data plan"
        options={plans.map((plan) => ({
          id: plan.code,
          label: `${plan.name}  ·  ₦${plan.amount.toLocaleString('en-NG')}`,
        }))}
        selectedId={planCode}
        onClose={() => setPlanOpen(false)}
        onSelect={(option) => setPlanCode(option.id)}
      />
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
