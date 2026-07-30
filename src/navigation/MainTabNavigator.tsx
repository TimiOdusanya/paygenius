import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@/screens/Home';
import { WalletScreen } from '@/screens/Wallet';
import { AnalyticsScreen, SettingsScreen } from '@/screens/Main';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export type MainTabParamList = {
  HomeTab: undefined;
  WalletTab: undefined;
  AITab: undefined;
  AnalyticsTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function AIButton({ onPress }: { onPress: () => void }) {
  const { ms } = useResponsive();

  return (
    <Pressable onPress={onPress} style={styles.aiBtnContainer}>
      <View
        style={[
          styles.aiBtn,
          {
            width: ms(58),
            height: ms(58),
            borderRadius: ms(29),
            backgroundColor: '#191970',
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        <Ionicons name="sparkles" size={ms(24)} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home-outline',
  WalletTab: 'wallet-outline',
  AnalyticsTab: 'bar-chart-outline',
  SettingsTab: 'settings-outline',
};

const TAB_ICONS_ACTIVE: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  WalletTab: 'wallet',
  AnalyticsTab: 'bar-chart',
  SettingsTab: 'settings',
};

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  const { ms } = useResponsive();
  const icon = focused
    ? (TAB_ICONS_ACTIVE[name] ?? TAB_ICONS[name] ?? 'ellipse')
    : (TAB_ICONS[name] ?? 'ellipse-outline');
  const color = focused ? '#191970' : 'rgba(133,133,133,0.7)';
  return <Ionicons name={icon} size={ms(22)} color={color} />;
}

export function MainTabNavigator() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { ms, fs } = useResponsive();

  const tabBarBg = isDark ? '#1A1A2F' : '#FFFFFF';
  const activeTint = '#191970';
  const inactiveTint = 'rgba(133,133,133,0.7)';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: 0,
          elevation: 0,
          height: 83 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarLabelStyle: {
          fontSize: fs(10),
          fontWeight: '400',
          letterSpacing: 0.4,
          marginTop: 4,
        },
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletScreen}
        options={{ tabBarLabel: 'Wallet' }}
      />
      <Tab.Screen
        name="AITab"
        component={WalletScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: ({ onPress }) => (
            <AIButton onPress={onPress as () => void} />
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsScreen}
        options={{ tabBarLabel: 'Analytics' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  aiBtnContainer: {
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
