import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

import { EnergySelector } from '@/components/EnergySelector';
import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTodayPlan } from '@/storage/DayPlanContext';
import { formatDateLabel, todayKey } from '@/utils/date';
import { updateEnergy, updateReflection } from '@/utils/plan';

export default function ReflectScreen() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { plan, updatePlan, loading } = useTodayPlan();
  const [saved, setSaved] = useState(false);
  const [initialEnergy] = useState(plan?.energy ?? null);

  const hasReflection = plan.reflection?.trim().length > 0;
  const energyChanged = plan.energy !== initialEnergy;
  const canSave = hasReflection || energyChanged;

  function handleSave() {
    updatePlan(prev => ({ ...prev })); // Trigger explicit save
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2" accessible accessibilityLabel={t('common.brandName')}>
            <Logo scale={1.1} />
            <Text className="text-lg font-bold tracking-[0.3px]" style={{ color: theme.text }}>{t('common.brandName')}</Text>
          </View>
          <Text className="text-[13px] font-medium" style={{ color: theme.textSecondary }}>
            {formatDateLabel(todayKey(), i18n.language)}
          </Text>
        </View>

        <Text className="text-[26px] font-bold mb-1" style={{ color: theme.text }}>{t('reflect.title')}</Text>
        <Text className="text-sm font-medium mb-6" style={{ color: theme.textSecondary }}>
          {t('reflect.subtitle')}
        </Text>

        {/* Energy */}
        <View className="mb-6 gap-2">
          <Text className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
            {t('reflect.sections.energy')}
          </Text>
          <EnergySelector
            value={plan.energy}
            onChange={energy => updatePlan(prev => updateEnergy(prev, energy))}
          />
        </View>

        {/* Reflection */}
        <View className="mb-6 gap-2">
          <Text className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
            {t('reflect.sections.reflection')}
          </Text>
          <View className="rounded-[14px] p-[14px] min-h-[140px]" style={{ backgroundColor: theme.backgroundElement }}>
            <TextInput
              value={plan.reflection}
              onChangeText={text => updatePlan(prev => updateReflection(prev, text))}
              placeholder={t('reflect.reflectionInput.placeholder')}
              placeholderTextColor={theme.textSecondary}
              className="text-base leading-6 font-medium min-h-[120px]"
              style={{ color: theme.text }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              accessibilityLabel={t('reflect.reflectionInput.accessibilityLabel')}
              accessibilityHint={t('reflect.reflectionInput.accessibilityHint')}/>
          </View>
        </View>

        {/* Focus summary */}
        {plan.focus.trim().length > 0 && (
          <View
            className="rounded-xl p-[14px] gap-1 mb-6"
            style={{ backgroundColor: theme.backgroundElement }}
            accessible
            accessibilityLabel={t('reflect.focusSummary.accessibilityLabel') + ': ' + plan.focus}>
            <Text className="text-[10px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
              {t('reflect.focusSummary.label')}
            </Text>
            <Text className="text-[15px] font-semibold leading-[22px]" style={{ color: theme.text }}>{plan.focus}</Text>
          </View>
        )}

        {/* Save */}
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={{
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            minHeight: 54,
            justifyContent: 'center',
            backgroundColor: canSave ? Brand.orange : theme.textSecondary,
            opacity: canSave ? 1 : 0.5,
          }}
          accessibilityRole="button"
          accessibilityLabel={saved ? t('reflect.saveButton.savedText') : t('reflect.saveButton.accessibilityLabel')}
          accessibilityHint={!canSave ? t('reflect.saveButton.disabledHint') : undefined}>
          <Text style={{ color: '#FAF8F3', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 }}>
            {saved ? t('reflect.saveButton.savedText') : t('reflect.saveButton.text')}
          </Text>
        </Pressable>

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}
