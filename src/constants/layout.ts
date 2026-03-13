/**
 * Base dimensions for responsive scaling.
 * Design is assumed to be for a reference device (e.g. iPhone 14: 390×844).
 * All scale functions map from these bases to the current screen.
 */
export const BASE_SCREEN_WIDTH = 390;
export const BASE_SCREEN_HEIGHT = 844;

/** Breakpoints (width in px) for layout decisions */
export const BREAKPOINTS = {
  sm: 360,   // small phones
  md: 400,   // standard / large phones
  lg: 600,   // phablets / small tablets
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
