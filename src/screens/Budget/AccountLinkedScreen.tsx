import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { PrimaryButton } from '@/components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLinked'>;

const ACCOUNT_LINKED_IMG = require('../../../assets/images/budget/account-linked-check.png');
const BUDGET_CREATED_ICON = require('../../../assets/images/budget/budget-created-icon.png');

export function AccountLinkedScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const [showModal, setShowModal] = useState(false);

  const budgetName = route.params?.budgetName ?? 'Budget';

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const backCardBg = isDark ? '#3A2A6A' : '#E5D8FB';
  const textColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    if (!showModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
      navigation.navigate('BudgetDashboard');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Title block */}
      <View style={[styles.titleBlock, { marginTop: vs(48) }]}>
        <Text style={[styles.title, { color: textColor, fontSize: fs(25), letterSpacing: -0.5 }]}>
          Account Linked
        </Text>
        <Text style={[styles.subtitle, { color: subColor, fontSize: fs(12), marginTop: vs(4) }]}>
          Your Account is Linked successfully
        </Text>
      </View>

      {/* Illustration */}
      <View style={[styles.illustrationWrap, { marginTop: vs(20) }]}>
        {/* Back card - tilted lavender */}
        <View
          style={[
            styles.backCard,
            {
              backgroundColor: backCardBg,
              borderRadius: ms(21),
              width: 297,
              height: 292,
              transform: [{ rotate: '9.83deg' }],
            },
          ]}
        />
        {/* Front card - from Figma image asset */}
        <Image
          source={ACCOUNT_LINKED_IMG}
          style={[
            styles.frontCard,
            {
              width: 297,
              height: 292,
              borderRadius: ms(21),
            },
          ]}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1 }} />

      {/* Proceed button */}
      <View style={[styles.btnWrapper, { paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(16)) }]}>
        <PrimaryButton title="Proceed" onPress={handleProceed} />
      </View>

      {/* Budget Created Modal */}
      <Modal visible={showModal} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalBg}>
          <View style={[
            styles.modalCard,
            {
              backgroundColor: isDark ? '#1E1E2E' : '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.25,
              shadowRadius: 59.3,
              elevation: 14,
            },
          ]}>
            <View style={styles.modalContent}>
              {/* Icon */}
              <Image
                source={BUDGET_CREATED_ICON}
                style={{ width: ms(105), height: ms(105) }}
                resizeMode="contain"
              />

              {/* Budget Created text */}
              <Text style={[styles.modalTitle, { color: '#10B981', fontSize: fs(14), marginTop: vs(12) }]}>
                Budget Created
              </Text>
              <Text style={[styles.modalBody, { color: isDark ? '#AAAAAA' : '#858585', fontSize: fs(12), marginTop: vs(4) }]}>
                You have created a Budget for{'\n'}{budgetName}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  titleBlock: { alignItems: 'center' },
  title: { fontWeight: '600', textAlign: 'center' },
  subtitle: { fontWeight: '400', textAlign: 'center' },
  illustrationWrap: {
    width: 342,
    height: 338,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCard: { position: 'absolute' },
  frontCard: { overflow: 'hidden' },
  btnWrapper: { width: '100%' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: 332,
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  modalContent: { alignItems: 'center' },
  modalTitle: { fontWeight: '700', textAlign: 'center' },
  modalBody: { fontWeight: '400', textAlign: 'center', lineHeight: 18 },
});
