import React from 'react';
import { YStack, ScrollView, Plus, H3, useTheme } from '@ybis/ui';
import { EventItem } from '../../src/components/calendar/EventItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { Navbar } from '../../src/components/layout/Navbar';
import { ActionButton } from '../../src/components/layout/ActionButton';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';

// Mock data as defined in the story
const mockEvents = [
  { id: '1', title: 'Proje Sync Toplantısı', startTime: '10:00', endTime: '11:00', color: '$blue9' },
  { id: '2', title: 'Dişçi Randevusu', startTime: '14:30', endTime: '15:00', color: '$orange9' },
  { id: '3', title: 'Akşam Yemeği', startTime: '19:00', endTime: '20:00', color: '$purple9' },
];

export default function PlanScreen(): React.ReactElement {
  const theme = useTheme();

  return (
    <UniversalLayout>
      {/* SafeAreaView: flex: 1, handles both top and bottom safe areas */}
      <SafeAreaView edges={['top', 'bottom']} flex={1}>
        <Navbar title="Plan" />

        <H3 paddingHorizontal="$4" paddingTop="$4">Bugünkü Planım</H3>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <YStack gap="$3" padding="$4">
            {mockEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </YStack>
        </ScrollView>
      </SafeAreaView>

      {/* ActionButton manages its own safe area positioning */}
      <ActionButton
        icon={Plus}
        color={theme.orange9.val}
        onPress={() => {}}
      />
    </UniversalLayout>
  );
}
