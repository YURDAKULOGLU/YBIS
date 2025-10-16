import React from 'react';
import { YStack, Text, Button, Separator, Sheet } from 'tamagui';
import { useRouter } from 'expo-router';
import { Home, MessageCircle, CheckSquare, Settings, LogOut } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMockAuth } from '../../src/stores/useMockAuth';
import { useThemeStore } from '@ybis/theme';

/**
 * Drawer Menu Component
 *
 * Side navigation menu with:
 * - Navigation links (Home, Chat, Tasks, Settings)
 * - Theme info display
 * - Logout button
 *
 * Usage:
 * - Triggered by Menu icon in header
 * - Swipe from left edge to open (TODO)
 * - Tap outside to close
 *
 * Architecture:
 * - Uses Tamagui Sheet (not separate drawer library)
 * - Theme-aware styling
 * - Mock auth integration
 */

interface DrawerMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DrawerMenu({ open, onOpenChange }: DrawerMenuProps): React.ReactElement {
  const router = useRouter();
  const { user, logout } = useMockAuth();
  const { currentTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const handleNavigation = (path: string): void => {
    router.push(path as never);
    onOpenChange(false);
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      position={0}
      dismissOnSnapToBottom
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame 
        padding="$4" 
        paddingTop={Math.max(insets.top, 16)}
        paddingBottom={Math.max(insets.bottom, 16)}
        backgroundColor="$background"
      >
        <Sheet.Handle />
        <YStack flex={1} gap="$4" paddingTop="$2">
          {/* User Info */}
          <YStack gap="$2" paddingBottom="$3">
            <Text fontSize="$6" fontWeight="600">
              {user?.name ?? 'User'}
            </Text>
            <Text color="$gray11" fontSize="$3">
              {user?.email ?? 'user@example.com'}
            </Text>
            <Text color="$blue10" fontSize="$2">
              {currentTheme.toUpperCase()} MODE • DEMO
            </Text>
          </YStack>

          <Separator />

          {/* Navigation Items */}
          <YStack gap="$2" flex={1}>
            <DrawerItem
              icon={Home}
              label="Home"
              onPress={() => handleNavigation('/(tabs)')}
            />
            <DrawerItem
              icon={MessageCircle}
              label="Chat"
              onPress={() => handleNavigation('/(tabs)/chat')}
            />
            <DrawerItem
              icon={CheckSquare}
              label="Tasks"
              onPress={() => handleNavigation('/(tabs)/tasks')}
            />
            <DrawerItem
              icon={Settings}
              label="Settings"
              onPress={() => handleNavigation('/(tabs)/settings')}
            />
          </YStack>

          <Separator />

          {/* Logout Button */}
          <Button
            theme="red"
            size="$4"
            icon={LogOut}
            onPress={() => { void handleLogout(); }}
          >
            Exit Demo Mode
          </Button>

          {/* App Info */}
          <YStack gap="$1" paddingTop="$2">
            <Text color="$gray11" fontSize="$2">
              YBIS Mobile v0.1.0
            </Text>
            <Text color="$gray11" fontSize="$2">
              Expo SDK 54 • React Native 0.81.4
            </Text>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

/**
 * Drawer Item Component
 * Individual navigation item in drawer
 */
interface DrawerItemProps {
  icon: typeof Home;
  label: string;
  onPress: () => void;
}

function DrawerItem({ icon: Icon, label, onPress }: DrawerItemProps): React.ReactElement {
  return (
    <Button
      size="$4"
      justifyContent="flex-start"
      icon={<Icon size={20} />}
      onPress={onPress}
      theme="gray"
    >
      {label}
    </Button>
  );
}

// Export both named and default for flexibility
export { DrawerMenu };
export default DrawerMenu;
