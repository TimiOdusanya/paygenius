import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import GoalIcon from '../../assets/images/save/goal-icon.svg';
import ShareIcon from '../../assets/images/save/share.svg';

export type GoalCardAccent = 'navy' | 'green';

type GoalCardProps = {
  name: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  accent?: GoalCardAccent;
  onPress?: () => void;
  onShare?: () => void;
};

function formatNaira(amount: number) {
  return `₦ ${Math.round(amount).toLocaleString('en-NG')}`;
}

export function GoalCard({
  name,
  currentAmount,
  targetAmount,
  progress,
  accent = 'navy',
  onPress,
  onShare,
}: GoalCardProps) {
  const { isDark } = useTheme();
  const { fs, ms } = useResponsive();
  const color = accent === 'green' ? '#064A34' : '#3A3A8A';
  const titleColor = isDark ? '#FFFFFF' : '#000000';
  const muted = isDark ? '#AAAAAA' : '#858585';
  const pct = isDark ? '#AAAAAA' : '#7A7A7A';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          width: ms(170),
          height: ms(130),
          borderRadius: ms(10),
          borderColor: color,
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <GoalIcon width={ms(27)} height={ms(27)} />
          <Text
            style={{ color: titleColor, fontSize: fs(14), flex: 1 }}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
        <Pressable onPress={onShare} hitSlop={8}>
          <ShareIcon width={ms(14)} height={ms(14)} />
        </Pressable>
      </View>
      <Text style={{ color: muted, fontSize: fs(10), marginTop: 4 }}>
        {formatNaira(currentAmount)}/ {formatNaira(targetAmount)}
      </Text>
      <View style={[styles.track, { backgroundColor: '#D9D9D9', marginTop: 'auto' }]}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={{ color: pct, fontSize: fs(8), textAlign: 'center', marginTop: 4 }}>
        {progress}%
      </Text>
    </Pressable>
  );
}

export function AddGoalCard({ onPress }: { onPress: () => void }) {
  const { isDark } = useTheme();
  const { ms } = useResponsive();
  const border = isDark ? '#8B8BFF' : '#03055B';
  const plus = isDark ? '#FFFFFF' : '#03055B';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        styles.addCard,
        {
          width: ms(168),
          height: ms(130),
          borderRadius: ms(10),
          borderColor: border,
          backgroundColor: isDark ? 'rgba(217,217,217,0.08)' : 'rgba(217,217,217,0.2)',
        },
      ]}
    >
      <Text style={{ color: plus, fontSize: ms(28), fontWeight: '300', lineHeight: ms(30) }}>
        +
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  addCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: 8,
  },
  track: {
    height: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 16,
  },
  fill: {
    height: 8,
    borderRadius: 20,
  },
});
