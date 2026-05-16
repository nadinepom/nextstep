import { Platform } from 'react-native';

/** Raw NextStep brand palette. */
export const Brand = {
  orange: '#C8742A',
  orangeLight: '#D4894A', // softer for dark mode
  gold: '#C9A500', // warm gold/yellow (WCAG AA accessible with offWhite & darkOlive)
  lightGreen: '#B8C99D',
  sand: '#E7D8C9',
  offWhite: '#FAF8F3',
  darkOlive: '#4B4A3F',
  oliveMid: '#7A7869',
  oliveDark: '#2A2923',
} as const;

export const Colors = {
  light: {
    text: Brand.darkOlive,
    background: Brand.offWhite,
    backgroundElement: Brand.sand,
    backgroundSelected: Brand.lightGreen,
    textSecondary: Brand.oliveMid,
    accent: Brand.orange,
  },
  dark: {
    text: Brand.offWhite,
    background: Brand.oliveDark,
    backgroundElement: '#35342E',
    backgroundSelected: Brand.darkOlive,
    textSecondary: Brand.lightGreen,
    accent: Brand.orangeLight,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
