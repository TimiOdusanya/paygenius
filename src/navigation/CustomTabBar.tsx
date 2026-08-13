import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import HomeIcon from '../../assets/images/tabbar/home.svg';
import WalletIcon from '../../assets/images/tabbar/wallet.svg';
import ChartIcon from '../../assets/images/tabbar/chart.svg';
import SettingsIcon from '../../assets/images/tabbar/settings.svg';

const FAB = require('../../assets/images/tabbar/fab.png');

/** Figma bar is 83px including the 34px home indicator. Content sits in the top ~50px. */
const TAB_CONTENT_H = 50;
const NOTCH_PATH =
  'M402 79C402 81.2091 400.209 83 398 83H3.99999C1.79085 83 0 81.2091 0 79V4C0 1.79086 1.79086 0 4 0H163.396C166.192 0 168.138 2.81383 167.61 5.55994C167.21 7.64512 167 9.79801 167 12C167 30.7777 182.222 46 201 46C219.778 46 235 30.7777 235 12C235 9.79801 234.79 7.64512 234.39 5.55994C233.862 2.81383 235.808 0 238.604 0H398C400.209 0 402 1.79086 402 4V79Z';

const ICONS: Record<
  string,
  React.ComponentType<{ width: number; height: number; color: string }>
> = {
  HomeTab: HomeIcon,
  WalletTab: WalletIcon,
  AnalyticsTab: ChartIcon,
  SettingsTab: SettingsIcon,
};

const LABELS: Record<string, string> = {
  HomeTab: 'Home',
  WalletTab: 'Wallet',
  AnalyticsTab: 'Analytics',
  SettingsTab: 'Settings',
};

function TabItem({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const { ms, fs } = useResponsive();
  const Icon = ICONS[routeName];
  if (!Icon) return null;
  const color = focused ? '#191970' : 'rgba(133,133,133,0.7)';

  return (
    <Pressable onPress={onPress} style={styles.tabItem} hitSlop={8}>
      <Icon width={ms(24)} height={ms(24)} color={color} />
      <Text
        style={[
          styles.tabLabel,
          {
            color,
            fontSize: fs(10),
            fontWeight: focused ? '500' : '400',
          },
        ]}
      >
        {LABELS[routeName]}
      </Text>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();
  const { ms } = useResponsive();

  const barFill = isDark ? '#1A1A2F' : '#FFFFFF';
  const fabSize = ms(58);
  const safeBottom = insets.bottom > 0 ? insets.bottom : 8;

  const onTabPress = (routeName: string, routeKey: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const leftTabs = state.routes.filter(
    (r) => r.name === 'HomeTab' || r.name === 'WalletTab'
  );
  const rightTabs = state.routes.filter(
    (r) => r.name === 'AnalyticsTab' || r.name === 'SettingsTab'
  );
  const aiRoute = state.routes.find((r) => r.name === 'AITab');

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <View style={{ height: TAB_CONTENT_H, width, overflow: 'visible' }}>
        <Svg
          width={width}
          height={TAB_CONTENT_H}
          viewBox="0 0 402 50"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}
        >
          <Path d={NOTCH_PATH} fill={barFill} />
        </Svg>

        <View style={styles.tabsRow}>
          <View style={styles.sideGroup}>
            {leftTabs.map((route) => (
              <TabItem
                key={route.key}
                routeName={route.name}
                focused={state.index === state.routes.indexOf(route)}
                onPress={() =>
                  onTabPress(
                    route.name,
                    route.key,
                    state.index === state.routes.indexOf(route)
                  )
                }
              />
            ))}
          </View>
          <View style={styles.fabSlot} />
          <View style={styles.sideGroup}>
            {rightTabs.map((route) => (
              <TabItem
                key={route.key}
                routeName={route.name}
                focused={state.index === state.routes.indexOf(route)}
                onPress={() =>
                  onTabPress(
                    route.name,
                    route.key,
                    state.index === state.routes.indexOf(route)
                  )
                }
              />
            ))}
          </View>
        </View>

        {aiRoute ? (
          <Pressable
            onPress={() =>
              onTabPress(
                aiRoute.name,
                aiRoute.key,
                state.index === state.routes.indexOf(aiRoute)
              )
            }
            style={[
              styles.fab,
              {
                width: fabSize,
                height: fabSize,
                marginLeft: -fabSize / 2,
              },
            ]}
          >
            <Image
              source={FAB}
              style={{ width: fabSize, height: fabSize }}
              resizeMode="contain"
            />
          </Pressable>
        ) : null}
      </View>
      <View style={{ height: safeBottom, backgroundColor: barFill }} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    height: TAB_CONTENT_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  sideGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 33,
  },
  tabItem: {
    alignItems: 'center',
    minWidth: 44,
  },
  tabLabel: {
    marginTop: 2,
    letterSpacing: 0.4,
  },
  fabSlot: {
    width: 72,
  },
  fab: {
    position: 'absolute',
    left: '50%',
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
