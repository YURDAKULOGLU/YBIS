import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  Button,
  Input,
  ScrollView,
} from 'tamagui';
import { Keyboard, KeyboardAvoidingView, ScrollView as RNScrollView, useWindowDimensions } from 'react-native';
import { Plus, Send, Calendar, CheckSquare, FileText, Workflow, Mic } from '@tamagui/lucide-icons';
import { ChatBubble, type ChatMessage as ChatMessageType } from '@ybis/chat';

/**
 * Main Screen - WhatsApp-Inspired Design
 *
 * Features:
 * - Slidable tabs (Notes, Tasks, Calendar, Flows) - Smooth pills
 * - Widget area (1/5 screen, shows mini summary)
 * - Chat area (suggestion prompts when empty, WhatsApp-style bubbles when active)
 * - Smart input bar: Mic icon (empty) → Send icon (has text)
 * - Voice-to-text: Mic converts speech to text (Epic 4)
 * - Quick actions menu (+ button)
 * - Keyboard-aware: widget area shrinks when keyboard opens
 *
 * UX Improvements:
 * - WhatsApp-style chat bubbles (rounded corners, tail effect)
 * - Smooth animations (AnimatePresence, enterStyle, exitStyle)
 * - Dynamic button transitions (mic ↔ send)
 * - Rounded input field with subtle background
 * - Modern card designs with smooth press feedback
 *
 * Performance:
 * - useCallback for event handlers (prevent re-renders)
 * - useMemo for computed values
 * - useWindowDimensions hook (reactive to orientation changes)
 * - Static data outside component (TABS, PROMPTS)
 */

type TabType = 'notes' | 'tasks' | 'calendar' | 'flows';

// Using @ybis/chat types
type Message = ChatMessageType;

interface SuggestionPrompt {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Mock data - will be replaced with real data (static, outside component)
const ONBOARDING_PROMPTS: SuggestionPrompt[] = [
  {
    id: '1',
    icon: '👋',
    title: 'Başlayalım!',
    description: 'YBIS\'e hoş geldiniz. Nasıl yardımcı olabilirim?',
  },
];

const REGULAR_PROMPTS: SuggestionPrompt[] = [
  {
    id: '1',
    icon: '📝',
    title: 'Yeni not oluştur',
    description: 'Hızlıca bir not ekleyin',
  },
  {
    id: '2',
    icon: '✅',
    title: 'Bugünkü görevler',
    description: 'Yapılacaklar listesini görüntüle',
  },
  {
    id: '3',
    icon: '📅',
    title: 'Takvimi kontrol et',
    description: 'Bugünün etkinliklerini gör',
  },
];

// Static tabs configuration (outside component to prevent re-creation)
const TABS: { key: TabType; label: string; icon: typeof Calendar }[] = [
  { key: 'notes', label: 'Notes', icon: FileText },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'flows', label: 'Flows', icon: Workflow },
];

