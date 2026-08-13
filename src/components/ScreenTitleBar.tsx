import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  style?: ViewStyle;
  right?: React.ReactNode;
};

/** Same-row back + centered title used on Pay Bills, PIN, settings, and receipt. */
export function ScreenTitleBar({ title, subtitle, onBack, style, right }: Props) {
  const { isDark } = useTheme();
  const { fs } = useResponsive();
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  return (
    <View style={[styles.row, subtitle ? styles.rowTall : null, style]}>
      <BackButton onPress={onBack} />
      <View pointerEvents="none" style={styles.titleWrap}>
        <Text
          style={[
            styles.title,
            { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20) },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subColor, fontSize: fs(12) }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.spacer}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTall: {
    minHeight: 29,
    alignItems: 'flex-start',
  },
  titleWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '400',
  },
  spacer: {
    minWidth: 22,
    minHeight: 22,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
