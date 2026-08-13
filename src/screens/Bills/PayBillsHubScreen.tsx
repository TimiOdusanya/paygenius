import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { BillCategoryCard } from '@/components/BillCategoryCard';

type Props = NativeStackScreenProps<RootStackParamList, 'PayBills'>;

export function PayBillsHubScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs } = useResponsive();
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
        <ScreenTitleBar title="Pay Bills" onBack={() => navigation.goBack()} />
      </View>

      <View
        style={[
          styles.grid,
          { paddingHorizontal: hs(21), marginTop: vs(25), gap: vs(23) },
        ]}
      >
        <View style={[styles.row, { gap: hs(24) }]}>
          <BillCategoryCard
            category="AIRTIME"
            onPress={() => navigation.navigate('BillAirtime')}
          />
          <BillCategoryCard
            category="DATA"
            onPress={() => navigation.navigate('BillData')}
          />
        </View>
        <View style={[styles.row, { gap: hs(24) }]}>
          <BillCategoryCard
            category="ELECTRICITY"
            onPress={() => navigation.navigate('BillElectricity')}
          />
          <BillCategoryCard
            category="TELEVISION"
            onPress={() => navigation.navigate('BillTelevision')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
});
