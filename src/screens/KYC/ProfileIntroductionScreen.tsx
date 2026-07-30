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

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileIntroduction'>;

export function ProfileIntroductionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const greetingColor = isDark ? '#CCCCCC' : '#858585';
  const cardBg1 = isDark ? '#2A3A2A' : '#C6F0E2';
  const cardBg2 = isDark ? '#2A1A4A' : '#E5D8FB';
  const cardAccent1 = isDark ? '#10B981' : '#10B981';
  const cardAccent2 = isDark ? '#7C3AED' : '#7C3AED';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Back */}
      <View style={{ paddingHorizontal: hs(21), marginTop: vs(8) }}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      {/* Greeting */}
      <View style={[styles.greetingRow, { marginTop: vs(8), paddingHorizontal: hs(25) }]}>
        <Ionicons name="hand-right-outline" size={ms(20)} color={greetingColor} style={{ marginRight: 6 }} />
        <Text style={[styles.greeting, { color: greetingColor, fontSize: fs(20), letterSpacing: -0.4 }]}>
          Hey, let's set up your profile
        </Text>
      </View>

      {/* Profile preview cards */}
      <View style={[styles.cardsArea, { flex: 1, marginTop: vs(12) }]}>
        {/* Left card – Chiamaka */}
        <View style={[styles.cardWrap, { left: hs(21), top: vs(20), transform: [{ rotate: '14.42deg' }] }]}>
          <View style={[styles.profileCard, { backgroundColor: cardBg2, borderColor: cardAccent2 }]}>
            <View style={styles.cardRow}>
              <View style={[styles.flagCircle, { backgroundColor: isDark ? '#3A2A6A' : '#E5D8FB' }]}>
                <Text style={{ fontSize: ms(10) }}>🇳🇬</Text>
              </View>
              <Text style={[styles.cardCountry, { color: cardAccent2, fontSize: fs(8) }]}>NGN</Text>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={[styles.cardFieldLabel, { color: cardAccent2 }]}>Name:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> Chiamaka Adeyemi</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { color: cardAccent2 }]}>Username:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> chiamaka.a</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { color: cardAccent2 }]}>Phone:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> 234 802 345 6789</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { color: cardAccent2 }]}>DOB:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> 5th July, 1998</Text>
            </View>
            <Text style={[styles.viewMore, { color: cardAccent2, fontSize: fs(8) }]}>View more</Text>
          </View>
        </View>

        {/* Right card – Daniel */}
        <View style={[styles.cardWrap, { right: hs(21), bottom: vs(80), transform: [{ rotate: '9.12deg' }] }]}>
          <View style={[styles.profileCard, { backgroundColor: cardBg1, borderColor: cardAccent1 }]}>
            <View style={styles.cardRow}>
              <View style={[styles.flagCircle, { backgroundColor: isDark ? '#1E3A2F' : '#C6F0E2' }]}>
                <Text style={{ fontSize: ms(10) }}>🇺🇸</Text>
              </View>
              <Text style={[styles.cardCountry, { color: cardAccent1, fontSize: fs(8) }]}>NGN</Text>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text style={[styles.cardFieldLabel, { color: cardAccent1 }]}>Name:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> Daniel Okoro</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { color: cardAccent1 }]}>Username:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> daniel.okoro</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { color: cardAccent1 }]}>Phone:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> +234 801 234 5678</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { color: cardAccent1 }]}>DOB:</Text>
              <Text style={[styles.cardFieldValue, { color: isDark ? '#CCCCCC' : '#79787A' }]}> 12th March, 1996</Text>
            </View>
            <Text style={[styles.viewMore, { color: cardAccent1, fontSize: fs(8) }]}>View more</Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(24)) }]}>
        <PrimaryButton
          title="Continue"
          onPress={() => navigation.navigate('ProfileSetup')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  greetingRow: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontWeight: '300', flex: 1 },
  cardsArea: { position: 'relative' },
  cardWrap: { position: 'absolute' },
  profileCard: {
    width: 161,
    minHeight: 90,
    borderRadius: 10,
    borderWidth: 0,
    padding: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flagCircle: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  cardCountry: { fontWeight: '400' },
  cardFieldLabel: { fontSize: 8, fontWeight: '400' },
  cardFieldValue: { fontSize: 8, fontWeight: '300' },
  viewMore: { fontWeight: '400', marginTop: 6 },
  footer: { paddingTop: 16 },
});
