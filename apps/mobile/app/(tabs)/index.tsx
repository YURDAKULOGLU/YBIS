import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  YStack,
  useTheme,
  Calendar,
  CheckSquare,
  FileText,
  Workflow,
} from '@ybis/ui';
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

/**
 * Main Chat Screen - Clean, Standard Chat Interface
 * 
 * Simplified design without overlaying widgets for better UX:
 * - Clean chat interface with proper keyboard handling
 * - No widget overlay complexity
 * - Proper space allocation for messages
 * - Smooth scrolling and animations
 */
export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const theme = useTheme();
  const { height: screenHeight } = useWindowDimensions();

  const widgetHeight = screenHeight * WIDGET_HEIGHT_PERCENTAGE;

  const {
    messages,
    inputText,
    isFirstSession,
    setInputText,
    handleSendMessage,
    handlePromptClick,
  } = useChat();

  const [selectedTab, setSelectedTab] = useState<TabType>('notes');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (messages.length > 0) {
      // Always scroll to end when new messages arrive
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [messages.length]);

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

  return (
    <UniversalLayout>
      <StatusBar style="auto" />
      
      {/* INDUSTRY STANDARD LAYOUT - Simple flex, no absolute positioning */}
      <SafeAreaView edges={['top']} flex={1}>
        
        {/* 1. Header Section */}
        <YStack backgroundColor={theme.background.val}>
          <Navbar title={t('tabs.chat')} />
          <WidgetTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </YStack>

        {/* 2. Widget Section - Fixed height, no scroll */}
        <YStack 
          height={widgetHeight} 
          backgroundColor={theme.background.val}
          borderBottomWidth={1}
          borderBottomColor={theme.gray5.val}
        >
          <InteractiveWidget selectedTab={selectedTab} height={widgetHeight} />
        </YStack>

        {/* 3. Chat Section - Flex 1, with keyboard handling */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
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
              paddingTop: 16,
              paddingBottom: 16,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          {/* 4. Input Bar - Rises with keyboard automatically */}
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </UniversalLayout>
  );
}
