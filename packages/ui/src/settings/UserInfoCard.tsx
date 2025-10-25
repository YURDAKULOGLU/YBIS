import React from 'react';
import { YStack, Text } from 'tamagui';

interface UserInfoCardProps {
  user: { name?: string; email?: string } | null;
}

export function UserInfoCard({ user }: UserInfoCardProps): React.ReactElement {
  return (
    <YStack gap="$2" backgroundColor="$blue2" padding="$4" borderRadius="$6">
      <Text fontWeight="600" fontSize="$6" color="$blue11">
        {user?.name ?? 'Demo User'}
      </Text>
      <Text color="$blue11" fontSize="$4">
        {user?.email ?? 'demo@ybis.ai'}
      </Text>
    </YStack>
  );
}
