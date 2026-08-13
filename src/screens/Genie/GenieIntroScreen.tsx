import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuthStore } from '@/stores';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import Orb from '../../../assets/images/genie/orb.svg';
import OrbLogo from '../../../assets/images/genie/orb-logo.svg';

type Props = {
  onBack: () => void;
  onContinue: () => void;
};

export function GenieIntroScreen({ onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const firstName = useAuthStore((s) => s.user?.firstName) ?? 'there';
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const title = isDark ? '#FFFFFF' : '#191970';
  const body = isDark ? '#FFFFFF' : '#1A1D23';
  const sub = isDark ? '#AAAAAA' : '#858585';

  return (
    <View style={[styles.root, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
        <BackButton onPress={onBack} />
      </View>

      <Text
        style={{
          color: title,
          fontSize: fs(16),
          fontWeight: '600',
          letterSpacing: -0.32,
          textAlign: 'center',
          lineHeight: fs(20),
          marginTop: vs(4),
          paddingHorizontal: hs(24),
        }}
      >
        Hey there{'\n'}Let’s get to know you
      </Text>
      <Text
        style={{
          color: sub,
          fontSize: fs(12),
          textAlign: 'center',
          lineHeight: fs(16),
          marginTop: vs(8),
          alignSelf: 'center',
          width: hs(253),
        }}
      >
        Help <Text style={{ color: '#7C3AED' }}>Genie</Text> understand your money
        vibe so it can serve you better
      </Text>

      <View style={styles.center}>
        <View style={{ width: ms(142), height: ms(170), alignItems: 'center' }}>
          <View
            style={{
              width: ms(142),
              height: ms(142),
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#B300FF',
              shadowOpacity: 0.45,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
            }}
          >
            <Orb width={ms(142)} height={ms(142)} />
            <View style={[StyleSheet.absoluteFill, styles.logoWrap]}>
              <OrbLogo width={ms(47)} height={ms(42)} />
            </View>
          </View>
          <View
            style={{
              width: ms(105),
              height: ms(12),
              borderRadius: 20,
              backgroundColor: isDark ? 'rgba(227,185,245,0.35)' : 'rgba(227,215,250,0.9)',
              marginTop: -4,
            }}
          />
        </View>
        <Text
          style={{
            color: body,
            fontSize: fs(16),
            textAlign: 'center',
            marginTop: vs(24),
            width: hs(239),
            lineHeight: fs(18),
          }}
        >
          👋 Hi, {firstName},  I’m{' '}
          <Text style={{ color: '#7C3AED', fontWeight: '700' }}>Genie!</Text>
          {'\n'}I’m your finance coach and assistant
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: hs(22),
          paddingBottom: insets.bottom + vs(16),
        }}
      >
        <PrimaryButton title="Help Genie Understand you" onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
});
