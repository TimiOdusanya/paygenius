import React, { useState } from 'react';
import {
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
import { BackButton } from '@/components/BackButton';
import { FormInput } from '@/components/FormInput';
import { DateOfBirthField } from '@/components/DateOfBirthField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { HaloIcon } from '@/components/HaloIcon';
import { formatAmountInput, parseAmountInput } from '@/utils/amount';
import SavingsIcon from '../../../assets/images/save/savings-icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGoal'>;

export function CreateGoalScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';
  const optionalColor = isDark ? '#AAAAAA' : '#858585';
  const parsed = parseAmountInput(amount);
  const canContinue = name.trim().length > 0 && parsed > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    navigation.navigate('SetHowYouSave', {
      name: name.trim(),
      targetAmount: parsed,
      description: description.trim() || undefined,
      targetDate: targetDate ? targetDate.toISOString() : undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.titles}>
            <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600', letterSpacing: -0.32 }}>
              Create New Saving Goal
            </Text>
            <Text style={{ color: subColor, fontSize: fs(12), marginTop: 2 }}>
              Choose a New Goal
            </Text>
          </View>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: hs(22),
            paddingTop: vs(20),
            paddingBottom: vs(16),
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: vs(28) }}>
            <HaloIcon>
              <SavingsIcon width={ms(50)} height={ms(50)} />
            </HaloIcon>
          </View>

          <FormInput
            placeholder="Enter Goal Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <FormInput
            placeholder="Target Amount"
            value={amount}
            onChangeText={(t) => setAmount(formatAmountInput(t))}
            keyboardType="decimal-pad"
            containerStyle={{ marginTop: vs(21) }}
          />

          <Text style={{ color: optionalColor, fontSize: fs(12), marginTop: vs(21), marginBottom: vs(8) }}>
            Optional
          </Text>
          <FormInput
            placeholder="Descriptions"
            value={description}
            onChangeText={setDescription}
            multiline
            fieldHeight={vs(104)}
          />

          <View style={{ marginTop: vs(16) }}>
            <DateOfBirthField
              label="Target Date"
              value={targetDate}
              onChange={setTargetDate}
              placeholders={{ day: '02', month: 'July', year: '2000' }}
              minimumDate={new Date()}
              maximumDate={new Date(2100, 11, 31)}
              sheetTitle="Target Date"
            />
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: hs(16), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
          <PrimaryButton title="Get Started" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  titles: { flex: 1, alignItems: 'center' },
});
