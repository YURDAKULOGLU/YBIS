import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { useTheme, Home, MessageCircle, CheckSquare, FileText, Calendar, Settings } from '@ybis/ui';
import { DrawerMenu } from '../../src/components/drawer/DrawerMenu';
import { DrawerContext } from '../../src/contexts/DrawerContext';

export default function TabLayout(): React.ReactElement {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <DrawerContext.Provider
      value={{
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background.val,
            borderTopColor: theme.gray5.val,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.blue9.val,
          tabBarInactiveTintColor: theme.gray10.val,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Görevler',
            tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notlar',
            tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: 'Plan',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Sohbet',
            tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // Settings accessible only via drawer
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tabs>

      <DrawerMenu open={drawerOpen} onOpenChange={setDrawerOpen} />
    </DrawerContext.Provider>
  );
}
