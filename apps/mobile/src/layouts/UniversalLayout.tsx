import React, { useRef, useEffect } from 'react';
import { Keyboard, Animated, Pressable } from 'react-native';
import { YStack, useTheme, MessageCircle } from '@ybis/ui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * UniversalLayout - Wrapper for all tab screens
 *
 * Features:
 * - Universal keyboard-aware animations (extracted from deleted index.tsx)
 * - Floating chat button (right bottom, always visible)
 * - Synced with keyboard native duration for smooth transitions
 * - Safe area aware (respects bottom insets)
 * - Theme-aware styling
 *
 * Usage:
 * ```tsx
 * export default function MyScreen() {
 *   return (
 *     <UniversalLayout>
 *       <YStack flex={1}>
 *         {/* Your screen content *\/}
 *       </YStack>
 *     </UniversalLayout>
 *   );
 * }
 * ```
 */
interface UniversalLayoutProps {
  children: React.ReactNode;
  /**
   * Hide floating chat button (useful for chat screen itself)
   */
  hideChatButton?: boolean;
}

export function UniversalLayout({
  children,
  hideChatButton = false,
}: UniversalLayoutProps): React.ReactElement {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Animated value for keyboard height (pattern from deleted index.tsx)
  const keyboardBottom = useRef(new Animated.Value(0)).current;

  // Keyboard listeners with synced animations (extracted from deleted index.tsx lines 78-113)
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      const keyboardHeight = e.endCoordinates.height;
      const keyboardDuration = e.duration || 250; // Use keyboard's native duration

      Animated.timing(keyboardBottom, {
        toValue: keyboardHeight,
        duration: keyboardDuration, // Synced with keyboard
        useNativeDriver: false,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      const keyboardDuration = e.duration || 250; // Use keyboard's native duration

      Animated.timing(keyboardBottom, {
        toValue: 0,
        duration: keyboardDuration, // Synced with keyboard
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardBottom]);

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Screen content */}
      {children}

      {/* Floating Chat Button - Keyboard aware */}
      {!hideChatButton && (
        <Animated.View
          style={{
            position: 'absolute',
            right: 16,
            bottom: Animated.add(16 + insets.bottom, keyboardBottom),
            zIndex: 1000,
          }}
        >
          <Pressable
            onPress={() => router.push('/(tabs)/chat')}
            style={({ pressed }) => ({
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: theme.blue9.val,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            })}
          >
            <MessageCircle size={24} color="white" />
          </Pressable>
        </Animated.View>
      )}
    </YStack>
  );
}
