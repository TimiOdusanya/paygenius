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
import { usePayBillMutation } from '@/services/bills/bills.query';
import { getApiErrorMessage } from '@/utils/errors';
import FingerprintIcon from '../../../assets/images/bills/icon-fingerprint.svg';
import FaceIdIcon from '../../../assets/images/bills/icon-faceid.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'BillPin'>;

export function BillPinScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const payBill = usePayBillMutation();
  const [pin, setPin] = React.useState('');
  const submitting = React.useRef(false);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#6D6D8C';

  const submit = React.useCallback(
    (payload: { pin?: string; useBiometric?: boolean }) => {
      if (submitting.current || payBill.isPending) return;
      submitting.current = true;
      payBill.mutate(
        { ...route.params, ...payload },
        {
          onSuccess: (res) => {
            const payment = res.data?.payment;
            if (payment) {
              navigation.replace('BillReceipt', { payment });
            }
          },
          onError: (err) => {
            submitting.current = false;
            setPin('');
            Alert.alert('Payment failed', getApiErrorMessage(err, 'Could not complete payment.'));
          },
        }
      );
    },
    [navigation, payBill, route.params]
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
        <OTPInput value={pin} onChange={setPin} length={4} />
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(71) }}>
        <Text style={[styles.bioLabel, { fontSize: fs(12), color: titleColor }]}>
          Use Biometrics
        </Text>
        <Pressable
          onPress={() => authenticateBiometric('Confirm this payment')}
          style={[
            styles.finger,
            {
              width: ms(109),
              height: ms(109),
              borderRadius: ms(55),
              marginTop: vs(9),
            },
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
  title: {
    fontWeight: '600',
  },
  sub: {
    fontWeight: '400',
  },
  bioLabel: {
    fontWeight: '400',
  },
  finger: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
