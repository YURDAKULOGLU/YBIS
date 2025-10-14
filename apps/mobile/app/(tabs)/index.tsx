import { useState, useRef, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  Button,
  Input,
  ScrollView,
} from 'tamagui';
import { Keyboard, Dimensions, KeyboardAvoidingView, ScrollView as RNScrollView } from 'react-native';
import { Plus, Send, Calendar, CheckSquare, FileText, Workflow } from '@tamagui/lucide-icons';

/**
 * Main Screen - New Design
 *
 * Features:
 * - Slidable tabs (Notes, Tasks, Calendar, Flows)
 * - Widget area (1/4 screen, shows mini summary)
 * - Chat area (suggestion prompts when empty, messages when active)
 * - Input bar with + button for quick actions
 * - Keyboard-aware: widget area shrinks when keyboard opens
 */

type TabType = 'notes' | 'tasks' | 'calendar' | 'flows';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface SuggestionPrompt {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Mock data - will be replaced with real data
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

export default function MainScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); // Demo: first time onboarding
  const [showQuickActions, setShowQuickActions] = useState(false);

  const scrollViewRef = useRef<RNScrollView>(null);

  const screenHeight = Dimensions.get('window').height;
  const widgetHeight = screenHeight * 0.2; // 1/5 of screen

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const tabs: { key: TabType; label: string; icon: typeof Calendar }[] = [
    { key: 'notes', label: 'Notes', icon: FileText },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare },
    { key: 'calendar', label: 'Calendar', icon: Calendar },
    { key: 'flows', label: 'Flows', icon: Workflow },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();

    // Exit onboarding mode after first message
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

    // TODO: Send to backend API
    console.log('Message sent:', userMessage.text);
  };

  const getMockAIResponse = (userText: string): string => {
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
  };

  const handlePromptClick = (prompt: SuggestionPrompt) => {
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
  };

  const handleQuickAction = (action: string) => {
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
  };

  const renderWidget = () => {
    // Placeholder widgets - will be implemented later
    return (
      <Card padding="$4" bordered backgroundColor="$gray2">
        <YStack alignItems="center" justifyContent="center" height="100%">
          <Text color="$gray11" fontSize="$3">
            {selectedTab === 'notes' && '📝 Recent Notes (Coming soon)'}
            {selectedTab === 'tasks' && '✅ Today\'s Tasks (Coming soon)'}
            {selectedTab === 'calendar' && '📅 Mini Calendar (Coming soon)'}
            {selectedTab === 'flows' && '🔄 Active Flows (Coming soon)'}
          </Text>
        </YStack>
      </Card>
    );
  };

  const renderSuggestionPrompts = () => {
    const prompts = isFirstTime ? ONBOARDING_PROMPTS : REGULAR_PROMPTS;

    return (
      <YStack gap="$2" padding="$4">
        {prompts.map((prompt) => (
          <Card
            key={prompt.id}
            padding="$3"
            bordered
            pressStyle={{ scale: 0.97 }}
            onPress={() => handlePromptClick(prompt)}
          >
            <XStack gap="$2" alignItems="center">
              <Text fontSize="$6">{prompt.icon}</Text>
              <YStack flex={1} gap="$1">
                <Text fontWeight="500" fontSize="$3">
                  {prompt.title}
                </Text>
                <Text color="$gray11" fontSize="$2">
                  {prompt.description}
                </Text>
              </YStack>
            </XStack>
          </Card>
        ))}
      </YStack>
    );
  };

  const renderChatMessages = () => {
    return (
      <YStack padding="$4" gap="$3">
        {messages.map((message) => (
          <XStack
            key={message.id}
            justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
          >
            <Card
              maxWidth="80%"
              padding="$4"
              backgroundColor={message.sender === 'user' ? '$blue4' : '$gray3'}
            >
              <Text
                color={message.sender === 'user' ? '$blue12' : '$color'}
                fontSize="$4"
                lineHeight="$5"
              >
                {message.text}
              </Text>
              <Text
                color={message.sender === 'user' ? '$blue11' : '$gray11'}
                fontSize="$2"
                marginTop="$2"
              >
                {message.timestamp}
              </Text>
            </Card>
          </XStack>
        ))}
      </YStack>
    );
  };

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
              {tabs.map((tab) => {
                const isSelected = selectedTab === tab.key;
                const Icon = tab.icon;

                return (
                  <Button
                    key={tab.key}
                    size="$3"
                    theme={isSelected ? 'blue' : undefined}
                    backgroundColor={isSelected ? '$blue4' : '$gray2'}
                    borderColor={isSelected ? '$blue8' : '$gray5'}
                    pressStyle={{ scale: 0.95 }}
                    onPress={() => setSelectedTab(tab.key)}
                    icon={<Icon size={16} />}
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

        {/* Input Bar - FIXED */}
        <YStack
          padding="$3"
          borderTopWidth={1}
          borderColor="$gray5"
          backgroundColor="$background"
        >
          <XStack gap="$2" alignItems="center">
            {/* + Button (Quick Actions) */}
            <Button
              size="$4"
              circular
              icon={Plus}
              theme="gray"
              onPress={() => setShowQuickActions(!showQuickActions)}
            />

            {/* Text Input */}
            <Input
              flex={1}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
            />

            {/* Send Button */}
            <Button
              size="$4"
              circular
              icon={Send}
              theme="blue"
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            />
          </XStack>

          {/* Quick Actions Menu */}
          {showQuickActions && (
            <Card marginTop="$2" padding="$3" bordered>
              <YStack gap="$2">
                <Button
                  size="$3"
                  justifyContent="flex-start"
                  icon={CheckSquare}
                  onPress={() => handleQuickAction('add-task')}
                >
                  Task Ekle
                </Button>
                <Button
                  size="$3"
                  justifyContent="flex-start"
                  icon={Calendar}
                  onPress={() => handleQuickAction('add-event')}
                >
                  Etkinlik Ekle
                </Button>
                <Button
                  size="$3"
                  justifyContent="flex-start"
                  icon={FileText}
                  onPress={() => handleQuickAction('add-note')}
                >
                  Not Ekle
                </Button>
                <Button
                  size="$3"
                  justifyContent="flex-start"
                  icon={Workflow}
                  onPress={() => handleQuickAction('start-flow')}
                >
                  Flow Başlat
                </Button>

                <YStack height={1} backgroundColor="$gray5" marginVertical="$2" />

                {/* Demo Actions */}
                <Button
                  size="$3"
                  justifyContent="flex-start"
                  theme="blue"
                  onPress={() => handleQuickAction('new-chat')}
                >
                  🆕 Yeni Chat
                </Button>
                <Button
                  size="$3"
                  justifyContent="flex-start"
                  theme="red"
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
