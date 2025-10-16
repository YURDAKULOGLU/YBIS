import React from 'react';
import { Link, Stack } from 'expo-router';
import { YStack, H1, Text, Button } from 'tamagui';

/**
 * 404 Not Found Screen
 * 
 * Displayed when user navigates to non-existent route
 */
export default function NotFoundScreen(): React.ReactElement {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Page Not Found' }} />
      <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
        <H1>404</H1>
        <Text textAlign="center" color="$gray11">
          This screen doesn't exist.
        </Text>
        <Link href="/(tabs)" asChild>
          <Button>Go to Home</Button>
        </Link>
      </YStack>
    </>
  );
}
