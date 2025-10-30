import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { YStack } from '@ybis/ui';
import { KeyboardAvoidingView, Platform, useWindowDimensions, Keyboard, FlatList, View, Animated, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckSquare, FileText, Workflow } from '@ybis/ui';
import Logger from '@ybis/logging';
import { ChatBubble, type Message } from '@ybis/chat';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import { Navbar } from '../../src/components/layout/Navbar';
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { Widget } from '../../src/features/chat/components/Widget';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';

// Layout constants
const NAVBAR_HEIGHT = 56;
const WIDGET_TAB_BAR_HEIGHT = 48;
const WIDGET_HEIGHT_PERCENTAGE = 0.30; // 30% of screen - simple fixed height

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Simple fixed widget height
  const widgetHeight = screenHeight * WIDGET_HEIGHT_PERCENTAGE;

  // Widget collapse state - keyboard visibility
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { messages, inputText, isFirstSession, setInputText, handleSendMessage, handlePromptClick } = useChat();
  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const flatListRef = useRef<FlatList>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  // Widget animation - simple collapse/expand
  const widgetHeightAnim = useRef(new Animated.Value(widgetHeight)).current;

  // Track keyboard visibility globally
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Animate widget collapse/expand on keyboard show/hide
  useEffect(() => {
    Animated.timing(widgetHeightAnim, {
      toValue: isKeyboardVisible ? 0 : widgetHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isKeyboardVisible, widgetHeight, widgetHeightAnim]);

  // Smart auto-scroll: Only scroll if user hasn't manually scrolled up
  useEffect(() => {
    if (messages.length > 0 && !userHasScrolled) {
      // Delay ensures layout is complete before scrolling
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, userHasScrolled]);

  const handleChatInputFocus = useCallback(() => {
    // Reset scroll flag when user focuses input (likely to send new message)
    setUserHasScrolled(false);
  }, []);

  const handleChatInputBlur = useCallback(() => {
    // No-op: keyboard visibility handles animation
  }, []);

  const handleVoiceRecord = useCallback(() => {
    Logger.info('Voice record triggered');
  }, []);

  const handleQuickActionPress = useCallback(() => {
    Logger.info('Quick actions placeholder triggered');
  }, []);

  const onboardingPrompts = useMemo<SuggestionPrompt[]>(() => [
    {
      id: '1',
      icon: '­şæï',
      title: t('onboarding.prompt1_title'),
      description: t('onboarding.prompt1_desc')
    },
  ], [t]);

  const regularPrompts = useMemo<SuggestionPrompt[]>(() => [
    { id: '1', icon: '­şùÆ´©Å', title: t('prompts.newNote_title'), description: t('prompts.newNote_desc') },
    { id: '2', icon: 'Ô£à', title: t('prompts.todayTasks_title'), description: t('prompts.todayTasks_desc') },
    { id: '3', icon: '­şòÆ', title: t('prompts.checkCalendar_title'), description: t('prompts.checkCalendar_desc') },
    { id: '4', icon: 'ÔÜÖ´©Å', title: t('prompts.createWorkflow_title'), description: t('prompts.createWorkflow_desc') },
    { id: '5', icon: '­şôè', title: t('prompts.createReport_title'), description: t('prompts.createReport_desc') },
    { id: '6', icon: '­şÅà', title: t('prompts.setGoal_title'), description: t('prompts.setGoal_desc') },
  ], [t]);

  const tabs: Tab[] = useMemo(() => [
    { key: 'notes', label: t('tabs.notes'), icon: FileText },
    { key: 'tasks', label: t('tabs.tasks'), icon: CheckSquare },
    { key: 'calendar', label: t('tabs.calendar'), icon: Calendar },
    { key: 'flows', label: t('tabs.flows'), icon: Workflow },
  ], [t]);

  // FlatList render functions
  const renderMessage = useCallback(({ item }: ListRenderItemInfo<Message>) => (
    <View style={{ marginBottom: 12 }}>
      <ChatBubble message={item} />
    </View>
  ), []);

  const renderEmptyComponent = useCallback(() => (
    <SuggestionPrompts
      isFirstSession={isFirstSession}
      onboardingPrompts={onboardingPrompts}
      regularPrompts={regularPrompts}
      handlePromptClick={handlePromptClick}
    />
  ), [isFirstSession, onboardingPrompts, regularPrompts, handlePromptClick]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    
    // User scrolled up more than 50px from bottom
    const distanceFromBottom = contentHeight - offsetY - layoutHeight;
    setUserHasScrolled(distanceFromBottom > 50);
  }, []);

  // Animated header spacer height
  const headerSpacerHeight = useMemo(() => 
    widgetHeightAnim.interpolate({
      inputRange: [0, widgetHeight],
      outputRange: [
        insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT + 8, // Collapsed
        insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT + widgetHeight + 8, // Expanded
      ]
    }),
  [widgetHeightAnim, widgetHeight, insets.top]);

  const renderHeader = useCallback(() => (
    <Animated.View style={{ height: headerSpacerHeight }} />
  ), [headerSpacerHeight]);

  const contentContainerStyle = useMemo(() => ({
    flexGrow: 1,
    justifyContent: (messages.length === 0 ? 'flex-start' : 'flex-end') as 'flex-start' | 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  }), [messages.length]);

  return (
    <UniversalLayout>
      <YStack flex={1}>
        {/* Navbar Layer (Fixed Top - Outside KeyboardAvoidingView) */}
        <YStack
          position="absolute"
          top={insets.top}
          left={0}
          right={0}
          zIndex={200}
          backgroundColor="$background"
        >
          <Navbar title={t('navbar.home_title')} />
          
          {/* Widget Tabs - Always Visible, part of fixed top layer */}
          <WidgetTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </YStack>

        {/* Widget Content Layer (Animated - Slides up on keyboard) */}
        <Animated.View
          style={{
            position: 'absolute',
            top: insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT,
            left: 0,
            right: 0,
            zIndex: 100,
            height: widgetHeightAnim,
            overflow: 'hidden',
            backgroundColor: '$background',
            borderBottomWidth: 1,
            borderBottomColor: '$borderColor',
          }}
        >
          <Widget selectedTab={selectedTab} />
        </Animated.View>

        {/* Chat Layer (Base - KeyboardAvoidingView) */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <SafeAreaView edges={[]} flex={1}>
            <YStack flex={1} backgroundColor="$background">
              {/* FlatList for messages - Messages grow from bottom */}
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={keyExtractor}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={contentContainerStyle}
                keyboardShouldPersistTaps="handled"
                onScroll={handleScroll}
                scrollEventThrottle={16}
              />

              {/* Chat Input */}
              <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                handleSendMessage={handleSendMessage}
                handleVoiceRecord={handleVoiceRecord}
                handleQuickActionPress={handleQuickActionPress}
                onFocus={handleChatInputFocus}
                onBlur={handleChatInputBlur}
              />
            </YStack>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </YStack>
    </UniversalLayout>
  );
}
