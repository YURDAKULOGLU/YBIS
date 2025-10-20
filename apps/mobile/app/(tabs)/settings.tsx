import React, { useState } from 'react';
import { YStack, H2, H3, Text, Card, Button, Switch, XStack, Separator } from '@ybis/ui';
import { LogOut, Moon, Globe } from '@tamagui/lucide-icons';
import { useMockAuth } from '../../src/stores/useMockAuth';
import { useThemeStore } from '@ybis/theme';

/**
 * Settings Screen
 *
 * Features:
 * - Theme toggle (light/dark) with zustand persistence
 * - Language selector (placeholder for i18n integration)
 * - Logout button (functional - clears mock auth)
 * - App info display
 *
 * Architecture:
 * - useThemeStore: Multi-theme support (Phase 0: light/dark, Phase 1+: custom themes)
 * - No ThemePort: Internal logic, not vendor swap (criteria-based porting - AD-024)
 */
export default function SettingsScreen(): React.ReactElement {
  const { user, logout } = useMockAuth();
  const { currentTheme, toggleTheme } = useThemeStore();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleThemeToggle = (): void => {
    toggleTheme();
    // console.log('Theme toggled to:', currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (): void => {
    // TODO: Connect to @ybis/i18n
    const newLang = selectedLanguage === 'en' ? 'tr' : 'en';
    setSelectedLanguage(newLang);
    // console.log('Language changed to:', newLang);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      // Navigation handled by root layout (redirects to login)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
      <H2>Settings</H2>

      {/* User Info Section */}
      <Card padding="$4" bordered backgroundColor="$blue2">
        <YStack gap="$2">
          <Text fontWeight="600" fontSize="$5" color="$blue11">
            {user?.name ?? 'User'}
          </Text>
          <Text color="$blue11" fontSize="$3">
            {user?.email ?? 'user@example.com'}
          </Text>
          <Text color="$blue10" fontSize="$2" marginTop="$1">
            DEMO MODE ACTIVE
          </Text>
        </YStack>
      </Card>

      {/* Appearance Section */}
      <Card padding="$4" bordered>
        <YStack gap="$3">
          <XStack gap="$2" alignItems="center">
            <Moon size={20} />
            <H3>Appearance</H3>
          </XStack>
          <Separator />
          <XStack alignItems="center" justifyContent="space-between">
            <Text>Dark Mode</Text>
            <Switch checked={currentTheme === 'dark'} onCheckedChange={handleThemeToggle}>
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
          <Text fontSize="$2" color="$gray10">
            Theme: {currentTheme} (Phase 0: light/dark, Phase 1+: custom themes)
          </Text>
        </YStack>
      </Card>

      {/* Language Section */}
      <Card padding="$4" bordered>
        <YStack gap="$3">
          <XStack gap="$2" alignItems="center">
            <Globe size={20} />
            <H3>Language</H3>
          </XStack>
          <Separator />
          <XStack alignItems="center" justifyContent="space-between">
            <Text>Current: {selectedLanguage === 'en' ? 'English' : 'Türkçe'}</Text>
            <Button size="$3" onPress={handleLanguageChange} disabled opacity={0.6}>
              Switch to {selectedLanguage === 'en' ? 'TR' : 'EN'}
            </Button>
          </XStack>
          <Text fontSize="$2" color="$gray10">
            Will connect to @ybis/i18n (i18next + react-i18next)
          </Text>
        </YStack>
      </Card>

      {/* Account Section */}
      <Card padding="$4" bordered>
        <YStack gap="$3">
          <XStack gap="$2" alignItems="center">
            <LogOut size={20} />
            <H3>Account</H3>
          </XStack>
          <Separator />
          <Button theme="red" size="$4" onPress={() => { void handleLogout(); }} icon={LogOut}>
            Exit Demo Mode (Logout)
          </Button>
          <Text fontSize="$2" color="$gray10">
            This will clear demo session and return to login
          </Text>
        </YStack>
      </Card>

      {/* App Info */}
      <Card padding="$4" bordered marginTop="auto">
        <YStack gap="$2">
          <Text fontWeight="600">YBIS Mobile</Text>
          <Text color="$gray11">Version 0.1.0 (Demo)</Text>
          <Text color="$gray11">Expo SDK 54 + React 19.1</Text>
          <Text color="$gray11">React Native 0.81.4</Text>
        </YStack>
      </Card>
    </YStack>
  );
}
