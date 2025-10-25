import React, { useRef, useEffect } from 'react';
import { Animated, Keyboard, Pressable } from 'react-native';
import { useTheme } from '@ybis/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * ActionButton - Keyboard-Aware Floating Action Button
 *
 * Features:
 * - Floats in bottom-right corner
 * - Automatically moves up when keyboard opens
 * - Synced with native keyboard animation duration
 * - Safe area aware
 *
 * Usage:
 * ```tsx
 * <ActionButton icon={Plus} color="$green9" onPress={handleAdd} />
 * ```
 */
interface ActionButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color?: string;
  onPress: () => void;
}

export function ActionButton({ icon: Icon, color, onPress }: ActionButtonProps): React.ReactElement {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      const keyboardHeight = e.endCoordinates.height;
      const keyboardDuration = e.duration || 250;

      Animated.timing(keyboardBottom, {
        toValue: keyboardHeight,
        duration: keyboardDuration,
        useNativeDriver: false,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      const keyboardDuration = e.duration || 250;

      Animated.timing(keyboardBottom, {
        toValue: 0,
        duration: keyboardDuration,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardBottom]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: 16,
        bottom: Animated.add(16 + insets.bottom, keyboardBottom),
        zIndex: 1000,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: color ?? theme.blue9.val,
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
        <Icon size={24} color="white" />
      </Pressable>
    </Animated.View>
  );
}
