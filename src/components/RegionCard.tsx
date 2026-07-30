import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { greenPalette } from '@/theme/palettes';
import type { AppRegion } from '@/stores/preferences.store';

import RadioUnselectedLight from '../../assets/images/region/radio-unselected.svg';
import RadioSelectedLight from '../../assets/images/region/radio-selected.svg';
import RadioUnselectedDark from '../../assets/images/region/radio-unselected-dark.svg';
import RadioSelectedDark from '../../assets/images/region/radio-selected-dark.svg';

type RegionCardProps = {
  region: AppRegion;
  label: string;
  flag: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
};

export function RegionCard({
  label,
  flag,
  selected,
  onPress,
}: RegionCardProps) {
  const { isDark } = useTheme();
  const { hs, vs, ms, fs } = useResponsive();

  const cardBg = isDark ? '#3B3B3B' : '#FFFFFF';
  const labelColor = isDark ? '#FFFFFF' : '#1A1A2F';
  const RadioUnselected = isDark ? RadioUnselectedDark : RadioUnselectedLight;
  const RadioSelected = isDark ? RadioSelectedDark : RadioSelectedLight;
  const radioSize = ms(12);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        {
          width: hs(148),
          height: vs(102),
          borderRadius: ms(10),
          backgroundColor: cardBg,
          borderWidth: !selected && isDark ? 1 : 0,
          borderColor: '#858585',
          paddingTop: vs(14),
          paddingHorizontal: hs(14),
          opacity: pressed ? 0.92 : 1,
          ...(selected
            ? {
                shadowColor: greenPalette['1'],
                shadowOffset: { width: 0, height: isDark ? 1 : 2 },
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 4,
              }
            : {
                shadowColor: 'transparent',
                shadowOpacity: 0,
                elevation: 0,
              }),
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <Image
            source={flag}
            style={{
              width: ms(20),
              height: ms(20),
              borderRadius: ms(10),
            }}
            resizeMode="cover"
          />
          <Text
            style={[
              styles.label,
              {
                color: labelColor,
                fontSize: fs(11),
                letterSpacing: 0.25,
                marginLeft: hs(4),
              },
            ]}
          >
            {label}
          </Text>
        </View>
        {selected ? (
          <RadioSelected width={radioSize} height={radioSize} />
        ) : (
          <RadioUnselected width={radioSize} height={radioSize} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  label: {
    fontWeight: '400',
  },
});
