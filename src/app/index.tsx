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
import { FocusCard } from '@/components/FocusCard';
import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionDivider } from '@/components/SectionDivider';
import { TaskItem } from '@/components/TaskItem';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTodayPlan } from '@/storage/DayPlanContext';
import { MAX_TASKS } from '@/types/DayPlan';
import { formatDateLabel, timeGreetingKey, todayKey } from '@/utils/date';
import {
  addTask,
  completedCount,
  removeTask,
  toggleTask,
  updateEnergy,
  updateFocus,
  updateTaskText,
} from '@/utils/plan';

export default function HomeScreen() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { plan, updatePlan, loading } = useTodayPlan();
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  function handleFocusChange(text: string) {
    updatePlan(prev => updateFocus(prev, text));
  }

  function handleToggleTask(id: string) {
    updatePlan(prev => toggleTask(prev, id));
  }

  function handleDeleteTask(id: string) {
    updatePlan(prev => removeTask(prev, id));
  }

  function handleUpdateTaskText(id: string, text: string) {
    updatePlan(prev => updateTaskText(prev, id, text));
  }

  function handleAddTaskCommit() {
    if (newTaskText.trim()) {
      updatePlan(prev => addTask(prev, newTaskText));
    }
    setNewTaskText('');
    setAddingTask(false);
  }

  const done = completedCount(plan);
  const total = plan.tasks.length;
  const canAddMore = total < MAX_TASKS;

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
          <Text
            className="text-[13px] font-medium"
            style={{ color: theme.textSecondary }}
            accessibilityLabel={t('home.dateAccessibility', { date: formatDateLabel(todayKey(), i18n.language) })}>
            {formatDateLabel(todayKey(), i18n.language)}
          </Text>
        </View>

        {/* Greeting */}
        <Text className="text-[26px] font-bold mb-1" style={{ color: theme.text }}>{t(timeGreetingKey())}!</Text>
        <Text className="text-sm font-medium mb-6" style={{ color: theme.textSecondary }}>
          {t('home.tagline')}
        </Text>

        {/* Focus */}
        <View className="mb-6 gap-2">
          <Text className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
            {t('home.sections.focus')}
          </Text>
          <FocusCard focus={plan.focus} onChange={handleFocusChange} />
        </View>
        <SectionDivider />

        {/* Tasks */}
        <View className="mb-6 gap-2">
          <Text className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
            {total > 0 ? t('home.sections.tasksWithProgress', { done, total }) : t('home.sections.tasks')}
          </Text>
          <View className="px-[14px] py-1 rounded-[14px]" style={{ backgroundColor: theme.backgroundElement }}>
            {plan.tasks.length === 0 && !addingTask && (
              <Text className="text-sm py-3 text-center" style={{ color: theme.textSecondary }}>
                {t('home.taskList.emptyHint')}
              </Text>
            )}
            {plan.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onUpdateText={handleUpdateTaskText}
              />
            ))}

            {/* Inline add task */}
            {addingTask && (
              <View className="flex-row items-center gap-3 py-[10px] min-h-[44px]">
                <View
                  className="w-6 h-6 rounded-xl border-2 shrink-0"
                  style={{ borderColor: theme.textSecondary }}
                  accessible={false}
                />
                <TextInput
                  autoFocus
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                  onBlur={handleAddTaskCommit}
                  onSubmitEditing={handleAddTaskCommit}
                  placeholder={t('home.taskList.newTaskPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  className="flex-1 text-base font-medium p-0 leading-[22px]"
                  style={{ color: theme.text }}
                  returnKeyType="done"
                  accessibilityLabel={t('home.taskList.inputA11y')}
                  blurOnSubmit
                />
              </View>
            )}

            {canAddMore && !addingTask && (
              <Pressable
                onPress={() => setAddingTask(true)}
                className="py-[10px] min-h-[44px] justify-center"
                accessibilityRole="button"
                accessibilityLabel={t('home.taskList.addButtonA11y')}
                accessibilityHint={
                  (MAX_TASKS - total) === 1
                    ? t('home.taskList.addButtonHint', { remaining: MAX_TASKS - total })
                    : t('home.taskList.addButtonHintPlural', { remaining: MAX_TASKS - total })
                }>
                <Text className="text-[15px] font-semibold" style={{ color: theme.accent }}>{t('home.taskList.addButton')}</Text>
              </Pressable>
            )}
          </View>
        </View>
        <SectionDivider />

        {/* Energy */}
        <View className="mb-6 gap-2">
          <Text className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
            {t('home.sections.energy')}
          </Text>
          <EnergySelector
            value={plan.energy}
            onChange={energy => updatePlan(prev => updateEnergy(prev, energy))}
          />
        </View>

        {/* Progress */}
        {total > 0 && (
          <View className="mb-6 gap-2">
            <Text className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: theme.textSecondary }}>
            {t('home.sections.progress')}
          </Text>
            <View
              className="flex-row items-center gap-2"
              accessible
              accessibilityLabel={t('home.progress.tasksCompleted', { completed: done, total })}>
              {Array.from({ length: MAX_TASKS }).map((_, i) => (
                <View
                  key={i}
                  className="w-[14px] h-[14px] rounded-[7px]"
                  style={{
                    backgroundColor:
                      i < done
                        ? theme.accent
                        : i < total
                        ? theme.backgroundSelected
                        : theme.backgroundElement,
                    opacity: i >= total ? 0.3 : 1,
                  }}
                  accessible={false}
                />
              ))}
              <Text className="text-sm font-medium ml-1" style={{ color: theme.textSecondary }}>
                {done === total && total > 0 ? t('home.progress.allDone') : t('home.progress.doneLabel', { done, total })}
              </Text>
            </View>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}

