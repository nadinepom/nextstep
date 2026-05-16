import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface ScreenContainerProps {
  children: ReactNode;
  /**
   * Background color for the outer container.
   * If not provided, uses theme.background.
   */
  backgroundColor?: string;
}

/**
 * Standard container for all app screens.
 * - Constrains width to MaxContentWidth on web/desktop
 * - Ensures 24px padding on sides
 * - Handles safe area automatically
 * - Scrollable content ready
 */
export function ScreenContainer({ children, backgroundColor }: ScreenContainerProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: backgroundColor ?? theme.background }}
      edges={['top', 'left', 'right']}>
      <View
        className="flex-1 px-6 w-full"
        style={{ maxWidth: MaxContentWidth, alignSelf: 'center' }}>
        {children}
      </View>
    </SafeAreaView>
  );
}
