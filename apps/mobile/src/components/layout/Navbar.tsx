import React from 'react';
import { XStack, Text, Button, Menu } from '@ybis/ui';
import { useDrawer } from '../../contexts/DrawerContext';

/**
 * Navbar - Reusable Top Navigation Bar
 *
 * Single Responsibility: Render navigation UI only
 *
 * Features:
 * - Menu button (left) - opens drawer
 * - Title (center)
 * - Optional right content (settings, actions, etc.)
 *
 * Philosophy:
 * - NO positioning logic (no safe area, no absolute positioning)
 * - Parent screen controls positioning via SafeAreaView
 * - Navbar just renders its content
 *
 * Usage:
 * ```tsx
 * <SafeAreaView edges={['top', 'bottom']}>
 *   <Navbar title="Tasks" />
 *   <ScrollView>{content}</ScrollView>
 * </SafeAreaView>
 * ```
 */
interface NavbarProps {
  title: string;
  headerRight?: React.ReactNode;
}

export function Navbar({ title, headerRight }: NavbarProps): React.ReactElement {
  const { openDrawer } = useDrawer();

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$gray5"
      alignItems="center"
      justifyContent="space-between"
      gap="$3"
    >
      {/* Menu Button (left) */}
      <Button
        size="$3"
        circular
        backgroundColor="transparent"
        borderWidth={0}
        onPress={openDrawer}
        icon={Menu}
        pressStyle={{ backgroundColor: '$gray3' }}
      />

      {/* Title (center) */}
      <Text fontSize="$6" fontWeight="600" color="$color" textAlign="center" flex={1}>
        {title}
      </Text>

      {/* Optional Right Content */}
      <XStack minWidth={36} justifyContent="flex-end">
        {headerRight}
      </XStack>
    </XStack>
  );
}
