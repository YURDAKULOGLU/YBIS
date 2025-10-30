/**
 * YBIS Theme Registry
 *
 * Modular theme system - i18n pattern for themes
 * Add new themes by creating a new .theme.ts file and importing here
 */

import { darkTheme } from './dark.theme';
import { lightTheme } from './light.theme';
import { oceanTheme } from './ocean.theme';

export const themes = {
  dark: darkTheme,
  light: lightTheme,
  ocean: oceanTheme,
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeTokens = typeof darkTheme;

// Theme metadata for UI
export const themeMetadata: Record<ThemeName, { label: string; description: string; icon: string }> = {
  dark: {
    label: 'Dark',
    description: 'Classic dark theme',
    icon: '🌙',
  },
  light: {
    label: 'Light',
    description: 'Clean light theme',
    icon: '☀️',
  },
  ocean: {
    label: 'Ocean',
    description: 'Deep blue underwater vibes',
    icon: '🌊',
  },
};
