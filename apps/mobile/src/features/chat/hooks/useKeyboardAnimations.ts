import { useEffect, useRef } from 'react';
import { Animated, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tab bar dimensions (matching _layout.tsx)
const TAB_BAR_HEIGHT = 60;
const TAB_BAR_PADDING = 16; // paddingTop (8) + paddingBottom (8)

interface UseKeyboardAnimationsReturn {
  widgetAnimatedHeight: Animated.Value;
  inputBarAnimatedBottom: Animated.Value;
  scrollPaddingBottom: Animated.Value;
}

export function useKeyboardAnimations(
  widgetHeight: number,
  inputBarHeight: number,
  scrollViewRef: React.RefObject<unknown>
): UseKeyboardAnimationsReturn {
  const insets = useSafeAreaInsets();

  // Chat input base position = tab bar height + padding + safe area
  const baseBottom = TAB_BAR_HEIGHT + TAB_BAR_PADDING + insets.bottom;

  const widgetAnimatedHeight = useRef(new Animated.Value(widgetHeight)).current;
  const inputBarAnimatedBottom = useRef(new Animated.Value(baseBottom)).current;
  const scrollPaddingBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (inputBarHeight > 0) {
      scrollPaddingBottom.setValue(inputBarHeight + baseBottom);
    }
  }, [inputBarHeight, scrollPaddingBottom, baseBottom]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      const keyboardHeight = event.endCoordinates.height;
      const keyboardDuration = event.duration || 250;

      Animated.parallel([
        Animated.timing(widgetAnimatedHeight, {
          toValue: 0,
          duration: keyboardDuration,
          useNativeDriver: false,
        }),
        Animated.timing(inputBarAnimatedBottom, {
          toValue: keyboardHeight,
          duration: keyboardDuration,
          useNativeDriver: false,
        }),
        Animated.timing(scrollPaddingBottom, {
          toValue: inputBarHeight + keyboardHeight,
          duration: keyboardDuration,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setTimeout(() => {
          const scrollView = scrollViewRef.current as { scrollToEnd?: (options: { animated: boolean }) => void } | null;
          scrollView?.scrollToEnd?.({ animated: true });
        }, 50);
      });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) => {
      const keyboardDuration = event.duration || 250;

      Animated.parallel([
        Animated.timing(widgetAnimatedHeight, {
          toValue: widgetHeight,
          duration: keyboardDuration,
          useNativeDriver: false,
        }),
        Animated.timing(inputBarAnimatedBottom, {
          toValue: baseBottom,
          duration: keyboardDuration,
          useNativeDriver: false,
        }),
        Animated.timing(scrollPaddingBottom, {
          toValue: inputBarHeight + baseBottom,
          duration: keyboardDuration,
          useNativeDriver: false,
        }),
      ]).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [widgetAnimatedHeight, inputBarAnimatedBottom, scrollPaddingBottom, widgetHeight, inputBarHeight, scrollViewRef, baseBottom]);

  return { widgetAnimatedHeight, inputBarAnimatedBottom, scrollPaddingBottom };
}
