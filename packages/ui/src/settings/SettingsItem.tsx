import React from 'react';
import { XStack, Text, Switch } from 'tamagui';
import type { SwitchProps } from 'tamagui';

// Icon type from lucide-icons
type IconProps = {
  size?: number;
  color?: string;
};

interface SettingsItemProps {
  icon?: React.FC<IconProps>;
  label: string;
  value?: string;
  type?: 'navigation' | 'switch';
  onPress?: () => void;
  switchProps?: SwitchProps;
  color?: string;
  disabled?: boolean;
}

export function SettingsItem({
  icon: Icon,
  label,
  value,
  type = 'navigation',
  onPress,
  switchProps,
  color,
  disabled = false,
}: SettingsItemProps): React.ReactElement {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical="$3"
      onPress={disabled ? undefined : onPress}
      pressStyle={!disabled && onPress ? { backgroundColor: '$gray3' } : {}}
      borderRadius="$4"
      paddingHorizontal={onPress ? "$2" : "$0"}
      marginHorizontal={onPress ? "-$2" : "$0"}
      opacity={disabled ? 0.5 : 1}
    >
      <XStack gap="$3" alignItems="center">
        {Icon && <Icon size={20} color={color ?? '$gray11'} />}
        <Text fontSize="$4" color={color ?? '$color'}>{label}</Text>
      </XStack>
      {type === 'navigation' && value && <Text color="$gray11">{value}</Text>}
      {type === 'switch' && switchProps && (
        <Switch {...switchProps}>
          <Switch.Thumb animation="quick" />
        </Switch>
      )}
    </XStack>
  );
}
