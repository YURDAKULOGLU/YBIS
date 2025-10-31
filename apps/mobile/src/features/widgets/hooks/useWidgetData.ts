/**
 * useWidgetData Hook
 *
 * Centralized widget data management.
 * Provides widget-specific data, item counts, and metadata.
 *
 * @module features/widgets/hooks/useWidgetData
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WidgetType, WidgetData } from '../types';

/**
 * Mock data generator (will be replaced with real API calls)
 */
const getMockWidgetItems = (type: WidgetType): Array<{ id: string; text: string }> => {
  switch (type) {
    case 'notes':
      return [
        { id: '1', text: 'Proje toplantısı notları' },
        { id: '2', text: 'Haftalık rapor taslağı' },
        { id: '3', text: 'Fikirler ve öneri listesi' },
      ];
    case 'tasks':
      return [
        { id: '1', text: 'E-posta kontrolü ve yanıtlama' },
        { id: '2', text: 'Haftalık rapor hazırlama' },
        { id: '3', text: 'Toplantı hazırlığı yapma' },
        { id: '4', text: 'Proje dokümanlarını güncelleme' },
        { id: '5', text: 'Kod review yapma' },
      ];
    case 'calendar':
      return [
        { id: '1', text: '09:00 - Proje toplantısı' },
        { id: '2', text: '14:00 - Müşteri görüşmesi' },
      ];
    case 'flows':
      return [
        { id: '1', text: 'Otomatik rapor oluşturma akışı' },
        { id: '2', text: 'E-posta takip sistemi' },
      ];
    default:
      return [];
  }
};

/**
 * Get widget-specific icon
 */
const getWidgetIcon = (type: WidgetType): string => {
  const icons: Record<WidgetType, string> = {
    notes: '📝',
    tasks: '✅',
    calendar: '📅',
    flows: '🔄',
  };
  return icons[type];
};

/**
 * Get widget-specific placeholder
 */
const getWidgetPlaceholder = (type: WidgetType): string => {
  const placeholders: Record<WidgetType, string> = {
    notes: 'widget.notes_placeholder',
    tasks: 'widget.tasks_placeholder',
    calendar: 'widget.calendar_placeholder',
    flows: 'widget.flows_placeholder',
  };
  return placeholders[type];
};

/**
 * Hook to get widget data
 *
 * @param widgetType - Type of widget
 * @returns Widget data including items, count, and metadata
 *
 * @example
 * ```tsx
 * const widgetData = useWidgetData('notes');
 * console.log(widgetData.count); // 3
 * console.log(widgetData.items); // [...]
 * ```
 */
export const useWidgetData = (widgetType: WidgetType): WidgetData => {
  const { t } = useTranslation('mobile');

  const widgetData = useMemo<WidgetData>(() => {
    const mockItems = getMockWidgetItems(widgetType);

    return {
      icon: getWidgetIcon(widgetType),
      title: t(`widget.${widgetType}_title`),
      count: mockItems.length,
      items: mockItems.map(item => ({
        id: item.id,
        text: item.text,
        metadata: {
          createdAt: new Date(),
        },
      })),
      placeholder: t(getWidgetPlaceholder(widgetType)),
    };
  }, [widgetType, t]);

  return widgetData;
};
