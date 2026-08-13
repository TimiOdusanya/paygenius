import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration } from '@/screens/Genie/genieMedia';

type Props = {
  uri: string;
  durationMs?: number;
  textColor: string;
  accent: string;
};

export function VoiceNoteBubble({ uri, durationMs, textColor, accent }: Props) {
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);

  React.useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => undefined);
    };
  }, [uri]);

  const toggle = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) return;
            setPlaying(status.isPlaying);
            setPosition(status.positionMillis || 0);
            if (status.didJustFinish) {
              setPlaying(false);
              setPosition(0);
              sound.setPositionAsync(0).catch(() => undefined);
            }
          }
        );
        soundRef.current = sound;
        setPlaying(true);
        return;
      }
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
        setPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <Pressable onPress={toggle} style={styles.row}>
      <View style={[styles.play, { backgroundColor: accent }]}>
        <Ionicons name={playing ? 'pause' : 'play'} size={12} color="#FFFFFF" />
      </View>
      <Text style={{ color: textColor, fontSize: 10 }}>
        Voice note · {formatDuration(playing ? position : durationMs)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  play: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
