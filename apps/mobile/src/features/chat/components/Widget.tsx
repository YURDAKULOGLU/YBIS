import React from 'react';
import { YStack, XStack, Text, Card } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import type { TabType } from '../types';

interface WidgetProps {
  selectedTab: TabType;
}

export function Widget({ selectedTab }: WidgetProps): React.ReactElement {
  const { t } = useTranslation('mobile');

  const getWidgetData = (): { icon: string; title: string; count: number; items: string[] } => {
    switch (selectedTab) {
      case 'notes':
        return {
          icon: '📝',
          title: t('widget.notes_title'),
          count: 3,
          items: ['Proje toplantısı notları', 'Haftalık rapor', 'Fikirler listesi'],
        };
      case 'tasks':
        return {
          icon: '✅',
          title: t('widget.tasks_title'),
          count: 5,
          items: ['E-posta kontrolü', 'Rapor hazırlama', 'Toplantı hazırlığı'],
        };
      case 'calendar':
        return {
          icon: '📅',
          title: t('widget.calendar_title'),
          count: 2,
          items: ['09:00 - Proje toplantısı', '14:00 - Müşteri görüşmesi'],
        };
      case 'flows':
        return {
          icon: '🔄',
          title: t('widget.flows_title'),
          count: 1,
          items: ['Otomatik rapor oluşturma', 'E-posta takibi'],
        };
      default:
        return { icon: '📊', title: t('widget.dashboard_title'), count: 0, items: [] };
    }
  };

  const widgetData = getWidgetData();

  return (
    <Card
      padding="$3"
      backgroundColor="$gray2"
      borderWidth={1}
      borderColor="$gray5"
      borderRadius="$6"
      pressStyle={{ scale: 0.98, backgroundColor: '$gray3' }}
      animation="bouncy"
    >
      <YStack height="100%" justifyContent="space-between">
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$5">{widgetData.icon}</Text>
          <YStack flex={1}>
            <Text fontWeight="600" fontSize="$3" color="$color">
              {widgetData.title}
            </Text>
            <Text color="$gray11" fontSize="$2">
              {t('widget.item_count', { count: widgetData.count })}
            </Text>
          </YStack>
        </XStack>

        <YStack gap="$1">
          {widgetData.items.slice(0, 2).map((item) => (
            <Text
              key={item}
              color="$gray11"
              fontSize="$2"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              • {item}
            </Text>
          ))}
          {widgetData.items.length > 2 && (
            <Text color="$blue9" fontSize="$2">
              {t('widget.more_items', { count: widgetData.items.length - 2 })}
            </Text>
          )}
        </YStack>
      </YStack>
    </Card>
  );
}
