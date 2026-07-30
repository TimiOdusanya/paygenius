import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RegionCard } from '@/components/RegionCard';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import {
  AppRegion,
  usePreferencesStore,
} from '@/stores/preferences.store';

const FLAG_USA = require('../../../assets/images/region/flag-usa.png');
const FLAG_NIGERIA = require('../../../assets/images/region/flag-nigeria.png');

type Props = NativeStackScreenProps<RootStackParamList, 'RegionSelector'>;

/** Figma: light #FAFAFC / dark #1A1A1A */
const BG_LIGHT = '#FAFAFC';
const BG_DARK = '#1A1A1A';
const TITLE_LIGHT = '#1A1A2F';
const TITLE_DARK = '#FFFFFF';
const SUBTITLE_LIGHT = '#858585';
const SUBTITLE_DARK = '#E0E0E0';
const CONTENT_MAX_WIDTH = 480;

export function RegionSelectorScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, isLargeScreen, width } = useResponsive();
  const setRegion = usePreferencesStore((s) => s.setRegion);
  const savedRegion = usePreferencesStore((s) => s.region);
  const [selected, setSelected] = useState<AppRegion>(savedRegion ?? 'NGN');

  // Figma frame 402: title inset 21, cards inset 33, button inset 22
  const sidePad = isLargeScreen
    ? Math.max((width - CONTENT_MAX_WIDTH) / 2, 24)
    : hs(21);
  const cardsExtraInset = isLargeScreen ? 0 : hs(12);
  const buttonInset = isLargeScreen ? 0 : hs(1);

  const handleContinue = () => {
    setRegion(selected);
    navigation.replace('Login');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? BG_DARK : BG_LIGHT,
          paddingTop: insets.top + vs(54),
          paddingBottom: Math.max(insets.bottom, vs(24)),
          paddingHorizontal: sidePad,
        },
      ]}
    >
      <View style={[styles.content, isLargeScreen && styles.contentLarge]}>
        <Text
          style={[
            styles.title,
            {
              color: isDark ? TITLE_DARK : TITLE_LIGHT,
              fontSize: fs(16),
              lineHeight: fs(20),
              letterSpacing: -0.32,
            },
          ]}
        >
          Where are you using PayGenius from?
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: isDark ? SUBTITLE_DARK : SUBTITLE_LIGHT,
              fontSize: fs(12),
              marginTop: vs(2),
            },
          ]}
        >
          we will customize your experience based on your region
        </Text>

        <View
          style={[
            styles.cardsRow,
            {
              marginTop: vs(25),
              paddingHorizontal: cardsExtraInset,
              justifyContent: 'space-between',
            },
          ]}
        >
          <RegionCard
            region="USA"
            label="USA"
            flag={FLAG_USA}
            selected={selected === 'USA'}
            onPress={() => setSelected('USA')}
          />
          <RegionCard
            region="NGN"
            label="NGN"
            flag={FLAG_NIGERIA}
            selected={selected === 'NGN'}
            onPress={() => setSelected('NGN')}
          />
        </View>
      </View>

      <View
        style={[
          styles.footer,
          isLargeScreen && styles.contentLarge,
          { paddingHorizontal: buttonInset },
        ]}
      >
        <PrimaryButton title="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentLarge: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    fontWeight: '400',
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
  },
});
