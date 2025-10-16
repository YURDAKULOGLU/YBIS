import React from 'react';
import { YStack, H2, Text } from 'tamagui';

/**
 * Chat Screen - Blank placeholder
 *
 * This screen is intentionally blank during refactoring.
 * Chat functionality will be reimplemented using plugin architecture.
 */
export default function ChatScreen(): React.ReactElement {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$4"
    >
      <H2>Chat</H2>
      <Text color="$gray11" fontSize="$3" marginTop="$2" textAlign="center">
        Coming soon...
      </Text>
    </YStack>
  );
}
