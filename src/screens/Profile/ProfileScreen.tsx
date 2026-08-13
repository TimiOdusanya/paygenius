import React from 'react';
import {
  ActivityIndicator,
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
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  useCheckUsernameQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/services/profile/profile.query';
import { getApiErrorMessage } from '@/utils/errors';
import PersonIcon from '../../../assets/images/profile/icon-person.svg';
import EmailIcon from '../../../assets/images/profile/icon-email.svg';
import LocationIcon from '../../../assets/images/profile/icon-location.svg';
import PhoneIcon from '../../../assets/images/profile/icon-phone.svg';
import SignOutIcon from '../../../assets/images/profile/icon-signout.svg';
import EditBadge from '../../../assets/images/profile/edit-badge.svg';

const DEFAULT_AVATAR = require('../../../assets/images/profile/avatar-default.png');
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

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

function normalizeUsername(value: string) {
  return value.trim().replace(/^@+/, '');
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
  const [debouncedUsername, setDebouncedUsername] = React.useState('');
  const [pendingPhoto, setPendingPhoto] = React.useState<string | null>(null);
  const [pickingPhoto, setPickingPhoto] = React.useState(false);

  React.useEffect(() => {
    setNickname(user?.username ?? '');
  }, [user?.username]);

  const normalizedUsername = normalizeUsername(nickname);
  const currentUsername = user?.username ?? '';
  const usernameChanged = normalizedUsername !== currentUsername;
  const photoChanged = Boolean(pendingPhoto);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedUsername(normalizedUsername), 400);
    return () => clearTimeout(timer);
  }, [normalizedUsername]);

  const usernameFormatValid =
    normalizedUsername.length >= 3 &&
    normalizedUsername.length <= 30 &&
    USERNAME_REGEX.test(normalizedUsername);

  const {
    data: usernameCheck,
    isFetching: isCheckingUsername,
    isError: usernameCheckError,
  } = useCheckUsernameQuery(debouncedUsername, {
    enabled:
      editingNick &&
      usernameChanged &&
      usernameFormatValid &&
      debouncedUsername === normalizedUsername,
  });

  const availableColor = isDark ? '#6EE7B7' : '#059669';
  const takenColor = isDark ? '#FCA5A5' : '#DC2626';
  const checkingColor = isDark ? '#CCCCCC' : '#858585';

  const usernameStatus = (() => {
    if (!editingNick || !usernameChanged) return null;
    if (!normalizedUsername) {
      return { message: 'Enter a username', color: checkingColor };
    }
    if (normalizedUsername.length < 3) {
      return { message: 'Username must be at least 3 characters', color: checkingColor };
    }
    if (!USERNAME_REGEX.test(normalizedUsername) || normalizedUsername.length > 30) {
      return {
        message: 'Only letters, numbers, and underscores (3–30 characters)',
        color: takenColor,
      };
    }
    if (debouncedUsername !== normalizedUsername || isCheckingUsername) {
      return { message: 'Checking availability…', color: checkingColor };
    }
    if (usernameCheckError) {
      return { message: 'Could not check username. Try again.', color: takenColor };
    }
    if (usernameCheck?.data?.reason === 'taken') {
      return { message: 'Username is already taken', color: takenColor };
    }
    if (usernameCheck?.data?.reason === 'invalid') {
      return {
        message: 'Only letters, numbers, and underscores (3–30 characters)',
        color: takenColor,
      };
    }
    if (usernameCheck?.data?.available) {
      return { message: 'Username is available', color: availableColor };
    }
    return null;
  })();

  const usernameReady =
    !usernameChanged ||
    (usernameFormatValid &&
      debouncedUsername === normalizedUsername &&
      !isCheckingUsername &&
      !usernameCheckError &&
      Boolean(usernameCheck?.data?.available));

  const hasChanges = usernameChanged || photoChanged;
  const canSave = hasChanges && usernameReady && !updateProfile.isPending;

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const nameColor = isDark ? '#FFFFFF' : '#1A1D23';
  const nickColor = isDark ? '#C8C8C8' : '#858585';
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—';
  const location =
    user?.address?.state || user?.address?.city || user?.address?.localGovernmentArea || '—';
  const avatarUri = pendingPhoto || user?.profilePicture;

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to update your profile picture.');
      return;
    }
    setPickingPhoto(true);
    try {
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
      const dataUri = asset.base64 ? `data:${mime};base64,${asset.base64}` : asset.uri;
      setPendingPhoto(dataUri);
    } finally {
      setPickingPhoto(false);
    }
  };

  const saveChanges = () => {
    if (!canSave) return;
    updateProfile.mutate(
      {
        ...(usernameChanged ? { username: normalizedUsername } : {}),
        ...(pendingPhoto ? { profilePicture: pendingPhoto } : {}),
      },
      {
        onSuccess: () => {
          setPendingPhoto(null);
          setEditingNick(false);
        },
        onError: (error) => {
          Alert.alert(
            'Could not save changes',
            getApiErrorMessage(error, 'Please try again.')
          );
        },
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
                source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
                style={{ width: ms(103), height: ms(103), borderRadius: ms(52) }}
              />
              {pickingPhoto || (updateProfile.isPending && photoChanged) ? (
                <View style={styles.avatarLoading}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: fs(9), marginTop: 6 }}>
                    {pickingPhoto ? 'Loading photo…' : 'Updating photo…'}
                  </Text>
                </View>
              ) : null}
            </View>
            <Pressable
              onPress={pickAvatar}
              disabled={updateProfile.isPending || pickingPhoto}
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
          <View>
            <ProfileRow
              icon={<PersonIcon width={ms(12)} height={ms(12)} />}
              label={editingNick ? '' : user?.username || 'Add nickname'}
              onPress={() => setEditingNick(true)}
              right={
                editingNick ? (
                  <View style={styles.nickEdit}>
                    <TextInput
                      value={nickname}
                      onChangeText={setNickname}
                      autoFocus
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={[styles.nickInput, { color: nickColor, fontSize: fs(10) }]}
                      placeholder="Nickname"
                      placeholderTextColor={nickColor}
                      returnKeyType="done"
                    />
                    <EditBadge width={ms(17)} height={ms(17)} />
                  </View>
                ) : (
                  <EditBadge width={ms(17)} height={ms(17)} />
                )
              }
            />
            {usernameStatus ? (
              <Text
                style={{
                  color: usernameStatus.color,
                  fontSize: fs(10),
                  marginTop: vs(6),
                  paddingHorizontal: hs(12),
                }}
              >
                {usernameStatus.message}
              </Text>
            ) : null}
          </View>
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

        {hasChanges ? (
          <PrimaryButton
            title={updateProfile.isPending ? 'Saving…' : 'Save changes'}
            onPress={saveChanges}
            disabled={!canSave}
            style={{ marginTop: vs(32) }}
          />
        ) : null}
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
  avatarLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25,25,112,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontWeight: '500', textAlign: 'center' },
  nick: { fontWeight: '400', textAlign: 'center' },
  nickEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nickInput: { flex: 1, padding: 0 },
});
