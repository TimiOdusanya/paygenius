import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PiggyIllustration } from '@/components/PiggyIllustration';

const WAVE = require('../../../assets/images/save/wave-emoji.png');

type Props = NativeStackScreenProps<RootStackParamList, 'SaveIntro'>;

const STEPS = [
  'Enter Your Goal Name',
  'Enter your Target Amount',
  'Write your savings description',
  'Choose the account you want to save from',
];

export function SaveIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#CCCCCC' : '#858585';
  const stepColor = isDark ? '#BBBBBB' : '#79787A';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(16) }}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={[styles.heading, { paddingHorizontal: hs(25), marginTop: vs(16) }]}>
        <Image source={WAVE} style={{ width: ms(25), height: ms(25), marginRight: 10 }} />
        <Text style={{ color: titleColor, fontSize: fs(20), fontWeight: '300', letterSpacing: -0.4, flex: 1, lineHeight: fs(25) }}>
          Hey, let’s create your Saving Goal
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(20) }}>
        <PiggyIllustration />
      </View>

      <View style={{ paddingHorizontal: hs(25), marginTop: vs(8) }}>
        <Text style={{ color: '#7C3AED', fontSize: fs(16), fontWeight: '500' }}>
          How do I Save on Paygenius
        </Text>
        <View style={{ marginTop: vs(10), gap: vs(7) }}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={[styles.badge, { width: ms(15), height: ms(15), borderRadius: ms(8) }]}>
                <Text style={{ color: '#7C3AED', fontSize: fs(10) }}>{index + 1}</Text>
              </View>
              <Text style={{ color: stepColor, fontSize: fs(12), marginLeft: 8 }}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: hs(16), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <PrimaryButton title="Get Started" onPress={() => navigation.navigate('CreateGoal')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { flexDirection: 'row', alignItems: 'flex-start' },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: '#D8C4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
