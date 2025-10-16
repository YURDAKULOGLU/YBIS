import { XStack, Input, Button } from 'tamagui';
import { Send } from '@tamagui/lucide-icons';
import { type ChatInputProps } from './types';

/**
 * ChatInput Component
 *
 * Chat input field with send button
 * Features:
 * - Text input
 * - Send button with icon
 * - Disabled state support
 * - Placeholder customization
 */
export function ChatInput({
  value,
  onChangeText,
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
}: ChatInputProps) {
  return (
    <XStack gap="$2" alignItems="center">
      <Input
        flex={1}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        disabled={disabled}
        opacity={disabled ? 0.6 : 1}
      />
      <Button
        size="$4"
        theme="blue"
        icon={Send}
        onPress={onSend}
        disabled={disabled}
        circular
        opacity={disabled ? 0.6 : 1}
      />
    </XStack>
  );
}
