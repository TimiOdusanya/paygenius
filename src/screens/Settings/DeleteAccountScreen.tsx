import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { PasswordInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useDeleteAccountMutation } from '@/services/settings/settings.query';
import { useAuthStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/errors';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DeleteAccount'>;

export function DeleteAccountScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const mutation = useDeleteAccountMutation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState(false);
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  const remove = () => {
    Alert.alert(
      'Delete account?',
      'This cannot be undone. Your phone and email will be released.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            mutation.mutate(password || undefined, {
              onSuccess: () => {
                useAuthStore.getState().clearAuth();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              },
              onError: (error) => {
                Alert.alert(
                  'Could not delete account',
                  getApiErrorMessage(error, 'Confirm your password and try again.')
                );
              },
            });
          },
        },
      ]
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
        <ScreenTitleBar title="Delete account" onBack={() => navigation.goBack()} />
      </View>
      <View style={{ paddingHorizontal: hs(20), gap: vs(16) }}>
        <Text style={{ color: titleColor, fontSize: fs(14), lineHeight: fs(20) }}>
          Deleting your account removes access to your wallet, statements, and saved cards.
        </Text>
        <Text style={{ color: subColor, fontSize: fs(12), lineHeight: fs(18) }}>
          If you signed up with a password, enter it below to confirm.
        </Text>
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />
        <PrimaryButton
          title={confirm ? (mutation.isPending ? 'Deleting…' : 'Confirm delete') : 'Delete account'}
          onPress={() => {
            if (!confirm) {
              setConfirm(true);
              return;
            }
            remove();
          }}
          style={{ backgroundColor: '#E05353' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
