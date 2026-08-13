import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Transaction } from '@/types';
import IconFood from '../../../assets/images/analytics/icon-food.svg';
import IconData from '../../../assets/images/analytics/icon-data.svg';
import IconGrocery from '../../../assets/images/analytics/icon-grocery.svg';

const MERCHANT_FOOD = require('../../../assets/images/analytics/merchant-food.png');
const MERCHANT_FOOD_ALT = require('../../../assets/images/analytics/merchant-food-alt.png');
const MERCHANT_FUEL = require('../../../assets/images/analytics/merchant-fuel.png');
const MERCHANT_DATA = require('../../../assets/images/analytics/merchant-data.png');

const TX_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  FOOD: 'fast-food-outline',
  GROCERIES: 'cart-outline',
  DATA: 'wifi-outline',
  TRANSPORTATION: 'car-outline',
  FUEL: 'flame-outline',
  UTILITY: 'flash-outline',
  ENTERTAINMENT: 'film-outline',
  TRANSFER: 'swap-horizontal-outline',
  default: 'receipt-outline',
};

function formatAmount(amount: number, type: string): string {
  const sign = type === 'CREDIT' ? '+' : '-';
  return `${sign}${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr)
    .toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace(' ', '')
    .toLowerCase();
}

function CategoryGlyph({
  cat,
  size,
}: {
  cat: string;
  size: number;
}) {
  if (cat === 'FOOD') return <IconFood width={size} height={size * 0.9} />;
  if (cat === 'DATA') return <IconData width={size} height={size} />;
  if (cat === 'GROCERIES') return <IconGrocery width={size} height={size} />;
  if (cat === 'FUEL' || cat === 'TRANSPORTATION') {
    return <Ionicons name="flame-outline" size={size} color="#6D6D8C" />;
  }
  return null;
}

type Props = {
  tx: Transaction;
  isDark: boolean;
  ms: (n: number) => number;
  fs: (n: number) => number;
  hs: (n: number) => number;
};

export function HomeTransactionRow({ tx, isDark, ms, fs, hs }: Props) {
  const cat = tx.category?.toUpperCase() || 'default';
  const iconName = TX_ICONS[cat] || TX_ICONS.default;
  const merchantImage =
    cat === 'FUEL' || cat === 'TRANSPORTATION'
      ? MERCHANT_FUEL
      : cat === 'DATA'
        ? MERCHANT_DATA
        : cat === 'FOOD'
          ? MERCHANT_FOOD
          : cat === 'GROCERIES'
            ? MERCHANT_FOOD_ALT
            : null;
  const rowBg = isDark ? '#1E1E2E' : '#EDEDED';
  const textColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#AAAAAA' : '#6D6D8C';
  const amtColor = tx.type === 'CREDIT' ? '#10B981' : '#FF4D4F';

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: rowBg,
          borderRadius: ms(8),
          height: ms(58),
          paddingHorizontal: hs(18),
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            width: ms(34),
            height: ms(30),
            borderRadius: ms(6),
            overflow: 'hidden',
            backgroundColor: isDark ? '#2A2A3E' : '#FFFFFF',
          },
        ]}
      >
        {merchantImage ? (
          <Image
            source={merchantImage}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Ionicons
            name={iconName}
            size={ms(16)}
            color={isDark ? '#A78BFA' : '#7C3AED'}
          />
        )}
      </View>
      <View style={{ flex: 1, marginLeft: hs(10) }}>
        <Text
          style={[styles.merchant, { color: textColor, fontSize: fs(10) }]}
          numberOfLines={1}
        >
          {tx.merchant || tx.description || 'Transaction'}
        </Text>
        <View style={styles.categoryRow}>
          <CategoryGlyph cat={cat} size={ms(9)} />
          <Text style={[styles.category, { color: subColor, fontSize: fs(8) }]}>
            {tx.category}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.time, { color: '#79787A', fontSize: fs(8) }]}>
          {formatTime(tx.createdAt)}
        </Text>
        <Text
          style={[
            styles.amount,
            { color: amtColor, fontSize: fs(10), letterSpacing: 0.4 },
          ]}
        >
          {formatAmount(tx.amount, tx.type)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  merchant: { fontWeight: '400' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  category: { fontWeight: '400' },
  time: { fontWeight: '400' },
  amount: { fontWeight: '400', marginTop: 2 },
});
