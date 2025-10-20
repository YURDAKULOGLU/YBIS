import React, { useEffect, useRef, useState } from 'react';
import { Modal, Animated, TouchableWithoutFeedback, Dimensions, StyleSheet, Easing } from 'react-native';
import { YStack, Separator } from '@ybis/ui';
import { useRouter, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, MessageCircle, CheckSquare, Settings } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMockAuth } from '../../stores/useMockAuth';
import { useThemeStore } from '@ybis/theme';
import { DrawerHeader } from './DrawerHeader';
import { DrawerNavItem } from './DrawerNavItem';
import { DrawerFooter } from './DrawerFooter';

/**
 * Drawer Menu Component - Side Navigation
 *
 * Professional side drawer with:
 * - Fast slide animation (180ms) with smooth easing curve
 * - Glassmorphism backdrop
 * - Proper state management (no spawn bug)
 * - Active route tracking
 *
 * Animation:
 * - Easing.out(Easing.cubic) for natural deceleration
 * - 180ms duration (fast + smooth)
 *
 * Future: Swipe gesture support deferred (needs proper implementation)
 */

interface DrawerMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;
const ANIMATION_DURATION = 180; // Fast and snappy

function DrawerMenu({ open, onOpenChange }: DrawerMenuProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useMockAuth();
  const { currentTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  // Internal modal visibility state (synced with animation)
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // This effect manages the modal's visibility and resets content visibility.
  useEffect(() => {
    if (open) {
      setModalVisible(true);
    } else {
      // When closing, start the animation first.
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After the animation, hide the modal.
        setModalVisible(false);
      });
    }
  }, [open]);

  // This effect runs when the modal becomes visible to animate the content in.
  useEffect(() => {
    if (modalVisible && open) {
      // Animate in (slide from left + fade in)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, open]);

  const handleNavigation = (path: string): void => {
    router.push(path as never);
    onOpenChange(false);
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    onOpenChange(false);
  };

  const handleBackdropPress = (): void => {
    onOpenChange(false);
  };

  // Navigation items configuration
  const navItems = [
    { path: '/(tabs)', label: 'Home', icon: <Home size={20} /> },
    { path: '/(tabs)/chat', label: 'Chat', icon: <MessageCircle size={20} /> },
    { path: '/(tabs)/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/(tabs)/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => onOpenChange(false)}
    >
      {/* Backdrop - Glassmorphism Effect */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <BlurView
            intensity={20}
            tint={currentTheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Drawer Panel */}
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            transform: [{ translateX: slideAnim }],
            width: DRAWER_WIDTH,
          },
        ]}
      >
        <YStack
          flex={1}
          backgroundColor="$background"
          paddingHorizontal="$4"
          paddingTop={Math.max(insets.top + 16, 24)}
          paddingBottom={Math.max(insets.bottom + 8, 16)}
        >
          {/* Header + Navigation Section */}
          <YStack flex={1}>
            {/* Header Section */}
            <DrawerHeader
              userName={user?.name}
              userEmail={user?.email}
              currentTheme={currentTheme}
            />

            <Separator marginVertical="$3" />

            {/* Navigation Items */}
            <YStack gap="$2">
              {navItems.map((item) => (
                <DrawerNavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  onPress={() => handleNavigation(item.path)}
                  isActive={pathname === item.path}
                />
              ))}
            </YStack>
          </YStack>

          {/* Footer Section - Pinned to bottom */}
          <DrawerFooter onLogout={handleLogout} />
        </YStack>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

// Export both named and default for flexibility
export { DrawerMenu };
export default DrawerMenu;
