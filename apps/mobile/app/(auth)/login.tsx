import React, { useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { YStack, XStack, H1, H3, Text, Button, Input, Spinner } from '@ybis/ui';
import { useAuth } from '../../src/contexts/useAuth';
import { useMockAuth } from '../../src/stores/useMockAuth';

/**
 * Login Screen - Hybrid (Supabase Auth + Demo Mode)
 *
 * - Email/Password sign in (Supabase)
 * - Google OAuth placeholder (Story 4.1)
 * - Demo Mode (UI exploration)
 *
 * Note: Supabase credentials must be configured in `app.config.ts` for real login.
 */
export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const {
    signInWithEmail,
    signInWithGoogle,
    loading,
    error,
    clearError,
  } = useAuth();
  const { loginDemo } = useMockAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  const handleDemoLogin = async (): Promise<void> => {
    setDemoError(null);
    setIsDemoLoading(true);
    try {
      await loginDemo();
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Demo login failed:', err);
      setDemoError('Demo Mode login failed. Please try again.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleEmailLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    setIsAuthSubmitting(true);
    clearError();

    try {
      await signInWithEmail({ email, password });
      router.replace('/(tabs)');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Please check your credentials and try again.';
      Alert.alert('Sign In Failed', message);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in is not yet available:', err);
      Alert.alert('Google Sign-In', 'Google OAuth integration will be available soon.');
    }
  };

  const navigateToSignup = (): void => {
    router.push('/(auth)/signup' as const);
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
          Welcome Back
        </Text>
      </YStack>

      {/* Email / Password Form */}
      <YStack gap="$4" width="100%" maxWidth={320}>
        <H3 color="$color" textAlign="center">
          Sign In
        </H3>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (error) clearError();
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          size="$5"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error) clearError();
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          size="$5"
        />

        <Button
          size="$5"
          theme="green"
          onPress={() => {
            void handleEmailLogin();
          }}
          disabled={isAuthSubmitting || loading}
          icon={isAuthSubmitting || loading ? <Spinner /> : undefined}
        >
          {isAuthSubmitting || loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Button
          size="$5"
          theme="blue"
          onPress={() => {
            void handleGoogleSignIn();
          }}
          disabled={loading}
          opacity={0.5} // TODO: remove opacity when Google OAuth is ready
        >
          Sign in with Google (Coming Soon)
        </Button>

        <XStack justifyContent="center" gap="$2" marginTop="$2">
          <Text color="$gray11" fontSize="$3">
            Don&apos;t have an account?
          </Text>
          <Text
            color="$green10"
            fontSize="$3"
            fontWeight="bold"
            onPress={navigateToSignup}
            cursor="pointer"
          >
            Sign Up
          </Text>
        </XStack>
      </YStack>

      {/* Demo Mode Section */}
      <YStack gap="$3" width="100%" maxWidth={320} marginTop="$6">
        <H3 color="$color" textAlign="center">
          Quick Access (Demo Mode)
        </H3>
        <Button
          size="$5"
          theme="green"
          onPress={() => {
            void handleDemoLogin();
          }}
          disabled={isDemoLoading}
          icon={isDemoLoading ? <Spinner /> : undefined}
        >
          {isDemoLoading ? 'Loading Demo...' : 'Enter Demo Mode'}
        </Button>
      </YStack>

      {/* Error Messages */}
      {Boolean(error ?? demoError) && (
        <YStack
          backgroundColor="$red4"
          padding="$3"
          borderRadius="$4"
          width="100%"
          maxWidth={320}
          marginTop="$4"
          gap="$2"
        >
          {error && (
            <Text color="$red11" fontSize="$2" textAlign="center">
              {error}
            </Text>
          )}
          {demoError && (
            <Text color="$red11" fontSize="$2" textAlign="center">
              {demoError}
            </Text>
          )}
        </YStack>
      )}

      {/* Info Text */}
      <YStack alignItems="center" gap="$2" marginTop="$6">
        <Text color="$gray10" fontSize="$2" textAlign="center">
          Closed Beta • Supabase Auth & Demo Mode
        </Text>
      </YStack>
    </YStack>
  );
}
