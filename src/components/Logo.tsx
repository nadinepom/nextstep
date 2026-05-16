import React from 'react';
import { View } from 'react-native';

import { Brand } from '@/constants/theme';

interface LogoProps {
  /** Scales all dimensions. Default: 1. */
  scale?: number;
  color?: string;
}

/**
 * NextStep logo: three ascending rectangles representing upward steps.
 * Purely geometric, no image or SVG dependency required.
 */
export function Logo({ scale = 1, color = Brand.orange }: LogoProps) {
  const barWidth = 7 * scale;
  const gap = 3 * scale;
  const radius = 2 * scale;

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'flex-end', gap }}
      accessible={false}
      importantForAccessibility="no">
      <View
        style={{
          width: barWidth,
          height: 8 * scale,
          borderRadius: radius,
          backgroundColor: color,
          opacity: 0.55,
        }}
      />
      <View
        style={{
          width: barWidth,
          height: 14 * scale,
          borderRadius: radius,
          backgroundColor: color,
          opacity: 0.78,
        }}
      />
      <View
        style={{
          width: barWidth,
          height: 20 * scale,
          borderRadius: radius,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
