import type { WorkflowDefinitionSummary, WorkflowStatus } from '../types';

/**
 * WorkflowPort - abstraction over automation engines.
 */
export interface WorkflowPort {
  /**
   * List user-accessible workflows.
   */
  listWorkflows(params?: {
    limit?: number;
    status?: WorkflowStatus[];
  }): Promise<WorkflowDefinitionSummary[]>;

  /**
   * Trigger a workflow run manually.
   */
  triggerWorkflow(id: string, payload?: Record<string, unknown>): Promise<void>;
}
