import React, { useState } from 'react';
import {
  Image,
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
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useVerifyIdentityMutation } from '@/services/profile/profile.query';
import { getApiErrorMessage } from '@/utils/errors';
import IdentityCheck from '../../../assets/images/kyc/identity-check.svg';

const IDENTITY_PHOTO = require('../../../assets/images/kyc/identity-photo.jpg');
const CBN_LOGO = require('../../../assets/images/kyc/cbn-logo.png');

type IDType = 'BVN' | 'NIN';
type Props = NativeStackScreenProps<RootStackParamList, 'IdentityVerification'>;

export function IdentityVerificationScreen({ navigation }: Props) {
  useTrackOnboardingRoute('IdentityVerification');
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
  const inputBorder = isDark ? '#3B3B3B' : '#191970';
  const inputBg = isDark ? '#2A2A2A' : '#FAFAFC';
  const infoText = isDark ? '#666666' : '#858585';
  const activeBg = isDark ? '#1A3B2E' : '#AFE9DC';
  const activeText = isDark ? '#FFFFFF' : '#1A1D23';
  const inactiveText = 'rgba(133,133,133,0.6)';
  const card1Bg = isDark ? '#2A4A40' : '#C6F0E2';
  const card2Bg = isDark ? '#3A2060' : '#E5D8FB';
  const checkBg = isDark ? '#1A3B2E' : '#AFE9D6';

  const handleContinue = () => {
    if (!idNumber.trim()) return;
    if (idType === 'BVN' && !phone.trim()) return;

    const payload: {
      type: IDType;
      number: string;
      phoneNumber?: string;
    } = { type: idType, number: idNumber.trim() };

    if (idType === 'BVN') {
      payload.phoneNumber = phone.trim();
    }

    verifyIdentityMutation.mutate(payload, {
      onSuccess: () => navigation.navigate('VerificationCompleted'),
      onError: (err) => {
        setErrorMsg(
          getApiErrorMessage(err, `The number does not match with the ${idType}`)
        );
        setShowError(true);
      },
    });
  };

  const canContinue =
    Boolean(idNumber.trim()) &&
    (idType === 'NIN' || Boolean(phone.trim())) &&
    !verifyIdentityMutation.isPending;

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
          <Header
            onBack={() => navigation.goBack()}
            title="Verify Your Identity"
            description="Choose an ID type"
          />

          {/* Figma illustration: stacked ID cards + photo + check */}
          <View style={[styles.illustrationWrap, { marginTop: vs(12), height: vs(130) }]}>
            <View
              style={[
                styles.card1,
                {
                  backgroundColor: card1Bg,
                  width: ms(161),
                  height: ms(91),
                  borderRadius: ms(10),
                },
              ]}
            />
            <View
              style={[
                styles.card2,
                {
                  backgroundColor: card2Bg,
                  width: ms(161),
                  height: ms(90),
                  borderRadius: ms(10),
                  paddingLeft: ms(18),
                  paddingRight: ms(12),
                },
              ]}
            >
              <View
                style={[
                  styles.photoCircle,
                  {
                    width: ms(41),
                    height: ms(58),
                    borderRadius: ms(108),
                    borderColor: '#7C3AED',
                  },
                ]}
              >
                <Image
                  source={IDENTITY_PHOTO}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
              </View>
              <View
                style={[
                  styles.cardCheck,
                  {
                    width: ms(53),
                    height: ms(53),
                    borderRadius: ms(27),
                    backgroundColor: checkBg,
                  },
                ]}
              >
                <IdentityCheck width={ms(28)} height={ms(27)} />
              </View>
            </View>
          </View>

          {/* ID Toggle */}
          <View style={{ marginTop: vs(16) }}>
            <Text
              style={[
                styles.fieldLabel,
                { color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(11) },
              ]}
            >
              Choose ID
            </Text>
            <View style={[styles.toggleRow, { marginTop: vs(8), gap: hs(8) }]}>
              {(['BVN', 'NIN'] as IDType[]).map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setIdType(type);
                    setIdNumber('');
                    setPhone('');
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
                  <Text
                    style={[
                      styles.toggleText,
                      {
                        color: idType === type ? activeText : inactiveText,
                        fontSize: fs(14),
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ marginTop: vs(12) }}>
            <FormInput
              label={`Your ${idType}`}
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder={idType === 'NIN' ? 'AB012345678910YZ' : '0123456789'}
              autoCapitalize={idType === 'NIN' ? 'characters' : 'none'}
              keyboardType={idType === 'NIN' ? 'default' : 'numeric'}
              maxLength={idType === 'NIN' ? 16 : 11}
            />
          </View>

          {/* Phone is BVN-only (hidden for NIN per Figma 1:11870) */}
          {idType === 'BVN' ? (
            <View style={{ marginTop: vs(12) }}>
              <FormInput
                label="Input the number attached to your BVN"
                value={phone}
                onChangeText={setPhone}
                placeholder="080 0000 0000"
                keyboardType="phone-pad"
              />
            </View>
          ) : null}

          <View style={{ marginTop: vs(20), alignItems: 'center' }}>
            <Text
              style={[
                styles.info,
                {
                  color: infoText,
                  fontSize: fs(8),
                  lineHeight: fs(12),
                  width: hs(264),
                },
              ]}
            >
              Your {idType} is secure. It does not give us access to your other
              bank accounts or transactions. We will only have access to your
              full name, gender, date of birth and phone number.
            </Text>
            <Text
              style={[
                styles.info,
                {
                  color: infoText,
                  fontSize: fs(8),
                  lineHeight: fs(12),
                  marginTop: vs(8),
                },
              ]}
            >
              PayGenius is Fully Licensed by the CBN
            </Text>
            <Image
              source={CBN_LOGO}
              style={{
                width: ms(51),
                height: ms(68),
                marginTop: vs(6),
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={
                verifyIdentityMutation.isPending ? 'Verifying...' : 'Continue'
              }
              onPress={handleContinue}
              disabled={!canContinue}
              style={!canContinue ? styles.btnDisabled : undefined}
            />
          </View>
        </View>
      </ScrollView>

      <Modal visible={showError} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowError(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="alert" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.errorTitle, { fontSize: fs(14) }]}>Error</Text>
            <Text style={[styles.errorMsg, { fontSize: fs(10) }]}>
              {errorMsg || `The number does not match with the ${idType}`}
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
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card1: {
    position: 'absolute',
    transform: [{ rotate: '9.12deg' }],
    shadowColor: '#B200FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  card2: {
    transform: [{ rotate: '14.42deg' }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoCircle: {
    borderWidth: 2,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  cardCheck: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8.11deg' }],
  },
  fieldLabel: { fontWeight: '400', letterSpacing: 0.25 },
  toggleRow: { flexDirection: 'row' },
  toggleBtn: {
    borderWidth: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});
