/**
 * Tests for Release Analysis Error Handler
 * 
 * Comprehensive test suite for error handling, recovery strategies,
 * and user guidance functionality.
 */

import { ReleaseAnalysisErrorHandler, withErrorHandling } from '../ErrorHandler';
import { ErrorContext } from '../../types';
import { GitErrorRecovery, DocumentErrorRecovery, ConfigurationErrorRecovery } from '../ErrorRecovery';

describe('ReleaseAnalysisErrorHandler', () => {
  let errorHandler: ReleaseAnalysisErrorHandler;
  let mockContext: ErrorContext;

  beforeEach(() => {
    errorHandler = new ReleaseAnalysisErrorHandler();
    mockContext = {
      operation: 'test-operation',
      component: 'test-component',
      timestamp: new Date()
    };
  });

  afterEach(() => {
    errorHandler.clearErrorHistory();
  });

  describe('Git Error Handling', () => {
    it('should handle "not a git repository" error with fallback', async () => {
      const gitError = new Error('fatal: not a git repository');
      const fallbackAction = jest.fn().mockResolvedValue({ useFileSystemScan: true });

      const result = await errorHandler.handleGitError(gitError, mockContext, fallbackAction);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GIT_ERROR');
      expect(result.error?.severity).toBe('critical');
      expect(result.error?.userGuidance).toContain('Git repository');
    });

    it('should handle invalid Git reference error', async () => {
      const gitError = new Error('fatal: invalid reference: nonexistent-tag');
      
      const result = await errorHandler.handleGitError(gitError, {
        ...mockContext,
        gitCommand: 'git rev-parse nonexistent-tag'
      });

      expect(result.success).toBe(false);
      expect(result.error?.severity).toBe('medium');
      expect(result.error?.recoveryStrategies).toHaveLength(1);
      expect(result.error?.recoveryStrategies[0].type).toBe('fallback');
    });

    it('should handle Git permission errors', async () => {
      const gitError = new Error('fatal: permission denied');
      
      const result = await errorHandler.handleGitError(gitError, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.severity).toBe('high');
      expect(result.error?.userGuidance).toContain('permissions');
    });
  });

  describe('Parsing Error Handling', () => {
    it('should handle parsing errors with skip recovery', async () => {
      const parseError = new Error('Unexpected token in JSON');
      const filePath = 'test-completion.md';

      const result = await errorHandler.handleParsingError(parseError, filePath, mockContext, true);

      expect(result.success).toBe(true); // Should succeed with skip
      expect(result.data).toBeNull();
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('Skipped problematic document');
    });

    it('should handle critical parsing errors without skip', async () => {
      const parseError = new Error('Document is corrupted');
      const filePath = 'critical-completion.md';

      const result = await errorHandler.handleParsingError(parseError, filePath, mockContext, false);

      expect(result.success).toBe(false);
      expect(result.error?.severity).toBe('high');
      expect(result.error?.userGuidance).toContain('Review the document format');
    });
  });

  describe('Validation Error Handling', () => {
    it('should handle validation errors with confidence reduction', async () => {
      const validationError = new Error('Schema validation failed');
      const confidenceImpact = 0.3;

      const result = await errorHandler.handleValidationError(validationError, mockContext, confidenceImpact);

      expect(result.success).toBe(true);
      expect(result.data?.confidenceReduction).toBe(0.3);
      expect(result.warnings[0]).toContain('confidence reduced by 30%');
    });
  });

  describe('Configuration Error Handling', () => {
    it('should handle missing configuration with default fallback', async () => {
      const configError = new Error('Configuration file not found');
      
      const result = await errorHandler.handleConfigurationError(configError, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.recoveryStrategies).toHaveLength(1);
      expect(result.error?.recoveryStrategies[0].type).toBe('fallback');
    });

    it('should handle invalid configuration format', async () => {
      const configError = new Error('Invalid JSON syntax');
      const configPath = '.kiro/release-config.json';

      const result = await errorHandler.handleConfigurationError(configError, mockContext, configPath);

      expect(result.success).toBe(false);
      expect(result.error?.userGuidance).toContain(configPath);
    });
  });

  describe('Filesystem Error Handling', () => {
    it('should handle file not found errors for read operations', async () => {
      const fsError = new Error('ENOENT: no such file or directory');
      const filePath = 'missing-file.md';

      const result = await errorHandler.handleFilesystemError(fsError, filePath, mockContext, 'read');

      expect(result.success).toBe(true); // Should continue without file
      expect(result.warnings[0]).toContain('Could not read file');
    });

    it('should handle permission denied errors for write operations', async () => {
      const fsError = new Error('EACCES: permission denied');
      const filePath = 'protected-file.md';

      const result = await errorHandler.handleFilesystemError(fsError, filePath, mockContext, 'write');

      expect(result.success).toBe(false);
      expect(result.error?.severity).toBe('high');
      expect(result.error?.userGuidance).toContain('permissions');
    });
  });

  describe('Error Summary and Reporting', () => {
    it('should create comprehensive error summary', async () => {
      // Add multiple errors with different severities
      await errorHandler.handleGitError(new Error('not a git repository'), mockContext);
      await errorHandler.handleParsingError(new Error('parse error'), 'file.md', mockContext, false); // Don't skip
      await errorHandler.handleValidationError(new Error('validation error'), mockContext);

      const summary = errorHandler.createErrorSummary();

      expect(summary.totalErrors).toBe(3);
      expect(summary.criticalErrors.length).toBeGreaterThanOrEqual(1); // At least one critical error
      expect(summary.recoverableErrors.length).toBeGreaterThanOrEqual(1); // At least one recoverable error
      expect(summary.recommendations.length).toBeGreaterThanOrEqual(1); // At least one recommendation
    });

    it('should generate formatted error report', async () => {
      await errorHandler.handleGitError(new Error('not a git repository'), mockContext);
      
      const report = errorHandler.getFormattedErrorReport();

      expect(report).toContain('Error Summary');
      expect(report).toContain('Critical Errors');
      expect(report).toContain('🚨');
      expect(report).toContain('Recommendations');
    });

    it('should return success message when no errors', () => {
      const report = errorHandler.getFormattedErrorReport();
      expect(report).toBe('✅ No errors encountered during analysis');
    });
  });

  describe('Error History Management', () => {
    it('should track error history', async () => {
      await errorHandler.handleGitError(new Error('test error'), mockContext);
      
      const summary = errorHandler.createErrorSummary();
      expect(summary.totalErrors).toBe(1);
    });

    it('should clear error history', async () => {
      await errorHandler.handleGitError(new Error('test error'), mockContext);
      errorHandler.clearErrorHistory();
      
      const summary = errorHandler.createErrorSummary();
      expect(summary.totalErrors).toBe(0);
    });
  });
});

