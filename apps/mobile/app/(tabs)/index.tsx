import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { YStack, ScrollView } from '@ybis/ui';
import { KeyboardAvoidingView, Platform, useWindowDimensions, Keyboard, Animated, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckSquare, FileText, Workflow } from '@ybis/ui';
import Logger from '@ybis/logging';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { MessageList } from '../../src/features/chat/components/MessageList';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { Widget } from '../../src/features/chat/components/Widget';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';

// Constants for better maintainability
const CHAT_INPUT_BUFFER_SPACING = 8;
const WIDGET_HEIGHT_PERCENTAGE = 0.2;

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const { height: screenHeight } = useWindowDimensions();
  // The default value of 80 is chosen as an initial estimate for chat input height.
  // This value is based on typical design guidelines for input fields on mobile devices,
  // and ensures that the layout does not break before the actual height is measured.
  // Actual heights may vary depending on device and font size, and will be updated on layout.
  const [chatInputHeight, setChatInputHeight] = useState(80);

  // Animated value for smooth widget transitions
  const widgetAnimatedHeight = useRef(new Animated.Value(screenHeight * WIDGET_HEIGHT_PERCENTAGE)).current;
  const widgetHeight = useMemo(() => screenHeight * WIDGET_HEIGHT_PERCENTAGE, [screenHeight]);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      // Smoothly collapse widget when keyboard opens
      Animated.timing(widgetAnimatedHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
    
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Smoothly expand widget when keyboard closes
      Animated.timing(widgetAnimatedHeight, {
        toValue: widgetHeight,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
    
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [widgetAnimatedHeight, widgetHeight]);

  const { messages, inputText, isFirstSession, setInputText, handleSendMessage, handlePromptClick } = useChat();

  const [selectedTab, setSelectedTab] = useState<TabType>('notes');

  const scrollViewRef = useRef<ScrollView>(null);
  const shouldAutoScroll = useRef(true);

  // Only auto-scroll when new messages are added (not on keyboard events)
  const handleContentSizeChange = useCallback(() => {
    if (shouldAutoScroll.current && messages.length > 0) {
      // Immediate scroll without animation to avoid jumping
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }
  }, [messages.length]);

  const handleChatInputLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setChatInputHeight(height);
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
      icon: '👋',
      title: t('onboarding.prompt1_title'),
      description: t('onboarding.prompt1_desc')
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

  const chatContent = messages.length === 0 ? (
    <SuggestionPrompts
      isFirstSession={isFirstSession}
      onboardingPrompts={onboardingPrompts}
      regularPrompts={regularPrompts}
      handlePromptClick={handlePromptClick}
    />
  ) : (
    <MessageList messages={messages} />
  );

  return (
    <UniversalLayout>
      <SafeAreaView edges={['top']} flex={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <YStack flex={1} backgroundColor="$background">
            <WidgetTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

            {/* Animated widget with smooth collapse/expand */}
            <Animated.View style={{ height: widgetAnimatedHeight, overflow: 'hidden' }}>
              <YStack height={widgetHeight} padding="$2">
                <Widget selectedTab={selectedTab} />
              </YStack>
            </Animated.View>

            <ScrollView
              ref={scrollViewRef}
              flex={1}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: chatInputHeight + CHAT_INPUT_BUFFER_SPACING,
              }}
              onContentSizeChange={handleContentSizeChange}
              keyboardShouldPersistTaps="handled"
            >
              {chatContent}
            </ScrollView>

            <YStack>
              <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                handleSendMessage={handleSendMessage}
                handleVoiceRecord={handleVoiceRecord}
                handleQuickActionPress={handleQuickActionPress}
                onLayout={handleChatInputLayout}
              />
            </YStack>
          </YStack>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </UniversalLayout>
  );
}
