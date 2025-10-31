/**
 * Widget System Types
 *
 * Type definitions for the widget system.
 * Widgets are interactive tools that provide quick access to notes, tasks, calendar, and flows.
 *
 * @module features/widgets/types
 */

/**
 * Available widget types
 */
export type WidgetType = 'notes' | 'tasks' | 'calendar' | 'flows';

/**
 * Widget tab definition
 */
export interface WidgetTab {
  /** Unique identifier */
  key: WidgetType;
  /** Display label (i18n key) */
  label: string;
  /** Icon component */
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

/**
 * Widget data structure
 */
export interface WidgetData {
  /** Widget emoji icon */
  icon: string;
  /** Widget title (i18n key) */
  title: string;
  /** Total item count */
  count: number;
  /** List of items to display */
  items: WidgetItem[];
  /** Input placeholder text (i18n key) */
  placeholder: string;
}

/**
 * Individual widget item
 */
export interface WidgetItem {
  /** Unique identifier */
  id: string;
  /** Item text content */
  text: string;
  /** Optional metadata */
  metadata?: {
    /** Item creation date */
    createdAt?: Date;
    /** Item due date (tasks, calendar) */
    dueDate?: Date;
    /** Item completion status (tasks) */
    completed?: boolean;
    /** Item priority (tasks) */
    priority?: 'low' | 'medium' | 'high';
  };
}

/**
 * Widget action types
 */
export type WidgetAction =
  | { type: 'ADD_ITEM'; payload: { widgetType: WidgetType; text: string } }
  | { type: 'REMOVE_ITEM'; payload: { widgetType: WidgetType; itemId: string } }
  | { type: 'UPDATE_ITEM'; payload: { widgetType: WidgetType; itemId: string; text: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { widgetType: WidgetType; itemId: string } };

/**
 * Widget state management
 */
export interface WidgetState {
  /** Current active widget */
  activeWidget: WidgetType;
  /** Widget expand/collapse state */
  isExpanded: boolean;
  /** Widget data by type */
  data: Record<WidgetType, WidgetData>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
}
