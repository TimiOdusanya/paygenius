import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import VerificationShield from '../../../../assets/images/auth/verification-shield.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'VerificationCompleted'>;

export function VerificationCompletedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs } = useResponsive();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const cardBg = isDark ? '#2A1A4A' : '#E5D8FB';
  const bgCard2 = isDark ? '#3A2060' : '#E5D8FB';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('SelfieIntroduction');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: insets.top + vs(32),
          paddingBottom: Math.max(insets.bottom, vs(32)),
        },
      ]}
    >
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: titleColor, fontSize: fs(25), letterSpacing: -0.5, lineHeight: fs(28) },
        ]}
      >
        Verification{'\n'}Completed
      </Text>

      {/* Shield illustration */}
      <View style={[styles.illustrationWrap, { marginTop: vs(40) }]}>
        {/* Tilted background card */}
        <View
          style={[
            styles.bgCard,
            {
              backgroundColor: bgCard2,
              transform: [{ rotate: '9.83deg' }],
            },
          ]}
        />
        {/* Shield SVG (self-contained with background) */}
        <VerificationShield width={297} height={292} style={styles.shieldSvg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  title: { fontWeight: '600', textAlign: 'center', lineHeight: 30 },
  illustrationWrap: { width: 297, height: 292, alignItems: 'center', justifyContent: 'center' },
  bgCard: {
    position: 'absolute',
    width: 297,
    height: 292,
    borderRadius: 21,
  },
  shieldSvg: {
    borderRadius: 21,
    overflow: 'hidden',
  },
});
