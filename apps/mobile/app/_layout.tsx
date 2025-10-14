import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { Theme, useThemeStore } from '@ybis/theme';
import config from '../tamagui.config';
import { useMockAuth } from '../src/stores/useMockAuth';

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
 * - useThemeStore: Persistent theme selection (zustand + AsyncStorage)
 * - No ThemePort: Internal logic, not vendor swap (AD-024)
 *
 * @note Using mock auth for UI testing (Story 1.1)
 *       Real auth will be implemented in Story 2.1 (Supabase Auth)
 */
export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  // Theme state (persistent)
  const { currentTheme } = useThemeStore();

  // Mock auth state (DEMO MODE)
  const { isAuthenticated, isLoading, checkAuth } = useMockAuth();

  // Check persisted auth on app start
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle auth-based navigation
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <TamaguiProvider config={config} defaultTheme={currentTheme}>
      <Theme>
        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </Theme>
    </TamaguiProvider>
  );
}
