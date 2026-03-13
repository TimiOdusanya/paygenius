import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";

const BACK_BG = "rgba(192, 192, 241, 0.3)";
const BACK_ICON_COLOR = "#949494";
const BACK_ICON_SIZE = 12;

export type HeaderTitleAlign = "left" | "center";
export type HeaderDescriptionAlign = "left" | "center";

type HeaderProps = {
  /** When provided, shows the back button (left div) and calls this on press */
  onBack?: () => void;
  /** Optional right-side content (e.g. icon, text) */
  rightElement?: React.ReactNode;
  /** Main heading text */
  title?: string;
  /** Heading alignment */
  titleAlign?: HeaderTitleAlign;
  /** Optional description below the heading */
  description?: string;
  /** Description alignment */
  descriptionAlign?: HeaderDescriptionAlign;
  /** Optional style for the top row container */
  style?: ViewStyle;
};

export function Header({
  onBack,
  rightElement,
  title,
  titleAlign = "left",
  description,
  descriptionAlign = "left",
  style,
}: HeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, style]}>
      {/* Top row: optional back (left), spacer, optional right */}
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backDiv,
              pressed && styles.backPressed,
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={BACK_ICON_SIZE}
              color={BACK_ICON_COLOR}
            />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.spacer} />
        {rightElement != null ? (
          <View style={styles.rightSlot}>{rightElement}</View>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      {/* Heading */}
      {title != null && title !== "" ? (
        <Text
          style={[
            styles.title,
            { color: colors.text },
            titleAlign === "center" ? styles.titleCenter : styles.titleLeft,
          ]}
        >
          {title}
        </Text>
      ) : null}

      {/* Description */}
      {description != null && description !== "" ? (
        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
            descriptionAlign === "center"
              ? styles.descriptionCenter
              : styles.descriptionLeft,
          ]}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  backDiv: {
    backgroundColor: BACK_BG,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backPressed: {
    opacity: 0.8,
  },
  backPlaceholder: {
    width: 32,
    height: 32,
  },
  spacer: {
    flex: 1,
  },
  rightSlot: {
    minWidth: 32,
    height: 32,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  titleLeft: {
    textAlign: "left",
  },
  titleCenter: {
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  descriptionLeft: {
    textAlign: "left",
  },
  descriptionCenter: {
    textAlign: "center",
  },
});
