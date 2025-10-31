import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';
import {
  FlatList,
  View,
  useWindowDimensions,
  Pressable,
  type ListRenderItemInfo,
  type LayoutChangeEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedKeyboard,
} from 'react-native-reanimated';
import {
  YStack,
  XStack,
  Text,
  useTheme,
  Calendar,
  CheckSquare,
  FileText,
  Workflow,
  ChevronDown,
  ChevronUp,
} from '@ybis/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChatBubble, type Message } from '@ybis/chat';
import Logger from '@ybis/logging';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import { Navbar } from '../../src/components/layout/Navbar';
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { InteractiveWidget } from '../../src/features/chat/components/InteractiveWidget';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';

const WIDGET_HEIGHT_PERCENTAGE = 0.3; // 30% of screen height
const WIDGET_COLLAPSED_HEIGHT = 48; // Just enough for the toggle bar

/**
 * Main Chat Screen - Stable Architecture
 * 
 * SINGLE KEYBOARD MECHANISM (Reanimated only):
 * - No KeyboardAvoidingView (causes double animation)
 * - Widget as absolute overlay (Portal-like)
 * - Input bar as absolute overlay
 * - FlatList padding = inputHeight + keyboardHeight + inset.bottom
 * - useAnimatedKeyboard() for smooth animations
 * - Zero wiggling, zero jumping
 */
