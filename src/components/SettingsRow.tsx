import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { SettingsSwitch } from './SettingsSwitch';
import { SettingsCheckbox } from './SettingsCheckbox';

type Props = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (next: boolean) => void;
  checkboxValue?: boolean;
  onCheckboxChange?: (next: boolean) => void;
  switchLabel?: string;
};

export function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  destructive,
  switchValue,
  onSwitchChange,
  checkboxValue,
  onCheckboxChange,
  switchLabel,
}: Props) {
  const { isDark } = useTheme();
  const { hs, fs, ms } = useResponsive();
  const border = isDark ? '#4A4A4A' : '#858585';
  const cardBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const titleColor = destructive
    ? '#E05353'
    : isDark
      ? '#C8C8C8'
      : '#858585';
  const subColor = isDark ? '#8A8A8A' : '#C4C4C4';
  const hasToggle = typeof switchValue === 'boolean' && !!onSwitchChange;
  const hasCheck = typeof checkboxValue === 'boolean' && !!onCheckboxChange;
  const wraps = Boolean(subtitle && subtitle.length > 42);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          minHeight: ms(58),
          height: wraps ? undefined : ms(58),
          backgroundColor: cardBg,
          borderColor: border,
          borderRadius: ms(8),
          paddingLeft: hs(16),
          paddingRight: hasToggle || hasCheck ? hs(8) : hs(16),
          paddingVertical: wraps ? 8 : 0,
          opacity: pressed && onPress ? 0.85 : 1,
        },
      ]}
    >
      {icon ? <View style={[styles.icon, { marginRight: hs(8) }]}>{icon}</View> : null}
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: titleColor, fontSize: fs(14) }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={wraps ? 2 : 1}
            style={[styles.subtitle, { color: subColor, fontSize: fs(8), marginTop: 1 }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {hasToggle ? (
        <View style={styles.trail}>
          {switchLabel ? (
            <Text style={[styles.switchLabel, { color: subColor, fontSize: fs(8) }]}>
              {switchLabel}
            </Text>
          ) : null}
          <SettingsSwitch value={switchValue} onValueChange={onSwitchChange} />
        </View>
      ) : null}
      {hasCheck ? (
        <SettingsCheckbox value={checkboxValue} onValueChange={onCheckboxChange} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '400',
  },
  subtitle: {
    fontWeight: '400',
  },
  trail: {
    alignItems: 'flex-end',
  },
  switchLabel: {
    fontWeight: '400',
    marginBottom: -4,
    marginRight: 4,
  },
});
