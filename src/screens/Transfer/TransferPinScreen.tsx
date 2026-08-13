import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { OTPInput } from '@/components/OTPInput';
import { useSendTransferMutation } from '@/services/transfer/transfer.query';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import { getApiErrorMessage } from '@/utils/errors';
import { availableForTransfer, formatNaira } from './transfer.helpers';
import FingerprintIcon from '../../../assets/images/bills/icon-fingerprint.svg';
import FaceIdIcon from '../../../assets/images/bills/icon-faceid.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferPin'>;

export function TransferPinScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const sendTransfer = useSendTransferMutation();
  const { data: walletData, isFetched: walletFetched } = useGetWalletQuery();
  const { data: budgetData } = useGetBudgetsQuery();
  const [pin, setPin] = React.useState('');
  const submitting = React.useRef(false);
  const walletBalance = walletData?.data?.wallet?.availableBalance ?? 0;
  const selectedBudget = (budgetData?.data?.budgets ?? []).find(
    (item) => item._id === route.params.budgetId
  );
  const available = availableForTransfer({
    walletBalance,
    paymentSource: route.params.paymentSource,
    budget: selectedBudget,
  });
  const insufficient = walletFetched && route.params.amount > available;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#6D6D8C';

  React.useEffect(() => {
    if (!walletData) return;
    if (route.params.amount > available) {
      Alert.alert(
        'Insufficient balance',
        `You need ${formatNaira(route.params.amount)} but only ${formatNaira(available)} is available.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [available, navigation, route.params.amount, walletData]);

  const submit = React.useCallback(
    (payload: { pin?: string; useBiometric?: boolean }) => {
      if (insufficient) {
        Alert.alert(
          'Insufficient balance',
          `You need ${formatNaira(route.params.amount)} but only ${formatNaira(available)} is available.`
        );
        return;
      }
      if (submitting.current || sendTransfer.isPending) return;
      submitting.current = true;
      sendTransfer.mutate(
        { ...route.params, ...payload },
        {
          onSuccess: (res) => {
            const transfer = res.data?.transfer;
            if (transfer) {
              navigation.replace('TransferSuccess', { transfer });
            }
          },
          onError: (err) => {
            submitting.current = false;
            setPin('');
            Alert.alert('Transfer failed', getApiErrorMessage(err, 'Could not complete transfer.'));
          },
        }
      );
    },
    [available, insufficient, navigation, sendTransfer, route.params]
  );

  React.useEffect(() => {
    if (pin.length === 4) submit({ pin });
  }, [pin, submit]);

  const authenticateBiometric = async (prompt: string) => {
    try {
      const hasHw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHw || !enrolled) {
        Alert.alert('Biometrics', 'Biometrics are not available on this device.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: prompt,
        fallbackLabel: 'Use PIN',
      });
      if (result.success) submit({ useBiometric: true });
    } catch {
      Alert.alert('Biometrics', 'Could not authenticate. Use your PIN instead.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
        <ScreenTitleBar title="" onBack={() => navigation.goBack()} />
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(2) }}>
        <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
          Enter your PIN
        </Text>
        <Text style={[styles.sub, { color: subColor, fontSize: fs(12), marginTop: vs(2) }]}>
          Enter your transactional pin
        </Text>
      </View>

      <View style={{ marginTop: vs(36), paddingHorizontal: hs(44) }}>
        <OTPInput value={pin} onChange={insufficient ? () => undefined : setPin} length={4} />
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(71) }}>
        <Text style={[styles.bioLabel, { fontSize: fs(12), color: titleColor }]}>
          Use Biometrics
        </Text>
        <Pressable
          disabled={insufficient}
          onPress={() => authenticateBiometric('Confirm this transfer')}
          style={[
            styles.finger,
            { width: ms(109), height: ms(109), borderRadius: ms(55), marginTop: vs(9) },
          ]}
        >
          <FingerprintIcon width={ms(109)} height={ms(109)} />
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(54) }}>
        <Text style={{ fontSize: fs(12) }}>
          <Text style={{ color: subColor }}>Or </Text>
          <Text style={{ color: titleColor }}>Face ID</Text>
        </Text>
        <Pressable
          disabled={insufficient}
          onPress={() => authenticateBiometric('Confirm with Face ID')}
          style={{ marginTop: vs(11) }}
        >
          <FaceIdIcon width={ms(31)} height={ms(31)} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '600' },
  sub: { fontWeight: '400' },
  bioLabel: { fontWeight: '400' },
  finger: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
