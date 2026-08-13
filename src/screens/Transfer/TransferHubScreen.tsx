import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useGetBanksQuery } from '@/services/verify/verify.query';
import type { Bank } from '@/services/verify/verify.type';
import { BankLogo, bankLogoUri } from '@/components/BankLogo';
import SearchIcon from '../../../assets/images/transfer/icon-search.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferHub'>;

export function TransferHubScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [query, setQuery] = React.useState('');
  const { data, isLoading } = useGetBanksQuery();
  const banks = data?.data?.banks ?? [];
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const active = banks.filter((bank) => bank.active !== false);
    if (!q) return active;
    return active.filter((bank) => bank.name.toLowerCase().includes(q));
  }, [banks, query]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const sectionColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#E0E0E0' : '#858585';
  const rowColor = isDark ? '#858585' : '#353535';
  const searchBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const searchBorder = isDark ? '#4A4A4A' : '#E5E5E5';
  const paygeniusBg = isDark ? 'rgba(25,25,112,0.3)' : '#EDEDED';
  const paygeniusColor = isDark ? '#FFFFFF' : '#292D32';

  const openPayGenius = () => {
    navigation.navigate('TransferDetails', {
      rail: 'PAYGENIUS',
      paymentSource: route.params?.source ?? 'WALLET',
      budgetId: route.params?.budgetId,
      budgetName: route.params?.budgetName,
    });
  };

  const openBank = (bank: Bank) => {
    navigation.navigate('TransferDetails', {
      rail: 'BANK',
      bankCode: bank.code,
      bankName: bank.name,
      bankLogo: bankLogoUri(bank),
      paymentSource: route.params?.source ?? 'WALLET',
      budgetId: route.params?.budgetId,
      budgetName: route.params?.budgetName,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24) }}>
        <ScreenTitleBar
          title="Make Transfers"
          subtitle="Select an account"
          onBack={() => navigation.goBack()}
        />
      </View>

      <Pressable
        onPress={openPayGenius}
        style={[
          styles.paygenius,
          {
            marginHorizontal: hs(24),
            marginTop: vs(48),
            height: vs(62),
            borderRadius: ms(12),
            backgroundColor: paygeniusBg,
          },
        ]}
      >
        <BankLogo paygenius size={ms(28)} />
        <Text style={{ color: paygeniusColor, fontSize: fs(12), fontWeight: '400' }}>
          PayGenius
        </Text>
      </Pressable>

      <View style={{ paddingHorizontal: hs(25), marginTop: vs(48) }}>
        <Text
          style={{
            color: sectionColor,
            fontSize: fs(16),
            fontWeight: '500',
            letterSpacing: -0.32,
          }}
        >
          Other Banks
        </Text>
        <Text style={{ color: subColor, fontSize: fs(10), marginTop: vs(4) }}>
          Search for other banks
        </Text>
      </View>

      <View
        style={[
          styles.search,
          {
            marginTop: vs(14),
            marginHorizontal: hs(48),
            height: vs(37),
            borderRadius: vs(18.5),
            backgroundColor: searchBg,
            borderColor: searchBorder,
            paddingHorizontal: hs(16),
          },
        ]}
      >
        <SearchIcon width={ms(12)} height={ms(12)} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor="#C4C4C4"
          style={[styles.searchInput, { color: rowColor, fontSize: fs(10), marginLeft: hs(8) }]}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color="#191970" style={{ marginTop: vs(32) }} />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: hs(28),
            paddingTop: vs(24),
            paddingBottom: Math.max(insets.bottom, vs(24)),
            gap: vs(14),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((bank) => (
            <Pressable key={`${bank.code}-${bank.slug}`} onPress={() => openBank(bank)} style={styles.row}>
              <BankLogo uri={bankLogoUri(bank)} size={ms(38)} />
              <Text
                numberOfLines={1}
                style={[styles.bankName, { color: rowColor, fontSize: fs(12), marginLeft: hs(4) }]}
              >
                {bank.name}
              </Text>
            </Pressable>
          ))}
          {filtered.length === 0 ? (
            <Text style={{ color: subColor, fontSize: fs(12), textAlign: 'center', marginTop: vs(24) }}>
              No banks match that search.
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paygenius: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontWeight: '400',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
  },
  bankName: {
    flex: 1,
    fontWeight: '400',
  },
});
