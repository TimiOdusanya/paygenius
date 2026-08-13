import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '@/services/settings/settings.query';
import { getApiErrorMessage } from '@/utils/errors';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionLimits'>;

export function TransactionLimitsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const { data } = useGetSettingsQuery();
  const update = useUpdateSettingsMutation();
  const settings = data?.data?.settings;
  const [spend, setSpend] = useState('');
  const [transfer, setTransfer] = useState('');
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  useEffect(() => {
    if (!settings) return;
    setSpend(String(settings.dailySpendLimit));
    setTransfer(String(settings.dailyTransferLimit));
  }, [settings]);

  const save = () => {
    update.mutate(
      {
        dailySpendLimit: Number(spend),
        dailyTransferLimit: Number(transfer),
      },
      {
        onSuccess: () => {
          Alert.alert('Limits updated', 'New daily limits are active immediately.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error) => {
          Alert.alert('Could not save limits', getApiErrorMessage(error, 'Try again.'));
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
          marginBottom: vs(24),
        }}
      >
        <ScreenTitleBar title="Transaction Limits" onBack={() => navigation.goBack()} />
      </View>
      <View style={{ paddingHorizontal: hs(20), gap: vs(16) }}>
        <Text style={{ color: subColor, fontSize: fs(12), lineHeight: fs(18) }}>
          Caps how much can leave your wallet each day. Lower limits help if a device is lost.
        </Text>
        <FormInput
          label="Daily spend limit (₦)"
          value={spend}
          onChangeText={setSpend}
          keyboardType="numeric"
        />
        <FormInput
          label="Daily transfer limit (₦)"
          value={transfer}
          onChangeText={setTransfer}
          keyboardType="numeric"
        />
        <PrimaryButton
          title={update.isPending ? 'Saving…' : 'Save limits'}
          disabled={update.isPending || !spend || !transfer}
          onPress={save}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
