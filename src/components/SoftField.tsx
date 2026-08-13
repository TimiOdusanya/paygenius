import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import ChevronDown from '../../assets/images/bills/chevron-down.svg';

type SoftFieldProps = TextInputProps & {
  label?: string;
  containerStyle?: ViewStyle;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  fieldHeight?: number;
};

/** Figma bill field: 58px, #EDEDED, 8px radius, 10px type. */
export function SoftField({
  label,
  containerStyle,
  left,
  right,
  showChevron,
  onPress,
  fieldHeight,
  editable,
  style,
  ...props
}: SoftFieldProps) {
  const { isDark } = useTheme();
  const { fs, hs, vs, ms } = useResponsive();
  const labelColor = isDark ? '#CCCCCC' : '#1A1D23';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';
  const placeholderColor = 'rgba(133,133,133,0.7)';
  const fieldBg = isDark ? '#2A2A2A' : '#EDEDED';
  const height = fieldHeight ?? vs(58);

  const content = (
    <View
      style={[
        styles.field,
        {
          backgroundColor: fieldBg,
          height,
          borderRadius: ms(8),
          paddingHorizontal: hs(16),
        },
      ]}
    >
      {left ? <View style={[styles.left, { marginRight: hs(10) }]}>{left}</View> : null}
      {onPress ? (
        <Text
          numberOfLines={1}
          style={[
            styles.value,
            {
              color: props.value ? textColor : placeholderColor,
              fontSize: fs(10),
            },
          ]}
        >
          {props.value || props.placeholder}
        </Text>
      ) : (
        <TextInput
          {...props}
          editable={editable}
          placeholderTextColor={placeholderColor}
          style={[
            styles.input,
            { color: textColor, fontSize: fs(10) },
            style,
          ]}
        />
      )}
      {right}
      {showChevron ? (
        <ChevronDown width={ms(13)} height={ms(7.14)} />
      ) : null}
    </View>
  );

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: labelColor, fontSize: fs(10), marginBottom: vs(8) }]}>
          {label}
        </Text>
      ) : null}
      {onPress ? (
        <Pressable onPress={onPress} disabled={editable === false}>
          {content}
        </Pressable>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  label: {
    fontWeight: '400',
  },
  field: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontWeight: '400',
    padding: 0,
  },
  value: {
    flex: 1,
    fontWeight: '400',
  },
});
