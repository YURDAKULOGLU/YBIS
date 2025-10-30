import React from 'react';
import { YStack } from '@ybis/ui';

/**
 * UniversalLayout - Minimal Screen Wrapper
 *
 * Design Philosophy: "Single Responsibility"
 * - ONLY provides basic screen container
 * - No navbar, no action buttons, no keyboard handling
 * - Each screen composes its own features
 *
 * Why so minimal?
 * - Follows YBIS Constitution: Single Responsibility Principle
 * - Simple screens (About, Help) don't carry unnecessary weight
 * - Features (navbar, keyboard) are opt-in via composition, not inheritance
 *
 * Usage:
 * ```tsx
 * <UniversalLayout>
 *   <Navbar title="Tasks" />
 *   <ScrollView>{content}</ScrollView>
 *   <ActionButton icon={Plus} onPress={handleAdd} />
 * </UniversalLayout>
 * ```
 */
interface UniversalLayoutProps {
  children: React.ReactNode;
}

export function UniversalLayout({ children }: UniversalLayoutProps): React.ReactElement {
  return (
    <YStack flex={1} backgroundColor="$background">
      {children}
    </YStack>
  );
}
