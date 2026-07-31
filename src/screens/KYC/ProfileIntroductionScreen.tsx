import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Header } from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import MenuDots from '../../../assets/images/kyc/menu-dots.svg';

/** Figma frame width for node 1:12309 */
const FIGMA_W = 402;
/** Status bar height in the Figma frame — we replace with safe-area inset */
const FIGMA_STATUS = 59;

const PHOTO_CHIAMAKA = require('../../../assets/images/kyc/profile-chiamaka.jpg');
const PHOTO_DANIEL = require('../../../assets/images/kyc/profile-daniel.jpg');
const WAVE_HAND = require('../../../assets/images/kyc/wave-hand.png');
const FLAG_NG = require('../../../assets/images/kyc/flag-ng.png');
const CURVE_PURPLE = require('../../../assets/images/kyc/curve-purple.png');
const CURVE_GREEN = require('../../../assets/images/kyc/curve-green.png');

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileIntroduction'>;

type InfoCardProps = {
  accent: string;
  cardBg: string;
  name: string;
  username: string;
  phone: string;
  dob: string;
  valueColor: string;
  width: number;
  height: number;
  radius: number;
  sx: number;
};

function InfoCard({
  accent,
  cardBg,
  name,
  username,
  phone,
  dob,
  valueColor,
  width,
  height,
  radius,
  sx,
}: InfoCardProps) {
  const fs10 = 10 * sx;
  const fs8 = 8 * sx;

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: cardBg,
        borderRadius: radius,
        paddingTop: 20 * sx,
        paddingHorizontal: 15 * sx,
        overflow: 'hidden',
      }}
    >
      <View style={[styles.cardTopRow, { marginBottom: 8 * sx }]}>
        <View style={[styles.flagRow, { gap: 4 * sx }]}>
          <Image
            source={FLAG_NG}
            style={{ width: 12 * sx, height: 12 * sx }}
            resizeMode="contain"
          />
          <Text style={{ color: accent, fontSize: fs8, fontWeight: '400' }}>NGN</Text>
        </View>
        <MenuDots width={3 * sx} height={13 * sx} color={accent} />
      </View>

      <View style={{ gap: 8 * sx }}>
        <Text style={{ fontSize: fs10, fontWeight: '300' }}>
          <Text style={{ color: accent }}>Name:</Text>
          <Text style={{ color: valueColor }}> {name}</Text>
        </Text>
        <Text style={{ fontSize: fs10, fontWeight: '300' }}>
          <Text style={{ color: accent }}>Username</Text>
          <Text style={{ color: valueColor }}>: {username}</Text>
        </Text>
        <Text style={{ fontSize: fs10, fontWeight: '300' }}>
          <Text style={{ color: accent }}>Phone:</Text>
          <Text style={{ color: valueColor }}>  {phone}</Text>
        </Text>
        <Text style={{ fontSize: fs10, fontWeight: '300' }}>
          <Text style={{ color: accent }}>DOB : </Text>
          <Text style={{ color: valueColor }}>{dob}</Text>
        </Text>
      </View>

      <Text
        style={{
          color: accent,
          fontSize: fs8,
          fontWeight: '400',
          position: 'absolute',
          right: 15 * sx,
          bottom: 14 * sx,
        }}
      >
        View more
      </Text>
    </View>
  );
}

