import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { OTPInput } from '@/components/OTPInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useChangePinMutation, useGetSettingsQuery } from '@/services/settings/settings.query';
import { getApiErrorMessage } from '@/utils/errors';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePin'>;

export function ChangePinScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const mutation = useChangePinMutation();
  const { data } = useGetSettingsQuery();
  const hasPin = data?.data?.settings?.setTransactionPin ?? true;
  const [step, setStep] = useState<'current' | 'next'>('current');

  useEffect(() => {
    if (data?.data?.settings && !data.data.settings.setTransactionPin) {
      setStep('next');
    }
  }, [data]);
  const [currentPin, setCurrent] = useState('');
  const [newPin, setNext] = useState('');
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  const submit = () => {
    mutation.mutate(
      { currentPin: hasPin ? currentPin : '', newPin },
      {
        onSuccess: () => {
          Alert.alert(
            hasPin ? 'PIN updated' : 'PIN created',
            hasPin
              ? 'Your transaction PIN has been changed.'
              : 'Your transaction PIN is ready for payments.',
            [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error) => {
          Alert.alert('Could not update PIN', getApiErrorMessage(error, 'Check your current PIN.'));
          setStep(hasPin ? 'current' : 'next');
          setCurrent('');
          setNext('');
        },
      }
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(20),
          marginBottom: vs(32),
        }}
      >
        <ScreenTitleBar title="Transaction Pin" onBack={() => navigation.goBack()} />
      </View>
      <View style={{ paddingHorizontal: hs(20), alignItems: 'center' }}>
        <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600' }}>
          {step === 'current' ? 'Enter current PIN' : hasPin ? 'Choose a new PIN' : 'Create a PIN'}
        </Text>
        <Text style={{ color: subColor, fontSize: fs(12), marginTop: vs(8), textAlign: 'center' }}>
          {step === 'current'
            ? 'Confirm the 4-digit PIN you use for payments.'
            : 'This PIN authorizes bill payments and transfers.'}
        </Text>
        <View style={{ marginTop: vs(28) }}>
          {step === 'current' ? (
            <OTPInput
              value={currentPin}
              onChange={(value) => {
                setCurrent(value);
                if (value.length === 4) setStep('next');
              }}
            />
          ) : (
            <OTPInput
              value={newPin}
              onChange={setNext}
            />
          )}
        </View>
        {step === 'next' ? (
          <PrimaryButton
            title={mutation.isPending ? 'Saving…' : 'Save new PIN'}
            disabled={newPin.length !== 4 || mutation.isPending}
            onPress={submit}
            style={{ marginTop: vs(32), width: '100%' }}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
