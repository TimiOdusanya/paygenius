import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { PiggyIllustration } from '@/components/PiggyIllustration';
import { PrimaryButton } from '@/components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'GoalCreated'>;

export function GoalCreatedScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const { goalName, goalId } = route.params;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#CCCCCC' : '#858585';

  const goHub = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Main' }, { name: 'SavingsHub' }],
    });
  };

  const goDetail = () => {
    if (!goalId) {
      goHub();
      return;
    }
    navigation.replace('GoalDetail', { goalId });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={{ paddingHorizontal: hs(21), paddingTop: vs(16) }}>
        <BackButton onPress={goHub} />
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(36), paddingHorizontal: hs(40) }}>
        <Text style={{ color: titleColor, fontSize: fs(20), fontWeight: '500', textAlign: 'center' }}>
          Saving Goal Created
        </Text>
        <Text
          style={{
            color: subColor,
            fontSize: fs(16),
            fontWeight: '300',
            textAlign: 'center',
            marginTop: vs(12),
            lineHeight: fs(21),
          }}
        >
          Hey, You have created a savings Goal for {goalName}
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: vs(20) }}>
        <PiggyIllustration />
      </View>

      <Pressable onPress={goDetail} style={{ alignSelf: 'center', marginTop: vs(8) }}>
        <Text style={{ color: titleColor, fontSize: fs(12), fontWeight: '500' }}>View here</Text>
      </Pressable>

      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: hs(23), paddingBottom: Math.max(insets.bottom, vs(16)) }}>
        <PrimaryButton title="Continue" onPress={goHub} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
