import React from 'react';
import { YStack, H2, Text } from '@ybis/ui';

/**
 * Calendar Screen - Blank placeholder
 *
 * This screen is intentionally blank during refactoring.
 * Calendar functionality will be implemented using plugin architecture.
 */
export default function CalendarScreen(): React.ReactElement {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$4"
    >
      <H2>Calendar</H2>
      <Text color="$gray11" fontSize="$3" marginTop="$2" textAlign="center">
        Coming soon...
      </Text>
    </YStack>
  );
}
