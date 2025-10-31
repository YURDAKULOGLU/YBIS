import React from 'react';
import { TextInput } from 'react-native';
import { YStack, XStack, Button, useTheme } from '@ybis/ui';
import { Plus, Send, Mic } from '@ybis/ui';
import { useTranslation } from 'react-i18next';

import type { LayoutChangeEvent } from 'react-native';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  handleVoiceRecord: () => void;
  handleQuickActionPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function ChatInput({
  inputText,
  setInputText,
  handleSendMessage,
  handleVoiceRecord,
  handleQuickActionPress,
  onLayout,
}: ChatInputProps): React.ReactElement {
  const { t } = useTranslation('mobile');
  const theme = useTheme();

  return (
    <YStack
      padding="$3"
      borderTopWidth={1}
      borderColor="$gray5"
      backgroundColor="$background"
      onLayout={onLayout}
    >
      <XStack gap="$3" alignItems="center">
        <Button
          size="$4"
          circular
          icon={Plus}
          backgroundColor="$gray3"
          borderWidth={0}
          pressStyle={{ scale: 0.92, backgroundColor: '$gray4' }}
          animation="bouncy"
          onPress={handleQuickActionPress}
        />

        <TextInput
          style={{
            flex: 1,
            backgroundColor: theme.gray2?.val,
            borderColor: theme.gray5?.val,
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 16,
            color: theme.color?.val,
            maxHeight: 120, // Limit height for multiline
          }}
          placeholder={t('input.placeholder')}
          placeholderTextColor={theme.gray10?.val}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          multiline
          textAlignVertical="center"
          returnKeyType="send"
          blurOnSubmit={false}
        />

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
              onPress={handleSendMessage}
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
            />
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}
