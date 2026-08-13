import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { formatNaira } from './transfer.helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferSuccess'>;

export function TransferSuccessScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs, ms } = useResponsive();
  const transfer = route.params.transfer;
  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const titleColor = isDark ? '#FFFFFF' : '#191970';
  const subColor = isDark ? '#AAAAAA' : '#858585';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, vs(24)),
        paddingHorizontal: hs(24),
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={[
            styles.check,
            {
              width: ms(88),
              height: ms(88),
              borderRadius: ms(44),
              backgroundColor: '#AFE9D6',
            },
          ]}
        >
          <Ionicons name="checkmark" size={ms(42)} color="#191970" />
        </View>
        <Text
          style={{
            color: titleColor,
            fontSize: fs(16),
            fontWeight: '600',
            marginTop: vs(24),
            letterSpacing: -0.32,
          }}
        >
          Transfer Successful
        </Text>
        <Text
          style={{
            color: subColor,
            fontSize: fs(12),
            marginTop: vs(8),
            textAlign: 'center',
          }}
        >
          {formatNaira(transfer.amount)} sent to {transfer.recipientName || 'recipient'}
        </Text>
      </View>

      <Pressable
        onPress={() => navigation.replace('TransferReceipt', { transfer })}
        style={[
          styles.btn,
          {
            width: '100%',
            height: vs(54),
            borderRadius: ms(14),
            backgroundColor: '#191970',
          },
        ]}
      >
        <Text style={{ color: '#FFFFFF', fontSize: fs(12), fontWeight: '600' }}>
          Share receipt
        </Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Main')}
        style={[
          styles.btn,
          {
            width: '100%',
            height: vs(54),
            borderRadius: ms(14),
            backgroundColor: isDark ? '#2A2A2A' : '#EDEDED',
            marginTop: vs(12),
          },
        ]}
      >
        <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: fs(12), fontWeight: '600' }}>
          Done
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  check: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
