import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/screens/Home';
import { WalletScreen } from '@/screens/Wallet';
import { AIScreen, AnalyticsScreen, SettingsScreen } from '@/screens/Main';
import { usePreferencesStore } from '@/stores/preferences.store';
import { CustomTabBar } from './CustomTabBar';

export type MainTabParamList = {
  HomeTab: undefined;
  WalletTab: undefined;
  AITab: undefined;
  AnalyticsTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  useEffect(() => {
    usePreferencesStore.getState().markOnboardingFinished();
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        safeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          height: undefined,
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="WalletTab" component={WalletScreen} />
      <Tab.Screen name="AITab" component={AIScreen} />
      <Tab.Screen name="AnalyticsTab" component={AnalyticsScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
