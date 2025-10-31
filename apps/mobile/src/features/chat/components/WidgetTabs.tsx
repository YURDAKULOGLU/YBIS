import React from 'react';
import { YStack, XStack, Button, ScrollView, ChevronDown, ChevronUp, useTheme } from '@ybis/ui';
import Logger from '@ybis/logging';
import type { Tab, TabType } from '../types';

interface WidgetTabsProps {
  tabs: Tab[];
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  isWidgetExpanded: boolean;
  onToggleWidget: () => void;
}

export function WidgetTabs({
  tabs,
  selectedTab,
  setSelectedTab,
  isWidgetExpanded,
  onToggleWidget,
}: WidgetTabsProps): React.ReactElement {
  const theme = useTheme();

  return (
    <YStack
      paddingVertical="$2"
      borderBottomWidth={1}
      borderColor="$gray5"
      backgroundColor="$background"
      zIndex={10}
    >
      <XStack paddingHorizontal="$3" gap="$2" alignItems="center">
        {/* Tab buttons - scrollable */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} flex={1}>
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

        {/* Toggle button - fixed on right */}
        <Button
          size="$3"
          circular
          backgroundColor="$gray3"
          borderWidth={0}
          pressStyle={{ scale: 0.94, backgroundColor: '$gray4' }}
          animation="bouncy"
          onPress={onToggleWidget}
          icon={isWidgetExpanded ? <ChevronUp size={18} color={theme.gray11.val} /> : <ChevronDown size={18} color={theme.gray11.val} />}
        />
      </XStack>
    </YStack>
  );
}
