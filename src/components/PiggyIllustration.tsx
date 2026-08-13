import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

const PIGGY = require('../../assets/images/save/piggy-bank.png');
const WAVE = require('../../assets/images/save/wave-deco.png');

type PiggyIllustrationProps = {
  compact?: boolean;
};

export function PiggyIllustration({ compact = false }: PiggyIllustrationProps) {
  const { ms } = useResponsive();
  const width = ms(compact ? 300 : 321);
  const height = ms(compact ? 240 : 263);

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={WAVE} style={[styles.wave, { width: ms(94), height: ms(93), left: 0, top: ms(10) }]} />
      <Image
        source={WAVE}
        style={[styles.wave, { width: ms(104), height: ms(104), right: 0, bottom: ms(8) }]}
      />
      <View
        style={[
          styles.card,
          {
            width: ms(211),
            height: ms(201),
            backgroundColor: '#E5D8FB',
            transform: [{ rotate: '-18.69deg' }],
            zIndex: 1,
          },
        ]}
      />
      <View
        style={[
          styles.card,
          {
            width: ms(201),
            height: ms(193),
            backgroundColor: '#C6F0E2',
            transform: [{ rotate: '-7.65deg' }],
            zIndex: 2,
          },
        ]}
      >
        <Image
          source={PIGGY}
          style={{ width: ms(130), height: ms(130) }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
    opacity: 0.85,
  },
  card: {
    position: 'absolute',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
});
