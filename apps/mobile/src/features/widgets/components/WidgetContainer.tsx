/**
 * WidgetContainer Component
 *
 * Main container for the widget system.
 * Handles layout, scrolling, and widget content rendering.
 *
 * Architecture:
 * - Flex-based layout (no absolute positioning)
 * - Toggle bar always visible (sticky)
 * - Content area scrollable when expanded
 * - Smooth animations synced with keyboard
 *
 * @module features/widgets/components/WidgetContainer
 */

import React from 'react';
import { ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { YStack, Card, useTheme } from '@ybis/ui';
import { ANIMATION } from '../../../constants/layout';
import { useWidgetData } from '../hooks/useWidgetData';
import { useQuickAdd } from '../hooks/useQuickAdd';
import type { WidgetType } from '../types';
import { QuickAddInput } from './QuickAddInput';
import { WidgetItemsList } from './WidgetItemsList';

interface WidgetContainerProps {
  /** Current selected widget type */
  selectedWidget: WidgetType;
  /** Widget expanded state */
  isExpanded: boolean;
  /** Target height when expanded */
  expandedHeight: number;
  /** Minimum height when collapsed (just toggle bar) */
  collapsedHeight: number;
  /** Focus change callback */
  onFocusChange?: (isFocused: boolean) => void;
}

/**
 * WidgetContainer
 *
 * Renders the widget system with smooth animations and proper layout.
 */
export function WidgetContainer({
  selectedWidget,
  isExpanded,
  expandedHeight,
  collapsedHeight,
  onFocusChange,
}: WidgetContainerProps): React.ReactElement {
  const theme = useTheme();
  const widgetData = useWidgetData(selectedWidget);
  const { inputText, setInputText, handleQuickAdd, isAdding } = useQuickAdd(selectedWidget);

  // Animated height based on expanded state
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(
      isExpanded ? expandedHeight : collapsedHeight,
      {
        duration: ANIMATION.WIDGET_DURATION,
        easing: Easing.bezier(...ANIMATION.SMOOTH_EASING),
      }
    ),
  }));

  // Content height (excluding toggle bar)
  const contentHeight = expandedHeight - collapsedHeight;

  // Opacity animation for content fade
  const contentOpacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isExpanded ? 1 : 0, {
      duration: ANIMATION.WIDGET_DURATION,
      easing: Easing.bezier(...ANIMATION.SMOOTH_EASING),
    }),
  }));

  return (
    <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
      {/* Widget Content - Always rendered, fades in/out */}
      <Animated.View style={[{ flex: 1 }, contentOpacityStyle]}>
        <YStack
          flex={1}
          padding="$3"
          backgroundColor={theme.background.val}
          borderBottomWidth={1}
          borderBottomColor={theme.gray5.val}
        >
          <Card
            flex={1}
            padding="$3"
            backgroundColor="$gray2"
            borderWidth={1}
            borderColor="$gray5"
            borderRadius="$4"
          >
            <YStack flex={1} gap="$3">
              {/* Quick Add Input */}
              <QuickAddInput
                placeholder={widgetData.placeholder}
                value={inputText}
                onChangeText={setInputText}
                onSubmit={() => { void handleQuickAdd(); }}
                isLoading={isAdding}
                onFocus={() => onFocusChange?.(true)}
                onBlur={() => onFocusChange?.(false)}
              />

              {/* Scrollable Items List */}
              <ScrollView
                style={{ flex: 1, maxHeight: contentHeight - 100 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                <WidgetItemsList items={widgetData.items} widgetType={selectedWidget} />
              </ScrollView>
            </YStack>
          </Card>
        </YStack>
      </Animated.View>
    </Animated.View>
  );
}
