import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, Plus } from '@ybis/ui';
import Logger from '@ybis/logging';
import { ConversationItem } from '../../src/components/chat/ConversationItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { Navbar } from '../../src/components/layout/Navbar';
import { ActionButton } from '../../src/components/layout/ActionButton';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';

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
    <UniversalLayout>
      {/* SafeAreaView: flex: 1, handles top safe area only (tab bar manages bottom) */}
      <SafeAreaView edges={['top']} flex={1}>
        <Navbar title="Sohbetler" />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <YStack padding="$4" gap="$3">
            {mockConversations.map((convo) => (
              <ConversationItem key={convo.id} conversation={convo} />
            ))}
          </YStack>
        </ScrollView>
      </SafeAreaView>

      {/* ActionButton manages its own safe area positioning */}
      <ActionButton icon={Plus} onPress={handleNewChatPress} />
    </UniversalLayout>
  );
}