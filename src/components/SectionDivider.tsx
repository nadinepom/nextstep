import React from 'react';
import { View } from 'react-native';

import { Brand } from '@/constants/theme';

/**
 * Subtle decorative divider between sections.
 * Uses the brand gold color for a warm, accessible accent.
 */
export function SectionDivider() {
  return (
    <View
      className="h-0.5 w-6 rounded-sm my-1"
      style={{ backgroundColor: Brand.gold }}
      accessible={false}
    />
  );
}
