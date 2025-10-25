import React from 'react';
import { Card, Text, YStack, XStack } from '@ybis/ui';
import Logger from '@ybis/logging';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ConversationItemProps {
  conversation: Conversation;
}

export function ConversationItem({ conversation }: ConversationItemProps): React.ReactElement {
  const handleConversationPress = (conversationId: string, title: string): void => {
    Logger.info('Conversation pressed', {
      type: 'USER_ACTION',
      component: 'ConversationItem',
      conversationId,
      title,
    });
    // TODO: Navigate to the actual chat thread
    // router.push(`/chat/${conversationId}`);
  };

  return (
    <Card 
      key={conversation.id} 
      padding="$4" 
      bordered 
      pressStyle={{ scale: 0.98, backgroundColor: '$gray2' }}
      animation="bouncy"
      onPress={() => handleConversationPress(conversation.id, conversation.title)}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} gap="$1">
          <Text fontWeight="600" fontSize="$5" color="$color">
            {conversation.title}
          </Text>
          <Text color="$gray11" fontSize="$3" numberOfLines={1} ellipsizeMode="tail">
            {conversation.lastMessage}
          </Text>
        </YStack>
        <Text color="$gray10" fontSize="$2">
          {conversation.timestamp}
        </Text>
      </XStack>
    </Card>
  );
}
