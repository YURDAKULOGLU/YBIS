import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Message } from '@ybis/chat';
import Logger from '@ybis/logging';
import type { SuggestionPrompt } from '../types';

interface UseChatReturn {
  messages: Message[];
  inputText: string;
  isFirstSession: boolean;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  handlePromptClick: (prompt: SuggestionPrompt) => void;
}

export function useChat(): UseChatReturn {
  const { t } = useTranslation('mobile');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstSession, setIsFirstSession] = useState(true);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearPendingResponses = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current = [];
  }, []);

  useEffect(() => clearPendingResponses, [clearPendingResponses]);

  const createMessageId = useCallback((): string => {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  const getMockAIResponse = useCallback((userText: string): string => {
    const lowerText = userText.toLowerCase();
    if (lowerText.includes('merhaba')) return t('mockResponses.greeting');
    return t('mockResponses.context_default', { userText });
  }, [t]);

  const scheduleAIResponse = useCallback((messageText: string) => {
    const timeoutId = setTimeout(() => {
      const aiMessage: Message = {
        id: createMessageId(),
        text: getMockAIResponse(messageText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((previous) => [...previous, aiMessage]);
    }, 1500);

    timeoutsRef.current.push(timeoutId);
  }, [createMessageId, getMockAIResponse]);

  const sendMessage = useCallback((messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: createMessageId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((previous) => [...previous, userMessage]);

    if (isFirstSession) {
      setIsFirstSession(false);
    }

    scheduleAIResponse(messageText);
  }, [createMessageId, isFirstSession, scheduleAIResponse]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  }, [inputText, sendMessage]);

  const handlePromptClick = useCallback((prompt: SuggestionPrompt) => {
    Logger.info('Suggestion prompt clicked', {
      type: 'USER_ACTION',
      promptId: prompt.id,
      promptTitle: prompt.title,
    });

    sendMessage(prompt.title);
  }, [sendMessage]);

  return {
    messages,
    inputText,
    isFirstSession,
    setInputText,
    handleSendMessage,
    handlePromptClick,
  };
}
