import React from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { ReceiptDetailRow } from '@/components/ReceiptDetailRow';
import LogoMark from '../../../assets/images/bills/logo-paygenius.svg';
import { formatNaira, formatReceiptDate, formatReceiptTime } from './transfer.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferReceipt'>;

export function TransferReceiptScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const transfer = route.params.transfer;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const amountColor = isDark ? '#FFFFFF' : '#03055B';
  const statusColor = isDark ? '#CCCCCC' : '#000000';
  const footerColor = isDark ? '#CCCCCC' : '#000000';
  const accent = '#7C3AED';

  const shareReceipt = async () => {
    const message = [
      'PayGenius Transfer',
      `${formatNaira(transfer.amount)} · Successful`,
      transfer.recipientName ? `To: ${transfer.recipientName}` : null,
      transfer.recipientAccount ? `Account: ${transfer.recipientAccount}` : null,
      transfer.bankName ? `Bank: ${transfer.bankName}` : null,
      `Transaction no: ${transfer.reference}`,
      transfer.sourceLabel ? `From: ${transfer.sourceLabel}` : null,
      transfer.note ? `Note: ${transfer.note}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await Share.share({ message });
    } catch {
      Alert.alert('Share', 'Could not open the share sheet.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24), zIndex: 2 }}>
        <ScreenTitleBar title="" onBack={() => navigation.navigate('Main')} />
      </View>

      <View pointerEvents="none" style={styles.watermarkLayer}>
        {Array.from({ length: 8 }).map((_, row) => (
          <View key={row} style={[styles.watermarkRow, { top: vs(80 + row * 70) }]}>
            {Array.from({ length: 4 }).map((__, col) => (
              <Text
                key={col}
                style={[
                  styles.watermark,
                  {
                    color: isDark ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.08)',
                    fontSize: fs(18),
                  },
                ]}
              >
                PayGenius
              </Text>
            ))}
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(21),
          paddingTop: vs(8),
          paddingBottom: Math.max(insets.bottom, vs(24)),
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.logoCircle,
            {
              width: ms(74),
              height: ms(74),
              borderRadius: ms(37),
              borderWidth: 4,
              borderColor: '#D8C4FA',
              backgroundColor: '#191970',
              marginTop: vs(12),
            },
          ]}
        >
          <LogoMark width={ms(34)} height={ms(34)} />
        </View>

        <Text style={[styles.amount, { color: amountColor, fontSize: fs(20), marginTop: vs(30) }]}>
          {formatNaira(transfer.amount)}
        </Text>
        <Text style={[styles.status, { color: statusColor, fontSize: fs(10), marginTop: vs(5) }]}>
          Successful
        </Text>

        <View style={{ width: '100%', marginTop: vs(48), gap: vs(22), paddingHorizontal: hs(8) }}>
          {transfer.recipientAccount ? (
            <ReceiptDetailRow label="Account Number" value={transfer.recipientAccount} />
          ) : null}
          {transfer.recipientName ? (
            <ReceiptDetailRow label="Name" value={transfer.recipientName} />
          ) : null}
          {transfer.bankName ? <ReceiptDetailRow label="Bank" value={transfer.bankName} /> : null}
          {transfer.note ? <ReceiptDetailRow label="Description" value={transfer.note} /> : null}
          <ReceiptDetailRow
            label="Transaction no"
            value={transfer.reference}
            onCopy={async () => {
              try {
                await Share.share({ message: transfer.reference });
              } catch {
                Alert.alert('Transaction no', transfer.reference);
              }
            }}
          />
          <ReceiptDetailRow label="Amount" value={formatNaira(transfer.amount)} />
          {transfer.sourceLabel ? (
            <ReceiptDetailRow label="Payment Method" value={transfer.sourceLabel} />
          ) : null}
          <ReceiptDetailRow label="Date" value={formatReceiptDate(transfer.createdAt)} />
          <ReceiptDetailRow label="Time" value={formatReceiptTime(transfer.createdAt)} />
        </View>

        <Text
          style={[
            styles.footer,
            {
              color: footerColor,
              fontSize: fs(10),
              marginTop: vs(28),
              paddingHorizontal: hs(8),
              lineHeight: fs(15),
            },
          ]}
        >
          If you have any questions or would like more information, please call our 24-hour Contact
          Centre on 0700 9000000, or send an email to{' '}
          <Text style={{ color: accent }}>info@getpaygenius.com</Text>
          {'\n'}Thank you for choosing <Text style={{ color: accent }}>PayGenius</Text>.
        </Text>

        <Pressable
          onPress={shareReceipt}
          style={[
            styles.share,
            { width: hs(172), height: vs(50), borderRadius: ms(39), marginTop: vs(24) },
          ]}
        >
          <Text style={[styles.shareText, { fontSize: fs(12) }]}>Share</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  watermarkLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  watermarkRow: {
    position: 'absolute',
    left: -20,
    right: -20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    transform: [{ rotate: '-21deg' }],
  },
  watermark: {
    fontWeight: '600',
  },
  logoCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  amount: {
    fontWeight: '400',
  },
  status: {
    fontWeight: '400',
  },
  footer: {
    fontWeight: '400',
    letterSpacing: 0.4,
    textAlign: 'left',
    width: '100%',
  },
  share: {
    backgroundColor: '#191970',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
