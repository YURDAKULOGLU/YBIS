import React from 'react';
import { YStack, ScrollView, Plus, useTheme } from '@ybis/ui';
import { NoteItem } from '../../src/components/notes/NoteItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { Navbar } from '../../src/components/layout/Navbar';
import { ActionButton } from '../../src/components/layout/ActionButton';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';

// Mock data as defined in the story
const mockNotes = [
  { id: '1', title: 'Proje Fikirleri', preview: 'AI tabanlı bir verimlilik uygulaması...' },
  { id: '2', title: 'Haftalık Toplantı Özeti', preview: 'Bu hafta yapılanlar ve gelecek hafta hedefleri...' },
  { id: '3', title: 'Alışveriş Listesi', preview: 'Süt, ekmek, yumurta...' },
];

export default function NotesScreen(): React.ReactElement {
  const theme = useTheme();

  return (
    <UniversalLayout>
      {/* SafeAreaView: flex: 1, handles top safe area only (tab bar manages bottom) */}
      <SafeAreaView edges={['top']} flex={1}>
        <Navbar title="Notlar" />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
          <YStack gap="$3" padding="$4">
            {mockNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </YStack>
        </ScrollView>
      </SafeAreaView>

      {/* ActionButton manages its own safe area positioning */}
      <ActionButton
        icon={Plus}
        color={theme.purple9.val}
        onPress={() => {}}
      />
    </UniversalLayout>
  );
}