export function ProfileIntroductionScreen({ navigation }: Props) {
  useTrackOnboardingRoute('ProfileIntroduction');
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const { isDark } = useTheme();

  const sx = winW / FIGMA_W;
  /** Map Figma Y (includes status bar) → Y below our safe-area top */
  const fy = (figmaTop: number) => (figmaTop - FIGMA_STATUS) * sx;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const greetingColor = isDark ? '#CCCCCC' : '#858585';
  const valueColor = isDark ? '#CCCCCC' : '#79787A';
  const purple = '#7C3AED';
  const mint = '#10B981';
  const purpleCard = isDark ? '#2A1A4A' : '#E5D8FB';
  const mintCard = isDark ? '#1E3A2F' : '#C6F0E2';
  const behindMint = isDark ? '#1E3A2F' : '#C6F0E2';
  const behindPurple = isDark ? '#2A1A4A' : '#E5D8FB';

  const photoW = 184 * sx;
  const photoH = 263 * sx;
  const photoR = 80 * sx;
  const cardW = 161 * sx;
  const cardH = 152 * sx;
  const cardR = 10 * sx;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Absolute layer — Figma Y mapped via fy(); origin is below device safe-area */}
      <View style={[styles.stage, { top: insets.top, bottom: 0 }]}>
        {/* Back — Figma left:21 top:83 */}
        <View
          style={{
            position: 'absolute',
            left: 21 * sx,
            right: 21 * sx,
            top: fy(83),
            zIndex: 10,
          }}
        >
          <Header variant="bar" onBack={() => navigation.goBack()} />
        </View>

        {/* Wave icon — Figma left:25 top:117.57, rotate -8.92° */}
        <Image
          source={WAVE_HAND}
          style={{
            position: 'absolute',
            left: 25 * sx,
            top: fy(117.57),
            width: 22 * sx,
            height: 22 * sx,
            transform: [{ rotate: '-8.92deg' }],
            zIndex: 10,
          }}
          resizeMode="contain"
        />

        {/* Greeting text — Figma left:55 (50%-146) top:~123 */}
        <Text
          style={{
            position: 'absolute',
            left: 55 * sx,
            top: fy(123),
            width: 259 * sx,
            color: greetingColor,
            fontSize: 20 * sx,
            fontWeight: '300',
            letterSpacing: -0.4,
            lineHeight: 20 * sx,
            zIndex: 10,
          }}
        >
          Hey, let's set up your profile
        </Text>

        {/* Chiamaka photo — left:21 top:173, 184×263, r:80, border purple */}
        <View
          style={[
            styles.photo,
            {
              left: 21 * sx,
              top: fy(173),
              width: photoW,
              height: photoH,
              borderRadius: photoR,
              borderColor: purple,
              borderWidth: 2 * sx,
            },
          ]}
        >
          <Image
            source={PHOTO_CHIAMAKA}
            style={{
              position: 'absolute',
              height: photoH,
              width: photoW * 2.1438,
              left: -photoW * 0.7445,
              top: 0,
            }}
            resizeMode="cover"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark
                  ? 'rgba(124,58,237,0.15)'
                  : 'rgba(219,153,247,0.1)',
              },
            ]}
          />
        </View>

        {/* Behind card (mint) under Chiamaka card — rotate 9.12° */}
        <View
          style={{
            position: 'absolute',
            left: 207 * sx,
            top: fy(200),
            width: cardW,
            height: cardH,
            borderRadius: cardR,
            backgroundColor: behindMint,
            transform: [{ rotate: '9.12deg' }],
            shadowColor: '#B200FF',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            zIndex: 2,
          }}
        />

        {/* Chiamaka purple card — rotate 14.42°, ~left 198 top 197 */}
        <View
          style={{
            position: 'absolute',
            left: 198 * sx,
            top: fy(197),
            zIndex: 3,
            transform: [{ rotate: '14.42deg' }],
            shadowColor: mint,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <InfoCard
            accent={purple}
            cardBg={purpleCard}
            name="Chiamaka Adeyemi"
            username="chiamaka.a"
            phone="234 802 345 6789"
            dob="5th July, 1998"
            valueColor={valueColor}
            width={cardW}
            height={cardH}
            radius={cardR}
            sx={sx}
          />
        </View>

        {/* Curve connector toward Chiamaka name */}
        <Image
          source={CURVE_PURPLE}
          style={{
            position: 'absolute',
            left: 159 * sx,
            top: fy(359),
            width: 73 * sx,
            height: 74 * sx,
            zIndex: 4,
          }}
          resizeMode="contain"
        />

        {/* Name label Chiamaka — left:211 top:371, rotate 9.12° */}
        <View
          style={{
            position: 'absolute',
            left: 211 * sx,
            top: fy(371),
            zIndex: 5,
            transform: [{ rotate: '9.12deg' }],
          }}
        >
          <Text style={{ color: purple, fontSize: 12 * sx, fontWeight: '400' }}>
            Chiamaka Adeyemi
          </Text>
          <View
            style={{
              marginTop: 2 * sx,
              height: 2 * sx,
              width: 116 * sx,
              borderRadius: 18,
              backgroundColor: purple,
            }}
          />
        </View>

        {/* Daniel photo — left:197 top:442 */}
        <View
          style={[
            styles.photo,
            {
              left: 197 * sx,
              top: fy(442),
              width: photoW,
              height: photoH,
              borderRadius: photoR,
              borderColor: mint,
              borderWidth: 2 * sx,
            },
          ]}
        >
          <Image
            source={PHOTO_DANIEL}
            style={{
              position: 'absolute',
              height: photoH,
              width: photoW * 2.1438,
              left: -photoW * 0.8172,
              top: -photoH * 0.0127,
            }}
            resizeMode="cover"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark
                  ? 'rgba(16,185,129,0.12)'
                  : 'rgba(175,233,214,0.1)',
              },
            ]}
          />
        </View>

        {/* Behind card (purple) under Daniel card — rotate 11.94° */}
        <View
          style={{
            position: 'absolute',
            left: 30 * sx,
            top: fy(472),
            width: cardW,
            height: cardH,
            borderRadius: cardR,
            backgroundColor: behindPurple,
            transform: [{ rotate: '11.94deg' }],
            shadowColor: mint,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            zIndex: 2,
          }}
        />

        {/* Daniel mint card — rotate 18.53°, ~left 22 top 468 */}
        <View
          style={{
            position: 'absolute',
            left: 22 * sx,
            top: fy(468),
            zIndex: 3,
            transform: [{ rotate: '18.53deg' }],
            shadowColor: mint,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <InfoCard
            accent={mint}
            cardBg={mintCard}
            name="Daniel Okoro"
            username="daniel.okoro"
            phone="+234 801 234 5678"
            dob="12th March, 1996"
            valueColor={valueColor}
            width={cardW}
            height={cardH}
            radius={cardR}
            sx={sx}
          />
        </View>

        {/* Curve connector toward Daniel name */}
        <Image
          source={CURVE_GREEN}
          style={{
            position: 'absolute',
            left: 93 * sx,
            top: fy(619),
            width: 73 * sx,
            height: 74 * sx,
            zIndex: 4,
            transform: [{ scaleY: -1 }, { rotate: '180deg' }],
          }}
          resizeMode="contain"
        />

        {/* Name label Daniel — ~left 48 top 688, rotate 11.87° */}
        <View
          style={{
            position: 'absolute',
            left: 48 * sx,
            top: fy(688),
            zIndex: 5,
            transform: [{ rotate: '11.87deg' }],
          }}
        >
          <Text style={{ color: mint, fontSize: 12 * sx, fontWeight: '400' }}>
            Daniel Okoro
          </Text>
          <View
            style={{
              marginTop: 2 * sx,
              height: 2 * sx,
              width: 73 * sx,
              borderRadius: 18,
              backgroundColor: mint,
            }}
          />
        </View>

        {/* Continue — Figma top:762 */}
        <View
          style={{
            position: 'absolute',
            left: 21 * sx,
            right: 21 * sx,
            top: fy(762),
            zIndex: 20,
            paddingBottom: Math.max(insets.bottom, 8),
          }}
        >
          <PrimaryButton
            title="Continue"
            onPress={() => navigation.navigate('ProfileSetup')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stage: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  photo: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
    backgroundColor: '#E5D8FB',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
