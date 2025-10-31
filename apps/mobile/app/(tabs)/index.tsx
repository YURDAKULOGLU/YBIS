import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  YStack,
  useTheme,
} from '@ybis/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChatBubble, type Message } from '@ybis/chat';
import Logger from '@ybis/logging';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import { Navbar } from '../../src/components/layout/Navbar';
import type { SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';

const NAVBAR_HEIGHT = 56;

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
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const {
    messages,
    inputText,
    isFirstSession,
    setInputText,
    handleSendMessage,
    handlePromptClick,
  } = useChat();

  const flatListRef = useRef<FlatList<Message>>(null);
  const [chatInputHeight, setChatInputHeight] = useState(80);

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

  const handleScroll = useCallback((_event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Auto-scroll is now always enabled for new messages
  }, []);

  const headerSpacerHeight = useMemo(() => 
    insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT + widgetHeight + 8,
  [insets.top, widgetHeight]);

  const renderHeader = useCallback(() => (
    <View style={{ height: headerSpacerHeight }} />
  ), [headerSpacerHeight]);

  const contentContainerStyle = useMemo<ViewStyle>(() => {
    const justifyContent: ViewStyle['justifyContent'] = messages.length === 0 ? 'flex-start' : 'flex-end';
    return {
      flexGrow: 1,
      justifyContent,
      paddingHorizontal: 16,
      paddingBottom: chatInputHeight + 16,
    };
  }, [messages.length, chatInputHeight]);

  const handleMeasuredChatInput = useCallback((event: LayoutChangeEvent) => {
    setChatInputHeight(event.nativeEvent.layout.height);
  }, []);

  const handleSend = useCallback(() => {
    handleSendMessage();
  }, [handleSendMessage]);

  return (
    <UniversalLayout>
      <StatusBar style="auto" />
      <YStack flex={1}>
        {/* Status bar background */}
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          height={insets.top}
          backgroundColor={theme.background.val}
          zIndex={300}
        />
        
        <YStack
          position="absolute"
          top={insets.top}
          left={0}
          right={0}
          zIndex={200}
          backgroundColor={theme.background.val}
        >
          <Navbar title={t('tabs.chat')} />
          <WidgetTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </YStack>

        <YStack
          position="absolute"
          top={insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT}
          left={0}
          right={0}
          zIndex={100}
          height={widgetHeight}
          backgroundColor={theme.background.val}
          borderBottomWidth={1}
          borderBottomColor={theme.gray5.val}
        >
          <InteractiveWidget selectedTab={selectedTab} height={widgetHeight} />
        </YStack>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <SafeAreaView edges={['bottom']} flex={1}>
            <YStack flex={1} backgroundColor="$background">
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
                showsVerticalScrollIndicator={false}
              />

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
                onLayout={handleMeasuredChatInput}
              />
            </YStack>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </YStack>
    </UniversalLayout>
  );
}
