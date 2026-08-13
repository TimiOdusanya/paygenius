import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
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
  const { hs, vs, fs, ms } = useResponsive();
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
        }}
      >
        <ScreenTitleBar title="Rate us" onBack={() => navigation.goBack()} />
      </View>

      <Modal visible transparent animationType="fade">
        <View style={styles.overlay}>
          {step === 'enjoy' ? (
            <View style={[styles.modal, { backgroundColor: card, width: hs(332) }]}>
              <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 }}>
                <Text style={[styles.modalTitle, { color: titleColor, fontSize: fs(18) }]}>
                  Enjoying this App?
                </Text>
                <Text
                  style={{
                    color: titleColor,
                    fontSize: fs(14),
                    textAlign: 'center',
                    marginTop: 8,
                    lineHeight: fs(20),
                  }}
                >
                  Hi there! We'd love to know if you're having a great experience.
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: line }} />
              <View style={{ flexDirection: 'row', height: 114 }}>
                <Pressable style={styles.half} onPress={() => setStep('sorry')}>
                  <Text style={{ fontSize: 32 }}>🙁</Text>
                  <Text style={{ color: action, fontSize: fs(16), marginTop: 16 }}>Not Really</Text>
                </Pressable>
                <View style={{ width: 1, backgroundColor: line }} />
                <Pressable style={styles.half} onPress={() => setStep('review')}>
                  <Text style={{ fontSize: 32 }}>🤗</Text>
                  <Text style={{ color: action, fontSize: fs(16), marginTop: 16 }}>Yes!</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {step === 'sorry' ? (
            <View style={[styles.modal, { backgroundColor: card, width: hs(332) }]}>
              <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 }}>
                <Text style={[styles.modalTitle, { color: titleColor, fontSize: fs(16) }]}>
                  We’re sorry you’re not having a good time with this app.
                </Text>
                <Text
                  style={{
                    color: titleColor,
                    fontSize: fs(14),
                    textAlign: 'center',
                    marginTop: 8,
                    lineHeight: fs(20),
                  }}
                >
                  Tell us what went wrong so we can make PayGenius better.
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: line }} />
              <Pressable
                style={{ height: 46, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setStep('review')}
              >
                <Text style={{ color: action, fontSize: fs(16) }}>Send feedback</Text>
              </Pressable>
              <View style={{ height: 1, backgroundColor: line }} />
              <Pressable
                style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ color: action, fontSize: fs(16) }}>Maybe later</Text>
              </Pressable>
            </View>
          ) : null}

          {step === 'review' ? (
            <View style={[styles.sheet, { backgroundColor: card, width: '100%' }]}>
              <View style={styles.sheetHead}>
                <Text style={{ color: isDark ? '#A78BFA' : '#5F6368', fontSize: fs(16), fontWeight: '600' }}>
                  Google Play
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: titleColor, fontSize: fs(14) }}>{name}</Text>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#E5D8FB',
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: '#F2EBFD',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#191970', fontWeight: '700' }}>PG</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600' }}>PayGenius</Text>
                  <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setRating(star)} hitSlop={6}>
                        <Ionicons
                          name={star <= rating ? 'star' : 'star-outline'}
                          size={ms(32)}
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
                style={{
                  marginHorizontal: 16,
                  minHeight: 56,
                  borderWidth: 1,
                  borderColor: line,
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: titleColor,
                  fontSize: fs(14),
                }}
              />
              <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={[styles.sheetBtn, { borderColor: action }]}
                >
                  <Text style={{ color: '#188038', fontSize: fs(14) }}>Not now</Text>
                </Pressable>
                <Pressable
                  onPress={() => send(rating >= 4)}
                  disabled={submit.isPending}
                  style={[styles.sheetBtn, { backgroundColor: action }]}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: fs(14) }}>
                    {submit.isPending ? 'Sending…' : 'Submit'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
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
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    bottom: 0,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sheetBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
