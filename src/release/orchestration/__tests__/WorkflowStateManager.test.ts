/**
 * Workflow State Manager Tests
 * 
 * Tests workflow state tracking, persistence, validation, and recovery.
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real file system operations
 * - Isolated test directory: Each test uses unique temporary directory
 * - State persistence: Validates actual JSON file creation and updates
 * 
 * Requirements: 8.1, 8.2
 */

import * as fs from 'fs';
import * as path from 'path';
import { WorkflowStateManager, WorkflowState, WorkflowStateData } from '../WorkflowStateManager';

describe('WorkflowStateManager', () => {
  let stateManager: WorkflowStateManager;
  let testStateDir: string;

  beforeEach(() => {
    // Use a test-specific state directory
    testStateDir = path.join(process.cwd(), '.kiro', 'test-release-state', `test-${Date.now()}`);
    stateManager = new WorkflowStateManager(testStateDir);
  });

  afterEach(() => {
    // Clean up test state directory
    if (fs.existsSync(testStateDir)) {
      fs.rmSync(testStateDir, { recursive: true, force: true });
    }
  });

  describe('Workflow Initialization', () => {
    it('should initialize a new workflow with pending state', async () => {
      const id = 'test-workflow-1';
      const type = 'release';
      const metadata = {
        version: '1.0.0',
        trigger: 'manual',
        packages: ['pkg1']
      };

      const state = await stateManager.initializeWorkflow(id, type, metadata);

      expect(state.id).toBe(id);
      expect(state.state).toBe('pending');
      expect(state.type).toBe(type);
      expect(state.metadata).toEqual(metadata);
      expect(state.completedStages).toEqual([]);
      expect(state.failedStages).toEqual([]);
      expect(state.context).toEqual({});
      expect(state.startedAt).toBeInstanceOf(Date);
      expect(state.updatedAt).toBeInstanceOf(Date);
      expect(state.completedAt).toBeUndefined();
    });

    it('should persist initialized workflow state', async () => {
      const id = 'test-workflow-2';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const statePath = path.join(testStateDir, `${id}.json`);
      expect(fs.existsSync(statePath)).toBe(true);

      const data = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      expect(data.id).toBe(id);
      expect(data.state).toBe('pending');
    });
  });

  describe('State Transitions', () => {
    it('should transition from pending to in-progress', async () => {
      const id = 'test-workflow-3';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const updated = await stateManager.updateState(id, 'in-progress');

      expect(updated.state).toBe('in-progress');
      expect(updated.completedAt).toBeUndefined();
    });

    it('should transition from in-progress to completed', async () => {
      const id = 'test-workflow-4';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');

      const updated = await stateManager.updateState(id, 'completed');

      expect(updated.state).toBe('completed');
      expect(updated.completedAt).toBeInstanceOf(Date);
    });

    it('should transition from in-progress to failed', async () => {
      const id = 'test-workflow-5';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');

      const updated = await stateManager.updateState(id, 'failed', 'Test failure');

      expect(updated.state).toBe('failed');
      expect(updated.completedAt).toBeInstanceOf(Date);
    });

    it('should reject invalid state transitions', async () => {
      const id = 'test-workflow-6';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');
      await stateManager.updateState(id, 'completed');

      // Cannot transition from completed to in-progress
      await expect(
        stateManager.updateState(id, 'in-progress')
      ).rejects.toThrow('Invalid state transition');
    });

    it('should record state transition history', async () => {
      const id = 'test-workflow-7';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');
      await stateManager.updateState(id, 'completed');

      const history = stateManager.getStateHistory(id);

      expect(history.length).toBeGreaterThanOrEqual(3);
      expect(history[0].from).toBe('pending');
      expect(history[0].to).toBe('pending');
      expect(history[1].from).toBe('pending');
      expect(history[1].to).toBe('in-progress');
      expect(history[2].from).toBe('in-progress');
      expect(history[2].to).toBe('completed');
    });
  });

  describe('Context Management', () => {
    it('should update workflow context', async () => {
      const id = 'test-workflow-8';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const updated = await stateManager.updateContext(id, {
        analysisResult: { version: '1.0.0' },
        plan: { packages: ['pkg1'] }
      });

      expect(updated.context.analysisResult).toEqual({ version: '1.0.0' });
      expect(updated.context.plan).toEqual({ packages: ['pkg1'] });
    });

    it('should merge context updates', async () => {
      const id = 'test-workflow-9';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.updateContext(id, { key1: 'value1' });
      const updated = await stateManager.updateContext(id, { key2: 'value2' });

      expect(updated.context.key1).toBe('value1');
      expect(updated.context.key2).toBe('value2');
    });
  });

  describe('Stage Tracking', () => {
    it('should record successful stage completion', async () => {
      const id = 'test-workflow-10';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.setCurrentStage(id, 'analysis');
      const updated = await stateManager.recordStageCompletion(id, 'analysis', true);

      expect(updated.completedStages).toContain('analysis');
      expect(updated.failedStages).not.toContain('analysis');
      expect(updated.currentStage).toBeUndefined();
    });

    it('should record failed stage', async () => {
      const id = 'test-workflow-11';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.setCurrentStage(id, 'validation');
      const updated = await stateManager.recordStageCompletion(id, 'validation', false);

      expect(updated.failedStages).toContain('validation');
      expect(updated.completedStages).not.toContain('validation');
    });

    it('should track current stage', async () => {
      const id = 'test-workflow-12';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const updated = await stateManager.setCurrentStage(id, 'planning');

      expect(updated.currentStage).toBe('planning');
    });

    it('should not duplicate completed stages', async () => {
      const id = 'test-workflow-13';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.recordStageCompletion(id, 'analysis', true);
      await stateManager.recordStageCompletion(id, 'analysis', true);

      const state = stateManager.getState(id);
      expect(state?.completedStages.filter(s => s === 'analysis').length).toBe(1);
    });
  });

  describe('State Validation', () => {
    it('should validate consistent state', async () => {
      const id = 'test-workflow-14';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');
      await stateManager.updateState(id, 'completed');

      const validation = stateManager.validateState(id);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect missing completion timestamp', async () => {
      const id = 'test-workflow-15';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      // Manually corrupt state
      const state = stateManager.getState(id)!;
      state.state = 'completed';
      state.completedAt = undefined;

      const validation = stateManager.validateState(id);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Completed workflow missing completion timestamp');
    });

    it('should detect invalid timestamps', async () => {
      const id = 'test-workflow-16';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      // Manually corrupt state
      const state = stateManager.getState(id)!;
      state.completedAt = new Date(state.startedAt.getTime() - 1000);

      const validation = stateManager.validateState(id);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Completion time is before start time');
    });

    it('should warn about completed workflow with failed stages', async () => {
      const id = 'test-workflow-17';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');
      await stateManager.recordStageCompletion(id, 'analysis', false);
      await stateManager.updateState(id, 'completed');

      const validation = stateManager.validateState(id);

      expect(validation.warnings).toContain('Completed workflow has failed stages');
    });
  });

  describe('State Persistence and Recovery', () => {
    it('should persist state to disk', async () => {
      const id = 'test-workflow-18';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id, 'in-progress');

      const statePath = path.join(testStateDir, `${id}.json`);
      expect(fs.existsSync(statePath)).toBe(true);

      const data = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      expect(data.state).toBe('in-progress');
    });

    it('should recover state from disk', async () => {
      const id = 'test-workflow-19';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: ['pkg1']
      });
      await stateManager.updateState(id, 'in-progress');

      // Create new state manager instance
      const newStateManager = new WorkflowStateManager(testStateDir);
      const recovered = await newStateManager.recoverState(id);

      expect(recovered).not.toBeNull();
      expect(recovered?.id).toBe(id);
      expect(recovered?.state).toBe('in-progress');
      expect(recovered?.metadata.packages).toEqual(['pkg1']);
    });

    it('should revive Date objects on recovery', async () => {
      const id = 'test-workflow-20';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const newStateManager = new WorkflowStateManager(testStateDir);
      const recovered = await newStateManager.recoverState(id);

      expect(recovered?.startedAt).toBeInstanceOf(Date);
      expect(recovered?.updatedAt).toBeInstanceOf(Date);
    });

    it('should load all persisted states', async () => {
      await stateManager.initializeWorkflow('workflow-1', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.initializeWorkflow('workflow-2', 'release', {
        version: '1.1.0',
        trigger: 'automatic',
        packages: []
      });

      const newStateManager = new WorkflowStateManager(testStateDir);
      await newStateManager.loadAllStates();

      expect(newStateManager.getState('workflow-1')).not.toBeUndefined();
      expect(newStateManager.getState('workflow-2')).not.toBeUndefined();
    });

    it('should return null for non-existent state', async () => {
      const recovered = await stateManager.recoverState('non-existent');
      expect(recovered).toBeNull();
    });
  });

  describe('State Queries', () => {
    beforeEach(async () => {
      await stateManager.initializeWorkflow('workflow-1', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState('workflow-1', 'in-progress');

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));

      await stateManager.initializeWorkflow('workflow-2', 'release', {
        version: '1.1.0',
        trigger: 'automatic',
        packages: []
      });
      await stateManager.updateState('workflow-2', 'in-progress');
      await stateManager.updateState('workflow-2', 'completed');

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));

      await stateManager.initializeWorkflow('workflow-3', 'hotfix', {
        version: '1.0.1',
        trigger: 'manual',
        packages: []
      });
    });

    it('should query workflows by state', () => {
      const inProgress = stateManager.queryWorkflows({ state: 'in-progress' });
      expect(inProgress.length).toBe(1);
      expect(inProgress[0].id).toBe('workflow-1');

      const completed = stateManager.queryWorkflows({ state: 'completed' });
      expect(completed.length).toBe(1);
      expect(completed[0].id).toBe('workflow-2');
    });

    it('should query workflows by type', () => {
      const releases = stateManager.queryWorkflows({ type: 'release' });
      expect(releases.length).toBe(2);

      const hotfixes = stateManager.queryWorkflows({ type: 'hotfix' });
      expect(hotfixes.length).toBe(1);
      expect(hotfixes[0].id).toBe('workflow-3');
    });

    it('should query workflows with limit', () => {
      const limited = stateManager.queryWorkflows({ limit: 2 });
      expect(limited.length).toBe(2);
    });

    it('should query workflows by date range', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 1000);

      const results = stateManager.queryWorkflows({ until: future });
      expect(results.length).toBe(3);
    });

    it('should return workflows sorted by start time', () => {
      const all = stateManager.queryWorkflows();
      expect(all.length).toBe(3);
      // Most recent first (workflow-3 was created last)
      expect(all[0].id).toBe('workflow-3');
      // Oldest last (workflow-1 was created first)
      expect(all[all.length - 1].id).toBe('workflow-1');
    });
  });

  describe('State Cleanup', () => {
    it('should clean up old completed workflows', async () => {
      const id1 = 'old-workflow-1';
      const id2 = 'old-workflow-2';
      const id3 = 'recent-workflow';

      await stateManager.initializeWorkflow(id1, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id1, 'in-progress');
      await stateManager.updateState(id1, 'completed');

      await stateManager.initializeWorkflow(id2, 'release', {
        version: '1.1.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(id2, 'in-progress');
      await stateManager.updateState(id2, 'failed');

      await stateManager.initializeWorkflow(id3, 'release', {
        version: '1.2.0',
        trigger: 'manual',
        packages: []
      });

      // Manually set old completion dates
      const state1 = stateManager.getState(id1)!;
      state1.completedAt = new Date(Date.now() - 10000);

      const state2 = stateManager.getState(id2)!;
      state2.completedAt = new Date(Date.now() - 10000);

      const cutoff = new Date(Date.now() - 5000);
      const cleaned = await stateManager.cleanupOldStates(cutoff);

      expect(cleaned).toBe(2);
      expect(stateManager.getState(id1)).toBeUndefined();
      expect(stateManager.getState(id2)).toBeUndefined();
      expect(stateManager.getState(id3)).not.toBeUndefined();
    });

    it('should delete workflow state', async () => {
      const id = 'test-workflow-delete';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.deleteState(id);

      expect(stateManager.getState(id)).toBeUndefined();
      const statePath = path.join(testStateDir, `${id}.json`);
      expect(fs.existsSync(statePath)).toBe(false);
    });
  });

  describe('Statistics', () => {
    beforeEach(async () => {
      await stateManager.initializeWorkflow('workflow-1', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState('workflow-1', 'in-progress');
      await stateManager.updateState('workflow-1', 'completed');

      await stateManager.initializeWorkflow('workflow-2', 'release', {
        version: '1.1.0',
        trigger: 'automatic',
        packages: []
      });
      await stateManager.updateState('workflow-2', 'in-progress');

      await stateManager.initializeWorkflow('workflow-3', 'hotfix', {
        version: '1.0.1',
        trigger: 'manual',
        packages: []
      });
    });

    it('should calculate workflow statistics', () => {
      const stats = stateManager.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.byState.completed).toBe(1);
      expect(stats.byState['in-progress']).toBe(1);
      expect(stats.byState.pending).toBe(1);
      expect(stats.byType.release).toBe(2);
      expect(stats.byType.hotfix).toBe(1);
    });

    it('should calculate average duration for completed workflows', () => {
      const stats = stateManager.getStatistics();

      // Average duration should be >= 0 (may be 0 if workflow completed instantly)
      expect(stats.averageDuration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when updating non-existent workflow', async () => {
      await expect(
        stateManager.updateState('non-existent', 'in-progress')
      ).rejects.toThrow('Workflow non-existent not found');
    });

    it('should throw error when updating context for non-existent workflow', async () => {
      await expect(
        stateManager.updateContext('non-existent', {})
      ).rejects.toThrow('Workflow non-existent not found');
    });

    it('should throw error when recording stage for non-existent workflow', async () => {
      await expect(
        stateManager.recordStageCompletion('non-existent', 'analysis', true)
      ).rejects.toThrow('Workflow non-existent not found');
    });

    it('should throw error when setting stage for non-existent workflow', async () => {
      await expect(
        stateManager.setCurrentStage('non-existent', 'analysis')
      ).rejects.toThrow('Workflow non-existent not found');
    });
  });

  describe('Concurrent Access', () => {
    it('should handle concurrent state updates', async () => {
      const id = 'concurrent-workflow';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      // Simulate concurrent updates
      await Promise.all([
        stateManager.updateContext(id, { key1: 'value1' }),
        stateManager.updateContext(id, { key2: 'value2' }),
        stateManager.updateContext(id, { key3: 'value3' })
      ]);

      const state = stateManager.getState(id);
      expect(state?.context.key1).toBe('value1');
      expect(state?.context.key2).toBe('value2');
      expect(state?.context.key3).toBe('value3');
    });

    it('should handle concurrent stage completions', async () => {
      const id = 'concurrent-stages';
      await stateManager.initializeWorkflow(id, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await Promise.all([
        stateManager.recordStageCompletion(id, 'analysis', true),
        stateManager.recordStageCompletion(id, 'planning', true),
        stateManager.recordStageCompletion(id, 'validation', true)
      ]);

      const state = stateManager.getState(id);
      expect(state?.completedStages).toContain('analysis');
      expect(state?.completedStages).toContain('planning');
      expect(state?.completedStages).toContain('validation');
    });
  });
});
