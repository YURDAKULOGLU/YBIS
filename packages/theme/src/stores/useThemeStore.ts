import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Theme Store
 *
 * Build for Scale, Ship Minimal:
 * - Phase 0: light, dark (shipped)
 * - Phase 1+: custom themes (infrastructure ready)
 *
 * Multi-theme support without port (internal logic, not vendor swap):
 * - Adding new themes doesn't require code changes (just add to availableThemes)
 * - Tamagui handles theme rendering
 * - Store just manages current selection
 */

// Phase 0: Light + Dark only
// Phase 1+: Add custom1, custom2, etc. to this type
export type ThemeName = 'light' | 'dark';

export interface ThemeStore {
  /**
   * Current active theme
   * Default: 'light'
   */
  currentTheme: ThemeName;

  /**
   * Available themes in this phase
   * Phase 0: ['light', 'dark']
   * Phase 1+: ['light', 'dark', 'custom1', 'custom2', ...]
   */
  availableThemes: readonly ThemeName[];

  /**
   * Set current theme
   * @param theme - Theme name to activate
   */
  setTheme: (theme: ThemeName) => void;

  /**
   * Toggle between light and dark (convenience method)
   */
  toggleTheme: () => void;
}

/**
 * Zustand store with AsyncStorage persistence
 *
 * Why zustand (not ported):
 * - Already portable (works everywhere)
 * - Stable API
 * - No vendor lock-in
 * - Swap to Redux/Context is trivial if needed
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Default theme
      currentTheme: 'light',

      // Phase 0: Ship minimal (light + dark)
      availableThemes: ['light', 'dark'] as const,

      // Set theme
      setTheme: (theme: ThemeName) => {
        set({ currentTheme: theme });
      },

      // Toggle between light and dark
      toggleTheme: () => {
        const current = get().currentTheme;
        const newTheme = current === 'light' ? 'dark' : 'light';
        set({ currentTheme: newTheme });
      },
    }),
    {
      name: 'ybis-theme-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
