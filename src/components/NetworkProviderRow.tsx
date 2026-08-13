import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import type { Biller } from '@/services/bills/bills.type';
import { billerLogoSource, networkLogoKey } from '@/screens/Bills/bills.helpers';

type Props = {
  billers: Biller[];
  selected?: string;
  onSelect: (code: string) => void;
};

const CROP: Record<string, { leftRatio: number; widthRatio: number }> = {
  glo: { leftRatio: -0.3763, widthRatio: 1.7654 },
  '9mobile': { leftRatio: -0.1884, widthRatio: 1.4638 },
};

export function NetworkProviderRow({ billers, selected, onSelect }: Props) {
  const { hs, ms } = useResponsive();
  const size = ms(55);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, { gap: hs(46), paddingHorizontal: hs(4) }]}
    >
      {billers.map((biller) => {
        const isSelected = selected === biller.code;
        const key = networkLogoKey(biller.code);
        const crop = CROP[key];
        const source = billerLogoSource(biller);
        return (
          <Pressable
            key={biller.code}
            onPress={() => onSelect(biller.code)}
            style={[
              styles.logo,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: isSelected ? 2 : key === 'airtel' ? 0 : 1,
                borderColor: isSelected ? '#7C3AED' : 'rgba(133,133,133,0.7)',
                shadowOpacity: isSelected ? 0.25 : 0,
              },
            ]}
          >
            {source ? (
              <Image
                source={source}
                style={
                  crop
                    ? {
                        height: size,
                        width: size * crop.widthRatio,
                        marginLeft: size * crop.leftRatio,
                      }
                    : styles.image
                }
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fallback} />
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logo: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
});
