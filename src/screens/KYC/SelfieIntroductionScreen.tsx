import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'SelfieIntroduction'>;

export function SelfieIntroductionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const greetingColor = isDark ? '#CCCCCC' : '#858585';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Back */}
      <View style={{ paddingHorizontal: hs(21), marginTop: vs(8) }}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      {/* Greeting */}
      <View style={[styles.greetingRow, { marginTop: vs(8), paddingHorizontal: hs(29) }]}>
        <Text style={{ fontSize: ms(24), marginRight: 8 }}>😊</Text>
        <Text style={[styles.greeting, { color: greetingColor, fontSize: fs(20), letterSpacing: -0.4 }]}>
          Let's Take a Selfie
        </Text>
      </View>

      {/* Camera illustration */}
      <View style={[styles.illustrationArea, { flex: 1, marginTop: vs(20) }]}>
        {/* Outer dashed circle */}
        <View style={styles.circleOuter}>
          <View
            style={[
              styles.circleOuter,
              {
                width: ms(250),
                height: ms(250),
                borderRadius: ms(125),
                borderWidth: 1,
                borderColor: isDark ? 'rgba(124,58,237,0.3)' : 'rgba(213,199,247,0.5)',
                borderStyle: 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={[
                styles.circleInner,
                {
                  width: ms(180),
                  height: ms(180),
                  borderRadius: ms(90),
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(124,58,237,0.4)' : 'rgba(197,176,242,0.6)',
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              {/* Camera card illustration */}
              <View
                style={[
                  styles.cameraCard,
                  {
                    backgroundColor: isDark ? '#3A2A6A' : '#E5D8FB',
                    borderRadius: ms(20),
                    width: ms(150),
                    height: ms(109),
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ rotate: '-24.34deg' }],
                    shadowColor: '#10B981',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  },
                ]}
              >
                <Ionicons name="camera" size={ms(48)} color={isDark ? '#A78BFA' : '#7C3AED'} />
              </View>
              {/* Second card behind */}
              <View
                style={[
                  styles.cameraCard2,
                  {
                    backgroundColor: isDark ? '#1E3A2F' : '#C6F0E2',
                    borderRadius: ms(20),
                    width: ms(150),
                    height: ms(109),
                    transform: [{ rotate: '-45.57deg' }],
                    position: 'absolute',
                    zIndex: -1,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(24)) }]}>
        <PrimaryButton
          title="Continue"
          onPress={() => navigation.navigate('TakeSelfie')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  greetingRow: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontWeight: '300' },
  illustrationArea: { alignItems: 'center', justifyContent: 'center' },
  circleOuter: { alignItems: 'center', justifyContent: 'center' },
  circleInner: { alignItems: 'center', justifyContent: 'center' },
  cameraCard: {},
  cameraCard2: {},
  footer: { paddingTop: 16 },
});
