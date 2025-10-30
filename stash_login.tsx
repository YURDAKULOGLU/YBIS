import React, { useState } from 'react';
import { YStack, XStack, H1, H3, Text, Button, Input, Spinner } from '@ybis/ui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/useAuth';
import { Alert } from 'react-native';

/**
 * Login Screen - Supabase Auth
 *
 * Closed Beta: Email/Password + Google OAuth
 *
 * Features:
 * - Email/Password sign in
 * - Google OAuth (optional)
 * - Link to signup
 */
export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, loading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await signInWithEmail({ email, password });
      // Auth state change will handle navigation
    } catch (err) {
      Alert.alert(
        'Login Failed',
        err instanceof Error ? err.message : 'Please check your credentials'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (err) {
      Alert.alert(
        'Google Sign In',
        'Google OAuth will be available soon'
      );
    }
  };

  const navigateToSignup = (): void => {
    router.push('/(auth)/signup');
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

      {/* Login Form */}
      <YStack gap="$4" width="100%" maxWidth={320}>
        <H3 color="$color" textAlign="center">Sign In</H3>

        {/* Email Input */}
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          size="$5"
        />

        {/* Password Input */}
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          size="$5"
        />

        {/* Sign In Button */}
        <Button
          size="$5"
          theme="green"
          onPress={() => { void handleEmailLogin(); }}
          disabled={isSubmitting || loading}
          icon={isSubmitting || loading ? <Spinner /> : undefined}
        >
          {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <XStack alignItems="center" gap="$3" marginVertical="$2">
          <YStack flex={1} height={1} backgroundColor="$gray6" />
          <Text color="$gray10" fontSize="$2">OR</Text>
          <YStack flex={1} height={1} backgroundColor="$gray6" />
        </XStack>

        {/* Google Sign In Button */}
        <Button
          size="$5"
          theme="blue"
          onPress={() => { void handleGoogleSignIn(); }}
          disabled
          opacity={0.5}
        >
          Sign in with Google (Coming Soon)
        </Button>

        {/* Sign Up Link */}
        <XStack justifyContent="center" gap="$2" marginTop="$4">
          <Text color="$gray11" fontSize="$3">
            Don't have an account?
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

      {/* Error Display */}
      {error && (
        <YStack
          backgroundColor="$red4"
          padding="$3"
          borderRadius="$4"
          width="100%"
          maxWidth={320}
        >
          <Text color="$red11" fontSize="$2" textAlign="center">
            {error}
          </Text>
        </YStack>
      )}

      {/* Info Text */}
      <YStack alignItems="center" gap="$2" marginTop="$4">
        <Text color="$gray10" fontSize="$2" textAlign="center">
          Closed Beta ÔÇó Supabase Auth
        </Text>
      </YStack>
    </YStack>
  );
}
