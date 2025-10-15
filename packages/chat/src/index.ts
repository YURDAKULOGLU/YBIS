/**
 * @ybis/chat
 * Universal chat components (mobile, web, desktop)
 *
 * WhatsApp-style chat UI built with Tamagui
 */

// Types
export type { ChatMessage, MessageStatus, MessageSender } from './types';

// Components
export { MessageStatus as MessageStatusComponent } from './MessageStatus';
export { ChatBubble } from './ChatBubble';
export { ChatInput } from './ChatInput';

// Re-export component prop types
export type { MessageStatusProps } from './MessageStatus';
export type { ChatBubbleProps } from './ChatBubble';
export type { ChatInputProps } from './ChatInput';
