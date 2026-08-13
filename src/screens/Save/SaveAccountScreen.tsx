import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { BankCard } from '@/components/BankCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useGetLinkedCardsQuery } from '@/services/savings/savings.query';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';

type Props = NativeStackScreenProps<RootStackParamList, 'SaveAccount'>;

export function SaveAccountScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const draft = route.params;
  const isPaygenius = draft.sourceType === 'PAYGENIUS';

  const { data: walletData } = useGetWalletQuery();
  const { data: cardsData } = useGetLinkedCardsQuery({ enabled: !isPaygenius });
  const cards = cardsData?.data?.cards ?? [];
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCardId && cards[0]?._id) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';
  const last4 = walletData?.data?.wallet?.virtualAccountNumber?.slice(-4) || '2468';

  const handleContinue = () => {
    navigation.navigate('SavePleaseWait', {
      ...draft,
      linkedAccountId: selectedCardId ?? undefined,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.titles}>
          <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600' }}>
            {isPaygenius ? 'PayGenius wallet' : 'Add Account'}
          </Text>
          <Text style={{ color: subColor, fontSize: fs(12), marginTop: 2 }}>
            {isPaygenius ? 'Save from PayGenius' : 'Kindly add your account'}
          </Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        horizontal={!isPaygenius && cards.length > 1}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: vs(40),
          paddingHorizontal: hs(40),
          alignItems: 'center',
          gap: hs(12),
        }}
      >
        {isPaygenius ? (
          <BankCard title="PayGenius" last4={last4} />
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <Pressable key={card._id} onPress={() => setSelectedCardId(card._id)}>
              <View style={selectedCardId === card._id ? styles.selected : undefined}>
                <BankCard title="Other Banks" last4={card.last4} brand={card.brand} />
              </View>
            </Pressable>
          ))
        ) : (
          <BankCard title="Other Banks" last4="2468" />
        )}
      </ScrollView>

      {!isPaygenius ? (
        <View style={{ alignItems: 'flex-end', paddingHorizontal: hs(21), marginTop: vs(24) }}>
          <Pressable
            onPress={() => navigation.navigate('AddDebitCard', { saveDraft: draft })}
            style={[
              styles.addBtn,
              {
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                borderColor: isDark ? '#3B3B3B' : '#E5E5E5',
              },
            ]}
          >
            <Ionicons name="wallet-outline" size={ms(20)} color={isDark ? '#FFFFFF' : '#191970'} />
            <Text style={{ color: isDark ? '#FFFFFF' : '#191970', fontSize: fs(12), marginLeft: 4 }}>
              Add debit card +
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: hs(22), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!isPaygenius && !selectedCardId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center' },
  titles: { flex: 1, alignItems: 'center' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  selected: {
    transform: [{ scale: 1.02 }],
  },
});
