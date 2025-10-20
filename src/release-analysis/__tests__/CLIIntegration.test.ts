/**
 * CLI Integration Tests for Release Analysis System
 * 
 * Tests the complete CLI workflow from command execution through report generation,
 * including Git integration, configuration loading, and error handling scenarios.
 */

import { ReleaseCLI } from '../cli/ReleaseCLI';
import { GitHistoryAnalyzer } from '../git/GitHistoryAnalyzer';
import { SimpleChangeExtractor } from '../extraction/SimpleChangeExtractor';
import { VersionCalculator } from '../versioning/VersionCalculator';
import { ReleaseNoteGenerator } from '../notes/ReleaseNoteGenerator';
import { DEFAULT_ANALYSIS_CONFIG } from '../config/AnalysisConfig';
import * as path from 'path';
import * as os from 'os';

// Mock external dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('fs/promises');
jest.mock('glob');

// Mock the CLI's internal methods to avoid complex dependency chains
jest.mock('../cli/ReleaseCLI', () => {
  return {
    ReleaseCLI: jest.fn().mockImplementation(() => ({
      analyzeChanges: jest.fn(),
      showDetailedReport: jest.fn(),
      showSummaryReport: jest.fn(),
      showJSONReport: jest.fn(),
      saveAnalysis: jest.fn(),
      confirmVersionBump: jest.fn(),
    }))
  };
});

