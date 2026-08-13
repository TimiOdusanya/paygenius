import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { formatNaira } from '@/utils/money';
import type { ExpenseWeek } from '@/services/home/home.type';
import IconFood from '../../../assets/images/analytics/icon-food.svg';
import IconData from '../../../assets/images/analytics/icon-data.svg';
import IconGrocery from '../../../assets/images/analytics/icon-grocery.svg';

const LEGEND = [
  { name: 'Food', color: '#7704DD' },
  { name: 'Data', color: '#00E5E5' },
  { name: 'Groceries', color: '#03055B' },
  { name: 'Logistics', color: '#1180FF' },
  { name: 'Others', color: '#B249DF' },
] as const;

const ICONS: Record<string, React.ComponentType<{ width: number; height: number }>> = {
  Food: IconFood,
  Data: IconData,
  Groceries: IconGrocery,
  Grocery: IconGrocery,
  Logistics: IconGrocery,
  Others: IconFood,
};

type Props = {
  weeks: ExpenseWeek[];
  categories: { name: string; amount: number }[];
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  isDark: boolean;
  hs: (n: number) => number;
  fs: (n: number) => number;
  ms: (n: number) => number;
};

export function SpendBreakdown({
  weeks,
  categories,
  selectedWeek,
  onSelectWeek,
  isDark,
  hs,
  fs,
  ms,
}: Props) {
  const week = weeks.find((w) => w.week === selectedWeek);
  const rows =
    week && Object.keys(week.categories).length
      ? Object.entries(week.categories).map(([name, amount]) => ({ name, amount }))
      : categories;
  const textPrimary = isDark ? '#FFFFFF' : '#1A1A2F';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const chipOff = isDark ? '#2A2A2A' : '#EFEFEF';
  const chipOffText = isDark ? 'rgba(170,170,170,0.5)' : 'rgba(109,109,140,0.3)';

  return (
    <View style={{ marginTop: 18 }}>
      <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(12) }}>
        Category
      </Text>
      <View style={[styles.legend, { marginTop: 6, gap: hs(16) }]}>
        {LEGEND.map((item) => (
          <View key={item.name} style={styles.legendItem}>
            <View
              style={{
                width: ms(12),
                height: ms(12),
                borderRadius: ms(6),
                backgroundColor: item.color,
              }}
            />
            <Text style={{ color: textSecondary, fontSize: fs(8), marginLeft: 4 }}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          color: textPrimary,
          fontSize: fs(12),
          marginTop: 18,
        }}
      >
        Spend Breakdown
      </Text>

      <View style={[styles.weekRow, { marginTop: 12, gap: hs(8) }]}>
        {[1, 2, 3, 4].map((weekNum) => {
          const active = weekNum === selectedWeek;
          return (
            <Pressable
              key={weekNum}
              onPress={() => onSelectWeek(weekNum)}
              style={{
                width: hs(72),
                height: ms(23),
                borderRadius: ms(9),
                backgroundColor: active ? '#191970' : chipOff,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: active ? '#FFFFFF' : chipOffText,
                  fontSize: fs(10),
                }}
              >
                Week {weekNum}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 16 }}>
        {rows.length === 0 ? (
          <EmptyState
            variant="spend"
            compact
            title="No spend this week"
            subtitle="A quiet week — nothing to break down yet."
          />
        ) : (
          rows.map((row) => {
            const Icon = ICONS[row.name] || IconFood;
            return (
              <View
                key={row.name}
                style={[
                  styles.breakRow,
                  { borderBottomColor: 'rgba(133,133,133,0.5)' },
                ]}
              >
                <View style={styles.breakLeft}>
                  <Icon width={ms(18)} height={ms(16)} />
                  <Text
                    style={{
                      color: textSecondary,
                      fontSize: fs(14),
                      marginLeft: 10,
                    }}
                  >
                    {row.name}
                  </Text>
                </View>
                <Text
                  style={{
                    color: isDark ? '#A78BFA' : '#191970',
                    fontSize: fs(10),
                    fontWeight: '500',
                  }}
                >
                  {formatNaira(row.amount)}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  weekRow: { flexDirection: 'row', alignItems: 'center' },
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.3,
  },
  breakLeft: { flexDirection: 'row', alignItems: 'center' },
});
