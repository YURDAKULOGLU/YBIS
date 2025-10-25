import React from 'react';
import { YStack } from '@ybis/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { YStackProps } from '@ybis/ui';

/**
 * SafeAreaView - Safe Area Padding Manager
 *
 * Single Responsibility: Protect content from device notches and system bars
 *
 * Philosophy:
 * - UniversalLayout provides the canvas
 * - Navbar handles top navigation
 * - SafeAreaView protects content from overlapping system UI
 * - Each component does ONE thing
 *
 * Why separate from UniversalLayout?
 * - Not all screens need safe area (e.g., full-screen image viewer)
 * - Different screens need different edges protected
 * - Composition > Configuration
 *
 * Usage:
 * ```tsx
 * <UniversalLayout>
 *   <SafeAreaView edges={['top']}>
 *     <Navbar title="Tasks" />
 *     <ScrollView>{content}</ScrollView>
 *     <SafeAreaView edges={['bottom']}>
 *       <TextInput />
 *     </SafeAreaView>
 *   </SafeAreaView>
 * </UniversalLayout>
 * ```
 */
interface SafeAreaViewProps extends YStackProps {
  /**
   * Which edges to protect
   * Default: ['top', 'bottom']
   *
   * Common patterns:
   * - With Navbar: edges={['bottom']} (navbar handles top)
   * - No Navbar: edges={['top', 'bottom']}
   * - Full screen: edges={[]} (no protection)
   * - Nested: Parent edges={['top']}, Child edges={['bottom']}
   */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function SafeAreaView({
  children,
  edges = ['top', 'bottom'],
  ...props
}: SafeAreaViewProps): React.ReactElement {
  const insets = useSafeAreaInsets();

  // Construct safe area props dynamically
  // Note: flex is NOT hardcoded - it comes from props if provided
  const safeAreaProps: YStackProps = {
    ...props, // Preserve all YStack props including flex
  };

  if (edges.includes('top')) {
    safeAreaProps.paddingTop = insets.top;
  }
  if (edges.includes('bottom')) {
    safeAreaProps.paddingBottom = insets.bottom;
  }
  if (edges.includes('left')) {
    safeAreaProps.paddingLeft = insets.left;
  }
  if (edges.includes('right')) {
    safeAreaProps.paddingRight = insets.right;
  }

  return <YStack {...safeAreaProps}>{children}</YStack>;
}
