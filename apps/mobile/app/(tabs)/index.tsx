/**
 * Main Chat Screen - Refactored Architecture
 *
 * FLEX-BASED LAYOUT (No Absolute Positioning):
 * ┌─────────────────────────────────┐
 * │ SafeAreaView (flex: 1)          │
 * │ ┌─────────────────────────────┐ │
 * │ │ Navbar (fixed)              │ │
 * │ ├─────────────────────────────┤ │
 * │ │ WidgetTabs (fixed)          │ │
 * │ ├─────────────────────────────┤ │
 * │ │ Widget (animated height)    │ │ ← Expands/collapses with keyboard
 * │ ├─────────────────────────────┤ │
 * │ │ Chat Messages (flex: 1)     │ │ ← Takes remaining space
 * │ │ - Auto-scroll              │ │
 * │ │ - Keyboard-aware padding   │ │
 * │ ├─────────────────────────────┤ │
 * │ │ Input Bar (animated)        │ │ ← Rises with keyboard
 * │ └─────────────────────────────┘ │
 * └─────────────────────────────────┘
 *
 * KEY FEATURES:
 * - Zero absolute positioning
 * - Smooth keyboard animations (synced with native keyboard)
 * - Widget collapse/expand with keyboard
 * - No jumpiness, no wiggling
 * - Clean, maintainable architecture
 */

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
  Keyboard,
  type ListRenderItemInfo,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useAnimatedReaction,
  Easing,
  useSharedValue,
  useAnimatedKeyboard,
} from 'react-native-reanimated';
import {
  YStack,
  useTheme,
  Calendar,
  CheckSquare,
  FileText,
  Workflow,
} from '@ybis/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChatBubble, type Message } from '@ybis/chat';
import Logger from '@ybis/logging';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import { Navbar } from '../../src/components/layout/Navbar';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';
import { WidgetContainer } from '../../src/features/widgets';
import type { WidgetType } from '../../src/features/widgets';
import { LAYOUT, ANIMATION } from '../../src/constants/layout';
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';

/**
 * Main Chat Screen
 */
