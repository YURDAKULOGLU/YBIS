import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  Button,
  Input,
  ScrollView,
} from 'tamagui';
import type { ScrollView as RNScrollView} from 'react-native';
import { Keyboard, useWindowDimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Send, Calendar, CheckSquare, FileText, Workflow, Mic } from '@tamagui/lucide-icons';
import { ChatBubble, type Message } from '@ybis/chat';

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

// Mock data - will be replaced with real data (static, outside component)
const ONBOARDING_PROMPTS: SuggestionPrompt[] = [
  {
    id: '1',
    icon: '👋',
    title: 'Başlayalım!',
    description: 'YBIS\'e hoş geldiniz. Nasıl yardımcı olabilirim?',
  },
  {
    id: '2',
    icon: '🚀',
    title: 'Demo Modu',
    description: 'Tüm özellikleri test edin',
  },
  {
    id: '3',
    icon: '💬',
    title: 'Chat Başlat',
    description: 'AI asistanı ile konuşun',
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
  {
    id: '4',
    icon: '🔄',
    title: 'Workflow oluştur',
    description: 'Otomatik iş akışı kurun',
  },
  {
    id: '5',
    icon: '📊',
    title: 'Rapor oluştur',
    description: 'Veri analizi yapın',
  },
  {
    id: '6',
    icon: '🎯',
    title: 'Hedef belirle',
    description: 'Yeni hedefler ekleyin',
  },
];

// Static tabs configuration (outside component to prevent re-creation)
const TABS: { key: TabType; label: string; icon: typeof Calendar }[] = [
  { key: 'notes', label: 'Notes', icon: FileText },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'flows', label: 'Flows', icon: Workflow },
];

