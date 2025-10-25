import { useState, useCallback } from 'react';
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

  const getMockAIResponse = useCallback((userText: string): string => {
    const lowerText = userText.toLowerCase();
    if (lowerText.includes('merhaba')) return t('mockResponses.greeting');
    return t('mockResponses.context_default', { userText });
  }, [t]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((previous) => [...previous, userMessage]);
    setInputText('');

    if (isFirstSession) {
      setIsFirstSession(false);
    }

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((previous) => [...previous, aiMessage]);
    }, 1500);
  }, [getMockAIResponse, inputText, isFirstSession]);

  const handlePromptClick = useCallback((prompt: SuggestionPrompt) => {
    Logger.info('Suggestion prompt clicked', {
      type: 'USER_ACTION',
      promptId: prompt.id,
      promptTitle: prompt.title,
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt.title,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((previous) => [...previous, userMessage]);

    if (isFirstSession) {
      setIsFirstSession(false);
    }

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((previous) => [...previous, aiMessage]);
    }, 1500);
  }, [getMockAIResponse, isFirstSession]);

  return {
    messages,
    inputText,
    isFirstSession,
    setInputText,
    handleSendMessage,
    handlePromptClick,
  };
}
