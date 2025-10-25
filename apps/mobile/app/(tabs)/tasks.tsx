import React, { useState } from 'react';
import { YStack, ScrollView, Plus, useTheme } from '@ybis/ui';
import { TextInput } from 'react-native';
import { TaskItem, type Task } from '../../src/components/tasks/TaskItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { Navbar } from '../../src/components/layout/Navbar';
import { ActionButton } from '../../src/components/layout/ActionButton';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';

const mockTasks: Task[] = [
  { id: '1', title: 'Market alışverişi yap', status: 'todo' },
  { id: '2', title: 'Proje sunumunu hazırla', status: 'in-progress' },
  { id: '3', title: 'Spor salonuna git', status: 'done' },
  { id: '4', title: 'YBIS dokümantasyonunu güncelle', status: 'todo' },
];

export default function TasksScreen(): React.ReactElement {
  const theme = useTheme();
  const [testInput, setTestInput] = useState('');

  return (
    <UniversalLayout>
      {/* Outer SafeAreaView: flex: 1, handles top safe area */}
      <SafeAreaView edges={['top']} flex={1}>
        <Navbar title="Görevler" />

        {/* ScrollView fills remaining space */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <YStack gap="$3" padding="$4">
            {mockTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </YStack>
        </ScrollView>

        {/* Inner SafeAreaView: NO flex, only bottom padding for sticky footer */}
        <SafeAreaView edges={['bottom']}>
          <YStack
            padding="$4"
            paddingTop="$2"
            backgroundColor="$background"
            borderTopWidth={1}
            borderTopColor="$gray5"
          >
            <TextInput
              style={{
                backgroundColor: theme.gray2?.val,
                borderColor: theme.gray5?.val,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: theme.color?.val,
              }}
              placeholder="Test keyboard handling..."
              placeholderTextColor={theme.gray10?.val}
              value={testInput}
              onChangeText={setTestInput}
            />
          </YStack>
        </SafeAreaView>
      </SafeAreaView>

      {/* ActionButton manages its own safe area positioning */}
      <ActionButton
        icon={Plus}
        color={theme.green9.val}
        onPress={() => {
          console.log('basıldı');
        }}
      />
    </UniversalLayout>
  );
}
