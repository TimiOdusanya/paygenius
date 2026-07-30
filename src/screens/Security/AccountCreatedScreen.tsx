import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountCreated'>;

export function AccountCreatedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms } = useResponsive();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const backCardBg = isDark ? '#2E1A5E' : '#E5D8FB';
  const frontCardBg = isDark ? '#1E3A2F' : '#AFE9D6';
  const welcomeTitleColor = isDark ? '#FFFFFF' : '#191970';
  const welcomeBodyColor = isDark ? '#CCCCCC' : '#000000';
  const thumbsColor = isDark ? '#00C292' : '#10B981';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, vs(24)),
        },
      ]}
    >
      {/* Two overlapping cards centered on screen */}
      <View style={styles.cardsWrap}>
        {/* Back card - light purple, larger */}
        <View
          style={[
            styles.backCard,
            { backgroundColor: backCardBg },
          ]}
        />
        {/* Front card - mint green */}
        <View
          style={[
            styles.frontCard,
            { backgroundColor: frontCardBg },
          ]}
        >
          <Text
            style={[
              styles.welcomeTitle,
              {
                color: welcomeTitleColor,
                fontSize: fs(25),
                letterSpacing: -0.5,
              },
            ]}
          >
            Welcome
          </Text>
          <Text
            style={[
              styles.welcomeBody,
              {
                color: welcomeBodyColor,
                fontSize: fs(14),
                marginTop: vs(8),
              },
            ]}
          >
            You have successfully{'\n'}Created your account
          </Text>
          <View style={[styles.thumbsWrap, { marginTop: vs(24) }]}>
            <Ionicons name="thumbs-up" size={ms(78)} color={thumbsColor} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsWrap: {
    width: 297,
    height: 372,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCard: {
    position: 'absolute',
    width: 297,
    height: 372,
    borderRadius: 21,
  },
  frontCard: {
    width: 297,
    height: 292,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 32,
    overflow: 'hidden',
  },
  welcomeTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  welcomeBody: {
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  thumbsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
