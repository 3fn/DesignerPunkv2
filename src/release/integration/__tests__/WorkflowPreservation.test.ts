/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * WorkflowPreservation Unit Tests
 * 
 * Tests workflow preservation logic with isolated mocks.
 * Verifies transparent processing, fallback mechanisms, and error handling.
 * 
 * Mock Strategy:
 * - jest.mock for fs module (no real file operations)
 * - Manual mocks for async operations
 * - No shared state between tests
 */

import { WorkflowPreservation } from '../WorkflowPreservation';
import * as fs from 'fs';

// Mock fs module
jest.mock('fs');

describe('WorkflowPreservation', () => {
  let preservation: WorkflowPreservation;
  const mockProjectRoot = '/test/project';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fs.existsSync to return false by default
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    
    // Mock fs.mkdirSync
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    
    // Mock fs.writeFileSync
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    
    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    
    // Mock fs.unlinkSync
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {});
    
    // Mock fs.appendFileSync
    (fs.appendFileSync as jest.Mock).mockImplementation(() => {});
    
    preservation = new WorkflowPreservation(mockProjectRoot);
  });

  describe('executeTransparently', () => {
    it('should execute operation successfully without fallback', async () => {
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      const result = await preservation.executeTransparently(
        'test-operation',
        mockExecute
      );
      
      expect(result.result).toBe('success');
      expect(result.fallbackUsed).toBe(false);
      expect(result.error).toBeUndefined();
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should use fallback when operation fails', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Operation failed'));
      const mockFallback = jest.fn().mockResolvedValue('fallback-success');
      
      const result = await preservation.executeTransparently(
        'test-operation',
        mockExecute,
        mockFallback
      );
      
      expect(result.result).toBe('fallback-success');
      expect(result.fallbackUsed).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockFallback).toHaveBeenCalledTimes(1);
    });

    it('should return error when operation fails without fallback', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Operation failed'));
      
      const result = await preservation.executeTransparently(
        'test-operation',
        mockExecute
      );
      
      expect(result.result).toBeNull();
      expect(result.fallbackUsed).toBe(false);
      expect(result.error).toBe('Operation failed');
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should return error when both operation and fallback fail', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Operation failed'));
      const mockFallback = jest.fn().mockRejectedValue(new Error('Fallback failed'));
      
      const result = await preservation.executeTransparently(
        'test-operation',
        mockExecute,
        mockFallback
      );
      
      expect(result.result).toBeNull();
      expect(result.fallbackUsed).toBe(true);
      expect(result.error).toBe('Fallback failed');
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockFallback).toHaveBeenCalledTimes(1);
    });

    it('should save and clear workflow state during execution', async () => {
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      // Mock existsSync to return true so unlinkSync is called
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      await preservation.executeTransparently(
        'test-operation',
        mockExecute
      );
      
      // Should write state file (save state)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('workflow-state.json'),
        expect.stringContaining('test-operation'),
        'utf-8'
      );
      
      // Should delete state file (clear state)
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });

  describe('isTransparentOperation', () => {
    it('should identify transparent operations', () => {
      expect(preservation.isTransparentOperation('release-detection')).toBe(true);
      expect(preservation.isTransparentOperation('trigger-creation')).toBe(true);
      expect(preservation.isTransparentOperation('log-writing')).toBe(true);
      expect(preservation.isTransparentOperation('state-tracking')).toBe(true);
      expect(preservation.isTransparentOperation('analysis-execution')).toBe(true);
    });

    it('should identify disruptive operations', () => {
      expect(preservation.isTransparentOperation('package-update')).toBe(false);
      expect(preservation.isTransparentOperation('changelog-update')).toBe(false);
      expect(preservation.isTransparentOperation('git-commit')).toBe(false);
      expect(preservation.isTransparentOperation('git-push')).toBe(false);
      expect(preservation.isTransparentOperation('github-release')).toBe(false);
      expect(preservation.isTransparentOperation('npm-publish')).toBe(false);
    });

    it('should default to non-transparent for unknown operations', () => {
      expect(preservation.isTransparentOperation('unknown-operation')).toBe(false);
    });
  });

  describe('createFallback', () => {
    it('should create fallback for release-detection', async () => {
      const fallback = preservation.createFallback('release-detection');
      
      expect(fallback).not.toBeNull();
      
      if (fallback) {
        const result = await fallback();
        expect(result.success).toBe(true);
        expect(result.fallbackUsed).toBe(true);
        expect(result.operation).toBe('release-detection');
      }
    });

    it('should create fallback for trigger-creation', async () => {
      const fallback = preservation.createFallback('trigger-creation');
      
      expect(fallback).not.toBeNull();
      
      if (fallback) {
        const result = await fallback();
        expect(result.success).toBe(true);
        expect(result.fallbackUsed).toBe(true);
        expect(result.operation).toBe('trigger-creation');
        
        // Should create trigger file
        expect(fs.writeFileSync).toHaveBeenCalledWith(
          expect.stringContaining('manual-'),
          expect.stringContaining('manual'),
          'utf-8'
        );
      }
    });

    it('should create fallback for analysis-execution', async () => {
      const fallback = preservation.createFallback('analysis-execution');
      
      expect(fallback).not.toBeNull();
      
      if (fallback) {
        const result = await fallback();
        expect(result.success).toBe(true);
        expect(result.fallbackUsed).toBe(true);
        expect(result.operation).toBe('analysis-execution');
      }
    });

    it('should return null for operations without fallback', () => {
      const fallback = preservation.createFallback('unknown-operation');
      expect(fallback).toBeNull();
    });
  });

  describe('preserveWorkflow', () => {
    it('should preserve workflow for successful transparent operation', async () => {
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      const result = await preservation.preserveWorkflow(
        'release-detection',
        mockExecute
      );
      
      expect(result.result).toBe('success');
      expect(result.preserved).toBe(true);
      expect(result.fallbackUsed).toBe(false);
    });

    it('should preserve workflow using fallback when operation fails', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Failed'));
      
      const result = await preservation.preserveWorkflow(
        'release-detection',
        mockExecute
      );
      
      expect(result.preserved).toBe(true);
      expect(result.fallbackUsed).toBe(true);
    });

    it('should indicate workflow not preserved when no fallback available', async () => {
      const mockExecute = jest.fn().mockRejectedValue(new Error('Failed'));
      
      const result = await preservation.preserveWorkflow(
        'unknown-operation',
        mockExecute
      );
      
      expect(result.result).toBeNull();
      expect(result.preserved).toBe(false);
      expect(result.fallbackUsed).toBe(false);
    });

    it('should log warning for non-transparent operations', async () => {
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      await preservation.preserveWorkflow(
        'package-update',
        mockExecute
      );
      
      // Should log warning about non-transparent operation
      expect(fs.appendFileSync).toHaveBeenCalledWith(
        expect.stringContaining('workflow-preservation.log'),
        expect.stringContaining('WARNING'),
        'utf-8'
      );
    });
  });

  describe('checkWorkflowHealth', () => {
    it('should report healthy when no issues', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('{}');
      
      const health = await preservation.checkWorkflowHealth();
      
      expect(health.healthy).toBe(true);
      expect(health.stateFileExists).toBe(true);
      expect(health.logFileExists).toBe(true);
      expect(health.issues).toHaveLength(0);
    });

    it('should report issues when state file missing', async () => {
      (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
        return !path.includes('workflow-state.json');
      });
      
      const health = await preservation.checkWorkflowHealth();
      
      expect(health.healthy).toBe(false);
      expect(health.stateFileExists).toBe(false);
      expect(health.issues).toContain('Workflow state file does not exist');
    });

    it('should report issues when log file missing', async () => {
      (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
        return !path.includes('workflow-preservation.log');
      });
      
      const health = await preservation.checkWorkflowHealth();
      
      expect(health.healthy).toBe(false);
      expect(health.logFileExists).toBe(false);
      expect(health.issues).toContain('Workflow preservation log file does not exist');
    });

    it('should detect stuck operations', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      // Mock state with old timestamp (stuck operation)
      const oldTimestamp = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        inProgress: true,
        operation: 'test-operation',
        startTime: oldTimestamp.toISOString()
      }));
      
      const health = await preservation.checkWorkflowHealth();
      
      expect(health.healthy).toBe(false);
      expect(health.currentState).not.toBeNull();
      expect(health.issues.length).toBeGreaterThan(0);
      expect(health.issues[0]).toContain('has been in progress');
    });
  });

  describe('generateTransparencyReport', () => {
    it('should generate report for all transparent operations', () => {
      const operations = [
        'release-detection',
        'trigger-creation',
        'log-writing'
      ];
      
      const report = preservation.generateTransparencyReport(operations);
      
      expect(report.operationsExecuted).toBe(3);
      expect(report.transparentOperations).toBe(3);
      expect(report.disruptiveOperations).toBe(0);
      expect(report.workflowPreserved).toBe(true);
    });

    it('should generate report for mixed operations', () => {
      const operations = [
        'release-detection',
        'package-update',
        'trigger-creation',
        'git-commit'
      ];
      
      const report = preservation.generateTransparencyReport(operations);
      
      expect(report.operationsExecuted).toBe(4);
      expect(report.transparentOperations).toBe(2);
      expect(report.disruptiveOperations).toBe(2);
      expect(report.workflowPreserved).toBe(false);
    });

    it('should generate report for all disruptive operations', () => {
      const operations = [
        'package-update',
        'git-commit',
        'npm-publish'
      ];
      
      const report = preservation.generateTransparencyReport(operations);
      
      expect(report.operationsExecuted).toBe(3);
      expect(report.transparentOperations).toBe(0);
      expect(report.disruptiveOperations).toBe(3);
      expect(report.workflowPreserved).toBe(false);
    });
  });

  describe('recoverWorkflow', () => {
    it('should report no recovery needed when workflow healthy', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const result = await preservation.recoverWorkflow();
      
      expect(result.recovered).toBe(true);
      expect(result.message).toContain('No recovery needed');
    });

    it('should recover from stuck operation', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        inProgress: true,
        operation: 'stuck-operation',
        startTime: new Date().toISOString()
      }));
      
      const result = await preservation.recoverWorkflow();
      
      expect(result.recovered).toBe(true);
      expect(result.message).toContain('Recovered from stuck operation');
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle fs errors gracefully during state save', async () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write failed');
      });
      
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      // Should not throw, should handle error gracefully
      await expect(
        preservation.executeTransparently('test-operation', mockExecute)
      ).resolves.toBeDefined();
    });

    it('should handle fs errors gracefully during state load', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Read failed');
      });
      
      const health = await preservation.checkWorkflowHealth();
      
      // Should not throw, should handle error gracefully
      expect(health.currentState).toBeNull();
    });

    it('should handle fs errors gracefully during state clear', async () => {
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {
        throw new Error('Delete failed');
      });
      
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      // Should not throw, should handle error gracefully
      await expect(
        preservation.executeTransparently('test-operation', mockExecute)
      ).resolves.toBeDefined();
    });

    it('should handle logging errors gracefully', async () => {
      (fs.appendFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Log write failed');
      });
      
      const mockExecute = jest.fn().mockResolvedValue('success');
      
      // Should not throw, should handle error gracefully
      await expect(
        preservation.executeTransparently('test-operation', mockExecute)
      ).resolves.toBeDefined();
    });
  });

  describe('test isolation', () => {
    it('should not share state between tests', async () => {
      // First test execution
      const mockExecute1 = jest.fn().mockResolvedValue('result1');
      const result1 = await preservation.executeTransparently('op1', mockExecute1);
      
      // Second test execution
      const mockExecute2 = jest.fn().mockResolvedValue('result2');
      const result2 = await preservation.executeTransparently('op2', mockExecute2);
      
      // Results should be independent
      expect(result1.result).toBe('result1');
      expect(result2.result).toBe('result2');
      expect(mockExecute1).toHaveBeenCalledTimes(1);
      expect(mockExecute2).toHaveBeenCalledTimes(1);
    });
  });
});
