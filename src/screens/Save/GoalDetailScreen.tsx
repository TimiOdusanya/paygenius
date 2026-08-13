import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
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
import { BackButton } from '@/components/BackButton';
import { CopyUrlBar } from '@/components/CopyUrlBar';
import {
  useGetSavingsGoalQuery,
  useUpdateSavingsGoalMutation,
} from '@/services/savings/savings.query';
import PlaystationIcon from '../../../assets/images/save/playstation.svg';
import ShareIcon from '../../../assets/images/save/share.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'GoalDetail'>;

function formatNaira(amount: number) {
  return `₦ ${Math.round(amount).toLocaleString('en-NG')}`;
}

export function GoalDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const { goalId } = route.params;
  const { data, isLoading } = useGetSavingsGoalQuery(goalId);
  const updateGoal = useUpdateSavingsGoalMutation();
  const goal = data?.data?.goal;
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (goal?.description != null) setDescription(goal.description);
  }, [goal?.description]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const nameColor = isDark ? '#FFFFFF' : '#000000';
  const muted = isDark ? '#AAAAAA' : '#858585';
  const shareUrl = `paygenius.app/savings/${goal?.shareSlug ?? 'goal'}`;

  const handleShare = () => {
    Share.share({ message: `https://${shareUrl}` });
  };

  const persistDescription = () => {
    if (!goal || description === (goal.description ?? '')) return;
    updateGoal.mutate({ id: goal._id, description });
  };

  if (isLoading || !goal) {
    return (
      <View style={[styles.center, { backgroundColor: bg, paddingTop: insets.top }]}>
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  const progress = goal.progress ?? 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={[styles.header, { paddingHorizontal: hs(21), paddingTop: vs(16) }]}>
          <BackButton
            onPress={() =>
              navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SavingsHub')
            }
          />
          <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600', letterSpacing: -0.32 }}>
            My Saving Goal
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: hs(21),
            paddingTop: vs(20),
            paddingBottom: Math.max(insets.bottom, vs(20)),
          }}
        >
          <View style={{ alignItems: 'flex-end', marginBottom: vs(8) }}>
            <Pressable onPress={handleShare} hitSlop={8}>
              <ShareIcon width={ms(24)} height={ms(24)} />
            </Pressable>
          </View>

          <View style={styles.summary}>
            <View
              style={{
                width: ms(119),
                height: ms(119),
                borderRadius: ms(60),
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                borderWidth: 4,
                borderColor: '#D8C4FA',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <PlaystationIcon width={ms(48)} height={ms(48)} />
            </View>
            <View style={{ flex: 1, marginLeft: hs(16) }}>
              <Text style={{ color: nameColor, fontSize: fs(24) }} numberOfLines={2}>
                {goal.name}
              </Text>
              <View style={[styles.metric, { marginTop: vs(8) }]}>
                <Text style={{ color: '#7C3AED', fontSize: fs(12) }}>Target Amount</Text>
                <Text style={{ color: '#7C3AED', fontSize: fs(12) }}>
                  {formatNaira(goal.targetAmount)}
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={{ color: muted, fontSize: fs(12) }}>Amount Reached</Text>
                <Text style={{ color: muted, fontSize: fs(12) }}>
                  {formatNaira(goal.currentAmount)}
                </Text>
              </View>
              <View style={[styles.track, { backgroundColor: '#D9D9D9', marginTop: vs(8) }]}>
                <View
                  style={{
                    width: `${Math.min(100, progress)}%`,
                    height: 10,
                    borderRadius: 20,
                    backgroundColor: '#7C3AED',
                  }}
                />
              </View>
              <Text style={{ color: muted, fontSize: fs(12), textAlign: 'center', marginTop: 2 }}>
                {progress}%
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: isDark ? '#FFFFFF' : '#1A1D23',
              fontSize: fs(16),
              fontWeight: '500',
              marginTop: vs(40),
              letterSpacing: -0.32,
            }}
          >
            Add Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            onEndEditing={persistDescription}
            placeholder="Add Description...."
            placeholderTextColor="#858585"
            multiline
            style={{
              marginTop: vs(8),
              minHeight: vs(116),
              borderWidth: 0.4,
              borderColor: '#7C3AED',
              borderRadius: ms(16),
              paddingHorizontal: hs(18),
              paddingTop: vs(17),
              color: isDark ? '#FFFFFF' : '#1A1D23',
              fontSize: fs(12),
              textAlignVertical: 'top',
              backgroundColor: isDark ? '#2A2A2A' : '#FAFAFC',
            }}
          />

          <View style={{ marginTop: vs(28) }}>
            <CopyUrlBar url={shareUrl} />
          </View>

          <Text
            style={{
              color: muted,
              fontSize: fs(10),
              textAlign: 'center',
              marginTop: vs(24),
              lineHeight: fs(14),
              paddingHorizontal: hs(40),
            }}
          >
            Note: You can’t have access to your money until the required date or amount
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summary: { flexDirection: 'row', alignItems: 'center' },
  metric: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  track: { height: 10, borderRadius: 20, overflow: 'hidden' },
});