export default function MainScreen(): React.ReactElement {
  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); // Demo: first time onboarding
  const [showQuickActions, setShowQuickActions] = useState(false);

  const scrollViewRef = useRef<RNScrollView>(null);
  
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
      return 'Merhaba! YBIS Demo Modu\'na hoş geldiniz! 🚀\n\nSize şu konularda yardımcı olabilirim:\n• 📝 Not oluşturma\n• ✅ Görev yönetimi\n• 📅 Takvim planlama\n• 🔄 Workflow oluşturma\n\nNe yapmak istersiniz?';
    }
    
    // Demo mode responses
    if (lowerText.includes('demo') || lowerText.includes('test')) {
      return 'Demo Modu aktif! 🎯\n\nŞu özellikleri test edebilirsiniz:\n• Chat interface (şu an kullandığınız)\n• Tab navigation (Notes, Tasks, Calendar, Flows)\n• Widget area (üstteki mini özet)\n• Quick actions (+ butonu)\n\nHangi özelliği denemek istersiniz?';
    }

    // Feature-specific responses
    if (lowerText.includes('not') || lowerText.includes('yaz') || lowerText.includes('note')) {
      return `📝 Not Oluşturma\n\nDemo modunda not oluşturma özelliği simüle ediliyor:\n\n✅ Not başlığı: "${userText}"\n✅ İçerik: Demo içerik\n✅ Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\nGerçek uygulamada bu not veritabanına kaydedilecek.`;
    }
    
    if (lowerText.includes('görev') || lowerText.includes('task') || lowerText.includes('todo')) {
      return `✅ Görev Yönetimi\n\nDemo modunda görev oluşturma:\n\n📋 Görev: "${userText}"\n⏰ Tarih: ${new Date().toLocaleDateString('tr-TR')}\n🎯 Öncelik: Orta\n📊 Durum: Beklemede\n\nGörev başarıyla oluşturuldu! (Demo)`;
    }
    
    if (lowerText.includes('takvim') || lowerText.includes('calendar') || lowerText.includes('etkinlik')) {
      return `📅 Takvim Yönetimi\n\nDemo modunda etkinlik oluşturma:\n\n📅 Etkinlik: "${userText}"\n🕐 Saat: ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}\n📆 Tarih: ${new Date().toLocaleDateString('tr-TR')}\n📍 Konum: Demo Konum\n\nEtkinlik takvime eklendi! (Demo)`;
    }
    
    if (lowerText.includes('workflow') || lowerText.includes('akış') || lowerText.includes('flow')) {
      return `🔄 Workflow Oluşturma\n\nDemo modunda workflow:\n\n🔧 Workflow: "${userText}"\n⚡ Tetikleyici: Manuel\n🎯 Hedef: Otomatik işlem\n📊 Durum: Aktif\n\nWorkflow başarıyla oluşturuldu! (Demo)`;
    }

    // Help responses
    if (lowerText.includes('yardım') || lowerText.includes('help') || lowerText.includes('nasıl')) {
      return '🆘 YBIS Demo Yardım\n\n📱 **Ana Özellikler:**\n• Tab navigation (Notes, Tasks, Calendar, Flows)\n• Widget area (üstteki özet)\n• Chat interface (şu an kullandığınız)\n• Quick actions (+ butonu)\n\n🎯 **Demo Komutları:**\n• "not oluştur" - Not simülasyonu\n• "görev ekle" - Task simülasyonu\n• "etkinlik planla" - Calendar simülasyonu\n• "workflow başlat" - Flow simülasyonu\n\n💡 **İpucu:** Tab\'ları değiştirerek farklı widget\'ları görebilirsiniz!';
    }

    // Status responses
    if (lowerText.includes('nasılsın') || lowerText.includes('durum')) {
      return '🤖 AI Asistan Durumu\n\n✅ **Sistem:** Çevrimiçi\n✅ **Demo Modu:** Aktif\n✅ **Özellikler:** Tümü simüle ediliyor\n✅ **Performans:** Optimal\n\nSize nasıl yardımcı olabilirim?';
    }

    // Thank you responses
    if (lowerText.includes('teşekkür') || lowerText.includes('sağol') || lowerText.includes('thanks')) {
      return 'Rica ederim! 😊\n\nYBIS Demo Modu\'nda daha fazla özellik keşfetmek ister misiniz?\n\n💡 **Öneriler:**\n• Tab\'ları değiştirin\n• + butonuna basın\n• Farklı komutlar deneyin\n\nBaşka nasıl yardımcı olabilirim?';
    }

    // Goodbye responses
    if (lowerText.includes('görüşürüz') || lowerText.includes('hoşçakal') || lowerText.includes('bye')) {
      return 'Görüşürüz! 👋\n\nYBIS Demo Modu\'nu beğendiyseniz, gerçek uygulamayı da deneyebilirsiniz!\n\n🚀 **Sonraki Adımlar:**\n• Gerçek veri bağlantısı\n• Gelişmiş AI özellikleri\n• Mobil optimizasyon\n\nİyi günler!';
    }

    // Context-aware responses based on selected tab
    const getContextualResponse = (): string => {
      switch (selectedTab) {
        case 'notes':
          return `📝 Not Modu\n\n"${userText}" konusunda bir not oluşturmak ister misiniz?\n\nDemo modunda bu not simüle edilecek ve gerçek uygulamada veritabanına kaydedilecek.`;
        case 'tasks':
          return `✅ Görev Modu\n\n"${userText}" için bir görev oluşturmak ister misiniz?\n\nDemo modunda bu görev simüle edilecek ve gerçek uygulamada task listesine eklenecek.`;
        case 'calendar':
          return `📅 Takvim Modu\n\n"${userText}" için bir etkinlik planlamak ister misiniz?\n\nDemo modunda bu etkinlik simüle edilecek ve gerçek uygulamada takvime eklenecek.`;
        case 'flows':
          return `🔄 Workflow Modu\n\n"${userText}" için bir workflow oluşturmak ister misiniz?\n\nDemo modunda bu workflow simüle edilecek ve gerçek uygulamada otomatik işlem olarak çalışacak.`;
        default:
          return `Anlıyorum. "${userText}" konusunda size nasıl yardımcı olabilirim?`;
      }
    };

    // Default contextual response
    return getContextualResponse();
  }, [selectedTab]);

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
        text: 'Yeni görev oluştur',
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
          text: getMockAIResponse('görev ekle'),
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
        text: 'Yeni etkinlik planla',
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
          text: getMockAIResponse('etkinlik planla'),
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
        text: 'Yeni not oluştur',
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
          text: getMockAIResponse('not oluştur'),
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
        text: 'Workflow başlat',
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
          text: getMockAIResponse('workflow başlat'),
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
            title: 'Son Notlar',
            count: 3,
            items: ['Proje toplantısı notları', 'Haftalık rapor', 'Fikirler listesi']
          };
        case 'tasks':
          return {
            icon: '✅',
            title: 'Bugünkü Görevler',
            count: 5,
            items: ['E-posta kontrolü', 'Rapor hazırlama', 'Toplantı hazırlığı', 'Kod review', 'Test yazma']
          };
        case 'calendar':
          return {
            icon: '📅',
            title: 'Bugünün Etkinlikleri',
            count: 2,
            items: ['09:00 - Proje toplantısı', '14:00 - Müşteri görüşmesi']
          };
        case 'flows':
          return {
            icon: '🔄',
            title: 'Aktif Workflow\'lar',
            count: 1,
            items: ['Otomatik rapor oluşturma', 'E-posta takibi', 'Görev hatırlatıcıları']
          };
        default:
          return {
            icon: '📊',
            title: 'Dashboard',
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
                {widgetData.count} öğe
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
                +{widgetData.items.length - 2} daha...
              </Text>
            )}
          </YStack>
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
        </Animated.View>
    </YStack>
  );
}
