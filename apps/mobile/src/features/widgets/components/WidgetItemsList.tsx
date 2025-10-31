/**
 * WidgetItemsList Component
 *
 * Renders list of widget items.
 * Handles item display, interactions, and empty states.
 *
 * @module features/widgets/components/WidgetItemsList
 */

import React from 'react';
import { YStack, Card, Text } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import type { WidgetItem, WidgetType } from '../types';

interface WidgetItemsListProps {
  /** List of items to display */
  items: WidgetItem[];
  /** Widget type for context */
  widgetType: WidgetType;
}

/**
 * WidgetItemsList
 *
 * Displays widget items in a scrollable list.
 */
export function WidgetItemsList({ items, widgetType }: WidgetItemsListProps): React.ReactElement {
  const { t } = useTranslation('mobile');

  if (items.length === 0) {
    return (
      <YStack padding="$4" alignItems="center" justifyContent="center">
        <Text color="$gray10" fontSize="$3" textAlign="center">
          {t(`widget.${widgetType}_empty`)}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$2">
      {items.map((item) => (
        <Card
          key={item.id}
          padding="$2"
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$gray4"
          borderRadius="$3"
          pressStyle={{ scale: 0.98, backgroundColor: '$gray2' }}
          animation="bouncy"
        >
          <Text
            color="$gray12"
            fontSize="$2"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            • {item.text}
          </Text>
        </Card>
      ))}
      {items.length > 5 && (
        <Text color="$blue9" fontSize="$2" textAlign="center" paddingTop="$2">
          {t('widget.more_items', { count: items.length - 5 })}
        </Text>
      )}
    </YStack>
  );
}
