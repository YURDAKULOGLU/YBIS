import React from 'react';
import { YStack, XStack, Button, ScrollView, ChevronUp, ChevronDown, RefreshCcw } from '@ybis/ui';
import Logger from '@ybis/logging';
import type { Tab, TabType } from '../types';

interface WidgetTabsProps {
  tabs: Tab[];
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function WidgetTabs({
  tabs,
  selectedTab,
  setSelectedTab,
  isCollapsed,
  onToggleCollapsed,
  onRefresh,
  isRefreshing,
}: WidgetTabsProps): React.ReactElement {
  return (
    <YStack
      paddingVertical="$2"
      borderBottomWidth={1}
      borderColor="$gray5"
      backgroundColor="$background"
      zIndex={10}
    >
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$3" gap="$2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack paddingVertical="$2" gap="$2">
            {tabs.map((tab) => {
              const isSelected = selectedTab === tab.key;
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.key}
                  size="$3"
                  backgroundColor={isSelected ? '$blue9' : '$gray3'}
                  color={isSelected ? 'white' : '$gray11'}
                  borderWidth={0}
                  borderRadius="$10"
                  pressStyle={{ scale: 0.94, backgroundColor: isSelected ? '$blue10' : '$gray4' }}
                  animation="bouncy"
                  onPress={() => {
                    Logger.info('Widget tab selected', {
                      type: 'USER_ACTION',
                      selectedTab: tab.key,
                    });
                    setSelectedTab(tab.key);
                  }}
                  icon={<Icon size={16} color={isSelected ? 'white' : undefined} />}
                >
                  {tab.label}
                </Button>
              );
            })}
          </XStack>
        </ScrollView>

        <XStack gap="$2">
          <Button
            size="$3"
            circular
            backgroundColor="$gray3"
            borderWidth={0}
            pressStyle={{ scale: 0.92, backgroundColor: '$gray4' }}
            animation="bouncy"
            onPress={onRefresh}
            icon={<RefreshCcw size={16} color={isRefreshing ? '#2563eb' : undefined} />}
            disabled={isRefreshing}
          />
          <Button
            size="$3"
            circular
            backgroundColor="$gray3"
            borderWidth={0}
            pressStyle={{ scale: 0.92, backgroundColor: '$gray4' }}
            animation="bouncy"
            onPress={onToggleCollapsed}
            icon={isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          />
        </XStack>
      </XStack>
    </YStack>
  );
}
