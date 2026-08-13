import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { PasswordInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useChangePasswordMutation } from '@/services/settings/settings.query';
import { getApiErrorMessage } from '@/utils/errors';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export function ChangePasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs } = useResponsive();
  const mutation = useChangePasswordMutation();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const canSave =
    currentPassword.length >= 8 &&
    newPassword.length >= 8 &&
    newPassword === confirm &&
    !mutation.isPending;

  const submit = () => {
    if (newPassword !== confirm) {
      Alert.alert('Passwords do not match');
      return;
    }
    mutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          Alert.alert('Password updated', 'Use your new password the next time you sign in.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error) => {
          Alert.alert('Could not update password', getApiErrorMessage(error, 'Try again.'));
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(20),
          marginBottom: vs(28),
        }}
      >
        <ScreenTitleBar title="Change Password" onBack={() => navigation.goBack()} />
      </View>
      <View style={{ paddingHorizontal: hs(20), gap: vs(16), flex: 1 }}>
        <PasswordInput
          label="Current password"
          value={currentPassword}
          onChangeText={setCurrent}
        />
        <PasswordInput
          label="New password"
          value={newPassword}
          onChangeText={setNext}
        />
        <PasswordInput
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
        />
        <PrimaryButton
          title={mutation.isPending ? 'Saving…' : 'Save password'}
          disabled={!canSave}
          onPress={submit}
          style={{ marginTop: vs(12) }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
