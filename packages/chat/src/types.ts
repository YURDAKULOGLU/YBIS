/**
 * Chat component types
 * Universal types for chat UI components (mobile, web, desktop)
 */

/**
 * Message status (WhatsApp-style)
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

/**
 * Message sender type
 */
export type MessageSender = 'user' | 'ai';

/**
 * Chat message interface
 */
export interface ChatMessage {
  /**
   * Unique message ID
   */
  id: string;

  /**
   * Message text content
   */
  text: string;

  /**
   * Message sender
   */
  sender: MessageSender;

  /**
   * Message timestamp (display format)
   */
  timestamp: string;

  /**
   * Message status (only for user messages)
   */
  status?: MessageStatus;
}