export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  // Widget expanded height (30% of screen)
  const widgetExpandedHeight = screenHeight * LAYOUT.WIDGET_HEIGHT_PERCENTAGE;

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
  const [isWidgetFocused, setIsWidgetFocused] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Reverse messages for inverted FlatList (newest at bottom = index 0 when inverted)
  const displayMessages = useMemo(
    () => (messages.length > 0 ? [...messages].reverse() : []),
    [messages]
  );

  // Keyboard handling
  const keyboard = useAnimatedKeyboard();
  const keyboardHeight = useSharedValue(0);

  // Sync keyboard height with shared value (no side effects here)
  useAnimatedReaction(
    () => keyboard.height.value,
    (currentHeight) => {
      keyboardHeight.value = currentHeight;
    },
    []
  );

  // Handle widget collapse/expand on keyboard changes
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (!isWidgetFocused) {
        setIsWidgetExpanded(false);
      }
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsWidgetExpanded(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [isWidgetFocused]);

  // Manual toggle handler
  const toggleWidget = useCallback(() => {
    setIsWidgetExpanded((prev) => !prev);
  }, []);

  // Auto-scroll on new messages (inverted list scrolls to index 0)
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [messages.length]);

  // Widget animated height (collapses to 0 when closed)
  const widgetAnimatedStyle = useAnimatedStyle(() => ({
    height: withTiming(
      isWidgetExpanded ? widgetExpandedHeight : 0,
      {
        duration: ANIMATION.WIDGET_DURATION,
        easing: Easing.bezier(...ANIMATION.SMOOTH_EASING),
      }
    ),
  }));

  // Input bar animated padding (rises with keyboard ONLY when NOT widget focused)
  // Using direct value (no withTiming) to sync perfectly with native keyboard
  // When keyboard closed: use TAB_BAR_HEIGHT, when open: use keyboard height
  const inputBarAnimatedStyle = useAnimatedStyle(() => {
    // Since tab bar is always visible (tabBarHideOnKeyboard: false),
    // subtract just tab bar height + insets
    const tabBarFullHeight = LAYOUT.TAB_BAR_HEIGHT + insets.bottom;
    const targetBottom = keyboardHeight.value > 0
      ? keyboardHeight.value - tabBarFullHeight
      : 0;

    return {
      paddingBottom: isWidgetFocused ? 0 : targetBottom,
    };
  }, [isWidgetFocused]);

  // Removed listContentPadding - using static padding in contentContainerStyle instead

  const onboardingPrompts = useMemo<SuggestionPrompt[]>(
    () => [
      {
        id: '1',
        icon: '👋',
        title: t('onboarding.prompt1_title'),
        description: t('onboarding.prompt1_desc'),
      },
    ],
    [t]
  );

  const regularPrompts = useMemo<SuggestionPrompt[]>(
    () => [
      { id: '1', icon: '🗒️', title: t('prompts.newNote_title'), description: t('prompts.newNote_desc') },
      { id: '2', icon: '✅', title: t('prompts.todayTasks_title'), description: t('prompts.todayTasks_desc') },
      { id: '3', icon: '🕒', title: t('prompts.checkCalendar_title'), description: t('prompts.checkCalendar_desc') },
      { id: '4', icon: '⚙️', title: t('prompts.createWorkflow_title'), description: t('prompts.createWorkflow_desc') },
      { id: '5', icon: '📊', title: t('prompts.createReport_title'), description: t('prompts.createReport_desc') },
      { id: '6', icon: '🏅', title: t('prompts.setGoal_title'), description: t('prompts.setGoal_desc') },
    ],
    [t]
  );

  const tabs: Tab[] = useMemo(
    () => [
      { key: 'notes', label: t('tabs.notes'), icon: FileText },
      { key: 'tasks', label: t('tabs.tasks'), icon: CheckSquare },
      { key: 'calendar', label: t('tabs.calendar'), icon: Calendar },
      { key: 'flows', label: t('tabs.flows'), icon: Workflow },
    ],
    [t]
  );

  const renderMessage = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => (
      <View style={{ marginBottom: 12 }}>
        <ChatBubble message={item} />
      </View>
    ),
    []
  );

  const renderEmptyComponent = useCallback(
    () => (
      <SuggestionPrompts
        isFirstSession={isFirstSession}
        onboardingPrompts={onboardingPrompts}
        regularPrompts={regularPrompts}
        handlePromptClick={handlePromptClick}
      />
    ),
    [isFirstSession, onboardingPrompts, regularPrompts, handlePromptClick]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleSend = useCallback(() => {
    handleSendMessage();
    // Dismiss keyboard after sending
    Keyboard.dismiss();
  }, [handleSendMessage]);

  return (
    <UniversalLayout>
      <StatusBar style="auto" />

      <SafeAreaView edges={['top']} flex={1}>
        {/* 1. Fixed Header */}
        <YStack backgroundColor={theme.background.val} zIndex={10}>
          <Navbar title={t('tabs.chat')} />
          <WidgetTabs
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isWidgetExpanded={isWidgetExpanded}
            onToggleWidget={toggleWidget}
          />
        </YStack>

        {/* 2. Widget Area (Animated Height) */}
        <Animated.View style={widgetAnimatedStyle}>
          <WidgetContainer
            selectedWidget={selectedTab as WidgetType}
            isExpanded={isWidgetExpanded}
            expandedHeight={widgetExpandedHeight}
            collapsedHeight={0}
            onFocusChange={setIsWidgetFocused}
          />
        </Animated.View>

        {/* 3. Chat Messages (Flex 1 - Takes Remaining Space) */}
        <YStack flex={1} backgroundColor="$background">
          <FlatList
            ref={flatListRef}
            data={displayMessages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmptyComponent}
            inverted={messages.length > 0}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 16,
              paddingTop: 0,
              paddingBottom: 0,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </YStack>

        {/* 4. Input Bar */}
        <Animated.View style={inputBarAnimatedStyle}>
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
