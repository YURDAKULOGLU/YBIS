import React from 'react';
import { YStack, ScrollView, Plus, useTheme } from '@ybis/ui';
import { TaskItem, type Task } from '../../src/components/tasks/TaskItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { Navbar } from '../../src/components/layout/Navbar';
import { ActionButton } from '../../src/components/layout/ActionButton';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';
import Logger from '@ybis/logging';

const mockTasks: Task[] = [
  { id: '1', title: 'Market alışverişi yap', status: 'todo' },
  { id: '2', title: 'Proje sunumunu hazırla', status: 'in-progress' },
  { id: '3', title: 'Spor salonuna git', status: 'done' },
  { id: '4', title: 'YBIS dokümantasyonunu güncelle', status: 'todo' },
];

export default function TasksScreen(): React.ReactElement {
  const theme = useTheme();

  return (
    <UniversalLayout>
      {/* SafeAreaView: handles top safe area only (tab bar manages bottom) */}
      <SafeAreaView edges={['top']} flex={1}>
        <Navbar title="Görevler" />

        {/* ScrollView fills remaining space */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        >
          <YStack gap="$3" padding="$4">
            {mockTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </YStack>
        </ScrollView>
      </SafeAreaView>

      {/* ActionButton manages its own safe area positioning */}
      <ActionButton
        icon={Plus}
        color={theme.green9.val}
        onPress={() => {
          Logger.info('Task action button pressed');
        }}
      />
    </UniversalLayout>
  );
}
