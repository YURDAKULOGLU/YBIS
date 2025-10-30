import React, { useState } from 'react';
import { YStack, XStack, H1, H3, Text, Button, Input, Spinner } from '@ybis/ui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/useAuth';
import { Alert } from 'react-native';

/**
 * Sign Up Screen - Supabase Auth
 *
 * Closed Beta: Email/Password registration
 *
 * Features:
 * - Email/Password sign up
 * - Email validation
 * - Password strength check (basic)
 * - Link to login
 */
export default function SignUpScreen(): React.ReactElement {
  const router = useRouter();
  const { signUpWithEmail, loading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): string | null => {
    if (!email || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    // Password length check
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    // Password match check
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSignUp = async (): Promise<void> => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await signUpWithEmail({ email, password });
      
      Alert.alert(
        'Success!',
        'Your account has been created. You can now sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        'Sign Up Failed',
        err instanceof Error ? err.message : 'Please try again'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = (): void => {
    router.back();
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
          Create Your Account
        </Text>
      </YStack>

      {/* Sign Up Form */}
      <YStack gap="$4" width="100%" maxWidth={320}>
        <H3 color="$color" textAlign="center">Sign Up</H3>

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
          placeholder="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          size="$5"
        />

        {/* Confirm Password Input */}
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          size="$5"
        />

        {/* Sign Up Button */}
        <Button
          size="$5"
          theme="green"
          onPress={() => { void handleSignUp(); }}
          disabled={isSubmitting || loading}
          icon={isSubmitting || loading ? <Spinner /> : undefined}
        >
          {isSubmitting || loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        {/* Sign In Link */}
        <XStack justifyContent="center" gap="$2" marginTop="$4">
          <Text color="$gray11" fontSize="$3">
            Already have an account?
          </Text>
          <Text
            color="$green10"
            fontSize="$3"
            fontWeight="bold"
            onPress={navigateToLogin}
            cursor="pointer"
          >
            Sign In
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
          By signing up, you agree to our Terms of Service
        </Text>
        <Text color="$gray10" fontSize="$2" textAlign="center">
          Closed Beta • Supabase Auth
        </Text>
      </YStack>
    </YStack>
  );
}
