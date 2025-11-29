/**
 * Workflow State Manager
 * 
 * Manages workflow state tracking, persistence, and recovery.
 * Provides state validation, consistency checks, and query interfaces.
 * 
 * Requirements: 8.1, 8.2
 */

import * as fs from 'fs';
import * as path from 'path';

export type WorkflowState = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface WorkflowStateData {
  /** Unique workflow identifier */
  id: string;
  
  /** Current workflow state */
  state: WorkflowState;
  
  /** Workflow type */
  type: string;
  
  /** Workflow start time */
  startedAt: Date;
  
  /** Workflow completion time */
  completedAt?: Date;
  
  /** Current stage being executed */
  currentStage?: string;
  
  /** Completed stages */
  completedStages: string[];
  
  /** Failed stages */
  failedStages: string[];
  
  /** Workflow context data */
  context: Record<string, any>;
  
  /** Workflow metadata */
  metadata: {
    version: string;
    trigger: string;
    packages: string[];
  };
  
  /** Last updated timestamp */
  updatedAt: Date;
}

export interface StateTransition {
  from: WorkflowState;
  to: WorkflowState;
  timestamp: Date;
  reason?: string;
}

export interface StateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StateQueryOptions {
  state?: WorkflowState;
  type?: string;
  since?: Date;
  until?: Date;
  limit?: number;
}

export class WorkflowStateManager {
  private stateDir: string;
  private currentState: Map<string, WorkflowStateData> = new Map();
  private stateHistory: Map<string, StateTransition[]> = new Map();

  constructor(stateDir?: string) {
    this.stateDir = stateDir || path.join(process.cwd(), '.kiro', 'release-state');
    this.ensureStateDirectory();
  }

  /**
   * Initialize a new workflow state
   * 
   * Requirements: 8.1
   */
  async initializeWorkflow(
    id: string,
    type: string,
    metadata: WorkflowStateData['metadata']
  ): Promise<WorkflowStateData> {
    const state: WorkflowStateData = {
      id,
      state: 'pending',
      type,
      startedAt: new Date(),
      completedStages: [],
      failedStages: [],
      context: {},
      metadata,
      updatedAt: new Date()
    };

    this.currentState.set(id, state);
    this.recordTransition(id, { from: 'pending', to: 'pending', timestamp: new Date() });
    await this.persistState(id);

    return state;
  }

  /**
   * Update workflow state
   * 
   * Requirements: 8.1
   */
  async updateState(
    id: string,
    newState: WorkflowState,
    reason?: string
  ): Promise<WorkflowStateData> {
    const current = this.currentState.get(id);
    if (!current) {
      throw new Error(`Workflow ${id} not found`);
    }

    // Validate state transition
    const validation = this.validateStateTransition(current.state, newState);
    if (!validation.valid) {
      throw new Error(`Invalid state transition: ${validation.errors.join(', ')}`);
    }

    // Record transition
    this.recordTransition(id, {
      from: current.state,
      to: newState,
      timestamp: new Date(),
      reason
    });

    // Update state
    current.state = newState;
    current.updatedAt = new Date();

    if (newState === 'completed' || newState === 'failed') {
      current.completedAt = new Date();
    }

    this.currentState.set(id, current);
    await this.persistState(id);

    return current;
  }

  /**
   * Update workflow context
   * 
   * Requirements: 8.1
   */
  async updateContext(
    id: string,
    contextUpdate: Record<string, any>
  ): Promise<WorkflowStateData> {
    const current = this.currentState.get(id);
    if (!current) {
      throw new Error(`Workflow ${id} not found`);
    }

    current.context = { ...current.context, ...contextUpdate };
    current.updatedAt = new Date();

    this.currentState.set(id, current);
    await this.persistState(id);

    return current;
  }

  /**
   * Record stage completion
   * 
   * Requirements: 8.1
   */
  async recordStageCompletion(
    id: string,
    stage: string,
    success: boolean
  ): Promise<WorkflowStateData> {
    const current = this.currentState.get(id);
    if (!current) {
      throw new Error(`Workflow ${id} not found`);
    }

    if (success) {
      if (!current.completedStages.includes(stage)) {
        current.completedStages.push(stage);
      }
    } else {
      if (!current.failedStages.includes(stage)) {
        current.failedStages.push(stage);
      }
    }

    current.currentStage = undefined;
    current.updatedAt = new Date();

    this.currentState.set(id, current);
    await this.persistState(id);

    return current;
  }

  /**
   * Set current stage
   * 
   * Requirements: 8.1
   */
  async setCurrentStage(id: string, stage: string): Promise<WorkflowStateData> {
    const current = this.currentState.get(id);
    if (!current) {
      throw new Error(`Workflow ${id} not found`);
    }

    current.currentStage = stage;
    current.updatedAt = new Date();

    this.currentState.set(id, current);
    await this.persistState(id);

    return current;
  }

  /**
   * Get workflow state
   * 
   * Requirements: 8.1
   */
  getState(id: string): WorkflowStateData | undefined {
    return this.currentState.get(id);
  }

  /**
   * Get state history
   * 
   * Requirements: 8.1
   */
  getStateHistory(id: string): StateTransition[] {
    return this.stateHistory.get(id) || [];
  }

