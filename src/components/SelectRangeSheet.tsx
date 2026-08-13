import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type SelectRangeSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (range: 'WEEK' | 'MONTH') => void;
};

export function SelectRangeSheet({
  visible,
  onClose,
  onSelect,
}: SelectRangeSheetProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const sheetBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#252525';
  const bodyColor = isDark ? '#AAAAAA' : '#797979';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={[
          styles.backdrop,
          { backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)' },
        ]}
        onPress={onClose}
      >
        <Pressable
          onPress={() => undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: sheetBg,
              paddingHorizontal: hs(24),
              paddingTop: vs(56),
              paddingBottom: Math.max(insets.bottom, vs(24)),
              borderTopLeftRadius: ms(24),
              borderTopRightRadius: ms(24),
            },
          ]}
        >
          <Text style={[styles.title, { color: titleColor, fontSize: fs(20) }]}>
            Select Range
          </Text>
          <Text
            style={[
              styles.body,
              { color: bodyColor, fontSize: fs(14), marginTop: vs(16), lineHeight: fs(20) },
            ]}
          >
            Kindly select how frequent you want your loan to be repayed
          </Text>
          <View style={{ marginTop: vs(40), gap: vs(12), width: '100%' }}>
            {(['WEEK', 'MONTH'] as const).map((range) => (
              <Pressable
                key={range}
                onPress={() => onSelect(range)}
                style={[
                  styles.option,
                  {
                    backgroundColor: '#E0E0E0',
                    borderRadius: ms(12),
                    height: ms(59),
                  },
                ]}
              >
                <Text style={[styles.optionText, { fontSize: fs(16) }]}>
                  {range === 'WEEK' ? 'Week' : 'Month'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: { width: '100%', alignItems: 'center' },
  title: { fontWeight: '600', textAlign: 'center', width: '100%' },
  body: { fontWeight: '400', textAlign: 'center', width: 262 },
  option: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  optionText: { color: '#FFFFFF', fontWeight: '600' },
});
