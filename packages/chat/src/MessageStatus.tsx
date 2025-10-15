/**
 * MessageStatus Component
 * WhatsApp-style message status indicator with proper check icons
 *
 * Status progression:
 * - sending: Clock icon (⏱)
 * - sent: Single check (✓)
 * - delivered: Double check (✓✓)
 * - read: Double check green (✓✓ 🟢)
 */

import React from 'react';
import { XStack } from 'tamagui';
import { Clock, Check } from '@tamagui/lucide-icons';
import type { MessageStatus as MessageStatusType } from './types';

export interface MessageStatusProps {
  /**
   * Message status
   */
  status: MessageStatusType;

  /**
   * Icon color (default: light for dark bubbles)
   */
  color?: string;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  color = 'rgba(255,255,255,0.7)',
}) => {
  switch (status) {
    case 'sending':
      return <Clock size={12} color="rgba(255,255,255,0.5)" />;

    case 'sent':
      return <Check size={14} color={color} strokeWidth={2.5} />;

    case 'delivered':
      return (
        <XStack marginLeft={-6}>
          <Check size={14} color={color} strokeWidth={2.5} />
          <Check size={14} color={color} strokeWidth={2.5} marginLeft={-8} />
        </XStack>
      );

    case 'read':
      return (
        <XStack marginLeft={-6}>
          <Check size={14} color="#34D399" strokeWidth={2.5} />
          <Check size={14} color="#34D399" strokeWidth={2.5} marginLeft={-8} />
        </XStack>
      );

    default:
      return null;
  }
};
