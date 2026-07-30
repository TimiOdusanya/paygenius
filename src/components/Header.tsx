import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { BackButton } from "@/components/BackButton";

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
      <View style={styles.topRow}>
        {onBack ? (
          <BackButton onPress={onBack} size={32} />
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
