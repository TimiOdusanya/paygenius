import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';

export type HeaderTitleAlign = 'left' | 'center';
export type HeaderDescriptionAlign = 'left' | 'center';

type HeaderProps = {
  /** Shows back button when provided */
  onBack?: () => void;
  /** Convenience Skip action (right side). Ignored if `rightElement` is set. */
  onSkip?: () => void;
  skipLabel?: string;
  /** Custom right-side content (overrides Skip) */
  rightElement?: React.ReactNode;
  title?: string;
  description?: string;
  titleAlign?: HeaderTitleAlign;
  descriptionAlign?: HeaderDescriptionAlign;
  /**
   * `auth` — KYC / login form header (16px title, 12px subtitle, navy).
   * `bar` — top controls only (onboarding marketing slides).
   */
  variant?: 'auth' | 'bar';
  style?: ViewStyle;
};

export function Header({
  onBack,
  onSkip,
  skipLabel = 'Skip',
  rightElement,
  title,
  description,
  titleAlign = 'center',
  descriptionAlign = 'center',
  variant = 'auth',
  style,
}: HeaderProps) {
  const { isDark } = useTheme();
  const { fs, vs } = useResponsive();

  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const descriptionColor = isDark ? '#CCCCCC' : '#858585';
  const skipColor = isDark ? '#FFFFFF' : '#191970';

  const resolvedRight =
    rightElement != null ? (
      <View style={styles.rightSlot}>{rightElement}</View>
    ) : onSkip ? (
      <Pressable onPress={onSkip} hitSlop={12} style={styles.rightSlot}>
        <Text style={[styles.skipText, { color: skipColor, fontSize: fs(12) }]}>
          {skipLabel}
        </Text>
      </Pressable>
    ) : (
      <View style={styles.sidePlaceholder} />
    );

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.topRow}>
        {onBack ? (
          <BackButton onPress={onBack} />
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
        <View style={styles.spacer} />
        {resolvedRight}
      </View>

      {variant === 'auth' && title ? (
        <View style={[styles.titleBlock, { marginTop: vs(16) }]}>
          <Text
            style={[
              styles.title,
              {
                color: titleColor,
                fontSize: fs(16),
                letterSpacing: -0.32,
                lineHeight: fs(20),
                textAlign: titleAlign,
              },
            ]}
          >
            {title}
          </Text>
          {description ? (
            <Text
              style={[
                styles.description,
                {
                  color: descriptionColor,
                  fontSize: fs(12),
                  marginTop: vs(4),
                  textAlign: descriptionAlign,
                },
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sidePlaceholder: {
    width: 22,
    height: 22,
  },
  spacer: {
    flex: 1,
  },
  rightSlot: {
    minWidth: 22,
    minHeight: 22,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipText: {
    fontWeight: '500',
  },
  titleBlock: {
    width: '100%',
  },
  title: {
    fontWeight: '600',
  },
  description: {
    fontWeight: '400',
  },
});
