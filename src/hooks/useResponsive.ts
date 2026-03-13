import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  fontScale,
  isAtBreakpoint,
} from '@/utils/responsive';

/**
 * Hook for responsive layout. Use in components to get scaled values and breakpoint flags.
 * Values update on orientation change or window resize (e.g. split screen).
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(
    () => ({
      width,
      height,

      /** Scale horizontal spacing/sizes (padding, margin, width) */
      hs: (size: number) => horizontalScale(size, width),

      /** Scale vertical spacing/sizes */
      vs: (size: number) => verticalScale(size, height),

      /** Moderate scale (capped growth) for icons, buttons */
      ms: (size: number, factor?: number) => moderateScale(size, width, factor),

      /** Scale font size (capped by default) */
      fs: (size: number, maxScale?: number) => fontScale(size, width, maxScale),

      /** Breakpoint checks */
      isSmallScreen: width < 400,
      isMediumScreen: width >= 400 && width < 600,
      isLargeScreen: width >= 600,
      isAtBreakpoint: (bp: 'sm' | 'md' | 'lg') => isAtBreakpoint(width, bp),
    }),
    [width, height]
  );
}
