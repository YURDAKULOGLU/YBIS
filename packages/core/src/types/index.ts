/**
 * Shared domain types for orchestration-aware clients.
 *
 * These types intentionally avoid concrete provider implementations and are
 * used across ports to keep adapters swappable.
 */

/**
 * Identifies the upstream system that owns a resource (e.g. Google Calendar,
 * Todoist). Custom integrations can provide their own string identifiers.
 */
export type ProviderSource =
  | 'google_workspace'
  | 'microsoft_365'
  | 'notion'
  | 'todoist'
  | 'ybis_internal'
  | string;

/**
 * Lightweight calendar event summary consumed by widget surfaces and chat
 * prompts. Timestamps are ISO-8601 strings in UTC.
 */
export interface CalendarEventSummary {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  provider: ProviderSource;
  location?: string;
  meetingUrl?: string;
  attendees?: number;
}

/** Task state values shared between mobile and backend orchestrators. */
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

/**
 * Minimal task representation for actionable lists.
 */
export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  provider: ProviderSource;
  dueAt?: string;
  projectName?: string;
}

/**
 * Compact note summary for quick previews.
 */
export interface NoteSummary {
  id: string;
  title: string;
  provider: ProviderSource;
  updatedAt: string;
  excerpt?: string;
}

/** Workflow lifecycle state. */
export type WorkflowStatus = 'draft' | 'active' | 'paused';

/**
 * Automation/flow definition summary.
 */
export interface WorkflowDefinitionSummary {
  id: string;
  name: string;
  status: WorkflowStatus;
  provider: ProviderSource;
  lastRunAt?: string;
  nextRunAt?: string;
  triggerDescription?: string;
}

/**
 * Standard command payload produced by widgets or quick actions.
 */
export interface WidgetCommandPayload {
  prompt: string;
  context?: Record<string, unknown>;
}
