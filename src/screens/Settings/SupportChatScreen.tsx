import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useAuthStore } from '@/stores';
import {
  useGetSupportChatQuery,
  useSendSupportChatMutation,
} from '@/services/support/support.query';
import type { SupportMessage, SupportTopic } from '@/services/support/support.type';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportChat'>;

const TOPICS: { label: string; topic: SupportTopic; tone: 'purple' | 'green' }[] = [
  { label: 'Report a failed Transaction', topic: 'failed_transaction', tone: 'purple' },
  { label: 'Card Request', topic: 'card_request', tone: 'green' },
  { label: 'Account Issue', topic: 'account_issue', tone: 'purple' },
  { label: 'eSIMs (Mobile Data)', topic: 'esims', tone: 'green' },
  { label: 'Overdraft', topic: 'overdraft', tone: 'purple' },
  { label: 'Gift Cards', topic: 'gift_cards', tone: 'green' },
  { label: 'Savings', topic: 'savings', tone: 'green' },
  { label: 'Invest', topic: 'invest', tone: 'purple' },
];

export function SupportChatScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const { data } = useGetSupportChatQuery();
  const send = useSendSupportChatMutation();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<SupportMessage>>(null);
  const messages = data?.data?.messages ?? [];
  const firstName = user?.firstName ?? 'there';
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const inputBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const border = isDark ? '#4A4A4A' : '#858585';

  useEffect(() => {
    if (messages.length) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const sendText = (body: string, topic?: SupportTopic) => {
    const text = body.trim();
    if (!text || send.isPending) return;
    send.mutate({ body: text, topic });
    setDraft('');
  };

  const chipStyle = (tone: 'purple' | 'green') => ({
    backgroundColor: tone === 'purple' ? (isDark ? '#3B2A55' : '#E5D8FB') : isDark ? '#1E3A2F' : '#AFE9D6',
    color: tone === 'purple' ? '#7C3AED' : '#10B981',
    underline: tone === 'purple' ? '#7C3AED' : '#10B981',
  });

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(16),
        }}
      >
        <ScreenTitleBar title="Chat with Support" onBack={() => navigation.goBack()} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingHorizontal: hs(30),
          paddingBottom: vs(16),
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <View>
            <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(16), lineHeight: fs(20) }}>
              Hi <Text style={{ fontWeight: '700', color: isDark ? '#C4B5FD' : '#191970' }}>{firstName}</Text>,
            </Text>
            <Text
              style={{
                color: isDark ? '#FFFFFF' : '#000000',
                fontSize: fs(16),
                lineHeight: fs(20),
                marginTop: vs(8),
              }}
            >
              Welcome to PayGenius Microfinance bank. What do you need help with
            </Text>
            <View style={{ marginTop: vs(24), gap: 7 }}>
              {TOPICS.slice(0, 4).map((item) => {
                const tone = chipStyle(item.tone);
                return (
                  <Pressable
                    key={item.topic}
                    onPress={() => sendText(item.label, item.topic)}
                    style={{
                      backgroundColor: tone.backgroundColor,
                      height: ms(41),
                      borderRadius: ms(10),
                      justifyContent: 'center',
                      paddingHorizontal: hs(17),
                      maxWidth: hs(286),
                    }}
                  >
                    <Text style={{ color: tone.color, fontSize: fs(12) }}>{item.label}</Text>
                    <View
                      style={{
                        height: 2,
                        width: Math.min(item.label.length * 7, 161),
                        backgroundColor: tone.underline,
                        borderRadius: 18,
                        marginTop: 2,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: vs(16), maxWidth: hs(232) }}>
              {TOPICS.slice(4).map((item) => {
                const tone = chipStyle(item.tone);
                return (
                  <Pressable
                    key={item.topic}
                    onPress={() => sendText(item.label, item.topic)}
                    style={{
                      backgroundColor: tone.backgroundColor,
                      height: ms(41),
                      width: hs(112),
                      borderRadius: ms(10),
                      justifyContent: 'center',
                      paddingHorizontal: hs(12),
                    }}
                  >
                    <Text style={{ color: tone.color, fontSize: fs(12) }}>{item.label}</Text>
                    <View
                      style={{
                        height: 2,
                        width: 36,
                        backgroundColor: tone.underline,
                        borderRadius: 18,
                        marginTop: 2,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const mine = item.role === 'user';
          return (
            <View
              style={{
                alignSelf: mine ? 'flex-end' : 'flex-start',
                backgroundColor: mine
                  ? isDark
                    ? '#3B2A55'
                    : '#E5D8FB'
                  : isDark
                    ? '#2A2A2A'
                    : '#EDEDED',
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginTop: 10,
                maxWidth: '86%',
              }}
            >
              <Text style={{ color: isDark ? '#FFFFFF' : '#1A1D23', fontSize: fs(12) }}>
                {item.body}
              </Text>
            </View>
          );
        }}
      />

      <View
        style={{
          marginHorizontal: hs(21),
          marginBottom: insets.bottom + vs(12),
          height: 57,
          borderRadius: 28,
          borderWidth: 0.5,
          borderColor: border,
          backgroundColor: inputBg,
          justifyContent: 'center',
          paddingHorizontal: 14,
        }}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a Message"
          placeholderTextColor="rgba(133,133,133,0.5)"
          onSubmitEditing={() => sendText(draft)}
          returnKeyType="send"
          style={{ color: isDark ? '#FFFFFF' : '#1A1D23', fontSize: fs(10) }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
