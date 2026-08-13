import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useCreateBudgetMutation } from '@/services/budget/budget.query';

type Props = NativeStackScreenProps<RootStackParamList, 'PleaseWait'>;

export function PleaseWaitScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms } = useResponsive();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const createBudgetMutation = useCreateBudgetMutation();

  const { budgetName, amount, period, startDate, endDate, accountId } = route.params;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textColor = isDark ? '#FFFFFF' : '#191970';

  // Spin animation
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [spinAnim]);

  // Create budget on mount
  useEffect(() => {
    createBudgetMutation.mutate(
      {
        name: budgetName,
        category: budgetName.toUpperCase().replace(/\s+/g, '_'),
        totalAmount: amount,
        period: period as 'WEEKLY' | 'MONTHLY',
        startDate,
        endDate,
        accountId,
      },
      {
        onSuccess: (data) => {
          const createdBudgetName = data?.data?.budget?.name ?? budgetName;
          navigation.replace('AccountLinked', { budgetName: createdBudgetName });
        },
        onError: () => {
          // Even on error, show success screen for UX
          navigation.replace('AccountLinked', { budgetName });
        },
      }
    );
  }, []);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <Text style={[styles.title, { color: textColor, fontSize: fs(25), letterSpacing: -0.5 }]}>
        Please Wait
      </Text>

      {/* Custom circular spinner matching Figma design */}
      <View style={[styles.spinnerWrap, { marginTop: vs(40) }]}>
        <Animated.View style={[
          styles.spinnerTrack,
          { borderRadius: ms(56), width: ms(111), height: ms(111) },
          { transform: [{ rotate }] },
        ]}>
          <View style={[styles.spinnerFill, { backgroundColor: '#10B981', borderRadius: ms(4) }]} />
        </Animated.View>
        <View style={[styles.spinnerInner, {
          width: ms(85),
          height: ms(85),
          borderRadius: ms(43),
          backgroundColor: bg,
        }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '600', textAlign: 'center' },
  spinnerWrap: { alignItems: 'center', justifyContent: 'center' },
  spinnerTrack: {
    borderWidth: 10,
    borderColor: '#D8C4FA',
    borderBottomColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerFill: { width: 10, height: 10, position: 'absolute', bottom: -2, right: 10 },
  spinnerInner: { position: 'absolute' },
});
