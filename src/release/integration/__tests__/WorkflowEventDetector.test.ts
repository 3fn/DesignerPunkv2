/**
 * Workflow Event Detector Integration Tests
 * 
 * Tests the integration between WorkflowMonitor, ReleaseDetector,
 * and the existing hook system.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { WorkflowEventDetector } from '../WorkflowEventDetector';
import { DetectionConfig } from '../../config/ReleaseConfig';

describe('WorkflowEventDetector Integration', () => {
  let detector: WorkflowEventDetector;
  let config: DetectionConfig;
  let tempDir: string;

  beforeEach(async () => {
    // Create temporary directory for test files
    tempDir = path.join(__dirname, 'temp-test-' + Date.now());
    await fs.mkdir(tempDir, { recursive: true });

    // Create test configuration
    config = {
      specCompletionTrigger: true,
      taskCompletionTrigger: true,
      breakingChangeKeywords: ['breaking change', 'incompatible'],
      confidenceThreshold: 0.7,
      monitorPaths: [
        `${tempDir}/specs/*/completion/`,
        `${tempDir}/specs/*/tasks.md`
      ],
      completionPatterns: ['*-completion.md', 'spec-completion-summary.md']
    };

    detector = new WorkflowEventDetector(config, {
      enableAutoProcessing: false // Disable for controlled testing
    });
  });

  afterEach(async () => {
    await detector.stop();
    
    // Clean up temporary directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist or be empty
    }
  });

  describe('Event Processing', () => {
    it('should process task completion events', async () => {
      const event = {
        type: 'task-completion' as const,
        source: 'test-tasks.md',
        timestamp: new Date(),
        metadata: {
          taskNumber: '2.3',
          taskDescription: 'Build workflow event monitoring',
          commitHash: 'abc123',
          triggerSource: 'test'
        }
      };

      const result = await detector.processEvent(event);

      expect(result.event).toEqual(event);
      expect(result.processed).toBe(true);
      expect(result.retryCount).toBe(0);
      // Release signal might be null if no completion document exists
    });

    it('should process spec completion events', async () => {
      const event = {
        type: 'spec-completion' as const,
        source: `${tempDir}/specs/test-spec/completion/spec-completion-summary.md`,
        timestamp: new Date(),
        metadata: {
          specName: 'test-spec',
          triggerSource: 'test'
        }
      };

      const result = await detector.processEvent(event);

      expect(result.event).toEqual(event);
      expect(result.processed).toBe(true);
      expect(result.retryCount).toBe(0);
    });

    it('should handle hook trigger events', async () => {
      const event = {
        type: 'hook-trigger' as const,
        source: 'test-trigger.json',
        timestamp: new Date(),
        metadata: {
          type: 'task-completion',
          source: 'test-tasks.md',
          taskName: 'Test Task',
          triggerSource: 'hook-system'
        }
      };

      const result = await detector.processEvent(event);

      expect(result.event).toEqual(event);
      expect(result.processed).toBe(true);
    });
  });

  describe('Hook Integration', () => {
    it('should process hook trigger files', async () => {
      // Create a test trigger file
      const triggersDir = path.join(tempDir, 'release-triggers');
      await fs.mkdir(triggersDir, { recursive: true });

      // Create a test tasks.md file that the trigger references
      const testTasksFile = path.join(tempDir, 'test-tasks.md');
      await fs.writeFile(testTasksFile, `
# Test Tasks

- [x] 2.3 Build workflow event monitoring
  - Integrate with existing hook system to detect completion events
  - Implement file system monitoring for completion document creation
  - Create event queuing and processing system for release triggers
`);

      const triggerFile = path.join(triggersDir, 'test-trigger.json');
      const triggerData = {
        id: 'test-trigger-123',
        type: 'task-completion',
        source: testTasksFile,
        triggeredAt: new Date().toISOString(),
        status: 'pending',
        git: {
          commit: 'abc123',
          branch: 'main',
          message: 'Task 2.3 Complete: Build workflow event monitoring'
        }
      };

      await fs.writeFile(triggerFile, JSON.stringify(triggerData, null, 2));

      // Create test detector
      const testDetector = new WorkflowEventDetector(config);

      // Process the trigger file using the specific triggers directory
      const results = await testDetector.processHookTriggers(triggersDir);

      expect(results).toHaveLength(1);
      expect(results[0].processed).toBe(true);
      expect(results[0].event.type).toBe('task-completion');

      // Verify trigger file was updated
      const updatedTrigger = JSON.parse(await fs.readFile(triggerFile, 'utf-8'));
      expect(updatedTrigger.status).toBe('processed');
      expect(updatedTrigger.processedAt).toBeDefined();

      await testDetector.stop();
    });
  });

  describe('System Status', () => {
    it('should provide accurate status information', async () => {
      const status = detector.getStatus();

      expect(status).toHaveProperty('monitoring');
      expect(status).toHaveProperty('processing');
      expect(status).toHaveProperty('queueStatus');
      expect(status).toHaveProperty('resultsCount');
      expect(status).toHaveProperty('recentEvents');

      expect(typeof status.monitoring).toBe('boolean');
      expect(typeof status.processing).toBe('boolean');
      expect(Array.isArray(status.recentEvents)).toBe(true);
    });

    it('should track processing results', async () => {
      const event = {
        type: 'task-completion' as const,
        source: 'test-source',
        timestamp: new Date(),
        metadata: {}
      };

      await detector.processEvent(event);

      const results = detector.getProcessingResults();
      expect(results).toHaveLength(1);
      expect(results[0].event).toEqual(event);
    });
  });

  describe('Error Handling', () => {
    it('should handle processing errors gracefully', async () => {
      const event = {
        type: 'spec-completion' as const,
        source: '/nonexistent/path/completion.md',
        timestamp: new Date(),
        metadata: {}
      };

      const result = await detector.processEvent(event);

      // The event is processed (no error thrown), but no release signal is generated
      expect(result.processed).toBe(true);
      expect(result.releaseSignal).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('should handle malformed trigger files', async () => {
      const triggersDir = path.join(tempDir, 'release-triggers');
      await fs.mkdir(triggersDir, { recursive: true });

      const triggerFile = path.join(triggersDir, 'malformed-trigger.json');
      await fs.writeFile(triggerFile, 'invalid json content');

      const testDetector = new WorkflowEventDetector(config);

      // Suppress expected console.error for malformed JSON
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Should not throw, but handle gracefully
      const results = await testDetector.processHookTriggers(triggersDir);
      expect(results).toHaveLength(0);

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error processing trigger file'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
      await testDetector.stop();
    });
  });
});

describe('WorkflowEventDetector CLI Integration', () => {
  let detector: WorkflowEventDetector;
  let config: DetectionConfig;

  beforeEach(() => {
    config = {
      specCompletionTrigger: true,
      taskCompletionTrigger: true,
      breakingChangeKeywords: ['breaking change'],
      confidenceThreshold: 0.7,
      monitorPaths: ['.kiro/specs/*/completion/', '.kiro/specs/*/tasks.md'],
      completionPatterns: ['*-completion.md']
    };

    detector = new WorkflowEventDetector(config);
  });

  afterEach(async () => {
    await detector.stop();
  });

  it('should handle CLI commands', async () => {
    // Test status command
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    await detector.processCliCommand('status', []);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Workflow Event Detector Status')
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle unknown CLI commands', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    await detector.processCliCommand('unknown-command', []);
    
    expect(consoleSpy).toHaveBeenCalledWith('Unknown command:', 'unknown-command');
    
    consoleSpy.mockRestore();
  });
});