import React from 'react';
import { Card, Text, XStack } from '@ybis/ui';

// Define a simple type for the task prop for clarity
export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface TaskItemProps {
  task: Task;
}

function getStatusPill(status: Task['status']) {
  const style = {
    paddingVertical: '$1',
    paddingHorizontal: '$2',
    borderRadius: '$10',
    fontSize: '$2',
  };

  switch (status) {
    case 'todo':
      return <Text {...style} backgroundColor="$gray5" color="$gray11">Tamamlanacak</Text>;
    case 'in-progress':
      return <Text {...style} backgroundColor="$blue5" color="$blue11">Devam Ediyor</Text>;
    case 'done':
      return <Text {...style} backgroundColor="$green5" color="$green11">Tamamlandı</Text>;
    default:
      return null;
  }
}

export function TaskItem({ task }: TaskItemProps): React.ReactElement {
  return (
    <Card 
      padding="$4" 
      bordered
      pressStyle={{ scale: 0.98, backgroundColor: '$gray3' }}
      animation="bouncy"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" color="$color">{task.title}</Text>
        {getStatusPill(task.status)}
      </XStack>
    </Card>
  );
}
