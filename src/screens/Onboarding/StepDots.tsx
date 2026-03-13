import React from "react";
import { View, StyleSheet } from "react-native";
import {
  STEP_DOT_COLOR,
  STEP_DOT_SIZE,
  STEP_DOT_SIZE_SELECTED,
  STEP_DOT_SELECTED_COLOR,
} from "./onboarding.styles";

const TOTAL_STEPS = 4;

type StepDotsProps = {
  currentStep: number;
};

export function StepDots({ currentStep }: StepDotsProps) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isSelected = step === currentStep;
        const size = isSelected ? STEP_DOT_SIZE_SELECTED : STEP_DOT_SIZE;
        const bgColor = isSelected ? STEP_DOT_SELECTED_COLOR : STEP_DOT_COLOR;
        return (
          <View
            key={step}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: bgColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  dot: {},
});
