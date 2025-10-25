import React from 'react';
import { YStack, ScrollView, Button, Plus } from '@ybis/ui';
import { TaskItem, type Task } from '../../src/components/tasks/TaskItem';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';

const mockTasks: Task[] = [
  { id: '1', title: 'Market alÄ±ÅŸveriÅŸi yap', status: 'todo' },
  { id: '2', title: 'Proje sunumunu hazÄ±rla', status: 'in-progress' },
  { id: '3', title: 'Spor salonuna git', status: 'done' },
  { id: '4', title: 'YBIS dokÃ¼mantasyonunu gÃ¼ncelle', status: 'todo' },
];

export default function TasksScreen(): React.ReactElement {
  return (
    <UniversalLayout>
      <YStack flex={1} backgroundColor="$background">
        <ScrollView flex={1} padding="$4">
          <YStack gap="$3">
            {mockTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
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
          backgroundColor="$green9"
          pressStyle={{ scale: 0.9, backgroundColor: '$green10' }}
          animation="bouncy"
          onPress={() => {
            /* Functionality to be added in a future story */
          }}
        />
      </YStack>
    </UniversalLayout>
  );
}
