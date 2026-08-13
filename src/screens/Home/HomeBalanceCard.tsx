import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CopyIcon from '../../../assets/images/home/copy.svg';
import EyeToggle from '../../../assets/images/home/eye-toggle.svg';
import WalletAdd from '../../../assets/images/home/wallet-add.svg';
import EmptyWallet from '../../../assets/images/home/empty-wallet.svg';
import PayArrow from '../../../assets/images/home/pay-arrow.svg';

const CARD_BG = require('../../../assets/images/home/balance-dots.png');

type Props = {
  accountNumber: string;
  balanceLabel: string;
  onToggleBalance: () => void;
  onPayBills?: () => void;
  hs: (n: number) => number;
  fs: (n: number) => number;
  ms: (n: number) => number;
};

export function HomeBalanceCard({
  accountNumber,
  balanceLabel,
  onToggleBalance,
  onPayBills,
  hs,
  fs,
  ms,
}: Props) {
  const btnW = hs(137);

  const radius = ms(10);

  return (
    <View style={[styles.card, { height: ms(152), borderRadius: radius }]}>
      <Image
        source={CARD_BG}
        fadeDuration={0}
        resizeMode="stretch"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, backgroundColor: 'transparent' },
        ]}
      />

      <View style={[styles.accountRow, { paddingTop: 14, paddingRight: hs(25) }]}>
        <Text style={[styles.accountId, { fontSize: fs(10) }]} numberOfLines={1}>
          {accountNumber}
        </Text>
        <CopyIcon width={ms(13)} height={ms(12)} />
      </View>

      <Pressable onPress={onToggleBalance} style={styles.balanceRow}>
        <Text
          style={[styles.balanceText, { fontSize: fs(32), lineHeight: fs(36) }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {balanceLabel}
        </Text>
        <EyeToggle width={ms(20)} height={ms(18)} />
      </Pressable>

      <View style={[styles.btnsRow, { paddingHorizontal: hs(24), paddingBottom: 14 }]}>
        <Pressable style={[styles.btn, { width: btnW, borderColor: '#F5F5F5' }]}>
          <WalletAdd width={ms(24)} height={ms(24)} />
          <Text style={[styles.btnText, { color: '#FFFFFF', fontSize: fs(10) }]}>
            Transfer +
          </Text>
        </Pressable>
        <Pressable
          onPress={onPayBills}
          style={[styles.btn, { width: btnW, borderColor: '#00E5E5' }]}
        >
          <EmptyWallet width={ms(24)} height={ms(24)} />
          <Text style={[styles.btnText, { color: '#00E5E5', fontSize: fs(10) }]}>
            Pay Bills
          </Text>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <PayArrow width={ms(9)} height={ms(11)} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  accountId: {
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 22,
    paddingLeft: 16,
    paddingRight: 48,
  },
  balanceText: {
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: -0.64,
  },
  btnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  btn: {
    height: 34,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  btnText: {
    fontWeight: '400',
    letterSpacing: 0.4,
  },
});
