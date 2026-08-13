import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatNaira } from '@/utils/money';
import type { ExpenseWeek } from '@/services/home/home.type';

type Props = {
  weeks: ExpenseWeek[];
  selectedWeek: number;
  isDark: boolean;
  hs: (n: number) => number;
  fs: (n: number) => number;
  ms: (n: number) => number;
};

export function ExpenseChart({ weeks, selectedWeek, isDark, hs, fs, ms }: Props) {
  const max = Math.max(...weeks.map((w) => w.total), 1);
  const grid = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(185,182,182,0.45)';
  const chartH = ms(151);

  return (
    <View style={{ marginTop: 18 }}>
      <View style={[styles.grid, { height: chartH }]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.gridLine,
              { borderColor: grid, top: (chartH / 4) * i },
            ]}
          />
        ))}
        <View style={[styles.bars, { paddingHorizontal: hs(24) }]}>
          {[1, 2, 3, 4].map((week) => {
            const data = weeks.find((w) => w.week === week);
            const total = data?.total ?? 0;
            const h = Math.max(8, (total / max) * chartH * 0.76);
            const active = week === selectedWeek;
            return (
              <View key={week} style={styles.barCol}>
                {active && total > 0 ? (
                  <View
                    style={[
                      styles.tooltip,
                      { backgroundColor: '#AFE9D6', borderRadius: 3 },
                    ]}
                  >
                    <Text style={{ color: '#191970', fontSize: fs(6), fontWeight: '700' }}>
                      {formatNaira(total)}
                    </Text>
                  </View>
                ) : (
                  <View style={{ height: 12 }} />
                )}
                <View style={styles.barPair}>
                  <View
                    style={{
                      width: ms(21),
                      height: h,
                      backgroundColor: '#191970',
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    }}
                  />
                  <View
                    style={{
                      width: ms(11),
                      height: h * 0.95,
                      backgroundColor: 'rgba(227,185,245,0.6)',
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                      marginLeft: 5,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: active ? '#191970' : isDark ? '#888888' : '#B9B6B6',
                    fontSize: fs(8),
                    marginTop: 8,
                  }}
                >
                  Week {week}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { position: 'relative', justifyContent: 'flex-end' },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 0.7,
    borderStyle: 'dashed',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  barCol: { alignItems: 'center', justifyContent: 'flex-end' },
  barPair: { flexDirection: 'row', alignItems: 'flex-end' },
  tooltip: { paddingHorizontal: 4, paddingVertical: 1, marginBottom: 4 },
});
