import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuthStore } from '@/stores';
import { BackButton } from '@/components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'BudgetCreation'>;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const DAYS_IN_MONTH = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

interface CalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  isDark: boolean;
  ms: (n: number) => number;
  vs: (n: number) => number;
  fs: (n: number) => number;
}

function Calendar({ selectedDate, onSelect, isDark, ms, vs, fs }: CalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = DAYS_IN_MONTH(month, year);
  const firstDay = new Date(year, month, 1).getDay();

  const cardBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = '#858585';
  const selectedBg = '#191970';
  const todayBg = isDark ? '#3A3A8A' : '#3A3A8A';
  const today = new Date();

  const prevMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  };

  const nextMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  };

  const cells: (number | null)[] = [...Array(firstDay).fill(null)];
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={[styles.calendarCard, { backgroundColor: cardBg, borderRadius: ms(12), padding: ms(16) }]}>
      {/* Month nav */}
      <View style={styles.calMonthRow}>
        <Text style={[styles.calMonthTitle, { color: textColor, fontSize: fs(14) }]}>
          {MONTHS[month]} {year}
        </Text>
        <View style={styles.calNavRow}>
          <Pressable onPress={prevMonth} hitSlop={8} style={styles.calNavBtn}>
            <Text style={[styles.calNavArrow, { color: textColor, fontSize: fs(14) }]}>{'‹'}</Text>
          </Pressable>
          <Pressable onPress={nextMonth} hitSlop={8} style={styles.calNavBtn}>
            <Text style={[styles.calNavArrow, { color: textColor, fontSize: fs(14) }]}>{'›'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Day of week headers */}
      <View style={styles.calDowRow}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
          <Text key={d} style={[styles.calDow, { color: subColor, fontSize: fs(9) }]}>{d}</Text>
        ))}
      </View>

      {/* Days grid */}
      <View style={styles.calDaysGrid}>
        {cells.map((day, i) => {
          if (day === null) {
            return <View key={`null-${i}`} style={styles.calDayCell} />;
          }
          const thisDate = new Date(year, month, day);
          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <Pressable
              key={day}
              onPress={() => onSelect(new Date(year, month, day))}
              style={[
                styles.calDayCell,
                isSelected && { backgroundColor: selectedBg, borderRadius: ms(20) },
                !isSelected && isToday && { backgroundColor: todayBg, borderRadius: ms(20) },
              ]}
            >
              <Text style={[
                styles.calDayText,
                { color: isSelected || isToday ? '#FFFFFF' : textColor, fontSize: fs(12) },
              ]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function BudgetCreationScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const user = useAuthStore((s) => s.user);

  const [budgetName, setBudgetName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const firstName = user?.firstName ?? 'there';

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textPrimary = isDark ? '#FFFFFF' : '#191970';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const inputBg = isDark ? '#1A1A1A' : '#FAFAFC';
  const inputBorder = isDark ? '#555555' : '#858585';
  const inputText = isDark ? '#FFFFFF' : '#1A1D23';
  const placeholderColor = isDark ? 'rgba(133,133,133,0.7)' : 'rgba(133,133,133,0.7)';
  const pillBg = isDark ? '#2A2A3E' : 'rgba(224,224,224,0.7)';
  const pillActiveBg = isDark ? '#191970' : '#191970';
  const labelPurpleBg = isDark ? '#3A1A6A' : '#D8C4FA';
  const labelGreenBg = isDark ? '#0A3A2A' : '#AFE9D6';

  const handleContinue = () => {
    if (!budgetName.trim() || !amount.trim()) return;
    navigation.navigate('BudgetAccountSelection', {
      budgetName: budgetName.trim(),
      amount: parseFloat(amount),
      period,
      selectedDate: `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
    });
  };

  const canContinue = budgetName.trim().length > 0 && amount.trim().length > 0 && parseFloat(amount) > 0;

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitles}>
          <Text style={[styles.title, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
            Budget Creation
          </Text>
          <Text style={[styles.subtitle, { color: textSecondary, fontSize: fs(12) }]}>
            Let's Create your Budget
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: vs(32) }}
      >
        {/* Greeting pills */}
        <View style={[styles.greetingWrap, { paddingHorizontal: hs(21), marginTop: vs(20) }]}>
          <View style={[styles.greetingPill, { backgroundColor: labelPurpleBg, transform: [{ rotate: '-2.98deg' }] }]}>
            <Text style={[styles.greetingPillText, { color: textSecondary, fontSize: fs(18) }]}>
              Hello {firstName},{'  '}
            </Text>
          </View>
          <View style={[styles.greetingPill2, { backgroundColor: labelGreenBg, marginTop: vs(8) }]}>
            <Text style={[styles.greetingPillText, { color: textSecondary, fontSize: fs(18) }]}>
              Let's Create your Budget
            </Text>
          </View>
        </View>

        {/* Form fields */}
        <View style={{ paddingHorizontal: hs(21), marginTop: vs(32) }}>
          {/* Budgeting For */}
          <TextInput
            value={budgetName}
            onChangeText={setBudgetName}
            placeholder="Budgeting For......."
            placeholderTextColor={placeholderColor}
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: inputText,
                borderRadius: ms(28),
                fontSize: fs(16),
                paddingHorizontal: hs(22),
                height: vs(44),
                borderWidth: 0.3,
              },
            ]}
          />
          {/* Amount */}
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter Amount"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: inputText,
                borderRadius: ms(28),
                fontSize: fs(16),
                paddingHorizontal: hs(22),
                height: vs(44),
                borderWidth: 0.3,
                marginTop: vs(12),
              },
            ]}
          />

          {/* Period selector */}
          <View style={{ marginTop: vs(16) }}>
            <Text style={[styles.periodLabel, { color: isDark ? '#FFFFFF' : '#1A1D23', fontSize: fs(16) }]}>
              Every
            </Text>
            <View style={[styles.periodRow, { marginTop: vs(8) }]}>
              {(['WEEKLY', 'MONTHLY'] as const).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.periodPill,
                    {
                      backgroundColor: period === p ? pillActiveBg : pillBg,
                      borderRadius: ms(17),
                      paddingHorizontal: hs(18),
                      height: vs(30),
                      marginRight: hs(10),
                    },
                  ]}
                >
                  <Text style={[
                    styles.periodText,
                    {
                      color: period === p ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#1A1D23'),
                      fontSize: fs(14),
                    },
                  ]}>
                    {p === 'WEEKLY' ? 'Week' : 'Month'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Calendar */}
          <View style={{ marginTop: vs(16) }}>
            <Calendar
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              isDark={isDark}
              ms={ms}
              vs={vs}
              fs={fs}
            />
          </View>
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={{ paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <Pressable
          onPress={handleContinue}
          disabled={!canContinue}
          style={[
            styles.continueBtn,
            {
              backgroundColor: canContinue ? '#191970' : (isDark ? '#333333' : '#C4C4C4'),
              borderRadius: ms(14),
            },
          ]}
        >
          <Text style={[styles.continueBtnText, { fontSize: fs(12) }]}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 4 },
  headerTitles: { flex: 1, alignItems: 'center' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400', marginTop: 2 },
  greetingWrap: {},
  greetingPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 90,
    alignSelf: 'flex-start',
  },
  greetingPill2: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 38,
    alignSelf: 'flex-start',
  },
  greetingPillText: { fontWeight: '500' },
  input: { fontWeight: '400' },
  periodLabel: { fontWeight: '400' },
  periodRow: { flexDirection: 'row', alignItems: 'center' },
  periodPill: { alignItems: 'center', justifyContent: 'center' },
  periodText: { fontWeight: '400' },
  calendarCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  calMonthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  calMonthTitle: { fontWeight: '500' },
  calNavRow: { flexDirection: 'row', gap: 8 },
  calNavBtn: { padding: 4 },
  calNavArrow: { fontWeight: '400' },
  calDowRow: { flexDirection: 'row', marginBottom: 4 },
  calDow: { flex: 1, textAlign: 'center', fontWeight: '400' },
  calDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calDayText: { fontWeight: '400', textAlign: 'center' },
  continueBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  continueBtnText: { color: '#FFFFFF', fontWeight: '600' },
});
