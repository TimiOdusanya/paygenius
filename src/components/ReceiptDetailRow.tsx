import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import CopyIcon from '../../assets/images/bills/icon-copy.svg';

type Props = {
  label: string;
  value: string;
  onCopy?: () => void;
};

export function ReceiptDetailRow({ label, value, onCopy }: Props) {
  const { isDark } = useTheme();
  const { fs, ms } = useResponsive();
  const labelColor = isDark ? '#A78BFA' : '#03055B';
  const valueColor = isDark ? '#FFFFFF' : '#191970';

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: labelColor, fontSize: fs(10) }]}>{label}</Text>
      <View style={styles.valueWrap}>
        <Text style={[styles.value, { color: valueColor, fontSize: fs(10) }]}>{value}</Text>
        {onCopy ? (
          <Pressable onPress={onCopy} hitSlop={8} style={{ marginLeft: 4 }}>
            <CopyIcon width={ms(13)} height={ms(13)} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '400',
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '62%',
  },
  value: {
    fontWeight: '400',
    textAlign: 'right',
  },
});
