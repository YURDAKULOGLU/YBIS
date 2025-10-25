import React from 'react';
import { Card, Text, YStack, XStack } from '@ybis/ui';

// Define a simple type for the event prop
interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface EventItemProps {
  event: Event;
}

export function EventItem({ event }: EventItemProps): React.ReactElement {
  return (
    <XStack gap="$3" alignItems="center">
      <YStack>
        <Text fontSize="$3" color="$gray11">{event.startTime}</Text>
        <Text fontSize="$2" color="$gray10">{event.endTime}</Text>
      </YStack>
      <Card 
        flex={1}
        padding="$4" 
        backgroundColor={event.color}
        pressStyle={{ scale: 0.98, opacity: 0.8 }}
        animation="bouncy"
      >
        <Text fontSize="$5" fontWeight="600" color="white">{event.title}</Text>
      </Card>
    </XStack>
  );
}
