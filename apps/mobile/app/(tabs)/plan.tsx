import React from 'react';
import { YStack, ScrollView, Button, Plus, H3 } from '@ybis/ui';
import { EventItem } from '../../src/components/calendar/EventItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';

// Mock data as defined in the story
const mockEvents = [
  { id: '1', title: 'Proje Sync Toplantısı', startTime: '10:00', endTime: '11:00', color: '$blue9' },
  { id: '2', title: 'Dişçi Randevusu', startTime: '14:30', endTime: '15:00', color: '$orange9' },
  { id: '3', title: 'Akşam Yemeği', startTime: '19:00', endTime: '20:00', color: '$purple9' },
];

export default function PlanScreen(): React.ReactElement {
  return (
    <UniversalLayout>
      <YStack flex={1} backgroundColor="$background">
        <H3 paddingHorizontal="$4" paddingTop="$4">Bugünkü Planım</H3>
        <ScrollView flex={1} padding="$4">
          <YStack gap="$3">
            {mockEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </YStack>
        </ScrollView>
        <Button
          position="absolute"
          bottom={20}
          left={20}
          size="$6"
          circular
          icon={Plus}
          backgroundColor="$orange9"
          pressStyle={{ scale: 0.9, backgroundColor: '$orange10' }}
          animation="bouncy"
          onPress={() => { /* Functionality to be added in a future story */ }}
        />
      </YStack>
    </UniversalLayout>
  );
}
