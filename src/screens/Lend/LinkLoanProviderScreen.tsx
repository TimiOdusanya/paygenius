import React from 'react';
import {
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
import { Header } from '@/components/Header';
import { useGetLoanProvidersQuery } from '@/services/loans/loans.query';
import SearchIcon from '../../../assets/images/lend/search.svg';
import BankIcon from '../../../assets/images/lend/bank-icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkLoanProvider'>;

export function LinkLoanProviderScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [query, setQuery] = React.useState('');
  const { data } = useGetLoanProvidersQuery(query);
  const providers = data?.data?.providers ?? [];

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const searchBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const searchBorder = isDark ? '#3B3B3B' : '#E5E5E5';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const nameColor = isDark ? '#E0E0E0' : '#353535';

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(12) }}>
        <Header
          onBack={() => navigation.goBack()}
          title="Link Loan Provider"
          description="Select your Loan Provider"
        />
      </View>

      <View
        style={[
          styles.search,
          {
            marginHorizontal: hs(25),
            marginTop: vs(12),
            height: vs(37),
            borderRadius: ms(20),
            backgroundColor: searchBg,
            borderColor: searchBorder,
            paddingHorizontal: hs(16),
          },
        ]}
      >
        <SearchIcon width={ms(10)} height={ms(10)} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Access"
          placeholderTextColor="rgba(133,133,133,0.6)"
          style={[styles.searchInput, { color: textColor, fontSize: fs(10), marginLeft: hs(8) }]}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(28),
          paddingTop: vs(16),
          paddingBottom: Math.max(insets.bottom, vs(24)),
          gap: vs(14),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {providers.map((provider) => (
          <Pressable
            key={provider.code}
            onPress={() =>
              navigation.navigate('LinkLoanAccount', {
                providerCode: provider.code,
                providerName: provider.name,
              })
            }
            style={styles.row}
          >
            <BankIcon width={ms(38)} height={ms(38)} />
            <Text style={[styles.name, { color: nameColor, fontSize: fs(12), marginLeft: hs(4) }]}>
              {provider.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.6,
  },
  searchInput: { flex: 1, padding: 0 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontWeight: '400', flex: 1 },
});
