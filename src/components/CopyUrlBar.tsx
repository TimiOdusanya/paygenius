import React, { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

type CopyUrlBarProps = {
  url: string;
};

export function CopyUrlBar({ url }: CopyUrlBarProps) {
  const { isDark } = useTheme();
  const { fs, vs, ms } = useResponsive();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await Share.share({ message: url });
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <View
      style={[
        styles.bar,
        {
          height: vs(52),
          borderRadius: ms(12),
          backgroundColor: isDark ? 'rgba(217,217,217,0.12)' : 'rgba(217,217,217,0.3)',
        },
      ]}
    >
      <Pressable
        onPress={handleCopy}
        style={[
          styles.btn,
          { width: ms(113), borderTopLeftRadius: ms(12), borderBottomLeftRadius: ms(12) },
        ]}
      >
        <Text style={{ color: '#FFFFFF', fontSize: fs(12) }}>
          {copied ? 'Copied' : 'Copy Url'}
        </Text>
      </Pressable>
      <Text
        style={{
          flex: 1,
          color: isDark ? '#C4C4D4' : '#6D6D8C',
          fontSize: fs(10),
          paddingHorizontal: 12,
        }}
        numberOfLines={1}
      >
        {url}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  btn: {
    height: '100%',
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
