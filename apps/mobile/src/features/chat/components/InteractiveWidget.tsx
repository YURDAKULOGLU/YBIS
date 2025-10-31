import React, { useState } from 'react';
import { ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { YStack, XStack, Text, Card, Button, useTheme } from '@ybis/ui';
import { Plus } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import Logger from '@ybis/logging';
import type { TabType } from '../types';

interface InteractiveWidgetProps {
  selectedTab: TabType;
  height: number;
}

/**
 * InteractiveWidget - Widget with input capabilities
 * 
 * Key Features:
 * - Self-contained keyboard handling
 * - Does NOT affect chat scroll or input
 * - Quick add functionality for each widget type
 * - Scrollable content
 * 
 * Architecture Decision:
 * Widget has its own KeyboardAvoidingView to isolate keyboard behavior
 * from the main chat interface. This prevents jumpiness and ensures
 * smooth independent operation.
 */
export function InteractiveWidget({ selectedTab, height }: InteractiveWidgetProps): React.ReactElement {
  const { t } = useTranslation('mobile');
  const theme = useTheme();
  const [quickInput, setQuickInput] = useState('');

  const getWidgetData = (): { 
    icon: string; 
    title: string; 
    count: number; 
    items: string[];
    placeholder: string;
  } => {
    switch (selectedTab) {
      case 'notes':
        return {
          icon: '📝',
          title: t('widget.notes_title'),
          count: 3,
          items: ['Proje toplantısı notları', 'Haftalık rapor', 'Fikirler listesi'],
          placeholder: 'Hızlı not ekle...',
        };
      case 'tasks':
        return {
          icon: '✅',
          title: t('widget.tasks_title'),
          count: 5,
          items: ['E-posta kontrolü', 'Rapor hazırlama', 'Toplantı hazırlığı'],
          placeholder: 'Yeni görev ekle...',
        };
      case 'calendar':
        return {
          icon: '📅',
          title: t('widget.calendar_title'),
          count: 2,
          items: ['09:00 - Proje toplantısı', '14:00 - Müşteri görüşmesi'],
          placeholder: 'Etkinlik ekle...',
        };
      case 'flows':
        return {
          icon: '🔄',
          title: t('widget.flows_title'),
          count: 1,
          items: ['Otomatik rapor oluşturma', 'E-posta takibi'],
          placeholder: 'Yeni akış oluştur...',
        };
      default:
        return { 
          icon: '📊', 
          title: t('widget.dashboard_title'), 
          count: 0, 
          items: [],
          placeholder: 'Ekle...',
        };
    }
  };

  const widgetData = getWidgetData();

  const handleQuickAdd = async (): Promise<void> => {
    if (quickInput.trim()) {
      // Haptic feedback on add
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // TODO: Implement actual add logic via AI or direct API
      Logger.info('Quick add item', { 
        type: 'USER_ACTION', 
        tab: selectedTab, 
        content: quickInput 
      });
      
      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setQuickInput('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ height, flex: 1 }}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card
          padding="$3"
          backgroundColor="$gray2"
          borderWidth={1}
          borderColor="$gray5"
          borderRadius="$4"
        >
          <YStack gap="$3">
            {/* Header */}
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

            {/* Quick Add Input */}
            <XStack gap="$2" alignItems="center">
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: theme.background?.val,
                  borderColor: theme.gray5?.val,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 14,
                  color: theme.color?.val,
                }}
                placeholder={widgetData.placeholder}
                placeholderTextColor={theme.gray10?.val}
                value={quickInput}
                onChangeText={setQuickInput}
                onSubmitEditing={() => {
                  void handleQuickAdd();
                }}
                returnKeyType="done"
              />
              <Button
                size="$3"
                circular
                icon={Plus}
                backgroundColor="$blue9"
                borderWidth={0}
                pressStyle={{ scale: 0.92, backgroundColor: '$blue10' }}
                animation="bouncy"
                onPress={() => {
                  void handleQuickAdd();
                }}
                disabled={!quickInput.trim()}
                opacity={quickInput.trim() ? 1 : 0.5}
              />
            </XStack>

            {/* Items List */}
            <YStack gap="$2">
              {widgetData.items.map((item) => (
                <Card
                  key={item}
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
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    • {item}
                  </Text>
                </Card>
              ))}
              {widgetData.items.length > 2 && (
                <Text color="$blue9" fontSize="$2" textAlign="center">
                  {t('widget.more_items', { count: widgetData.items.length - 2 })}
                </Text>
              )}
            </YStack>
          </YStack>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
