import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useAuthStore } from '@/stores';
import { useGetAboutQuery } from '@/services/support/support.query';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import HelpAvatar from '../../../assets/images/support/help-avatar.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'AboutUs'>;

export function AboutUsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const { data } = useGetAboutQuery();
  const [open, setOpen] = useState<'terms' | 'privacy' | null>(null);
  const about = data?.data;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'there';
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const bodyColor = isDark ? '#AAAAAA' : '#858585';
  const border = isDark ? '#4A4A4A' : '#858585';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(24),
        }}
      >
        <ScreenTitleBar title="About us" onBack={() => navigation.goBack()} />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(21),
          paddingBottom: insets.bottom + vs(32),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <HelpAvatar width={ms(98)} height={ms(98)} />
          <View style={{ flex: 1, marginLeft: hs(20) }}>
            <Text style={{ color: isDark ? '#FFFFFF' : '#191970', fontSize: fs(16), fontWeight: '600' }}>
              Hello {name}
            </Text>
            <Text style={{ color: bodyColor, fontSize: fs(12), marginTop: 3 }}>
              How can we help you?
            </Text>
            <Text style={{ color: bodyColor, fontSize: fs(8), marginTop: 8 }}>
              Email:{' '}
              <Text style={{ color: isDark ? '#A78BFA' : '#7C3AED' }}>
                {about?.email ?? 'paygenius@gmail.com'}
              </Text>
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: vs(32),
            borderWidth: 0.5,
            borderColor: border,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <Text style={{ color: titleColor, fontSize: fs(16), fontWeight: '600' }}>
            {about?.appName ?? 'PayGenius'}
          </Text>
          <Text style={{ color: bodyColor, fontSize: fs(12), marginTop: 6 }}>
            Version {about?.version ?? '1.0.0'}
          </Text>
        </View>

        {(['terms', 'privacy'] as const).map((key) => (
          <Pressable
            key={key}
            onPress={() => setOpen(open === key ? null : key)}
            style={{
              marginTop: 8,
              borderWidth: 0.5,
              borderColor: border,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text style={{ color: isDark ? '#C8C8C8' : '#858585', fontSize: fs(14) }}>
              {key === 'terms' ? 'Terms of use' : 'Privacy policy'}
            </Text>
            {open === key && about?.legal?.[key] ? (
              <Text
                style={{
                  color: isDark ? '#CCCCCC' : '#1A1D23',
                  fontSize: fs(10),
                  marginTop: 10,
                  lineHeight: fs(16),
                }}
              >
                {about.legal[key]}
              </Text>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
