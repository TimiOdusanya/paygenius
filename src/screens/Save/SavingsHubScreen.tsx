import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { AddGoalCard, GoalCard } from '@/components/GoalCard';
import { useGetSavingsGoalsQuery } from '@/services/savings/savings.query';
import NotificationIcon from '../../../assets/images/home/notification.svg';
import EyeToggle from '../../../assets/images/home/eye-toggle.svg';

const CARD_BG = require('../../../assets/images/home/balance-dots.png');

type Props = NativeStackScreenProps<RootStackParamList, 'SavingsHub'>;

function formatBalance(amount: number) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function SavingsHubScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [visible, setVisible] = React.useState(true);
  const { data } = useGetSavingsGoalsQuery();

  const goals = data?.data?.goals ?? [];
  const total = data?.data?.totalBalance ?? 0;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const headerBg = isDark ? '#2A1A3E' : '#F2EBFD';
  const titleColor = isDark ? '#FFFFFF' : '#1A1D23';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  const openCreate = () => {
    if (goals.length === 0) {
      navigation.navigate('SaveIntro');
      return;
    }
    navigation.navigate('CreateGoal');
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={[styles.banner, { backgroundColor: headerBg, paddingTop: insets.top }]}>
        <View
          style={[
            styles.headerRow,
            { paddingHorizontal: hs(22), paddingTop: vs(16), paddingBottom: vs(72) },
          ]}
        >
          <BackButton onPress={() => navigation.goBack()} />
          <View style={{ flex: 1 }} />
          <NotificationIcon width={ms(40)} height={ms(40)} />
        </View>
      </View>

      <View style={{ marginTop: -vs(60), paddingHorizontal: hs(22) }}>
        <View style={[styles.balanceCard, { height: ms(152), borderRadius: ms(10) }]}>
          <LinearGradient
            colors={['#7C3AED', '#191970']}
            start={{ x: 0.05, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Image
            source={CARD_BG}
            fadeDuration={0}
            resizeMode="stretch"
            style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
          />
          <Text style={[styles.balanceLabel, { fontSize: fs(16), marginTop: vs(34) }]}>
            Total Saving Balance
          </Text>
          <Pressable onPress={() => setVisible((v) => !v)} style={styles.balanceRow}>
            <Text
              style={[styles.balanceValue, { fontSize: fs(32) }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {visible ? formatBalance(total) : '₦*****'}
            </Text>
            <EyeToggle width={ms(20)} height={ms(18)} />
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: hs(22), marginTop: vs(24) }}>
        <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '500', letterSpacing: -0.32 }}>
          My Goals
        </Text>
        <Text style={{ color: subColor, fontSize: fs(10), marginTop: 2 }}>
          Set your finance goals
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(20),
          paddingTop: vs(18),
          paddingBottom: insets.bottom + vs(24),
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: hs(14),
        }}
        showsVerticalScrollIndicator={false}
      >
        {goals.map((goal) => (
          <GoalCard
            key={goal._id}
            name={goal.name}
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
            progress={goal.progress}
            accent={goal.accent}
            onPress={() => navigation.navigate('GoalDetail', { goalId: goal._id })}
            onShare={() => navigation.navigate('GoalDetail', { goalId: goal._id })}
          />
        ))}
        <AddGoalCard onPress={openCreate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { overflow: 'hidden' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  balanceCard: { overflow: 'hidden', alignItems: 'center' },
  balanceLabel: { color: '#FFFFFF', fontWeight: '500', letterSpacing: -0.32 },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: -0.64,
  },
});
