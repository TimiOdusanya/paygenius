import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { SettingsRow } from '@/components/SettingsRow';
import { SettingsSection } from '@/components/SettingsSection';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from '@/services/notifications/notifications.query';
import type { PreferenceUpdates } from '@/services/notifications/notifications.type';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationPreferences'>;

export function NotificationPreferencesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs } = useResponsive();
  const { data, isLoading } = useGetNotificationPreferencesQuery();
  const update = useUpdateNotificationPreferencesMutation();
  const prefs = data?.data?.preferences;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';

  const patch = (next: PreferenceUpdates) => {
    update.mutate(next);
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(20),
        }}
      >
        <ScreenTitleBar
          title="Notifications"
          subtitle="Manage Notification Preferences"
          onBack={() => navigation.goBack()}
        />
      </View>

      {isLoading && !prefs ? (
        <ActivityIndicator color="#191970" style={{ marginTop: vs(40) }} />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: hs(21),
            paddingBottom: insets.bottom + vs(32),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SettingsSection title="Categories">
            <SettingsRow
              title="Transaction Alerts"
              subtitle="Get instant updates for all your account transactions."
              switchValue={prefs?.transactionAlerts ?? false}
              onSwitchChange={(transactionAlerts) => patch({ transactionAlerts })}
            />
            <SettingsRow
              title="Promotions & Offers"
              subtitle="Receive discounts, cashback, and product updates."
              switchValue={prefs?.promotions ?? false}
              onSwitchChange={(promotions) => patch({ promotions })}
            />
            <SettingsRow
              title="Security Alerts"
              subtitle="Be notified of logins, password changes, or suspicious activity."
              switchValue={prefs?.securityAlerts ?? false}
              onSwitchChange={(securityAlerts) => patch({ securityAlerts })}
            />
          </SettingsSection>

          <SettingsSection title="Privacy & Security">
            <SettingsRow
              title="Hide account balance in notifications"
              checkboxValue={prefs?.hideBalance ?? false}
              onCheckboxChange={(hideBalance) => patch({ hideBalance })}
            />
            <SettingsRow
              title="Require Face ID to view transaction details"
              checkboxValue={prefs?.requireFaceId ?? false}
              onCheckboxChange={(requireFaceId) => patch({ requireFaceId })}
            />
          </SettingsSection>

          <SettingsSection title="Smart Notifications">
            <SettingsRow
              title="Finance Updates from Genie AI"
              subtitle="AI Recommendations for Finance"
              switchValue={prefs?.genieUpdates ?? false}
              onSwitchChange={(genieUpdates) => patch({ genieUpdates })}
            />
          </SettingsSection>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
