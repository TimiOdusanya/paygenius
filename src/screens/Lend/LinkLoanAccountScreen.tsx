import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Header } from '@/components/Header';
import { FormInput, PasswordInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

const FAIRMONEY = require('../../../assets/images/lend/fairmoney.png');

type Props = NativeStackScreenProps<RootStackParamList, 'LinkLoanAccount'>;

export function LinkLoanAccountScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { providerCode, providerName } = route.params;

  const [accountName, setAccountName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');
  const [bvn, setBvn] = React.useState('');

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const nameColor = isDark ? '#FFFFFF' : '#000000';
  const disclaimer = isDark ? '#AAAAAA' : '#6D6D8C';
  const canLink =
    accountName.trim().length > 1 &&
    accountNumber.replace(/\D/g, '').length >= 8 &&
    bvn.replace(/\D/g, '').length >= 10;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + vs(12),
          paddingHorizontal: hs(21),
          paddingBottom: vs(16),
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          onBack={() => navigation.goBack()}
          title="Link your Account"
          description="Enter your Details"
        />

        <View style={{ alignItems: 'center', marginTop: vs(20) }}>
          <View
            style={[
              styles.logoWrap,
              {
                width: ms(109),
                height: ms(109),
                borderRadius: ms(55),
                borderWidth: 4,
              },
            ]}
          >
            <Image
              source={FAIRMONEY}
              style={{
                width: ms(86),
                height: ms(86),
                borderRadius: ms(43),
                borderWidth: 0.3,
                borderColor: '#37A477',
              }}
            />
          </View>
          <Text style={[styles.provider, { color: nameColor, fontSize: fs(16), marginTop: vs(10) }]}>
            {providerName}
          </Text>
        </View>

        <View style={{ marginTop: vs(28), gap: vs(8) }}>
          <FormInput
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            placeholder=""
            autoCapitalize="words"
          />
          <FormInput
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder=""
            keyboardType="number-pad"
          />
          <PasswordInput
            label="BVN"
            value={bvn}
            onChangeText={setBvn}
            placeholder="**********"
            keyboardType="number-pad"
          />
        </View>

        <View style={{ flex: 1 }} />
        <Text
          style={[
            styles.disclaimer,
            { color: disclaimer, fontSize: fs(10), marginBottom: vs(16) },
          ]}
        >
          Your login is encrypted and secured directly with {providerName}. PayGenius never stores your credentials
        </Text>
        <View style={{ paddingBottom: Math.max(insets.bottom, vs(16)) }}>
          <PrimaryButton
            title="Link"
            disabled={!canLink}
            onPress={() =>
              navigation.replace('LendPleaseWait', {
                providerCode,
                providerName,
                accountName: accountName.trim(),
                accountNumber,
                bvn,
              })
            }
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    backgroundColor: '#191970',
    borderColor: '#D8C4FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  provider: { fontWeight: '400', textAlign: 'center' },
  disclaimer: { fontWeight: '400', textAlign: 'center' },
});
