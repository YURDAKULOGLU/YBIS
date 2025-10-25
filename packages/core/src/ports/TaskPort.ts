import type { TaskStatus, TaskSummary } from '../types';

/**
 * TaskPort - abstraction over task providers (Todoist, Linear, etc.).
 */
export interface TaskPort {
  /**
   * List tasks that require attention for the current user.
   */
  listActionableTasks(params?: {
    limit?: number;
    status?: TaskStatus[];
    includeCompleted?: boolean;
  }): Promise<TaskSummary[]>;

  /**
   * Mark a task as completed or in-progress.
   */
  updateTaskStatus(id: string, status: TaskStatus): Promise<void>;
}
