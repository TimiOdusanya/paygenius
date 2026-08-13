import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

const BG_COLOR = '#191970';
const TEXT_COLOR = '#FFFFFF';
const BORDER_RADIUS = 14;
const HEIGHT = 54;

type PrimaryButtonProps = PressableProps & {
  title: string;
};

/**
 * Reusable primary button: bg #191970, text #FFFFFF, borderRadius 14px, height 54px.
 */
export function PrimaryButton({ title, style, disabled, ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        StyleSheet.flatten(style as ViewStyle),
      ]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: BG_COLOR,
    borderRadius: BORDER_RADIUS,
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: '#C4C4C4',
  },
  text: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: '600',
  },
});
