import React, { useMemo } from 'react';
import { YStack, XStack, Text, Card, Button, Spinner, RefreshCcw } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import type { ProviderSource } from '@ybis/core';
import type { TabType, WidgetListItem, WidgetCommandPayload } from '../types';
import type { WidgetSnapshot } from '../../../services/orchestration/widgetSnapshotService';

interface WidgetProps {
  selectedTab: TabType;
  snapshot: WidgetSnapshot | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSelectCommand: (command: WidgetCommandPayload) => void;
}

function formatProviderLabel(provider: ProviderSource, t: (key: string) => string): string {
  switch (provider) {
    case 'google_workspace':
      return 'Google Workspace';
    case 'microsoft_365':
      return 'Microsoft 365';
    case 'notion':
      return 'Notion';
    case 'todoist':
      return 'Todoist';
    case 'ybis_internal':
      return t('widget.provider_ybis_internal');
    default:
      return provider;
  }
}

function formatDateRange(startAt?: string, endAt?: string): string | undefined {
  if (!startAt) return undefined;
  try {
    const start = new Date(startAt);
    const end = endAt ? new Date(endAt) : undefined;
    const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
    const timeFormatter = new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (end && start.toDateString() === end.toDateString()) {
      return `${dateFormatter.format(start)} • ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
    }

    if (end) {
      return `${dateFormatter.format(start)} • ${timeFormatter.format(start)} → ${dateFormatter.format(end)} ${timeFormatter.format(end)}`;
    }

    return `${dateFormatter.format(start)} • ${timeFormatter.format(start)}`;
  } catch {
    return undefined;
  }
}

function formatDueDate(dueAt?: string): string | undefined {
  if (!dueAt) return undefined;
  try {
    const due = new Date(dueAt);
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    const daysDiff = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 0) {
      return `Geçti • ${dateFormatter.format(due)}`;
    }
    if (daysDiff === 0) {
      return `Bugün • ${dateFormatter.format(due)}`;
    }
    if (daysDiff === 1) {
      return `Yarın • ${dateFormatter.format(due)}`;
    }
    return `${dateFormatter.format(due)}`;
  } catch {
    return undefined;
  }
}

function mapSnapshotToItems(
  selectedTab: TabType,
  snapshot: WidgetSnapshot | null,
  t: (key: string, options?: Record<string, unknown>) => string
): WidgetListItem[] {
  if (!snapshot) return [];

  switch (selectedTab) {
    case 'notes':
      return snapshot.notes.map((note) => ({
        id: note.id,
        title: note.title,
        subtitle: note.excerpt,
        providerLabel: formatProviderLabel(note.provider, t),
        command: {
          prompt: t('widget.prompts.open_note', { title: note.title }),
          context: { noteId: note.id, provider: note.provider },
        },
      }));
    case 'tasks':
      return snapshot.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        subtitle: formatDueDate(task.dueAt) ?? t(`widget.status.${task.status}`),
        providerLabel: formatProviderLabel(task.provider, t),
        accent: task.status === 'pending' ? 'warning' : task.status === 'completed' ? 'success' : 'info',
        command: {
          prompt: t('widget.prompts.review_task', { title: task.title }),
          context: { taskId: task.id, provider: task.provider },
        },
      }));
    case 'calendar':
      return snapshot.events.map((event) => ({
        id: event.id,
        title: event.title,
        subtitle: formatDateRange(event.startAt, event.endAt),
        providerLabel: formatProviderLabel(event.provider, t),
        command: {
          prompt: t('widget.prompts.calendar_event', { title: event.title }),
          context: { eventId: event.id, provider: event.provider },
        },
      }));
    case 'flows':
      return snapshot.workflows.map((flow) => ({
        id: flow.id,
        title: flow.name,
        subtitle: flow.triggerDescription,
        providerLabel: formatProviderLabel(flow.provider, t),
        accent: flow.status === 'active' ? 'success' : flow.status === 'paused' ? 'warning' : 'info',
        command: {
          prompt: t('widget.prompts.run_workflow', { title: flow.name }),
          context: { workflowId: flow.id, provider: flow.provider },
        },
      }));
    default:
      return [];
  }
}

export function Widget({
  selectedTab,
  snapshot,
  isLoading,
  error,
  onRefresh,
  onSelectCommand,
}: WidgetProps): React.ReactElement {
  const { t } = useTranslation('mobile');

  const items = useMemo(() => mapSnapshotToItems(selectedTab, snapshot, t), [selectedTab, snapshot, t]);
  const metadata = snapshot?.metadata;
  const emptyStateMessage = useMemo(() => {
    if (error) {
      return error;
    }
    if (metadata?.source === 'unconfigured') {
      return metadata.message ?? t('widget.empty_unconfigured');
    }
    return t('widget.empty_default');
  }, [error, metadata, t]);

  if (isLoading && !items.length) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="$4" />
        <Text marginTop="$3" color="$gray11">
          {t('widget.loading')}
        </Text>
      </YStack>
    );
  }

  if (!items.length) {
    return (
      <Card
        padding="$4"
        backgroundColor="$gray2"
        borderWidth={1}
        borderColor="$gray5"
        borderRadius="$6"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Text fontSize="$4" fontWeight="600" textAlign="center">
          {emptyStateMessage}
        </Text>
        <Button
          size="$3"
          icon={RefreshCcw}
          backgroundColor="$blue9"
          color="white"
          pressStyle={{ scale: 0.96, backgroundColor: '$blue10' }}
          animation="bouncy"
          onPress={onRefresh}
          disabled={isLoading}
        >
          {t('widget.refresh')}
        </Button>
      </Card>
    );
  }

  return (
    <YStack gap="$3">
      {metadata?.message && (
        <Card
          padding="$2"
          backgroundColor="$yellow3"
          borderWidth={1}
          borderColor="$yellow6"
          borderRadius="$4"
        >
          <Text fontSize="$2" color="$yellow11">
            {metadata.message}
          </Text>
        </Card>
      )}
      {items.slice(0, 3).map((item) => (
        <Card
          key={item.id}
          padding="$3"
          backgroundColor="$gray2"
          borderWidth={1}
          borderColor="$gray5"
          borderRadius="$6"
          pressStyle={{ scale: 0.97, backgroundColor: '$gray3' }}
          animation="bouncy"
          onPress={() => onSelectCommand(item.command)}
        >
          <YStack gap="$2">
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize="$3" fontWeight="600" color="$color">
                {item.title}
              </Text>
              {item.providerLabel && (
                <Text fontSize="$1" color="$gray11">
                  {item.providerLabel}
                </Text>
              )}
            </XStack>
            {item.subtitle && (
              <Text fontSize="$2" color="$gray11">
                {item.subtitle}
              </Text>
            )}
            {item.accent && (
              <Text
                fontSize="$2"
                color={item.accent === 'warning' ? '$yellow11' : item.accent === 'success' ? '$green11' : '$blue11'}
              >
                {item.accent === 'warning'
                  ? t('widget.badge_attention')
                  : item.accent === 'success'
                    ? t('widget.badge_ready')
                    : t('widget.badge_info')}
              </Text>
            )}
          </YStack>
        </Card>
      ))}
      {items.length > 3 && (
        <Text fontSize="$2" color="$gray11" textAlign="center">
          {t('widget.more_items', { count: items.length - 3 })}
        </Text>
      )}
    </YStack>
  );
}
