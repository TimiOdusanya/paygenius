import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ScreenTitleBar } from '@/components/ScreenTitleBar';
import { useUpdateSettingsMutation, useSetBiometricMutation } from '@/services/settings/settings.query';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import FaceScan from '../../../assets/images/settings/face-scan.svg';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'FaceIdSetup'>;
type Phase = 'idle' | 'scanning' | 'done' | 'failed';

export function FaceIdSetupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const update = useUpdateSettingsMutation();
  const biometric = useSetBiometricMutation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#6D6D8C';
  const frameBg = isDark ? 'rgba(227,185,245,0.08)' : 'rgba(227,185,245,0.1)';

  useEffect(() => {
    startScan();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const startScan = async () => {
    setPhase('scanning');
    setProgress(0);
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + 25;
      });
    }, 280);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Set your Face ID',
        fallbackLabel: 'Use passcode',
      });
      if (timer.current) clearInterval(timer.current);
      if (result.success) {
        setProgress(100);
        setPhase('done');
        update.mutate({ faceIdEnabled: true });
        biometric.mutate(true);
      } else {
        setPhase('failed');
      }
    } catch {
      if (timer.current) clearInterval(timer.current);
      setPhase('failed');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View
        style={{
          paddingTop: insets.top + vs(24),
          paddingHorizontal: hs(21),
        }}
      >
        <ScreenTitleBar
          title="Face ID"
          subtitle="Set  your face ID"
          onBack={() => navigation.goBack()}
        />
      </View>

      <Text
        style={{
          textAlign: 'center',
          color: isDark ? '#AAAAAA' : '#858585',
          fontSize: fs(12),
          marginTop: vs(40),
        }}
      >
        Position your face within the frame
      </Text>

      <View
        style={[
          styles.outer,
          {
            marginTop: vs(20),
            width: hs(339),
            height: vs(530),
            borderRadius: ms(19),
            borderColor: '#D5C7F7',
            alignSelf: 'center',
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: hs(257),
              height: vs(333),
              borderRadius: ms(9),
              backgroundColor: frameBg,
            },
          ]}
        >
          <FaceScan width={ms(149)} height={ms(149)} />
        </View>
        {phase === 'scanning' || phase === 'done' ? (
          <View style={{ width: hs(250), marginTop: vs(24), alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                height: 7,
                borderRadius: 8,
                backgroundColor: isDark ? '#2A2A2A' : '#EDEDED',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: '100%',
                  backgroundColor: '#7C3AED',
                }}
              />
            </View>
            <Text style={{ color: subColor, fontSize: fs(12), marginTop: vs(8) }}>
              Loading....... {Math.min(progress, 100)}%
            </Text>
          </View>
        ) : null}
        {phase === 'failed' ? (
          <Pressable onPress={startScan} style={{ marginTop: vs(16) }}>
            <Text style={{ color: '#7C3AED', fontSize: fs(12) }}>Try again</Text>
          </Pressable>
        ) : null}
      </View>

      <Modal visible={phase === 'done'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[
              styles.doneCard,
              {
                width: hs(332),
                height: vs(215),
                borderRadius: ms(16),
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
              },
            ]}
          >
            <View
              style={{
                width: ms(80),
                height: ms(80),
                borderRadius: ms(40),
                backgroundColor: '#AFE9D6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={ms(36)} color="#10B981" />
            </View>
            <Text
              style={{
                color: titleColor,
                fontSize: fs(16),
                fontWeight: '600',
                marginTop: vs(12),
              }}
            >
              Scan Completed
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginTop: vs(16), paddingHorizontal: 24, paddingVertical: 8 }}
            >
              <Text style={{ color: '#7C3AED', fontSize: fs(14) }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  outer: {
    borderTopWidth: 3,
    alignItems: 'center',
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
