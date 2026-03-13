import React, { useCallback, useEffect, useRef } from "react";
import { View, useWindowDimensions, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import HomeBgSvg from "../../../assets/images/onboarding/home-bg.svg";
import PaygeniusLogoSvg from "../../../assets/images/onboarding/paygenius-logo.svg";

import { SplashLetter } from "./SplashLetter";
import { styles } from "./splashScreen.styles";
import { LOGO_DROP_DURATION, LETTER_STAGGER_MS } from "./constants";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const LETTERS = ["P", "a", "y", "G", "e", "n", "i", "u", "s"];
const FONT_WEIGHT_FOR_INDEX = (i: number): "700" | "500" =>
  i < 3 ? "700" : "500";

export function SplashScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const logoTranslateY = useRef(new Animated.Value(-height * 0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const goToOnboarding = useCallback(() => {
    navigation.replace("Onboarding1");
  }, [navigation]);

  useEffect(() => {
    Animated.spring(logoTranslateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 14,
      stiffness: 100,
      mass: 0.8,
    }).start();

    const textStartDelay = LOGO_DROP_DURATION + 200;
    Animated.sequence([
      Animated.delay(textStartDelay),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const lastLetterIndex = 8;
    const lastLetterDelay =
      textStartDelay + lastLetterIndex * LETTER_STAGGER_MS + 150;
    const navigateTimer = setTimeout(() => {
      goToOnboarding();
    }, lastLetterDelay + 600);

    return () => clearTimeout(navigateTimer);
  }, [goToOnboarding, height]);

  return (
    <View style={styles.container}>
      <View style={[styles.bgWrap, { width, height }]} pointerEvents="none">
        <HomeBgSvg
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          style={styles.bgSvg}
        />
      </View>

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoWrap,
            {
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <PaygeniusLogoSvg
            width={width * 0.2}
            height={(width * 0.2 * 35) / 36}
          />
        </Animated.View>

        <Animated.View style={[styles.textRow, { opacity: textOpacity }]}>
          <View style={styles.textBg}>
            {LETTERS.map((letter, i) => (
              <SplashLetter
                key={i}
                letter={letter}
                index={i}
                fontWeight={FONT_WEIGHT_FOR_INDEX(i)}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
