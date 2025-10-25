import React, { useState, useRef, useCallback, useMemo } from 'react';
import { YStack } from '@ybis/ui';
import { Animated, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckSquare, FileText, Workflow } from '@ybis/ui';
import Logger from '@ybis/logging';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { useKeyboardAnimations } from '../../src/features/chat/hooks/useKeyboardAnimations';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { MessageList } from '../../src/features/chat/components/MessageList';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { Widget } from '../../src/features/chat/components/Widget';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const { height: screenHeight } = useWindowDimensions();

  const { messages, inputText, isFirstSession, setInputText, handleSendMessage, handlePromptClick } = useChat();

  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [inputBarHeight, setInputBarHeight] = useState(0);

  const scrollViewRef = useRef(null);
  const widgetHeight = useMemo(() => screenHeight * 0.2, [screenHeight]);

  const { widgetAnimatedHeight, inputBarAnimatedBottom, scrollPaddingBottom } = useKeyboardAnimations(
    widgetHeight,
    inputBarHeight,
    scrollViewRef
  );

  const handleContentSizeChange = useCallback(() => {
    const scrollView = scrollViewRef.current as { scrollToEnd?: (options: { animated: boolean }) => void } | null;
    scrollView?.scrollToEnd?.({ animated: true });
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
        <YStack flex={1} backgroundColor="$background">
          <WidgetTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          <Animated.View style={{ height: widgetAnimatedHeight, overflow: 'hidden' }}>
            <YStack height={widgetHeight} padding="$2">
              <Widget selectedTab={selectedTab} />
            </YStack>
          </Animated.View>

          <Animated.ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: scrollPaddingBottom,
            }}
            onContentSizeChange={handleContentSizeChange}
            keyboardShouldPersistTaps="handled"
          >
            {chatContent}
          </Animated.ScrollView>

          <Animated.View
            style={{
              position: 'absolute',
              bottom: inputBarAnimatedBottom,
              left: 0,
              right: 0,
              backgroundColor: 'transparent',
            }}
          >
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={handleSendMessage}
              handleVoiceRecord={handleVoiceRecord}
              handleQuickActionPress={handleQuickActionPress}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (height > 0 && height !== inputBarHeight) {
                  setInputBarHeight(height);
                }
              }}
            />
          </Animated.View>
        </YStack>
      </SafeAreaView>
    </UniversalLayout>
  );
}
