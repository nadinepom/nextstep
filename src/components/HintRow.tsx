import React, { type ReactNode } from 'react';
import { View } from 'react-native';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View className="flex-row justify-between">
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" className="rounded-lg py-0.5 px-2">
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}
