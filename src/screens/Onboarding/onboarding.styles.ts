import { StyleSheet, ViewStyle } from "react-native";

export const ONBOARDING_BG_LIGHT = "#FAFAFC";
export const ONBOARDING_BG_DARK = "#1A1A1A";

export const STEP_DOT_SIZE = 8;
export const STEP_DOT_SIZE_SELECTED = 12;
export const STEP_DOT_COLOR = "#C0C0F1";
export const STEP_DOT_SELECTED_COLOR = "#191970";

export const TITLE_COLOR_LIGHT = "#191970";
export const TITLE_COLOR_DARK = "#FFFFFF";
export const DESC_COLOR_LIGHT = "#858585";
export const DESC_COLOR_DARK = "#E0E0E0";
export const SKIP_COLOR_DARK = "#FFFFFF";
export const HIGHLIGHT_PURPLE = "#7C3AED";
export const HIGHLIGHT_GREEN = "#10B981";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerWrap: {
    paddingTop: 8,
  },
  imageSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  dotsWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 24,
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 12,
    textAlign: "left",
    lineHeight: 24,
  },
  buttonWrap: {
    paddingBottom: 32,
  },
});

export function getContainerBg(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? ONBOARDING_BG_DARK : ONBOARDING_BG_LIGHT,
  };
}
