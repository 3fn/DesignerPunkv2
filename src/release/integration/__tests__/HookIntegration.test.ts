/**
 * Hook Integration Tests
 * 
 * Tests hook system integration with isolated mocks.
 * No real file system operations or hook modifications.
 * 
 * Mock Strategy:
 * - jest.mock for fs and child_process modules
 * - Manual mocks for hook execution
 * - No shared state between tests
 */

import { HookIntegration, HookConfig } from '../HookIntegration';
import * as fs from 'fs';
import { execSync } from 'child_process';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock child_process module
jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('HookIntegration', () => {
  let hookIntegration: HookIntegration;
  const mockProjectRoot = '/mock/project';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default fs mocks
    mockFs.existsSync.mockReturnValue(true);
    mockFs.mkdirSync.mockReturnValue(undefined);
    mockFs.appendFileSync.mockReturnValue(undefined);
    mockFs.accessSync.mockReturnValue(undefined);
    
    hookIntegration = new HookIntegration(mockProjectRoot);
  });

  describe('integrateWithCommitHook', () => {
    it('should detect task completion commits', async () => {
      const commitMessage = 'Task 9.1 Complete: Create hook system integration';
      
      mockExecSync.mockReturnValue('Release trigger created');

      const result = await hookIntegration.integrateWithCommitHook(commitMessage);

      expect(result.success).toBe(true);
      expect(result.hookName).toBe('commit-hook');
      expect(result.executionTime).toBeGreaterThanOrEqual(0); // Changed: execution can be instant in tests
      expect(mockExecSync).toHaveBeenCalled();
    });

    it('should detect completion documents in commits', async () => {
      const commitMessage = 'Update completion documentation';
      
      mockExecSync
        .mockReturnValueOnce('.kiro/specs/test/completion/task-1-completion.md\n')
        .mockReturnValue('Release trigger created');

      const result = await hookIntegration.integrateWithCommitHook(commitMessage);

      expect(result.success).toBe(true);
      expect(result.output).toContain('completion documents');
    });

    it('should handle commits with no release triggers', async () => {
      const commitMessage = 'Update README';
      
      mockExecSync.mockReturnValue('');

      const result = await hookIntegration.integrateWithCommitHook(commitMessage);

      expect(result.success).toBe(true);
      expect(result.output).toContain('No release triggers detected');
    });

    it('should handle errors gracefully', async () => {
      const commitMessage = 'Task 9.1 Complete: Test';
      
      mockExecSync.mockImplementation(() => {
        throw new Error('Script execution failed');
      });

      const result = await hookIntegration.integrateWithCommitHook(commitMessage);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Script execution failed');
    });
  });

  describe('integrateWithOrganizationHook', () => {
    it('should execute release manager with organize command', async () => {
      mockExecSync.mockReturnValue('Organization integration complete');

      const result = await hookIntegration.integrateWithOrganizationHook();

      expect(result.success).toBe(true);
      expect(result.hookName).toBe('organization-hook');
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('organize'),
        expect.any(Object)
      );
    });

    it('should handle organization hook errors', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Organization failed');
      });

      const result = await hookIntegration.integrateWithOrganizationHook();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Organization failed');
    });
  });

  describe('triggerReleaseDetection', () => {
    it('should trigger spec completion detection', async () => {
      const sourcePath = '.kiro/specs/test/completion/task-1-completion.md';
      
      mockExecSync.mockReturnValue('Release detection triggered');

      const result = await hookIntegration.triggerReleaseDetection('spec-completion', sourcePath);

      expect(result.success).toBe(true);
      expect(result.hookName).toBe('manual-trigger');
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('spec-completion'),
        expect.any(Object)
      );
    });

    it('should trigger task completion detection', async () => {
      mockExecSync.mockReturnValue('Release detection triggered');

      const result = await hookIntegration.triggerReleaseDetection('task-completion');

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('task-completion'),
        expect.any(Object)
      );
    });

    it('should trigger auto detection', async () => {
      mockExecSync.mockReturnValue('Auto detection complete');

      const result = await hookIntegration.triggerReleaseDetection('auto');

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('auto'),
        expect.any(Object)
      );
    });

    it('should handle detection errors', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Detection failed');
      });

      const result = await hookIntegration.triggerReleaseDetection('auto');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Detection failed');
    });
  });

  describe('checkHookStatus', () => {
    it('should report configured status when all checks pass', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.accessSync.mockReturnValue(undefined);

      const status = await hookIntegration.checkHookStatus();

      expect(status.configured).toBe(true);
      expect(status.releaseManagerExists).toBe(true);
      expect(status.configExists).toBe(true);
      expect(status.issues).toHaveLength(0);
    });

    it('should report issues when release manager is missing', async () => {
      mockFs.existsSync.mockImplementation((path: any) => {
        return !path.toString().includes('release-manager.sh');
      });

      const status = await hookIntegration.checkHookStatus();

      expect(status.configured).toBe(false);
      expect(status.releaseManagerExists).toBe(false);
      expect(status.issues).toContain('Release manager script not found');
    });

    it('should report issues when script is not executable', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.accessSync.mockImplementation(() => {
        throw new Error('Not executable');
      });

      const status = await hookIntegration.checkHookStatus();

      expect(status.configured).toBe(false);
      expect(status.issues).toContain('Release manager script is not executable');
    });

    it('should report issues when config is missing', async () => {
      mockFs.existsSync.mockImplementation((path: any) => {
        return !path.toString().includes('release-config.json');
      });

      const status = await hookIntegration.checkHookStatus();

      expect(status.configured).toBe(false);
      expect(status.configExists).toBe(false);
      expect(status.issues).toContain('Release configuration file not found');
    });
  });

  describe('coordinateHookExecution', () => {
    it('should execute hooks in sequence', async () => {
      const executionOrder: string[] = [];
      
      const hooks = [
        {
          name: 'hook1',
          execute: async () => {
            executionOrder.push('hook1');
            return {
              success: true,
              hookName: 'hook1',
              executionTime: 100
            };
          }
        },
        {
          name: 'hook2',
          execute: async () => {
            executionOrder.push('hook2');
            return {
              success: true,
              hookName: 'hook2',
              executionTime: 100
            };
          }
        }
      ];

      const results = await hookIntegration.coordinateHookExecution(hooks);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(executionOrder).toEqual(['hook1', 'hook2']);
    });

    it('should stop execution when a hook fails', async () => {
      const executionOrder: string[] = [];
      
      const hooks = [
        {
          name: 'hook1',
          execute: async () => {
            executionOrder.push('hook1');
            return {
              success: false,
              hookName: 'hook1',
              executionTime: 100,
              error: 'Hook1 failed'
            };
          }
        },
        {
          name: 'hook2',
          execute: async () => {
            executionOrder.push('hook2');
            return {
              success: true,
              hookName: 'hook2',
              executionTime: 100
            };
          }
        }
      ];

      const results = await hookIntegration.coordinateHookExecution(hooks);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(executionOrder).toEqual(['hook1']);
    });

    it('should handle hook exceptions', async () => {
      const hooks = [
        {
          name: 'hook1',
          execute: async () => {
            throw new Error('Hook threw exception');
          }
        }
      ];

      const results = await hookIntegration.coordinateHookExecution(hooks);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Hook threw exception');
    });
  });

  describe('readHookConfig', () => {
    it('should read hook configuration', () => {
      const mockConfig: HookConfig = {
        enabled: true,
        name: 'Test Hook',
        description: 'Test description',
        version: '1',
        when: { type: 'fileCreated' },
        then: { type: 'askAgent' }
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const config = hookIntegration.readHookConfig('test-hook');

      expect(config).toEqual(mockConfig);
    });

    it('should return null for missing hook config', () => {
      mockFs.existsSync.mockReturnValue(false);

      const config = hookIntegration.readHookConfig('missing-hook');

      expect(config).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json');

      const config = hookIntegration.readHookConfig('invalid-hook');

      expect(config).toBeNull();
    });
  });

  describe('updateHookConfig', () => {
    it('should update hook configuration', () => {
      const mockConfig: HookConfig = {
        enabled: true,
        name: 'Test Hook',
        description: 'Test description',
        version: '1',
        when: { type: 'fileCreated' },
        then: { type: 'askAgent' }
      };

      mockFs.writeFileSync.mockReturnValue(undefined);

      const result = hookIntegration.updateHookConfig('test-hook', mockConfig);

      expect(result).toBe(true);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('test-hook.kiro.hook'),
        expect.stringContaining('"enabled": true'),
        'utf-8'
      );
    });

    it('should handle write errors', () => {
      const mockConfig: HookConfig = {
        enabled: true,
        name: 'Test Hook',
        description: 'Test description',
        version: '1',
        when: { type: 'fileCreated' },
        then: { type: 'askAgent' }
      };

      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Write failed');
      });

      const result = hookIntegration.updateHookConfig('test-hook', mockConfig);

      expect(result).toBe(false);
    });
  });
});
