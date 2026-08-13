import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useAuthStore } from '@/stores';
import { useSubmitReviewMutation } from '@/services/settings/settings.query';
import { getApiErrorMessage } from '@/utils/errors';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RateUs'>;
type Step = 'enjoy' | 'sorry' | 'review';

export function RateUsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms, isSmallScreen } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const submit = useSubmitReviewMutation();
  const [step, setStep] = useState<Step>('enjoy');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'PayGenius user';
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const card = isDark ? '#2A2A2A' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#000000';
  const action = isDark ? '#A78BFA' : '#191970';
  const line = isDark ? '#3B3B3B' : '#E5E5E5';
  const starSize = ms(isSmallScreen ? 26 : 32);
  const headerOffset = insets.top + vs(24) + vs(28);

  const send = (enjoyed: boolean) => {
    if (rating < 1) {
      Alert.alert('Pick a star rating first');
      return;
    }
    submit.mutate(
      { rating, review: review.trim() || undefined, enjoyed },
      {
        onSuccess: () => {
          Alert.alert('Thanks for the feedback', 'We read every review.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error) => {
          Alert.alert('Could not send review', getApiErrorMessage(error, 'Try again.'));
        },
      }
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          paddingBottom: vs(12),
          zIndex: 2,
        }}
      >
        <ScreenTitleBar title="Rate us" onBack={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerOffset}
      >
        {step === 'review' ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: card,
                  paddingBottom: Math.max(insets.bottom, vs(16)),
                },
              ]}
            >
              <View
                style={[
                  styles.sheetHead,
                  { paddingHorizontal: hs(16), paddingVertical: vs(16) },
                ]}
              >
                <Text
                  style={{
                    color: isDark ? '#A78BFA' : '#5F6368',
                    fontSize: fs(16),
                    fontWeight: '600',
                  }}
                >
                  Google Play
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8), flexShrink: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{ color: titleColor, fontSize: fs(14), flexShrink: 1 }}
                  >
                    {name}
                  </Text>
                  <View
                    style={{
                      width: ms(32),
                      height: ms(32),
                      borderRadius: ms(16),
                      backgroundColor: '#E5D8FB',
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: hs(16),
                  paddingVertical: vs(16),
                  gap: hs(12),
                }}
              >
                <View
                  style={{
                    width: ms(48),
                    height: ms(48),
                    borderRadius: ms(8),
                    backgroundColor: '#F2EBFD',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#191970', fontWeight: '700', fontSize: fs(14) }}>PG</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600' }}>
                    PayGenius
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: vs(8),
                      gap: hs(10),
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
                        <Ionicons
                          name={star <= rating ? 'star' : 'star-outline'}
                          size={starSize}
                          color={star <= rating ? '#F4B400' : '#9AA0A6'}
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <TextInput
                value={review}
                onChangeText={setReview}
                placeholder="Describe your experience (optional)"
                placeholderTextColor="#9AA0A6"
                multiline
                textAlignVertical="top"
                style={{
                  marginHorizontal: hs(16),
                  minHeight: vs(88),
                  maxHeight: vs(160),
                  borderWidth: 1,
                  borderColor: line,
                  borderRadius: ms(4),
                  paddingHorizontal: hs(12),
                  paddingVertical: vs(10),
                  color: titleColor,
                  fontSize: fs(14),
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: hs(8),
                  paddingHorizontal: hs(16),
                  paddingTop: vs(16),
                }}
              >
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={[styles.sheetBtn, { height: vs(40), borderColor: action }]}
                >
                  <Text style={{ color: '#188038', fontSize: fs(14) }}>Not now</Text>
                </Pressable>
                <Pressable
                  onPress={() => send(rating >= 4)}
                  disabled={submit.isPending}
                  style={[
                    styles.sheetBtn,
                    { height: vs(40), backgroundColor: action, borderColor: action },
                  ]}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: fs(14) }}>
                    {submit.isPending ? 'Sending…' : 'Submit'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={[styles.center, { paddingHorizontal: hs(21) }]}>
            {step === 'enjoy' ? (
              <View
                style={[
                  styles.modal,
                  { backgroundColor: card, width: '100%', maxWidth: hs(332) },
                ]}
              >
                <View
                  style={{
                    paddingHorizontal: hs(16),
                    paddingTop: vs(20),
                    paddingBottom: vs(16),
                  }}
                >
                  <Text style={[styles.modalTitle, { color: titleColor, fontSize: fs(18) }]}>
                    Enjoying this App?
                  </Text>
                  <Text
                    style={{
                      color: titleColor,
                      fontSize: fs(14),
                      textAlign: 'center',
                      marginTop: vs(8),
                      lineHeight: fs(20),
                    }}
                  >
                    Hi there! We'd love to know if you're having a great experience.
                  </Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: line }} />
                <View style={{ flexDirection: 'row', minHeight: vs(114) }}>
                  <Pressable style={styles.half} onPress={() => setStep('sorry')}>
                    <Text style={{ fontSize: ms(32) }}>🙁</Text>
                    <Text style={{ color: action, fontSize: fs(16), marginTop: vs(16) }}>
                      Not Really
                    </Text>
                  </Pressable>
                  <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: line }} />
                  <Pressable style={styles.half} onPress={() => setStep('review')}>
                    <Text style={{ fontSize: ms(32) }}>🤗</Text>
                    <Text style={{ color: action, fontSize: fs(16), marginTop: vs(16) }}>
                      Yes!
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.modal,
                  { backgroundColor: card, width: '100%', maxWidth: hs(332) },
                ]}
              >
                <View
                  style={{
                    paddingHorizontal: hs(16),
                    paddingTop: vs(20),
                    paddingBottom: vs(16),
                  }}
                >
                  <Text style={[styles.modalTitle, { color: titleColor, fontSize: fs(16) }]}>
                    We’re sorry you’re not having a good time with this app.
                  </Text>
                  <Text
                    style={{
                      color: titleColor,
                      fontSize: fs(14),
                      textAlign: 'center',
                      marginTop: vs(8),
                      lineHeight: fs(20),
                    }}
                  >
                    Tell us what went wrong so we can make PayGenius better.
                  </Text>
                </View>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: line }} />
                <Pressable
                  style={{ height: vs(46), alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => setStep('review')}
                >
                  <Text style={{ color: action, fontSize: fs(16) }}>Send feedback</Text>
                </Pressable>
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: line }} />
                <Pressable
                  style={{ height: vs(50), alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={{ color: action, fontSize: fs(16) }}>Maybe later</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  half: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetBtn: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
