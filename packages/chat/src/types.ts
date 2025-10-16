/**
 * Chat Plugin Types
 *
 * Shared types for chat UI components
 */

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatBubbleProps {
  message: Message;
  showAvatar?: boolean;
}

export interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface MessageStatusProps {
  status: Message['status'];
  size?: number;
}
