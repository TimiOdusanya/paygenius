import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = TextInputProps & {
  label: string;
  focused?: boolean;
  tall?: boolean;
};

export function TransferField({
  label,
  focused,
  tall,
  editable,
  style,
  ...props
}: Props) {
  const { isDark } = useTheme();
  const { fs, hs, vs, ms } = useResponsive();
  const labelColor = isDark ? '#CCCCCC' : '#000000';
  const textColor = focused ? '#191970' : isDark ? '#FFFFFF' : '#191970';
  const placeholderColor = '#C4C4C4';
  const bg = focused
    ? 'rgba(192,192,241,0.2)'
    : isDark
      ? '#1A1A1A'
      : '#FAFAFC';
  const borderColor = '#191970';

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          { color: labelColor, fontSize: fs(11), letterSpacing: 0.25, marginBottom: vs(8) },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.field,
          {
            backgroundColor: bg,
            height: tall ? vs(57) : vs(44),
            borderRadius: ms(12),
            paddingHorizontal: hs(18),
            borderWidth: focused ? 0 : 0.4,
            borderBottomWidth: focused ? 0.7 : 0.4,
            borderColor,
          },
        ]}
      >
        <TextInput
          {...props}
          editable={editable}
          placeholderTextColor={placeholderColor}
          style={[
            styles.input,
            {
              color: props.value ? textColor : placeholderColor,
              fontSize: fs(11),
              letterSpacing: 0.25,
            },
            style,
          ]}
        />
      </View>
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
    justifyContent: 'center',
  },
  input: {
    fontWeight: '400',
    padding: 0,
  },
});
