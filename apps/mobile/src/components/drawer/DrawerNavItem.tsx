import React from 'react';
import { Button, type ButtonProps } from '@ybis/ui';

/**
 * DrawerNavItem Component
 *
 * Reusable navigation item for drawer menu
 *
 * Features:
 * - Icon + label
 * - Press animation (scale)
 * - Theme-aware styling
 * - Active state support
 */

interface DrawerNavItemProps {
  icon: ButtonProps['icon'];
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

export function DrawerNavItem({
  icon,
  label,
  onPress,
  isActive = false,
}: DrawerNavItemProps): React.ReactElement {
  return (
    <Button
      size="$4"
      justifyContent="flex-start"
      icon={icon}
      onPress={onPress}
      backgroundColor={isActive ? '$blue3' : 'transparent'}
      color={isActive ? '$blue11' : '$color'}
      borderWidth={0}
      hoverStyle={{
        backgroundColor: '$gray3',
      }}
      pressStyle={{
        scale: 0.96,
        backgroundColor: isActive ? '$blue4' : '$gray4',
      }}
      animation="quick"
      fontWeight={isActive ? '600' : '400'}
    >
      {label}
    </Button>
  );
}
