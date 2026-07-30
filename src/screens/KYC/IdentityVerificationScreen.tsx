import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { FormInput } from '@/components/FormInput';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useVerifyIdentityMutation } from '@/services/profile/profile.query';

type IDType = 'BVN' | 'NIN';
type Props = NativeStackScreenProps<RootStackParamList, 'IdentityVerification'>;

export function IdentityVerificationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [idType, setIdType] = useState<IDType>('BVN');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const verifyIdentityMutation = useVerifyIdentityMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const infoText = isDark ? '#666666' : '#858585';
  const activeBg = isDark ? '#1A3B2E' : '#AFE9DC';
  const activeText = isDark ? '#FFFFFF' : '#1A1D23';
  const inactiveText = isDark ? 'rgba(133,133,133,0.6)' : 'rgba(133,133,133,0.6)';

  const handleContinue = () => {
    if (!idNumber.trim()) return;
    const payload: any = { type: idType, number: idNumber.trim() };
    if (idType === 'BVN' && phone.trim()) {
      payload.phoneNumber = phone.trim();
    }
    verifyIdentityMutation.mutate(payload, {
      onSuccess: () => navigation.navigate('VerificationCompleted'),
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? 'Identity verification failed.';
        setErrorMsg(msg);
        setShowError(true);
      },
    });
  };

  const handleError = () => setShowError(true);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + vs(24),
            paddingBottom: Math.max(insets.bottom, vs(24)),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { paddingHorizontal: hs(21) }]}>
          {/* Back */}
          <BackButton onPress={() => navigation.goBack()} />

          {/* Title */}
          <View style={{ marginTop: vs(16), alignItems: 'center' }}>
            <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, lineHeight: fs(20), textAlign: 'center' }]}>
              Verify Your Identity
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
              Choose an ID type
            </Text>
          </View>

          {/* Illustration – two tilted cards */}
          <View style={[styles.illustrationWrap, { marginTop: vs(12), height: vs(120) }]}>
            <View style={[styles.card1, { backgroundColor: isDark ? '#2A1A4A' : '#C6F0E2' }]} />
            <View style={[styles.card2, { backgroundColor: isDark ? '#3A2060' : '#E5D8FB' }]}>
              {/* Profile photo placeholder */}
              <View style={[styles.photoCircle, { backgroundColor: isDark ? '#2A3A2A' : '#AFE9D6', borderColor: isDark ? '#7C3AED' : '#7C3AED' }]}>
                <Ionicons name="person" size={ms(14)} color={isDark ? '#A78BFA' : '#7C3AED'} />
              </View>
              <View style={[styles.cardCheck, { backgroundColor: isDark ? '#1A3B2E' : '#AFE9D6' }]}>
                <Ionicons name="checkmark" size={ms(22)} color={isDark ? '#10B981' : '#7C3AED'} />
              </View>
            </View>
          </View>

          {/* ID Toggle */}
          <View style={{ marginTop: vs(16) }}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(11) }]}>
              Choose ID
            </Text>
            <View style={[styles.toggleRow, { marginTop: vs(8), gap: hs(8) }]}>
              {(['BVN', 'NIN'] as IDType[]).map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setIdType(type);
                    setIdNumber('');
                  }}
                  style={[
                    styles.toggleBtn,
                    {
                      flex: 1,
                      height: vs(44),
                      borderRadius: ms(12),
                      borderColor: inputBorder,
                      backgroundColor: idType === type ? activeBg : inputBg,
                    },
                  ]}
                >
                  <Text style={[styles.toggleText, { color: idType === type ? activeText : inactiveText, fontSize: fs(14) }]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ID Number input */}
          <View style={{ marginTop: vs(12) }}>
            <FormInput
              label={`Your ${idType}`}
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder="0123456789"
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          {/* Phone attached to ID */}
          <View style={{ marginTop: vs(12) }}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(12) }]}>
              Input the number attached to your {idType}
            </Text>
            <FormInput
              label=""
              value={phone}
              onChangeText={setPhone}
              placeholder="080 0000 0000"
              keyboardType="phone-pad"
            />
          </View>

          {/* Info text */}
          <View style={{ marginTop: vs(20) }}>
            <Text style={[styles.info, { color: infoText, fontSize: fs(8), lineHeight: fs(12) }]}>
              Your {idType} is secure. It does not give us access to your other bank accounts or transactions. We will only have access to your full name, gender, date of birth and phone number.
            </Text>
            <Text style={[styles.info, { color: infoText, fontSize: fs(8), lineHeight: fs(12), marginTop: vs(8), textAlign: 'center' }]}>
              PayGenius is Fully Licensed by the CBN
            </Text>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={verifyIdentityMutation.isPending ? 'Verifying...' : 'Continue'}
              onPress={handleContinue}
              disabled={!idNumber.trim() || verifyIdentityMutation.isPending}
              style={!idNumber.trim() ? styles.btnDisabled : undefined}
            />
          </View>
        </View>
      </ScrollView>

      {/* Error overlay modal */}
      <Modal visible={showError} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowError(false)}>
          <View style={styles.modalCard}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="alert" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.errorTitle, { fontSize: fs(14) }]}>Error</Text>
            <Text style={[styles.errorMsg, { fontSize: fs(10) }]}>
              The Number does not match with the {idType}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  inner: { flex: 1 },
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontWeight: '600' },
  subtitle: { fontWeight: '400' },
  illustrationWrap: { alignItems: 'center', justifyContent: 'center' },
  card1: {
    position: 'absolute',
    width: 161,
    height: 91,
    borderRadius: 10,
    transform: [{ rotate: '9.12deg' }],
    shadowColor: '#B200FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  card2: {
    width: 161,
    height: 90,
    borderRadius: 10,
    transform: [{ rotate: '14.42deg' }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
  cardCheck: {
    width: 53,
    height: 53,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: { fontWeight: '400', letterSpacing: 0.25 },
  toggleRow: { flexDirection: 'row' },
  toggleBtn: { borderWidth: 0.4, alignItems: 'center', justifyContent: 'center' },
  toggleText: { fontWeight: '400' },
  info: { fontWeight: '400', textAlign: 'center' },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
  btnDisabled: { opacity: 0.6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.25,
    shadowRadius: 60,
    elevation: 8,
  },
  errorTitle: {
    color: '#FF4D4F',
    fontWeight: '400',
    marginTop: 8,
  },
  errorMsg: {
    color: '#FF8283',
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
  },
  errorIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8283',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    left: 12,
    top: 10,
  },
    marginBottom: 4,
  },
});
