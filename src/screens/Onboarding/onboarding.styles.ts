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

/**
 * Figma (402×874): Skip/Back ~y83–89, illustrations ~y234–255.
 * Keep clear space under the header so art does not collide with controls.
 */
export const IMAGE_SECTION_TOP = 48;
/** Illustration width inset from screen edges (paddingHorizontal 24 × 2). */
export const IMAGE_WIDTH_INSET = 48;
/** Height as a fraction of illustration width — keeps art from eating header space. */
export const IMAGE_HEIGHT_RATIO = 0.78;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerWrap: {
    paddingTop: 8,
    zIndex: 1,
  },
  imageSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: IMAGE_SECTION_TOP,
    minHeight: 0,
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
    marginTop: 16,
    marginBottom: 4,
  },
  content: {
    flexGrow: 0,
    flexShrink: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
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
    paddingTop: 16,
    paddingBottom: 32,
  },
});

export function getContainerBg(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? ONBOARDING_BG_DARK : ONBOARDING_BG_LIGHT,
  };
}
