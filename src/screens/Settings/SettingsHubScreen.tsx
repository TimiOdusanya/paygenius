import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { SettingsRow } from '@/components/SettingsRow';
import { SettingsSection } from '@/components/SettingsSection';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import ProfileIcon from '../../../assets/images/settings/icon-profile.svg';
import SecurityIcon from '../../../assets/images/settings/icon-security.svg';
import BellIcon from '../../../assets/images/settings/icon-notifications.svg';
import StatementIcon from '../../../assets/images/settings/icon-statement.svg';
import CardsIcon from '../../../assets/images/settings/icon-cards.svg';
import LimitsIcon from '../../../assets/images/settings/icon-limits.svg';
import ReferralsIcon from '../../../assets/images/settings/icon-referrals.svg';
import ThemeIcon from '../../../assets/images/settings/icon-theme.svg';
import SupportIcon from '../../../assets/images/settings/icon-support.svg';
import RateIcon from '../../../assets/images/settings/icon-rate.svg';
import AboutIcon from '../../../assets/images/settings/icon-about.svg';
import DeleteIcon from '../../../assets/images/settings/icon-delete.svg';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useDeactivateAccountMutation } from '@/services/settings/settings.query';
import { useAuthStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/errors';

type Props = BottomTabScreenProps<MainTabParamList, 'SettingsTab'> & {
  navigation: CompositeNavigationProp<
    BottomTabScreenProps<MainTabParamList, 'SettingsTab'>['navigation'],
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export function SettingsHubScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark, setMode } = useTheme();
  const { hs, vs, ms } = useResponsive();
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deactivateOpen, setDeactivateOpen] = React.useState(false);
  const deactivate = useDeactivateAccountMutation();

  const go = (route: keyof RootStackParamList) => {
    navigation.navigate(route as never);
  };

  const confirmDeactivate = () => {
    deactivate.mutate(undefined, {
      onSuccess: () => {
        setDeactivateOpen(false);
        useAuthStore.getState().clearAuth();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      },
      onError: (error) => {
        Alert.alert(
          'Could not deactivate account',
          getApiErrorMessage(error, 'Please try again.')
        );
      },
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(20),
          marginBottom: vs(20),
        }}
      >
        <ScreenTitleBar
          title="My Settings"
          onBack={() => navigation.navigate('HomeTab')}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(20),
          paddingBottom: insets.bottom + vs(120),
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Account">
          <SettingsRow
            icon={<ProfileIcon width={ms(16)} height={ms(16)} />}
            title="Profile"
            subtitle="Manage your Personal Information"
            onPress={() => go('Profile')}
          />
          <SettingsRow
            icon={<SecurityIcon width={ms(14)} height={ms(17)} />}
            title="Security Center"
            subtitle="Password, PIN, and security settings"
            onPress={() => go('SecurityCenter')}
          />
          <SettingsRow
            icon={<BellIcon width={ms(15)} height={ms(18)} />}
            title="Notifications"
            subtitle="Manage Notification Preferences"
            onPress={() => go('NotificationPreferences')}
          />
        </SettingsSection>

        <SettingsSection title="Payment and Banking">
          <SettingsRow
            icon={<StatementIcon width={ms(13)} height={ms(16)} />}
            title="Statement and Expense log"
            subtitle="Manage your Statement"
            onPress={() => go('StatementLog')}
          />
          <SettingsRow
            icon={<CardsIcon width={ms(14)} height={ms(10)} />}
            title="Cards"
            subtitle="Get your Virtual and Physical Card"
            onPress={() => go('AddDebitCard')}
          />
          <SettingsRow
            icon={<LimitsIcon width={ms(14)} height={ms(14)} />}
            title="Transaction Limits"
            subtitle="Set Spending and transfer limits"
            onPress={() => go('TransactionLimits')}
          />
          <SettingsRow
            icon={<ReferralsIcon width={ms(15)} height={ms(15)} />}
            title="Referals"
            subtitle="Invite friends and earn up to ₦ 5000"
            onPress={() => go('Referrals')}
          />
        </SettingsSection>

        <SettingsSection title="App Preference">
          <SettingsRow
            icon={<ThemeIcon width={ms(15)} height={ms(15)} />}
            title="Theme"
            subtitle="Light or Dark Mode"
            switchValue={isDark}
            switchLabel={isDark ? 'Dark Mode' : 'Light Mode'}
            onSwitchChange={(next) => setMode(next ? 'dark' : 'light')}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsRow
            icon={<SupportIcon width={ms(12)} height={ms(12)} />}
            title="Customer Service Center"
            subtitle="FAQs ans support articles"
            onPress={() => go('CustomerService')}
          />
          <SettingsRow
            icon={<RateIcon width={ms(12)} height={ms(12)} />}
            title="Rate us"
            subtitle="Tell us how we are doing"
            onPress={() => go('RateUs')}
          />
          <SettingsRow
            icon={<AboutIcon width={ms(13)} height={ms(13)} />}
            title="About us"
            subtitle="App Version and Legal Informations"
            onPress={() => go('AboutUs')}
          />
          <SettingsRow
            icon={<Ionicons name="pause-circle-outline" size={ms(16)} color={isDark ? '#C8C8C8' : '#858585'} />}
            title="Deactivate account"
            subtitle="Temporarily turn off your account"
            onPress={() => setDeactivateOpen(true)}
          />
          <SettingsRow
            icon={<DeleteIcon width={ms(14)} height={ms(16)} />}
            title="Delete account"
            subtitle="Delete your account"
            destructive
            onPress={() => setDeleteOpen(true)}
          />
        </SettingsSection>
      </ScrollView>

      <ConfirmModal
        visible={deactivateOpen}
        title="Deactivate account?"
        message="Your account will be turned off and you will be signed out. Contact support if you want it restored later."
        confirmLabel="Deactivate"
        loading={deactivate.isPending}
        onCancel={() => setDeactivateOpen(false)}
        onConfirm={confirmDeactivate}
      />
      <ConfirmModal
        visible={deleteOpen}
        title="Delete account?"
        message="This permanently removes access to your wallet, statements, and saved cards. Are you sure you want to continue?"
        confirmLabel="Continue"
        destructive
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          go('DeleteAccount');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
