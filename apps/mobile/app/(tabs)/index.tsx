import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  Button,
  Input,
  ScrollView,
} from '@ybis/ui';
import type { ScrollView as RNScrollView} from 'react-native';
import { Keyboard, useWindowDimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Plus, Send, Calendar, CheckSquare, FileText, Workflow, Mic } from '@ybis/ui';
import { ChatBubble, type Message } from '@ybis/chat';
import Logger from '@ybis/logging';

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
// Message type is already imported from @ybis/chat

interface SuggestionPrompt {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');

  const ONBOARDING_PROMPTS = useMemo(() => [
    { id: '1', icon: '👋', title: t('onboarding.prompt1_title'), description: t('onboarding.prompt1_desc') },
    { id: '2', icon: '🚀', title: t('onboarding.prompt2_title'), description: t('onboarding.prompt2_desc') },
    { id: '3', icon: '💬', title: t('onboarding.prompt3_title'), description: t('onboarding.prompt3_desc') },
  ], [t]);

  const REGULAR_PROMPTS = useMemo(() => [
    { id: '1', icon: '📝', title: t('prompts.newNote_title'), description: t('prompts.newNote_desc') },
    { id: '2', icon: '✅', title: t('prompts.todayTasks_title'), description: t('prompts.todayTasks_desc') },
    { id: '3', icon: '📅', title: t('prompts.checkCalendar_title'), description: t('prompts.checkCalendar_desc') },
    { id: '4', icon: '🔄', title: t('prompts.createWorkflow_title'), description: t('prompts.createWorkflow_desc') },
    { id: '5', icon: '📊', title: t('prompts.createReport_title'), description: t('prompts.createReport_desc') },
    { id: '6', icon: '🎯', title: t('prompts.setGoal_title'), description: t('prompts.setGoal_desc') },
  ], [t]);

