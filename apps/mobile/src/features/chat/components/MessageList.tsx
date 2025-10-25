import React from 'react';
import { YStack } from '@ybis/ui';
import { ChatBubble, type Message } from '@ybis/chat';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps): React.ReactElement {
  return (
    <YStack padding="$4" paddingBottom={0} gap="$2">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
    </YStack>
  );
}
