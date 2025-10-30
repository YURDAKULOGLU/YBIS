import React, { useState } from 'react';
import { YStack, XStack, Text, Card, ScrollView, Input } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import type { TabType } from '../types';

interface WidgetProps {
  selectedTab: TabType;
}

export function Widget({ selectedTab }: WidgetProps): React.ReactElement {
  const { t } = useTranslation('mobile');
  const [widgetInput, setWidgetInput] = useState('');

  const getWidgetData = (): { icon: string; title: string; count: number; items: string[] } => {
    switch (selectedTab) {
      case 'notes':
        return {
          icon: '­şôØ',
          title: t('widget.notes_title'),
          count: 3,
          items: ['Proje toplant─▒s─▒ notlar─▒', 'Haftal─▒k rapor', 'Fikirler listesi'],
        };
      case 'tasks':
        return {
          icon: 'Ô£à',
          title: t('widget.tasks_title'),
          count: 5,
          items: ['E-posta kontrol├╝', 'Rapor haz─▒rlama', 'Toplant─▒ haz─▒rl─▒─ş─▒'],
        };
      case 'calendar':
        return {
          icon: '­şôà',
          title: t('widget.calendar_title'),
          count: 2,
          items: ['09:00 - Proje toplant─▒s─▒', '14:00 - M├╝┼şteri g├Âr├╝┼şmesi'],
        };
      case 'flows':
        return {
          icon: '­şöä',
          title: t('widget.flows_title'),
          count: 1,
          items: ['Otomatik rapor olu┼şturma', 'E-posta takibi'],
        };
      default:
        return { icon: '­şôè', title: t('widget.dashboard_title'), count: 0, items: [] };
    }
  };

  const widgetData = getWidgetData();

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        padding: 8,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Card
        padding="$3"
        backgroundColor="$gray2"
        borderWidth={1}
        borderColor="$gray5"
        borderRadius="$6"
        pressStyle={{ scale: 0.98, backgroundColor: '$gray3' }}
        animation="bouncy"
      >
        <YStack gap="$3">
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

          <YStack gap="$2">
            {widgetData.items.map((item) => (
              <Text
                key={item}
                color="$gray11"
                fontSize="$2"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                ÔÇó {item}
              </Text>
            ))}
          </YStack>

          {/* Test Input - Widget should have independent keyboard handling */}
          <Input
            placeholder="Test: Widget input..."
            value={widgetInput}
            onChangeText={setWidgetInput}
            size="$3"
            borderWidth={1}
            borderColor="$gray5"
          />
        </YStack>
      </Card>
    </ScrollView>
  );
}


