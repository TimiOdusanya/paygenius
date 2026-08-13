import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { SoftField } from '@/components/SoftField';
import { OptionPickerSheet } from '@/components/OptionPickerSheet';
import type { PaymentSource } from '@/services/bills/bills.type';
import WalletIcon from '../../assets/images/bills/icon-wallet.svg';
import PhoneIcon from '../../assets/images/bills/icon-phone.svg';

export type WalletSourceOption = {
  id: string;
  source: PaymentSource;
  label: string;
  budgetId?: string;
};

type Props = {
  value: WalletSourceOption;
  options: WalletSourceOption[];
  onChange: (option: WalletSourceOption) => void;
};

export function WalletSourceField({ value, options, onChange }: Props) {
  const { isDark } = useTheme();
  const { fs, hs, vs, ms } = useResponsive();
  const [open, setOpen] = React.useState(false);
  const titleColor = isDark ? '#FFFFFF' : '#1A1D23';
  const fromColor = isDark ? '#CCCCCC' : '#000000';
  const optionColor = isDark ? '#E0E0E0' : '#1A1D23';
  const budgets = options.filter((option) => option.source === 'BUDGET' && option.budgetId);

  return (
    <View>
      <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
        Wallet
      </Text>
      <Text style={[styles.from, { color: fromColor, fontSize: fs(10), marginTop: vs(2) }]}>
        From
      </Text>
      <SoftField
        containerStyle={{ marginTop: vs(4) }}
        value={value.label}
        placeholder="Paygenius wallet"
        showChevron
        onPress={() => setOpen(true)}
        left={<WalletIcon width={ms(21)} height={ms(18)} />}
      />
      {budgets.length > 0 ? (
        <View style={{ marginTop: vs(8), gap: vs(8), paddingLeft: hs(4) }}>
          {budgets.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => onChange(option)}
              style={styles.option}
            >
              <PhoneIcon width={ms(12.5)} height={ms(18.5)} />
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: optionColor,
                    fontSize: fs(14),
                    marginLeft: hs(8),
                    fontWeight: option.id === value.id ? '600' : '400',
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <OptionPickerSheet
        visible={open}
        title="Pay from"
        options={options.map((option) => ({ id: option.id, label: option.label }))}
        selectedId={value.id}
        onClose={() => setOpen(false)}
        onSelect={(picked) => {
          const next = options.find((option) => option.id === picked.id);
          if (next) onChange(next);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
  from: {
    fontWeight: '400',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontWeight: '400',
  },
});
