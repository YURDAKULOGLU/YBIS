import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, H2, Text, Card, XStack, Button } from '@ybis/ui';
import { Plus } from '@tamagui/lucide-icons';
import Logger from '@ybis/logging';

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

  const handleConversationPress = (conversationId: string, title: string) => {
    Logger.info('Conversation pressed', {
      type: 'USER_ACTION',
      component: 'ConversationList',
      conversationId,
      title,
    });
    // TODO: Navigate to the actual chat thread
    // router.push(`/chat/${conversationId}`);
  };

  const handleNewChatPress = () => {
    Logger.info('New Chat button pressed', {
      type: 'USER_ACTION',
      component: 'FAB',
    });
    // TODO: Navigate to a new chat screen or clear the main chat
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack padding="$4" gap="$3">
          <H2>Sohbetler</H2>
          {mockConversations.map((convo) => (
            <Card 
              key={convo.id} 
              padding="$4" 
              bordered 
              pressStyle={{ scale: 0.98, backgroundColor: '$gray2' }}
              animation="bouncy"
              onPress={() => handleConversationPress(convo.id, convo.title)}
            >
              <XStack alignItems="center" justifyContent="space-between">
                <YStack flex={1} gap="$1">
                  <Text fontWeight="600" fontSize="$5" color="$color">
                    {convo.title}
                  </Text>
                  <Text color="$gray11" fontSize="$3" numberOfLines={1} ellipsizeMode="tail">
                    {convo.lastMessage}
                  </Text>
                </YStack>
                <Text color="$gray10" fontSize="$2">
                  {convo.timestamp}
                </Text>
              </XStack>
            </Card>
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
  );
}