import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { WeekDayRow } from '@/components/WeekDayRow';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useWeekPlans } from '@/storage/DayPlanContext';
import { completedCount } from '@/utils/plan';

export default function OverviewScreen() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { plans, days, loading } = useWeekPlans();

  const totalTasksDone = days.reduce((sum, d) => sum + (plans[d] ? completedCount(plans[d]) : 0), 0);
  const daysWithReflection = days.filter(d => plans[d]?.reflection?.trim().length > 0).length;
  const daysWithFocus = days.filter(d => plans[d]?.focus?.trim().length > 0).length;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <ActivityIndicator color={Brand.orange} />
      </View>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingTop: 24 }}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2" accessible accessibilityLabel={t('common.brandName')}>
            <Logo scale={1.1} />
            <Text className="text-lg font-bold tracking-[0.3px]" style={{ color: theme.text }}>{t('common.brandName')}</Text>
          </View>
        </View>

        <Text className="text-[26px] font-bold mb-1" style={{ color: theme.text }}>{t('overview.title')}</Text>
        <Text className="text-sm font-medium mb-4" style={{ color: theme.textSecondary }}>
          {t('overview.subtitle')}
        </Text>

        {/* Weekly stats strip */}
        <View className="flex-row gap-2 mb-4">
          <View
            className="flex-1 rounded-xl py-3 px-2 items-center gap-[2px]"
            style={{ backgroundColor: theme.backgroundElement }}
            accessible
            accessibilityLabel={t('overview.stats.tasksDoneA11y', { count: totalTasksDone })}>
            <Text className="text-2xl font-extrabold" style={{ color: theme.accent }}>{totalTasksDone}</Text>
            <Text className="text-[10px] font-semibold text-center tracking-[0.3px]" style={{ color: theme.textSecondary }}>{t('overview.stats.tasksDone')}</Text>
          </View>
          <View
            className="flex-1 rounded-xl py-3 px-2 items-center gap-[2px]"
            style={{ backgroundColor: theme.backgroundElement }}
            accessible
            accessibilityLabel={t('overview.stats.daysWithFocusA11y', { count: daysWithFocus })}>
            <Text className="text-2xl font-extrabold" style={{ color: theme.accent }}>{daysWithFocus}</Text>
            <Text className="text-[10px] font-semibold text-center tracking-[0.3px]" style={{ color: theme.textSecondary }}>{t('overview.stats.daysWithFocus')}</Text>
          </View>
          <View
            className="flex-1 rounded-xl py-3 px-2 items-center gap-[2px]"
            style={{ backgroundColor: theme.backgroundElement }}
            accessible
            accessibilityLabel={t('overview.stats.reflectionsA11y', { count: daysWithReflection })}>
            <Text className="text-2xl font-extrabold" style={{ color: theme.accent }}>{daysWithReflection}</Text>
            <Text className="text-[10px] font-semibold text-center tracking-[0.3px]" style={{ color: theme.textSecondary }}>{t('overview.stats.reflections')}</Text>
          </View>
        </View>

        {/* Column headers */}
        <View className="flex-row items-center px-3 mb-1 gap-3">
          <View className="w-[52px]" />
          <View className="flex-1">
            <Text className="text-[10px] font-bold tracking-[0.6px] uppercase" style={{ color: theme.textSecondary }}>{t('overview.columnHeaders.tasks')}</Text>
          </View>
          <View className="w-[44px] items-center gap-0.5">
            <Text style={{ color: theme.textSecondary }}>{t('overview.columnHeaders.energy')}</Text>
            <Text className="text-[9px] font-bold uppercase tracking-[0.3px]" style={{ color: theme.textSecondary }}>{t('overview.columnHeaders.energyLabel')}</Text>
          </View>
          <View className="w-[44px] items-center gap-0.5">
            <Text style={{ color: theme.textSecondary }}>{t('overview.columnHeaders.reflection')}</Text>
            <Text className="text-[9px] font-bold uppercase tracking-[0.3px]" style={{ color: theme.textSecondary }}>{t('overview.columnHeaders.reflectionLabel')}</Text>
          </View>
        </View>

        {/* Day rows */}
        <View
          className="px-3 py-1 rounded-[14px]"
          style={{ backgroundColor: theme.backgroundElement }}>
          {[...days].reverse().map((dateKey, i) => (
            <React.Fragment key={dateKey}>
              <WeekDayRow dateKey={dateKey} plan={plans[dateKey]} />
              {i < days.length - 1 && (
                <View className="h-[1px] -mx-3" style={{ backgroundColor: theme.background }} />
              )}
            </React.Fragment>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}
