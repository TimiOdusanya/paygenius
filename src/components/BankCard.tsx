import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '@/hooks/useResponsive';

const CARD_DOTS = Array.from({ length: 8 }, (_, row) =>
  Array.from({ length: 12 }, (__, col) => ({
    left: col * 30 + (row % 2) * 15,
    top: row * 22,
    opacity: ((row * 3 + col) % 5) / 8 + 0.2,
  }))
).flat();

type BankCardProps = {
  title: string;
  last4: string;
  brand?: string;
  width?: number;
  height?: number;
};

export function BankCard({
  title,
  last4,
  brand = 'VISA',
  width,
  height,
}: BankCardProps) {
  const { ms, fs } = useResponsive();
  const w = width ?? ms(322);
  const h = height ?? ms(172);

  return (
    <View
      style={[
        styles.card,
        {
          width: w,
          height: h,
          borderRadius: ms(12),
        },
      ]}
    >
      <LinearGradient
        colors={['#14145A', '#632EB2']}
        start={{ x: 0.01, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}>
        {CARD_DOTS.map((dot, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#00E5E5',
              left: dot.left,
              top: dot.top,
              opacity: dot.opacity,
            }}
          />
        ))}
      </View>
      <View style={{ flex: 1, padding: ms(22), justifyContent: 'space-between' }}>
        <Text style={{ color: '#FFFFFF', fontSize: fs(14) }}>{title}</Text>
        <View style={styles.bottom}>
          <Text style={{ color: '#FFFFFF', fontSize: fs(12), letterSpacing: 2 }}>
            **** **** ****
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: fs(17), fontWeight: '500' }}>
            {last4}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ color: '#FFFFFF', fontSize: fs(16), fontWeight: '600' }}>
            {brand}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
