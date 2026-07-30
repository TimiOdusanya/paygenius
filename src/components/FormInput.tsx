import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type FormInputProps = TextInputProps & {
  label: string;
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
};

export function FormInput({
  label,
  containerStyle,
  rightIcon,
  style,
  ...props
}: FormInputProps) {
  const { isDark } = useTheme();
  const { fs, vs, hs } = useResponsive();

  const borderColor = isDark ? '#3B3B3B' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const labelColor = isDark ? '#CCCCCC' : '#000000';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const placeholderColor = isDark ? 'rgba(133,133,133,0.6)' : 'rgba(133,133,133,0.6)';

  return (
    <View style={[styles.container, containerStyle]}>
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
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: inputBg,
            borderColor,
            borderWidth: 0.4,
            borderRadius: 12,
            height: vs(44),
            marginTop: vs(5),
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              fontSize: fs(12),
              paddingHorizontal: hs(16),
              flex: 1,
            },
            style,
          ]}
          placeholderTextColor={placeholderColor}
          {...props}
        />
        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
    </View>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '400',
  },
  inputWrapper: {
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
});
