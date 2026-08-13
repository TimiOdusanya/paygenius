import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import TrashIcon from '../../assets/images/wallet/trash.svg';

const ACCESS_BANK = require('../../assets/images/wallet/access-bank.png');

type LinkedWalletRowProps = {
  name: string;
  logoUri?: string;
  onDelete?: () => void;
};

export function LinkedWalletRow({ name, logoUri, onDelete }: LinkedWalletRowProps) {
  const { isDark } = useTheme();
  const { hs, fs, ms } = useResponsive();
  const border = isDark ? '#3B3B3B' : '#858585';
  const nameColor = isDark ? '#FFFFFF' : '#1A1D23';
  const logoBorder = isDark ? '#888888' : '#1A1D23';

  return (
    <View
      style={[
        styles.card,
        {
          height: ms(72),
          borderRadius: ms(12),
          borderColor: border,
          paddingHorizontal: hs(22),
        },
      ]}
    >
      <Image
        source={logoUri ? { uri: logoUri } : ACCESS_BANK}
        style={{
          width: ms(36),
          height: ms(36),
          borderRadius: ms(18),
          borderWidth: 0.3,
          borderColor: logoBorder,
        }}
      />
      <Text
        numberOfLines={1}
        style={[styles.name, { color: nameColor, fontSize: fs(14), marginLeft: hs(12) }]}
      >
        {name}
      </Text>
      <View style={styles.right}>
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Unlink wallet"
            style={{ marginBottom: ms(8) }}
          >
            <TrashIcon width={ms(10)} height={ms(12)} />
          </Pressable>
        ) : null}
        <View style={[styles.badge, { borderRadius: ms(6), paddingHorizontal: hs(10) }]}>
          <Text style={[styles.badgeText, { fontSize: fs(10) }]}>Linked</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.4,
    overflow: 'hidden',
  },
  name: { flex: 1, fontWeight: '400' },
  right: { alignItems: 'flex-end', justifyContent: 'center' },
  badge: {
    backgroundColor: '#AFE9D6',
    minHeight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#10B981', fontWeight: '400' },
});
