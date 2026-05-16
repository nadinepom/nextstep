import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

const typeClassNames: Record<string, string> = {
  default: 'text-base leading-6 font-medium',
  title: 'text-5xl font-semibold leading-[52px]',
  small: 'text-sm leading-5 font-medium',
  smallBold: 'text-sm leading-5 font-bold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  link: 'leading-[30px] text-sm',
  linkPrimary: 'leading-[30px] text-sm text-[#3c87f7]',
  code: 'text-xs font-medium',
};

export function ThemedText({ style, type = 'default', themeColor, className, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  const codeStyle =
    type === 'code'
      ? {
          fontFamily: Fonts?.mono,
          fontWeight: Platform.select({ android: '700' as const }) ?? ('500' as const),
        }
      : undefined;

  return (
    <Text
      className={`${typeClassNames[type] ?? ''} ${className ?? ''}`}
      style={[{ color: theme[themeColor ?? 'text'] }, codeStyle, style]}
      {...rest}
    />
  );
}
