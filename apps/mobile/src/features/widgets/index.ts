/**
 * Widget System Barrel Export
 *
 * Central export point for the widget system.
 * Provides clean imports for components, hooks, and types.
 *
 * @module features/widgets
 *
 * @example
 * ```tsx
 * import { WidgetContainer, useWidgetData, type WidgetType } from '@/features/widgets';
 * ```
 */

// Components
export { WidgetContainer } from './components/WidgetContainer';
export { WidgetHeader } from './components/WidgetHeader';
export { QuickAddInput } from './components/QuickAddInput';
export { WidgetItemsList } from './components/WidgetItemsList';

// Hooks
export { useWidgetData } from './hooks/useWidgetData';
export { useQuickAdd } from './hooks/useQuickAdd';

// Types
export type {
  WidgetType,
  WidgetTab,
  WidgetData,
  WidgetItem,
  WidgetAction,
  WidgetState,
} from './types';
