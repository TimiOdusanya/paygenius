import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { EmptyState } from '@/components/EmptyState';
import { useGetMonthTransactionsQuery } from '@/services/home/home.query';
import type { Transaction } from '@/types';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'StatementLog'>;

function formatAmount(amount: number, type: Transaction['type']) {
  const sign = type === 'CREDIT' ? '+' : '-';
  return `${sign}₦${Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function StatementScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const { data, isLoading } = useGetMonthTransactionsQuery(cursor.month, cursor.year);
  const txs = data?.data?.transactions ?? [];
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#AAAAAA' : '#858585';
  const border = isDark ? '#4A4A4A' : '#858585';
  const label = new Date(cursor.year, cursor.month - 1, 1).toLocaleDateString('en-NG', {
    month: 'long',
    year: 'numeric',
  });

  const shift = (delta: number) => {
    const date = new Date(cursor.year, cursor.month - 1 + delta, 1);
    setCursor({ month: date.getMonth() + 1, year: date.getFullYear() });
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(20),
          marginBottom: vs(16),
        }}
      >
        <ScreenTitleBar title="Statement and Expense log" onBack={() => navigation.goBack()} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: hs(20),
          marginBottom: vs(12),
        }}
      >
        <Pressable onPress={() => shift(-1)} hitSlop={8}>
          <Text style={{ color: '#7C3AED', fontSize: fs(14) }}>‹</Text>
        </Pressable>
        <Text style={{ color: titleColor, fontSize: fs(14), fontWeight: '500' }}>{label}</Text>
        <Pressable onPress={() => shift(1)} hitSlop={8}>
          <Text style={{ color: '#7C3AED', fontSize: fs(14) }}>›</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: hs(20), marginBottom: vs(12) }}>
        <Text style={{ color: subColor, fontSize: fs(10) }}>
          In ₦{(data?.data?.amountIn ?? 0).toLocaleString('en-NG')} · Out ₦
          {(data?.data?.amountOut ?? 0).toLocaleString('en-NG')}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#191970" />
      ) : (
        <FlatList
          data={txs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            paddingHorizontal: hs(20),
            paddingBottom: insets.bottom + vs(24),
            flexGrow: 1,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <EmptyState
              variant="transactions"
              title="No activity this month"
              subtitle="Fund your wallet or pay a bill to see it here."
            />
          }
          renderItem={({ item }) => (
            <View
              style={{
                minHeight: ms(58),
                borderWidth: 0.5,
                borderColor: border,
                borderRadius: 8,
                paddingHorizontal: hs(16),
                justifyContent: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: titleColor, fontSize: fs(14), flex: 1 }} numberOfLines={1}>
                  {item.merchant || item.description || item.category}
                </Text>
                <Text
                  style={{
                    color: item.type === 'CREDIT' ? '#10B981' : titleColor,
                    fontSize: fs(12),
                    marginLeft: 8,
                  }}
                >
                  {formatAmount(item.amount, item.type)}
                </Text>
              </View>
              <Text style={{ color: subColor, fontSize: fs(8), marginTop: 4 }}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  : item.status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
