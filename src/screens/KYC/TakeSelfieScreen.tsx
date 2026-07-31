import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Header, PrimaryButton } from '@/components';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useUploadSelfieMutation } from '@/services/profile/profile.query';
import { getApiErrorMessage } from '@/utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'TakeSelfie'>;

const STEPS = [
  'Position your face within the frame',
  'Turn your face to the left',
  'Turn your face to the Right',
  'Position your face within the frame',
] as const;

const TOTAL_STEPS = STEPS.length;

function StepProgressLoader({
  progress,
  size,
  spinning,
}: {
  progress: number;
  size: number;
  spinning: boolean;
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0.08, progress));

  useEffect(() => {
    if (!spinning) {
      spinAnim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spinning, spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: spinning ? [{ rotate }] : undefined,
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5D8FB"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10B981"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={[circumference * clamped, circumference]}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </Animated.View>
  );
}

export function TakeSelfieScreen({ navigation }: Props) {
  useTrackOnboardingRoute('TakeSelfie');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();

  const [stepIndex, setStepIndex] = useState(0);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const uploadSelfieMutation = useUploadSelfieMutation();

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const subtitleColor = isDark ? '#CCCCCC' : '#858585';
  const tipColor = isDark ? '#AAAAAA' : '#1A1D23';
  const cameraBg = isDark ? '#111827' : '#1A1D23';
  const stepBadgeBg = isDark ? '#3A2A6A' : '#E5D8FB';

  const stepNumber = stepIndex + 1;
  const progress = stepNumber / TOTAL_STEPS;
  const busy = isCapturing || isUploading;

  const capturePhoto = async (): Promise<string | null> => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Camera Permission',
          'Camera access is required to take a selfie.'
        );
        return null;
      }
    }
    if (!cameraRef.current) return null;

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.7,
    });
    if (!photo?.base64) return null;
    return `data:image/jpeg;base64,${photo.base64}`;
  };

  const handleContinue = async () => {
    if (busy) return;

    try {
      setIsCapturing(true);
      const image = await capturePhoto();
      setIsCapturing(false);

      if (!image) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        return;
      }

      const nextCaptures = [...captures, image];
      setCaptures(nextCaptures);

      if (stepIndex < TOTAL_STEPS - 1) {
        setStepIndex((s) => s + 1);
        return;
      }

      setIsUploading(true);
      uploadSelfieMutation.mutate(
        { selfieImages: nextCaptures },
        {
          onSuccess: () => {
            setIsUploading(false);
            navigation.navigate('SecuritySetup');
          },
          onError: (err) => {
            setIsUploading(false);
            Alert.alert(
              'Verification Failed',
              getApiErrorMessage(
                err,
                'Face verification failed. Please try again.'
              )
            );
            setStepIndex(0);
            setCaptures([]);
          },
        }
      );
    } catch {
      setIsCapturing(false);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const buttonTitle = isUploading
    ? 'Verifying...'
    : isCapturing
      ? 'Capturing...'
      : stepIndex < TOTAL_STEPS - 1
        ? 'Continue'
        : 'Finish';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View
        style={{
          paddingHorizontal: hs(21),
          marginTop: insets.top + vs(8),
        }}
      >
        <Header
          onBack={() => navigation.goBack()}
          title="Take a Selfie"
          description="Let's Capture your face"
        />
      </View>

      {/* Step badge + instruction */}
      <View
        style={[
          styles.stepRow,
          { marginTop: vs(12), paddingHorizontal: hs(21) },
        ]}
      >
        <View
          style={[
            styles.stepBadge,
            { backgroundColor: stepBadgeBg, width: ms(28), height: ms(28) },
          ]}
        >
          <Text style={[styles.stepNum, { color: '#7C3AED', fontSize: fs(12) }]}>
            {stepNumber}
          </Text>
        </View>
        <Text
          style={[
            styles.stepText,
            {
              color: subtitleColor,
              fontSize: fs(12),
              marginLeft: hs(8),
              flex: 1,
            },
          ]}
        >
          {STEPS[stepIndex]}
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
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front">
            <View style={styles.cameraOverlay}>
              <View
                style={[
                  styles.faceOval,
                  {
                    width: ms(200),
                    height: ms(200),
                    borderRadius: ms(100),
                    borderColor:
                      stepIndex === TOTAL_STEPS - 1 && !busy
                        ? 'rgba(16,185,129,0.8)'
                        : 'rgba(255,255,255,0.45)',
                  },
                ]}
              />
            </View>
          </CameraView>
        ) : (
          <View style={styles.cameraInner}>
            <View
              style={[
                styles.faceOval,
                {
                  width: ms(200),
                  height: ms(200),
                  borderRadius: ms(100),
                  borderColor: 'rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              ]}
            >
              <Ionicons
                name="person"
                size={ms(72)}
                color="rgba(255,255,255,0.35)"
              />
            </View>
            <Text
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: fs(12),
                marginTop: vs(12),
              }}
            >
              Tap Continue to grant camera access
            </Text>
          </View>
        )}
      </View>

      {/* Tip text + loader beside (Figma progress ring) */}
      <View
        style={[
          styles.tipRow,
          {
            marginTop: vs(16),
            paddingHorizontal: hs(21),
            gap: hs(12),
          },
        ]}
      >
        <Text
          style={[
            styles.tipText,
            {
              color: tipColor,
              fontSize: fs(12),
              lineHeight: fs(16),
              flex: 1,
              letterSpacing: 0.25,
            },
          ]}
        >
          Make sure you are in a place where there is enough light to take a
          clear photo
        </Text>
        <StepProgressLoader
          progress={progress}
          size={ms(52)}
          spinning={busy}
        />
      </View>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: hs(21),
            paddingBottom: Math.max(insets.bottom, vs(24)),
          },
        ]}
      >
        <PrimaryButton
          title={buttonTitle}
          onPress={handleContinue}
          disabled={busy}
          style={busy ? { opacity: 0.7 } : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepBadge: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontWeight: '600' },
  stepText: { fontWeight: '400' },
  cameraContainer: {},
  cameraInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  faceOval: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: { fontWeight: '400' },
  footer: { marginTop: 'auto', paddingTop: 16 },
});
