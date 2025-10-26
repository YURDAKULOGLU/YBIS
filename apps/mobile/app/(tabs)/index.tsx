import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { YStack } from '@ybis/ui';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckSquare, FileText, Workflow } from '@ybis/ui';
import Logger from '@ybis/logging';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { useWidgetSnapshot } from '../../src/features/chat/hooks/useWidgetSnapshot';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { MessageList } from '../../src/features/chat/components/MessageList';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { Widget } from '../../src/features/chat/components/Widget';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');

  const {
    messages,
    inputText,
    isFirstSession,
    isSending,
    setInputText,
    handleSendMessage,
    handlePromptClick,
    handleWidgetCommand,
  } = useChat();

  const { snapshot, isLoading: isWidgetLoading, error: widgetError, refresh: refreshWidget } = useWidgetSnapshot();

  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const [inputBarHeight, setInputBarHeight] = useState(96);
  const [isWidgetCollapsed, setIsWidgetCollapsed] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleContentSizeChange = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
      description: t('onboarding.prompt1_desc'),
    },
    {
      id: '2',
      icon: '🧪',
      title: t('onboarding.prompt2_title'),
      description: t('onboarding.prompt2_desc'),
    },
    {
      id: '3',
      icon: '💬',
      title: t('onboarding.prompt3_title'),
      description: t('onboarding.prompt3_desc'),
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

  const handleWidgetRefresh = useCallback(() => {
    void refreshWidget();
  }, [refreshWidget]);

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
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        >
          <YStack flex={1} backgroundColor="$background">
            <WidgetTabs
              tabs={tabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isCollapsed={isWidgetCollapsed}
              onToggleCollapsed={() => setIsWidgetCollapsed((previous) => !previous)}
              onRefresh={handleWidgetRefresh}
              isRefreshing={isWidgetLoading}
            />

            {!isWidgetCollapsed && (
              <YStack padding="$3">
                <Widget
                  selectedTab={selectedTab}
                  snapshot={snapshot}
                  isLoading={isWidgetLoading}
                  error={widgetError}
                  onRefresh={handleWidgetRefresh}
                  onSelectCommand={handleWidgetCommand}
                />
              </YStack>
            )}

            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: inputBarHeight + 24 }}
              onContentSizeChange={handleContentSizeChange}
              keyboardShouldPersistTaps="handled"
            >
              {chatContent}
            </ScrollView>

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
              isSending={isSending}
            />
          </YStack>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </UniversalLayout>
  );
}
