import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

const DEFAULT_DOB = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  d.setMonth(0, 1);
  d.setHours(12, 0, 0, 0);
  return d;
};

type DateOfBirthFieldProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholders?: { day: string; month: string; year: string };
  minimumDate?: Date;
  maximumDate?: Date;
  sheetTitle?: string;
  variant?: 'parts' | 'input';
  placeholder?: string;
  rightIcon?: React.ReactNode;
};

function formatPart(
  value: Date | null,
  type: 'day' | 'month' | 'year',
  placeholders?: { day: string; month: string; year: string }
) {
  if (!value) {
    return type === 'day'
      ? placeholders?.day ?? 'DD'
      : type === 'month'
        ? placeholders?.month ?? 'Month'
        : placeholders?.year ?? 'YYYY';
  }
  if (type === 'day') return String(value.getDate()).padStart(2, '0');
  if (type === 'month') return value.toLocaleString('en', { month: 'long' });
  return String(value.getFullYear());
}

function formatSlash(value: Date | null) {
  if (!value) return '';
  const mm = String(value.getMonth() + 1).padStart(2, '0');
  const dd = String(value.getDate()).padStart(2, '0');
  const yy = String(value.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export function DateOfBirthField({
  value,
  onChange,
  label = 'Date of Birth',
  placeholders,
  minimumDate,
  maximumDate = new Date(),
  sheetTitle,
  variant = 'parts',
  placeholder = 'MM/DD/YY',
  rightIcon,
}: DateOfBirthFieldProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? DEFAULT_DOB());

  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const inputText = isDark ? '#FFFFFF' : '#000000';
  const placeholderColor = 'rgba(133,133,133,0.6)';
  const sheetBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const actionColor = isDark ? '#A0A0FF' : '#191970';

  const openPicker = () => {
    const fallback =
      maximumDate && maximumDate.getFullYear() > new Date().getFullYear()
        ? new Date()
        : DEFAULT_DOB();
    setDraft(value ?? fallback);
    setOpen(true);
  };

  const closePicker = () => setOpen(false);

  const confirmPicker = () => {
    onChange(draft);
    setOpen(false);
  };

  const resolvedLabelColor = isDark ? '#FFFFFF' : '#1A1D23';

  return (
    <View>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: resolvedLabelColor, fontSize: variant === 'input' ? fs(12) : fs(11) },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <Pressable onPress={openPicker}>
        {variant === 'input' ? (
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                borderRadius: ms(12),
                height: vs(44),
                marginTop: vs(3),
                paddingHorizontal: hs(24),
              },
            ]}
          >
            <Text
              style={{
                color: value ? inputText : placeholderColor,
                fontSize: fs(12),
                flex: 1,
              }}
            >
              {value ? formatSlash(value) : placeholder}
            </Text>
            {rightIcon}
          </View>
        ) : (
          <View style={[styles.row, { marginTop: vs(8) }]}>
            {(['day', 'month', 'year'] as const).map((part) => (
              <View
                key={part}
                style={[
                  styles.box,
                  {
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                    borderRadius: ms(12),
                    height: vs(44),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.boxText,
                    {
                      color: value ? inputText : placeholderColor,
                      fontSize: fs(11),
                    },
                  ]}
                >
                  {formatPart(value, part, placeholders)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
      >
        <Pressable style={styles.backdrop} onPress={closePicker}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: sheetBg,
                paddingBottom: Math.max(insets.bottom, vs(16)),
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.handleWrap}>
              <View
                style={[
                  styles.handle,
                  { backgroundColor: isDark ? '#555' : '#D0D0D0' },
                ]}
              />
            </View>

            <View style={[styles.sheetHeader, { paddingHorizontal: hs(16) }]}>
              <Pressable onPress={closePicker} hitSlop={8}>
                <Text style={[styles.sheetAction, { color: placeholderColor, fontSize: fs(14) }]}>
                  Cancel
                </Text>
              </Pressable>
              <Text style={[styles.sheetTitle, { color: titleColor, fontSize: fs(14) }]}>
                {sheetTitle ?? label}
              </Text>
              <Pressable onPress={confirmPicker} hitSlop={8}>
                <Text style={[styles.sheetAction, { color: actionColor, fontSize: fs(14) }]}>
                  Done
                </Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={draft}
              mode="date"
              display="spinner"
              maximumDate={maximumDate}
              minimumDate={minimumDate ?? new Date(1920, 0, 1)}
              themeVariant={isDark ? 'dark' : 'light'}
              onChange={(_, date) => {
                if (date) setDraft(date);
              }}
              style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '400', letterSpacing: 0.25 },
  row: { flexDirection: 'row', gap: 12 },
  box: {
    flex: 1,
    borderWidth: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: { fontWeight: '400', textAlign: 'center' },
  inputRow: {
    borderWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handleWrap: { alignItems: 'center', paddingTop: 10 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sheetTitle: { fontWeight: '600' },
  sheetAction: { fontWeight: '500' },
  iosPicker: { height: 216 },
});
