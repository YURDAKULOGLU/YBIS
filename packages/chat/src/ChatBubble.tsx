import { Card, Text, YStack, XStack } from 'tamagui';
import { Bot, User } from '@tamagui/lucide-icons';
import { type ChatBubbleProps } from './types';

/**
 * ChatBubble Component
 *
 * Displays a single message bubble with:
 * - User/AI avatar
 * - Message text
 * - Timestamp
 * - Different styling for user vs AI messages
 */
export function ChatBubble({ message, showAvatar = true }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <XStack
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      gap="$2"
    >
      {/* AI Avatar (left side) */}
      {!isUser && showAvatar && (
        <YStack
          width={32}
          height={32}
          borderRadius="$4"
          backgroundColor="$purple4"
          alignItems="center"
          justifyContent="center"
        >
          <Bot size={20} color="$purple11" />
        </YStack>
      )}

      {/* Message Card */}
      <Card
        maxWidth="75%"
        padding="$3"
        bordered={isUser}
        backgroundColor={isUser ? '$blue4' : '$gray3'}
      >
        <Text
          color={isUser ? '$blue12' : '$color'}
          fontSize="$3"
        >
          {message.text}
        </Text>
        <Text
          color={isUser ? '$blue11' : '$gray11'}
          fontSize="$1"
          marginTop="$2"
        >
          {message.timestamp}
        </Text>
      </Card>

      {/* User Avatar (right side) */}
      {isUser && showAvatar && (
        <YStack
          width={32}
          height={32}
          borderRadius="$4"
          backgroundColor="$blue4"
          alignItems="center"
          justifyContent="center"
        >
          <User size={20} color="$blue11" />
        </YStack>
      )}
    </XStack>
  );
}
