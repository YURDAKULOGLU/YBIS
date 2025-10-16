import React, { useState, useCallback } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Bell, User } from '@tamagui/lucide-icons';
import { useTheme } from 'tamagui';
import { DrawerMenu } from '../components/DrawerMenu';

/**
 * Main Navigation Layout
 *
 * Custom header with:
 * - Title: "Home" (centered)
 * - Left: Menu icon (drawer toggle)
 * - Right: Notifications + Settings buttons
 * - No bottom tab bar (hidden screens accessible via navigation)
 *
 * Navigation:
 * - Menu icon → Open drawer menu
 * - Bell icon → (tabs)/notifications (placeholder)
 * - User icon → (tabs)/settings
 *
 * Theme Support:
 * - Header background uses theme tokens (background)
 * - Border uses theme tokens (borderColor)
 * - Icons use theme tokens (color)
 * - Dynamic theme switching supported
 */
export default function TabLayout(): React.ReactElement {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const renderMenuButton = useCallback(() => (
    <MenuButton onPress={handleDrawerOpen} />
  ), [handleDrawerOpen]);

  const renderHeaderActions = useCallback(() => (
    <HeaderActions />
  ), []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarStyle: {
            display: 'none',
            height: 0,
            position: 'absolute',
            backgroundColor: theme.background.val,
          }, // Completely hide bottom tab bar
          headerStyle: {
            backgroundColor: theme.background.val,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor.val,
            height: 56 + insets.top, // Header + safe area
          },
          headerTitleStyle: {
            color: theme.color.val,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
          },
          headerLeft: renderMenuButton,
          headerRight: renderHeaderActions,
        }}
      />
      {/* Other screens hidden but accessible via navigation */}
      <Tabs.Screen
        name="chat"
        options={{
          href: null, // Hide from navigation
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
          },
          href: null, // Hide from tab bar, but accessible via navigation
        }}
      />
    </Tabs>

    {/* Drawer Menu */}
    <DrawerMenu open={drawerOpen} onOpenChange={setDrawerOpen} />
  </>
  );
}

/**
 * Menu Button (Left header)
 * Opens drawer navigation
 */
interface MenuButtonProps {
  onPress: () => void;
}

function MenuButton({ onPress }: MenuButtonProps): React.ReactElement {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={onPress}
    >
      <Menu size={24} color={theme.color.val} />
    </TouchableOpacity>
  );
}

/**
 * Header Actions (Right header)
 * - Bell: Notifications (placeholder)
 * - User: Settings screen
 */
function HeaderActions(): React.ReactElement {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => { /* Notifications not implemented yet */ }}
      >
        <Bell size={22} color={theme.color.val} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/(tabs)/settings')}
      >
        <User size={22} color={theme.color.val} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
});