export default function MainScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); // Demo: first time onboarding
  const [showQuickActions, setShowQuickActions] = useState(false);

  const scrollViewRef = useRef<RNScrollView>(null);

  // Reactive window dimensions (handles orientation changes)
  const { height: screenHeight } = useWindowDimensions();
  const widgetHeight = useMemo(() => screenHeight * 0.2, [screenHeight]); // 1/5 of screen

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Mock AI response generator (memoized)
  const getMockAIResponse = useCallback((userText: string): string => {
    const lowerText = userText.toLowerCase();

    // Simple keyword-based responses
    if (lowerText.includes('merhaba') || lowerText.includes('selam')) {
      return 'Merhaba! Size nasıl yardımcı olabilirim? 😊';
    }
    if (lowerText.includes('nasılsın') || lowerText.includes('nasıl')) {
      return 'Ben bir AI asistanıyım, her zaman iyiyim! 🤖 Sizin için ne yapabilirim?';
    }
    if (lowerText.includes('teşekkür') || lowerText.includes('sağol')) {
      return 'Rica ederim! Başka bir konuda yardımcı olabilir miyim? 🙌';
    }
    if (lowerText.includes('görüşürüz') || lowerText.includes('hoşçakal')) {
      return 'Görüşürüz! İyi günler dilerim! 👋';
    }
    if (lowerText.includes('not') || lowerText.includes('yaz')) {
      return 'Not oluşturma özelliği yakında aktif olacak. Şimdilik size başka nasıl yardımcı olabilirim?';
    }
    if (lowerText.includes('görev') || lowerText.includes('task')) {
      return 'Görev yönetimi özellikleri geliştirilme aşamasında. Şu an için başka bir konuda yardımcı olabilir miyim?';
    }
    if (lowerText.includes('yardım') || lowerText.includes('help')) {
      return 'Size şu konularda yardımcı olabilirim:\n• Not oluşturma\n• Görev yönetimi\n• Takvim planlama\n• Workflow oluşturma';
    }

    // Default responses
    const defaultResponses = [
      'Anlıyorum. Bu konuda size nasıl yardımcı olabilirim?',
      'İlginç bir soru! Biraz daha detay verebilir misiniz?',
      'Elbette! Bu konuda daha fazla bilgiye ihtiyacım var.',
      'Anladım. Size en iyi şekilde yardımcı olmaya çalışacağım.',
      'Harika! Hemen üzerinde çalışıyorum.',
    ];

    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    const response = defaultResponses[randomIndex];
    return response ?? 'Anladım. Size nasıl yardımcı olabilirim?';
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending', // Start with sending
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();

    // Exit onboarding mode after first message
    if (isFirstTime) {
      setIsFirstTime(false);
    }

    // Simulate message sending progression
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: 'sent' as const } : msg))
      );
    }, 300);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: 'delivered' as const } : msg))
      );
    }, 600);

    // Mock AI response after 1.5 seconds
    setTimeout(() => {
      // Mark as read when AI responds
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: 'read' as const } : msg))
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);

    // TODO: Send to backend API
    console.log('Message sent:', userMessage.text);
  }, [getMockAIResponse, inputText, isFirstTime]);

  const handleVoiceRecord = useCallback(() => {
    // TODO: Implement voice-to-text in Epic 4
    // Will use expo-speech-recognition or web Speech API
    console.log('Voice recording started - Will convert to text (Epic 4)');

    // Mock: Simulate voice-to-text
    setTimeout(() => {
      setInputText('Bu bir ses mesajından dönüştürülmüş metindir');
    }, 1000);
  }, []);

  const handlePromptClick = useCallback((prompt: SuggestionPrompt) => {
    // Auto-send the prompt
    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt.title,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Exit onboarding mode after first prompt click
    if (isFirstTime) {
      setIsFirstTime(false);
    }

    // Mock AI response after 1.5 seconds
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);

    console.log('Prompt clicked:', prompt.title);
  }, [getMockAIResponse, isFirstTime]);

  const handleQuickAction = useCallback((action: string) => {
    console.log('Quick action:', action);
    setShowQuickActions(false);

    if (action === 'new-chat') {
      // New chat: Clear messages but keep regular prompts
      setMessages([]);
      setIsFirstTime(false);
    } else if (action === 'clear-all') {
      // Full reset: Clear everything and show onboarding
      setMessages([]);
      setIsFirstTime(true);
    } else {
      // TODO: Navigate to add task/event/note screen
    }
  }, []);

  const renderWidget = useCallback(() => {
    // Placeholder widgets - will be implemented later
    return (
      <Card
        padding="$4"
        backgroundColor="$gray2"
        borderWidth={1}
        borderColor="$gray5"
        borderRadius="$6"
      >
        <YStack alignItems="center" justifyContent="center" height="100%">
          <Text color="$gray11" fontSize="$3" textAlign="center">
            {selectedTab === 'notes' && '📝 Recent Notes (Coming soon)'}
            {selectedTab === 'tasks' && '✅ Today\'s Tasks (Coming soon)'}
            {selectedTab === 'calendar' && '📅 Mini Calendar (Coming soon)'}
            {selectedTab === 'flows' && '🔄 Active Flows (Coming soon)'}
          </Text>
        </YStack>
      </Card>
    );
  }, [selectedTab]);

  const renderSuggestionPrompts = useCallback(() => {
    const prompts = isFirstTime ? ONBOARDING_PROMPTS : REGULAR_PROMPTS;

    return (
      <YStack gap="$3" padding="$4">
        {prompts.map((prompt) => (
          <Card
            key={prompt.id}
            padding="$4"
            backgroundColor="$gray2"
            borderWidth={1}
            borderColor="$gray5"
            borderRadius="$6"
            pressStyle={{ scale: 0.96, backgroundColor: '$gray3' }}
            animation="bouncy"
            onPress={() => handlePromptClick(prompt)}
          >
            <XStack gap="$3" alignItems="center">
              <Text fontSize="$7">{prompt.icon}</Text>
              <YStack flex={1} gap="$1">
                <Text fontWeight="600" fontSize="$4" color="$color">
                  {prompt.title}
                </Text>
                <Text color="$gray11" fontSize="$3">
                  {prompt.description}
                </Text>
              </YStack>
            </XStack>
          </Card>
        ))}
      </YStack>
    );
  }, [isFirstTime, handlePromptClick]);

  const renderChatMessages = useCallback(() => {
    return (
      <YStack padding="$4" gap="$2">
        {messages.map((message, index) => (
          <ChatBubble
            key={message.id}
            message={message}
            animationDelay={index * 30}
          />
        ))}
      </YStack>
    );
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={0}
    >
      <YStack flex={1} backgroundColor="$background">
        {/* Slidable Tabs - FIXED */}
        <YStack borderBottomWidth={1} borderColor="$gray5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack paddingHorizontal="$3" paddingVertical="$2" gap="$2">
              {TABS.map((tab) => {
                const isSelected = selectedTab === tab.key;
                const Icon = tab.icon;

                return (
                  <Button
                    key={tab.key}
                    size="$3"
                    backgroundColor={isSelected ? '$blue9' : '$gray3'}
                    color={isSelected ? 'white' : '$gray11'}
                    borderWidth={0}
                    borderRadius="$10"
                    pressStyle={{ scale: 0.94, backgroundColor: isSelected ? '$blue10' : '$gray4' }}
                    animation="bouncy"
                    onPress={() => setSelectedTab(tab.key)}
                    icon={<Icon size={16} color={isSelected ? 'white' : undefined} />}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </XStack>
          </ScrollView>
        </YStack>

        {/* Widget Area - FIXED (1/5 screen, yapışık) */}
        <YStack height={widgetHeight} padding="$2">
          {renderWidget()}
        </YStack>

        {/* Chat Area - SCROLLABLE */}
        <ScrollView
          ref={scrollViewRef}
          flex={1}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          <YStack flex={1}>
            {messages.length === 0 ? renderSuggestionPrompts() : renderChatMessages()}
          </YStack>
        </ScrollView>

        {/* Input Bar - WhatsApp Style (Smooth) */}
        <YStack
          padding="$3"
          paddingBottom="$4"
          borderTopWidth={1}
          borderColor="$gray5"
          backgroundColor="$background"
        >
          <XStack gap="$3" alignItems="center">
            {/* + Button (Quick Actions) - Instant Feedback */}
            <Button
              size="$4"
              circular
              icon={Plus}
              backgroundColor="$gray3"
              borderWidth={0}
              pressStyle={{ scale: 0.92, backgroundColor: '$gray4' }}
              animation="bouncy"
              onPress={() => setShowQuickActions(!showQuickActions)}
            />

            {/* Text Input - Rounded WhatsApp Style */}
            <Input
              flex={1}
              placeholder="Mesaj yazın..."
              placeholderTextColor="$gray10"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              backgroundColor="$gray2"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$10"
              paddingHorizontal="$4"
              paddingVertical="$3"
              fontSize="$4"
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

          {/* Quick Actions Menu - Instant Appearance */}
          {showQuickActions && (
            <Card
              marginTop="$3"
              padding="$3"
              bordered
              borderRadius="$6"
            >

                <YStack gap="$2">
                  <Button
                    size="$3"
                    justifyContent="flex-start"
                    icon={CheckSquare}
                    backgroundColor="$gray2"
                    borderWidth={0}
                    pressStyle={{ scale: 0.96, backgroundColor: '$gray3' }}
                    animation="bouncy"
                    onPress={() => handleQuickAction('add-task')}
                  >
                    Task Ekle
                  </Button>
                  <Button
                    size="$3"
                    justifyContent="flex-start"
                    icon={Calendar}
                    backgroundColor="$gray2"
                    borderWidth={0}
                    pressStyle={{ scale: 0.96, backgroundColor: '$gray3' }}
                    animation="bouncy"
                    onPress={() => handleQuickAction('add-event')}
                  >
                    Etkinlik Ekle
                  </Button>
                  <Button
                    size="$3"
                    justifyContent="flex-start"
                    icon={FileText}
                    backgroundColor="$gray2"
                    borderWidth={0}
                    pressStyle={{ scale: 0.96, backgroundColor: '$gray3' }}
                    animation="bouncy"
                    onPress={() => handleQuickAction('add-note')}
                  >
                    Not Ekle
                  </Button>
                  <Button
                    size="$3"
                    justifyContent="flex-start"
                    icon={Workflow}
                    backgroundColor="$gray2"
                    borderWidth={0}
                    pressStyle={{ scale: 0.96, backgroundColor: '$gray3' }}
                    animation="bouncy"
                    onPress={() => handleQuickAction('start-flow')}
                  >
                    Flow Başlat
                  </Button>

                  <YStack height={1} backgroundColor="$gray5" marginVertical="$2" />

                  {/* Demo Actions */}
                  <Button
                    size="$3"
                    justifyContent="flex-start"
                    backgroundColor="$blue3"
                    borderWidth={0}
                    pressStyle={{ scale: 0.96, backgroundColor: '$blue4' }}
                    animation="bouncy"
                    onPress={() => handleQuickAction('new-chat')}
                  >
                    🆕 Yeni Chat
                  </Button>
                  <Button
                    size="$3"
                    justifyContent="flex-start"
                    backgroundColor="$red3"
                    borderWidth={0}
                    pressStyle={{ scale: 0.96, backgroundColor: '$red4' }}
                    animation="bouncy"
                    onPress={() => handleQuickAction('clear-all')}
                  >
                    🗑️ Tümünü Temizle
                  </Button>
                </YStack>
              </Card>
            )}
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
