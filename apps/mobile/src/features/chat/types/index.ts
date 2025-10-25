import type { ComponentType } from 'react';
import type {
  CalendarEventSummary,
  NoteSummary,
  TaskSummary,
  WorkflowDefinitionSummary,
  WidgetCommandPayload,
} from '@ybis/core';

export type TabType = 'notes' | 'tasks' | 'calendar' | 'flows';

export interface Tab {
  key: TabType;
  label: string;
  icon: ComponentType<{ size: number; color?: string }>;
}

export interface SuggestionPrompt {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WidgetSnapshotView {
  notes: NoteSummary[];
  tasks: TaskSummary[];
  calendar: CalendarEventSummary[];
  flows: WorkflowDefinitionSummary[];
}

export interface WidgetListItem {
  id: string;
  title: string;
  subtitle?: string;
  providerLabel?: string;
  accent?: 'info' | 'success' | 'warning';
  command: WidgetCommandPayload;
}

export type { WidgetCommandPayload } from '@ybis/core';