  /**
   * Query workflows by criteria
   * 
   * Requirements: 8.1
   */
  queryWorkflows(options: StateQueryOptions = {}): WorkflowStateData[] {
    let results = Array.from(this.currentState.values());

    // Filter by state
    if (options.state) {
      results = results.filter(w => w.state === options.state);
    }

    // Filter by type
    if (options.type) {
      results = results.filter(w => w.type === options.type);
    }

    // Filter by date range
    if (options.since) {
      results = results.filter(w => w.startedAt >= options.since!);
    }

    if (options.until) {
      results = results.filter(w => w.startedAt <= options.until!);
    }

    // Sort by start time (most recent first)
    results.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

    // Apply limit
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Validate workflow state
   * 
   * Requirements: 8.2
   */
  validateState(id: string): StateValidationResult {
    const state = this.currentState.get(id);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!state) {
      errors.push(`Workflow ${id} not found`);
      return { valid: false, errors, warnings };
    }

    // Validate state consistency
    if (state.state === 'completed' && !state.completedAt) {
      errors.push('Completed workflow missing completion timestamp');
    }

    if (state.state === 'failed' && !state.completedAt) {
      errors.push('Failed workflow missing completion timestamp');
    }

    if (state.state === 'in-progress' && state.completedAt) {
      errors.push('In-progress workflow has completion timestamp');
    }

    // Validate stage consistency
    if (state.failedStages.length > 0 && state.state === 'completed') {
      warnings.push('Completed workflow has failed stages');
    }

    // Validate timestamps
    if (state.completedAt && state.completedAt < state.startedAt) {
      errors.push('Completion time is before start time');
    }

    if (state.updatedAt < state.startedAt) {
      errors.push('Update time is before start time');
    }

    // Validate metadata
    if (!state.metadata.version) {
      warnings.push('Missing version in metadata');
    }

    if (!state.metadata.trigger) {
      warnings.push('Missing trigger in metadata');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Recover workflow state from persistence
   * 
   * Requirements: 8.2
   */
  async recoverState(id: string): Promise<WorkflowStateData | null> {
    try {
      const statePath = this.getStatePath(id);
      
      if (!fs.existsSync(statePath)) {
        return null;
      }

      const data = fs.readFileSync(statePath, 'utf-8');
      const state = JSON.parse(data, (key, value) => {
        // Revive Date objects
        if (key === 'startedAt' || key === 'completedAt' || key === 'updatedAt') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });

      // Validate recovered state
      this.currentState.set(id, state);
      const validation = this.validateState(id);

      if (!validation.valid) {
        console.warn(`Recovered state for ${id} has validation errors:`, validation.errors);
      }

      return state;
    } catch (error) {
      console.error(`Failed to recover state for ${id}:`, error);
      return null;
    }
  }

  /**
   * Load all persisted states
   * 
   * Requirements: 8.2
   */
  async loadAllStates(): Promise<void> {
    try {
      if (!fs.existsSync(this.stateDir)) {
        return;
      }

      const files = fs.readdirSync(this.stateDir);
      const stateFiles = files.filter(f => f.endsWith('.json'));

      for (const file of stateFiles) {
        const id = file.replace('.json', '');
        await this.recoverState(id);
      }
    } catch (error) {
      console.error('Failed to load persisted states:', error);
    }
  }

  /**
   * Clean up old completed/failed workflows
   * 
   * Requirements: 8.2
   */
  async cleanupOldStates(olderThan: Date): Promise<number> {
    let cleaned = 0;

    for (const [id, state] of this.currentState.entries()) {
      if (
        (state.state === 'completed' || state.state === 'failed') &&
        state.completedAt &&
        state.completedAt < olderThan
      ) {
        await this.deleteState(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Delete workflow state
   * 
   * Requirements: 8.2
   */
  async deleteState(id: string): Promise<void> {
    this.currentState.delete(id);
    this.stateHistory.delete(id);

    const statePath = this.getStatePath(id);
    if (fs.existsSync(statePath)) {
      fs.unlinkSync(statePath);
    }
  }

  /**
   * Get workflow statistics
   * 
   * Requirements: 8.1
   */
  getStatistics(): {
    total: number;
    byState: Record<WorkflowState, number>;
    byType: Record<string, number>;
    averageDuration: number;
  } {
    const workflows = Array.from(this.currentState.values());
    const total = workflows.length;

    const byState: Record<WorkflowState, number> = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      failed: 0
    };

    const byType: Record<string, number> = {};
    let totalDuration = 0;
    let completedCount = 0;

    for (const workflow of workflows) {
      byState[workflow.state]++;

      byType[workflow.type] = (byType[workflow.type] || 0) + 1;

      if (workflow.completedAt) {
        totalDuration += workflow.completedAt.getTime() - workflow.startedAt.getTime();
        completedCount++;
      }
    }

    const averageDuration = completedCount > 0 ? totalDuration / completedCount : 0;

    return {
      total,
      byState,
      byType,
      averageDuration
    };
  }

  // Private helper methods

  private validateStateTransition(from: WorkflowState, to: WorkflowState): StateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Define valid transitions
    const validTransitions: Record<WorkflowState, WorkflowState[]> = {
      'pending': ['in-progress', 'failed'],
      'in-progress': ['completed', 'failed'],
      'completed': [],
      'failed': []
    };

    if (!validTransitions[from].includes(to)) {
      errors.push(`Invalid transition from ${from} to ${to}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private recordTransition(id: string, transition: StateTransition): void {
    const history = this.stateHistory.get(id) || [];
    history.push(transition);
    this.stateHistory.set(id, history);
  }

  private async persistState(id: string): Promise<void> {
    const state = this.currentState.get(id);
    if (!state) {
      return;
    }

    const statePath = this.getStatePath(id);
    const data = JSON.stringify(state, null, 2);

    fs.writeFileSync(statePath, data, 'utf-8');
  }

  private getStatePath(id: string): string {
    return path.join(this.stateDir, `${id}.json`);
  }

  private ensureStateDirectory(): void {
    if (!fs.existsSync(this.stateDir)) {
      fs.mkdirSync(this.stateDir, { recursive: true });
    }
  }
}
