import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { YStack, ScrollView } from '@ybis/ui';
import { KeyboardAvoidingView, Platform, useWindowDimensions, Keyboard, type LayoutChangeEvent } from 'react-native';
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

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const { height: screenHeight } = useWindowDimensions();
  const [keyboardShown, setKeyboardShown] = useState(false);
  // The default value of 80 is chosen as an initial estimate for chat input height.
  // This value is based on typical design guidelines for input fields on mobile devices,
  // and ensures that the layout does not break before the actual height is measured.
  // Actual heights may vary depending on device and font size, and will be updated on layout.
  const [chatInputHeight, setChatInputHeight] = useState(80);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardShown(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardShown(false));
    
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const { messages, inputText, isFirstSession, setInputText, handleSendMessage, handlePromptClick } = useChat();

  const [selectedTab, setSelectedTab] = useState<TabType>('notes');

  const scrollViewRef = useRef<ScrollView>(null);
  const widgetHeight = useMemo(() => screenHeight * 0.2, [screenHeight]);

  const handleContentSizeChange = useCallback(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

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

            {!keyboardShown && (
              <YStack height={widgetHeight} padding="$2">
                <Widget selectedTab={selectedTab} />
              </YStack>
            )}

            <ScrollView
              ref={scrollViewRef}
              flex={1}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: chatInputHeight + 8, // Include chat input height + small buffer
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
