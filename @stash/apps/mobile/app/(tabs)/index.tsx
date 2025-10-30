import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
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
import type { Tab, TabType, SuggestionPrompt } from '../../src/features/chat/types';
import { useChat } from '../../src/features/chat/hooks/useChat';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { SuggestionPrompts } from '../../src/features/chat/components/SuggestionPrompts';
import { Widget } from '../../src/features/chat/components/Widget';
import { WidgetTabs } from '../../src/features/chat/components/WidgetTabs';

const NAVBAR_HEIGHT = 56;
const WIDGET_TAB_BAR_HEIGHT = 48;
const WIDGET_HEIGHT_PERCENTAGE = 0.3; // 30% of screen height

export default function MainScreen(): React.ReactElement {
  const { t } = useTranslation('mobile');
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { height: screenHeight } = useWindowDimensions();

  const widgetHeight = screenHeight * WIDGET_HEIGHT_PERCENTAGE;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

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
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [chatInputHeight, setChatInputHeight] = useState(80);

  const widgetHeightAnim = useRef(new Animated.Value(widgetHeight)).current;

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

  useEffect(() => {
    Animated.timing(widgetHeightAnim, {
      toValue: isKeyboardVisible ? 0 : widgetHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isKeyboardVisible, widgetHeight, widgetHeightAnim]);

  useEffect(() => {
    if (messages.length > 0 && !userHasScrolled) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [messages.length, userHasScrolled]);

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
      handlePromptClick={(prompt) => {
        setUserHasScrolled(false);
        handlePromptClick(prompt);
      }}
    />
  ), [isFirstSession, onboardingPrompts, regularPrompts, handlePromptClick]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;
    setUserHasScrolled(distanceFromBottom > 50);
  }, []);

  const headerSpacerHeight = useMemo(() => widgetHeightAnim.interpolate({
    inputRange: [0, widgetHeight],
    outputRange: [
      insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT + 8,
      insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT + widgetHeight + 8,
    ],
  }), [widgetHeightAnim, widgetHeight, insets.top]);

  const renderHeader = useCallback(() => (
    <Animated.View style={{ height: headerSpacerHeight }} />
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
    setUserHasScrolled(false);
    handleSendMessage();
  }, [handleSendMessage]);

  return (
    <UniversalLayout>
      <YStack flex={1}>
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

        <Animated.View
          style={{
            position: 'absolute',
            top: insets.top + NAVBAR_HEIGHT + WIDGET_TAB_BAR_HEIGHT,
            left: 0,
            right: 0,
            zIndex: 100,
            height: widgetHeightAnim,
            overflow: 'hidden',
            backgroundColor: theme.background.val,
            borderBottomWidth: 1,
            borderBottomColor: theme.gray5.val,
          }}
        >
          <Widget selectedTab={selectedTab} />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
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
