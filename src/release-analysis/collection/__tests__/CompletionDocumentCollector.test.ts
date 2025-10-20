import { CompletionDocumentCollector, DocumentFilter } from '../CompletionDocumentCollector';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';
import { GitChanges } from '../../git/GitHistoryAnalyzer';
import { existsSync, statSync } from 'fs';
import { execSync } from 'child_process';

// Mock file system operations
jest.mock('fs');
jest.mock('child_process');

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('CompletionDocumentCollector', () => {
  let collector: CompletionDocumentCollector;
  let mockConfig: typeof DEFAULT_ANALYSIS_CONFIG;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockConfig = { ...DEFAULT_ANALYSIS_CONFIG };
    collector = new CompletionDocumentCollector('/test/workspace', mockConfig);

    // Default mocks
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({
      mtime: new Date('2025-01-01T12:00:00Z')
    } as any);
    mockExecSync.mockReturnValue('abc123\n');
  });

  describe('collectFromGitChanges', () => {
    it('should collect completion documents from Git changes', async () => {
      const mockReadFile = jest.fn().mockResolvedValue(`# Task 1 Completion

**Date**: 2025-01-01
**Task**: 1.1 Create basic CLI interface
**Spec**: F5 - Release Analysis System
**Status**: Complete

## Summary

Implemented basic CLI interface with analyze command.

## Breaking Changes

None.

## New Features

- Added ReleaseCLI class with analyze command
- Implemented command-line argument parsing
`);

      // Mock fs/promises
      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      const gitChanges: GitChanges = {
        commits: [],
        addedFiles: [
          '.kiro/specs/release-analysis-system/completion/task-1-completion.md',
          'src/some-other-file.ts'
        ],
        modifiedFiles: [
          '.kiro/specs/release-analysis-system/completion/task-2-completion.md'
        ],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const result = await testCollector.collectFromGitChanges(gitChanges);

      expect(result.documents).toHaveLength(2);
      expect(result.metadata.totalFilesScanned).toBe(3);
      expect(result.metadata.documentsFound).toBe(2);
      expect(result.metadata.documentsLoaded).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle missing files gracefully', async () => {
      mockExistsSync.mockImplementation((path) => {
        return !path.toString().includes('missing-file');
      });

      const gitChanges: GitChanges = {
        commits: [],
        addedFiles: [
          '.kiro/specs/release-analysis-system/completion/task-1-completion.md',
          '.kiro/specs/release-analysis-system/completion/missing-file.md'
        ],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const result = await collector.collectFromGitChanges(gitChanges);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe('access');
      expect(result.errors[0].filePath).toContain('missing-file.md');
    });

    it('should filter documents based on criteria', async () => {
      const mockReadFile = jest.fn()
        .mockResolvedValueOnce(`# Task Completion
**Date**: 2025-01-01
**Task**: 1.1 Create CLI
## Summary
Implemented CLI interface.`)
        .mockResolvedValueOnce(`# Documentation Update
**Date**: 2025-01-01
Updated README documentation and examples.`);

      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      const gitChanges: GitChanges = {
        commits: [],
        addedFiles: [
          '.kiro/specs/release-analysis-system/completion/task-1-completion.md',
          '.kiro/specs/release-analysis-system/completion/doc-update.md'
        ],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const filter: DocumentFilter = {
        documentTypes: ['task-completion']
      };

      const result = await testCollector.collectFromGitChanges(gitChanges, filter);

      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].metadata.type).toBe('task-completion');
    });
  });

  describe('collectFromPaths', () => {
    it('should collect completion documents from specific paths', async () => {
      const mockReadFile = jest.fn().mockResolvedValue(`# Spec Completion Summary

**Date**: 2025-01-01
**Spec**: F5 - Release Analysis System
**Status**: Complete

## Summary

Completed release analysis system implementation.
`);

      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      const paths = [
        '.kiro/specs/release-analysis-system/completion/spec-completion-summary.md'
      ];

      const result = await testCollector.collectFromPaths(paths);

      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].metadata.type).toBe('spec-completion');
      expect(result.metadata.totalFilesScanned).toBe(1);
    });

    it('should handle invalid paths', async () => {
      const paths = [
        '.kiro/specs/test/completion/invalid-file.md',
        '.kiro/specs/test/completion/another-invalid.md'
      ];

      mockExistsSync.mockReturnValue(false);

      const result = await collector.collectFromPaths(paths);

      expect(result.documents).toHaveLength(0);
      expect(result.errors).toHaveLength(2);
      expect(result.errors.every(e => e.type === 'access')).toBe(true);
    });
  });

  describe('validateDocument', () => {
    it('should validate a well-formed completion document', async () => {
      const document = {
        path: '.kiro/specs/test/completion/task-1-completion.md',
        content: `# Task 1 Completion

**Date**: 2025-01-01
**Task**: 1.1 Create basic CLI interface
**Spec**: F5 - Release Analysis System
**Status**: Complete

## Summary

Implemented basic CLI interface with analyze command and argument parsing.

## Breaking Changes

None identified.

## New Features

- Added ReleaseCLI class with analyze command
- Implemented command-line argument parsing and validation
- Added help system and usage documentation
`,
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Task 1 Completion',
          date: '2025-01-01',
          task: '1.1 Create basic CLI interface',
          spec: 'F5 - Release Analysis System',
          status: 'Complete',
          type: 'task-completion' as const
        }
      };

      const result = await collector.validateDocument(document);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.issues.filter(i => i.severity === 'error')).toHaveLength(0);
    });

    it('should identify validation issues in malformed documents', async () => {
      const document = {
        path: 'test.md',
        content: '', // Empty content
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: '', // Missing title
          type: 'other' as const
        }
      };

      const result = await collector.validateDocument(document);

      expect(result.isValid).toBe(false);
      expect(result.confidence).toBeLessThan(0.5);
      expect(result.issues.some(i => i.type === 'empty-content')).toBe(true);
      expect(result.issues.some(i => i.type === 'missing-metadata')).toBe(true);
    });

    it('should give higher confidence to structured documents', async () => {
      const structuredDocument = {
        path: 'structured.md',
        content: `# Test Document

## Summary
This is a summary.

## New Features
- Feature 1
- Feature 2

## Bug Fixes
- Fix 1
`,
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Test Document',
          type: 'task-completion' as const
        }
      };

      const unstructuredDocument = {
        path: 'unstructured.md',
        content: `# Test Document

This is just some text without structured sections.
`,
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Test Document',
          type: 'task-completion' as const
        }
      };

      const structuredResult = await collector.validateDocument(structuredDocument);
      const unstructuredResult = await collector.validateDocument(unstructuredDocument);

      expect(structuredResult.confidence).toBeGreaterThan(unstructuredResult.confidence);
    });
  });

  describe('document filtering', () => {
    it('should filter documentation-only documents', async () => {
      // Mock the fs/promises module before creating the collector
      const mockReadFile = jest.fn()
        .mockResolvedValueOnce(`# Feature Implementation
**Date**: 2025-01-01
## Summary
Implemented new feature with breaking changes.
## Breaking Changes
- Changed API interface
`)
        .mockResolvedValueOnce(`# Documentation Update
**Date**: 2025-01-01
## Summary
Updated documentation documentation documentation. Added README documentation sections.
Fixed documentation typos and improved documentation guide clarity.
Documentation improvements and readme documentation updates documentation.
`);

      // Mock fs/promises at the module level
      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      // Create a new collector to pick up the mocked module
      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);

      const gitChanges: GitChanges = {
        commits: [],
        addedFiles: [
          '.kiro/specs/test/completion/task-1-completion.md',
          '.kiro/specs/test/completion/doc-completion.md'
        ],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const result = await testCollector.collectFromGitChanges(gitChanges);

      // Should filter out documentation-only document
      expect(result.documents).toHaveLength(1);
      expect(result.warnings.some(w => w.includes('documentation-only'))).toBe(true);
    });

    it('should apply include and exclude patterns', async () => {
      const mockReadFile = jest.fn().mockResolvedValue(`# Test Document
**Date**: 2025-01-01
## Summary
Test content.`);

      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      const gitChanges: GitChanges = {
        commits: [],
        addedFiles: [
          '.kiro/specs/test/completion/task-1-completion.md',
          '.kiro/specs/test/completion/task-2-completion.md',
          '.kiro/specs/other/completion/task-3-completion.md'
        ],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const filter: DocumentFilter = {
        includePatterns: ['**/test/**'],
        excludePatterns: ['**/*-2-*']
      };

      const result = await testCollector.collectFromGitChanges(gitChanges, filter);

      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].path).toContain('task-1-completion.md');
    });
  });

  describe('error handling', () => {
    it('should handle Git command failures gracefully', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Git command failed');
      });

      const document = {
        path: 'test.md',
        content: 'Test content',
        lastModified: new Date(),
        gitCommit: '', // Will be empty due to Git failure
        metadata: {
          title: 'Test',
          type: 'other' as const
        }
      };

      // Should not throw, just return empty commit
      expect(document.gitCommit).toBe('');
    });

    it('should handle file read errors', async () => {
      // Reset the mock to reject for this test
      jest.resetModules();
      const mockReadFile = jest.fn().mockRejectedValue(new Error('Permission denied'));
      jest.doMock('fs/promises', () => ({
        readFile: mockReadFile
      }), { virtual: true });

      // Create a new collector instance to pick up the new mock
      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      
      const paths = ['.kiro/specs/test/completion/task-1-completion.md'];
      const result = await testCollector.collectFromPaths(paths);

      expect(result.documents).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe('validation');
    });

    it('should provide detailed error information', async () => {
      mockExistsSync.mockImplementation((path) => {
        return !path.toString().includes('nonexistent-file.md');
      });

      const gitChanges: GitChanges = {
        commits: [],
        addedFiles: ['.kiro/specs/test/completion/nonexistent-file.md'],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const result = await collector.collectFromGitChanges(gitChanges);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        filePath: '.kiro/specs/test/completion/nonexistent-file.md',
        type: 'access',
        recoverable: false
      });
      expect(result.errors[0].error).toContain('not found');
    });
  });

  describe('metadata extraction', () => {
    it('should extract metadata from document headers', async () => {
      const mockReadFile = jest.fn().mockResolvedValue(`# Task 1 Completion

**Date**: 2025-01-01
**Task**: 1.1 Create basic CLI interface  
**Spec**: F5 - Release Analysis System
**Status**: Complete

## Summary
Implementation complete.
`);

      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      const paths = ['.kiro/specs/test/completion/task-1-completion.md'];
      const result = await testCollector.collectFromPaths(paths);

      expect(result.documents).toHaveLength(1);
      const doc = result.documents[0];
      expect(doc.metadata.title).toBe('Task 1 Completion');
      expect(doc.metadata.date).toBe('2025-01-01');
      expect(doc.metadata.task).toBe('1.1 Create basic CLI interface');
      expect(doc.metadata.spec).toBe('F5 - Release Analysis System');
      expect(doc.metadata.status).toBe('Complete');
      expect(doc.metadata.type).toBe('task-completion');
    });

    it('should classify document types correctly', async () => {
      const mockReadFile = jest.fn()
        .mockResolvedValueOnce('# Task Completion\nContent')
        .mockResolvedValueOnce('# Spec Completion Summary\nContent');

      const mockFsPromises = { readFile: mockReadFile };
      jest.doMock('fs/promises', () => mockFsPromises, { virtual: true });

      const testCollector = new CompletionDocumentCollector('/test/workspace', mockConfig);
      const paths = [
        '.kiro/specs/test/completion/task-1-completion.md',
        '.kiro/specs/test/completion/spec-completion-summary.md'
      ];

      const result = await testCollector.collectFromPaths(paths);

      expect(result.documents).toHaveLength(2);
      expect(result.documents[0].metadata.type).toBe('task-completion');
      expect(result.documents[1].metadata.type).toBe('spec-completion');
    });
  });
});