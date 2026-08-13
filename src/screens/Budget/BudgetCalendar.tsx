import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_SIZE = 32;

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function sameDay(a: Date, b: Date) {
  return startOfDay(a) === startOfDay(b);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export { MONTHS };

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { start: Date | null; end: Date | null }) => void;
  isDark: boolean;
  fs: (n: number) => number;
};

export function BudgetCalendar({ startDate, endDate, onChange, isDark, fs }: Props) {
  const [viewDate, setViewDate] = useState(startDate ?? new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();

  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A2F';
  const selectedBg = isDark ? '#FFFFFF' : '#1A1A2F';
  const selectedText = isDark ? '#1A1A2F' : '#FFFFFF';

  const cells: (number | null)[] = [...Array(firstDay).fill(null)];
  for (let d = 1; d <= daysInMonth(month, year); d++) cells.push(d);

  const onDayPress = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      onChange({ start: date, end: null });
      return;
    }
    if (sameDay(date, startDate)) {
      onChange({ start: date, end: date });
      return;
    }
    if (startOfDay(date) < startOfDay(startDate)) {
      onChange({ start: date, end: startDate });
    } else {
      onChange({ start: startDate, end: date });
    }
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + delta);
    setViewDate(next);
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.monthRow}>
        <Text style={[styles.monthTitle, { color: textColor, fontSize: fs(20) }]}>
          {MONTHS[month]} {year}
        </Text>
        <View style={styles.navRow}>
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} style={styles.navBtn}>
            <Text style={[styles.navArrow, { color: textColor }]}>{'‹'}</Text>
          </Pressable>
          <Pressable onPress={() => shiftMonth(1)} hitSlop={8} style={styles.navBtn}>
            <Text style={[styles.navArrow, { color: textColor }]}>{'›'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.dowRow}>
        {DOW.map((d) => (
          <Text key={d} style={[styles.dow, { fontSize: fs(11) }]}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) {
            return <View key={`empty-${i}`} style={styles.cell} />;
          }
          const date = new Date(year, month, day);
          const isStart = !!startDate && sameDay(date, startDate);
          const isEnd = !!endDate && sameDay(date, endDate);
          const selected = isStart || isEnd;

          return (
            <Pressable
              key={day}
              onPress={() => onDayPress(date)}
              style={styles.cell}
            >
              <View
                style={[
                  styles.circle,
                  selected && { backgroundColor: selectedBg },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: selected ? selectedText : textColor,
                      fontWeight: isStart ? '600' : '400',
                      fontSize: fs(16),
                    },
                  ]}
                >
                  {day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 6,
  },
  monthRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitle: { fontWeight: '500', letterSpacing: -0.4 },
  navRow: { flexDirection: 'row', gap: 12 },
  navBtn: { padding: 4 },
  navArrow: { fontSize: 22, fontWeight: '400' },
  dowRow: { flexDirection: 'row', marginTop: 4, marginBottom: 4 },
  dow: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: 'rgba(60,60,67,0.3)',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '14.28%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { textAlign: 'center' },
});
