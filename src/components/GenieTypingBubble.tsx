import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type Props = {
  backgroundColor: string;
  borderColor: string;
  dotColor: string;
};

function TypingDot({
  delay,
  color,
  size,
}: {
  delay: number;
  color: string;
  size: number;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.delay(560 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, pulse]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 1] }),
        transform: [
          {
            translateY: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -5],
            }),
          },
          {
            scale: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1.08],
            }),
          },
        ],
      }}
    />
  );
}

export function GenieTypingBubble({
  backgroundColor,
  borderColor,
  dotColor,
}: Props) {
  return (
    <View style={[styles.bubble, { backgroundColor, borderColor }]}>
      <View style={styles.dots}>
        <TypingDot delay={0} color={dotColor} size={7} />
        <TypingDot delay={160} color={dotColor} size={7} />
        <TypingDot delay={320} color={dotColor} size={7} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 58,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 14,
    gap: 5,
  },
});