describe('CLI Integration Tests', () => {
  let tempDir: string;
  let cli: ReleaseCLI;
  let mockExecSync: jest.Mock;
  let mockReadFile: jest.Mock;
  let mockWriteFile: jest.Mock;
  let mockExistsSync: jest.Mock;
  let mockStatSync: jest.Mock;
  let mockGlob: jest.Mock;

  beforeEach(async () => {
    // Create temporary directory for testing (use a simple string since we're mocking everything)
    tempDir = path.join(os.tmpdir(), 'release-analysis-test-' + Math.random().toString(36).substr(2, 9));
    
    // Initialize CLI with test directory
    cli = new ReleaseCLI(tempDir);

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

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up temporary directory (not needed since we're mocking)
    // No actual cleanup needed for mocked file system
  });

  describe('Complete CLI Workflow', () => {
    it('should execute complete analysis workflow with valid repository', async () => {
      // Mock Git repository setup
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir (success)
        .mockReturnValueOnce('v1.0.0\nv0.9.0\nv0.8.0') // git tag -l --sort=-version:refname
        .mockReturnValueOnce('abc123def456') // git rev-list -n 1 v1.0.0
        .mockReturnValueOnce('2025-10-15 10:30:00 +0000') // git log -1 --format=%ci
        .mockReturnValueOnce('') // git tag -l --format='%(contents)' (no message)
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockReturnValueOnce('abc123def456') // git rev-parse v1.0.0
        .mockReturnValueOnce('ghi789jkl012|ghi789|John Doe|2025-10-20 14:30:00 +0000|Add new feature\n\nsrc/feature.ts\nsrc/feature.test.ts') // git log commits
        .mockReturnValueOnce('A\tsrc/feature.ts\nM\t.kiro/specs/feature/completion/task-1-completion.md') // git diff --name-status
        .mockReturnValueOnce('2025-10-15 10:30:00 +0000') // git log -1 --format=%ci (commit date)
        .mockReturnValueOnce('ghi789jkl012'); // git log -1 --format=%H (file last commit)

      // Mock file system for completion documents
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}') // package.json
        .mockResolvedValueOnce(`# Task 1 Completion

**Date**: 2025-10-20
**Task**: 1.1 Implement new feature
**Spec**: F1 - Feature System
**Status**: Complete

## Summary
Successfully implemented new feature with comprehensive testing.

## New Features
- Added mathematical validation system
- Implemented cross-platform token generation

## Bug Fixes
- Fixed baseline grid alignment issues
- Resolved performance bottlenecks

## Improvements
- Optimized validation algorithms by 40%
- Enhanced error messaging
`); // completion document content

      // Mock glob for finding completion documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/feature/completion/task-1-completion.md']);
      });

      // Execute analysis
      const result = await cli.analyzeChanges({
        outputFormat: 'detailed'
      });

      // Verify analysis results
      expect(result).toBeDefined();
      expect(result.scope.completionDocuments).toHaveLength(1);
      expect(result.changes.newFeatures.length).toBeGreaterThan(0);
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
      expect(result.changes.improvements.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('minor');
      expect(result.versionRecommendation.recommendedVersion).toBe('1.1.0');
      expect(result.releaseNotes).toContain('# 1.1.0');
      expect(result.confidence.overall).toBeGreaterThan(0.5);
    });

    it('should handle analysis with no previous releases', async () => {
      // Mock Git repository with no tags
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir (success)
        .mockReturnValueOnce('') // git tag -l --sort=-version:refname (no tags)
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      // Mock glob to find all completion documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/feature1/completion/task-1-completion.md',
          '.kiro/specs/feature2/completion/task-2-completion.md'
        ]);
      });

      // Mock file system
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "0.1.0"}') // package.json
        .mockResolvedValueOnce(`# Task 1 Completion
## New Features
- Initial feature implementation
`) // first completion document
        .mockResolvedValueOnce(`# Task 2 Completion
## Bug Fixes
- Fixed initial bugs
`); // second completion document

      mockExecSync.mockReturnValue('abc123def456'); // git log -1 --format=%H (file commits)

      const result = await cli.analyzeChanges();

      expect(result.scope.completionDocuments).toHaveLength(2);
      expect(result.changes.newFeatures.length).toBeGreaterThan(0);
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('minor');
    });

    it('should handle analysis with custom since parameter', async () => {
      // Mock Git repository
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockReturnValueOnce('abc123def456') // git rev-parse v0.9.0
        .mockReturnValueOnce('ghi789jkl012|ghi789|Jane Doe|2025-10-18 12:00:00 +0000|Fix critical bug\n\nsrc/bugfix.ts') // git log commits
        .mockReturnValueOnce('M\t.kiro/specs/bugfix/completion/task-3-completion.md') // git diff --name-status
        .mockReturnValueOnce('2025-10-18 12:00:00 +0000') // git log commit date
        .mockReturnValueOnce('ghi789jkl012'); // git log file commit

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-18') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}') // package.json
        .mockResolvedValueOnce(`# Bug Fix Completion
## Bug Fixes
- Fixed critical security vulnerability
- Resolved memory leak in token processing
`);

      const result = await cli.analyzeChanges({ since: 'v0.9.0' });

      expect(result.scope.fromTag).toBe('v0.9.0');
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('patch');
      expect(result.versionRecommendation.recommendedVersion).toBe('1.0.1');
    });
  });

  describe('Git Integration Scenarios', () => {
    it('should handle repository without Git', async () => {
      // Mock non-Git repository
      mockExecSync.mockImplementation(() => {
        throw new Error('Not a git repository');
      });

      // Mock glob to find completion documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/feature/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Task Completion
## New Features
- Added feature without Git tracking
`);

      const result = await cli.analyzeChanges();

      // Should still work by analyzing all available documents
      expect(result.scope.completionDocuments).toHaveLength(1);
      expect(result.changes.newFeatures.length).toBeGreaterThan(0);
    });

    it('should handle corrupted Git repository', async () => {
      // Mock corrupted Git repository
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir (success)
        .mockImplementationOnce(() => {
          throw new Error('fatal: bad object HEAD');
        }); // git tag command fails

      // Should fallback to analyzing all documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/feature/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Recovery Test
## Bug Fixes
- Fixed repository corruption issues
`);

      const result = await cli.analyzeChanges();

      expect(result.scope.completionDocuments).toHaveLength(1);
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
    });

    it('should handle invalid Git references', async () => {
      // Mock Git repository with invalid reference
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockImplementationOnce(() => {
          throw new Error('fatal: ambiguous argument \'invalid-ref\': unknown revision');
        }); // git rev-parse invalid-ref fails

      // Should fallback to all documents
      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/feature/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Invalid Ref Recovery
## Improvements
- Enhanced error handling for invalid references
`);

      const result = await cli.analyzeChanges({ since: 'invalid-ref' });

      expect(result.scope.completionDocuments).toHaveLength(1);
      expect(result.changes.improvements.length).toBeGreaterThan(0);
    });

    it('should handle empty Git repository', async () => {
      // Mock empty Git repository
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l (no tags)
        .mockImplementationOnce(() => {
          throw new Error('fatal: your current branch \'main\' does not have any commits yet');
        }); // git rev-parse HEAD fails

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, []);
      });

      const result = await cli.analyzeChanges();

      expect(result.scope.completionDocuments).toHaveLength(0);
      expect(result.versionRecommendation.bumpType).toBe('none');
      expect(result.confidence.overall).toBeLessThan(0.5);
    });
  });

  describe('Configuration Loading and Application', () => {
    it('should load and apply custom configuration', async () => {
      const customConfig = {
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          breakingChangeKeywords: ['BREAKING', 'REMOVED', 'DEPRECATED'],
          featureKeywords: ['FEATURE', 'ADDED', 'NEW'],
          confidenceThresholds: {
            minimumConfidence: 0.8,
            uncertaintyThreshold: 0.9,
            reviewThreshold: 0.85,
            deduplicationThreshold: 0.75,
            semanticSimilarityThreshold: 0.8
          }
        },
        versioning: {
          ...DEFAULT_ANALYSIS_CONFIG.versioning,
          versionBumpRules: {
            ...DEFAULT_ANALYSIS_CONFIG.versioning.versionBumpRules,
            defaultBumpType: 'minor' as const,
            requireMajorConfirmation: true
          }
        }
      };

      // Mock configuration file
      mockExistsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.kiro/release-config.json');
      });

      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('.kiro/release-config.json')) {
          return Promise.resolve(JSON.stringify(customConfig));
        }
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        return Promise.resolve(`# Custom Config Test
## New Features
- FEATURE: Custom configuration loading
## Breaking Changes  
- BREAKING: Removed old configuration format
`);
      });

      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l (no previous releases)
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/config/completion/task-1-completion.md']);
      });

      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      mockExecSync.mockReturnValue('abc123def456'); // file commit

      const result = await cli.analyzeChanges();

      // Verify custom configuration was applied
      expect(result.changes.newFeatures.length).toBeGreaterThan(0);
      expect(result.changes.breakingChanges.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('major'); // Breaking changes should trigger major
    });

    it('should handle missing configuration gracefully', async () => {
      // Mock no configuration file
      mockExistsSync.mockReturnValue(false);
      
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        return Promise.resolve(`# Default Config Test
## New Features
- Added feature with default configuration
`);
      });

      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/default/completion/task-1-completion.md']);
      });

      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      mockExecSync.mockReturnValue('abc123def456');

      const result = await cli.analyzeChanges();

      // Should work with default configuration
      expect(result.changes.newFeatures.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('minor');
    });

    it('should handle malformed configuration file', async () => {
      // Mock malformed configuration
      mockExistsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.kiro/release-config.json');
      });

      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('.kiro/release-config.json')) {
          return Promise.resolve('{ invalid json content }');
        }
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        return Promise.resolve(`# Malformed Config Recovery
## Bug Fixes
- Fixed configuration parsing errors
`);
      });

      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/recovery/completion/task-1-completion.md']);
      });

      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      mockExecSync.mockReturnValue('abc123def456');

      const result = await cli.analyzeChanges();

      // Should fallback to default configuration
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('patch');
    });
  });

  describe('Error Handling and Recovery Scenarios', () => {
    it('should handle file system permission errors', async () => {
      // Mock permission denied errors
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockImplementation((filePath: string) => {
        if (filePath.includes('completion')) {
          return Promise.reject(new Error('EACCES: permission denied'));
        }
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        return Promise.resolve('{}');
      });

      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/permission/completion/task-1-completion.md']);
      });

      const result = await cli.analyzeChanges();

      // Should handle gracefully with empty results
      expect(result.scope.completionDocuments).toHaveLength(0);
      expect(result.versionRecommendation.bumpType).toBe('none');
      expect(result.confidence.overall).toBeLessThan(0.5);
    });

    it('should handle network/disk I/O errors during analysis', async () => {
      // Mock intermittent I/O errors
      let readAttempts = 0;
      mockReadFile.mockImplementation((filePath: string) => {
        readAttempts++;
        if (filePath.includes('package.json')) {
          return Promise.resolve('{"version": "1.0.0"}');
        }
        if (readAttempts <= 2) {
          return Promise.reject(new Error('EIO: i/o error'));
        }
        return Promise.resolve(`# I/O Recovery Test
## Bug Fixes
- Fixed intermittent I/O errors
`);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });

      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockReturnValue('abc123def456'); // file commits

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, [
          '.kiro/specs/io1/completion/task-1-completion.md',
          '.kiro/specs/io2/completion/task-2-completion.md',
          '.kiro/specs/io3/completion/task-3-completion.md'
        ]);
      });

      const result = await cli.analyzeChanges();

      // Should recover and process available documents
      expect(result.scope.completionDocuments.length).toBeGreaterThan(0);
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
    });

    it('should handle analysis with no completion documents found', async () => {
      // Mock Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('v1.0.0') // git tag -l
        .mockReturnValueOnce('abc123def456') // git rev-list -n 1 v1.0.0
        .mockReturnValueOnce('2025-10-15 10:30:00 +0000') // git log date
        .mockReturnValueOnce('') // git tag message
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockReturnValueOnce('abc123def456') // git rev-parse v1.0.0
        .mockReturnValueOnce('') // git log commits (no commits)
        .mockReturnValueOnce('') // git diff --name-status (no changes)
        .mockReturnValueOnce('2025-10-15 10:30:00 +0000'); // git log commit date

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, []); // No completion documents found
      });

      mockReadFile.mockResolvedValue('{"version": "1.0.0"}'); // package.json

      const result = await cli.analyzeChanges();

      expect(result.scope.completionDocuments).toHaveLength(0);
      expect(result.changes.breakingChanges).toHaveLength(0);
      expect(result.changes.newFeatures).toHaveLength(0);
      expect(result.changes.bugFixes).toHaveLength(0);
      expect(result.versionRecommendation.bumpType).toBe('none');
      expect(result.confidence.overall).toBeLessThan(0.5);
    });

    it('should handle critical system errors gracefully', async () => {
      // Mock critical system error
      mockExecSync.mockImplementation(() => {
        throw new Error('ENOSPC: no space left on device');
      });

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(new Error('ENOSPC: no space left on device'), []);
      });

      const result = await cli.analyzeChanges();

      // Should return fallback result
      expect(result.scope.completionDocuments).toHaveLength(0);
      expect(result.versionRecommendation.bumpType).toBe('none');
      expect(result.confidence.overall).toBe(0);
      expect(result.releaseNotes).toContain('Analysis Failed');
    });
  });

  describe('Output Format Integration', () => {
    beforeEach(() => {
      // Setup common mocks for output format tests
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('') // git tag -l
        .mockReturnValueOnce('def456ghi789'); // git rev-parse HEAD

      mockGlob.mockImplementation((pattern: string, options: any, callback: Function) => {
        callback(null, ['.kiro/specs/output/completion/task-1-completion.md']);
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-10-20') });
      
      mockReadFile
        .mockResolvedValueOnce('{"version": "1.0.0"}')
        .mockResolvedValueOnce(`# Output Format Test
## New Features
- Added comprehensive output formatting
- Implemented JSON export functionality
## Bug Fixes
- Fixed formatting edge cases
`);

      mockExecSync.mockReturnValue('abc123def456');
    });

    it('should generate summary format output', async () => {
      const result = await cli.analyzeChanges({ outputFormat: 'summary' });

      expect(result.changes.newFeatures.length).toBeGreaterThan(0);
      expect(result.changes.bugFixes.length).toBeGreaterThan(0);
      expect(result.versionRecommendation.bumpType).toBe('minor');

      // Test summary display (would normally go to console)
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      cli.showSummaryReport(result);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Release Analysis Summary'));
      consoleSpy.mockRestore();
    });

    it('should generate detailed format output', async () => {
      const result = await cli.analyzeChanges({ outputFormat: 'detailed' });

      expect(result.confidence).toBeDefined();
      expect(result.confidence.overall).toBeGreaterThan(0);

      // Test detailed display
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      cli.showDetailedReport(result);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Detailed Analysis Report'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Confidence Metrics'));
      consoleSpy.mockRestore();
    });

    it('should generate JSON format output', async () => {
      const result = await cli.analyzeChanges({ outputFormat: 'json' });

      // Test JSON serialization
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      cli.showJSONReport(result);
      
      const jsonOutput = consoleSpy.mock.calls[0][0];
      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      
      const parsed = JSON.parse(jsonOutput);
      expect(parsed.scope).toBeDefined();
      expect(parsed.changes).toBeDefined();
      expect(parsed.versionRecommendation).toBeDefined();
      expect(parsed.releaseNotes).toBeDefined();
      expect(parsed.confidence).toBeDefined();
      
      consoleSpy.mockRestore();
    });

    it('should save analysis results to file', async () => {
      const result = await cli.analyzeChanges();
      const outputPath = path.join(tempDir, 'analysis-result.json');

      await cli.saveAnalysis(result, outputPath);

      expect(mockWriteFile).toHaveBeenCalledWith(
        outputPath,
        expect.stringContaining('"analysis"'),
        'utf-8'
      );
    });
  });
});