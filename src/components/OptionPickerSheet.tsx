import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

export type PickerOption = {
  id: string;
  label: string;
  logo?: ImageSourcePropType;
  logoUri?: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedId?: string;
  onClose: () => void;
  onSelect: (option: PickerOption) => void;
};

export function OptionPickerSheet({
  visible,
  title,
  options,
  selectedId,
  onClose,
  onSelect,
}: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const sheetBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const rowBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';
  const selectedBg = isDark ? '#2E1A5E' : '#F0EAFB';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)' }]}
        onPress={onClose}
      >
        <Pressable
          onPress={() => undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: sheetBg,
              borderRadius: ms(12),
              marginHorizontal: hs(22),
              paddingVertical: vs(8),
              maxHeight: vs(360),
              shadowOpacity: 0.25,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: titleColor, fontSize: fs(14), paddingHorizontal: hs(16), paddingVertical: vs(10) },
            ]}
          >
            {title}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option, index) => {
              const selected = option.id === selectedId;
              return (
                <Pressable
                  key={`${option.id}-${index}`}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  style={[
                    styles.row,
                    {
                      backgroundColor: selected ? selectedBg : rowBg,
                      paddingHorizontal: hs(16),
                      height: vs(52),
                    },
                  ]}
                >
                  {option.logo || option.logoUri ? (
                    <Image
                      source={option.logo ?? { uri: option.logoUri }}
                      style={{ width: ms(30), height: ms(30), borderRadius: ms(15), marginRight: hs(10) }}
                    />
                  ) : null}
                  <Text style={[styles.label, { color: textColor, fontSize: fs(12) }]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={{ height: Math.max(insets.bottom, vs(8)) }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
  },
  sheet: {
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 4,
  },
  title: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: '400',
  },
});
