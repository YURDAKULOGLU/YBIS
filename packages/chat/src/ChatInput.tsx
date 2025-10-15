/**
 * ChatInput Component
 * WhatsApp-style input with mic/send toggle
 *
 * Features:
 * - Smart button toggle: Mic (empty) ↔ Send (has text)
 * - Rounded input field with subtle background
 * - Smooth button transitions (instant feedback)
 * - Optional quick actions button (+)
 * - Universal (works on mobile, web, desktop)
 */

import React, { useState } from 'react';
import { YStack, XStack, Input, Button } from 'tamagui';
import { Plus, Send, Mic } from '@tamagui/lucide-icons';

export interface ChatInputProps {
  /**
   * Send message callback
   */
  onSendMessage: (text: string) => void;

  /**
   * Voice record callback (optional)
   */
  onVoiceRecord?: () => void;

  /**
   * Quick actions callback (optional)
   */
  onQuickActions?: () => void;

  /**
   * Input placeholder
   */
  placeholder?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onVoiceRecord,
  onQuickActions,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleVoiceRecord = () => {
    if (onVoiceRecord) {
      onVoiceRecord();
    }
  };

  return (
    <YStack
      padding="$3"
      paddingBottom="$4"
      borderTopWidth={1}
      borderColor="$gray5"
      backgroundColor="$background"
    >
      <XStack gap="$3" alignItems="center">
        {/* Quick Actions Button (optional) */}
        {onQuickActions && (
          <Button
            size="$4"
            circular
            icon={Plus}
            backgroundColor="$gray3"
            borderWidth={0}
            pressStyle={{ scale: 0.92, backgroundColor: '$gray4' }}
            animation="bouncy"
            onPress={onQuickActions}
            disabled={disabled}
          />
        )}

        {/* Text Input */}
        <Input
          flex={1}
          placeholder={placeholder}
          placeholderTextColor="$gray10"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          backgroundColor="$gray2"
          borderWidth={1}
          borderColor="$gray5"
          borderRadius="$10"
          paddingHorizontal="$4"
          paddingVertical="$3"
          fontSize="$4"
          disabled={disabled}
        />

        {/* Send or Mic Button - Instant Transition */}
        <YStack width={48} height={48} alignItems="center" justifyContent="center">
          {inputText.trim() ? (
            <Button
              key="send"
              size="$4"
              circular
              icon={Send}
              backgroundColor="$blue9"
              borderWidth={0}
              pressStyle={{ scale: 0.88, backgroundColor: '$blue10' }}
              animation="bouncy"
              onPress={handleSend}
              disabled={disabled}
            />
          ) : (
            <Button
              key="mic"
              size="$4"
              circular
              icon={Mic}
              backgroundColor="$gray3"
              borderWidth={0}
              pressStyle={{ scale: 0.88, backgroundColor: '$blue9' }}
              animation="bouncy"
              onPress={handleVoiceRecord}
              disabled={disabled || !onVoiceRecord}
            />
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};
