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
} from "./onboarding.styles";

import Splash4Svg from "../../../assets/images/onboarding/splash-4.svg";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding4">;

export function Onboarding4Screen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const goToRegion = () => navigation.replace("RegionSelector");
  const goBack = () => navigation.replace("Onboarding3");

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
        <Splash4Svg width={width - 48} height={(width - 48) * 0.95} />
      </View>
      <View style={onboardingStyles.dotsWrap}>
        <StepDots currentStep={4} />
      </View>
      <View style={onboardingStyles.content}>
        <Text
          style={[
            onboardingStyles.title,
            { color: isDark ? TITLE_COLOR_DARK : TITLE_COLOR_LIGHT },
          ]}
        >
          Budgeting
        </Text>
        <Text
          style={[
            onboardingStyles.description,
            { color: isDark ? DESC_COLOR_DARK : DESC_COLOR_LIGHT },
          ]}
        >
          From daily choices to monthly goals, we keep you aligned with your
          budget, helping you build smarter spending habits.
        </Text>
      </View>
      <View style={onboardingStyles.buttonWrap}>
        <PrimaryButton
          title="Continue"
          onPress={() => navigation.replace("RegionSelector")}
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
