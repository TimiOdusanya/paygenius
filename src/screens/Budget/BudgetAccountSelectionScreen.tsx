import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import { useCreateBudgetMutation } from '@/services/budget/budget.query';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'BudgetAccountSelection'>;

type AccountType = 'paygenius' | 'new';

export function BudgetAccountSelectionScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const { budgetName, amount, period, selectedDate } = route.params;
  const [selected, setSelected] = useState<AccountType>('paygenius');

  const { data: walletData } = useGetWalletQuery();
  const createBudgetMutation = useCreateBudgetMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textPrimary = isDark ? '#FFFFFF' : '#191970';
  const textSecondary = isDark ? '#AAAAAA' : '#858585';
  const unselectedBorder = '#858585';
  const selectedBg = '#191970';
  const unselectedBg = 'transparent';

  const handleContinue = () => {
    if (selected === 'new') {
      navigation.navigate('AddDebitCard');
      return;
    }

    const accountId = walletData?.data?.wallet?._id;
    if (!accountId) {
      Alert.alert('Error', 'No PayGenius account found. Please try again.');
      return;
    }

    navigation.navigate('PleaseWait', {
      budgetName,
      amount,
      period,
      selectedDate,
      accountId,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitles}>
          <Text style={[styles.title, { color: textPrimary, fontSize: fs(16), letterSpacing: -0.32 }]}>
            Account Selection
          </Text>
          <Text style={[styles.subtitle, { color: textSecondary, fontSize: fs(12) }]}>
            Select an account for your Budget
          </Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      {/* Account type toggles */}
      <View style={[styles.toggleRow, { paddingHorizontal: hs(21), marginTop: vs(48) }]}>
        {/* PayGenius account */}
        <Pressable
          onPress={() => setSelected('paygenius')}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: selected === 'paygenius' ? selectedBg : unselectedBg,
              borderColor: selected === 'paygenius' ? selectedBg : unselectedBorder,
              borderWidth: 0.5,
              borderRadius: ms(11),
              height: vs(41),
              flex: 1,
              marginRight: hs(6),
            },
          ]}
        >
          <Text style={[
            styles.toggleBtnText,
            {
              color: selected === 'paygenius' ? '#FFFFFF' : textSecondary,
              fontSize: fs(12),
            },
          ]}>
            PayGenius account
          </Text>
        </Pressable>

        {/* Add new account */}
        <Pressable
          onPress={() => setSelected('new')}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: selected === 'new' ? selectedBg : unselectedBg,
              borderColor: selected === 'new' ? selectedBg : unselectedBorder,
              borderWidth: 0.5,
              borderRadius: ms(11),
              height: vs(41),
              flex: 1,
              marginLeft: hs(6),
            },
          ]}
        >
          <Text style={[
            styles.toggleBtnText,
            {
              color: selected === 'new' ? '#FFFFFF' : textSecondary,
              fontSize: fs(12),
            },
          ]}>
            Add new account
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />

      {/* Continue button */}
      <View style={{ paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <PrimaryButton
          title={createBudgetMutation.isPending ? 'Processing...' : 'Continue'}
          onPress={handleContinue}
          disabled={createBudgetMutation.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 4 },
  headerTitles: { flex: 1, alignItems: 'center' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400', marginTop: 2 },
  toggleRow: { flexDirection: 'row' },
  toggleBtn: { alignItems: 'center', justifyContent: 'center' },
  toggleBtnText: { fontWeight: '400' },
});
