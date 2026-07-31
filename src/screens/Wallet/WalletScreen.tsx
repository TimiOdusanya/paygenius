import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';

type Props = BottomTabScreenProps<MainTabParamList, 'WalletTab'> & {
  navigation: CompositeNavigationProp<
    BottomTabScreenProps<MainTabParamList, 'WalletTab'>['navigation'],
    NativeStackNavigationProp<RootStackParamList>
  >;
};

/** Stable dot positions (no Math.random in render) */
const CARD_DOTS = Array.from({ length: 8 }, (_, row) =>
  Array.from({ length: 12 }, (__, col) => ({
    left: col * 30 + (row % 2) * 15,
    top: row * 22,
    opacity: ((row * 3 + col) % 5) / 8 + 0.2,
  }))
).flat();

function PayGeniusCard({
  accountNumber,
  width,
  height,
  ms,
  fs,
}: {
  accountNumber: string;
  width: number;
  height: number;
  ms: (n: number) => number;
  fs: (n: number) => number;
}) {
  const lastFour = accountNumber?.slice(-4) || '2468';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          width,
          height,
          borderRadius: ms(12),
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 6,
        },
      ]}
    >
      <LinearGradient
        colors={['#14145A', '#632EB2']}
        start={{ x: 0.01, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}>
        {CARD_DOTS.map((dot, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#00E5E5',
              left: dot.left,
              top: dot.top,
              opacity: dot.opacity,
            }}
          />
        ))}
      </View>

      <View style={{ flex: 1, padding: ms(16), justifyContent: 'space-between' }}>
        <Text style={[styles.cardBrand, { color: '#FFFFFF', fontSize: fs(14) }]}>
          PayGenius
        </Text>
        <View style={styles.cardBottom}>
          <Text style={{ color: '#FFFFFF', fontSize: fs(18), fontWeight: '500', letterSpacing: -0.36 }}>
            <Text style={{ fontSize: fs(18) }}>{'**** **** **** '}</Text>
            <Text style={{ fontSize: fs(14), fontWeight: '400' }}>{lastFour}</Text>
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: fs(16), fontWeight: '600', letterSpacing: 0.48 }}>
            VISA
          </Text>
        </View>
      </View>
    </View>
  );
}

export function WalletScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms, width } = useResponsive();
  const { data: walletData } = useGetWalletQuery();

  const wallet = walletData?.data?.wallet;
  const accountNumber = wallet?.virtualAccountNumber ?? '0000002468';

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textPrimary = isDark ? '#FFFFFF' : '#191970';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const sectionLabel = isDark ? '#FFFFFF' : '#1A1D23';
  const linkedBorder = isDark ? '#444444' : '#858585';
  const linkedBg = isDark ? '#1E1E2E' : '#FFFFFF';
  const addBtnColor = isDark ? '#7C7CEA' : '#191970';

  const cardWidth = Math.min(hs(322), width - hs(42));
  const cardHeight = vs(172);

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(12) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
            Account Selection
          </Text>
          <Text style={[styles.subtitle, { color: textSecondary, fontSize: fs(12), marginTop: vs(2) }]}>
            Kindly add your account
          </Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(21),
          paddingBottom: Math.max(insets.bottom, vs(16)),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: vs(8) }}>
          <Text style={[styles.sectionTitle, { color: sectionLabel, fontSize: fs(16) }]}>
            Default Account
          </Text>
          <Text style={[styles.sectionSub, { color: textSecondary, fontSize: fs(10) }]}>
            Alternative Accounts
          </Text>
        </View>

        <View style={{ marginTop: vs(12), alignItems: 'center' }}>
          <PayGeniusCard
            accountNumber={accountNumber}
            width={cardWidth}
            height={cardHeight}
            ms={ms}
            fs={fs}
          />
        </View>

        <View style={{ marginTop: vs(16) }}>
          <Text style={[styles.sectionTitle, { color: sectionLabel, fontSize: fs(16) }]}>
            Linked accounts
          </Text>
          <Text style={[styles.sectionSub, { color: textSecondary, fontSize: fs(10) }]}>
            Alternative Accounts
          </Text>
        </View>

        <View
          style={[
            styles.linkedRow,
            {
              backgroundColor: linkedBg,
              borderColor: linkedBorder,
              borderWidth: 0.4,
              borderRadius: ms(12),
              height: vs(72),
              marginTop: vs(8),
              paddingHorizontal: hs(16),
            },
          ]}
        >
          <View
            style={[
              styles.bankLogo,
              {
                width: ms(36),
                height: ms(36),
                borderRadius: ms(18),
                borderWidth: 0.3,
                borderColor: isDark ? '#888' : '#1A1D23',
                backgroundColor: isDark ? '#2A2A2A' : '#FFF5EC',
                marginRight: hs(12),
              },
            ]}
          >
            <Ionicons name="business-outline" size={ms(18)} color={textSecondary} />
          </View>
          <Text style={[styles.bankName, { color: sectionLabel, fontSize: fs(14) }]}>
            Access Bank
          </Text>
        </View>

        <View style={[styles.addBtnRow, { marginTop: vs(12) }]}>
          <Pressable
            onPress={() => (navigation as any).navigate('AddDebitCard')}
            style={[
              styles.addBtn,
              {
                borderColor: addBtnColor,
                borderWidth: 1,
                borderRadius: ms(8),
                height: vs(34),
                paddingHorizontal: hs(10),
              },
            ]}
          >
            <Ionicons name="wallet-outline" size={ms(18)} color={addBtnColor} />
            <Text style={[styles.addBtnText, { color: addBtnColor, fontSize: fs(10), letterSpacing: 0.4 }]}>
              Add debit card +
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <PrimaryButton title="Continue" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontWeight: '600', textAlign: 'center' },
  subtitle: { fontWeight: '400', textAlign: 'center' },
  sectionTitle: { fontWeight: '500' },
  sectionSub: { fontWeight: '400', marginTop: 2 },
  cardContainer: {},
  cardBrand: { fontWeight: '400' },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  linkedRow: { flexDirection: 'row', alignItems: 'center' },
  bankLogo: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bankName: { fontWeight: '400' },
  addBtnRow: { alignItems: 'flex-end' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addBtnText: { fontWeight: '400' },
});
