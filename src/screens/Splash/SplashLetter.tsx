import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { styles } from "./splashScreen.styles";
import { LETTER_STAGGER_MS } from "./constants";

const TEXT_START_DELAY_MS = 900 + 200;

type SplashLetterProps = {
  letter: string;
  index: number;
  fontWeight: "700" | "500";
};

export function SplashLetter({ letter, index, fontWeight }: SplashLetterProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = TEXT_START_DELAY_MS + index * LETTER_STAGGER_MS;
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.Text style={[styles.letter, { fontWeight, opacity }]}>
      {letter}
    </Animated.Text>
  );
}
