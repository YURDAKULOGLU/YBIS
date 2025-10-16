import { Check, AlertCircle, Loader } from '@tamagui/lucide-icons';
import { type MessageStatusProps } from './types';

/**
 * MessageStatus Component
 *
 * Visual indicator for message status:
 * - sending: Loading spinner
 * - sent: Checkmark
 * - error: Alert icon
 */
export function MessageStatus({ status, size = 16 }: MessageStatusProps) {
  if (!status) return null;

  switch (status) {
    case 'sending':
      return <Loader size={size} color="$gray9" />;
    case 'sent':
      return <Check size={size} color="$green9" />;
    case 'error':
      return <AlertCircle size={size} color="$red9" />;
    default:
      return null;
  }
}
