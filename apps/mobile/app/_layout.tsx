import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from '@ybis/ui';
import { Theme, useThemeStore } from '@ybis/theme';
import config from '../tamagui.config';
import { useMockAuth } from '../src/stores/useMockAuth';
import { I18nextProvider } from 'react-i18next';
import i18n from '@ybis/i18n';

/**
 * Root Layout Component
 *
 * Handles:
 * - Tamagui theme provider setup with dynamic theme switching
 * - Multi-theme support (Phase 0: light/dark, Phase 1+: custom themes)
 * - Mock authentication state checking (DEMO MODE)
 * - Navigation redirects based on auth state
 * - Status bar configuration
 *
 * Architecture:
 * - useThemeStore: Persistent theme selection (zustand + expo-secure-store)
 * - No ThemePort: Internal logic, not vendor swap (AD-024)
 * - Theme changes are reactive (useThemeStore triggers re-render)
 *
 * Performance:
 * - currentTheme from zustand triggers re-render on change
 * - TamaguiProvider defaultTheme updates with currentTheme
 * - Theme component propagates theme to all children
 *
 * @note Using mock auth for UI testing (Story 1.1)
 *       Real auth will be implemented in Story 2.1 (Supabase Auth)
 */
export default function RootLayout(): React.ReactElement {
  const segments = useSegments();
  const router = useRouter();

  // Theme state (persistent, reactive to changes)
  const { currentTheme } = useThemeStore();

  // Mock auth state (DEMO MODE)
  const { isAuthenticated, isLoading, checkAuth } = useMockAuth();

  // Check persisted auth on app start (DEMO MODE: instant)
  useEffect(() => {
    // In DEMO MODE, checkAuth is instant (no async delays)
    void checkAuth();
  }, [checkAuth]);

  // Update Android navigation bar based on theme
  // Note: SDK 54+ uses edge-to-edge by default, setBackgroundColorAsync is deprecated
  useEffect(() => {
    if (Platform.OS === 'android') {
      const updateNavigationBar = async (): Promise<void> => {
        try {
          // Set button style (light buttons on dark bg, dark buttons on light bg)
          await NavigationBar.setButtonStyleAsync(
            currentTheme === 'dark' ? 'light' : 'dark'
          );
          
          // For edge-to-edge mode, use visibility instead of background color
          // Navigation bar is transparent, content extends behind it
          await NavigationBar.setVisibilityAsync('visible');
        } catch (error) {
          console.warn('Failed to update navigation bar:', error);
        }
      };

      void updateNavigationBar();
    }
  }, [currentTheme]);

  // Handle auth-based navigation
  useEffect(() => {
    // DEMO MODE: Skip loading checks, navigate instantly
    // In production, keep: if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // DEMO MODE: Redirect to tabs immediately (already authenticated)
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={currentTheme}>
        <Theme>
          <StatusBar
            style={currentTheme === 'dark' ? 'light' : 'dark'}
            translucent
            backgroundColor="transparent"
          />
          <Slot />
        </Theme>
      </TamaguiProvider>
    </SafeAreaProvider>
  </I18nextProvider>
  );
}
