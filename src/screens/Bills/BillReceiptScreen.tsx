import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { ReceiptDetailRow } from '@/components/ReceiptDetailRow';
import { formatNaira, formatReceiptDate, formatReceiptTime, localBillerLogo } from './bills.helpers';
import LogoMark from '../../../assets/images/bills/logo-paygenius.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'BillReceipt'>;

export function BillReceiptScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const payment = route.params.payment;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const amountColor = isDark ? '#FFFFFF' : '#03055B';
  const statusColor = isDark ? '#CCCCCC' : '#000000';
  const footerColor = isDark ? '#CCCCCC' : '#000000';
  const accent = '#7C3AED';
  const logo = localBillerLogo(payment.billerCode);

  const recipientLabel =
    payment.category === 'ELECTRICITY'
      ? 'Meter Number'
      : payment.category === 'TELEVISION'
        ? 'Smartcard Number'
        : 'Recipient Number';

  const shareReceipt = async () => {
    const message = [
      `PayGenius ${payment.description}`,
      `${formatNaira(payment.amount)} · Successful`,
      `${recipientLabel}: ${payment.customerId}`,
      payment.customerName ? `Name: ${payment.customerName}` : null,
      payment.planName ? `Data Bundle: ${payment.planName}` : null,
      payment.token ? `Token: ${payment.token}` : null,
      payment.units ? `Units: ${payment.units}` : null,
      `Transaction no: ${payment.reference}`,
      `Payment Method: ${payment.paymentMethodLabel}`,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await Share.share({ message });
    } catch {
      Alert.alert('Share', 'Could not open the share sheet.');
    }
  };

  const copyRef = async () => {
    try {
      await Share.share({ message: payment.reference });
    } catch {
      Alert.alert('Transaction no', payment.reference);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24), zIndex: 2 }}>
        <ScreenTitleBar title="" onBack={() => navigation.navigate('PayBills')} />
      </View>

      <View pointerEvents="none" style={styles.watermarkLayer}>
        {Array.from({ length: 8 }).map((_, row) => (
          <View key={row} style={[styles.watermarkRow, { top: vs(80 + row * 70) }]}>
            {Array.from({ length: 4 }).map((__, col) => (
              <Text
                key={col}
                style={[
                  styles.watermark,
                  { color: isDark ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.08)', fontSize: fs(18) },
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
          {logo ? (
            <Image source={logo} style={{ width: ms(55), height: ms(55), borderRadius: ms(28) }} />
          ) : (
            <LogoMark width={ms(34)} height={ms(34)} />
          )}
        </View>

        <Text
          style={[
            styles.amount,
            { color: amountColor, fontSize: fs(20), marginTop: vs(30) },
          ]}
        >
          {formatNaira(payment.amount)}
        </Text>
        <Text style={[styles.status, { color: statusColor, fontSize: fs(10), marginTop: vs(5) }]}>
          Successful
        </Text>

        <View style={{ width: '100%', marginTop: vs(48), gap: vs(22), paddingHorizontal: hs(8) }}>
          <ReceiptDetailRow label={recipientLabel} value={payment.customerId} />
          {payment.customerName &&
          (payment.category === 'ELECTRICITY' || payment.category === 'TELEVISION') ? (
            <ReceiptDetailRow label="Name" value={payment.customerName} />
          ) : null}
          <ReceiptDetailRow label="Description" value={payment.description} />
          {payment.planName ? (
            <ReceiptDetailRow
              label={payment.category === 'TELEVISION' ? 'Bouquet' : 'Data Bundle'}
              value={payment.planName}
            />
          ) : null}
          {payment.token ? (
            <ReceiptDetailRow
              label="Token"
              value={payment.token}
              onCopy={async () => {
                try {
                  await Share.share({ message: payment.token! });
                } catch {
                  Alert.alert('Token', payment.token);
                }
              }}
            />
          ) : null}
          {payment.units ? <ReceiptDetailRow label="Units" value={payment.units} /> : null}
          <ReceiptDetailRow
            label="Transaction no"
            value={payment.reference}
            onCopy={copyRef}
          />
          <ReceiptDetailRow label="Amount" value={formatNaira(payment.amount)} />
          <ReceiptDetailRow label="Payment Method" value={payment.paymentMethodLabel} />
          <ReceiptDetailRow label="Date" value={formatReceiptDate(payment.createdAt)} />
          <ReceiptDetailRow label="Time" value={formatReceiptTime(payment.createdAt)} />
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
          {'\n'}Banking with <Text style={{ color: accent }}>PayGenius</Text>: Branch | ATM | Online
          | Mobile | Contact centre
        </Text>

        <Pressable
          onPress={shareReceipt}
          style={[
            styles.share,
            {
              width: hs(172),
              height: vs(50),
              borderRadius: ms(39),
              marginTop: vs(24),
            },
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
    borderWidth: 0.5,
    borderColor: '#03055B',
  },
  shareText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
