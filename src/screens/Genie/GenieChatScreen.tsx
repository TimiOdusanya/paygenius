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
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { EmptyState } from '@/components/EmptyState';
import {
  useCreateGenieChatMutation,
  useGetGenieChatQuery,
  useListGenieChatsQuery,
  useSendGenieMessageMutation,
} from '@/services/genie/genie.query';
import type { GenieAttachment, GenieMessage } from '@/services/genie/genie.type';
import { GenieTypingBubble } from '@/components/GenieTypingBubble';
import { VoiceNoteBubble } from '@/components/VoiceNoteBubble';
import { formatDuration, uriToDataUri } from './genieMedia';
import { getApiErrorMessage } from '@/utils/errors';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import MenuIcon from '../../../assets/images/genie/menu.svg';
import SendIcon from '../../../assets/images/genie/send.svg';
import MicIcon from '../../../assets/images/genie/mic.svg';
import GalleryIcon from '../../../assets/images/genie/gallery.svg';
import NewChatIcon from '../../../assets/images/genie/new-chat.svg';
import LibraryIcon from '../../../assets/images/genie/library.svg';

const GENIE_AVATAR = require('../../../assets/images/genie/chat-avatar.png');
const USER_AVATAR = require('../../../assets/images/profile/avatar-default.png');

type DrawerView = 'chats' | 'library';

