import React from 'react';
import { YStack, ScrollView, Button, Plus } from '@ybis/ui';
import { NoteItem } from '../../src/components/notes/NoteItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';

// Mock data as defined in the story
const mockNotes = [
  { id: '1', title: 'Proje Fikirleri', preview: 'AI tabanlı bir verimlilik uygulaması...' },
  { id: '2', title: 'Haftalık Toplantı Özeti', preview: 'Bu hafta yapılanlar ve gelecek hafta hedefleri...' },
  { id: '3', title: 'Alışveriş Listesi', preview: 'Süt, ekmek, yumurta...' },
];

export default function NotesScreen(): React.ReactElement {
  return (
    <UniversalLayout>
      <YStack flex={1} backgroundColor="$background">
        <ScrollView flex={1} padding="$4">
          <YStack gap="$3">
            {mockNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
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
          backgroundColor="$purple9"
          pressStyle={{ scale: 0.9, backgroundColor: '$purple10' }}
          animation="bouncy"
          onPress={() => { /* Functionality to be added in a future story */ }}
        />
      </YStack>
    </UniversalLayout>
  );
}
