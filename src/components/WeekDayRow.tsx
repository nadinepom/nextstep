import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { DayPlan, MAX_TASKS } from '@/types/DayPlan';
import { formatDateLabel, isToday, shortWeekday } from '@/utils/date';
import { completedCount } from '@/utils/plan';

interface WeekDayRowProps {
  dateKey: string;
  plan: DayPlan;
}

/**
 * Summary row for a single day in the weekly overview.
 */
export function WeekDayRow({ dateKey, plan }: WeekDayRowProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const today = isToday(dateKey);
  const done = completedCount(plan);
  const total = plan.tasks.length;
  const hasReflection = plan.reflection.trim().length > 0;
  const hasFocus = plan.focus.trim().length > 0;

  return (
    <View
      className="flex-row items-center py-[10px] gap-3 min-h-[44px]"
      style={{
        backgroundColor: today ? theme.backgroundElement : 'transparent',
        borderRadius: today ? 12 : 0,
        paddingHorizontal: today ? 12 : 0,
      }}
      accessible
      accessibilityLabel={`${formatDateLabel(dateKey)}${today ? ', today' : ''}. ${
        hasFocus ? `Focus: ${plan.focus}. ` : 'No focus set. '
      }${total > 0 ? `${done} of ${total} tasks done.` : 'No tasks.'} ${
        plan.energy ? `Energy: ${plan.energy} out of 5.` : ''
      } ${hasReflection ? 'Reflection written.' : 'No reflection.'}`}>

      {/* Day label */}
      <View className="w-[52px] items-start gap-[1px]">
        <Text className="text-sm font-bold" style={{ color: today ? theme.accent : theme.text }}>
          {shortWeekday(dateKey, i18n.language)}
        </Text>
        {today && (
          <Text
            className="text-[9px] font-bold uppercase tracking-[0.5px]"
            style={{ color: theme.accent }}>
            {t('overview.weekDayRow.today')}
          </Text>
        )}
      </View>

      {/* Task progress dots */}
      <View className="flex-1 flex-row items-center gap-[5px]" accessible={false}>
        {Array.from({ length: MAX_TASKS }).map((_, i) => (
          <View
            key={i}
            className="w-[10px] h-[10px] rounded-[5px]"
            style={{
              backgroundColor:
                i < done
                  ? theme.accent
                  : i < total
                  ? theme.backgroundSelected
                  : theme.backgroundElement,
            }}
          />
        ))}
        <Text className="text-xs font-semibold ml-1" style={{ color: theme.textSecondary }}>
          {total > 0 ? `${done}/${total}` : '—'}
        </Text>
      </View>

      {/* Energy */}
      <View className="w-[44px] items-center">
        {plan.energy ? (
          <Text className="text-[13px] font-semibold" style={{ color: theme.textSecondary }}>
            ⚡{plan.energy}
          </Text>
        ) : (
          <Text className="text-sm font-medium" style={{ color: theme.backgroundSelected }}>
            —
          </Text>
        )}
      </View>

      {/* Reflection */}
      <View className="w-[44px] items-center">
        <Text
          className="text-sm"
          style={{ color: hasReflection ? Brand.lightGreen : theme.backgroundSelected }}>
          {hasReflection ? '📝' : '—'}
        </Text>
      </View>
    </View>
  );
}
