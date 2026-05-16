import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { EnergyLevel } from '@/types/DayPlan';

const LEVEL_KEYS: Record<number, string> = {
  1: 'home.energySelector.levels.veryLow',
  2: 'home.energySelector.levels.low',
  3: 'home.energySelector.levels.ok',
  4: 'home.energySelector.levels.good',
  5: 'home.energySelector.levels.great',
};

const LEVELS: { level: EnergyLevel; emoji: string }[] = [
  { level: 1, emoji: '😴' },
  { level: 2, emoji: '😐' },
  { level: 3, emoji: '🙂' },
  { level: 4, emoji: '😊' },
  { level: 5, emoji: '✨' },
];

interface EnergySelectorProps {
  value: EnergyLevel | null;
  onChange: (level: EnergyLevel) => void;
}

/**
 * Five-step energy selector. Uses both emoji and numeric labels for accessibility.
 */
export function EnergySelector({ value, onChange }: EnergySelectorProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex-row gap-[6px]"
      accessible
      accessibilityLabel={
        value ? `${t('home.energySelector.label')} ${t(LEVEL_KEYS[value])}` : t('home.energySelector.accessibilityLabel')
      }
      accessibilityRole="radiogroup">
      {LEVELS.map(({ level, emoji }) => {
        const active = value === level;
        const label = t(LEVEL_KEYS[level]);
        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            className="flex-1 items-center py-[10px] rounded-xl border-2 gap-[3px] min-h-[64px] justify-center"
            style={{
              backgroundColor: active ? theme.accent : theme.backgroundElement,
              borderColor: active ? theme.accent : theme.backgroundElement,
            }}
            accessibilityRole="radio"
            accessibilityLabel={`${label} energy`}
            accessibilityState={{ selected: active }}
            accessibilityHint={t('home.energySelector.accessibilityHint')}>
            <Text className="text-xl">{emoji}</Text>
            <Text
              className="text-[10px] font-semibold text-center"
              style={{ color: active ? Brand.offWhite : theme.textSecondary }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
