import React from 'react';
import {
  Modal,
  Pressable,
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
import { SettingsSwitch } from '@/components/SettingsSwitch';
import { useGetWalletQuery } from '@/services/wallet/wallet.query';
import { useGetBudgetsQuery } from '@/services/budget/budget.query';
import { useLookupTransferUsersQuery } from '@/services/transfer/transfer.query';
import type { TransferUser } from '@/services/transfer/transfer.type';
import { BankLogo, bankLogoUri } from '@/components/BankLogo';
import WalletIcon from '../../../assets/images/transfer/icon-wallet.svg';
import { availableForTransfer, formatNaira, initial } from './transfer.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferReview'>;

export function TransferReviewScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const draft = route.params;
  const [saveBeneficiary, setSaveBeneficiary] = React.useState(draft.saveBeneficiary !== false);
  const [splitOpen, setSplitOpen] = React.useState(false);
  const [splitQuery, setSplitQuery] = React.useState('');
  const [splitUser, setSplitUser] = React.useState<TransferUser | null>(null);
  const { data: walletData, isFetched: walletFetched } = useGetWalletQuery();
  const { data: budgetData } = useGetBudgetsQuery();
  const lookup = useLookupTransferUsersQuery(splitQuery, { enabled: splitOpen && splitQuery.length >= 2 });
  const walletBalance = walletData?.data?.wallet?.availableBalance ?? 0;
  const selectedBudget = (budgetData?.data?.budgets ?? []).find((item) => item._id === draft.budgetId);
  const available = availableForTransfer({
    walletBalance,
    paymentSource: draft.paymentSource,
    budget: selectedBudget,
  });
  const payAmount = splitUser ? Math.ceil(draft.amount / 2) : draft.amount;
  const insufficient = walletFetched && payAmount > available;
  const bankLogo = draft.bankLogo || bankLogoUri({ name: draft.bankName, slug: draft.bankName });
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const cardBg = isDark ? '#242424' : '#FFFFFF';
  const amountColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const labelColor = '#191970';
  const valueColor = isDark ? '#FFFFFF' : '#191970';

  const goToPin = (amount: number, note?: string) => {
    if (!walletFetched || amount > available) return;
    navigation.navigate('TransferPin', {
      ...draft,
      amount,
      note,
      saveBeneficiary,
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

      <View
        style={[
          styles.card,
          {
            marginHorizontal: hs(21),
            marginTop: vs(36),
            paddingHorizontal: hs(23),
            paddingTop: vs(24),
            paddingBottom: vs(18),
            borderRadius: ms(12),
            backgroundColor: cardBg,
          },
        ]}
      >
        <Text
          style={{
            alignSelf: 'center',
            color: amountColor,
            fontSize: fs(20),
            fontWeight: '500',
            letterSpacing: -0.4,
          }}
        >
          {formatNaira(payAmount)}
        </Text>

        <View style={[styles.metaRow, { marginTop: vs(24) }]}>
          <Text style={[styles.metaLabel, { color: labelColor, fontSize: fs(10) }]}>
            Account Number
          </Text>
          <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(16), fontWeight: '600' }}>
            {draft.accountNumber}
          </Text>
        </View>

        <View style={[styles.metaRow, { marginTop: vs(12) }]}>
          <Text style={[styles.metaLabel, { color: labelColor, fontSize: fs(10) }]}>Bank</Text>
          <View style={styles.metaValue}>
            <BankLogo
              uri={bankLogo}
              size={ms(22)}
              paygenius={draft.rail === 'PAYGENIUS'}
            />
            <Text style={{ color: valueColor, fontSize: fs(14), letterSpacing: 0.25 }}>
              {draft.bankName || (draft.rail === 'PAYGENIUS' ? 'PayGenius' : 'Bank')}
            </Text>
          </View>
        </View>

        <View style={[styles.metaRow, { marginTop: vs(12) }]}>
          <Text style={[styles.metaLabel, { color: labelColor, fontSize: fs(10) }]}>Name</Text>
          <View style={styles.metaValue}>
            <View
              style={[
                styles.dot,
                { width: ms(22), height: ms(22), borderRadius: ms(11), backgroundColor: '#D5C7F7' },
              ]}
            >
              <Text style={{ fontSize: fs(9), color: '#191970', fontWeight: '600' }}>
                {initial(draft.accountName)}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={{ color: valueColor, fontSize: fs(14), letterSpacing: 0.25, maxWidth: hs(160) }}
            >
              {draft.accountName}
            </Text>
          </View>
        </View>

        <Text style={{ color: isDark ? '#CCCCCC' : '#000000', fontSize: fs(11), marginTop: vs(18) }}>
          Balance
        </Text>
        <View
          style={[
            styles.balance,
            {
              height: vs(58),
              borderRadius: ms(12),
              marginTop: vs(8),
              paddingHorizontal: hs(16),
              backgroundColor: 'rgba(192,192,241,0.2)',
            },
          ]}
        >
          <WalletIcon width={ms(18)} height={ms(18)} />
          <Text
            style={{
              color: '#191970',
              fontSize: fs(14),
              letterSpacing: -0.28,
              marginLeft: hs(10),
            }}
          >
            {formatNaira(available)}
          </Text>
        </View>
        {insufficient ? (
          <Text style={{ color: '#E05353', fontSize: fs(11), marginTop: vs(10) }}>
            Insufficient balance. Fund your wallet before you continue.
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.saveRow,
          {
            marginHorizontal: hs(21),
            marginTop: vs(28),
            height: vs(58),
            borderRadius: ms(8),
          },
        ]}
      >
        <Text style={{ color: '#858585', fontSize: fs(14) }}>Save as Beneficiary</Text>
        <SettingsSwitch value={saveBeneficiary} onValueChange={setSaveBeneficiary} />
      </View>

      {splitUser ? (
        <Text
          style={{
            marginHorizontal: hs(24),
            marginTop: vs(8),
            color: isDark ? '#CCCCCC' : '#858585',
            fontSize: fs(11),
          }}
        >
          Split with {splitUser.name}. You pay {formatNaira(payAmount)}.
        </Text>
      ) : null}

      <View style={{ flex: 1 }} />

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: hs(24),
          paddingBottom: Math.max(insets.bottom, vs(18)),
          gap: hs(24),
        }}
      >
        <Pressable
          disabled={insufficient || !walletFetched}
          onPress={() =>
            goToPin(
              payAmount,
              splitUser
                ? [draft.note, `Split with ${splitUser.name}`].filter(Boolean).join(' · ')
                : draft.note
            )
          }
          style={[
            styles.action,
            {
              flex: 1,
              height: vs(50),
              borderRadius: ms(13),
              backgroundColor: insufficient || !walletFetched ? '#C4C4C4' : '#191970',
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: fs(12), fontWeight: '600' }}>Pay</Text>
        </Pressable>
        <Pressable
          disabled={insufficient || !walletFetched}
          onPress={() => setSplitOpen(true)}
          style={[
            styles.action,
            {
              flex: 1,
              height: vs(50),
              borderRadius: ms(13),
              backgroundColor: '#EDEDED',
              opacity: insufficient ? 0.5 : 1,
            },
          ]}
        >
          <Text style={{ color: '#000000', fontSize: fs(12), fontWeight: '600' }}>Split Pay</Text>
        </Pressable>
      </View>

      <Modal visible={splitOpen} transparent animationType="fade" onRequestClose={() => setSplitOpen(false)}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)' }]}
          onPress={() => setSplitOpen(false)}
        >
          <Pressable
            onPress={() => undefined}
            style={[
              styles.sheet,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderRadius: ms(12),
                marginHorizontal: hs(22),
                padding: hs(16),
              },
            ]}
          >
            <Text style={{ color: isDark ? '#FFFFFF' : '#191970', fontSize: fs(14), fontWeight: '600' }}>
              Split with a PayGenius user
            </Text>
            <TextInput
              value={splitQuery}
              onChangeText={setSplitQuery}
              placeholder="Search username or name"
              placeholderTextColor="#C4C4C4"
              autoFocus
              style={[
                styles.splitSearch,
                {
                  color: isDark ? '#FFFFFF' : '#1A1D23',
                  backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                  borderRadius: ms(8),
                  marginTop: vs(12),
                  height: vs(44),
                  paddingHorizontal: hs(12),
                  fontSize: fs(12),
                },
              ]}
            />
            {(lookup.data?.data?.users ?? []).map((user) => (
              <Pressable
                key={user._id}
                onPress={() => {
                  setSplitUser(user);
                  setSplitOpen(false);
                }}
                style={{ paddingVertical: vs(12) }}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#1A1D23', fontSize: fs(12) }}>
                  {user.name}
                  {user.handle ? `  ${user.handle}` : ''}
                </Text>
              </Pressable>
            ))}
            {splitQuery.length >= 2 && (lookup.data?.data?.users ?? []).length === 0 && !lookup.isFetching ? (
              <Text style={{ color: '#858585', fontSize: fs(12), marginTop: vs(12) }}>
                No PayGenius user matches that search.
              </Text>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontWeight: '300',
    letterSpacing: 0.25,
  },
  metaValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
  },
  sheet: {
    overflow: 'hidden',
  },
  splitSearch: {
    padding: 0,
  },
});
