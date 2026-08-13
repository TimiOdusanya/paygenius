import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { BackButton } from '@/components/BackButton';
import { LinkedWalletRow } from '@/components/LinkedWalletRow';
import { EmptyState } from '@/components/EmptyState';
import {
  useDeleteLinkedCardMutation,
  useGetLinkedCardsQuery,
} from '@/services/savings/savings.query';

type Props = BottomTabScreenProps<MainTabParamList, 'WalletTab'> & {
  navigation: CompositeNavigationProp<
    BottomTabScreenProps<MainTabParamList, 'WalletTab'>['navigation'],
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export function WalletScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { data } = useGetLinkedCardsQuery();
  const deleteCard = useDeleteLinkedCardMutation();
  const cards = data?.data?.cards ?? [];

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const addColor = isDark ? '#7C7CEA' : '#191970';

  const unlink = (id: string, name: string) => {
    Alert.alert('Unlink wallet', `Remove ${name} from your linked wallets?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unlink',
        style: 'destructive',
        onPress: () => deleteCard.mutate(id),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(24) }]}>
        <BackButton onPress={() => navigation.navigate('HomeTab')} />
        <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
          Wallets
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(22),
          paddingTop: vs(16),
          paddingBottom: vs(24),
          gap: vs(11),
        }}
        showsVerticalScrollIndicator={false}
      >
        {cards.length === 0 ? (
          <View style={{ marginTop: vs(40) }}>
            <EmptyState
              variant="transactions"
              title="No wallets yet"
              subtitle="Link a debit card to see it here."
            />
          </View>
        ) : (
          cards.map((card) => (
            <LinkedWalletRow
              key={card._id}
              name={card.brand && card.brand !== 'VISA' ? card.brand : card.accountName}
              onDelete={() => unlink(card._id, card.accountName)}
            />
          ))
        )}

        <Pressable
          onPress={() => navigation.navigate('AddDebitCard')}
          style={[styles.addBtn, { borderColor: addColor, borderRadius: ms(8), height: vs(34) }]}
        >
          <Ionicons name="wallet-outline" size={ms(18)} color={addColor} />
          <Text style={[styles.addText, { color: addColor, fontSize: fs(10), letterSpacing: 0.4 }]}>
            Add debit card +
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '600', textAlign: 'center' },
  addBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  addText: { fontWeight: '400' },
});
