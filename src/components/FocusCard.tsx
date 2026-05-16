import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface FocusCardProps {
  focus: string;
  onChange: (text: string) => void;
}

/**
 * Displays today's main focus goal. Tapping the card enters edit mode.
 * Auto-saves on blur.
 */
export function FocusCard({ focus, onChange }: FocusCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(focus);
  const inputRef = useRef<TextInput>(null);

  // Keep draft in sync when external value changes (e.g. on initial load)
  useEffect(() => {
    if (!editing) setDraft(focus);
  }, [focus, editing]);

  function startEditing() {
    setDraft(focus);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function commitEdit() {
    setEditing(false);
    onChange(draft);
  }

  const isEmpty = !focus.trim();

  return (
    <Pressable
      onPress={editing ? undefined : startEditing}
      className="rounded-[14px] p-4 min-h-[72px] justify-center"
      style={{ backgroundColor: theme.backgroundElement }}
      accessibilityLabel={
        isEmpty ? t('home.focusCard.emptyAccessibility') : t('home.focusCard.filledAccessibility', { focus })
      }
      accessibilityRole="button"
      accessibilityHint={t('home.focusCard.accessibilityHint')}>
      {editing ? (
        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onBlur={commitEdit}
          onSubmitEditing={commitEdit}
          placeholder={t('home.focusCard.emptyPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          className="leading-6 font-medium p-0 min-h-[48px]"
          style={{ color: theme.text, fontSize: Platform.select({ web: 16, default: 17 }) }}
          multiline
          returnKeyType="done"
          accessibilityLabel={t('home.focusCard.editAccessibilityLabel')}
          autoCorrect
        />
      ) : (
        <View className="flex-row items-start gap-2">
          <Text
            className="flex-1 text-[17px] leading-6 font-medium"
            style={{ color: isEmpty ? theme.textSecondary : theme.text }}
            numberOfLines={3}>
            {isEmpty ? t('home.focusCard.emptyPlaceholder') : focus}
          </Text>
          <View
            className="rounded-[6px] px-2 py-[3px] self-start mt-[2px]"
            style={{ backgroundColor: theme.backgroundSelected }}
            accessible={false}>
            <Text className="text-xs font-semibold" style={{ color: theme.text }}>{t('home.focusCard.editLabel')}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
