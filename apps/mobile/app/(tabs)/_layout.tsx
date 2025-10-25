import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@ybis/ui';
import { DrawerMenu } from '../../src/components/drawer/DrawerMenu';

export default function TabLayout(): React.ReactElement {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          },
          headerStyle: {
            backgroundColor: theme.background.val,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor.val,
            height: 56 + insets.top, 
          },
          headerTitleStyle: {
            color: theme.color.val,
          },
        }}
      >
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen name="notes" options={{ href: null }} />
      <Tabs.Screen name="plan" options={{ href: null }} />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
          },
          href: null,
        }}
      />
    </Tabs>

    <DrawerMenu open={drawerOpen} onOpenChange={setDrawerOpen} />
  </>
  );
}