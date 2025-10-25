import React from 'react';
import { Card, Text, YStack } from '@ybis/ui';

// Define a simple type for the note prop
interface Note {
  id: string;
  title: string;
  preview: string;
}

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps): React.ReactElement {
  return (
    <Card 
      padding="$4" 
      bordered
      pressStyle={{ scale: 0.98, backgroundColor: '$gray3' }}
      animation="bouncy"
    >
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="600" color="$color">{note.title}</Text>
        <Text fontSize="$3" color="$gray11" numberOfLines={2} ellipsizeMode="tail">{note.preview}</Text>
      </YStack>
    </Card>
  );
}
