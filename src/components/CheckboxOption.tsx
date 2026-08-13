import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type CheckboxOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedColor?: string;
  showCheck?: boolean;
};

export function CheckboxOption({
  label,
  selected,
  onPress,
  selectedColor = '#7C3AED',
  showCheck = true,
}: CheckboxOptionProps) {
  const { isDark } = useTheme();
  const { fs, ms } = useResponsive();
  const box = ms(14);
  const border = isDark ? '#AAAAAA' : '#858585';

  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <View
        style={{
          width: box,
          height: box,
          borderRadius: 4,
          borderWidth: 0.6,
          borderColor: selected ? selectedColor : border,
          backgroundColor: selected ? selectedColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && showCheck ? (
          <Ionicons name="checkmark" size={ms(10)} color="#FFFFFF" />
        ) : null}
      </View>
      <Text
        style={[
          styles.label,
          { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(12), marginLeft: 8 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 18,
  },
  label: {
    fontWeight: '400',
    flexShrink: 1,
  },
});
