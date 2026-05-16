import { Image } from 'expo-image';
import { version } from 'expo/package.json';
import React from 'react';
import { useColorScheme } from 'react-native';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView className="p-8 items-center gap-2">
      <ThemedText type="code" themeColor="textSecondary" className="text-center">
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={{ width: 123, aspectRatio: 123 / 24 }}
      />
    </ThemedView>
  );
}
