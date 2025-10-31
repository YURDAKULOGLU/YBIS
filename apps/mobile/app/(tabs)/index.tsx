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
  Keyboard,
  Pressable,
  type ListRenderItemInfo,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
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
 * Main Chat Screen - Collapsible Widget Pattern
 * 
 * Industry standard approach with collapsible widget:
 * - Widget collapses when keyboard opens (automatic)
 * - Toggle button to manually collapse/expand
 * - Clean separation, no wiggling or jumping
 * - Reliable keyboard handling
 */
export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const theme = useTheme();
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
  const flatListRef = useRef<FlatList<Message>>(null);
  
  // Animated height for smooth collapse/expand
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
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsWidgetExpanded(false);
        widgetHeight.value = withTiming(WIDGET_COLLAPSED_HEIGHT, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Don't auto-expand when keyboard closes - user decides
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [widgetHeight]);

  // Toggle widget collapse/expand
  const toggleWidget = useCallback(() => {
    const newExpanded = !isWidgetExpanded;
    setIsWidgetExpanded(newExpanded);
    widgetHeight.value = withTiming(
      newExpanded ? widgetExpandedHeight : WIDGET_COLLAPSED_HEIGHT,
      {
        duration: 300,
        easing: Easing.out(Easing.ease),
      }
    );
  }, [isWidgetExpanded, widgetHeight, widgetExpandedHeight]);

  const widgetAnimatedStyle = useAnimatedStyle(() => ({
    height: widgetHeight.value,
  }));

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

        {/* 2. Collapsible Widget Section */}
        <Animated.View 
          style={[
            {
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
          
          {/* Widget Content - Only visible when expanded */}
          {isWidgetExpanded && (
            <YStack flex={1}>
              <InteractiveWidget 
                selectedTab={selectedTab} 
                height={widgetExpandedHeight - WIDGET_COLLAPSED_HEIGHT} 
              />
            </YStack>
          )}
        </Animated.View>

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
