/**
 * QuickAddInput Component
 *
 * Input field with add button for quick item creation.
 * Handles text input, submission, and loading states.
 *
 * @module features/widgets/components/QuickAddInput
 */

import React from 'react';
import { TextInput, ActivityIndicator } from 'react-native';
import { XStack, Button, useTheme } from '@ybis/ui';
import { Plus } from '@ybis/ui';

interface QuickAddInputProps {
  /** Placeholder text */
  placeholder: string;
  /** Current input value */
  value: string;
  /** Value change handler */
  onChangeText: (text: string) => void;
  /** Submit handler */
  onSubmit: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Focus change handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
}

/**
 * QuickAddInput
 *
 * Text input with integrated add button.
 */
export function QuickAddInput({
  placeholder,
  value,
  onChangeText,
  onSubmit,
  isLoading = false,
  onFocus,
  onBlur,
}: QuickAddInputProps): React.ReactElement {
  const theme = useTheme();
  const hasValue = value.trim().length > 0;

  return (
    <XStack gap="$2" alignItems="center">
      <TextInput
        style={{
          flex: 1,
          backgroundColor: theme.background?.val,
          borderColor: theme.gray5?.val,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          color: theme.color?.val,
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.gray10?.val}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="done"
        editable={!isLoading}
      />
      <Button
        size="$3"
        circular
        icon={isLoading ? <ActivityIndicator size="small" color="white" /> : Plus}
        backgroundColor="$blue9"
        borderWidth={0}
        pressStyle={{ scale: 0.92, backgroundColor: '$blue10' }}
        animation="bouncy"
        onPress={onSubmit}
        disabled={!hasValue || isLoading}
        opacity={hasValue && !isLoading ? 1 : 0.5}
      />
    </XStack>
  );
}
