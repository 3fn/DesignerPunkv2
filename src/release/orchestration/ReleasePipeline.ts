/**
 * Release Pipeline
 * 
 * Defines the release pipeline stages and execution flow.
 * Provides structured pipeline execution with stage tracking and error handling.
 * 
 * Requirements: 8.1, 8.2, 8.3
 */

import { WorkflowStateManager } from './WorkflowStateManager';

export type PipelineStage =
  | 'analysis'
  | 'planning'
  | 'validation'
  | 'confirmation'
  | 'package-update'
  | 'changelog-update'
  | 'git-operations'
  | 'push'
  | 'github-publish'
  | 'npm-publish';

export interface PipelineStageResult {
  stage: PipelineStage;
  success: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export interface PipelineExecutionContext {
  trigger: any;
  analysisResult?: any;
  plan?: any;
  validation?: any;
  stageResults: PipelineStageResult[];
  startTime: number;
}

export class ReleasePipeline {
  private context: PipelineExecutionContext;
  private stateManager?: WorkflowStateManager;
  private workflowId?: string;

  constructor(trigger: any, stateManager?: WorkflowStateManager, workflowId?: string) {
    this.context = {
      trigger,
      stageResults: [],
      startTime: Date.now()
    };
    this.stateManager = stateManager;
    this.workflowId = workflowId;
  }

  /**
   * Execute a pipeline stage
   * 
   * Requirements: 8.1, 8.2 - Persist state after each stage execution
   */
  async executeStage<T>(
    stage: PipelineStage,
    executor: () => Promise<T>
  ): Promise<{ success: boolean; result?: T; error?: string }> {
    const stageStartTime = Date.now();

    // Update state manager with current stage
    if (this.stateManager && this.workflowId) {
      await this.stateManager.setCurrentStage(this.workflowId, stage);
    }

    try {
      const result = await executor();
      const duration = Date.now() - stageStartTime;

      this.context.stageResults.push({
        stage,
        success: true,
        duration,
        details: result
      });

      // Record stage completion in state manager
      if (this.stateManager && this.workflowId) {
        await this.stateManager.recordStageCompletion(this.workflowId, stage, true);
        
        // Update context with stage result
        await this.stateManager.updateContext(this.workflowId, {
          [`${stage}Result`]: result,
          lastSuccessfulStage: stage
        });
      }

      return { success: true, result };
    } catch (error) {
      const duration = Date.now() - stageStartTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.context.stageResults.push({
        stage,
        success: false,
        duration,
        error: errorMessage
      });

      // Record stage failure in state manager
      if (this.stateManager && this.workflowId) {
        await this.stateManager.recordStageCompletion(this.workflowId, stage, false);
        
        // Update context with error
        await this.stateManager.updateContext(this.workflowId, {
          [`${stage}Error`]: errorMessage,
          lastFailedStage: stage
        });
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get pipeline execution context
   */
  getContext(): PipelineExecutionContext {
    return this.context;
  }

  /**
   * Get total pipeline duration
   */
  getDuration(): number {
    return Date.now() - this.context.startTime;
  }

  /**
   * Get failed stages
   */
  getFailedStages(): PipelineStageResult[] {
    return this.context.stageResults.filter(r => !r.success);
  }

  /**
   * Check if pipeline has failures
   */
  hasFailures(): boolean {
    return this.getFailedStages().length > 0;
  }

  /**
   * Get pipeline summary
   */
  getSummary(): {
    totalStages: number;
    successfulStages: number;
    failedStages: number;
    duration: number;
  } {
    const totalStages = this.context.stageResults.length;
    const failedStages = this.getFailedStages().length;
    const successfulStages = totalStages - failedStages;

    return {
      totalStages,
      successfulStages,
      failedStages,
      duration: this.getDuration()
    };
  }
}
