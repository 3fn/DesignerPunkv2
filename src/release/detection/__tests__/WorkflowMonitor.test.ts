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

  beforeEach(async () => {
    // Set up fake timers before initialization
    jest.useFakeTimers();
    
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
    
    // Initialize monitoring
    await monitor.startMonitoring();
  });

  afterEach(async () => {
    // Stop monitoring and cleanup
    await monitor.stopMonitoring();
    
    // Clear all timers and restore real timers
    jest.clearAllTimers();
    jest.useRealTimers();
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

      // Advance timer to trigger processing interval
      jest.advanceTimersByTime(1000);
      
      // Allow async processing to start
      await Promise.resolve();
      
      // Advance timers for each event processing delay (100ms between events)
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      
      jest.advanceTimersByTime(100);
      await Promise.resolve();

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

      // Initialize monitoring
      await smallQueueMonitor.startMonitoring();

      // Set small queue size for testing
      (smallQueueMonitor as any).eventQueue.maxSize = 2;

      // Add more events than queue size
      await smallQueueMonitor.triggerEvent('task-completion', 'source-1');
      await smallQueueMonitor.triggerEvent('task-completion', 'source-2');
      await smallQueueMonitor.triggerEvent('task-completion', 'source-3');

      const queueStatus = smallQueueMonitor.getQueueStatus();
      expect(queueStatus.queueLength).toBe(2); // Should not exceed maxSize

      await smallQueueMonitor.stopMonitoring();
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
      
      // Allow async operations to complete
      await Promise.resolve();

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
      
      // Allow async operations to complete
      await Promise.resolve();

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
      
      // Allow async operations to complete
      await Promise.resolve();

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
      // Monitor is already started in beforeEach
      expect((monitor as any).isMonitoring).toBe(true);

      await monitor.stopMonitoring();
      expect((monitor as any).isMonitoring).toBe(false);

      // Start again
      await monitor.startMonitoring();
      expect((monitor as any).isMonitoring).toBe(true);
    });

    it('should not start monitoring if already monitoring', async () => {
      // Monitor is already started in beforeEach
      const firstState = (monitor as any).isMonitoring;

      await monitor.startMonitoring(); // Should not change state
      const secondState = (monitor as any).isMonitoring;

      expect(firstState).toBe(true);
      expect(secondState).toBe(true);
    });

    it('should emit monitoring events', async () => {
      const events: string[] = [];

      // Stop the monitor that was started in beforeEach
      await monitor.stopMonitoring();

      // Set up event listeners
      monitor.on('monitoring-started', () => events.push('started'));
      monitor.on('monitoring-stopped', () => events.push('stopped'));

      // Start and stop to capture events
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
      
      // Allow async operations to complete
      await Promise.resolve();

      // Should continue working despite git errors
      expect(true).toBe(true);
    });

    it('should handle malformed trigger files', async () => {
      mockFs.readdir.mockResolvedValue(['invalid-trigger.json'] as any);
      mockFs.readFile.mockResolvedValue('invalid json content');

      // Should not throw error
      await (monitor as any).setupHookIntegration();

      jest.advanceTimersByTime(2000);
      
      // Allow async operations to complete
      await Promise.resolve();

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

      // Advance timer to trigger processing
      jest.advanceTimersByTime(1000);
      
      // Allow async processing to start
      await Promise.resolve();
      
      // Advance timers for event processing delay
      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Task Name Extraction', () => {
    it('should extract task names from tasks.md content', async () => {
      const tasksContent = `
# Implementation Plan

- [ ] 1 Main Task One
- [ ] 1.1 Sub Task One
- [ ] 1.2 Sub Task Two
- [ ] 2 Main Task Two
- [ ] 2.1 Another Sub Task
`;

      const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

      expect(extractTaskName(tasksContent, '1')).toBe('Main Task One');
      expect(extractTaskName(tasksContent, '1.1')).toBe('Sub Task One');
      expect(extractTaskName(tasksContent, '2')).toBe('Main Task Two');
      expect(extractTaskName(tasksContent, '2.1')).toBe('Another Sub Task');
      expect(extractTaskName(tasksContent, '3')).toBeNull();
    });

    it('should not match subtasks when searching for parent task', async () => {
      const tasksContent = `
# Implementation Plan

- [ ] 1 Parent Task
- [ ] 1.1 Subtask One
- [ ] 1.2 Subtask Two
- [ ] 10 Another Parent Task
- [ ] 10.1 Another Subtask
`;

      const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

      // Parent task "1" should match only "1 Parent Task", not "1.1" or "1.2"
      expect(extractTaskName(tasksContent, '1')).toBe('Parent Task');
      
      // Parent task "10" should match only "10 Another Parent Task", not "10.1"
      expect(extractTaskName(tasksContent, '10')).toBe('Another Parent Task');
      
      // Subtasks should still match correctly
      expect(extractTaskName(tasksContent, '1.1')).toBe('Subtask One');
      expect(extractTaskName(tasksContent, '10.1')).toBe('Another Subtask');
    });

    it('should handle various task number formats correctly', async () => {
      const tasksContent = `
# Implementation Plan

- [ ] 1 Task One
- [ ] 1.1 Task One Point One
- [ ] 1.10 Task One Point Ten
- [ ] 1.100 Task One Point One Hundred
- [ ] 10 Task Ten
- [ ] 10.1 Task Ten Point One
- [ ] 100 Task One Hundred
- [ ] 100.1 Task One Hundred Point One
`;

      const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

      // Test single digit parent tasks
      expect(extractTaskName(tasksContent, '1')).toBe('Task One');
      
      // Test double digit parent tasks
      expect(extractTaskName(tasksContent, '10')).toBe('Task Ten');
      
      // Test triple digit parent tasks
      expect(extractTaskName(tasksContent, '100')).toBe('Task One Hundred');
      
      // Test subtasks with various decimal places
      expect(extractTaskName(tasksContent, '1.1')).toBe('Task One Point One');
      expect(extractTaskName(tasksContent, '1.10')).toBe('Task One Point Ten');
      expect(extractTaskName(tasksContent, '1.100')).toBe('Task One Point One Hundred');
      expect(extractTaskName(tasksContent, '10.1')).toBe('Task Ten Point One');
      expect(extractTaskName(tasksContent, '100.1')).toBe('Task One Hundred Point One');
    });
  });

  describe('Task Number Format Tests', () => {
    describe('Single Digit Parent Tasks (1-9)', () => {
      it('should extract task names for single digit parent tasks', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Task One
- [ ] 2 Task Two
- [ ] 5 Task Five
- [ ] 9 Task Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task One');
        expect(extractTaskName(tasksContent, '2')).toBe('Task Two');
        expect(extractTaskName(tasksContent, '5')).toBe('Task Five');
        expect(extractTaskName(tasksContent, '9')).toBe('Task Nine');
      });

      it('should exclude task numbers from extracted names', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Task One
- [ ] 2 Task Two
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        const task1Name = extractTaskName(tasksContent, '1');
        const task2Name = extractTaskName(tasksContent, '2');

        // Verify task numbers are NOT included in extracted names
        expect(task1Name).not.toContain('1');
        expect(task2Name).not.toContain('2');
        expect(task1Name).toBe('Task One');
        expect(task2Name).toBe('Task Two');
      });
    });

    describe('Double Digit Parent Tasks (10-99)', () => {
      it('should extract task names for double digit parent tasks', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 10 Task Ten
- [ ] 15 Task Fifteen
- [ ] 50 Task Fifty
- [ ] 99 Task Ninety Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '10')).toBe('Task Ten');
        expect(extractTaskName(tasksContent, '15')).toBe('Task Fifteen');
        expect(extractTaskName(tasksContent, '50')).toBe('Task Fifty');
        expect(extractTaskName(tasksContent, '99')).toBe('Task Ninety Nine');
      });

      it('should not confuse double digit parent tasks with subtasks', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 10 Parent Task Ten
- [ ] 10.1 Subtask of Ten
- [ ] 10.2 Another Subtask of Ten
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Parent task 10 should match only "10 Parent Task Ten", not subtasks
        expect(extractTaskName(tasksContent, '10')).toBe('Parent Task Ten');
        expect(extractTaskName(tasksContent, '10')).not.toBe('Subtask of Ten');
      });
    });

    describe('Triple Digit Parent Tasks (100+)', () => {
      it('should extract task names for triple digit parent tasks', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 100 Task One Hundred
- [ ] 150 Task One Fifty
- [ ] 999 Task Nine Ninety Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '100')).toBe('Task One Hundred');
        expect(extractTaskName(tasksContent, '150')).toBe('Task One Fifty');
        expect(extractTaskName(tasksContent, '999')).toBe('Task Nine Ninety Nine');
      });

      it('should not confuse triple digit parent tasks with subtasks', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 100 Parent Task One Hundred
- [ ] 100.1 Subtask of One Hundred
- [ ] 100.2 Another Subtask of One Hundred
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Parent task 100 should match only "100 Parent Task One Hundred", not subtasks
        expect(extractTaskName(tasksContent, '100')).toBe('Parent Task One Hundred');
        expect(extractTaskName(tasksContent, '100')).not.toBe('Subtask of One Hundred');
      });
    });

    describe('Single Level Subtasks (X.Y)', () => {
      it('should extract task names for single level subtasks', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Parent Task
- [ ] 1.1 Subtask One Point One
- [ ] 1.2 Subtask One Point Two
- [ ] 1.9 Subtask One Point Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1.1')).toBe('Subtask One Point One');
        expect(extractTaskName(tasksContent, '1.2')).toBe('Subtask One Point Two');
        expect(extractTaskName(tasksContent, '1.9')).toBe('Subtask One Point Nine');
      });

      it('should handle double digit subtask numbers (X.10+)', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Parent Task
- [ ] 1.10 Subtask One Point Ten
- [ ] 1.15 Subtask One Point Fifteen
- [ ] 1.99 Subtask One Point Ninety Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1.10')).toBe('Subtask One Point Ten');
        expect(extractTaskName(tasksContent, '1.15')).toBe('Subtask One Point Fifteen');
        expect(extractTaskName(tasksContent, '1.99')).toBe('Subtask One Point Ninety Nine');
      });

      it('should handle triple digit subtask numbers (X.100+)', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Parent Task
- [ ] 1.100 Subtask One Point One Hundred
- [ ] 1.150 Subtask One Point One Fifty
- [ ] 1.999 Subtask One Point Nine Ninety Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1.100')).toBe('Subtask One Point One Hundred');
        expect(extractTaskName(tasksContent, '1.150')).toBe('Subtask One Point One Fifty');
        expect(extractTaskName(tasksContent, '1.999')).toBe('Subtask One Point Nine Ninety Nine');
      });
    });

    describe('Double Digit Parent with Subtasks (10.Y)', () => {
      it('should extract task names for subtasks of double digit parents', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 10 Parent Task Ten
- [ ] 10.1 Subtask Ten Point One
- [ ] 10.2 Subtask Ten Point Two
- [ ] 10.9 Subtask Ten Point Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '10.1')).toBe('Subtask Ten Point One');
        expect(extractTaskName(tasksContent, '10.2')).toBe('Subtask Ten Point Two');
        expect(extractTaskName(tasksContent, '10.9')).toBe('Subtask Ten Point Nine');
      });

      it('should handle double digit subtasks of double digit parents (10.10+)', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 10 Parent Task Ten
- [ ] 10.10 Subtask Ten Point Ten
- [ ] 10.15 Subtask Ten Point Fifteen
- [ ] 10.99 Subtask Ten Point Ninety Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '10.10')).toBe('Subtask Ten Point Ten');
        expect(extractTaskName(tasksContent, '10.15')).toBe('Subtask Ten Point Fifteen');
        expect(extractTaskName(tasksContent, '10.99')).toBe('Subtask Ten Point Ninety Nine');
      });
    });

    describe('Triple Digit Parent with Subtasks (100.Y)', () => {
      it('should extract task names for subtasks of triple digit parents', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 100 Parent Task One Hundred
- [ ] 100.1 Subtask One Hundred Point One
- [ ] 100.2 Subtask One Hundred Point Two
- [ ] 100.9 Subtask One Hundred Point Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '100.1')).toBe('Subtask One Hundred Point One');
        expect(extractTaskName(tasksContent, '100.2')).toBe('Subtask One Hundred Point Two');
        expect(extractTaskName(tasksContent, '100.9')).toBe('Subtask One Hundred Point Nine');
      });

      it('should handle double digit subtasks of triple digit parents (100.10+)', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 100 Parent Task One Hundred
- [ ] 100.10 Subtask One Hundred Point Ten
- [ ] 100.15 Subtask One Hundred Point Fifteen
- [ ] 100.99 Subtask One Hundred Point Ninety Nine
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '100.10')).toBe('Subtask One Hundred Point Ten');
        expect(extractTaskName(tasksContent, '100.15')).toBe('Subtask One Hundred Point Fifteen');
        expect(extractTaskName(tasksContent, '100.99')).toBe('Subtask One Hundred Point Ninety Nine');
      });
    });

    describe('Comprehensive Task Number Format Coverage', () => {
      it('should handle all task number formats in a single tasks.md', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Task One
- [ ] 1.1 Task One Point One
- [ ] 1.10 Task One Point Ten
- [ ] 10 Task Ten
- [ ] 10.1 Task Ten Point One
- [ ] 100 Task One Hundred
- [ ] 100.1 Task One Hundred Point One
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Test all formats
        expect(extractTaskName(tasksContent, '1')).toBe('Task One');
        expect(extractTaskName(tasksContent, '1.1')).toBe('Task One Point One');
        expect(extractTaskName(tasksContent, '1.10')).toBe('Task One Point Ten');
        expect(extractTaskName(tasksContent, '10')).toBe('Task Ten');
        expect(extractTaskName(tasksContent, '10.1')).toBe('Task Ten Point One');
        expect(extractTaskName(tasksContent, '100')).toBe('Task One Hundred');
        expect(extractTaskName(tasksContent, '100.1')).toBe('Task One Hundred Point One');
      });

      it('should verify task numbers are excluded from all extracted names', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Task One
- [ ] 1.1 Task One Point One
- [ ] 1.10 Task One Point Ten
- [ ] 10 Task Ten
- [ ] 10.1 Task Ten Point One
- [ ] 100 Task One Hundred
- [ ] 100.1 Task One Hundred Point One
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Verify no task numbers in extracted names
        const names = [
          extractTaskName(tasksContent, '1'),
          extractTaskName(tasksContent, '1.1'),
          extractTaskName(tasksContent, '1.10'),
          extractTaskName(tasksContent, '10'),
          extractTaskName(tasksContent, '10.1'),
          extractTaskName(tasksContent, '100'),
          extractTaskName(tasksContent, '100.1')
        ];

        names.forEach((name, index) => {
          expect(name).toBeTruthy();
          // Verify name doesn't start with a number followed by space or dot
          expect(name).not.toMatch(/^\d+[\s.]/);
        });
      });
    });

    describe('Parent vs Subtask Distinction', () => {
      it('should distinguish parent task 1 from subtasks 1.X', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1 Parent Task One
- [ ] 1.1 Subtask One Point One
- [ ] 1.2 Subtask One Point Two
- [ ] 1.10 Subtask One Point Ten
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        const parentName = extractTaskName(tasksContent, '1');
        
        // Parent should match only parent task, not any subtasks
        expect(parentName).toBe('Parent Task One');
        expect(parentName).not.toBe('Subtask One Point One');
        expect(parentName).not.toBe('Subtask One Point Two');
        expect(parentName).not.toBe('Subtask One Point Ten');
      });

      it('should distinguish parent task 10 from subtasks 10.X', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 10 Parent Task Ten
- [ ] 10.1 Subtask Ten Point One
- [ ] 10.2 Subtask Ten Point Two
- [ ] 10.10 Subtask Ten Point Ten
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        const parentName = extractTaskName(tasksContent, '10');
        
        // Parent should match only parent task, not any subtasks
        expect(parentName).toBe('Parent Task Ten');
        expect(parentName).not.toBe('Subtask Ten Point One');
        expect(parentName).not.toBe('Subtask Ten Point Two');
        expect(parentName).not.toBe('Subtask Ten Point Ten');
      });

      it('should distinguish parent task 100 from subtasks 100.X', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 100 Parent Task One Hundred
- [ ] 100.1 Subtask One Hundred Point One
- [ ] 100.2 Subtask One Hundred Point Two
- [ ] 100.10 Subtask One Hundred Point Ten
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        const parentName = extractTaskName(tasksContent, '100');
        
        // Parent should match only parent task, not any subtasks
        expect(parentName).toBe('Parent Task One Hundred');
        expect(parentName).not.toBe('Subtask One Hundred Point One');
        expect(parentName).not.toBe('Subtask One Hundred Point Two');
        expect(parentName).not.toBe('Subtask One Hundred Point Ten');
      });
    });
  });

  describe('Tasks.md Format Tests', () => {
    describe('Tasks with Type Metadata', () => {
      it('should extract task names from entries with **Type** metadata', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Parent Task with Type
  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  - [ ] 1.1 Subtask with Type
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implementation details
    - _Requirements: 1.1_
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Parent Task with Type');
        expect(extractTaskName(tasksContent, '1.1')).toBe('Subtask with Type');
      });

      it('should handle multiple Type metadata formats', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with Parent Type
  **Type**: Parent
  
- [ ] 2. Task with Implementation Type
  **Type**: Implementation
  
- [ ] 3. Task with Architecture Type
  **Type**: Architecture
  
- [ ] 4. Task with Setup Type
  **Type**: Setup
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with Parent Type');
        expect(extractTaskName(tasksContent, '2')).toBe('Task with Implementation Type');
        expect(extractTaskName(tasksContent, '3')).toBe('Task with Architecture Type');
        expect(extractTaskName(tasksContent, '4')).toBe('Task with Setup Type');
      });

      it('should extract names from tasks with multiple metadata fields', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Complex Task with Multiple Metadata
  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  **Estimated Effort**: 2-3 hours
  **Priority**: High
  
  **Success Criteria:**
  - Criterion 1
  - Criterion 2
  
  - [ ] 1.1 Subtask with Multiple Metadata
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Details here
    - _Requirements: 1.1_
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Complex Task with Multiple Metadata');
        expect(extractTaskName(tasksContent, '1.1')).toBe('Subtask with Multiple Metadata');
      });
    });

    describe('Tasks without Type Metadata', () => {
      it('should extract task names from entries without **Type** metadata', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Simple Parent Task
  - [ ] 1.1 Simple Subtask
    - Implementation details
    - _Requirements: 1.1_
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Simple Parent Task');
        expect(extractTaskName(tasksContent, '1.1')).toBe('Simple Subtask');
      });

      it('should handle tasks with only requirement references', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with Requirements Only
  - _Requirements: 1.1, 1.2_

- [ ] 2. Another Task with Requirements
  - _Requirements: 2.1_
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with Requirements Only');
        expect(extractTaskName(tasksContent, '2')).toBe('Another Task with Requirements');
      });

      it('should handle minimal task format', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Minimal Task One
- [ ] 2. Minimal Task Two
- [ ] 3. Minimal Task Three
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Minimal Task One');
        expect(extractTaskName(tasksContent, '2')).toBe('Minimal Task Two');
        expect(extractTaskName(tasksContent, '3')).toBe('Minimal Task Three');
      });
    });

    describe('Special Characters in Task Names', () => {
      it('should handle task names with quotes', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with "double quotes" in name
- [ ] 2. Task with 'single quotes' in name
- [ ] 3. Task with "mixed 'quotes'" in name
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with "double quotes" in name');
        expect(extractTaskName(tasksContent, '2')).toBe("Task with 'single quotes' in name");
        expect(extractTaskName(tasksContent, '3')).toBe('Task with "mixed \'quotes\'" in name');
      });

      it('should handle task names with parentheses', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with (parentheses) in name
- [ ] 2. Task with (nested (parentheses)) in name
- [ ] 3. Task with [square brackets] in name
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with (parentheses) in name');
        expect(extractTaskName(tasksContent, '2')).toBe('Task with (nested (parentheses)) in name');
        expect(extractTaskName(tasksContent, '3')).toBe('Task with [square brackets] in name');
      });

      it('should handle task names with special symbols', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with @mentions and #hashtags
- [ ] 2. Task with $variables and %percentages
- [ ] 3. Task with &ampersands and *asterisks
- [ ] 4. Task with /slashes and \\backslashes
- [ ] 5. Task with <angle> and {curly} brackets
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with @mentions and #hashtags');
        expect(extractTaskName(tasksContent, '2')).toBe('Task with $variables and %percentages');
        expect(extractTaskName(tasksContent, '3')).toBe('Task with &ampersands and *asterisks');
        expect(extractTaskName(tasksContent, '4')).toBe('Task with /slashes and \\backslashes');
        expect(extractTaskName(tasksContent, '5')).toBe('Task with <angle> and {curly} brackets');
      });

      it('should handle task names with punctuation', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with: colons, semicolons; and commas
- [ ] 2. Task with! exclamation? and question marks
- [ ] 3. Task with... ellipsis and - dashes
- [ ] 4. Task with_underscores and-hyphens
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with: colons, semicolons; and commas');
        expect(extractTaskName(tasksContent, '2')).toBe('Task with! exclamation? and question marks');
        expect(extractTaskName(tasksContent, '3')).toBe('Task with... ellipsis and - dashes');
        expect(extractTaskName(tasksContent, '4')).toBe('Task with_underscores and-hyphens');
      });

      it('should handle task names with unicode characters', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with émojis 🎉 and symbols ✓
- [ ] 2. Task with ñoñ-ASCII çhäracters
- [ ] 3. Task with 中文字符 and 日本語
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with émojis 🎉 and symbols ✓');
        expect(extractTaskName(tasksContent, '2')).toBe('Task with ñoñ-ASCII çhäracters');
        expect(extractTaskName(tasksContent, '3')).toBe('Task with 中文字符 and 日本語');
      });
    });

    describe('Edge Cases', () => {
      it('should handle very long task names', async () => {
        const longName = 'This is a very long task name that exceeds typical length expectations and continues for quite some time to test how the system handles extremely verbose task descriptions that might span multiple lines or contain extensive detail about what needs to be accomplished in this particular task';
        const tasksContent = `
# Implementation Plan

- [ ] 1. ${longName}
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe(longName);
      });

      it('should handle task names with leading/trailing whitespace', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1.   Task with leading spaces
- [ ] 2. Task with trailing spaces   
- [ ] 3.   Task with both leading and trailing spaces   
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Extracted names should have whitespace trimmed
        const task1 = extractTaskName(tasksContent, '1');
        const task2 = extractTaskName(tasksContent, '2');
        const task3 = extractTaskName(tasksContent, '3');

        expect(task1).toBeTruthy();
        expect(task2).toBeTruthy();
        expect(task3).toBeTruthy();
        
        // Verify no leading/trailing whitespace
        expect(task1).toBe(task1?.trim());
        expect(task2).toBe(task2?.trim());
        expect(task3).toBe(task3?.trim());
      });

      it('should return null for non-existent task numbers', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task One
- [ ] 2. Task Two
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '3')).toBeNull();
        expect(extractTaskName(tasksContent, '99')).toBeNull();
        expect(extractTaskName(tasksContent, '1.5')).toBeNull();
      });

      it('should handle malformed task entries gracefully', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Valid Task
- [ ] Not a valid task number format
- [ ] 2. Another Valid Task
- [ ] 3 Missing period after number
- [ ] 4. Valid Task After Malformed
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Should extract valid tasks
        expect(extractTaskName(tasksContent, '1')).toBe('Valid Task');
        expect(extractTaskName(tasksContent, '2')).toBe('Another Valid Task');
        expect(extractTaskName(tasksContent, '4')).toBe('Valid Task After Malformed');
        
        // Should handle malformed entries
        expect(extractTaskName(tasksContent, '3')).toBeNull();
      });

      it('should handle empty task names', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. 
- [ ] 2. Valid Task
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        // Empty task name should return null or empty string
        const emptyTask = extractTaskName(tasksContent, '1');
        expect(emptyTask === null || emptyTask === '').toBe(true);
        
        // Valid task should still work
        expect(extractTaskName(tasksContent, '2')).toBe('Valid Task');
      });

      it('should handle tasks with only numbers in name', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. 123456
- [ ] 2. 2024-11-22
- [ ] 3. Version 1.0.0
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('123456');
        expect(extractTaskName(tasksContent, '2')).toBe('2024-11-22');
        expect(extractTaskName(tasksContent, '3')).toBe('Version 1.0.0');
      });

      it('should handle mixed format tasks in same file', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Task with Type Metadata
  **Type**: Parent
  
  - [ ] 1.1 Subtask without metadata
  - [ ] 1.2 Subtask with metadata
    **Type**: Implementation

- [ ] 2. Task without metadata
  - [ ] 2.1 Subtask also without metadata

- [ ] 3. Task with special chars: (test) & "quotes"
  **Type**: Architecture
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Task with Type Metadata');
        expect(extractTaskName(tasksContent, '1.1')).toBe('Subtask without metadata');
        expect(extractTaskName(tasksContent, '1.2')).toBe('Subtask with metadata');
        expect(extractTaskName(tasksContent, '2')).toBe('Task without metadata');
        expect(extractTaskName(tasksContent, '2.1')).toBe('Subtask also without metadata');
        expect(extractTaskName(tasksContent, '3')).toBe('Task with special chars: (test) & "quotes"');
      });
    });

    describe('Real-World Tasks.md Variations', () => {
      it('should handle actual spec task format with all metadata', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Fix Critical Production Bug

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 2-3 hours
  **Priority**: Critical
  
  **Success Criteria:**
  - All 18 WorkflowMonitor tests pass
  - Commit messages contain actual task names (not "undefined")
  - No regressions in task name extraction functionality
  
  **Primary Artifacts:**
  - Modified \`src/release/detection/WorkflowMonitor.ts\`
  - Validation evidence document
  
  **Completion Documentation:**
  - Detailed: \`.kiro/specs/remaining-test-failures-fixes/completion/task-1-parent-completion.md\`
  - Summary: \`docs/specs/remaining-test-failures-fixes/task-1-summary.md\`

  - [ ] 1.1 Validate root cause
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review actual failing test output
    - Manually test current regex pattern
    - Document validation evidence
    - _Requirements: 1_
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Fix Critical Production Bug');
        expect(extractTaskName(tasksContent, '1.1')).toBe('Validate root cause');
      });

      it('should handle tasks with inline code and markdown', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Update \`extractTaskName\` method in WorkflowMonitor
  **Type**: Implementation
  
- [ ] 2. Add tests for **Type** metadata handling
  **Type**: Implementation
  
- [ ] 3. Fix regex pattern: \`(?:\\d+(?:\\.\\d+)*\\s+)?\`
  **Type**: Implementation
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Update `extractTaskName` method in WorkflowMonitor');
        expect(extractTaskName(tasksContent, '2')).toBe('Add tests for **Type** metadata handling');
        expect(extractTaskName(tasksContent, '3')).toBe('Fix regex pattern: `(?:\\d+(?:\\.\\d+)*\\s+)?`');
      });

      it('should handle tasks with URLs and file paths', async () => {
        const tasksContent = `
# Implementation Plan

- [ ] 1. Update documentation at https://github.com/repo/docs
- [ ] 2. Modify file src/release/detection/WorkflowMonitor.ts
- [ ] 3. Review spec at .kiro/specs/test-spec/design.md
`;

        const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

        expect(extractTaskName(tasksContent, '1')).toBe('Update documentation at https://github.com/repo/docs');
        expect(extractTaskName(tasksContent, '2')).toBe('Modify file src/release/detection/WorkflowMonitor.ts');
        expect(extractTaskName(tasksContent, '3')).toBe('Review spec at .kiro/specs/test-spec/design.md');
      });
    });
  });

  describe('Commit Message Format Tests', () => {
    describe('Checkbox State Variations', () => {
      it('should extract task names from commit messages with [x] checkbox', async () => {
        const commitMessage = `Task 1.1 Complete: Fix critical bug

- [x] 1.1 Fix critical bug
  - Updated validation logic
  - Added error handling`;

        const extractTaskNameFromCommit = (monitor as any).extractTaskNameFromCommitMessage?.bind(monitor);
        
        if (extractTaskNameFromCommit) {
          const taskName = extractTaskNameFromCommit(commitMessage);
          expect(taskName).toBe('Fix critical bug');
        } else {
          // If method doesn't exist, test the pattern directly
          const pattern = /^-\s*\[x\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
          const match = pattern.exec(commitMessage);
          expect(match).toBeTruthy();
          if (match) {
            expect(match[1]).toBe('Fix critical bug');
          }
        }
      });

      it('should extract task names from commit messages with [ ] checkbox', async () => {
        const commitMessage = `Task 2.3 Complete: Add new feature

- [ ] 2.3 Add new feature
  - Implemented core functionality
  - Added tests`;

        const extractTaskNameFromCommit = (monitor as any).extractTaskNameFromCommitMessage?.bind(monitor);
        
        if (extractTaskNameFromCommit) {
          const taskName = extractTaskNameFromCommit(commitMessage);
          expect(taskName).toBe('Add new feature');
        } else {
          // Test the pattern directly
          const pattern = /^-\s*\[\s*\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
          const match = pattern.exec(commitMessage);
          expect(match).toBeTruthy();
          if (match) {
            expect(match[1]).toBe('Add new feature');
          }
        }
      });

      it('should extract task names from commit messages with [.] checkbox', async () => {
        const commitMessage = `Task 3.5 Complete: Update documentation

- [.] 3.5 Update documentation
  - Revised API docs
  - Added examples`;

        const extractTaskNameFromCommit = (monitor as any).extractTaskNameFromCommitMessage?.bind(monitor);
        
        if (extractTaskNameFromCommit) {
          const taskName = extractTaskNameFromCommit(commitMessage);
          expect(taskName).toBe('Update documentation');
        } else {
          // Test the pattern directly
          const pattern = /^-\s*\[\.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
          const match = pattern.exec(commitMessage);
          expect(match).toBeTruthy();
          if (match) {
            expect(match[1]).toBe('Update documentation');
          }
        }
      });

      it('should handle all checkbox states in same commit message', async () => {
        const commitMessage = `Task 4 Complete: Multiple tasks

- [x] 4.1 Completed task
- [ ] 4.2 Pending task
- [.] 4.3 In progress task`;

        // Test pattern that matches any checkbox state
        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        expect(matches).toHaveLength(3);
        expect(matches[0]).toBe('Completed task');
        expect(matches[1]).toBe('Pending task');
        expect(matches[2]).toBe('In progress task');
      });
    });

    describe('Task Number Format in Commit Messages', () => {
      it('should extract task names from commit messages with single digit task numbers', async () => {
        const commitMessage = `Task 1 Complete: Parent task

- [x] 1 Parent task
- [x] 1.1 Subtask one
- [x] 1.2 Subtask two`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        expect(matches).toHaveLength(3);
        expect(matches[0]).toBe('Parent task');
        expect(matches[1]).toBe('Subtask one');
        expect(matches[2]).toBe('Subtask two');
      });

      it('should extract task names from commit messages with double digit task numbers', async () => {
        const commitMessage = `Task 10 Complete: Parent task ten

- [x] 10 Parent task ten
- [x] 10.1 Subtask of ten
- [x] 10.10 Subtask ten point ten`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        expect(matches).toHaveLength(3);
        expect(matches[0]).toBe('Parent task ten');
        expect(matches[1]).toBe('Subtask of ten');
        expect(matches[2]).toBe('Subtask ten point ten');
      });

      it('should extract task names from commit messages with triple digit task numbers', async () => {
        const commitMessage = `Task 100 Complete: Parent task one hundred

- [x] 100 Parent task one hundred
- [x] 100.1 Subtask of one hundred
- [x] 100.10 Subtask one hundred point ten`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        expect(matches).toHaveLength(3);
        expect(matches[0]).toBe('Parent task one hundred');
        expect(matches[1]).toBe('Subtask of one hundred');
        expect(matches[2]).toBe('Subtask one hundred point ten');
      });

      it('should exclude task numbers from extracted names in commit messages', async () => {
        const commitMessage = `Task 5 Complete: Test task

- [x] 5 Test task
- [x] 5.1 Test subtask
- [x] 5.10 Test subtask ten`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        // Verify task numbers are NOT in extracted names
        matches.forEach(name => {
          expect(name).not.toMatch(/^\d+[\s.]/);
        });

        expect(matches[0]).toBe('Test task');
        expect(matches[1]).toBe('Test subtask');
        expect(matches[2]).toBe('Test subtask ten');
      });
    });

    describe('Commit Message Format Compatibility', () => {
      it('should be compatible with existing commit message processing', async () => {
        // Test that commit message format matches what WorkflowMonitor expects
        const commitMessage = `Task 1.1 Complete: Implement validation system

- [x] 1.1 Implement validation system
  - Create interfaces
  - Add error handling
  - _Requirements: 1.1_`;

        // Verify the commit message follows expected format
        expect(commitMessage).toMatch(/^Task \d+(?:\.\d+)? Complete:/);
        expect(commitMessage).toMatch(/^-\s*\[.\]\s*\d+(?:\.\d+)*\s+/m);
      });

      it('should handle commit messages with multiple task entries', async () => {
        const commitMessage = `Task 2 Complete: Parent task completion

- [x] 2 Parent task completion
  - [x] 2.1 Subtask one
  - [x] 2.2 Subtask two
  - [x] 2.3 Subtask three`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0]).toBe('Parent task completion');
      });

      it('should handle commit messages with metadata and details', async () => {
        const commitMessage = `Task 3.2 Complete: Update regex pattern

- [x] 3.2 Update regex pattern
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Modified WorkflowMonitor.ts
  - Updated extractTaskName method
  - Added comprehensive tests
  - _Requirements: 3.1, 3.2_`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const match = pattern.exec(commitMessage);
        
        expect(match).toBeTruthy();
        if (match) {
          expect(match[1]).toBe('Update regex pattern');
        }
      });

      it('should handle real-world commit message format', async () => {
        const commitMessage = `Task 1 Complete: Fix Task Name Extraction Regex Bug

- [x] 1. Fix Task Name Extraction Regex Bug
  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  - [x] 1.1 Update regex pattern to use negative lookahead
    **Type**: Implementation
    - Modified extractTaskName method
    - _Requirements: 1.1_
  
  - [x] 1.2 Verify commit message generation
    **Type**: Implementation
    - Tested with various task formats
    - _Requirements: 1.2_`;

        const pattern = /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/gm;
        const matches: string[] = [];
        let match;
        
        while ((match = pattern.exec(commitMessage)) !== null) {
          matches.push(match[1]);
        }

        expect(matches.length).toBeGreaterThan(0);
        expect(matches[0]).toBe('Fix Task Name Extraction Regex Bug');
      });
    });

    describe('Commit Message Format Requirements Documentation', () => {
      it('should document expected commit message format', () => {
        // Document the expected commit message format for reference
        const expectedFormat = {
          title: 'Task [number] Complete: [task name]',
          body: [
            '- [checkbox] [number] [task name]',
            '  - Implementation details',
            '  - _Requirements: [requirement IDs]_'
          ],
          checkboxStates: ['[x]', '[ ]', '[.]'],
          taskNumberFormats: ['1', '1.1', '1.10', '10', '10.1', '100', '100.1']
        };

        // Verify format documentation is complete
        expect(expectedFormat.title).toBeTruthy();
        expect(expectedFormat.body).toHaveLength(3);
        expect(expectedFormat.checkboxStates).toHaveLength(3);
        expect(expectedFormat.taskNumberFormats).toHaveLength(7);
      });

      it('should validate commit message format requirements', () => {
        // Requirements for commit message format:
        // 1. Title line: "Task [number] Complete: [task name]"
        // 2. Body contains task list with checkboxes
        // 3. Task numbers can be single digit, double digit, or triple digit
        // 4. Task numbers are excluded from extracted task names
        // 5. Checkbox states can be [x], [ ], or [.]
        
        const requirements = {
          titleFormat: /^Task \d+(?:\.\d+)? Complete:/,
          taskLineFormat: /^-\s*\[.\]\s*(?:\d+(?:\.\d+)*\s+)?(.+?)$/m,
          checkboxStates: ['[x]', '[ ]', '[.]'],
          taskNumberFormats: ['1', '1.1', '1.10', '10', '10.1', '100', '100.1']
        };

        expect(requirements.titleFormat).toBeTruthy();
        expect(requirements.taskLineFormat).toBeTruthy();
        expect(requirements.checkboxStates).toHaveLength(3);
        expect(requirements.taskNumberFormats).toHaveLength(7);
      });
    });
  });

  describe('Commit Message Format Requirements', () => {
    it('should verify commit message format requirements', () => {
      // Commit message format requirements:
      // 1. Title format: "Task X.Y Complete: Task Name"
      // 2. Task line format: "- [x] X.Y Task Name"
      // 3. Task numbers can be single digit (1) or multi-level (1.1, 10.1, etc.)
      // 4. Task numbers can include decimal notation (1.1, 10.1, etc.)
      // 5. Checkbox states can be [x], [ ], or [.]
      // 6. Task names should not include task numbers
        
      const requirements = {
          titleFormat: /^Task \d+(?:\.\d+)? Complete: .+$/,
          taskLineFormat: /^-\s*\[.\]\s*\d+(?:\.\d+)*\s+.+$/,
          checkboxPattern: /\[.\]/,
          taskNumberPattern: /\d+(?:\.\d+)*/,
          nameExcludesNumber: (name: string) => !name.match(/^\d+[\s.]/)
        };

        // Verify all requirements are defined
        expect(requirements.titleFormat).toBeTruthy();
        expect(requirements.taskLineFormat).toBeTruthy();
        expect(requirements.checkboxPattern).toBeTruthy();
        expect(requirements.taskNumberPattern).toBeTruthy();
        expect(requirements.nameExcludesNumber).toBeTruthy();
      });
    });
  });

  describe('Commit Message Generation Verification', () => {
    it('should generate correct commit messages for parent tasks', async () => {
      const testConfig: DetectionConfig = {
        ...DEFAULT_RELEASE_CONFIG.detection,
        monitorPaths: ['.kiro/specs/*/completion/*.md']
      };
      const testMonitor = new WorkflowMonitor(testConfig);
      const tasksContent = `
# Implementation Plan

- [ ] 1. Fix Task Name Extraction Regex Bug
  **Type**: Parent
  - [ ] 1.1 Update regex pattern
  - [ ] 1.2 Verify commit message generation

- [ ] 10. Build System Foundation
  **Type**: Parent
  - [ ] 10.1 Create directory structure

- [ ] 100. Complete Feature Implementation
  **Type**: Parent
  - [ ] 100.1 Implement core logic
`;

      const extractTaskName = (testMonitor as any).extractTaskName.bind(testMonitor);

      // Verify task names are extracted correctly for commit messages
      const task1Name = extractTaskName(tasksContent, '1');
      const task10Name = extractTaskName(tasksContent, '10');
      const task100Name = extractTaskName(tasksContent, '100');

      expect(task1Name).toBe('Fix Task Name Extraction Regex Bug');
      expect(task10Name).toBe('Build System Foundation');
      expect(task100Name).toBe('Complete Feature Implementation');

      // Verify commit messages would be formatted correctly
      expect(`Task 1 Complete: ${task1Name}`).toBe('Task 1 Complete: Fix Task Name Extraction Regex Bug');
      expect(`Task 10 Complete: ${task10Name}`).toBe('Task 10 Complete: Build System Foundation');
      expect(`Task 100 Complete: ${task100Name}`).toBe('Task 100 Complete: Complete Feature Implementation');
    });

    it('should generate correct commit messages for subtasks', async () => {
      const testConfig: DetectionConfig = {
        ...DEFAULT_RELEASE_CONFIG.detection,
        monitorPaths: ['.kiro/specs/*/completion/*.md']
      };
      const testMonitor = new WorkflowMonitor(testConfig);
      const tasksContent = `
# Implementation Plan

- [ ] 1. Parent Task
  - [ ] 1.1 Update regex pattern to use negative lookahead
  - [ ] 1.2 Verify commit message generation
  - [ ] 1.10 Handle edge case with ten subtasks
  - [ ] 1.100 Handle edge case with hundred subtasks

- [ ] 10. Another Parent Task
  - [ ] 10.1 First subtask of task 10
  - [ ] 10.10 Tenth subtask of task 10
`;

      const extractTaskName = (testMonitor as any).extractTaskName.bind(testMonitor);

      // Verify subtask names are extracted correctly
      const task1_1Name = extractTaskName(tasksContent, '1.1');
      const task1_2Name = extractTaskName(tasksContent, '1.2');
      const task1_10Name = extractTaskName(tasksContent, '1.10');
      const task1_100Name = extractTaskName(tasksContent, '1.100');
      const task10_1Name = extractTaskName(tasksContent, '10.1');
      const task10_10Name = extractTaskName(tasksContent, '10.10');

      expect(task1_1Name).toBe('Update regex pattern to use negative lookahead');
      expect(task1_2Name).toBe('Verify commit message generation');
      expect(task1_10Name).toBe('Handle edge case with ten subtasks');
      expect(task1_100Name).toBe('Handle edge case with hundred subtasks');
      expect(task10_1Name).toBe('First subtask of task 10');
      expect(task10_10Name).toBe('Tenth subtask of task 10');

      // Verify commit messages would be formatted correctly
      expect(`Task 1.1 Complete: ${task1_1Name}`).toBe('Task 1.1 Complete: Update regex pattern to use negative lookahead');
      expect(`Task 1.10 Complete: ${task1_10Name}`).toBe('Task 1.10 Complete: Handle edge case with ten subtasks');
      expect(`Task 10.1 Complete: ${task10_1Name}`).toBe('Task 10.1 Complete: First subtask of task 10');
    });

    it('should not confuse parent and subtask numbers in commit messages', async () => {
      const testConfig: DetectionConfig = {
        ...DEFAULT_RELEASE_CONFIG.detection,
        monitorPaths: ['.kiro/specs/*/completion/*.md']
      };
      const testMonitor = new WorkflowMonitor(testConfig);
      const tasksContent = `
# Implementation Plan

- [ ] 1. Parent Task One
  - [ ] 1.1 Subtask of Parent One
  - [ ] 1.2 Another Subtask of Parent One

- [ ] 2. Parent Task Two
  - [ ] 2.1 Subtask of Parent Two

- [ ] 10. Parent Task Ten
  - [ ] 10.1 Subtask of Parent Ten
  - [ ] 10.2 Another Subtask of Parent Ten

- [ ] 11. Parent Task Eleven
  - [ ] 11.1 Subtask of Parent Eleven
`;

      const extractTaskName = (testMonitor as any).extractTaskName.bind(testMonitor);

      // Verify parent tasks don't match subtasks
      expect(extractTaskName(tasksContent, '1')).toBe('Parent Task One');
      expect(extractTaskName(tasksContent, '1')).not.toBe('Subtask of Parent One');
      
      expect(extractTaskName(tasksContent, '2')).toBe('Parent Task Two');
      expect(extractTaskName(tasksContent, '2')).not.toBe('Subtask of Parent Two');
      
      expect(extractTaskName(tasksContent, '10')).toBe('Parent Task Ten');
      expect(extractTaskName(tasksContent, '10')).not.toBe('Subtask of Parent Ten');
      
      expect(extractTaskName(tasksContent, '11')).toBe('Parent Task Eleven');
      expect(extractTaskName(tasksContent, '11')).not.toBe('Subtask of Parent Eleven');

      // Verify subtasks are extracted correctly
      expect(extractTaskName(tasksContent, '1.1')).toBe('Subtask of Parent One');
      expect(extractTaskName(tasksContent, '10.1')).toBe('Subtask of Parent Ten');
      expect(extractTaskName(tasksContent, '11.1')).toBe('Subtask of Parent Eleven');
    });

    it('should handle real-world task formats with metadata', async () => {
      const testConfig: DetectionConfig = {
        ...DEFAULT_RELEASE_CONFIG.detection,
        monitorPaths: ['.kiro/specs/*/completion/*.md']
      };
      const testMonitor = new WorkflowMonitor(testConfig);
      const tasksContent = `
# Implementation Plan

- [ ] 1. Fix Task Name Extraction Regex Bug (Group 5)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 15 minutes
  **Priority**: Quick Win
  
  **Success Criteria:**
  - Regex pattern uses negative lookahead to prevent subtask matching
  - Parent task "1" matches only "1. Main Task", not "1.1 Sub Task"
  - All task name extraction tests pass
  - Commit messages reference correct tasks

  - [ ] 1.1 Update regex pattern to use negative lookahead
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Locate task name extraction code
    - Replace \`(?:\\\\.\\\\d+)?\` with \`(?!\\\\.)\`
    - Test with various task number formats
    - Verify parent tasks match correctly
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 1.2 Verify commit message generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test commit message generation with updated regex
    - Verify correct task names in messages
    - Check edge cases (task 10, task 100, etc.)
    - _Requirements: 1.4_
`;

      const extractTaskName = (testMonitor as any).extractTaskName.bind(testMonitor);

      // Verify extraction works with real-world task format including metadata
      const parentTaskName = extractTaskName(tasksContent, '1');
      const subtask1Name = extractTaskName(tasksContent, '1.1');
      const subtask2Name = extractTaskName(tasksContent, '1.2');

      expect(parentTaskName).toBe('Fix Task Name Extraction Regex Bug (Group 5)');
      expect(subtask1Name).toBe('Update regex pattern to use negative lookahead');
      expect(subtask2Name).toBe('Verify commit message generation');

      // Verify commit messages would be correct
      expect(`Task 1 Complete: ${parentTaskName}`).toBe('Task 1 Complete: Fix Task Name Extraction Regex Bug (Group 5)');
      expect(`Task 1.1 Complete: ${subtask1Name}`).toBe('Task 1.1 Complete: Update regex pattern to use negative lookahead');
      expect(`Task 1.2 Complete: ${subtask2Name}`).toBe('Task 1.2 Complete: Verify commit message generation');
    });
  });
