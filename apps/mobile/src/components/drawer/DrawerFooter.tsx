import React from 'react';
import { YStack, Text, Button, Separator } from '@ybis/ui';
import { LogOut } from '@tamagui/lucide-icons';

/**
 * DrawerFooter Component
 *
 * Bottom section of drawer with logout and app info
 *
 * Features:
 * - Logout button
 * - App version info
 * - Tech stack info
 * - Compact layout
 */

interface DrawerFooterProps {
  onLogout: () => void | Promise<void>;
}

export function DrawerFooter({ onLogout }: DrawerFooterProps): React.ReactElement {
  return (
    <YStack gap="$3" paddingTop="$2">
      <Separator />

      {/* Logout Button */}
      <Button
        theme="red"
        size="$3"
        icon={LogOut}
        onPress={() => { void onLogout(); }}
        backgroundColor="$red3"
        color="$red11"
        borderWidth={0}
        pressStyle={{
          scale: 0.96,
          backgroundColor: '$red4',
        }}
        animation="quick"
        fontWeight="600"
      >
        Exit Demo Mode
      </Button>

      {/* App Info - Compact */}
      <YStack gap="$1">
        <Text color="$gray10" fontSize="$2" fontWeight="500">
          YBIS Mobile v0.1.0
        </Text>
        <Text color="$gray10" fontSize="$1">
          Expo SDK 54 • RN 0.81
        </Text>
      </YStack>
    </YStack>
  );
}
