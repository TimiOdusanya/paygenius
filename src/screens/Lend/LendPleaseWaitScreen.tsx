import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useLinkLoanMutation } from '@/services/loans/loans.query';

type Props = NativeStackScreenProps<RootStackParamList, 'LendPleaseWait'>;

export function LendPleaseWaitScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { vs, fs, ms } = useResponsive();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const linkLoan = useLinkLoanMutation();
  const draft = route.params;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const textColor = isDark ? '#FFFFFF' : '#191970';

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

  useEffect(() => {
    linkLoan.mutate(draft, {
      onSuccess: (data) => {
        const loanId = data.data?.loan?._id;
        if (loanId) {
          navigation.replace('LoanDetail', { loanId });
          return;
        }
        navigation.replace('LendHub');
      },
      onError: () => {
        navigation.replace('LendHub');
      },
    });
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
      <View style={[styles.spinnerWrap, { marginTop: vs(40) }]}>
        <Animated.View
          style={[
            styles.spinnerTrack,
            { borderRadius: ms(56), width: ms(111), height: ms(111), transform: [{ rotate }] },
          ]}
        />
        <View
          style={[
            styles.spinnerInner,
            { width: ms(85), height: ms(85), borderRadius: ms(43), backgroundColor: bg },
          ]}
        />
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
  },
  spinnerInner: { position: 'absolute' },
});
