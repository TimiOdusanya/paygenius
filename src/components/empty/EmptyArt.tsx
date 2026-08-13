import React from 'react';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';

type ArtProps = {
  isDark: boolean;
  size: number;
};

function palette(isDark: boolean) {
  return {
    navy: isDark ? '#C4B5FD' : '#191970',
    purple: isDark ? '#A78BFA' : '#7C3AED',
    lavender: isDark ? 'rgba(227,185,245,0.28)' : 'rgba(227,185,245,0.7)',
    mint: isDark ? 'rgba(175,233,214,0.45)' : '#AFE9D6',
    line: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(25,25,112,0.12)',
    card: isDark ? '#2A2238' : '#FFFFFF',
    stroke: isDark ? 'rgba(167,139,250,0.55)' : 'rgba(124,58,237,0.35)',
    soft: isDark ? 'rgba(179,0,255,0.18)' : 'rgba(227,185,245,0.45)',
  };
}

export function EmptyTransactionsArt({ isDark, size }: ArtProps) {
  const c = palette(isDark);
  return (
    <Svg width={size} height={size * 0.78} viewBox="0 0 160 124" fill="none">
      <Ellipse cx="80" cy="108" rx="46" ry="8" fill={c.soft} />
      <Circle cx="80" cy="56" r="46" fill={c.lavender} />
      <Circle cx="80" cy="56" r="30" fill={c.soft} />
      <Rect
        x="46"
        y="34"
        width="68"
        height="46"
        rx="10"
        fill={c.card}
        stroke={c.stroke}
        strokeWidth="1.2"
      />
      <Rect x="56" y="46" width="28" height="4" rx="2" fill={c.purple} opacity="0.7" />
      <Rect x="56" y="56" width="40" height="3" rx="1.5" fill={c.navy} opacity="0.28" />
      <Rect x="56" y="64" width="22" height="3" rx="1.5" fill={c.navy} opacity="0.16" />
      <Circle cx="118" cy="38" r="7" fill={c.mint} />
    </Svg>
  );
}

export function EmptySpendArt({ isDark, size }: ArtProps) {
  const c = palette(isDark);
  return (
    <Svg width={size} height={size * 0.78} viewBox="0 0 160 124" fill="none">
      <Ellipse cx="80" cy="110" rx="50" ry="8" fill={c.soft} />
      <Circle cx="80" cy="58" r="44" fill={c.lavender} />
      <Path d="M36 92 H124" stroke={c.line} strokeWidth="1.2" strokeDasharray="3 4" />
      <Rect x="46" y="58" width="14" height="34" rx="5" fill={c.navy} />
      <Rect x="73" y="40" width="14" height="52" rx="5" fill={c.purple} />
      <Rect x="100" y="68" width="14" height="24" rx="5" fill={c.mint} />
    </Svg>
  );
}

export function EmptyChatArt({ isDark, size }: ArtProps) {
  const c = palette(isDark);
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <Circle cx="80" cy="80" r="62" fill={c.lavender} />
      <Circle cx="80" cy="80" r="44" fill={isDark ? '#4C1D95' : '#B300FF'} />
      <Circle cx="80" cy="80" r="28" fill={isDark ? '#7C3AED' : '#9B4DFF'} />
      <Path
        d="M72 74 L80 68 L88 74 L84 88 L76 88 Z"
        fill="#FFFFFF"
        opacity="0.92"
      />
      <Rect x="112" y="42" width="28" height="16" rx="8" fill={c.card} stroke={c.stroke} />
      <Rect x="20" y="108" width="36" height="14" rx="7" fill={c.mint} opacity="0.85" />
    </Svg>
  );
}

export function EmptyHistoryArt({ isDark, size }: ArtProps) {
  const c = palette(isDark);
  return (
    <Svg width={size} height={size * 0.78} viewBox="0 0 160 124" fill="none">
      <Circle cx="80" cy="60" r="46" fill={c.lavender} />
      <Rect x="42" y="38" width="76" height="12" rx="6" fill={c.card} stroke={c.stroke} />
      <Rect x="42" y="56" width="58" height="12" rx="6" fill={c.card} opacity="0.7" />
      <Rect x="42" y="74" width="44" height="12" rx="6" fill={c.card} opacity="0.4" />
      <Circle cx="118" cy="44" r="5" fill={c.purple} />
    </Svg>
  );
}

export function EmptyBudgetsArt({ isDark, size }: ArtProps) {
  const c = palette(isDark);
  return (
    <Svg width={size} height={size * 0.78} viewBox="0 0 160 124" fill="none">
      <Circle cx="80" cy="58" r="44" fill={c.lavender} />
      <Rect
        x="50"
        y="32"
        width="60"
        height="54"
        rx="12"
        fill={c.card}
        stroke={c.stroke}
        strokeWidth="1.2"
      />
      <Path d="M80 48 V70" stroke={c.purple} strokeWidth="2.4" strokeLinecap="round" />
      <Path d="M69 59 H91" stroke={c.purple} strokeWidth="2.4" strokeLinecap="round" />
      <Ellipse cx="80" cy="108" rx="36" ry="7" fill={c.soft} />
    </Svg>
  );
}
