import { useState } from 'react';
import { YStack, H2, Text, Card, ScrollView, XStack, Input, Button } from 'tamagui';
import { Send, Bot, User } from '@tamagui/lucide-icons';

/**
 * Chat Screen
 *
 * DEMO MODE: Mock chat interface for UI testing
 * Real AI integration coming in Epic 4 (AI Chat Feature)
 *
 * Features (Demo):
 * - Chat bubble layout
 * - User and AI messages
 * - Input field (placeholder)
 * - Send button (non-functional)
 */

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Mock conversation
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    sender: 'ai',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: 'Can you help me organize my tasks for today?',
    sender: 'user',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    text: 'Of course! I see you have 5 active tasks. Let me help you prioritize them based on deadlines and importance.',
    sender: 'ai',
    timestamp: '10:31 AM',
  },
  {
    id: '4',
    text: 'That sounds great!',
    sender: 'user',
    timestamp: '10:32 AM',
  },
];

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    console.log('Send message - UI preview only (Epic 4)');
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <YStack padding="$4" gap="$2" borderBottomWidth={1} borderColor="$gray5">
        <H2>AI Assistant</H2>
        <Text color="$gray11" fontSize="$3">
          Ask me anything about your tasks, notes, and schedule
        </Text>
      </YStack>

      {/* Messages */}
      <ScrollView flex={1}>
        <YStack padding="$4" gap="$3">
          {MOCK_MESSAGES.map((message) => (
            <XStack
              key={message.id}
              justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              gap="$2"
            >
              {message.sender === 'ai' && (
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
              <Card
                maxWidth="75%"
                padding="$3"
                bordered={message.sender === 'user'}
                backgroundColor={message.sender === 'user' ? '$blue4' : '$gray3'}
              >
                <Text
                  color={message.sender === 'user' ? '$blue12' : '$color'}
                  fontSize="$3"
                >
                  {message.text}
                </Text>
                <Text
                  color={message.sender === 'user' ? '$blue11' : '$gray11'}
                  fontSize="$1"
                  marginTop="$2"
                >
                  {message.timestamp}
                </Text>
              </Card>
              {message.sender === 'user' && (
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
          ))}

          {/* Demo Mode Notice */}
          <Card padding="$4" marginTop="$4" backgroundColor="$yellow2" borderColor="$yellow6" bordered>
            <Text color="$yellow11" fontSize="$3" textAlign="center" fontWeight="600">
              💬 DEMO MODE: Mock chat interface
            </Text>
            <Text color="$yellow11" fontSize="$2" textAlign="center" marginTop="$2">
              Real AI integration coming in Epic 4
            </Text>
          </Card>
        </YStack>
      </ScrollView>

      {/* Input Area */}
      <YStack padding="$4" borderTopWidth={1} borderColor="$gray5" backgroundColor="$background">
        <XStack gap="$2" alignItems="center">
          <Input
            flex={1}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            disabled
            opacity={0.6}
          />
          <Button
            size="$4"
            theme="blue"
            icon={Send}
            onPress={handleSend}
            disabled
            circular
            opacity={0.6}
          />
        </XStack>
        <Text color="$gray10" fontSize="$2" marginTop="$2" textAlign="center">
          Message input disabled in demo mode
        </Text>
      </YStack>
    </YStack>
  );
}
