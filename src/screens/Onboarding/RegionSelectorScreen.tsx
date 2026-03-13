import React from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "RegionSelector">;

export function RegionSelectorScreen({ navigation }: Props) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="primary" style={styles.title}>
          Region Selector
        </ThemedText>
      </View>
      <PrimaryButton
        title="Continue"
        onPress={() => navigation.replace("Home")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
