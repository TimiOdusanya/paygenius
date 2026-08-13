import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import BankIcon from '../../assets/images/transfer/icon-bank.svg';
import PayGeniusLogo from '../../assets/images/bills/logo-paygenius.svg';

type Props = {
  uri?: string | null;
  size: number;
  paygenius?: boolean;
};

export function bankLogoUri(bank?: {
  logo?: string;
  slug?: string;
  name?: string;
} | null) {
  if (bank?.logo && !bank.logo.includes('default-image')) return bank.logo;
  const slug = (bank?.slug || bank?.name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug ? `https://nigerianbanks.xyz/logo/${slug}.png` : undefined;
}

export function BankLogo({ uri, size, paygenius }: Props) {
  const [failed, setFailed] = React.useState(false);
  const usable = !!uri && !uri.includes('default-image') && !failed;

  if (paygenius) {
    return (
      <View
        style={[
          styles.wrap,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#191970',
          },
        ]}
      >
        <PayGeniusLogo width={size * 0.52} height={size * 0.52} />
      </View>
    );
  }

  if (!usable) {
    return <BankIcon width={size} height={size} />;
  }

  return (
    <Image
      source={{ uri }}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#F3F3F3' }}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
