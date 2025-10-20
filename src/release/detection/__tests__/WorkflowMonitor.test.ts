/**
 * Unit Tests for Workflow Event Monitor
 * 
 * Tests workflow event detection, processing, and queue management.
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import { WorkflowMonitor, WorkflowEvent } from '../WorkflowMonitor';
import { DetectionConfig, DEFAULT_RELEASE_CONFIG } from '../../config/ReleaseConfig';

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn()
  }
}));

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('WorkflowMonitor', () => {
  let monitor: WorkflowMonitor;
  let config: DetectionConfig;

  beforeEach(() => {
    config = {
      ...DEFAULT_RELEASE_CONFIG.detection,
      monitorPaths: [
        '.kiro/specs/*/completion/*.md',
        '.kiro/specs/*/tasks.md'
      ]
    };
    monitor = new WorkflowMonitor(config, {
      pollInterval: 100, // Fast polling for tests
      enableFileWatching: true,
      enableHookIntegration: true
    });
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    monitor.stopMonitoring();
  });

  describe('Event Detection', () => {
    it('should detect task completion events', async () => {
      const completionFiles = ['task-1-completion.md'];
      const completionPath = '.kiro/specs/test-spec/completion';

      mockFs.readdir.mockResolvedValue(completionFiles as any);
      mockFs.stat.mockResolvedValue({
        mtime: new Date(Date.now() + 1000),
        isFile: () => true
      } as any);

      const events = await monitor.checkForCompletionEvents();

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('task-completion');
      expect(events[0].source).toContain('task-1-completion.md');
    });

    it('should detect spec completion events', async () => {
      const completionFiles = ['spec-completion-summary.md'];
      const completionPath = '.kiro/specs/test-spec/completion';

      mockFs.readdir.mockResolvedValue(completionFiles as any);
      mockFs.stat.mockResolvedValue({
        mtime: new Date(Date.now() + 1000),
        isFile: () => true
      } as any);

      const events = await monitor.checkForCompletionEvents();

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('spec-completion');
      expect(events[0].source).toContain('spec-completion-summary.md');
    });

    it('should detect file changes in tasks.md', async () => {
      const tasksPath = '.kiro/specs/test-spec/tasks.md';

      mockFs.stat.mockResolvedValue({
        mtime: new Date(Date.now() + 1000),
        isFile: () => true
      } as any);

      // Simulate file change by setting up initial state
      await monitor.checkForCompletionEvents();

      // Now check again with newer timestamp
      mockFs.stat.mockResolvedValue({
        mtime: new Date(Date.now() + 2000),
        isFile: () => true
      } as any);

      const events = await monitor.checkForCompletionEvents();

      expect(events.some(e => e.type === 'file-change' && e.source.includes('tasks.md'))).toBe(true);
    });
  });

  describe('Event Queue Management', () => {
    it('should queue events and process them in order', async () => {
      const processedEvents: WorkflowEvent[] = [];

      monitor.on('event-processed', (event: WorkflowEvent) => {
        processedEvents.push(event);
      });

      // Trigger multiple events
      await monitor.triggerEvent('task-completion', 'test-source-1');
      await monitor.triggerEvent('spec-completion', 'test-source-2');
      await monitor.triggerEvent('file-change', 'test-source-3');

      // Process the queue
      jest.advanceTimersByTime(1500);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(processedEvents).toHaveLength(3);
      expect(processedEvents[0].source).toBe('test-source-1');
      expect(processedEvents[1].source).toBe('test-source-2');
      expect(processedEvents[2].source).toBe('test-source-3');
    });

    it('should respect queue size limits', async () => {
      const smallQueueMonitor = new WorkflowMonitor(config, {
        pollInterval: 100,
        enableFileWatching: false,
        enableHookIntegration: false
      });

      // Set small queue size for testing
      (smallQueueMonitor as any).eventQueue.maxSize = 2;

      // Add more events than queue size
      await smallQueueMonitor.triggerEvent('task-completion', 'source-1');
      await smallQueueMonitor.triggerEvent('task-completion', 'source-2');
      await smallQueueMonitor.triggerEvent('task-completion', 'source-3');

      const queueStatus = smallQueueMonitor.getQueueStatus();
      expect(queueStatus.queueLength).toBe(2); // Should not exceed maxSize

      smallQueueMonitor.stopMonitoring();
    });

    it('should clear queue when requested', async () => {
      await monitor.triggerEvent('task-completion', 'test-source');
      
      let queueStatus = monitor.getQueueStatus();
      expect(queueStatus.queueLength).toBe(1);

      monitor.clearQueue();

      queueStatus = monitor.getQueueStatus();
      expect(queueStatus.queueLength).toBe(0);
      expect(queueStatus.processing).toBe(false);
    });
  });

  describe('Hook Integration', () => {
    it('should detect git commit events for task completion', async () => {
      const commitHash = 'abc123def456';
      const commitMessage = 'Task 1.1 Complete: Implement validation system';

      mockExecSync
        .mockReturnValueOnce(commitHash) // git rev-parse HEAD
        .mockReturnValueOnce(commitMessage); // git log -1

      const detectedEvents: WorkflowEvent[] = [];
      monitor.on('workflow-event', (event: WorkflowEvent) => {
        detectedEvents.push(event);
      });

      // Simulate git commit monitoring
      await (monitor as any).setupGitCommitMonitoring();

      // Advance timers to trigger git check
      jest.advanceTimersByTime(10000);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(detectedEvents.some(e => 
        e.type === 'task-completion' && 
        e.metadata.taskNumber === '1.1' &&
        e.metadata.commitHash === commitHash
      )).toBe(true);
    });

    it('should process trigger files from hook system', async () => {
      const triggerData = {
        type: 'task-completion',
        source: '.kiro/specs/test-spec/tasks.md',
        taskName: '1.1 Test task',
        status: 'pending',
        triggeredAt: new Date().toISOString()
      };

      mockFs.readdir.mockResolvedValue(['trigger-1.json'] as any);
      mockFs.readFile.mockResolvedValue(JSON.stringify(triggerData));
      mockFs.writeFile.mockResolvedValue(undefined);

      const detectedEvents: WorkflowEvent[] = [];
      monitor.on('workflow-event', (event: WorkflowEvent) => {
        detectedEvents.push(event);
      });

      // Simulate trigger directory monitoring
      await (monitor as any).setupHookIntegration();

      // Advance timers to trigger check
      jest.advanceTimersByTime(2000);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(detectedEvents.some(e => 
        e.type === 'task-completion' && 
        e.metadata.taskName === '1.1 Test task'
      )).toBe(true);
    });

    it('should monitor file organization events', async () => {
      const organizationLogContent = `
[2025-01-10 10:00:00] Organized: task-1-completion.md -> .kiro/specs/test-spec/completion/
[2025-01-10 10:01:00] Organized: spec-completion-summary.md -> .kiro/specs/test-spec/completion/
`;

      mockFs.stat.mockResolvedValue({
        size: organizationLogContent.length
      } as any);
      mockFs.readFile.mockResolvedValue(organizationLogContent);

      const detectedEvents: WorkflowEvent[] = [];
      monitor.on('workflow-event', (event: WorkflowEvent) => {
        detectedEvents.push(event);
      });

      // Simulate file organization monitoring
      await (monitor as any).setupFileOrganizationMonitoring();

      // Advance timers to trigger check
      jest.advanceTimersByTime(5000);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(detectedEvents.some(e => 
        e.type === 'file-change' && 
        e.metadata.logEntry?.includes('completion.md')
      )).toBe(true);
    });
  });

  describe('Event Processing', () => {
    it('should process task completion events', async () => {
      const event: WorkflowEvent = {
        type: 'task-completion',
        source: '.kiro/specs/test-spec/completion/task-1-completion.md',
        timestamp: new Date(),
        metadata: {}
      };

      const tasksContent = `
# Implementation Plan

- [ ] 1. Main Task
- [x] 1.1 Implement validation system
  - Create interfaces
  - _Requirements: 1.1_
`;

      mockFs.readFile.mockResolvedValue(tasksContent);

      const emittedEvents: any[] = [];
      monitor.on('task-completion-detected', (data: any) => {
        emittedEvents.push(data);
      });

      await monitor.processWorkflowEvent(event);

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].taskName).toBe('Implement validation system');
      expect(emittedEvents[0].taskNumber).toBe('1');
    });

    it('should process spec completion events', async () => {
      const event: WorkflowEvent = {
        type: 'spec-completion',
        source: '.kiro/specs/test-spec/completion/spec-completion-summary.md',
        timestamp: new Date(),
        metadata: {}
      };

      const emittedEvents: any[] = [];
      monitor.on('spec-completion-detected', (data: any) => {
        emittedEvents.push(data);
      });

      await monitor.processWorkflowEvent(event);

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].specName).toBe('test-spec');
      expect(emittedEvents[0].completionPath).toBe(event.source);
    });

    it('should process file change events for tasks.md', async () => {
      const event: WorkflowEvent = {
        type: 'file-change',
        source: '.kiro/specs/test-spec/tasks.md',
        timestamp: new Date(),
        metadata: {}
      };

      const tasksContent = `
# Implementation Plan

- [x] 1. Completed Task
- [x] 2. Another Completed Task
- [ ] 3. Pending Task
`;

      mockFs.readFile.mockResolvedValue(tasksContent);

      const emittedEvents: any[] = [];
      monitor.on('task-status-changed', (data: any) => {
        emittedEvents.push(data);
      });

      await monitor.processWorkflowEvent(event);

      expect(emittedEvents).toHaveLength(2);
      expect(emittedEvents[0].taskName).toBe('Completed Task');
      expect(emittedEvents[0].status).toBe('completed');
      expect(emittedEvents[1].taskName).toBe('Another Completed Task');
    });

    it('should process hook trigger events', async () => {
      const event: WorkflowEvent = {
        type: 'hook-trigger',
        source: '.kiro/release-triggers/trigger-1.json',
        timestamp: new Date(),
        metadata: {
          triggerType: 'task-completion',
          source: '.kiro/specs/test-spec/tasks.md',
          taskName: '1.1 Test task'
        }
      };

      const emittedEvents: any[] = [];
      monitor.on('task-completion-detected', (data: any) => {
        emittedEvents.push(data);
      });

      await monitor.processWorkflowEvent(event);

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].taskName).toBe('1.1 Test task');
    });
  });

  describe('Monitoring Lifecycle', () => {
    it('should start and stop monitoring correctly', async () => {
      expect((monitor as any).isMonitoring).toBe(false);

      await monitor.startMonitoring();
      expect((monitor as any).isMonitoring).toBe(true);

      await monitor.stopMonitoring();
      expect((monitor as any).isMonitoring).toBe(false);
    });

    it('should not start monitoring if already monitoring', async () => {
      await monitor.startMonitoring();
      const firstState = (monitor as any).isMonitoring;

      await monitor.startMonitoring(); // Should not change state
      const secondState = (monitor as any).isMonitoring;

      expect(firstState).toBe(true);
      expect(secondState).toBe(true);
    });

    it('should emit monitoring events', async () => {
      const events: string[] = [];

      monitor.on('monitoring-started', () => events.push('started'));
      monitor.on('monitoring-stopped', () => events.push('stopped'));

      await monitor.startMonitoring();
      await monitor.stopMonitoring();

      expect(events).toEqual(['started', 'stopped']);
    });
  });

  describe('Path Expansion and Matching', () => {
    it('should expand glob paths correctly', async () => {
      const globPath = '.kiro/specs/*/completion/*.md';

      mockFs.readdir
        .mockResolvedValueOnce([
          { name: 'test-spec', isDirectory: () => true, isFile: () => false },
          { name: 'another-spec', isDirectory: () => true, isFile: () => false }
        ] as any)
        .mockResolvedValueOnce([
          { name: 'completion', isDirectory: () => true, isFile: () => false }
        ] as any)
        .mockResolvedValueOnce([
          { name: 'task-1-completion.md', isDirectory: () => false, isFile: () => true }
        ] as any)
        .mockResolvedValueOnce([
          { name: 'completion', isDirectory: () => true, isFile: () => false }
        ] as any)
        .mockResolvedValueOnce([
          { name: 'spec-completion-summary.md', isDirectory: () => false, isFile: () => true }
        ] as any);

      const expandedPaths = await (monitor as any).expandGlobPath(globPath);

      expect(expandedPaths).toContain('.kiro/specs/test-spec/completion/task-1-completion.md');
      expect(expandedPaths).toContain('.kiro/specs/another-spec/completion/spec-completion-summary.md');
    });

    it('should match glob patterns correctly', async () => {
      const matchesPattern = (monitor as any).matchesPattern.bind(monitor);

      expect(matchesPattern('task-1-completion.md', '*-completion.md')).toBe(true);
      expect(matchesPattern('spec-completion-summary.md', '*-completion*.md')).toBe(true);
      expect(matchesPattern('tasks.md', '*.md')).toBe(true);
      expect(matchesPattern('readme.txt', '*.md')).toBe(false);
    });

    it('should determine event types from file paths', async () => {
      const determineEventType = (monitor as any).determineEventType.bind(monitor);

      expect(determineEventType('.kiro/specs/test/completion/task-1-completion.md')).toBe('task-completion');
      expect(determineEventType('.kiro/specs/test/completion/spec-completion-summary.md')).toBe('spec-completion');
      expect(determineEventType('.kiro/specs/test/tasks.md')).toBe('file-change');
      expect(determineEventType('src/some-file.ts')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle file system errors gracefully', async () => {
      mockFs.readdir.mockRejectedValue(new Error('Permission denied'));

      const events = await monitor.checkForCompletionEvents();

      expect(events).toEqual([]);
    });

    it('should handle git command errors', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Git not available');
      });

      // Should not throw error
      await (monitor as any).setupGitCommitMonitoring();

      // Advance timers to trigger git check
      jest.advanceTimersByTime(10000);
      await new Promise(resolve => setTimeout(resolve, 0));

      // Should continue working despite git errors
      expect(true).toBe(true);
    });

    it('should handle malformed trigger files', async () => {
      mockFs.readdir.mockResolvedValue(['invalid-trigger.json'] as any);
      mockFs.readFile.mockResolvedValue('invalid json content');

      // Should not throw error
      await (monitor as any).setupHookIntegration();

      jest.advanceTimersByTime(2000);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(true).toBe(true);
    });

    it('should emit error events for processing failures', async () => {
      const errors: Error[] = [];
      monitor.on('error', (error: Error) => {
        errors.push(error);
      });

      // Trigger an event that will cause processing to fail
      mockFs.readFile.mockRejectedValue(new Error('File read error'));

      await monitor.triggerEvent('task-completion', '.kiro/specs/test/completion/task-1-completion.md');

      jest.advanceTimersByTime(1500);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Task Name Extraction', () => {
    it('should extract task names from tasks.md content', async () => {
      const tasksContent = `
# Implementation Plan

- [ ] 1. Main Task One
- [ ] 1.1 Sub Task One
- [ ] 1.2 Sub Task Two
- [ ] 2. Main Task Two
- [ ] 2.1 Another Sub Task
`;

      const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

      expect(extractTaskName(tasksContent, '1')).toBe('Main Task One');
      expect(extractTaskName(tasksContent, '1.1')).toBe('Sub Task One');
      expect(extractTaskName(tasksContent, '2')).toBe('Main Task Two');
      expect(extractTaskName(tasksContent, '2.1')).toBe('Another Sub Task');
      expect(extractTaskName(tasksContent, '3')).toBeNull();
    });
  });
});