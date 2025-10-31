/**
 * useQuickAdd Hook
 *
 * Handles quick add functionality for widgets.
 * Includes haptic feedback, logging, and API integration.
 *
 * @module features/widgets/hooks/useQuickAdd
 */

import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import Logger from '@ybis/logging';
import type { WidgetType } from '../types';

/**
 * Quick add result
 */
interface QuickAddResult {
  /** Input text state */
  inputText: string;
  /** Update input text */
  setInputText: (text: string) => void;
  /** Handle quick add action */
  handleQuickAdd: () => Promise<void>;
  /** Loading state */
  isAdding: boolean;
}

/**
 * Hook to handle quick add for widgets
 *
 * @param widgetType - Type of widget
 * @returns Quick add functionality
 *
 * @example
 * ```tsx
 * const { inputText, setInputText, handleQuickAdd, isAdding } = useQuickAdd('notes');
 * ```
 */
export const useQuickAdd = (widgetType: WidgetType): QuickAddResult => {
  const [inputText, setInputText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = useCallback(async (): Promise<void> => {
    const trimmedText = inputText.trim();

    if (!trimmedText) {
      return;
    }

    setIsAdding(true);

    try {
      // Haptic feedback on start
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Log the action
      Logger.info('Widget quick add', {
        type: 'USER_ACTION',
        widgetType,
        content: trimmedText,
      });

      // TODO: Implement actual API call
      // await widgetAPI.addItem(widgetType, trimmedText);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Clear input
      setInputText('');
    } catch (error) {
      // Error haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Log error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Logger.error(`Widget quick add failed for ${widgetType}: ${errorMessage}`);
    } finally {
      setIsAdding(false);
    }
  }, [inputText, widgetType]);

  return {
    inputText,
    setInputText,
    handleQuickAdd,
    isAdding,
  };
};
