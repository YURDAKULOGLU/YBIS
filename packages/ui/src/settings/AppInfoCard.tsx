import React from 'react';
import { YStack, Text } from 'tamagui';

export function AppInfoCard(): React.ReactElement {
  return (
    <YStack gap="$2" marginTop="$4" paddingBottom="$4">
      <Text textAlign='center' fontSize="$2" color="$gray10">YBIS Mobile v0.1.0 (Demo)</Text>
      <Text textAlign='center' fontSize="$2" color="$gray10">Expo SDK 54 - React 19.1</Text>
    </YStack>
  );
}