type DraftImage = { previewUri: string; dataUri: string; mimeType: string };
type DraftAudio = { dataUri: string; mimeType: string; durationMs: number };
type PendingSend = {
  content: string;
  imageUri?: string;
  audioUri?: string;
  durationMs?: number;
};

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
  const [draftImage, setDraftImage] = React.useState<DraftImage | null>(null);
  const [draftAudio, setDraftAudio] = React.useState<DraftAudio | null>(null);
  const [pending, setPending] = React.useState<PendingSend | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [recordMs, setRecordMs] = React.useState(0);
  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const recordTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerView, setDrawerView] = React.useState<DrawerView>('chats');
  const [search, setSearch] = React.useState('');
  const scrollRef = React.useRef<ScrollView>(null);

  const { data: listData, isLoading: listLoading } = useListGenieChatsQuery();
  const { data: chatData, isLoading: chatLoading } = useGetGenieChatQuery(chatId);
  const sendMutation = useSendGenieMessageMutation();
  const createChat = useCreateGenieChatMutation();

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
  }, [messages.length, pending, sendMutation.isPending, draftImage, draftAudio]);

  React.useEffect(() => {
    return () => {
      if (recordTimer.current) clearInterval(recordTimer.current);
      recordingRef.current?.stopAndUnloadAsync().catch(() => undefined);
    };
  }, []);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const bubble = isDark ? '#3A2A5C' : '#D5C7F7';
  const bubbleBorder = isDark ? '#6B4A8A' : '#E3B9F5';
  const bubbleText = isDark ? '#FFFFFF' : '#000000';
  const inputBg = isDark ? '#2A2A2A' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(227,185,245,0.4)' : 'rgba(227,185,245,0.7)';
  const drawerBg = isDark ? '#161616' : '#FFFFFF';
  const drawerBorder = isDark ? '#3B3B3B' : '#6D6D8C';
  const drawerItem = isDark ? '#AAAAAA' : '#6D6D8C';
  const userText = isDark ? '#FFFFFF' : '#000000';

  const clearComposer = () => {
    setDraft('');
    setDraftImage(null);
    setDraftAudio(null);
  };

  const pickImage = async () => {
    if (sendMutation.isPending || recording) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photos', 'Allow photo access so Genie can see receipts or bills.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.55,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const mime = asset.mimeType ?? 'image/jpeg';
    const dataUri = asset.base64 ? `data:${mime};base64,${asset.base64}` : await uriToDataUri(asset.uri, mime);
    setDraftImage({ previewUri: asset.uri, dataUri, mimeType: mime });
  };

  const stopRecording = async () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
      recordTimer.current = null;
    }
    const active = recordingRef.current;
    recordingRef.current = null;
    setRecording(false);
    if (!active) return;
    try {
      const status = await active.getStatusAsync();
      await active.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      const uri = active.getURI();
      if (!uri) return;
      const durationMs = status.isLoaded ? status.durationMillis || recordMs : recordMs;
      if (durationMs < 400) {
        Alert.alert('Voice note', 'Hold a little longer so Genie can hear you.');
        return;
      }
      const ext = (uri.split('.').pop() || 'm4a').toLowerCase();
      const mime =
        ext === 'wav'
          ? 'audio/wav'
          : ext === 'mp3'
            ? 'audio/mpeg'
            : ext === '3gp'
              ? 'audio/3gpp'
              : 'audio/m4a';
      const dataUri = await uriToDataUri(uri, mime);
      setDraftAudio({ dataUri, mimeType: mime, durationMs });
    } catch {
      Alert.alert('Voice note', 'Could not save that recording. Try again.');
    }
  };

  const toggleRecording = async () => {
    if (sendMutation.isPending) return;
    if (recording) {
      await stopRecording();
      return;
    }
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Microphone', 'Allow the mic so you can send Genie a voice note.');
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: next } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = next;
      setRecording(true);
      setRecordMs(0);
      recordTimer.current = setInterval(() => {
        setRecordMs((ms) => {
          if (ms >= 45000) {
            stopRecording();
            return ms;
          }
          return ms + 200;
        });
      }, 200);
    } catch {
      Alert.alert('Voice note', 'Could not start recording.');
    }
  };

  const handleSend = () => {
    const content = draft.trim();
    if (sendMutation.isPending || recording) return;
    if (!content && !draftImage && !draftAudio) return;
    const image = draftImage;
    const audio = draftAudio;
    setPending({
      content,
      imageUri: image?.previewUri || image?.dataUri,
      audioUri: audio?.dataUri,
      durationMs: audio?.durationMs,
    });
    clearComposer();
    sendMutation.mutate(
      {
        chatId,
        content: content || undefined,
        image: image ? { uri: image.dataUri, mimeType: image.mimeType } : undefined,
        audio: audio
          ? { uri: audio.dataUri, mimeType: audio.mimeType, durationMs: audio.durationMs }
          : undefined,
      },
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
          setDraftImage(image);
          setDraftAudio(audio);
          Alert.alert(
            'Genie',
            getApiErrorMessage(error, 'Could not send that message. Try again.')
          );
        },
      }
    );
  };

  const openChat = (id: string) => {
    setComposeNew(false);
    setChatId(id);
    setPending(null);
    clearComposer();
    setDrawerView('chats');
    setDrawerOpen(false);
  };

  const handleNewChat = () => {
    setDrawerView('chats');
    setDrawerOpen(false);
    setPending(null);
    clearComposer();
    if (chatId && messages.length === 0 && !pending) {
      return;
    }
    setComposeNew(true);
    setChatId(null);
    createChat.mutate(undefined, {
      onSuccess: (result) => {
        const id = result.data?.chat?._id;
        if (id) {
          setComposeNew(false);
          setChatId(id);
        }
      },
      onError: () => {
        setComposeNew(true);
        setChatId(null);
      },
    });
  };

  const renderUser = (
    content: string,
    key: string,
    extras?: {
      attachments?: GenieAttachment[];
      imageUri?: string;
      audioUri?: string;
      durationMs?: number;
    }
  ) => {
    const image =
      extras?.imageUri || extras?.attachments?.find((item) => item.type === 'image')?.uri;
    const audio =
      extras?.attachments?.find((item) => item.type === 'audio') ||
      (extras?.audioUri
        ? { type: 'audio' as const, uri: extras.audioUri, durationMs: extras.durationMs }
        : undefined);
    const caption =
      content && content !== 'Photo' && content !== 'Voice note' ? content : '';
    return (
      <View key={key} style={[styles.msgRow, { alignSelf: 'flex-end', alignItems: 'flex-end' }]}>
        <View style={{ marginRight: 6, maxWidth: hs(280), alignItems: 'flex-end' }}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: hs(168),
                height: vs(168),
                borderRadius: 10,
                marginBottom: caption || audio ? 6 : 0,
              }}
            />
          ) : null}
          {audio ? (
            <VoiceNoteBubble
              uri={audio.uri}
              durationMs={audio.durationMs}
              textColor={userText}
              accent="#7C3AED"
            />
          ) : null}
          {caption ? (
            <Text style={{ color: userText, fontSize: fs(10), textAlign: 'right' }}>
              {caption}
            </Text>
          ) : null}
        </View>
        <Image
          source={user?.profilePicture ? { uri: user.profilePicture } : USER_AVATAR}
          style={{ width: ms(32), height: ms(32), borderRadius: ms(16) }}
        />
      </View>
    );
  };

  const renderBot = (content: string, key: string) => (
    <View key={key} style={[styles.msgRow, { alignSelf: 'flex-start' }]}>
      <Image
        source={GENIE_AVATAR}
        style={{ width: ms(32), height: ms(32), borderRadius: ms(16), marginRight: 6 }}
      />
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubble,
            borderColor: bubbleBorder,
            maxWidth: hs(248),
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
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
          marginBottom: vs(8),
        }}
      >
        <ScreenTitleBar
          title="Genie AI"
          onBack={onBack}
          right={
            <Pressable
              onPress={() => setDrawerOpen(true)}
              hitSlop={10}
              style={styles.menuBtn}
            >
              <MenuIcon
                width={ms(19)}
                height={ms(12)}
                color={isDark ? '#FFFFFF' : '#000000'}
              />
            </Pressable>
          }
        />
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
          <View style={[styles.msgRow, { alignSelf: 'flex-start', marginTop: vs(12) }]}>
            <Image
              source={GENIE_AVATAR}
              style={{ width: ms(32), height: ms(32), borderRadius: ms(16), marginRight: 6 }}
            />
            <GenieTypingBubble
              backgroundColor={bubble}
              borderColor={bubbleBorder}
              dotColor={isDark ? '#E8D9FF' : '#6D6D8C'}
            />
          </View>
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
                ? renderUser(msg.content, `${msg.createdAt}-${index}`, {
                    attachments: msg.attachments,
                  })
                : renderBot(msg.content, `${msg.createdAt}-${index}`)
            )}
            {pending
              ? renderUser(pending.content, 'pending-user', {
                  imageUri: pending.imageUri,
                  audioUri: pending.audioUri,
                  durationMs: pending.durationMs,
                })
              : null}
            {sendMutation.isPending ? (
              <View style={[styles.msgRow, { alignSelf: 'flex-start' }]}>
                <Image
                  source={GENIE_AVATAR}
                  style={{ width: ms(32), height: ms(32), borderRadius: ms(16), marginRight: 6 }}
                />
                <GenieTypingBubble
                  backgroundColor={bubble}
                  borderColor={bubbleBorder}
                  dotColor={isDark ? '#E8D9FF' : '#6D6D8C'}
                />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      {(draftImage || draftAudio || recording) ? (
        <View
          style={{
            paddingHorizontal: hs(22),
            paddingBottom: vs(8),
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {draftImage ? (
            <View>
              <Image
                source={{ uri: draftImage.previewUri }}
                style={{ width: 56, height: 56, borderRadius: 8 }}
              />
              <Pressable
                onPress={() => setDraftImage(null)}
                style={styles.removeChip}
                hitSlop={6}
              >
                <Ionicons name="close" size={12} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : null}
          {draftAudio ? (
            <View
              style={[
                styles.audioChip,
                { backgroundColor: isDark ? '#2A2A2A' : '#F2EBFD' },
              ]}
            >
              <Text style={{ color: userText, fontSize: fs(10) }}>
                Voice note · {formatDuration(draftAudio.durationMs)}
              </Text>
              <Pressable onPress={() => setDraftAudio(null)} hitSlop={6}>
                <Ionicons name="close" size={14} color="#858585" />
              </Pressable>
            </View>
          ) : null}
          {recording ? (
            <Text style={{ color: '#7C3AED', fontSize: fs(11) }}>
              Recording {formatDuration(recordMs)}
            </Text>
          ) : null}
        </View>
      ) : null}

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
        <Pressable onPress={pickImage} disabled={sendMutation.isPending || recording}>
          <GalleryIcon width={ms(61)} height={ms(61)} />
        </Pressable>
        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: inputBg,
              borderColor: recording ? '#7C3AED' : inputBorder,
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
            placeholder={recording ? 'Listening…' : 'Ask Genie anything'}
            placeholderTextColor="#858585"
            editable={!recording}
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
          <Pressable onPress={toggleRecording} disabled={sendMutation.isPending} hitSlop={8}>
            {recording ? (
              <Ionicons name="mic" size={ms(20)} color="#7C3AED" />
            ) : (
              <MicIcon width={ms(18)} height={ms(21)} />
            )}
          </Pressable>
          <Pressable
            onPress={handleSend}
            disabled={sendMutation.isPending || recording}
          >
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
              onPress={() => setDrawerView((view) => (view === 'library' ? 'chats' : 'library'))}
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
              <ScrollView contentContainerStyle={{ paddingTop: vs(18), paddingBottom: vs(24), gap: vs(16) }}>
                {filteredChats.map((item) => {
                  const active = item._id === chatId;
                  return (
                    <Pressable
                      key={item._id}
                      onPress={() => openChat(item._id)}
                      style={{ paddingHorizontal: hs(22) }}
                    >
                      <Text
                        style={{
                          color: active ? '#7C3AED' : drawerItem,
                          fontSize: fs(12),
                          fontWeight: active ? '600' : '400',
                        }}
                        numberOfLines={1}
                      >
                        {item.title || 'New Chat'}
                      </Text>
                      {item.preview ? (
                        <Text
                          style={{
                            color: isDark ? '#777777' : '#9A9A9A',
                            fontSize: fs(9),
                            marginTop: 3,
                          }}
                          numberOfLines={1}
                        >
                          {item.preview}
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })}
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
  menuBtn: {
    width: 28,
    height: 28,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  msgRow: { flexDirection: 'row', alignItems: 'center' },
  bubble: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 12,
  },
  removeChip: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#191970',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
