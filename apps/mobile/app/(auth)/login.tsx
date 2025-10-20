import React, { useState } from 'react';
import { YStack, H1, Text, Button, Spinner } from '@ybis/ui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMockAuth } from '../../src/stores/useMockAuth';

/**
 * Login Screen
 *
 * DEMO MODE: Bypass authentication for UI testing
 * Real Google OAuth will be implemented in Story 2.1 (Supabase Auth)
 *
 * Features:
 * - Demo login button (instant access)
 * - Google OAuth button (placeholder, coming in Story 2.1)
 */
export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const { loginDemo } = useMockAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await loginDemo();
      // Manual navigation (state may already be authenticated)
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = (): void => {
    // TODO: Implement Google OAuth in Story 2.1
    // Will use expo-auth-session + expo-web-browser + Supabase Auth
    // console.log('Google Sign In clicked - Implementation pending (Story 2.1)');
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$6"
      padding="$4"
      backgroundColor="$background"
    >
      <StatusBar style="auto" />

      {/* App Logo/Title */}
      <YStack alignItems="center" gap="$2">
        <H1 color="$color">YBIS</H1>
        <Text color="$gray11" fontSize="$4">
          Your Business Intelligence System
        </Text>
      </YStack>

      {/* Demo Mode Button (UI Testing) */}
      <YStack gap="$3" width={280}>
        <Button
          size="$5"
          theme="green"
          onPress={() => { void handleDemoLogin(); }}
          disabled={isLoading}
          icon={isLoading ? <Spinner /> : undefined}
        >
          {isLoading ? 'Loading...' : 'Enter Demo Mode'}
        </Button>

        {/* Google Sign In Button (Coming Soon) */}
        <Button
          size="$5"
          theme="blue"
          onPress={handleGoogleSignIn}
          disabled
          opacity={0.5}
        >
          Sign in with Google
        </Button>
      </YStack>

      {/* Info Text */}
      <YStack alignItems="center" gap="$2" marginTop="$8">
        <Text color="$green10" fontSize="$3" fontWeight="bold">
          DEMO MODE ACTIVE
        </Text>
        <Text color="$gray10" fontSize="$2" textAlign="center">
          Use "Enter Demo Mode" to explore the app
        </Text>
        <Text color="$gray10" fontSize="$2" textAlign="center">
          Real authentication coming in Story 2.1
        </Text>
      </YStack>
    </YStack>
  );
}
