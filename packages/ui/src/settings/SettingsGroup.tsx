import React from 'react';
import { XStack, YStack, Text } from 'tamagui';

// Icon type from lucide-icons
type IconProps = {
  size?: number;
  color?: string;
};

interface SettingsGroupProps {
  icon: React.FC<IconProps>;
  title: string;
  children: React.ReactNode;
}

export function SettingsGroup({ icon: Icon, title, children }: SettingsGroupProps): React.ReactElement {
  return (
    <YStack gap="$2" backgroundColor="$background" padding="$4" borderRadius="$6" borderWidth={1} borderColor="$gray5">
      <XStack gap="$3" alignItems="center" marginBottom="$2">
        <Icon size={22} color="$gray11"/>
        <Text fontSize="$5" fontWeight="600" color="$color">{title}</Text>
      </XStack>
      {children}
    </YStack>
  );
}
