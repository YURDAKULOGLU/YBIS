/**
 * @ybis/chat - Chat UI Plugin Package
 *
 * Reusable chat components for YBIS mobile app
 *
 * Components:
 * - ChatBubble: Message bubble display
 * - ChatInput: Input field with send button
 * - MessageStatus: Status indicator (sending/sent/error)
 *
 * Usage:
 * ```tsx
 * import { ChatBubble, ChatInput, MessageStatus } from '@ybis/chat';
 * ```
 */

export { ChatBubble } from './ChatBubble';
export { ChatInput } from './ChatInput';
export { MessageStatus } from './MessageStatus';
export type { Message, ChatBubbleProps, ChatInputProps, MessageStatusProps } from './types';
