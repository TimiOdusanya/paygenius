import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import VerificationShield from '../../../assets/images/auth/verification-shield.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'VerificationCompleted'>;

export function VerificationCompletedScreen({ navigation }: Props) {
  useTrackOnboardingRoute('VerificationCompleted');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const bgCard2 = isDark ? '#3A2060' : '#E5D8FB';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, vs(24)),
          paddingHorizontal: hs(21),
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: titleColor,
              fontSize: fs(25),
              letterSpacing: -0.5,
              lineHeight: fs(28),
            },
          ]}
        >
          Verification{'\n'}Completed
        </Text>

        <View style={[styles.illustrationWrap, { marginTop: vs(40) }]}>
          <View
            style={[
              styles.bgCard,
              {
                backgroundColor: bgCard2,
                transform: [{ rotate: '9.83deg' }],
              },
            ]}
          />
          <VerificationShield
            width={297}
            height={292}
            style={styles.shieldSvg}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={() => navigation.navigate('SelfieIntroduction')}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '600', textAlign: 'center' },
  illustrationWrap: {
    width: 297,
    height: 292,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  footer: {
    width: '100%',
    paddingTop: 8,
  },
});
