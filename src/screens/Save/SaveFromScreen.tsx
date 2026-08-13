import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { HaloIcon } from '@/components/HaloIcon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TogglePills } from '@/components/TogglePills';
import type { SavingSource } from '@/services/savings/savings.type';
import MoneyIcon from '../../../assets/images/save/money-icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SaveFrom'>;

export function SaveFromScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [source, setSource] = useState<SavingSource | null>(null);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';

  const handleContinue = () => {
    if (!source) return;
    navigation.navigate('SaveAccount', {
      ...route.params,
      sourceType: source,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600', letterSpacing: -0.32 }}>
          Where will you save from?
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(36) }}>
        <HaloIcon>
          <MoneyIcon width={ms(48)} height={ms(48)} />
        </HaloIcon>
      </View>

      <View style={{ paddingHorizontal: hs(21), marginTop: vs(40) }}>
        <TogglePills
          options={[
            { value: 'PAYGENIUS', label: 'PayGenius' },
            { value: 'LINKED_ACCOUNT', label: 'Linked account' },
          ]}
          value={source}
          onChange={setSource}
        />
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: hs(23), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <PrimaryButton title="Continue" onPress={handleContinue} disabled={!source} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
