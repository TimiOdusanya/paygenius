import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SelectChevron from '../../assets/images/kyc/select-chevron.svg';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { EmptyState } from '@/components/EmptyState';

function useFormFieldTheme() {
  const { isDark } = useTheme();
  return {
    isDark,
    borderColor: isDark ? '#3B3B3B' : '#191970',
    inputBg: isDark ? '#2A2A2A' : '#FAFAFC',
    labelColor: isDark ? '#CCCCCC' : '#000000',
    textColor: isDark ? '#FFFFFF' : '#1A1D23',
    placeholderColor: 'rgba(133,133,133,0.6)',
    sheetBg: isDark ? '#1E1E2E' : '#FFFFFF',
    chevronColor: isDark ? '#FFFFFF' : '#1A1D23',
    selectedOptionBg: isDark ? '#2E1A5E' : '#F0EAFB',
    titleColor: isDark ? '#FFFFFF' : '#191970',
  };
}

type FormFieldShellProps = {
  label?: string;
  containerStyle?: ViewStyle;
  children: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  fieldHeight?: number;
};

/** Shared label + bordered field chrome used by text and select inputs. */
function FormFieldShell({
  label,
  containerStyle,
  children,
  disabled = false,
  multiline = false,
  fieldHeight,
}: FormFieldShellProps) {
  const { fs, vs } = useResponsive();
  const { borderColor, inputBg, labelColor } = useFormFieldTheme();
  const height = fieldHeight ?? (multiline ? vs(104) : vs(44));

  return (
    <View style={[styles.container, containerStyle, disabled && styles.disabled]}>
      {label ? (
        <Text
          style={[
            styles.label,
            {
              color: labelColor,
              fontSize: fs(11),
              letterSpacing: 0.25,
            },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: inputBg,
            borderColor,
            height,
            marginTop: label ? vs(5) : 0,
            alignItems: multiline ? 'flex-start' : 'center',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

type FormInputProps = TextInputProps & {
  label?: string;
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  fieldHeight?: number;
};

export function FormInput({
  label,
  containerStyle,
  rightIcon,
  style,
  editable,
  multiline,
  fieldHeight,
  ...props
}: FormInputProps) {
  const { fs, hs, vs } = useResponsive();
  const { textColor, placeholderColor } = useFormFieldTheme();

  return (
    <FormFieldShell
      label={label}
      containerStyle={containerStyle}
      disabled={editable === false}
      multiline={!!multiline}
      fieldHeight={fieldHeight}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            fontSize: fs(12),
            paddingHorizontal: hs(16),
            flex: 1,
            paddingTop: multiline ? vs(16) : 0,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        editable={editable}
        multiline={multiline}
        {...props}
      />
      {rightIcon ? (
        <View style={styles.rightIconContainer}>{rightIcon}</View>
      ) : null}
    </FormFieldShell>
  );
}

type PasswordInputProps = Omit<FormInputProps, 'rightIcon'>;

export function PasswordInput({ style, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();
  const eyeColor = isDark ? '#AAAAAA' : '#858585';

  return (
    <FormInput
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      rightIcon={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          style={styles.eyeBtn}
          hitSlop={8}
        >
          <Ionicons
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={16}
            color={eyeColor}
          />
        </Pressable>
      }
      style={style}
    />
  );
}

export type SelectInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  containerStyle?: ViewStyle;
  /** Override placeholder size (Figma LGA uses 10) */
  placeholderFontSize?: number;
};

export function SelectInput({
  label,
  value,
  placeholder = 'Select',
  options,
  onSelect,
  disabled = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  containerStyle,
  placeholderFontSize,
}: SelectInputProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { fs, vs, hs, ms } = useResponsive();
  const theme = useFormFieldTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!open) {
      setKeyboardHeight(0);
      return;
    }
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, [open]);

  const sheetMaxHeight = Math.min(
    windowHeight * 0.75,
    windowHeight - keyboardHeight - vs(16)
  );
  const listMaxHeight = Math.max(vs(160), sheetMaxHeight - vs(168));

  const filtered = useMemo(() => {
    const safe = options ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return safe;
    return safe.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  const displayFontSize = value ? fs(11) : fs(placeholderFontSize ?? 11);

  return (
    <>
      <FormFieldShell
        label={label}
        containerStyle={containerStyle}
        disabled={disabled}
      >
        <Pressable
          disabled={disabled}
          onPress={() => {
            setQuery('');
            setOpen(true);
          }}
          style={[styles.selectPressable, { paddingHorizontal: hs(16) }]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.input,
              {
                color: value ? theme.textColor : theme.placeholderColor,
                fontSize: displayFontSize,
                flex: 1,
                paddingRight: hs(8),
              },
            ]}
          >
            {value || placeholder}
          </Text>
          <SelectChevron width={9.5} height={4.5} color={theme.chevronColor} />
        </Pressable>
      </FormFieldShell>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={[styles.backdrop, { paddingBottom: keyboardHeight }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.sheetBg,
                paddingBottom:
                  keyboardHeight > 0 ? vs(12) : Math.max(insets.bottom, vs(16)),
                maxHeight: sheetMaxHeight,
              },
            ]}
          >
            <View style={styles.handleWrap}>
              <View
                style={[
                  styles.handle,
                  { backgroundColor: theme.isDark ? '#555' : '#D0D0D0' },
                ]}
              />
            </View>
            <Text
              style={[
                styles.sheetTitle,
                { color: theme.titleColor, fontSize: fs(14) },
              ]}
            >
              {label}
            </Text>

            {searchable ? (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={theme.placeholderColor}
                autoCorrect={false}
                style={[
                  styles.search,
                  {
                    color: theme.textColor,
                    borderColor: theme.borderColor,
                    backgroundColor: theme.inputBg,
                    fontSize: fs(12),
                    height: vs(40),
                    borderRadius: ms(10),
                    marginHorizontal: hs(16),
                    marginTop: vs(12),
                    paddingHorizontal: hs(12),
                  },
                ]}
              />
            ) : null}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={{ marginTop: vs(8), maxHeight: listMaxHeight }}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                    style={{
                      paddingHorizontal: hs(20),
                      paddingVertical: vs(14),
                      backgroundColor: selected
                        ? theme.selectedOptionBg
                        : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: theme.textColor,
                        fontSize: fs(13),
                        fontWeight: selected ? '600' : '400',
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <EmptyState
                  variant="history"
                  compact
                  title="No results"
                  subtitle="Nothing matches that search."
                />
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '400',
  },
  inputWrapper: {
    borderWidth: 0.4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    fontWeight: '400',
  },
  rightIconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeBtn: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  selectPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
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
    zIndex: 1,
  },
  handleWrap: { alignItems: 'center', paddingTop: 10 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  sheetTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  search: { borderWidth: 0.4 },
});
