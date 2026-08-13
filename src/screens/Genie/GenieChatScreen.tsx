import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuthStore } from '@/stores';
import { BackButton } from '@/components/BackButton';
import { EmptyState } from '@/components/EmptyState';
import {
  useGetGenieChatQuery,
  useListGenieChatsQuery,
  useSendGenieMessageMutation,
} from '@/services/genie/genie.query';
import type { GenieMessage } from '@/services/genie/genie.type';
import MenuIcon from '../../../assets/images/genie/menu.svg';
import SendIcon from '../../../assets/images/genie/send.svg';
import MicIcon from '../../../assets/images/genie/mic.svg';
import GalleryIcon from '../../../assets/images/genie/gallery.svg';
import NewChatIcon from '../../../assets/images/genie/new-chat.svg';
import LibraryIcon from '../../../assets/images/genie/library.svg';

const AVATAR = require('../../../assets/images/genie/chat-avatar.png');

type DrawerView = 'chats' | 'library';

type Props = {
  onBack: () => void;
};

export function GenieChatScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms, width } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const [chatId, setChatId] = React.useState<string | null>(null);
  const [composeNew, setComposeNew] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [pending, setPending] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerView, setDrawerView] = React.useState<DrawerView>('chats');
  const [search, setSearch] = React.useState('');
  const scrollRef = React.useRef<ScrollView>(null);

  const { data: listData, isLoading: listLoading } = useListGenieChatsQuery();
  const { data: chatData, isLoading: chatLoading } = useGetGenieChatQuery(chatId);
  const sendMutation = useSendGenieMessageMutation();

  const chats = listData?.data?.chats ?? [];
  const chat = chatData?.data?.chat ?? null;
  const messages: GenieMessage[] = chat?.messages ?? [];
  const filteredChats = chats.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.preview || '').toLowerCase().includes(q)
    );
  });

  React.useEffect(() => {
    if (composeNew || chatId || chats.length === 0) return;
    setChatId(chats[0]._id);
  }, [chats, chatId, composeNew]);

  React.useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length, pending]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const title = isDark ? '#FFFFFF' : '#191970';
  const bubble = isDark ? '#3A2A5C' : '#D5C7F7';
  const bubbleBorder = isDark ? '#6B4A8A' : '#E3B9F5';
  const bubbleText = isDark ? '#FFFFFF' : '#000000';
  const inputBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(227,185,245,0.4)' : 'rgba(227,185,245,0.7)';
  const drawerBg = isDark ? '#161616' : '#FFFFFF';
  const drawerBorder = isDark ? '#3B3B3B' : '#6D6D8C';
  const drawerItem = isDark ? '#AAAAAA' : '#6D6D8C';
  const userText = isDark ? '#FFFFFF' : '#000000';

  const handleSend = () => {
    const content = draft.trim();
    if (!content || sendMutation.isPending) return;
    setDraft('');
    setPending(content);
    sendMutation.mutate(
      { chatId, content },
      {
        onSuccess: (result) => {
          const id = result.data?.chat?._id || result.chatId;
          if (id) setChatId(id);
          setComposeNew(false);
          setPending(null);
        },
        onError: (error: any) => {
          setPending(null);
          setDraft(content);
          Alert.alert('Genie', error?.message || 'Could not send that message. Try again.');
        },
      }
    );
  };

  const handleNewChat = () => {
    setComposeNew(true);
    setChatId(null);
    setPending(null);
    setDrawerView('chats');
    setDrawerOpen(false);
  };

  const renderUser = (content: string, key: string) => (
    <View key={key} style={[styles.userRow, { alignSelf: 'flex-end' }]}>
      <Text
        style={{
          color: userText,
          fontSize: fs(10),
          marginRight: 14,
          maxWidth: hs(280),
          textAlign: 'right',
        }}
      >
        {content}
      </Text>
      <Image
        source={user?.profilePicture ? { uri: user.profilePicture } : AVATAR}
        style={{ width: ms(32), height: ms(32), borderRadius: ms(16) }}
      />
    </View>
  );

  const renderBot = (content: string, key: string) => (
    <View key={key} style={[styles.userRow, { alignSelf: 'flex-start' }]}>
      <Image
        source={AVATAR}
        style={{ width: ms(32), height: ms(32), borderRadius: ms(16) }}
      />
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubble,
            borderColor: bubbleBorder,
            width: hs(192),
            marginLeft: 8,
          },
        ]}
      >
        <Text style={{ color: bubbleText, fontSize: fs(10), lineHeight: fs(15) }}>
          {content}
        </Text>
      </View>
    </View>
  );

  const showChatEmpty = !chatLoading && messages.length === 0 && !pending;
  const isBusy = Boolean(chatId) && chatLoading && !chat;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: hs(21), paddingTop: vs(24), minHeight: vs(70) }}>
          <BackButton onPress={onBack} />
          <Text
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: vs(46),
              color: title,
              fontSize: fs(16),
              fontWeight: '600',
              letterSpacing: -0.32,
              textAlign: 'center',
            }}
          >
            Genie AI
          </Text>
          <Pressable
            onPress={() => setDrawerOpen(true)}
            hitSlop={8}
            style={{ marginTop: vs(11), width: 24 }}
          >
            <MenuIcon width={ms(19)} height={ms(12)} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: hs(22),
          paddingTop: vs(16),
          paddingBottom: vs(16),
          gap: vs(24),
        }}
        showsVerticalScrollIndicator={false}
      >
        {isBusy ? (
          <ActivityIndicator color="#7C3AED" style={{ marginTop: 40 }} />
        ) : showChatEmpty ? (
          <View style={styles.emptyFill}>
            <EmptyState
              variant="chat"
              title="Genie is ready when you are"
              subtitle="Ask about spending, budgets, or savings — I’ll pull it from your account."
            />
          </View>
        ) : (
          <>
            {messages.map((msg, index) =>
              msg.role === 'user'
                ? renderUser(msg.content, `${msg.createdAt}-${index}`)
                : renderBot(msg.content, `${msg.createdAt}-${index}`)
            )}
            {pending ? renderUser(pending, 'pending-user') : null}
            {sendMutation.isPending ? (
              <ActivityIndicator color="#7C3AED" style={{ alignSelf: 'flex-start', marginLeft: ms(40) }} />
            ) : null}
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.composer,
          {
            paddingHorizontal: hs(14),
            paddingBottom: insets.bottom + vs(10),
            gap: hs(8),
          },
        ]}
      >
        <GalleryIcon width={ms(61)} height={ms(61)} />
        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: inputBg,
              borderColor: inputBorder,
              height: ms(61),
              borderRadius: ms(19),
              flex: 1,
              paddingLeft: hs(16),
              paddingRight: hs(8),
            },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask Genie anything"
            placeholderTextColor="#858585"
            style={{
              flex: 1,
              color: isDark ? '#FFFFFF' : '#1A1D23',
              fontSize: fs(16),
              fontStyle: 'italic',
              fontWeight: '200',
            }}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <MicIcon width={ms(18)} height={ms(21)} />
          <Pressable onPress={handleSend} disabled={sendMutation.isPending}>
            <SendIcon width={ms(42)} height={ms(42)} />
          </Pressable>
        </View>
      </View>

      <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setDrawerOpen(false)} />
          <View
            style={[
              styles.drawer,
              {
                backgroundColor: drawerBg,
                borderColor: drawerBorder,
                width: Math.min(hs(281), width * 0.74),
                paddingTop: insets.top + vs(16),
              },
            ]}
          >
            <View
              style={[
                styles.search,
                {
                  borderColor: drawerItem,
                  marginLeft: hs(22),
                  width: hs(183),
                  height: ms(34),
                  borderRadius: 79,
                },
              ]}
            >
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search"
                placeholderTextColor="rgba(109,109,140,0.7)"
                style={{
                  color: isDark ? '#FFFFFF' : '#1A1D23',
                  fontSize: fs(10),
                  padding: 0,
                }}
              />
            </View>

            <Pressable
              onPress={handleNewChat}
              style={[
                styles.drawerItem,
                { borderBottomColor: isDark ? '#3B3B3B' : '#03055B', marginTop: vs(16) },
              ]}
            >
              <NewChatIcon width={ms(20)} height={ms(20)} />
              <Text style={{ color: drawerItem, fontSize: fs(10), marginLeft: 7 }}>New Chat</Text>
            </Pressable>
            <Pressable
              onPress={() => setDrawerView('library')}
              style={[
                styles.drawerItem,
                {
                  borderBottomColor: isDark ? '#3B3B3B' : '#03055B',
                  backgroundColor: drawerView === 'library' ? (isDark ? '#1E1E1E' : '#F7F7F7') : 'transparent',
                },
              ]}
            >
              <LibraryIcon width={ms(16)} height={ms(16)} />
              <Text style={{ color: drawerItem, fontSize: fs(10), marginLeft: 7 }}>Library</Text>
            </Pressable>

            <Text
              style={{
                color: isDark ? '#FFFFFF' : '#03055B',
                fontSize: fs(16),
                marginTop: vs(20),
                paddingHorizontal: hs(21),
              }}
            >
              {drawerView === 'library' ? 'Library' : 'Former Chats'}
            </Text>

            {drawerView === 'library' ? (
              <View style={styles.emptyFill}>
                <EmptyState
                  variant="history"
                  compact
                  title="Nothing saved yet"
                  subtitle="Pinned conversations will appear here."
                />
              </View>
            ) : listLoading ? (
              <ActivityIndicator color="#7C3AED" style={{ marginTop: 32 }} />
            ) : filteredChats.length === 0 ? (
              <View style={styles.emptyFill}>
                <EmptyState
                  variant="history"
                  compact
                  title={search ? 'No matching chats' : 'No conversations yet'}
                  subtitle={
                    search
                      ? 'Try a different name or topic.'
                      : 'Start a chat and it will live here.'
                  }
                />
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ paddingTop: vs(18), paddingBottom: vs(24), gap: vs(22) }}>
                {filteredChats.map((item) => (
                  <Pressable
                    key={item._id}
                    onPress={() => {
                      setComposeNew(false);
                      setChatId(item._id);
                      setDrawerView('chats');
                      setDrawerOpen(false);
                    }}
                    style={{ paddingHorizontal: hs(22) }}
                  >
                    <Text
                      style={{
                        color: item._id === chatId ? '#7C3AED' : drawerItem,
                        fontSize: fs(10),
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  emptyFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  bubble: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 12,
  },
  composer: { flexDirection: 'row', alignItems: 'center' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    gap: 8,
  },
  modalRoot: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  drawer: {
    height: '100%',
    zIndex: 2,
    borderRightWidth: 1,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  search: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 0.6,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 21,
    borderBottomWidth: 0.2,
  },
});
