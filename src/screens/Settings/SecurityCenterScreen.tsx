import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { SettingsRow } from '@/components/SettingsRow';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/services/settings/settings.query';
import FaceIdIcon from '../../../assets/images/settings/icon-faceid.svg';
import PinIcon from '../../../assets/images/settings/icon-pin.svg';
import BioIcon from '../../../assets/images/settings/icon-biometrics.svg';
import PasswordIcon from '../../../assets/images/settings/icon-password.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SecurityCenter'>;

export function SecurityCenterScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, ms } = useResponsive();
  const { data } = useGetSettingsQuery();
  const update = useUpdateSettingsMutation();
  const settings = data?.data?.settings;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';

  const toggleFaceId = async (next: boolean) => {
    if (next) {
      navigation.navigate('FaceIdSetup');
      return;
    }
    update.mutate({ faceIdEnabled: false });
  };

  const openBiometrics = async () => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert(
          'Biometrics unavailable',
          'Add a fingerprint or Face ID in your device settings first.'
        );
        return;
      }
    } catch {}
    navigation.navigate('FaceIdSetup');
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
        <ScreenTitleBar title="Security Center" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(20),
          paddingBottom: insets.bottom + vs(32),
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsRow
          icon={
            <View style={[styles.iconTile, { width: ms(22), height: ms(22), borderRadius: ms(4) }]}>
              <FaceIdIcon width={ms(18)} height={ms(18)} />
            </View>
          }
          title="Face ID"
          subtitle="Activate your Face Identity"
          switchValue={settings?.faceIdEnabled ?? false}
          onSwitchChange={toggleFaceId}
        />
        <SettingsRow
          icon={
            <View style={[styles.iconTile, { width: ms(22), height: ms(22), borderRadius: ms(4) }]}>
              <PinIcon width={ms(16)} height={ms(16)} />
            </View>
          }
          title="Transaction Pin"
          subtitle="Check your Transaction Pin"
          onPress={() => navigation.navigate('ChangePin')}
        />
        <SettingsRow
          icon={
            <View style={[styles.iconTile, { width: ms(22), height: ms(22), borderRadius: ms(4) }]}>
              <BioIcon width={ms(16)} height={ms(16)} />
            </View>
          }
          title="Biometrics"
          subtitle="Manage your Finger Print"
          onPress={openBiometrics}
        />
        <SettingsRow
          icon={
            <View style={[styles.iconTile, { width: ms(22), height: ms(22), borderRadius: ms(4) }]}>
              <PasswordIcon width={ms(14)} height={ms(10)} />
            </View>
          }
          title="Change Password"
          subtitle="Change your Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  iconTile: {
    backgroundColor: '#F2EBFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
