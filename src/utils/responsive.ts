import { BASE_SCREEN_WIDTH, BASE_SCREEN_HEIGHT, BREAKPOINTS } from '@/constants/layout';

/**
 * Horizontal scale: size that should scale with screen width (padding, margins, widths).
 * Use for: horizontal spacing, card width, icon size.
 */
export function horizontalScale(size: number, screenWidth: number): number {
  return (size / BASE_SCREEN_WIDTH) * screenWidth;
}

/**
 * Vertical scale: size that should scale with screen height (vertical spacing, heights).
 * Use sparingly to avoid huge gaps on tall devices.
 */
export function verticalScale(size: number, screenHeight: number): number {
  return (size / BASE_SCREEN_HEIGHT) * screenHeight;
}

/**
 * Moderate scale: like horizontal scale but capped so elements don’t get too big on tablets.
 * factor > 0: the higher, the less aggressive scaling (e.g. 0.5 = moderate).
 */
export function moderateScale(
  size: number,
  screenWidth: number,
  factor: number = 0.5
): number {
  return size + (horizontalScale(size, screenWidth) - size) * factor;
}

/**
 * Font scale: scale font sizes with width, with optional max to avoid huge text.
 */
export function fontScale(size: number, screenWidth: number, maxScale: number = 1.3): number {
  const scale = screenWidth / BASE_SCREEN_WIDTH;
  const capped = Math.min(scale, maxScale);
  return Math.round(size * capped);
}

/**
 * Check if current width is at or above a breakpoint.
 */
export function isAtBreakpoint(width: number, breakpoint: keyof typeof BREAKPOINTS): boolean {
  return width >= BREAKPOINTS[breakpoint];
}