describe('withErrorHandling utility', () => {
  let mockContext: ErrorContext;

  beforeEach(() => {
    mockContext = {
      operation: 'test-operation',
      component: 'test-component',
      timestamp: new Date()
    };
  });

  it('should handle successful operations', async () => {
    const successfulOperation = jest.fn().mockResolvedValue('success');
    
    const result = await withErrorHandling(successfulOperation, mockContext);

    expect(result.success).toBe(true);
    expect(result.data).toBe('success');
    expect(result.warnings).toHaveLength(0);
  });

  it('should handle Git errors', async () => {
    const gitOperation = jest.fn().mockRejectedValue(new Error('git command failed'));
    mockContext.gitCommand = 'git status';
    
    const result = await withErrorHandling(gitOperation, mockContext);

    expect(result.success).toBe(false);
    expect(result.error?.category).toBe('git');
  });

  it('should handle parsing errors', async () => {
    const parseOperation = jest.fn().mockRejectedValue(new Error('json parse error'));
    mockContext.filePath = 'test.json';
    
    const result = await withErrorHandling(parseOperation, mockContext);

    expect(result.success).toBe(true); // Parsing errors with skip should succeed
    expect(result.warnings).toHaveLength(1);
  });

  it('should handle unknown errors', async () => {
    const unknownOperation = jest.fn().mockRejectedValue('string error');
    
    const result = await withErrorHandling(unknownOperation, mockContext);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('UNKNOWN_ERROR');
  });
});

describe('Error Recovery Integration', () => {
  describe('GitErrorRecovery', () => {
    let gitRecovery: GitErrorRecovery;

    beforeEach(() => {
      gitRecovery = new GitErrorRecovery('/test/directory');
    });

    it('should recover from no git repository error', async () => {
      // Mock filesystem operations
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
      
      const result = await gitRecovery.recoverFromNoGitRepository();

      expect(result.success).toBe(true);
      expect(result.data?.useFileSystemScan).toBe(true);
    });

    it('should recover from invalid reference error', async () => {
      // Mock git commands
      const mockExecSync = jest.spyOn(require('child_process'), 'execSync');
      mockExecSync.mockReturnValueOnce('v1.0.0\n'); // Mock tag list
      
      const result = await gitRecovery.recoverFromInvalidReference('invalid-ref');

      expect(result.success).toBe(true);
      expect(result.data?.validReference).toBe('v1.0.0');
    });
  });

  describe('DocumentErrorRecovery', () => {
    let docRecovery: DocumentErrorRecovery;

    beforeEach(() => {
      docRecovery = new DocumentErrorRecovery();
    });

    it('should recover from parsing errors with basic parsing', async () => {
      const content = '# Test Document\n\nSome content here with enough text to meet minimum requirements for parsing.';
      const error = new Error('Metadata parsing failed');
      
      const result = await docRecovery.recoverFromParsingError('test.md', content, error);

      expect(result.success).toBe(true);
      expect(result.data?.metadata.title).toBe('Test Document');
      expect(result.data?.metadata.parsingMethod).toBe('basic');
    });

    it('should create document from filename when content is minimal', async () => {
      const content = '';
      const error = new Error('Empty document');
      
      const result = await docRecovery.recoverFromParsingError('task-1-completion.md', content, error);

      expect(result.success).toBe(true);
      expect(result.data?.metadata.type).toBe('task-completion');
      expect(result.data?.metadata.parsingMethod).toBe('filename');
    });
  });

  describe('ConfigurationErrorRecovery', () => {
    let configRecovery: ConfigurationErrorRecovery;

    beforeEach(() => {
      configRecovery = new ConfigurationErrorRecovery();
    });

    it('should recover from missing config with defaults', async () => {
      const result = await configRecovery.recoverFromMissingConfig('missing-config.json');

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('extraction');
      expect(result.data).toHaveProperty('versioning');
      expect(result.data).toHaveProperty('reporting');
    });

    it('should recover from invalid config format', async () => {
      // Mock file operations - file exists but can't be fixed
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false); // File doesn't exist
      
      const result = await configRecovery.recoverFromInvalidConfig('invalid-config.json', new Error('Invalid JSON'));

      expect(result.success).toBe(true); // Should succeed with defaults
      expect(result.data).toHaveProperty('extraction');
    });
  });
});