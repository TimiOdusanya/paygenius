import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import type { BillCategory } from '@/services/bills/bills.type';
import IconAirtime from '../../assets/images/bills/icon-airtime.svg';
import IconData from '../../assets/images/bills/icon-data.svg';
import IconElectricity from '../../assets/images/bills/icon-electricity.svg';
import IconTv from '../../assets/images/bills/icon-tv.svg';

type Props = {
  category: BillCategory;
  onPress: () => void;
};

const COPY: Record<BillCategory, { label: string; tint: 'mint' | 'lavender' }> = {
  AIRTIME: { label: 'Airtime', tint: 'mint' },
  DATA: { label: 'Data', tint: 'lavender' },
  ELECTRICITY: { label: 'Electricity', tint: 'lavender' },
  TELEVISION: { label: 'Television', tint: 'mint' },
};

export function BillCategoryCard({ category, onPress }: Props) {
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const meta = COPY[category];
  const mint = isDark ? '#1A3D32' : '#C6F0E2';
  const lavender = isDark ? '#2A1A3E' : '#E5D8FB';
  const bg = meta.tint === 'mint' ? mint : lavender;
  const labelColor = isDark ? '#FFFFFF' : '#000000';
  const iconScale = 2.2;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: bg,
          flex: 1,
          maxWidth: hs(168),
          height: vs(161),
          borderRadius: ms(22),
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: labelColor,
            fontSize: fs(14),
            marginTop: vs(22),
            marginLeft: hs(23),
          },
        ]}
      >
        {meta.label}
      </Text>
      <View style={styles.iconWrap}>{renderIcon(category, ms, iconScale)}</View>
    </Pressable>
  );
}

function renderIcon(
  category: BillCategory,
  ms: (n: number) => number,
  scale: number
) {
  if (category === 'AIRTIME') {
    return <IconAirtime width={ms(12.5 * scale)} height={ms(18.5 * scale)} />;
  }
  if (category === 'DATA') {
    return <IconData width={ms(22 * scale)} height={ms(15.8 * scale)} />;
  }
  if (category === 'ELECTRICITY') {
    return <IconElectricity width={ms(17.1 * scale)} height={ms(24.8 * scale)} />;
  }
  return <IconTv width={ms(20 * scale)} height={ms(20 * scale)} />;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  label: {
    fontWeight: '400',
  },
  iconWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
  },
});
