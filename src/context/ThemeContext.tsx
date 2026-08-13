import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import type { SemanticColors } from "@/theme/semantic";
import { darkColors, lightColors } from "@/theme/semantic";
import { usePreferencesStore, type ThemeMode } from "@/stores/preferences.store";

export type { ThemeMode };

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  colors: SemanticColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const mode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";
  const colors: SemanticColors = isDark ? darkColors : lightColors;

  const setMode = useCallback((newMode: ThemeMode) => {
    setThemeMode(newMode);
  }, [setThemeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, isDark, colors, setMode }),
    [mode, isDark, colors, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
