import React from 'react';
import { YStack, XStack, Text, Avatar, User } from '@ybis/ui';

/**
 * DrawerHeader Component
 *
 * User profile section at the top of drawer
 *
 * Features:
 * - Avatar (icon or image)
 * - User name and email
 * - Theme indicator badge
 * - Glassmorphism styling
 */

interface DrawerHeaderProps {
  userName?: string;
  userEmail?: string;
  currentTheme: string;
}

export function DrawerHeader({
  userName = 'User',
  userEmail = 'user@example.com',
  currentTheme,
}: DrawerHeaderProps): React.ReactElement {
  return (
    <YStack gap="$3" paddingBottom="$4">
      {/* Avatar */}
      <XStack gap="$3" alignItems="center">
        <Avatar circular size="$6" backgroundColor="$blue4">
          <Avatar.Fallback backgroundColor="$blue5" alignItems="center" justifyContent="center">
            <User size={28} color="$blue11" />
          </Avatar.Fallback>
        </Avatar>

        <YStack flex={1} gap="$1">
          {/* User Name */}
          <Text fontSize="$6" fontWeight="700" color="$color">
            {userName}
          </Text>

          {/* User Email */}
          <Text color="$gray11" fontSize="$3">
            {userEmail}
          </Text>
        </YStack>
      </XStack>

      {/* Theme Badge */}
      <XStack
        backgroundColor="$blue3"
        borderRadius="$10"
        paddingHorizontal="$3"
        paddingVertical="$2"
        alignSelf="flex-start"
      >
        <Text
          color="$blue11"
          fontSize="$2"
          fontWeight="600"
          textTransform="uppercase"
        >
          {currentTheme} MODE • DEMO
        </Text>
      </XStack>
    </YStack>
  );
}
