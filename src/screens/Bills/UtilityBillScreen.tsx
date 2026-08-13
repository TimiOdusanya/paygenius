import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { SoftField } from '@/components/SoftField';
import { WalletSourceField, type WalletSourceOption } from '@/components/WalletSourceField';
import { OptionPickerSheet } from '@/components/OptionPickerSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import {
  useGetBillersQuery,
  useGetDataPlansQuery,
  useValidateBillCustomerMutation,
} from '@/services/bills/bills.query';
import type { BillCategory, MeterType } from '@/services/bills/bills.type';
import { getApiErrorMessage } from '@/utils/errors';
import { billerLogoSource, digitsOnly, parseAmountSafe, walletOptions } from './bills.helpers';

type ElectricityProps = NativeStackScreenProps<RootStackParamList, 'BillElectricity'>;
type TelevisionProps = NativeStackScreenProps<RootStackParamList, 'BillTelevision'>;

type SharedProps = {
  category: BillCategory;
  title: string;
  customerLabel: string;
  customerPlaceholder: string;
  navigation: ElectricityProps['navigation'] | TelevisionProps['navigation'];
};

function UtilityBillForm({
  category,
  title,
  customerLabel,
  customerPlaceholder,
  navigation,
}: SharedProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { data: budgetData } = useGetBudgetsQuery();
  const { data: billerData, isLoading, isError, error, refetch } = useGetBillersQuery(category);
  const validateCustomer = useValidateBillCustomerMutation();
  const budgets = budgetData?.data?.budgets ?? [];
  const billers = billerData?.data?.billers ?? [];
  const options = walletOptions(budgets, category);

  const [billerCode, setBillerCode] = React.useState('');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [planOpen, setPlanOpen] = React.useState(false);
  const [meterTypeOpen, setMeterTypeOpen] = React.useState(false);
  const [customerId, setCustomerId] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [planCode, setPlanCode] = React.useState('');
  const [meterType, setMeterType] = React.useState<MeterType>('prepaid');
  const [customerName, setCustomerName] = React.useState('');
  const [validatedId, setValidatedId] = React.useState('');
  const [source, setSource] = React.useState<WalletSourceOption>(options[0]);

  const selected = billers.find((item) => item.code === billerCode);
  const needsPlan = category === 'TELEVISION';
  const { data: planData, isLoading: plansLoading } = useGetDataPlansQuery(
    needsPlan ? billerCode || undefined : undefined
  );
  const plans = planData?.data?.plans ?? [];
  const selectedPlan = plans.find((plan) => plan.code === planCode);
  const logo = billerLogoSource(selected);
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const heading = isDark ? '#FFFFFF' : '#1A1D23';
  const sub = isDark ? '#AAAAAA' : '#858585';
  const okColor = isDark ? '#6EE7B7' : '#047857';
  const idDigits = digitsOnly(customerId);
  const isVerified = validatedId === idDigits && !!customerName;

  const runValidate = React.useCallback(
    (id: string) => {
      if (!selected || id.length < 8) {
        setCustomerName('');
        setValidatedId('');
        return;
      }
      validateCustomer.mutate(
        {
          category,
          billerCode: selected.code,
          customerId: id,
          meterType: category === 'ELECTRICITY' ? meterType : undefined,
        },
        {
          onSuccess: (res) => {
            setCustomerName(res.data?.customerName ?? '');
            setValidatedId(id);
          },
          onError: (err) => {
            setCustomerName('');
            setValidatedId('');
            Alert.alert(
              customerLabel,
              getApiErrorMessage(err, 'This number could not be verified for the selected provider.')
            );
          },
        }
      );
    },
    [category, customerLabel, meterType, selected, validateCustomer]
  );

  const goToPin = (id: string, name?: string) => {
    const value = selectedPlan?.amount || parseAmountSafe(amount);
    if (!selected) {
      Alert.alert('Provider', 'Select a service provider.');
      return;
    }
    if (needsPlan && !selectedPlan) {
      Alert.alert('Plan', 'Select a subscription plan.');
      return;
    }
    if (!needsPlan && value < (selected.minAmount && selected.minAmount > 0 ? selected.minAmount : 50)) {
      Alert.alert('Amount', 'Enter a valid amount.');
      return;
    }
    if (source.source === 'BUDGET' && !source.budgetId) {
      Alert.alert('Budget', 'Create a matching budget first to pay from it.');
      return;
    }
    navigation.navigate('BillPin', {
      category,
      billerCode: selected.code,
      customerId: id,
      amount: value,
      paymentSource: source.source,
      budgetId: source.budgetId,
      planCode: selectedPlan?.code,
      planName: selectedPlan?.name,
      meterType: category === 'ELECTRICITY' ? meterType : undefined,
    });
    if (name) setCustomerName(name);
  };

  const confirm = () => {
    const id = digitsOnly(customerId);
    if (!selected) {
      Alert.alert('Provider', 'Select a service provider.');
      return;
    }
    if (id.length < 8) {
      Alert.alert(customerLabel, `Enter a valid ${customerLabel.toLowerCase()}.`);
      return;
    }
    if (isVerified) {
      goToPin(id, customerName);
      return;
    }
    validateCustomer.mutate(
      {
        category,
        billerCode: selected.code,
        customerId: id,
        meterType: category === 'ELECTRICITY' ? meterType : undefined,
      },
      {
        onSuccess: (res) => {
          setCustomerName(res.data?.customerName ?? '');
          setValidatedId(id);
          goToPin(id, res.data?.customerName);
        },
        onError: (err) => {
          Alert.alert(
            customerLabel,
            getApiErrorMessage(err, 'This number could not be verified for the selected provider.')
          );
        },
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ paddingHorizontal: hs(21), paddingTop: vs(13) }}>
          <ScreenTitleBar title={title} onBack={() => navigation.goBack()} />
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
            Service Providers
          </Text>
          <Text style={[styles.sub, { color: sub, fontSize: fs(10), marginTop: vs(2) }]}>
            Select Service Providers
          </Text>
          {isLoading ? (
            <ActivityIndicator color="#191970" style={{ marginVertical: vs(16) }} />
          ) : isError ? (
            <Text
              onPress={() => refetch()}
              style={[styles.sub, { color: '#7C3AED', fontSize: fs(12), marginVertical: vs(12) }]}
            >
              {getApiErrorMessage(error, 'Could not load providers. Tap to retry.')}
            </Text>
          ) : (
            <SoftField
              containerStyle={{ marginTop: vs(12) }}
              value={selected?.name ?? ''}
              placeholder="Select provider"
              showChevron
              onPress={() => setPickerOpen(true)}
              left={
                logo ? (
                  <Image
                    source={logo}
                    style={{ width: ms(30), height: ms(30), borderRadius: ms(15) }}
                  />
                ) : selected ? (
                  <View
                    style={[
                      styles.initial,
                      { width: ms(30), height: ms(30), borderRadius: ms(15) },
                    ]}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: fs(10), fontWeight: '600' }}>
                      {selected.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
          {category === 'ELECTRICITY' ? (
            <SoftField
              label="Meter type"
              placeholder="Prepaid"
              value={meterType === 'postpaid' ? 'Postpaid' : 'Prepaid'}
              showChevron
              onPress={() => setMeterTypeOpen(true)}
              containerStyle={{ marginTop: vs(12) }}
            />
          ) : null}
          <SoftField
            label={customerLabel}
            placeholder={customerPlaceholder}
            keyboardType="number-pad"
            value={customerId}
            onChangeText={(text) => {
              setCustomerId(text);
              setCustomerName('');
              setValidatedId('');
            }}
            onBlur={() => runValidate(idDigits)}
            containerStyle={{ marginTop: vs(32) }}
          />
          {validateCustomer.isPending ? (
            <Text style={[styles.sub, { color: sub, fontSize: fs(10), marginTop: vs(6) }]}>
              Verifying…
            </Text>
          ) : isVerified ? (
            <Text style={[styles.sub, { color: okColor, fontSize: fs(10), marginTop: vs(6) }]}>
              {customerName}
            </Text>
          ) : null}
          {needsPlan ? (
            <SoftField
              label="Subscription plan"
              placeholder={plansLoading ? 'Loading plans…' : 'Select plan'}
              value={selectedPlan?.name ?? ''}
              showChevron
              onPress={() => selected && !plansLoading && setPlanOpen(true)}
              containerStyle={{ marginTop: vs(12) }}
            />
          ) : (
            <SoftField
              label="Amount"
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              containerStyle={{ marginTop: vs(12) }}
            />
          )}
          <View style={{ marginTop: vs(24) }}>
            <WalletSourceField value={source} options={options} onChange={setSource} />
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: hs(26),
            paddingBottom: Math.max(insets.bottom, vs(16)),
          }}
        >
          <PrimaryButton
            title={validateCustomer.isPending ? 'Verifying…' : 'Confirm'}
            onPress={confirm}
            disabled={!selected || idDigits.length < 8 || validateCustomer.isPending}
          />
        </View>
      </KeyboardAvoidingView>

      <OptionPickerSheet
        visible={pickerOpen}
        title="Select Service Providers"
        options={billers.map((biller) => ({
          id: biller.code,
          label: biller.name,
          logo: billerLogoSource(biller),
          logoUri: biller.image,
        }))}
        selectedId={selected?.code}
        onClose={() => setPickerOpen(false)}
        onSelect={(option) => {
          setBillerCode(option.id);
          setPlanCode('');
          setCustomerName('');
          setValidatedId('');
        }}
      />
      <OptionPickerSheet
        visible={meterTypeOpen}
        title="Meter type"
        options={[
          { id: 'prepaid', label: 'Prepaid' },
          { id: 'postpaid', label: 'Postpaid' },
        ]}
        selectedId={meterType}
        onClose={() => setMeterTypeOpen(false)}
        onSelect={(option) => {
          setMeterType(option.id as MeterType);
          setCustomerName('');
          setValidatedId('');
        }}
      />
      <OptionPickerSheet
        visible={planOpen}
        title="Select plan"
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

export function ElectricityScreen({ navigation }: ElectricityProps) {
  return (
    <UtilityBillForm
      category="ELECTRICITY"
      title="Electricity"
      customerLabel="Enter Meter Number"
      customerPlaceholder="123  456 789 00"
      navigation={navigation}
    />
  );
}

export function TelevisionScreen({ navigation }: TelevisionProps) {
  return (
    <UtilityBillForm
      category="TELEVISION"
      title="Television"
      customerLabel="Enter Smartcard Number"
      customerPlaceholder="123 456 789 00"
      navigation={navigation}
    />
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
  initial: {
    backgroundColor: '#191970',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
