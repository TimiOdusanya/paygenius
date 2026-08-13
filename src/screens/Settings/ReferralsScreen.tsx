import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useAuthStore } from '@/stores';
import { useGetReferralsQuery } from '@/services/settings/settings.query';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import CopyIcon from '../../../assets/images/settings/icon-copy.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Referrals'>;

const STEPS = [
  '1. Share Invitation link/code with friends',
  '2. Friend Transacts during the validity period',
  '3.You’ll receive rewards in your wallet',
];

export function ReferralsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useGetReferralsQuery();
  const referral = data?.data;
  const firstName = user?.firstName ?? 'there';
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#C4B5FD' : '#191970';
  const bodyColor = isDark ? '#AAAAAA' : '#858585';
  const chip = isDark ? '#2A2A2A' : '#EDEDED';
  const accent = isDark ? '#A78BFA' : '#7C3AED';

  const share = async () => {
    if (!referral) return;
    await Share.share({ message: referral.shareMessage });
  };

  const copy = async () => {
    if (!referral?.code) return;
    await Clipboard.setStringAsync(referral.code);
    Alert.alert('Copied', 'Invitation code copied to your clipboard.');
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(20),
        }}
      >
        <ScreenTitleBar title="Referrals" onBack={() => navigation.goBack()} />
      </View>

      {isLoading && !referral ? (
        <ActivityIndicator color="#191970" />
      ) : (
        <View style={{ flex: 1, paddingHorizontal: hs(22) }}>
          <Text
            style={{
              color: bodyColor,
              fontSize: fs(20),
              lineHeight: fs(25),
              letterSpacing: -0.4,
            }}
          >
            Hey <Text style={{ fontWeight: '700', color: titleColor }}>{firstName}</Text>, do you
            know that you can actually Invite your friends and get ₦5000 for each invitation.
          </Text>

          <View style={{ alignItems: 'center', marginTop: vs(28) }}>
            <View
              style={[
                styles.note,
                {
                  width: hs(175),
                  height: vs(76),
                  backgroundColor: '#AFE9D6',
                  borderColor: '#D8C4FA',
                  transform: [{ rotate: '-4deg' }],
                },
              ]}
            />
            <View
              style={[
                styles.note,
                {
                  width: hs(175),
                  height: vs(76),
                  backgroundColor: '#AFE9D6',
                  borderColor: '#D8C4FA',
                  position: 'absolute',
                  top: 10,
                  transform: [{ rotate: '2deg' }],
                },
              ]}
            />
            <View
              style={[
                styles.note,
                {
                  width: hs(175),
                  height: vs(76),
                  backgroundColor: '#AFE9D6',
                  borderColor: '#D8C4FA',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                },
              ]}
            >
              <Text style={{ color: '#FFFFFF', fontSize: fs(30), fontWeight: '500' }}>₦5000</Text>
            </View>
          </View>

          <Text
            style={{
              color: accent,
              fontSize: fs(16),
              fontWeight: '500',
              marginTop: vs(40),
            }}
          >
            How do I Invite my Friends ?
          </Text>
          <View style={{ marginTop: vs(10), gap: 7 }}>
            {STEPS.map((step) => (
              <View
                key={step}
                style={{
                  backgroundColor: chip,
                  height: ms(41),
                  borderRadius: ms(10),
                  justifyContent: 'center',
                  paddingHorizontal: hs(12),
                }}
              >
                <Text style={{ color: bodyColor, fontSize: fs(12) }}>{step}</Text>
              </View>
            ))}
          </View>

          <Text
            style={{
              color: accent,
              fontSize: fs(16),
              fontWeight: '500',
              marginTop: vs(24),
            }}
          >
            My Invitation Code
          </Text>
          <Pressable
            onPress={copy}
            style={{
              backgroundColor: chip,
              height: ms(41),
              borderRadius: ms(10),
              marginTop: vs(6),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Text style={{ color: accent, fontSize: fs(12) }}>{referral?.code ?? '—'}</Text>
            <CopyIcon width={ms(13)} height={ms(12)} />
          </Pressable>

          <Pressable
            onPress={share}
            style={{
              alignSelf: 'center',
              marginTop: vs(28),
              width: hs(256),
              height: 54,
              borderRadius: 53,
              backgroundColor: isDark ? '#7C3AED' : '#191970',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: fs(12), fontWeight: '600' }}>Share</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  note: {
    borderWidth: 4,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
});
