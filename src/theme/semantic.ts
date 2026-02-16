/**
 * Semantic color tokens. Use these keys in components via useTheme().
 * Light mode and dark mode each map to the same keys but different palette values.
 * When you use colors.background or colors.text, switching theme automatically
 * gives the correct light/dark value — no need to add dark variants everywhere.
 */
import {
  greenPalette,
  purplePalette,
  whitePalette,
  blackPalette,
  bluePalette,
} from './palettes';

export type SemanticColors = {
  // Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderSubtle: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Brand
  primary: string;
  primaryMuted: string;
  primaryContrast: string;
  secondary: string;
  secondaryMuted: string;
  accent: string;
  accentMuted: string;

  // Status
  success: string;
  successMuted: string;
  error: string;
  errorMuted: string;
  warning: string;
  warningMuted: string;
  info: string;
  infoMuted: string;

  // Interactive
  touchableHighlight: string;
  touchableActive: string;
};

function buildLightTheme(): SemanticColors {
  return {
    background: whitePalette['0'],
    surface: whitePalette['0'],
    surfaceElevated: whitePalette['0'],
    border: blackPalette['1.5'],
    borderSubtle: blackPalette['0.5'],

    text: blackPalette['5'],
    textSecondary: blackPalette['3'],
    textMuted: blackPalette['2'],
    textInverse: whitePalette['0'],

    primary: greenPalette['5'],
    primaryMuted: greenPalette['1'],
    primaryContrast: whitePalette['0'],
    secondary: purplePalette['5'],
    secondaryMuted: purplePalette['1'],
    accent: bluePalette['5'],
    accentMuted: bluePalette['1'],

    success: greenPalette['5'],
    successMuted: greenPalette['1'],
    error: '#DC2626',
    errorMuted: '#FEE2E2',
    warning: '#D97706',
    warningMuted: '#FEF3C7',
    info: bluePalette['5'],
    infoMuted: bluePalette['1'],

    touchableHighlight: blackPalette['0.5'],
    touchableActive: greenPalette['1'],
  };
}

function buildDarkTheme(): SemanticColors {
  return {
    background: blackPalette['5'],
    surface: blackPalette['5'],
    surfaceElevated: blackPalette['4'],
    border: whitePalette['8'],
    borderSubtle: whitePalette['7'],

    text: whitePalette['0'],
    textSecondary: whitePalette['7'],
    textMuted: whitePalette['8'],
    textInverse: blackPalette['5'],

    primary: greenPalette['4'],
    primaryMuted: greenPalette['8'],
    primaryContrast: whitePalette['0'],
    secondary: purplePalette['4'],
    secondaryMuted: purplePalette['8'],
    accent: bluePalette['4'],
    accentMuted: bluePalette['8'],

    success: greenPalette['4'],
    successMuted: greenPalette['8'],
    error: '#EF4444',
    errorMuted: '#7F1D1D',
    warning: '#F59E0B',
    warningMuted: '#78350F',
    info: bluePalette['4'],
    infoMuted: bluePalette['8'],

    touchableHighlight: whitePalette['8'],
    touchableActive: greenPalette['8'],
  };
}

export const lightColors = buildLightTheme();
export const darkColors = buildDarkTheme();
