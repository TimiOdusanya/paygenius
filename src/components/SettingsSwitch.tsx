import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
};

/** Figma Material-style 40×40 toggle: grey off, midnight navy on. */
export function SettingsSwitch({ value, onValueChange, disabled }: Props) {
  const { isDark } = useTheme();
  const { ms } = useResponsive();
  const size = ms(40);
  const trackW = ms(36.6);
  const trackH = ms(20);
  const thumb = ms(17.6);
  const pad = (trackH - thumb) / 2;

  const trackOn = isDark ? '#7C3AED' : '#191970';
  const trackOff = isDark ? '#4A4A4A' : '#E0E0E0';

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={() => onValueChange(!value)}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={[
          styles.track,
          {
            width: trackW,
            height: trackH,
            borderRadius: trackH / 2,
            backgroundColor: value ? trackOn : trackOff,
          },
        ]}
      >
        <View
          style={{
            width: thumb,
            height: thumb,
            borderRadius: thumb / 2,
            backgroundColor: '#FFFFFF',
            marginLeft: value ? trackW - thumb - pad : pad,
          }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
});
