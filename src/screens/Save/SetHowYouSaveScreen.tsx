import React, { useMemo, useState } from 'react';
import {
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
import { BackButton } from '@/components/BackButton';
import { CheckboxOption } from '@/components/CheckboxOption';
import { DateOfBirthField } from '@/components/DateOfBirthField';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TogglePills } from '@/components/TogglePills';
import { formatAmountInput, parseAmountInput } from '@/utils/amount';
import type { SavingFrequency, SavingType } from '@/services/savings/savings.type';
import CalendarIcon from '../../../assets/images/save/calendar.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SetHowYouSave'>;

const FREQUENCIES: SavingFrequency[] = ['DAILY', 'WEEKLY', 'MONTHLY'];

export function SetHowYouSaveScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [savingType, setSavingType] = useState<SavingType | null>(null);
  const [frequency, setFrequency] = useState<SavingFrequency>('WEEKLY');
  const [amount, setAmount] = useState('');
  const [maturity, setMaturity] = useState<Date | null>(null);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const labelColor = isDark ? '#FFFFFF' : '#000000';
  const noteColor = isDark ? '#AAAAAA' : '#858585';
  const howOftenColor = isDark ? '#FFFFFF' : '#1A1D23';
  const parsed = parseAmountInput(amount);

  const amountLabel = useMemo(() => {
    if (savingType === 'ONE_TIME') return 'Enter the amount you want to save';
    const word =
      frequency === 'DAILY' ? 'Daily' : frequency === 'MONTHLY' ? 'Monthly' : 'Weekly';
    return `Enter the amount you want to save ${word}`;
  }, [savingType, frequency]);

  const canContinue =
    savingType === 'ONE_TIME'
      ? parsed > 0
      : savingType === 'RECURRING' && parsed > 0;

  const handleContinue = () => {
    if (!savingType || !canContinue) return;
    navigation.navigate('SaveFrom', {
      ...route.params,
      savingType,
      frequency: savingType === 'RECURRING' ? frequency : undefined,
      installmentAmount: parsed,
      maturityDate: maturity ? maturity.toISOString() : undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600', letterSpacing: -0.32 }}>
            Set how you will save
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: hs(21), paddingTop: vs(32) }}
        >
          <Text style={{ color: labelColor, fontSize: fs(14), marginBottom: vs(9) }}>
            Saving Type
          </Text>
          <TogglePills
            options={[
              { value: 'ONE_TIME', label: 'One Time' },
              { value: 'RECURRING', label: 'Recurring' },
            ]}
            value={savingType}
            onChange={setSavingType}
          />

          {savingType === 'RECURRING' ? (
            <View style={{ marginTop: vs(24) }}>
              <Text style={{ color: howOftenColor, fontSize: fs(12), marginBottom: vs(8) }}>
                How Often
              </Text>
              <View style={{ gap: vs(8) }}>
                {FREQUENCIES.map((item) => (
                  <CheckboxOption
                    key={item}
                    label={item.charAt(0) + item.slice(1).toLowerCase()}
                    selected={frequency === item}
                    onPress={() => setFrequency(item)}
                    selectedColor="#191970"
                    showCheck={false}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {savingType ? (
            <View style={{ marginTop: vs(24) }}>
              <Text style={{ color: howOftenColor, fontSize: fs(12), marginBottom: vs(3) }}>
                {amountLabel}
              </Text>
              <FormInput
                placeholder="Enter amount"
                value={amount}
                onChangeText={(t) => setAmount(formatAmountInput(t))}
                keyboardType="decimal-pad"
              />
            </View>
          ) : null}

          {savingType === 'RECURRING' ? (
            <View style={{ marginTop: vs(9) }}>
              <DateOfBirthField
                label="Date of Maturity"
                variant="input"
                value={maturity}
                onChange={setMaturity}
                placeholder="MM/DD/YY"
                minimumDate={new Date()}
                maximumDate={new Date(2100, 11, 31)}
                sheetTitle="Date of Maturity"
                rightIcon={<CalendarIcon width={ms(26)} height={ms(26)} />}
              />
            </View>
          ) : null}
        </ScrollView>

        {savingType ? (
          <Text
            style={{
              color: noteColor,
              fontSize: fs(10),
              textAlign: 'center',
              paddingHorizontal: hs(63),
              marginBottom: vs(16),
            }}
          >
            Note: Please note that you can’t access your money until the specified date or specified amount is reached
          </Text>
        ) : null}

        <View style={{ paddingHorizontal: hs(22), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
          <PrimaryButton title="Continue" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
