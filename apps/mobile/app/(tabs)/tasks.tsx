import { useState } from 'react';
import { YStack, H2, H3, Text, Card, Button, ScrollView, XStack } from 'tamagui';
import { Plus, Circle, CheckCircle2 } from '@tamagui/lucide-icons';

/**
 * Tasks Screen
 *
 * DEMO MODE: Shows mock task list for UI testing
 * Real task management will be implemented in Epic 5 (Tasks Feature)
 *
 * Features (Demo):
 * - Task list with status
 * - Priority indicators
 * - Checkboxes (non-functional)
 * - Add task button (placeholder)
 */

// Mock tasks data
const MOCK_TASKS = [
  { id: '1', title: 'Finish quarterly report', priority: 'high', status: 'todo', dueDate: 'Today' },
  { id: '2', title: 'Review PR #234', priority: 'medium', status: 'in_progress', dueDate: 'Tomorrow' },
  { id: '3', title: 'Update documentation', priority: 'low', status: 'todo', dueDate: 'This week' },
  { id: '4', title: 'Team standup', priority: 'high', status: 'completed', dueDate: 'Today' },
  { id: '5', title: 'Code review session', priority: 'medium', status: 'completed', dueDate: 'Yesterday' },
];

export default function TasksScreen() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleAddTask = () => {
    console.log('Add task - UI preview only (Epic 5)');
  };

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '$red10';
      case 'medium':
        return '$orange10';
      case 'low':
        return '$blue10';
      default:
        return '$gray10';
    }
  };

  const activeTasks = MOCK_TASKS.filter((t) => t.status !== 'completed');
  const completedTasks = MOCK_TASKS.filter((t) => t.status === 'completed');

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <YStack padding="$4" gap="$3" borderBottomWidth={1} borderColor="$gray5">
        <XStack justifyContent="space-between" alignItems="center">
          <H2>Tasks</H2>
          <Button size="$3" theme="blue" icon={Plus} onPress={handleAddTask} circular disabled>
            Add
          </Button>
        </XStack>
        <Text color="$gray11" fontSize="$3">
          {activeTasks.length} active • {completedTasks.length} completed
        </Text>
      </YStack>

      <ScrollView>
        <YStack padding="$4" gap="$4">
          {/* Active Tasks */}
          <YStack gap="$3">
            <H3>Active Tasks</H3>
            {activeTasks.map((task) => (
              <Card
                key={task.id}
                padding="$4"
                bordered
                pressStyle={{ scale: 0.98 }}
                onPress={() => toggleTask(task.id)}
              >
                <XStack gap="$3" alignItems="center">
                  <Circle
                    size={24}
                    borderWidth={2}
                    borderColor={getPriorityColor(task.priority)}
                  >
                    {selectedTasks.includes(task.id) && (
                      <Circle size={12} backgroundColor={getPriorityColor(task.priority)} />
                    )}
                  </Circle>
                  <YStack flex={1} gap="$1">
                    <Text fontWeight="600" fontSize="$4">
                      {task.title}
                    </Text>
                    <XStack gap="$2">
                      <Text
                        color={getPriorityColor(task.priority)}
                        fontSize="$2"
                        fontWeight="600"
                      >
                        {task.priority.toUpperCase()}
                      </Text>
                      <Text color="$gray11" fontSize="$2">
                        • {task.dueDate}
                      </Text>
                    </XStack>
                  </YStack>
                  {task.status === 'in_progress' && (
                    <Text color="$blue10" fontSize="$2" fontWeight="600">
                      IN PROGRESS
                    </Text>
                  )}
                </XStack>
              </Card>
            ))}
          </YStack>

          {/* Completed Tasks */}
          <YStack gap="$3" marginTop="$2">
            <H3>Completed</H3>
            {completedTasks.map((task) => (
              <Card key={task.id} padding="$4" bordered opacity={0.6}>
                <XStack gap="$3" alignItems="center">
                  <CheckCircle2 size={24} color="$green10" />
                  <YStack flex={1} gap="$1">
                    <Text
                      fontWeight="600"
                      fontSize="$4"
                      textDecorationLine="line-through"
                      color="$gray11"
                    >
                      {task.title}
                    </Text>
                    <Text color="$gray10" fontSize="$2">
                      {task.dueDate}
                    </Text>
                  </YStack>
                </XStack>
              </Card>
            ))}
          </YStack>

          {/* Demo Mode Notice */}
          <Card padding="$4" marginTop="$2" backgroundColor="$yellow2" borderColor="$yellow6" bordered>
            <Text color="$yellow11" fontSize="$3" textAlign="center" fontWeight="600">
              ✅ DEMO MODE: Mock task data
            </Text>
            <Text color="$yellow11" fontSize="$2" textAlign="center" marginTop="$2">
              Real task management coming in Epic 5
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
