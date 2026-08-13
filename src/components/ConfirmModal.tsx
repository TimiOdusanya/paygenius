import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  destructive,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const sheetBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const bodyColor = isDark ? '#CCCCCC' : '#6D6D8C';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.35)' }]}
        onPress={loading ? undefined : onCancel}
      >
        <Pressable
          onPress={() => undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: sheetBg,
              marginHorizontal: hs(28),
              borderRadius: ms(16),
              paddingHorizontal: hs(20),
              paddingTop: vs(22),
              paddingBottom: vs(16),
            },
          ]}
        >
          <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600', letterSpacing: -0.32 }}>
            {title}
          </Text>
          <Text
            style={{
              color: bodyColor,
              fontSize: fs(12),
              lineHeight: fs(18),
              marginTop: vs(8),
            }}
          >
            {message}
          </Text>
          <View style={[styles.actions, { marginTop: vs(22), gap: hs(10) }]}>
            <Pressable
              disabled={loading}
              onPress={onCancel}
              style={[
                styles.btn,
                {
                  backgroundColor: isDark ? '#2A2A2A' : '#EDEDED',
                  borderRadius: ms(12),
                  height: vs(46),
                },
              ]}
            >
              <Text style={{ color: isDark ? '#FFFFFF' : '#191970', fontSize: fs(12), fontWeight: '600' }}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              disabled={loading}
              onPress={onConfirm}
              style={[
                styles.btn,
                {
                  backgroundColor: destructive ? '#E05353' : '#191970',
                  borderRadius: ms(12),
                  height: vs(46),
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ color: '#FFFFFF', fontSize: fs(12), fontWeight: '600' }}>
                  {confirmLabel}
                </Text>
              )}
            </Pressable>
          </View>
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
  },
  actions: {
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
