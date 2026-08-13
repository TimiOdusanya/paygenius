import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { FormInput, PasswordInput, SelectInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAddLinkedCardMutation } from '@/services/savings/savings.query';
import {
  useGetBanksQuery,
  useResolveAccountQuery,
  useResolveCardBinQuery,
} from '@/services/verify/verify.query';
import { getApiErrorMessage } from '@/utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDebitCard'>;

function digitsOnly(value: string, max: number) {
  return value.replace(/\D/g, '').slice(0, max);
}

function groupInFours(value: string) {
  return value.replace(/(.{4})/g, '$1 ').trim();
}

function formatCardNumber(digits: string, visible: boolean) {
  if (!digits) return '';
  if (visible) return groupInFours(digits);
  if (digits.length <= 4) return digits;
  return groupInFours('*'.repeat(digits.length - 4) + digits.slice(-4));
}

function luhnValid(digits: string) {
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function expiryValid(month: string, year: string) {
  const mm = Number(month);
  const yy = Number(year.length === 2 ? `20${year}` : year);
  if (!Number.isInteger(mm) || mm < 1 || mm > 12) return false;
  if (!Number.isInteger(yy) || yy < 2000) return false;
  return new Date(yy, mm, 0, 23, 59, 59) >= new Date();
}

export function AddDebitCardScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardDigits, setCardDigits] = useState('');
  const [cardVisible, setCardVisible] = useState(true);
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const addCard = useAddLinkedCardMutation();
  const saveDraft = route.params?.saveDraft;
  const { data: banksData, isLoading: banksLoading } = useGetBanksQuery();
  const banks = banksData?.data?.banks ?? [];
  const selectedBank = banks.find((bank) => bank.name === bankName);

  const accountQuery = useResolveAccountQuery(
    accountNumber.length === 10 ? accountNumber : undefined,
    selectedBank?.code
  );
  const bin = cardDigits.slice(0, 6);
  const binQuery = useResolveCardBinQuery(bin.length >= 6 ? bin : undefined);

  const resolvedName = accountQuery.data?.data?.account.accountName ?? '';
  const cardMeta = binQuery.data?.data?.card;
  const accountOk = !!resolvedName && !accountQuery.isError;
  const cardNumberOk = luhnValid(cardDigits) && !!cardMeta && !binQuery.isError;
  const expiryOk = expiryValid(expiryMonth, expiryYear);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const eyeColor = isDark ? '#AAAAAA' : '#858585';
  const disclaimerColor = isDark ? '#AAAAAA' : '#858585';
  const hintColor = isDark ? '#A7F3D0' : '#047857';
  const warnColor = isDark ? '#FCA5A5' : '#B91C1C';

  const canSave =
    !!selectedBank &&
    accountOk &&
    cardNumberOk &&
    expiryOk &&
    cvv.length >= 3;

  const handleSave = () => {
    if (!canSave || !selectedBank) {
      Alert.alert('Account not verified', 'Select a bank, use a real account number, and a valid card before saving.');
      return;
    }

    addCard.mutate(
      {
        accountName: resolvedName,
        accountNumber,
        bankCode: selectedBank.code,
        cardNumber: cardDigits,
        expiryMonth,
        expiryYear,
      },
      {
        onSuccess: (data) => {
          if (saveDraft) {
            navigation.replace('SavePleaseWait', {
              ...saveDraft,
              sourceType: 'LINKED_ACCOUNT',
              linkedAccountId: data.data?.card._id,
            });
            return;
          }
          Alert.alert('Success', 'Account linked successfully.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (err) => {
          Alert.alert(
            'Could not save account',
            getApiErrorMessage(err, 'This account or card could not be verified.')
          );
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: hs(21), paddingTop: vs(16) }}>
          <Header
            onBack={() => navigation.goBack()}
            title="Add Account"
            description="Add a bank account that's linked to your BVN"
          />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: hs(21),
            paddingTop: vs(24),
            paddingBottom: vs(16),
            gap: vs(8),
          }}
        >
          <SelectInput
            label="Bank"
            value={bankName}
            placeholder={banksLoading ? 'Loading banks…' : 'Select bank'}
            options={banks.map((bank) => bank.name)}
            onSelect={setBankName}
            searchable
            searchPlaceholder="Search banks"
          />
          <FormInput
            label="Account Number"
            value={accountNumber}
            onChangeText={(t) => setAccountNumber(digitsOnly(t, 10))}
            keyboardType="number-pad"
            maxLength={10}
          />
          {accountQuery.isFetching ? (
            <Text style={[styles.hint, { color: disclaimerColor, fontSize: fs(10) }]}>
              Checking this account…
            </Text>
          ) : accountQuery.isError ? (
            <Text style={[styles.hint, { color: warnColor, fontSize: fs(10) }]}>
              {getApiErrorMessage(accountQuery.error, 'This account number is not valid for the selected bank.')}
            </Text>
          ) : resolvedName ? (
            <Text style={[styles.hint, { color: hintColor, fontSize: fs(10) }]}>
              {resolvedName}
            </Text>
          ) : null}
          <FormInput
            label="Account Name"
            value={resolvedName}
            editable={false}
            placeholder="Filled after the account is verified"
          />
          <FormInput
            label="Card Number"
            value={formatCardNumber(cardDigits, cardVisible)}
            onChangeText={(text) => {
              if (cardVisible) {
                setCardDigits(digitsOnly(text, 19));
                return;
              }
              const displayed = formatCardNumber(cardDigits, false);
              if (text.length < displayed.length) {
                setCardDigits(cardDigits.slice(0, -1));
                return;
              }
              setCardDigits(digitsOnly(cardDigits + text.slice(displayed.length), 19));
            }}
            placeholder="**** **** **** 1234"
            keyboardType="number-pad"
            rightIcon={
              <Pressable
                onPress={() => setCardVisible((v) => !v)}
                hitSlop={8}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={cardVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={16}
                  color={eyeColor}
                />
              </Pressable>
            }
          />
          {binQuery.isFetching ? (
            <Text style={[styles.hint, { color: disclaimerColor, fontSize: fs(10) }]}>
              Checking this card…
            </Text>
          ) : cardDigits.length >= 6 && binQuery.isError ? (
            <Text style={[styles.hint, { color: warnColor, fontSize: fs(10) }]}>
              {getApiErrorMessage(binQuery.error, 'This card number is not valid.')}
            </Text>
          ) : cardDigits.length >= 13 && !luhnValid(cardDigits) ? (
            <Text style={[styles.hint, { color: warnColor, fontSize: fs(10) }]}>
              This card number failed the checksum check.
            </Text>
          ) : cardMeta ? (
            <Text style={[styles.hint, { color: hintColor, fontSize: fs(10) }]}>
              {[cardMeta.brand, cardMeta.cardType, cardMeta.bank].filter(Boolean).join(' · ')}
            </Text>
          ) : null}

          <View style={[styles.expiryRow, { gap: hs(16) }]}>
            <View style={{ flex: 1 }}>
              <FormInput
                label="Expiry Date"
                value={expiryMonth}
                onChangeText={(t) => setExpiryMonth(digitsOnly(t, 2))}
                placeholder="Month"
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormInput
                label={' '}
                value={expiryYear}
                onChangeText={(t) => setExpiryYear(digitsOnly(t, 4))}
                placeholder="Year"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>
          {expiryMonth.length === 2 && expiryYear.length >= 2 && !expiryOk ? (
            <Text style={[styles.hint, { color: warnColor, fontSize: fs(10) }]}>
              This card has expired or the date is invalid.
            </Text>
          ) : null}

          <PasswordInput
            label="CVV"
            value={cvv}
            onChangeText={(t) => setCvv(digitsOnly(t, 3))}
            placeholder="123"
            keyboardType="number-pad"
            maxLength={3}
          />
        </ScrollView>

        <View
          style={{
            paddingHorizontal: hs(21),
            paddingBottom: Math.max(insets.bottom, vs(16)),
          }}
        >
          <Text
            style={[
              styles.disclaimer,
              { color: disclaimerColor, fontSize: fs(10), marginBottom: vs(16) },
            ]}
          >
            We confirm the account with a name enquiry and the card with a BIN check.
            PayGenius does not store your full card number, CVV, or PIN.
          </Text>
          <PrimaryButton
            title={addCard.isPending ? 'Saving...' : 'Save'}
            onPress={handleSave}
            disabled={!canSave || addCard.isPending}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  expiryRow: { flexDirection: 'row', alignItems: 'flex-end' },
  eyeBtn: { paddingHorizontal: 12, justifyContent: 'center', height: '100%' },
  disclaimer: {
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 16,
  },
  hint: {
    fontWeight: '400',
    marginTop: -4,
    marginBottom: 4,
  },
});