export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const widgetExpandedHeight = screenHeight * WIDGET_HEIGHT_PERCENTAGE;

  const {
    messages,
    inputText,
    isFirstSession,
    setInputText,
    handleSendMessage,
    handlePromptClick,
  } = useChat();

  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(true);
  const [inputBarHeight, setInputBarHeight] = useState(60);
  const flatListRef = useRef<FlatList<Message>>(null);
  
  // SINGLE SOURCE OF TRUTH for keyboard
  const keyboard = useAnimatedKeyboard();
  
  // Widget animated height
  const widgetHeight = useSharedValue(widgetExpandedHeight);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [messages.length]);

  // Auto-collapse widget when keyboard opens
  // Note: useAnimatedKeyboard automatically updates keyboard.height.value
  // We watch for changes in a derived value
  useEffect(() => {
    // Simple approach: check keyboard height periodically
    const checkInterval = setInterval(() => {
      if (keyboard.height.value > 50 && isWidgetExpanded) {
        // Keyboard is open and widget is expanded - collapse it
        setIsWidgetExpanded(false);
        widgetHeight.value = withSpring(WIDGET_COLLAPSED_HEIGHT, {
          damping: 20,
          stiffness: 300,
        });
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [keyboard.height, isWidgetExpanded, widgetHeight]);

  // Toggle widget collapse/expand
  const toggleWidget = useCallback(() => {
    const newExpanded = !isWidgetExpanded;
    setIsWidgetExpanded(newExpanded);
    widgetHeight.value = withSpring(
      newExpanded ? widgetExpandedHeight : WIDGET_COLLAPSED_HEIGHT,
      {
        damping: 20,
        stiffness: 300,
      }
    );
  }, [isWidgetExpanded, widgetHeight, widgetExpandedHeight]);

  // Widget overlay animation
  const widgetAnimatedStyle = useAnimatedStyle(() => ({
    height: widgetHeight.value,
  }));

  // Input bar overlay animation (rises with keyboard)
  const inputBarAnimatedStyle = useAnimatedStyle(() => ({
    bottom: keyboard.height.value + insets.bottom,
  }));

  // Measure input bar height
  const handleInputBarLayout = useCallback((event: LayoutChangeEvent) => {
    setInputBarHeight(event.nativeEvent.layout.height);
  }, []);

  const onboardingPrompts = useMemo<SuggestionPrompt[]>(() => [
    {
      id: '1',
      icon: '👋',
      title: t('onboarding.prompt1_title'),
      description: t('onboarding.prompt1_desc'),
    },
  ], [t]);

  const regularPrompts = useMemo<SuggestionPrompt[]>(() => [
    { id: '1', icon: '🗒️', title: t('prompts.newNote_title'), description: t('prompts.newNote_desc') },
    { id: '2', icon: '✅', title: t('prompts.todayTasks_title'), description: t('prompts.todayTasks_desc') },
    { id: '3', icon: '🕒', title: t('prompts.checkCalendar_title'), description: t('prompts.checkCalendar_desc') },
    { id: '4', icon: '⚙️', title: t('prompts.createWorkflow_title'), description: t('prompts.createWorkflow_desc') },
    { id: '5', icon: '📊', title: t('prompts.createReport_title'), description: t('prompts.createReport_desc') },
    { id: '6', icon: '🏅', title: t('prompts.setGoal_title'), description: t('prompts.setGoal_desc') },
  ], [t]);

  const tabs: Tab[] = useMemo(() => [
    { key: 'notes', label: t('tabs.notes'), icon: FileText },
    { key: 'tasks', label: t('tabs.tasks'), icon: CheckSquare },
    { key: 'calendar', label: t('tabs.calendar'), icon: Calendar },
    { key: 'flows', label: t('tabs.flows'), icon: Workflow },
  ], [t]);

  const renderMessage = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => (
      <View style={{ marginBottom: 12 }}>
        <ChatBubble message={item} />
      </View>
    ),
    [],
  );

  const renderEmptyComponent = useCallback(() => (
    <SuggestionPrompts
      isFirstSession={isFirstSession}
      onboardingPrompts={onboardingPrompts}
      regularPrompts={regularPrompts}
      handlePromptClick={handlePromptClick}
    />
  ), [isFirstSession, onboardingPrompts, regularPrompts, handlePromptClick]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleSend = useCallback(() => {
    handleSendMessage();
  }, [handleSendMessage]);

  // Calculate FlatList bottom padding dynamically
  const listBottomPadding = useMemo(() => 
    inputBarHeight + insets.bottom + 16, // 16 = extra spacing
  [inputBarHeight, insets.bottom]);

  return (
    <UniversalLayout>
      <StatusBar style="auto" />
      
      {/* STABLE ARCHITECTURE - No KeyboardAvoidingView, single Reanimated mechanism */}
      <SafeAreaView edges={['top']} flex={1}>
        
        {/* 1. Header Section - Fixed */}
        <YStack backgroundColor={theme.background.val}>
          <Navbar title={t('tabs.chat')} />
          <WidgetTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </YStack>

        {/* 2. Widget Overlay - Absolute positioned, Portal-like */}
        <Animated.View 
          style={[
            {
              position: 'absolute',
              top: insets.top + 56 + 48, // statusBar + navbar + tabs
              left: 0,
              right: 0,
              zIndex: 100,
              backgroundColor: theme.background.val,
              borderBottomWidth: 1,
              borderBottomColor: theme.gray5.val,
              overflow: 'hidden',
            },
            widgetAnimatedStyle,
          ]}
        >
          {/* Toggle Bar */}
          <Pressable onPress={toggleWidget}>
            <XStack
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor={theme.gray2.val}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="$3" fontWeight="600" color="$color">
                {tabs.find(t => t.key === selectedTab)?.label ?? 'Widget'}
              </Text>
              <YStack>
                {isWidgetExpanded ? (
                  <ChevronUp size={20} color={theme.color.val} />
                ) : (
                  <ChevronDown size={20} color={theme.color.val} />
                )}
              </YStack>
            </XStack>
          </Pressable>
          
          {/* Widget Content */}
          {isWidgetExpanded && (
            <YStack flex={1}>
              <InteractiveWidget 
                selectedTab={selectedTab} 
                height={widgetExpandedHeight - WIDGET_COLLAPSED_HEIGHT} 
              />
            </YStack>
          )}
        </Animated.View>

        {/* 3. Chat Messages - Flex 1, NO KeyboardAvoidingView */}
        <YStack flex={1} backgroundColor="$background">
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: messages.length === 0 ? 'flex-start' : 'flex-end',
              paddingHorizontal: 16,
              paddingTop: insets.top + 56 + 48 + (isWidgetExpanded ? widgetExpandedHeight : WIDGET_COLLAPSED_HEIGHT) + 16,
              paddingBottom: listBottomPadding, // SINGLE PADDING: inputHeight + kbHeight + inset
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </YStack>

        {/* 4. Input Bar Overlay - Absolute positioned, rises with keyboard */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              backgroundColor: theme.background.val,
              borderTopWidth: 1,
              borderTopColor: theme.gray5.val,
            },
            inputBarAnimatedStyle,
          ]}
          onLayout={handleInputBarLayout}
        >
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSend}
            handleVoiceRecord={() => {
              Logger.info('Voice record triggered');
            }}
            handleQuickActionPress={() => {
              Logger.info('Quick actions placeholder triggered');
            }}
          />
        </Animated.View>
      </SafeAreaView>
    </UniversalLayout>
  );
}
