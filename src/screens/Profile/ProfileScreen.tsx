import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuthStore } from '@/stores';
import { BackButton } from '@/components/BackButton';
import { ProfileRow } from '@/components/ProfileRow';
import { useGetProfileQuery } from '@/services/profile/profile.query';
import { useUpdateProfileMutation } from '@/services/profile/profile.query';
import PersonIcon from '../../../assets/images/profile/icon-person.svg';
import EmailIcon from '../../../assets/images/profile/icon-email.svg';
import LocationIcon from '../../../assets/images/profile/icon-location.svg';
import PhoneIcon from '../../../assets/images/profile/icon-phone.svg';
import SignOutIcon from '../../../assets/images/profile/icon-signout.svg';
import EditBadge from '../../../assets/images/profile/edit-badge.svg';

const DEFAULT_AVATAR = require('../../../assets/images/profile/avatar-default.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function formatPhone(phone?: string) {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('234')) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+234 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  useGetProfileQuery();
  const updateProfile = useUpdateProfileMutation();

  const [editingNick, setEditingNick] = React.useState(false);
  const [nickname, setNickname] = React.useState(user?.username ?? '');

  React.useEffect(() => {
    setNickname(user?.username ?? '');
  }, [user?.username]);

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const nameColor = isDark ? '#FFFFFF' : '#1A1D23';
  const nickColor = isDark ? '#C8C8C8' : '#858585';
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—';
  const location =
    user?.address?.state || user?.address?.city || user?.address?.localGovernmentArea || '—';

  const saveNickname = () => {
    const next = nickname.trim().replace(/^@/, '');
    setEditingNick(false);
    if (!next || next === user?.username) return;
    updateProfile.mutate(
      { username: next },
      {
        onError: () => {
          setNickname(user?.username ?? '');
          Alert.alert('Could not update nickname', 'Please try a different username.');
        },
      }
    );
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to update your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const mime = asset.mimeType ?? 'image/jpeg';
    const dataUri = asset.base64
      ? `data:${mime};base64,${asset.base64}`
      : asset.uri;
    updateProfile.mutate(
      { profilePicture: dataUri },
      {
        onError: () => Alert.alert('Could not update photo', 'Please try again.'),
      }
    );
  };

  const signOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          clearAuth();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + vs(24),
          paddingBottom: Math.max(insets.bottom, vs(24)),
          paddingHorizontal: hs(21),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32 }]}>
            My Profile
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={{ alignItems: 'center', marginTop: vs(20) }}>
          <View style={{ width: ms(118), height: ms(118) }}>
            <View
              style={[
                styles.avatarWrap,
                {
                  width: ms(118),
                  height: ms(118),
                  borderRadius: ms(59),
                  borderWidth: 8,
                },
              ]}
            >
              <Image
                source={user?.profilePicture ? { uri: user.profilePicture } : DEFAULT_AVATAR}
                style={{ width: ms(103), height: ms(103), borderRadius: ms(52) }}
              />
            </View>
            <Pressable
              onPress={pickAvatar}
              style={{ position: 'absolute', right: 0, bottom: 0 }}
              accessibilityRole="button"
              accessibilityLabel="Edit profile photo"
            >
              <EditBadge width={ms(26)} height={ms(26)} />
            </Pressable>
          </View>
          <Text
            style={[
              styles.name,
              { color: nameColor, fontSize: fs(14), letterSpacing: -0.28, marginTop: vs(13) },
            ]}
          >
            Name: {fullName}
          </Text>
          <Text style={[styles.nick, { color: nickColor, fontSize: fs(14), marginTop: vs(4) }]}>
            Nickname: {user?.username || '—'}
          </Text>
        </View>

        <View style={{ marginTop: vs(31), gap: vs(26) }}>
          <ProfileRow
            icon={<PersonIcon width={ms(12)} height={ms(12)} />}
            label={editingNick ? '' : user?.username || 'Add nickname'}
            onPress={() => setEditingNick(true)}
            right={
              editingNick ? (
                <TextInput
                  value={nickname}
                  onChangeText={setNickname}
                  onBlur={saveNickname}
                  onSubmitEditing={saveNickname}
                  autoFocus
                  style={[styles.nickInput, { color: nickColor, fontSize: fs(10) }]}
                  placeholder="Nickname"
                  placeholderTextColor={nickColor}
                  returnKeyType="done"
                />
              ) : (
                <EditBadge width={ms(17)} height={ms(17)} />
              )
            }
          />
          <ProfileRow
            icon={<EmailIcon width={ms(14)} height={ms(11)} />}
            label={user?.email || '—'}
          />
          <ProfileRow
            icon={<LocationIcon width={ms(10)} height={ms(12)} />}
            label={location}
          />
          <ProfileRow
            icon={<PhoneIcon width={ms(8)} height={ms(12)} />}
            label={formatPhone(user?.phoneNumber)}
          />
          <ProfileRow
            icon={<SignOutIcon width={ms(13)} height={ms(13)} />}
            label="Sign out"
            onPress={signOut}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '600', textAlign: 'center' },
  avatarWrap: {
    backgroundColor: '#AFE9D6',
    borderColor: '#D8C4FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  name: { fontWeight: '500', textAlign: 'center' },
  nick: { fontWeight: '400', textAlign: 'center' },
  nickInput: { flex: 1, padding: 0 },
});