  const TABS = useMemo(() => [
    { key: 'notes', label: t('tabs.notes'), icon: FileText },
    { key: 'tasks', label: t('tabs.tasks'), icon: CheckSquare },
    { key: 'calendar', label: t('tabs.calendar'), icon: Calendar },
    { key: 'flows', label: t('tabs.flows'), icon: Workflow },
  ], [t]);
  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); // Demo: first time onboarding
  const [showQuickActions, setShowQuickActions] = useState(false);

  const scrollViewRef = useRef<RNScrollView>(null);

  // Log screen mount
  useEffect(() => {
    Logger.info('MainScreen mounted', { type: 'LIFECYCLE' });
  }, []);
  
  // Safe area insets for edge-to-edge support
  const insets = useSafeAreaInsets();

  // Reactive window dimensions (handles orientation changes)
  const { height: screenHeight } = useWindowDimensions();
  const widgetHeight = useMemo(() => screenHeight * 0.2, [screenHeight]); // 1/5 of screen
  
  // Animated values for smooth transitions
  const widgetAnimatedHeight = useRef(new Animated.Value(widgetHeight)).current;
  const inputBarAnimatedBottom = useRef(new Animated.Value(0)).current;

  // Keyboard visibility listener with synced animations
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      const keyboardHeight = e.endCoordinates.height;
      const keyboardDuration = e.duration || 250; // Klavyenin kendi süresini kullan
      
      // Parallel animations synced with keyboard speed
      Animated.parallel([
        // Widget collapses completely (0 height)
        Animated.timing(widgetAnimatedHeight, {
          toValue: 0,
          duration: keyboardDuration, // ✅ Klavye ile senkronize
          useNativeDriver: false,
        }),
        // Input bar sticks to keyboard top (full keyboard height)
        Animated.timing(inputBarAnimatedBottom, {
          toValue: keyboardHeight, // Klavyenin tam üstüne yapış
          duration: keyboardDuration, // ✅ Klavye ile senkronize
          useNativeDriver: false,
        }),
      ]).start();
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      const keyboardDuration = e.duration || 250; // Klavyenin kendi süresini kullan
      
      // Parallel animations synced with keyboard speed
      Animated.parallel([
        // Widget expands back to original height
        Animated.timing(widgetAnimatedHeight, {
          toValue: widgetHeight,
          duration: keyboardDuration, // ✅ Klavye ile senkronize
          useNativeDriver: false,
        }),
        // Input bar returns to bottom (original position)
        Animated.timing(inputBarAnimatedBottom, {
          toValue: 0, // En alta dön
          duration: keyboardDuration, // ✅ Klavye ile senkronize
          useNativeDriver: false,
        }),
      ]).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [widgetAnimatedHeight, inputBarAnimatedBottom, widgetHeight]);

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

    // Greeting responses
    if (lowerText.includes('merhaba') || lowerText.includes('selam') || lowerText.includes('hello')) {
      return t('mockResponses.greeting');
    }
    
    // Demo mode responses
    if (lowerText.includes('demo') || lowerText.includes('test')) {
      return t('mockResponses.demoInfo');
    }

    // Feature-specific responses
    if (lowerText.includes('not') || lowerText.includes('yaz') || lowerText.includes('note')) {
      return t('mockResponses.createNote', { userText, date: new Date().toLocaleDateString('tr-TR') });
    }
    
    if (lowerText.includes('görev') || lowerText.includes('task') || lowerText.includes('todo')) {
      return t('mockResponses.createTask', { userText, date: new Date().toLocaleDateString('tr-TR') });
    }
    
    if (lowerText.includes('takvim') || lowerText.includes('calendar') || lowerText.includes('etkinlik')) {
      return t('mockResponses.createEvent', { 
        userText, 
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('tr-TR') 
      });
    }
    
    if (lowerText.includes('workflow') || lowerText.includes('akış') || lowerText.includes('flow')) {
      return t('mockResponses.createWorkflow', { userText });
    }

    // Help responses
    if (lowerText.includes('yardım') || lowerText.includes('help') || lowerText.includes('nasıl')) {
      return t('mockResponses.help');
    }

    // Status responses
    if (lowerText.includes('nasılsın') || lowerText.includes('durum')) {
      return t('mockResponses.status');
    }

    // Thank you responses
    if (lowerText.includes('teşekkür') || lowerText.includes('sağol') || lowerText.includes('thanks')) {
      return t('mockResponses.thanks');
    }

    // Goodbye responses
    if (lowerText.includes('görüşürüz') || lowerText.includes('hoşçakal') || lowerText.includes('bye')) {
      return t('mockResponses.goodbye');
    }

    // Context-aware responses based on selected tab
    const getContextualResponse = (): string => {
      switch (selectedTab) {
        case 'notes':
          return t('mockResponses.context_note', { userText });
        case 'tasks':
          return t('mockResponses.context_task', { userText });
        case 'calendar':
          return t('mockResponses.context_calendar', { userText });
        case 'flows':
          return t('mockResponses.context_workflow', { userText });
        default:
          return t('mockResponses.context_default', { userText });
      }
    };

    // Default contextual response
    return getContextualResponse();
  }, [selectedTab, t]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    Logger.info('Send Message button clicked', {
      type: 'USER_ACTION',
      component: 'MessageInput',
      textLength: inputText.length,
    });

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
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: 'sent' as const } : msg))
      );
    }, 600);

    // Mock AI response after 1.5 seconds
    setTimeout(() => {
      // Mark as sent when AI responds
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: 'sent' as const } : msg))
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
  }, [getMockAIResponse, inputText, isFirstTime]);

  const handleVoiceRecord = useCallback(() => {
    // TODO: Implement voice-to-text in Epic 4
    // Will use expo-speech-recognition or web Speech API

    // Mock: Simulate voice-to-text
    setTimeout(() => {
      setInputText('Bu bir ses mesajından dönüştürülmüş metindir');
    }, 1000);
  }, []);

  const handlePromptClick = useCallback((prompt: SuggestionPrompt) => {
    Logger.info('Suggestion prompt clicked', {
      type: 'USER_ACTION',
      component: 'SuggestionPrompts',
      promptTitle: prompt.title,
      promptId: prompt.id,
    });

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

  }, [getMockAIResponse, isFirstTime]);

  const handleQuickAction = useCallback((action: string) => {
    Logger.info('Quick action selected', {
      type: 'USER_ACTION',
      component: 'QuickActionsMenu',
      action,
    });
    setShowQuickActions(false);

    if (action === 'new-chat') {
      // New chat: Clear messages but keep regular prompts
      setMessages([]);
      setIsFirstTime(false);
    } else if (action === 'clear-all') {
      // Full reset: Clear everything and show onboarding
      setMessages([]);
      setIsFirstTime(true);
    } else if (action === 'add-task') {
      // Simulate task creation
      const taskMessage: Message = {
        id: Date.now().toString(),
        text: t('prompts.todayTasks_title'),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, taskMessage]);
      
      // AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getMockAIResponse(t('prompts.todayTasks_title')),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    } else if (action === 'add-event') {
      // Simulate event creation
      const eventMessage: Message = {
        id: Date.now().toString(),
        text: t('prompts.checkCalendar_title'),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, eventMessage]);
      
      // AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getMockAIResponse(t('prompts.checkCalendar_title')),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    } else if (action === 'add-note') {
      // Simulate note creation
      const noteMessage: Message = {
        id: Date.now().toString(),
        text: t('prompts.newNote_title'),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, noteMessage]);
      
      // AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getMockAIResponse(t('prompts.newNote_title')),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    } else if (action === 'start-flow') {
      // Simulate workflow creation
      const flowMessage: Message = {
        id: Date.now().toString(),
        text: t('prompts.createWorkflow_title'),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, flowMessage]);
      
      // AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getMockAIResponse(t('prompts.createWorkflow_title')),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
  }, [getMockAIResponse]);

  const renderWidget = useCallback(() => {
    // Mock widget data based on selected tab
    const getWidgetData = (): { icon: string; title: string; count: number; items: string[] } => {
      switch (selectedTab) {
        case 'notes':
          return {
            icon: '📝',
            title: t('widget.notes_title'),
            count: 3,
            items: ['Proje toplantısı notları', 'Haftalık rapor', 'Fikirler listesi']
          };
        case 'tasks':
          return {
            icon: '✅',
            title: t('widget.tasks_title'),
            count: 5,
            items: ['E-posta kontrolü', 'Rapor hazırlama', 'Toplantı hazırlığı', 'Kod review', 'Test yazma']
          };
        case 'calendar':
          return {
            icon: '📅',
            title: t('widget.calendar_title'),
            count: 2,
            items: ['09:00 - Proje toplantısı', '14:00 - Müşteri görüşmesi']
          };
        case 'flows':
          return {
            icon: '🔄',
            title: t('widget.flows_title'),
            count: 1,
            items: ['Otomatik rapor oluşturma', 'E-posta takibi', 'Görev hatırlatıcıları']
          };
        default:
          return {
            icon: '📊',
            title: t('widget.dashboard_title'),
            count: 0,
            items: []
          };
      }
    };

    const widgetData = getWidgetData();

    return (
      <Card
        padding="$3"
        backgroundColor="$gray2"
        borderWidth={1}
        borderColor="$gray5"
        borderRadius="$6"
        pressStyle={{ scale: 0.98, backgroundColor: '$gray3' }}
        animation="bouncy"
      >
        <YStack height="100%" justifyContent="space-between">
          {/* Header */}
          <XStack alignItems="center" gap="$2">
            <Text fontSize="$5">{widgetData.icon}</Text>
            <YStack flex={1}>
              <Text fontWeight="600" fontSize="$3" color="$color">
                {widgetData.title}
              </Text>
              <Text color="$gray11" fontSize="$2">
                {t('widget.item_count', { count: widgetData.count })}
              </Text>
            </YStack>
          </XStack>

          {/* Content */}
          <YStack gap="$1">
            {widgetData.items.slice(0, 2).map((item) => (
              <Text
                key={item}
                color="$gray11"
                fontSize="$2"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                • {item}
              </Text>
            ))}
            {widgetData.items.length > 2 && (
              <Text color="$blue9" fontSize="$2">
                {t('widget.more_items', { count: widgetData.items.length - 2 })}
              </Text>
            )}
          </YStack>
        </YStack>
      </Card>
    );
  }, [selectedTab, t]);

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
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
          />
        ))}
      </YStack>
    );
  }, [messages]);

  return (
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
                    onPress={() => {
                      Logger.info('Content tab selected', {
                        type: 'USER_ACTION',
                        component: 'SlidableTabs',
                        selectedTab: tab.key,
                      });
                      setSelectedTab(tab.key);
                    }}
                    icon={<Icon size={16} color={isSelected ? 'white' : undefined} />}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </XStack>
          </ScrollView>
        </YStack>

        {/* Widget Area - Smooth animated collapse/expand */}
        <Animated.View style={{ height: widgetAnimatedHeight, overflow: 'hidden' }}>
          <YStack height={widgetHeight} padding="$2">
            {renderWidget()}
          </YStack>
        </Animated.View>

        {/* Chat Area - SCROLLABLE */}
        <ScrollView
          ref={scrollViewRef}
          flex={1}
          contentContainerStyle={{ 
            flexGrow: 1, 
            // Padding for absolute positioned input bar (height ~70px + safe area)
            paddingBottom: 70 + (insets.bottom > 0 ? insets.bottom + 8 : 24)
          }}
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

        {/* Input Bar - WhatsApp Style with Smooth Animation */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: inputBarAnimatedBottom,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
          }}
        >
          <YStack
            padding="$3"
            paddingBottom={insets.bottom > 0 ? insets.bottom : '$4'}
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
              onPress={() => {
                Logger.info('Quick Actions menu toggled', {
                  type: 'USER_ACTION',
                  component: 'InputBar',
                  newState: !showQuickActions ? 'open' : 'closed',
                });
                setShowQuickActions(!showQuickActions);
              }}
            />

            {/* Text Input - Rounded WhatsApp Style */}
            <Input
              flex={1}
              placeholder={t('input.placeholder')}
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
                    {t('quickActions.addTask')}
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
                    {t('quickActions.addEvent')}
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
                    {t('quickActions.addNote')}
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
                    {t('quickActions.startFlow')}
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
                    {t('quickActions.newChat')}
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
                    {t('quickActions.clearAll')}
                  </Button>
                </YStack>
              </Card>
            )}
          </YStack>
        </Animated.View>
    </YStack>
  );
}
