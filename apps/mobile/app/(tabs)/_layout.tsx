import React, { useState, useMemo } from 'react';
import { Tabs } from 'expo-router';
import { useTheme, Home, MessageCircle, CheckSquare, FileText, Calendar, Settings, useSafeAreaInsets } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import { DrawerMenu } from '../../src/components/drawer/DrawerMenu';
import { DrawerContext } from '../../src/contexts/DrawerContext';

// Icon components defined outside to prevent recreation on every render
const HomeIcon = ({ color, size }: { color: string; size: number }): React.ReactElement => (
  <Home size={size} color={color} />
);
const TasksIcon = ({ color, size }: { color: string; size: number }): React.ReactElement => (
  <CheckSquare size={size} color={color} />
);
const NotesIcon = ({ color, size }: { color: string; size: number }): React.ReactElement => (
  <FileText size={size} color={color} />
);
const PlanIcon = ({ color, size }: { color: string; size: number }): React.ReactElement => (
  <Calendar size={size} color={color} />
);
const ChatIcon = ({ color, size }: { color: string; size: number }): React.ReactElement => (
  <MessageCircle size={size} color={color} />
);
const SettingsIcon = ({ color, size }: { color: string; size: number }): React.ReactElement => (
  <Settings size={size} color={color} />
);

export default function TabLayout(): React.ReactElement {
  const theme = useTheme();
  const { t } = useTranslation('mobile');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const drawerContextValue = useMemo(
    () => ({
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    []
  );

  return (
    <DrawerContext.Provider value={drawerContextValue}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: false,
          tabBarStyle: {
            backgroundColor: theme.background.val,
            borderTopColor: theme.gray5.val,
            borderTopWidth: 1,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.blue9.val,
          tabBarInactiveTintColor: theme.gray10.val,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: HomeIcon,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: t('tabs.tasks'),
            tabBarIcon: TasksIcon,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: t('tabs.notes'),
            tabBarIcon: NotesIcon,
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: t('tabs.plan'),
            tabBarIcon: PlanIcon,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: t('tabs.chat'),
            tabBarIcon: ChatIcon,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // Settings accessible only via drawer
            tabBarIcon: SettingsIcon,
          }}
        />
      </Tabs>

      <DrawerMenu open={drawerOpen} onOpenChange={setDrawerOpen} />
    </DrawerContext.Provider>
  );
}
