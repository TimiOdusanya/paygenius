import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useResponsive } from '@/hooks/useResponsive';

type HaloIconProps = {
  children: React.ReactNode;
  size?: number;
  innerSize?: number;
};

export function HaloIcon({ children, size = 164, innerSize = 109 }: HaloIconProps) {
  const { ms } = useResponsive();
  const outer = ms(size);
  const inner = ms(innerSize);

  return (
    <View style={[styles.wrap, { width: outer, height: outer }]}>
      <Svg width={outer} height={outer} style={StyleSheet.absoluteFill}>
        <Circle
          cx={outer / 2}
          cy={outer / 2}
          r={outer / 2 - 2}
          stroke="#D8C4FA"
          strokeWidth={1}
          strokeDasharray="5 7"
          fill="none"
          opacity={0.55}
        />
        <Circle
          cx={outer / 2}
          cy={outer / 2}
          r={outer / 2 - 14}
          stroke="#D8C4FA"
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="none"
          opacity={0.4}
        />
        <Circle
          cx={outer / 2}
          cy={outer / 2}
          r={outer / 2 - 26}
          stroke="#C4B5FD"
          strokeWidth={1}
          strokeDasharray="3 5"
          fill="none"
          opacity={0.3}
        />
      </Svg>
      <View
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          backgroundColor: '#AFE9D6',
          borderWidth: 4,
          borderColor: '#D8C4FA',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
