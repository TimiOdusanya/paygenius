import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useAuthStore } from '@/stores';
import { useGetContactQuery, useGetFaqsQuery } from '@/services/support/support.query';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import HelpAvatar from '../../../assets/images/support/help-avatar.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerService'>;

export function CustomerServiceScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const { data: faqData, isLoading } = useGetFaqsQuery();
  const { data: contactData } = useGetContactQuery();
  const [openId, setOpenId] = useState<string | null>(null);
  const faqs = faqData?.data?.faqs ?? [];
  const email = contactData?.data?.email ?? 'paygenius@gmail.com';
  const phone = contactData?.data?.phone ?? '+2348000000000';
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'there';
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const bodyColor = isDark ? '#AAAAAA' : '#858585';
  const line = isDark ? '#4A4A4A' : '#191970';
  const btnBorder = isDark ? '#4A4A4A' : '#858585';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(24),
        }}
      >
        <ScreenTitleBar title="Customer Service Center" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(21),
          paddingBottom: insets.bottom + vs(32),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.helloRow}>
          <HelpAvatar width={ms(98)} height={ms(98)} />
          <View style={{ flex: 1, marginLeft: hs(20), justifyContent: 'center' }}>
            <Text style={{ color: isDark ? '#FFFFFF' : '#191970', fontSize: fs(16), fontWeight: '600' }}>
              Hello {name}
            </Text>
            <Text style={{ color: bodyColor, fontSize: fs(12), marginTop: 3 }}>
              How can we help you?
            </Text>
            <Text style={{ color: bodyColor, fontSize: fs(8), marginTop: 8 }}>
              Email: <Text style={{ color: titleColor }}>{email}</Text>
            </Text>
          </View>
        </View>

        <View style={[styles.actions, { marginTop: vs(28) }]}>
          <Pressable
            onPress={() => navigation.navigate('SupportChat')}
            style={[styles.actionBtn, { borderColor: btnBorder, borderRadius: ms(11) }]}
          >
            <Text style={{ color: bodyColor, fontSize: fs(12) }}>Chat with Us</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(`tel:${phone}`)}
            style={[styles.actionBtn, { borderColor: btnBorder, borderRadius: ms(11) }]}
          >
            <Text style={{ color: bodyColor, fontSize: fs(12) }}>Call Us</Text>
          </Pressable>
        </View>

        <Text
          style={{
            color: titleColor,
            fontSize: fs(16),
            fontWeight: '500',
            letterSpacing: -0.32,
            marginTop: vs(30),
          }}
        >
          FAQs
        </Text>
        <Text style={{ color: isDark ? '#8A8A8A' : '#C4C4C4', fontSize: fs(8), marginTop: 2 }}>
          Frequently asked questions
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#191970" style={{ marginTop: vs(24) }} />
        ) : (
          <View style={{ marginTop: vs(24) }}>
            {faqs.map((faq) => {
              const open = openId === faq.id;
              return (
                <Pressable
                  key={faq.id}
                  onPress={() => setOpenId(open ? null : faq.id)}
                  style={{
                    borderBottomWidth: 0.3,
                    borderBottomColor: line,
                    paddingVertical: vs(14),
                    paddingHorizontal: hs(8),
                  }}
                >
                  <Text style={{ color: bodyColor, fontSize: fs(10) }}>{faq.question}</Text>
                  {open ? (
                    <Text
                      style={{
                        color: isDark ? '#CCCCCC' : '#1A1D23',
                        fontSize: fs(10),
                        marginTop: vs(8),
                        lineHeight: fs(16),
                      }}
                    >
                      {faq.answer}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  helloRow: { flexDirection: 'row', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 23 },
  actionBtn: {
    flex: 1,
    height: 41,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
