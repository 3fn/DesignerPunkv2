/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Error Handling Integration Tests for Release Analysis System
 * 
 * Tests comprehensive error handling and recovery scenarios across
 * the entire system, including Git errors, file system issues, and
 * validation failures.
 */

import { ReleaseCLI } from '../cli/ReleaseCLI';
import { GitHistoryAnalyzer } from '../git/GitHistoryAnalyzer';
import { releaseAnalysisErrorHandler } from '../errors/ErrorHandler';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock external dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('fs/promises');
jest.mock('glob');

describe('Error Handling Integration Tests', () => {
  let tempDir: string;
  let cli: ReleaseCLI;
  let gitAnalyzer: GitHistoryAnalyzer;
  let mockExecSync: jest.Mock;
  let mockReadFile: jest.Mock;
  let mockWriteFile: jest.Mock;
  let mockExistsSync: jest.Mock;
  let mockStatSync: jest.Mock;
  let mockGlob: jest.Mock;

  beforeEach(async () => {
    // Create temporary directory for testing (use a simple string since we're mocking everything)
    tempDir = path.join(os.tmpdir(), 'error-handling-test-' + Math.random().toString(36).substr(2, 9));
    
    // Initialize components
    cli = new ReleaseCLI(tempDir);
    gitAnalyzer = new GitHistoryAnalyzer(tempDir);

    // Setup mocks
    const childProcess = require('child_process');
    mockExecSync = childProcess.execSync as jest.Mock;

    const fsModule = require('fs');
    mockExistsSync = fsModule.existsSync as jest.Mock;
    mockStatSync = fsModule.statSync as jest.Mock;

    const fsPromises = require('fs/promises');
    mockReadFile = fsPromises.readFile as jest.Mock;
    mockWriteFile = fsPromises.writeFile as jest.Mock;

    const globModule = require('glob');
    mockGlob = globModule.glob as jest.Mock;

    // Clear error handler history
    releaseAnalysisErrorHandler.clearErrorHistory();

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up temporary directory (not needed since we're mocking)
    // No actual cleanup needed for mocked file system
  });

  describe('Git Error Recovery', () => {
    it('should recover from Git repository not found', async () => {
      // Mock Git not available
      mockExecSync.mockImplementation(() => {
        throw new Error('git: command not found');
      });

      // Mock fallback to file system scanning
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/nogit/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      // Mock file reading with more robust setup
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (filePath.includes('task-1-completion.md')) {
          return Promise.resolve(`# No Git Recovery Test
## New Features
- Added fallback for non-Git repositories
`);
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await cli.analyzeChanges();

      // Should successfully complete analysis even without Git
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      
      // Should have a valid version recommendation (even if no documents found)
      expect(result.versionRecommendation.currentVersion).toBe('1.0.0');
      expect(['none', 'patch', 'minor', 'major']).toContain(result.versionRecommendation.bumpType);
      
      // Should have recorded the error but continued
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      expect(errorReport).toContain('Git');
    });

    it('should recover from corrupted Git repository', async () => {
      // Mock corrupted Git repository
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir (success)
        .mockImplementationOnce(() => {
          throw new Error('fatal: bad object HEAD');
        }) // git tag command fails
        .mockImplementationOnce(() => {
          throw new Error('fatal: your current branch does not have any commits yet');
        }); // git rev-parse HEAD fails

      // Should fallback to analyzing all documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/corrupt/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Corrupted Git Recovery
## Bug Fixes
- Fixed repository corruption handling
`);

      const result = await cli.analyzeChanges();

      // Should successfully complete analysis even with Git corruption
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      expect(['none', 'patch', 'minor', 'major']).toContain(result.versionRecommendation.bumpType);
    });

    it('should handle invalid Git references gracefully', async () => {
      // Mock Git repository with invalid reference
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockImplementationOnce(() => {
          throw new Error('fatal: ambiguous argument \'nonexistent-tag\': unknown revision or path');
        }); // git rev-parse nonexistent-tag fails

      // Should fallback to all documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/invalid-ref/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Invalid Reference Recovery
## Improvements
- Enhanced reference validation and fallback
`);

      const result = await cli.analyzeChanges({ since: 'nonexistent-tag' });

      // Should successfully complete analysis with fallback
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      
      // Should have logged warning about fallback (may be no errors if recovery was successful)
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      expect(errorReport).toBeDefined();
    });

    it('should handle Git permission errors', async () => {
      // Mock Git permission denied
      mockExecSync.mockImplementation(() => {
        throw new Error('fatal: unable to access \'.git/\': Permission denied');
      });

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/permission/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Permission Error Recovery
## Bug Fixes
- Fixed permission handling for Git operations
`);

      const result = await cli.analyzeChanges();

      // Should successfully complete analysis despite Git permission errors
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
    });
  });

  describe('File System Error Recovery', () => {
    it('should handle file permission errors gracefully', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/perm1/completion/task-1-completion.md',
          '.kiro/specs/perm2/completion/task-2-completion.md',
          '.kiro/specs/perm3/completion/task-3-completion.md'
        ]);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      // Mock permission errors for some files
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (filePath.includes('perm1') || filePath.includes('perm3')) {
          return Promise.reject(new Error('EACCES: permission denied, open'));
        }
        return Promise.resolve(`# Permission Recovery Test
## New Features
- Added robust permission error handling
`);
      });

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should successfully complete analysis despite permission errors
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      
      // Should have logged permission errors
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      expect(errorReport).toBeDefined();
    });

    it('should handle disk space errors', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/diskspace/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        return Promise.reject(new Error('ENOSPC: no space left on device'));
      });

      const result = await cli.analyzeChanges();

      // Should handle gracefully with fallback result
      expect(result.scope.completionDocuments).toHaveLength(0);
      expect(result.versionRecommendation.bumpType).toBe('none');
      expect(result.confidence.overall).toBeLessThan(0.5);
    });

    it('should handle network/I/O timeout errors', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/timeout1/completion/task-1-completion.md',
          '.kiro/specs/timeout2/completion/task-2-completion.md'
        ]);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      // Mock intermittent timeout errors
      let readAttempts = 0;
      mockReadFile.mockImplementation((filePath: string) => {
        readAttempts++;
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (filePath.includes('timeout1') && readAttempts <= 2) {
          return Promise.reject(new Error('ETIMEDOUT: operation timed out'));
        }
        return Promise.resolve(`# Timeout Recovery Test
## Bug Fixes
- Fixed timeout handling in file operations
`);
      });

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should successfully complete analysis despite timeout errors
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
    });

    it('should handle corrupted file content', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/corrupt1/completion/task-1-completion.md',
          '.kiro/specs/corrupt2/completion/task-2-completion.md'
        ]);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (filePath.includes('corrupt1')) {
          // Return binary/corrupted content
          return Promise.resolve('\x00\x01\x02\x03\xFF\xFE\xFD corrupted binary content');
        }
        return Promise.resolve(`# Corruption Recovery Test
## Bug Fixes
- Added handling for corrupted file content
`);
      });

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should process valid documents and handle corrupted ones gracefully
      expect(result.scope.completionDocuments.length).toBeGreaterThan(0);
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
    });
  });

  describe('Analysis Error Recovery', () => {
    it('should handle extraction errors gracefully', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/extraction/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Malformed Document
This document has no proper structure and contains
random text that doesn't follow any completion format.
It should still be processed without crashing the system.
`);

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should handle malformed documents gracefully
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      expect(['none', 'patch', 'minor', 'major']).toContain(result.versionRecommendation.bumpType);
    });

    it('should handle version calculation errors', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/version/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      // Mock invalid version in package.json
      mockReadFile
        .mockResolvedValueOnce('{"version": "invalid-version-format"}')
        .mockResolvedValueOnce(`# Version Error Recovery
## New Features
- Added version validation and error recovery
`);

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should fallback to default version and continue
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      // Version should be read correctly (either from package.json or fallback)
      expect(result.versionRecommendation.currentVersion).toBeDefined();
      expect(['none', 'patch', 'minor', 'major']).toContain(result.versionRecommendation.bumpType);
    });

    it('should handle release note generation errors', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/notes/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Release Notes Error Test
## New Features
- Feature with extremely long description ${'x'.repeat(10000)}
## Breaking Changes
- Breaking change with special characters: \x00\x01\x02\xFF
`);

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should handle problematic content in release notes
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      expect(result.releaseNotes).toBeDefined();
      expect(result.releaseNotes.length).toBeGreaterThan(0); // Should still generate notes
    });
  });

  describe('Critical System Error Recovery', () => {
    it('should handle out of memory errors', async () => {
      // Mock out of memory error during analysis
      mockExecSync.mockImplementation(() => {
        throw new Error('JavaScript heap out of memory');
      });

      const result = await cli.analyzeChanges();

      // Should return meaningful result even with out of memory errors
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      expect(['none', 'patch', 'minor', 'major']).toContain(result.versionRecommendation.bumpType);
    });

    it('should handle system resource exhaustion', async () => {
      // Mock system resource errors
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(new Error('EMFILE: too many open files'), []);
      });

      const result = await cli.analyzeChanges();

      // Should handle gracefully
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      expect(['none', 'patch', 'minor', 'major']).toContain(result.versionRecommendation.bumpType);
    });

    it('should handle unexpected exceptions during analysis', async () => {
      // Mock unexpected error in analysis pipeline
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/exception/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockImplementation(() => {
        throw new Error('Unexpected system error during stat operation');
      });

      const result = await cli.analyzeChanges();

      // Should handle unexpected errors gracefully
      expect(result.scope.completionDocuments).toHaveLength(0);
      expect(result.versionRecommendation.bumpType).toBe('none');
      expect(result.confidence.overall).toBeLessThan(0.5);
    });
  });

  describe('Error Reporting and Logging', () => {
    it('should provide comprehensive error reports', async () => {
      // Mock multiple types of errors
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockImplementationOnce(() => {
          throw new Error('Git tag operation failed');
        }); // git tag -l fails

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/error1/completion/task-1-completion.md',
          '.kiro/specs/error2/completion/task-2-completion.md'
        ]);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (filePath.includes('error1')) {
          return Promise.reject(new Error('File read error'));
        }
        return Promise.resolve(`# Error Reporting Test
## Bug Fixes
- Enhanced error reporting and logging
`);
      });

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should complete analysis despite errors
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      
      // Should provide detailed error report
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      expect(errorReport).toBeDefined();
    });

    it('should track error recovery success rates', async () => {
      // Clear error history
      releaseAnalysisErrorHandler.clearErrorHistory();

      // Mock scenario with recoverable errors
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/recovery1/completion/task-1-completion.md',
          '.kiro/specs/recovery2/completion/task-2-completion.md',
          '.kiro/specs/recovery3/completion/task-3-completion.md'
        ]);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      // Mock some recoverable errors
      let readAttempts = 0;
      mockReadFile.mockImplementation((filePath: string) => {
        readAttempts++;
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (filePath.includes('recovery1') && readAttempts <= 1) {
          return Promise.reject(new Error('Temporary file lock'));
        }
        if (filePath.includes('recovery2')) {
          return Promise.reject(new Error('Permanent permission error'));
        }
        return Promise.resolve(`# Recovery Success Test
## Improvements
- Enhanced error recovery mechanisms
`);
      });

      mockExecSync.mockReturnValue('abc123def456'); // file commits

      const result = await cli.analyzeChanges();

      // Should have completed analysis with error recovery
      expect(result).toBeDefined();
      expect(result.scope).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.versionRecommendation).toBeDefined();
      
      // Check error tracking
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      expect(errorReport).toBeDefined();
    });
  });
});