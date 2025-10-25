import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, H2, Button, Plus } from '@ybis/ui';
import Logger from '@ybis/logging';
import { ConversationItem } from '../../src/components/chat/ConversationItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';

// Mock Data for the Conversation List
const mockConversations = [
  {
    id: '1',
    title: 'İtalya Seyahat Planı',
    lastMessage: 'Harika, otel seçeneklerini gözden geçireceğim...',
    timestamp: '14:32',
  },
  {
    id: '2',
    title: 'Q3 Proje Fikirleri',
    lastMessage: 'Sunum için son rakamları ekledim.',
    timestamp: '11:15',
  },
  {
    id: '3',
    title: 'Haftalık Market Alışverişi',
    lastMessage: 'Süt ve ekmek eklemeyi unutma.',
    timestamp: 'Dün',
  },
  {
    id: '4',
    title: 'Yeni Özellik Beyin Fırtınası',
    lastMessage: 'Loglama altyapısı tamamlandı.',
    timestamp: 'Dün',
  },
];

/**
 * Chat Inbox Screen
 * 
 * Lists all active and past conversations.
 * This screen acts as the entry point to individual chat threads.
 */
export default function ChatScreen(): React.ReactElement {

  React.useEffect(() => {
    Logger.info('ChatInboxScreen mounted', { type: 'LIFECYECLE' });
  }, []);

  const handleNewChatPress = (): void => {
    Logger.info('New Chat button pressed', {
      type: 'USER_ACTION',
      component: 'FAB',
    });
    // TODO: Navigate to a new chat screen or clear the main chat
  };

  return (
    <UniversalLayout hideChatButton>
      <YStack flex={1} backgroundColor="$background">
        <ScrollView>
          <YStack padding="$4" gap="$3">
            <H2>Sohbetler</H2>
            {mockConversations.map((convo) => (
              <ConversationItem key={convo.id} conversation={convo} />
            ))}
          </YStack>
        </ScrollView>
        <Button
          size="$6"
          circular
          icon={Plus}
          theme="blue"
          elevation="$2"
          position="absolute"
          bottom="$4"
          right="$4"
          onPress={handleNewChatPress}
        />
      </YStack>
    </UniversalLayout>
  );
}