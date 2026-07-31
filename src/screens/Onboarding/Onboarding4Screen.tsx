import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import { useTheme } from "@/context/ThemeContext";
import { Header } from "@/components/Header";
import { PrimaryButton } from "@/components/PrimaryButton";
import { usePreferencesStore } from "@/stores/preferences.store";
import { StepDots } from "./StepDots";
import {
  styles as onboardingStyles,
  getContainerBg,
  TITLE_COLOR_LIGHT,
  TITLE_COLOR_DARK,
  DESC_COLOR_LIGHT,
  DESC_COLOR_DARK,
  IMAGE_WIDTH_INSET,
  IMAGE_HEIGHT_RATIO,
} from "./onboarding.styles";

import Splash4Svg from "../../../assets/images/onboarding/splash-4.svg";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding4">;

export function Onboarding4Screen({ navigation }: Props) {
  useTrackOnboardingRoute('Onboarding4');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const imageWidth = width - IMAGE_WIDTH_INSET;
  const imageHeight = imageWidth * IMAGE_HEIGHT_RATIO;

  useEffect(() => {
    usePreferencesStore.getState().setMarketingStep("Onboarding4");
  }, []);

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
        variant="bar"
        onBack={goBack}
        onSkip={goToRegion}
        style={onboardingStyles.headerWrap}
      />
      <View style={onboardingStyles.imageSection}>
        <Splash4Svg width={imageWidth} height={imageHeight} />
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
});
