import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '@ybis/chat';
import type { Message as LLMMessage } from '@ybis/llm';
import Logger from '@ybis/logging';
import type { SuggestionPrompt, WidgetCommandPayload } from '../types';
import { chatWithLLM } from '../../../services/chat/chatGateway';

interface UseChatReturn {
  messages: Message[];
  inputText: string;
  isFirstSession: boolean;
  isSending: boolean;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  handlePromptClick: (prompt: SuggestionPrompt) => void;
  handleWidgetCommand: (command: WidgetCommandPayload) => void;
}

function createMessageId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimestamp(date = new Date()): string {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function mapMessagesToLLM(messages: Message[]): LLMMessage[] {
  return messages.map((message) => ({
    role: message.sender === 'user' ? 'user' : 'assistant',
    content: message.text,
  }));
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFirstSession, setIsFirstSession] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessageInternal = useCallback(
    async (content: string, options: { clearInput?: boolean; origin: string }) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      if (options.clearInput) {
        setInputText('');
      }

      const userMessage: Message = {
        id: createMessageId(),
        text: trimmed,
        sender: 'user',
        timestamp: formatTimestamp(),
        status: 'sending',
      };

      Logger.info('Dispatching chat message', {
        type: 'CHAT',
        origin: options.origin,
      });

      setMessages((previous) => [...previous, userMessage]);
      setIsSending(true);

      try {
        const conversation = mapMessagesToLLM([...messagesRef.current, userMessage]);
        const response = await chatWithLLM(conversation);

        setMessages((previous) =>
          previous.map((message) =>
            message.id === userMessage.id ? { ...message, status: 'sent' } : message
          )
        );

        const aiMessage: Message = {
          id: createMessageId(),
          text: response.content,
          sender: 'ai',
          timestamp: formatTimestamp(),
          status: 'sent',
        };

        setMessages((previous) => [...previous, aiMessage]);
        Logger.info('Chat response received', {
          type: 'CHAT',
          finishReason: response.finishReason,
          model: response.model,
        });
      } catch (error) {
        Logger.error('Chat message send failed', error as Error, { type: 'CHAT' });
        setMessages((previous) =>
          previous.map((message) =>
            message.id === userMessage.id ? { ...message, status: 'error' } : message
          )
        );
      } finally {
        setIsSending(false);
        if (isFirstSession) {
          setIsFirstSession(false);
        }
      }
    },
    [isFirstSession]
  );

  const handleSendMessage = useCallback(() => {
    void sendMessageInternal(inputText, { clearInput: true, origin: 'input' });
  }, [inputText, sendMessageInternal]);

  const handlePromptClick = useCallback(
    (prompt: SuggestionPrompt) => {
      Logger.info('Suggestion prompt clicked', {
        type: 'USER_ACTION',
        promptId: prompt.id,
        promptTitle: prompt.title,
      });
      void sendMessageInternal(prompt.description ?? prompt.title, {
        origin: 'suggestion',
      });
    },
    [sendMessageInternal]
  );

  const handleWidgetCommand = useCallback(
    (command: WidgetCommandPayload) => {
      Logger.info('Widget command dispatched', {
        type: 'USER_ACTION',
        command,
      });
      void sendMessageInternal(command.prompt, { origin: 'widget' });
    },
    [sendMessageInternal]
  );

  return {
    messages,
    inputText,
    isFirstSession,
    isSending,
    setInputText,
    handleSendMessage,
    handlePromptClick,
    handleWidgetCommand,
  };
}
