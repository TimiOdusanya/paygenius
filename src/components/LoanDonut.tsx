import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useResponsive } from '@/hooks/useResponsive';

type LoanDonutProps = {
  paid: number;
  remaining: number;
  paidLabel: string;
  remainingLabel: string;
};

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

export function LoanDonut({
  paid,
  remaining,
  paidLabel,
  remainingLabel,
}: LoanDonutProps) {
  const { fs, ms } = useResponsive();
  const total = Math.max(paid + remaining, 1);
  const percent = (paid / total) * 100;
  const size = ms(158);
  const stroke = ms(16);
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const paidSweep = Math.max(2, Math.min(178, (percent / 100) * 180));

  return (
    <View style={[styles.wrap, { width: size + ms(110), height: size }]}>
      <Text style={[styles.side, { color: '#FF4D4F', fontSize: fs(16), left: 0 }]}>
        {remainingLabel}
      </Text>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Path
            d={arcPath(cx, cy, r, 0, 180)}
            stroke="#FF4D4F"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="butt"
          />
          <Path
            d={arcPath(cx, cy, r, 180 - paidSweep, 180)}
            stroke="#00C292"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="butt"
          />
        </Svg>
        <Text style={[styles.center, { fontSize: fs(24), letterSpacing: -2.16 }]}>
          {percent.toFixed(2)}%
        </Text>
      </View>
      <Text style={[styles.side, { color: '#00C292', fontSize: fs(16), right: 0 }]}>
        {paidLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  side: { position: 'absolute', fontWeight: '500', width: 73, textAlign: 'center' },
  center: {
    position: 'absolute',
    color: 'rgba(133,133,133,0.7)',
    fontWeight: '600',
  },
});
