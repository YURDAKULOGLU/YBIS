import type { ComponentType } from 'react';

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
