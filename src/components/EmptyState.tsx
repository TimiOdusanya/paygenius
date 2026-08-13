import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import {
  EmptyBudgetsArt,
  EmptyChatArt,
  EmptyHistoryArt,
  EmptySpendArt,
  EmptyTransactionsArt,
} from './empty/EmptyArt';

export type EmptyStateVariant =
  | 'transactions'
  | 'spend'
  | 'chat'
  | 'history'
  | 'budgets';

type EmptyStateProps = {
  variant: EmptyStateVariant;
  title: string;
  subtitle?: string;
  compact?: boolean;
};

const ART = {
  transactions: EmptyTransactionsArt,
  spend: EmptySpendArt,
  chat: EmptyChatArt,
  history: EmptyHistoryArt,
  budgets: EmptyBudgetsArt,
} as const;

export function EmptyState({ variant, title, subtitle, compact }: EmptyStateProps) {
  const { isDark } = useTheme();
  const { fs, ms } = useResponsive();
  const Art = ART[variant];
  const size = compact ? ms(96) : ms(148);
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Art isDark={isDark} size={size} />
      <Text
        style={{
          color: titleColor,
          fontSize: fs(compact ? 12 : 14),
          fontWeight: '600',
          letterSpacing: -0.2,
          textAlign: 'center',
          marginTop: compact ? 8 : 14,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: subColor,
            fontSize: fs(compact ? 10 : 12),
            textAlign: 'center',
            marginTop: 4,
            lineHeight: fs(compact ? 14 : 17),
            maxWidth: 240,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  compact: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});
