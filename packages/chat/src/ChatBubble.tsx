/**
 * ChatBubble Component
 * WhatsApp-style chat bubble with rounded corners and tail effect
 *
 * Features:
 * - Different styles for user (blue) vs AI (gray) messages
 * - Rounded corners with tail effect (borderTopRightRadius for user, borderTopLeftRadius for AI)
 * - Message status indicator (WhatsApp ticks)
 * - Smooth animations (enterStyle for fade-in)
 * - Universal (works on mobile, web, desktop)
 */

import React from 'react';
import { YStack, XStack, Text, Card } from 'tamagui';
import { MessageStatus } from './MessageStatus';
import type { ChatMessage } from './types';

export interface ChatBubbleProps {
  /**
   * Message data
   */
  message: ChatMessage;

  /**
   * Optional press handler
   */
  onPress?: () => void;

  /**
   * Animation delay (for staggered list animation)
   */
  animationDelay?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onPress,
  animationDelay = 0,
}) => {
  const isUser = message.sender === 'user';

  return (
    <XStack
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      animation="quick"
      enterStyle={{ opacity: 0, y: 10 }}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Card
        maxWidth="80%"
        padding="$2"
        paddingHorizontal="$3"
        backgroundColor={isUser ? '$blue9' : '$gray3'}
        borderWidth={0}
        borderRadius="$5"
        borderTopRightRadius={isUser ? '$2' : '$5'}
        borderTopLeftRadius={isUser ? '$5' : '$2'}
        onPress={onPress}
        pressStyle={onPress ? { scale: 0.98 } : undefined}
      >
        <YStack gap="$1">
          <Text
            color={isUser ? 'white' : '$color'}
            fontSize="$4"
            lineHeight="$4"
            paddingBottom="$1"
          >
            {message.text}
          </Text>
          <XStack gap="$2" alignItems="center" alignSelf="flex-end">
            <Text
              color={isUser ? 'rgba(255,255,255,0.6)' : '$gray10'}
              fontSize="$1"
            >
              {message.timestamp}
            </Text>
            {isUser && message.status && (
              <YStack marginLeft={2}>
                <MessageStatus status={message.status} />
              </YStack>
            )}
          </XStack>
        </YStack>
      </Card>
    </XStack>
  );
};
