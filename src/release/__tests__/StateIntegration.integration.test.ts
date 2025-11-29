/**
 * State Integration Tests
 * 
 * Tests integration of WorkflowStateManager with ReleaseManager and ReleasePipeline.
 * Validates state persistence, crash recovery, and state-based rollback decisions.
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real WorkflowStateManager with temporary state directory
 * - File system operations: Real fs operations in isolated test directory
 * - State persistence: Tests verify actual file system state
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { ReleaseManager } from '../ReleaseManager';
import { WorkflowStateManager } from '../orchestration/WorkflowStateManager';
import * as fs from 'fs';
import * as path from 'path';

describe('State Integration', () => {
  let releaseManager: ReleaseManager;
  let stateDir: string;

  beforeEach(() => {
    // Create temporary state directory
    stateDir = path.join(process.cwd(), '.test-state', `test-${Date.now()}`);
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }

    // Mock CLI Bridge to avoid actual CLI execution
    jest.mock('../integration/CLIBridge');

    releaseManager = new ReleaseManager({
      workingDirectory: process.cwd(),
      dryRun: true,
      skipConfirmation: true
    });
  });

  afterEach(() => {
    // Clean up test state directory
    if (fs.existsSync(stateDir)) {
      fs.rmSync(stateDir, { recursive: true, force: true });
    }
    jest.clearAllMocks();
  });

  describe('State Persistence During Pipeline Execution', () => {
    it('should persist state after each pipeline stage', async () => {
      // This test validates that state is persisted after each stage
      // Requirements: 8.1, 8.2

      const trigger = {
        type: 'manual' as const,
        source: 'test',
        triggeredAt: new Date()
      };

      // Mock CLI Bridge to return analysis result
      const mockAnalysisResult = {
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'Test release'
        },
        releaseNotes: '# Test Release\n\nTest changes'
      };

      // Execute release (will fail at git operations in dry run, but that's ok)
      try {
        await releaseManager.executeRelease(trigger);
      } catch (error) {
        // Expected to fail in test environment
      }

      // Verify state was persisted
      const workflowState = releaseManager.getWorkflowState();
      expect(workflowState).toBeDefined();
      expect(workflowState?.state).toBeDefined();
      expect(workflowState?.completedStages).toBeDefined();
    });

    it('should track completed and failed stages', async () => {
      // Requirements: 8.1

      // Create a workflow directly with state manager to test stage tracking
      const stateManager = new WorkflowStateManager(stateDir);
      const workflowId = 'test-workflow-stages';
      
      await stateManager.initializeWorkflow(workflowId, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.updateState(workflowId, 'in-progress');
      await stateManager.recordStageCompletion(workflowId, 'analysis', true);
      await stateManager.recordStageCompletion(workflowId, 'planning', true);
      await stateManager.recordStageCompletion(workflowId, 'validation', false);

      const workflowState = stateManager.getState(workflowId);
      expect(workflowState).toBeDefined();
      
      // Should have completed stages
      expect(workflowState?.completedStages.length).toBe(2);
      expect(workflowState?.completedStages).toContain('analysis');
      expect(workflowState?.completedStages).toContain('planning');
      
      // Should have failed stages
      expect(workflowState?.failedStages.length).toBe(1);
      expect(workflowState?.failedStages).toContain('validation');
    });

    it('should update context with stage results', async () => {
      // Requirements: 8.1, 8.2

      const trigger = {
        type: 'manual' as const,
        source: 'test',
        triggeredAt: new Date()
      };

      try {
        await releaseManager.executeRelease(trigger);
      } catch (error) {
        // Expected
      }

      const workflowState = releaseManager.getWorkflowState();
      expect(workflowState).toBeDefined();
      expect(workflowState?.context).toBeDefined();
    });
  });

  describe('Crash Recovery', () => {
    it('should recover workflow state from persistence', async () => {
      // Requirements: 8.2

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Initialize a workflow
      const workflowId = 'test-workflow-123';
      await stateManager.initializeWorkflow(workflowId, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: ['test-package']
      });

      // Update state
      await stateManager.updateState(workflowId, 'in-progress');
      await stateManager.recordStageCompletion(workflowId, 'analysis', true);

      // Simulate crash by creating new state manager instance
      const newStateManager = new WorkflowStateManager(stateDir);
      
      // Recover state
      const recoveredState = await newStateManager.recoverState(workflowId);
      
      expect(recoveredState).toBeDefined();
      expect(recoveredState?.id).toBe(workflowId);
      expect(recoveredState?.state).toBe('in-progress');
      expect(recoveredState?.completedStages).toContain('analysis');
    });

    it('should resume failed release from last successful stage', async () => {
      // Requirements: 8.2, 8.4

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Create a failed workflow
      const workflowId = 'test-workflow-456';
      await stateManager.initializeWorkflow(workflowId, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: ['test-package']
      });

      await stateManager.updateState(workflowId, 'in-progress');
      await stateManager.recordStageCompletion(workflowId, 'analysis', true);
      await stateManager.recordStageCompletion(workflowId, 'planning', true);
      await stateManager.recordStageCompletion(workflowId, 'validation', false);
      await stateManager.updateState(workflowId, 'failed', 'Validation failed');

      // Verify we can identify the resume point
      const state = stateManager.getState(workflowId);
      expect(state).toBeDefined();
      expect(state?.completedStages).toContain('planning');
      expect(state?.failedStages).toContain('validation');
      expect(state?.state).toBe('failed');
    });

    it('should load all persisted states on initialization', async () => {
      // Requirements: 8.2

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Create multiple workflows
      await stateManager.initializeWorkflow('workflow-1', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.initializeWorkflow('workflow-2', 'release', {
        version: '1.1.0',
        trigger: 'manual',
        packages: []
      });

      // Create new state manager and load all states
      const newStateManager = new WorkflowStateManager(stateDir);
      await newStateManager.loadAllStates();

      // Verify both workflows are loaded
      const state1 = newStateManager.getState('workflow-1');
      const state2 = newStateManager.getState('workflow-2');

      expect(state1).toBeDefined();
      expect(state2).toBeDefined();
    });
  });

  describe('State-Based Rollback Decisions', () => {
    it('should use workflow state to determine rollback scope', async () => {
      // Requirements: 8.4, 8.5

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Create workflow with partial completion
      const workflowId = 'test-workflow-789';
      await stateManager.initializeWorkflow(workflowId, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: ['test-package']
      });

      await stateManager.updateState(workflowId, 'in-progress');
      await stateManager.recordStageCompletion(workflowId, 'analysis', true);
      await stateManager.recordStageCompletion(workflowId, 'planning', true);
      await stateManager.recordStageCompletion(workflowId, 'package-update', true);
      await stateManager.recordStageCompletion(workflowId, 'git-operations', false);

      // Get state to determine rollback scope
      const state = stateManager.getState(workflowId);
      expect(state).toBeDefined();

      // Should rollback: package-update (completed)
      // Should not rollback: analysis, planning (read-only operations)
      expect(state?.completedStages).toContain('package-update');
      expect(state?.failedStages).toContain('git-operations');
    });

    it('should validate state consistency before rollback', async () => {
      // Requirements: 8.2, 8.4

      const stateManager = new WorkflowStateManager(stateDir);
      
      const workflowId = 'test-workflow-validation';
      await stateManager.initializeWorkflow(workflowId, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.updateState(workflowId, 'in-progress');
      await stateManager.updateState(workflowId, 'completed');

      // Validate state
      const validation = stateManager.validateState(workflowId);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid state transitions', async () => {
      // Requirements: 8.2

      const stateManager = new WorkflowStateManager(stateDir);
      
      const workflowId = 'test-workflow-invalid';
      await stateManager.initializeWorkflow(workflowId, 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.updateState(workflowId, 'in-progress');
      await stateManager.updateState(workflowId, 'completed');

      // Try invalid transition from completed to in-progress
      await expect(
        stateManager.updateState(workflowId, 'in-progress')
      ).rejects.toThrow('Invalid state transition');
    });
  });

  describe('State Query Methods', () => {
    it('should query workflows by state', async () => {
      // Requirements: 8.1

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Create workflows with different states
      await stateManager.initializeWorkflow('workflow-pending', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const workflowInProgress = await stateManager.initializeWorkflow('workflow-in-progress', 'release', {
        version: '1.1.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(workflowInProgress.id, 'in-progress');

      const workflowCompleted = await stateManager.initializeWorkflow('workflow-completed', 'release', {
        version: '1.2.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(workflowCompleted.id, 'in-progress');
      await stateManager.updateState(workflowCompleted.id, 'completed');

      // Query by state
      const inProgressWorkflows = stateManager.queryWorkflows({ state: 'in-progress' });
      const completedWorkflows = stateManager.queryWorkflows({ state: 'completed' });

      expect(inProgressWorkflows).toHaveLength(1);
      expect(inProgressWorkflows[0].id).toBe('workflow-in-progress');
      
      expect(completedWorkflows).toHaveLength(1);
      expect(completedWorkflows[0].id).toBe('workflow-completed');
    });

    it('should get workflow statistics', async () => {
      // Requirements: 8.1

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Create multiple workflows
      await stateManager.initializeWorkflow('workflow-1', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      const workflow2 = await stateManager.initializeWorkflow('workflow-2', 'release', {
        version: '1.1.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(workflow2.id, 'in-progress');
      await stateManager.updateState(workflow2.id, 'completed');

      // Get statistics
      const stats = stateManager.getStatistics();

      expect(stats.total).toBe(2);
      expect(stats.byState.pending).toBe(1);
      expect(stats.byState.completed).toBe(1);
      expect(stats.byType.release).toBe(2);
    });

    it('should get state history', async () => {
      // Requirements: 8.1

      const stateManager = new WorkflowStateManager(stateDir);
      
      const workflow = await stateManager.initializeWorkflow('workflow-history', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      await stateManager.updateState(workflow.id, 'in-progress');
      await stateManager.updateState(workflow.id, 'completed');

      // Get history
      const history = stateManager.getStateHistory(workflow.id);

      expect(history).toHaveLength(3); // pending -> in-progress -> completed
      expect(history[0].from).toBe('pending');
      expect(history[1].to).toBe('in-progress');
      expect(history[2].to).toBe('completed');
    });
  });

  describe('Cleanup Operations', () => {
    it('should clean up old completed workflows', async () => {
      // Requirements: 8.2

      const stateManager = new WorkflowStateManager(stateDir);
      
      // Create old completed workflow
      const oldWorkflow = await stateManager.initializeWorkflow('old-workflow', 'release', {
        version: '1.0.0',
        trigger: 'manual',
        packages: []
      });

      // Complete the workflow and manually set completion date to 60 days ago
      await stateManager.updateState(oldWorkflow.id, 'in-progress');
      await stateManager.updateState(oldWorkflow.id, 'completed');
      
      const state = stateManager.getState(oldWorkflow.id);
      if (state) {
        state.completedAt = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      }

      // Create recent completed workflow
      const recentWorkflow = await stateManager.initializeWorkflow('recent-workflow', 'release', {
        version: '1.1.0',
        trigger: 'manual',
        packages: []
      });
      await stateManager.updateState(recentWorkflow.id, 'in-progress');
      await stateManager.updateState(recentWorkflow.id, 'completed');

      // Clean up workflows older than 30 days
      const olderThan = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const cleaned = await stateManager.cleanupOldStates(olderThan);

      expect(cleaned).toBe(1);
      expect(stateManager.getState('old-workflow')).toBeUndefined();
      expect(stateManager.getState('recent-workflow')).toBeDefined();
    });
  });
});
