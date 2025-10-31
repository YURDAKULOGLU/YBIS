/**
 * WidgetHeader Component
 *
 * Sticky header for widgets showing icon, title, and item count.
 * Always visible regardless of expand/collapse state.
 *
 * @module features/widgets/components/WidgetHeader
 */

import React from 'react';
import { XStack, YStack, Text } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import { LAYOUT } from '../../../constants/layout';

interface WidgetHeaderProps {
  /** Widget icon emoji */
  icon: string;
  /** Widget title */
  title: string;
  /** Total item count */
  count: number;
}

/**
 * WidgetHeader
 *
 * Displays widget metadata in a sticky header.
 */
export function WidgetHeader({ icon, title, count }: WidgetHeaderProps): React.ReactElement {
  const { t } = useTranslation('mobile');

  return (
    <XStack
      height={LAYOUT.WIDGET_TOGGLE_BAR_HEIGHT}
      paddingHorizontal="$3"
      alignItems="center"
      gap="$2"
      backgroundColor="$gray2"
    >
      <Text fontSize="$5">{icon}</Text>
      <YStack flex={1}>
        <Text fontWeight="600" fontSize="$3" color="$color">
          {title}
        </Text>
        <Text color="$gray11" fontSize="$2">
          {t('widget.item_count', { count })}
        </Text>
      </YStack>
    </XStack>
  );
}
