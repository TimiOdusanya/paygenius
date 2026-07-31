import React, { useEffect, useState } from 'react';
import {
  Modal,
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
import AccountLinkedCheck from '../../../assets/images/budget/account-linked-check.svg';
import BudgetCreatedIcon from '../../../assets/images/budget/budget-created-icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLinked'>;

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

  const cardW = ms(297);
  const cardH = ms(292);

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
      <View style={[styles.titleBlock, { marginTop: vs(48) }]}>
        <Text style={[styles.title, { color: textColor, fontSize: fs(25), letterSpacing: -0.5 }]}>
          Account Linked
        </Text>
        <Text style={[styles.subtitle, { color: subColor, fontSize: fs(12), marginTop: vs(4) }]}>
          Your Account is Linked successfully
        </Text>
      </View>

      <View style={[styles.illustrationWrap, { marginTop: vs(20), width: cardW + ms(45), height: cardH + ms(46) }]}>
        <View
          style={[
            styles.backCard,
            {
              backgroundColor: backCardBg,
              borderRadius: ms(21),
              width: cardW,
              height: cardH,
              transform: [{ rotate: '9.83deg' }],
            },
          ]}
        />
        <View style={[styles.frontCard, { borderRadius: ms(21), overflow: 'hidden' }]}>
          <AccountLinkedCheck width={cardW} height={cardH} />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={[styles.btnWrapper, { paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(16)) }]}>
        <PrimaryButton title="Proceed" onPress={handleProceed} />
      </View>

      <Modal visible={showModal} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? '#1E1E2E' : '#FFFFFF',
                width: ms(332),
                borderRadius: ms(12),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 14 },
                shadowOpacity: 0.25,
                shadowRadius: 59.3,
                elevation: 14,
              },
            ]}
          >
            <View style={styles.modalContent}>
              <BudgetCreatedIcon width={ms(105)} height={ms(105)} />
              <Text style={[styles.modalTitle, { color: '#10B981', fontSize: fs(14), marginTop: vs(12) }]}>
                Budget Created
              </Text>
              <Text
                style={[
                  styles.modalBody,
                  { color: isDark ? '#AAAAAA' : '#858585', fontSize: fs(12), marginTop: vs(4) },
                ]}
              >
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCard: { position: 'absolute' },
  frontCard: {},
  btnWrapper: { width: '100%' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  modalContent: { alignItems: 'center' },
  modalTitle: { fontWeight: '700', textAlign: 'center' },
  modalBody: { fontWeight: '400', textAlign: 'center', lineHeight: 18 },
});
