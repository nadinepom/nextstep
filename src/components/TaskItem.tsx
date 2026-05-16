import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types/DayPlan';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
}

/**
 * Single task row. Tap the circle to toggle completion.
 * Tap the text to edit inline. Tap × to delete.
 */
export function TaskItem({ task, onToggle, onDelete, onUpdateText }: TaskItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef<TextInput>(null);

  function startEditing() {
    setDraft(task.text);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function commitEdit() {
    setEditing(false);
    onUpdateText(task.id, draft);
  }

  return (
    <View className="flex-row items-center py-[10px] gap-3 min-h-[44px]" accessibilityRole="none">
      {/* Completion toggle */}
      <Pressable
        onPress={() => onToggle(task.id)}
        className="w-6 h-6 rounded-xl border-2 items-center justify-center shrink-0"
        style={{
          borderColor: task.completed ? theme.accent : theme.textSecondary,
          backgroundColor: task.completed ? theme.accent : 'transparent',
        }}
        hitSlop={12}
        accessibilityRole="checkbox"
        accessibilityLabel={t('taskItem.taskLabel', { text: task.text })}
        accessibilityState={{ checked: task.completed }}
        accessibilityHint={t('taskItem.toggleHint')}>
        {task.completed && (
          <Text className="text-[13px] text-[#FAF8F3] font-bold leading-4">✓</Text>
        )}
      </Pressable>

      {/* Task text / inline editor */}
      {editing ? (
        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onBlur={commitEdit}
          onSubmitEditing={commitEdit}
          className="flex-1 text-base leading-[22px] font-medium p-0"
          style={{ color: theme.text }}
          placeholderTextColor={theme.textSecondary}
          returnKeyType="done"
          blurOnSubmit
          accessibilityLabel={t('taskItem.editLabel')}
        />
      ) : (
        <Pressable
          onPress={task.completed ? undefined : startEditing}
          className="flex-1"
          accessibilityLabel={task.completed ? undefined : t('taskItem.editLabel')}
          accessibilityHint={task.completed ? undefined : t('taskItem.editHint')}>
          <Text
            className="text-base leading-[22px] font-medium"
            style={{
              color: task.completed ? theme.textSecondary : theme.text,
              textDecorationLine: task.completed ? 'line-through' : 'none',
            }}>
            {task.text}
          </Text>
        </Pressable>
      )}

      {/* Delete */}
      <Pressable
        onPress={() => onDelete(task.id)}
        className="w-8 h-8 items-center justify-center shrink-0"
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={t('taskItem.deleteLabel', { text: task.text })}>
        <Text className="text-sm font-semibold" style={{ color: theme.textSecondary }}>✕</Text>
      </Pressable>
    </View>
  );
}
