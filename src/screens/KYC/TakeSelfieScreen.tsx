import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useUploadSelfieMutation } from '@/services/profile/profile.query';

type Props = NativeStackScreenProps<RootStackParamList, 'TakeSelfie'>;
type State = 'idle' | 'capturing' | 'uploading' | 'success';

export function TakeSelfieScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [cameraState, setCameraState] = useState<State>('idle');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const uploadSelfieMutation = useUploadSelfieMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const cameraBg = isDark ? '#111827' : '#1A1D23';

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1800, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const handleCapture = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera Permission', 'Camera access is required to take a selfie.');
        return;
      }
    }

    if (!cameraRef.current) return;

    try {
      setCameraState('capturing');
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      if (!photo?.base64) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        setCameraState('idle');
        return;
      }

      setCameraState('uploading');
      const base64Image = `data:image/jpeg;base64,${photo.base64}`;

      uploadSelfieMutation.mutate(
        { selfieImages: [base64Image] },
        {
          onSuccess: () => setCameraState('success'),
          onError: (err: any) => {
            const msg = err?.response?.data?.message ?? 'Face verification failed. Please try again.';
            Alert.alert('Verification Failed', msg);
            setCameraState('idle');
          },
        }
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setCameraState('idle');
    }
  };

  const handleContinue = () => {
    if (cameraState === 'success') {
      navigation.navigate('SecuritySetup');
    } else {
      handleCapture();
    }
  };

  const buttonTitle =
    cameraState === 'success'
      ? 'Continue'
      : cameraState === 'capturing' || cameraState === 'uploading'
      ? 'Processing...'
      : 'Take Selfie';

  const isLoading = cameraState === 'capturing' || cameraState === 'uploading';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Back */}
      <View style={{ paddingHorizontal: hs(21), marginTop: insets.top + vs(8) }}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      {/* Title */}
      <View style={[styles.titleBlock, { marginTop: vs(8), paddingHorizontal: hs(21), alignItems: 'center' }]}>
        <Text style={[styles.title, { color: titleColor, fontSize: fs(16), letterSpacing: -0.32, textAlign: 'center' }]}>
          Take a Selfie
        </Text>
        <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(12), marginTop: vs(4), textAlign: 'center' }]}>
          Let's capture your face
        </Text>
      </View>

      {/* Step row */}
      <View style={[styles.stepRow, { marginTop: vs(12), paddingHorizontal: hs(21) }]}>
        <View style={[styles.stepBadge, { backgroundColor: isDark ? '#3A2A6A' : '#E5D8FB' }]}>
          <Text style={[styles.stepNum, { color: '#7C3AED', fontSize: fs(12) }]}>1</Text>
        </View>
        <Text style={[styles.stepText, { color: subtitleColor, fontSize: fs(12), marginLeft: hs(8) }]}>
          Position your face within the frame
        </Text>
      </View>

      {/* Camera frame */}
      <View
        style={[
          styles.cameraContainer,
          {
            marginHorizontal: hs(21),
            marginTop: vs(8),
            borderRadius: ms(12),
            backgroundColor: cameraBg,
            height: vs(380),
            overflow: 'hidden',
          },
        ]}
      >
        {permission?.granted ? (
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="front"
          >
            {/* Face oval overlay */}
            <View style={styles.cameraOverlay}>
              <View
                style={[
                  styles.faceOval,
                  {
                    width: ms(160),
                    height: ms(200),
                    borderRadius: ms(100),
                    borderColor:
                      cameraState === 'success'
                        ? '#10B981'
                        : 'rgba(255,255,255,0.5)',
                    borderWidth: 2,
                  },
                ]}
              />
              {cameraState === 'success' && (
                <View style={styles.successOverlay}>
                  <Ionicons name="checkmark-circle" size={ms(56)} color="#10B981" />
                </View>
              )}
            </View>
          </CameraView>
        ) : (
          /* Placeholder when no camera permission */
          <View style={styles.cameraInner}>
            <View
              style={[
                styles.faceOval,
                {
                  width: ms(160),
                  height: ms(200),
                  borderRadius: ms(100),
                  borderColor: 'rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              ]}
            />
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: fs(12), marginTop: vs(12) }}>
              Tap to grant camera access
            </Text>
          </View>
        )}
      </View>

      {/* Instruction + spinner */}
      <View style={[styles.instructionRow, { marginTop: vs(16), paddingHorizontal: hs(21) }]}>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.instructionText, { color: isDark ? '#AAAAAA' : '#1A1D23', fontSize: fs(12) }]}
          >
            {cameraState === 'success'
              ? 'Face captured successfully!'
              : 'Make sure you are in a well-lit area for a clear photo'}
          </Text>
        </View>
        {isLoading && (
          <Animated.View
            style={[
              styles.spinner,
              {
                width: ms(38),
                height: ms(38),
                borderColor: '#10B981',
                borderRightColor: '#E5D8FB',
                transform: [{ rotate: spin }],
              },
            ]}
          />
        )}
      </View>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { paddingHorizontal: hs(21), paddingBottom: Math.max(insets.bottom, vs(24)) },
        ]}
      >
        <PrimaryButton
          title={buttonTitle}
          onPress={handleContinue}
          disabled={isLoading}
          style={isLoading ? { opacity: 0.7 } : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: { height: 32, justifyContent: 'center', alignItems: 'flex-start' },
  titleBlock: {},
  title: { fontWeight: '600', textAlign: 'center' },
  subtitle: { fontWeight: '400', textAlign: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontWeight: '600' },
  stepText: { fontWeight: '400', flex: 1 },
  cameraContainer: {},
  cameraInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  faceOval: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  successOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  instructionText: { fontWeight: '400', lineHeight: 18 },
  spinner: { borderWidth: 3, borderRadius: 19, flexShrink: 0 },
  footer: { marginTop: 'auto', paddingTop: 16 },
});
