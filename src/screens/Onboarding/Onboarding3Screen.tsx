import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { useTheme } from "@/context/ThemeContext";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepDots } from "./StepDots";
import {
  styles as onboardingStyles,
  getContainerBg,
  TITLE_COLOR_LIGHT,
  TITLE_COLOR_DARK,
  DESC_COLOR_LIGHT,
  DESC_COLOR_DARK,
  SKIP_COLOR_DARK,
  HIGHLIGHT_GREEN,
  IMAGE_WIDTH_INSET,
  IMAGE_HEIGHT_RATIO,
} from "./onboarding.styles";

import Splash3Svg from "../../../assets/images/onboarding/splash-3.svg";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding3">;

export function Onboarding3Screen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const imageWidth = width - IMAGE_WIDTH_INSET;
  const imageHeight = imageWidth * IMAGE_HEIGHT_RATIO;

  const goToRegion = () => navigation.replace("RegionSelector");
  const goBack = () => navigation.replace("Onboarding2");

  return (
    <View
      style={[
        styles.container,
        getContainerBg(isDark),
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Header
        onBack={goBack}
        rightElement={
          <Pressable onPress={goToRegion} hitSlop={12}>
            <Text
              style={[
                styles.skipText,
                { color: isDark ? SKIP_COLOR_DARK : TITLE_COLOR_LIGHT },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        }
        style={onboardingStyles.headerWrap}
      />
      <View style={onboardingStyles.imageSection}>
        <Splash3Svg width={imageWidth} height={imageHeight} />
      </View>
      <View style={onboardingStyles.dotsWrap}>
        <StepDots currentStep={3} />
      </View>
      <View style={onboardingStyles.content}>
        <Text
          style={[
            onboardingStyles.title,
            { color: isDark ? TITLE_COLOR_DARK : TITLE_COLOR_LIGHT },
          ]}
        >
          Repayment made Easy
        </Text>
        <Text
          style={[
            onboardingStyles.description,
            { color: isDark ? DESC_COLOR_DARK : DESC_COLOR_LIGHT },
          ]}
        >
          From spending to lending, PayGenius supports your financial habits
          with repayment reminders and financial tips ensuring your credit score
          stays{" "}
          <Text style={{ color: HIGHLIGHT_GREEN, fontWeight: "400" }}>
            healthy
          </Text>{" "}
          over time.
        </Text>
      </View>
      <View style={onboardingStyles.buttonWrap}>
        <PrimaryButton
          title="Continue"
          onPress={() => navigation.replace("Onboarding4")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
