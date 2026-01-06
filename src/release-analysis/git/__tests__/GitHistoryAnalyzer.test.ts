/**
 * @category evergreen
 * @purpose Verify GitHistoryAnalyzer functionality works correctly
 */
import { GitHistoryAnalyzer, GitTag, GitChanges, AnalysisScope } from '../GitHistoryAnalyzer';
import { CompletionDocument } from '../../types/AnalysisTypes';
import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

// Mock child_process and fs modules
jest.mock('child_process');
jest.mock('fs');
jest.mock('path');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;
const mockJoin = join as jest.MockedFunction<typeof join>;

describe('GitHistoryAnalyzer', () => {
  let analyzer: GitHistoryAnalyzer;
  const mockWorkingDir = '/test/repo';

  beforeEach(() => {
    analyzer = new GitHistoryAnalyzer(mockWorkingDir);
    jest.clearAllMocks();
    
    // Default mocks
    mockJoin.mockImplementation((...paths) => paths.join('/'));
  });

  describe('findLastRelease', () => {
    it('should find the latest semantic version tag', async () => {
      // Mock Git repository check
      mockExecSync.mockReturnValueOnce(''); // rev-parse --git-dir succeeds
      
      // Mock tag listing
      mockExecSync.mockReturnValueOnce('v2.1.0\nv2.0.0\nv1.5.0\nsome-other-tag\n');
      
      // Mock tag info for v2.1.0
      mockExecSync
        .mockReturnValueOnce('abc123def456') // rev-list for commit
        .mockReturnValueOnce('2025-01-15 10:30:00 +0000') // log for date
        .mockReturnValueOnce('Release v2.1.0 with new features'); // tag message

      const result = await analyzer.findLastRelease();

      expect(result).toEqual({
        name: 'v2.1.0',
        commit: 'abc123def456',
        date: new Date('2025-01-15 10:30:00 +0000'),
        message: 'Release v2.1.0 with new features'
      });
    });

    it('should return null when no release tags exist', async () => {
      mockExecSync.mockReturnValueOnce(''); // rev-parse --git-dir succeeds
      mockExecSync.mockReturnValueOnce(''); // no tags

      const result = await analyzer.findLastRelease();

      expect(result).toBeNull();
    });

    it('should return error recovery object when not in a Git repository', async () => {
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not a git repository');
      });

      const result = await analyzer.findLastRelease();

      expect(result).toEqual(expect.objectContaining({ confidenceReduction: expect.any(Number) }));
    });

    it('should skip non-semantic version tags', async () => {
      mockExecSync.mockReturnValueOnce(''); // rev-parse --git-dir succeeds
      mockExecSync.mockReturnValueOnce('some-tag\nanother-tag\nv1.0.0\n');
      
      // Mock tag info for v1.0.0
      mockExecSync
        .mockReturnValueOnce('def456abc123')
        .mockReturnValueOnce('2025-01-10 09:00:00 +0000')
        .mockReturnValueOnce('');

      const result = await analyzer.findLastRelease();

      expect(result?.name).toBe('v1.0.0');
    });
  });

  describe('getChangesSince', () => {
    it('should return changes since a tag', async () => {
      const mockCommitOutput = `abc123|abc|John Doe|2025-01-15 10:00:00 +0000|Add new feature
src/feature.ts
src/feature.test.ts

def456|def|Jane Smith|2025-01-14 15:30:00 +0000|Fix bug in validation
src/validator.ts`;

      const mockDiffOutput = `A\tsrc/feature.ts
A\tsrc/feature.test.ts
M\tsrc/validator.ts
D\told-file.ts`;

      mockExecSync
        .mockReturnValueOnce('current-head-commit') // rev-parse HEAD
        .mockReturnValueOnce('tag-commit-hash') // rev-parse tag
        .mockReturnValueOnce(mockCommitOutput) // log for commits
        .mockReturnValueOnce(mockDiffOutput) // diff for file changes
        .mockReturnValueOnce('2025-01-14 09:00:00 +0000'); // commit date

      const result = await analyzer.getChangesSince('v1.0.0');

      expect(result.commits).toHaveLength(2);
      expect(result.commits[0]).toEqual({
        hash: 'abc123',
        shortHash: 'abc',
        author: 'John Doe',
        date: new Date('2025-01-15 10:00:00 +0000'),
        message: 'Add new feature',
        files: ['src/feature.ts', 'src/feature.test.ts']
      });

      expect(result.addedFiles).toEqual(['src/feature.ts', 'src/feature.test.ts']);
      expect(result.modifiedFiles).toEqual(['src/validator.ts']);
      expect(result.deletedFiles).toEqual(['old-file.ts']);
    });

    it('should handle empty commit history', async () => {
      mockExecSync
        .mockReturnValueOnce('current-head-commit')
        .mockReturnValueOnce('tag-commit-hash')
        .mockReturnValueOnce('') // no commits
        .mockReturnValueOnce('') // no file changes
        .mockReturnValueOnce('2025-01-14 09:00:00 +0000');

      const result = await analyzer.getChangesSince('v1.0.0');

      expect(result.commits).toHaveLength(0);
      expect(result.addedFiles).toHaveLength(0);
      expect(result.modifiedFiles).toHaveLength(0);
      expect(result.deletedFiles).toHaveLength(0);
    });

    it('should throw error for invalid reference', async () => {
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Invalid reference');
      });

      await expect(analyzer.getChangesSince('invalid-tag')).rejects.toThrow(
        'Failed to get changes since invalid-tag'
      );
    });
  });

  describe('findCompletionDocuments', () => {
    it('should find task summary documents from Git changes', async () => {
      const mockChanges: GitChanges = {
        commits: [],
        addedFiles: [
          'docs/specs/feature-a/task-1-summary.md',
          'src/feature.ts',
          'docs/specs/feature-b/task-2-summary.md'
        ],
        modifiedFiles: [
          'docs/specs/feature-a/task-3-summary.md',
          'README.md'
        ],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const mockContent = `# Task 1 Summary: Implement Feature

**Date**: 2025-01-15
**Task**: 1. Implement feature
**Spec**: F1 - Feature A

---

## What

Implemented the new feature with full test coverage.

## Why

This feature enables users to perform new actions.

## Impact

- New capability added
- Tests passing`;

      // Mock file system operations
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ mtime: new Date('2025-01-15') } as any);
      
      // Mock Git command for last commit
      mockExecSync.mockReturnValue('commit-hash-123');

      // Mock fs.readFile
      const mockReadFile = jest.fn().mockResolvedValue(mockContent);
      jest.doMock('fs/promises', () => ({
        readFile: mockReadFile
      }));

      const result = await analyzer.findCompletionDocuments(mockChanges);

      expect(result).toHaveLength(3); // 3 task summary documents found
      expect(result[0].path).toBe('docs/specs/feature-a/task-1-summary.md');
      expect(result[0].metadata.type).toBe('task-summary');
      expect(result[0].metadata.task).toBe('1. Implement feature');
    });

    it('should handle missing task summary documents gracefully', async () => {
      const mockChanges: GitChanges = {
        commits: [],
        addedFiles: ['docs/specs/feature-a/task-1-summary.md'],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      mockExistsSync.mockReturnValue(false);

      const result = await analyzer.findCompletionDocuments(mockChanges);

      expect(result).toHaveLength(0);
    });

    it('should filter out non-summary documents', async () => {
      const mockChanges: GitChanges = {
        commits: [],
        addedFiles: [
          'src/feature.ts',
          'README.md',
          'docs/specs/feature-a/requirements.md'
        ],
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      };

      const result = await analyzer.findCompletionDocuments(mockChanges);

      expect(result).toHaveLength(0);
    });
  });

  describe('validateAnalysisScope', () => {
    it('should validate a correct analysis scope', () => {
      const mockScope: AnalysisScope = {
        fromTag: 'v1.0.0',
        fromCommit: 'abc123',
        toCommit: 'def456',
        completionDocuments: [
          {
            path: 'docs/specs/feature/task-1-summary.md',
            content: '',
            lastModified: new Date(),
            gitCommit: 'abc123',
            metadata: { title: 'Task 1 Summary', type: 'task-summary' }
          }
        ],
        analysisDate: new Date()
      };

      // Mock Git repository check and commit validation
      mockExecSync
        .mockReturnValueOnce('') // rev-parse --git-dir succeeds
        .mockReturnValueOnce('abc123') // verify fromCommit
        .mockReturnValueOnce('def456'); // verify toCommit

      mockExistsSync.mockReturnValue(true);

      const result = analyzer.validateAnalysisScope(mockScope);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid Git repository', () => {
      const mockScope: AnalysisScope = {
        toCommit: 'def456',
        completionDocuments: [],
        analysisDate: new Date()
      };

      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not a git repository');
      });

      const result = analyzer.validateAnalysisScope(mockScope);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Not a Git repository or Git is not available');
    });

    it('should detect invalid commit references', () => {
      const mockScope: AnalysisScope = {
        fromCommit: 'invalid-commit',
        toCommit: 'def456',
        completionDocuments: [],
        analysisDate: new Date()
      };

      mockExecSync
        .mockReturnValueOnce('') // rev-parse --git-dir succeeds
        .mockImplementationOnce(() => { throw new Error('Invalid commit'); }) // fromCommit fails
        .mockReturnValueOnce('def456'); // toCommit succeeds

      const result = analyzer.validateAnalysisScope(mockScope);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('From commit invalid-commit does not exist');
    });

    it('should detect missing task summary documents', () => {
      const mockScope: AnalysisScope = {
        toCommit: 'def456',
        completionDocuments: [
          {
            path: 'missing-file.md',
            content: '',
            lastModified: new Date(),
            gitCommit: 'abc123',
            metadata: { title: 'Missing', type: 'task-summary' }
          }
        ],
        analysisDate: new Date()
      };

      mockExecSync
        .mockReturnValueOnce('') // rev-parse --git-dir succeeds
        .mockReturnValueOnce('def456'); // toCommit succeeds

      mockExistsSync.mockReturnValue(false);

      const result = analyzer.validateAnalysisScope(mockScope);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Completion document not found: missing-file.md');
    });

    it('should generate warnings for potential issues', () => {
      const mockScope: AnalysisScope = {
        fromTag: 'v1.0.0',
        toCommit: 'def456',
        completionDocuments: [],
        analysisDate: new Date()
      };

      mockExecSync
        .mockReturnValueOnce('') // rev-parse --git-dir succeeds
        .mockReturnValueOnce('def456'); // toCommit succeeds

      const result = analyzer.validateAnalysisScope(mockScope);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('No completion documents found in analysis scope');
      expect(result.warnings).toContain('Analysis scope uses tag reference without commit validation');
    });
  });

  describe('private methods', () => {
    it('should identify release tags correctly', () => {
      const analyzer = new GitHistoryAnalyzer();
      
      // Access private method through type assertion for testing
      const isReleaseTag = (analyzer as any).isReleaseTag.bind(analyzer);
      
      expect(isReleaseTag('v1.0.0')).toBe(true);
      expect(isReleaseTag('1.0.0')).toBe(true);
      expect(isReleaseTag('v2.1.3')).toBe(true);
      expect(isReleaseTag('v1.0.0-beta.1')).toBe(true);
      expect(isReleaseTag('v1.0.0-alpha')).toBe(true);
      
      expect(isReleaseTag('some-tag')).toBe(false);
      expect(isReleaseTag('feature-branch')).toBe(false);
      expect(isReleaseTag('v1.0')).toBe(false);
      expect(isReleaseTag('1.0')).toBe(false);
    });

    it('should identify task summary documents correctly', () => {
      const analyzer = new GitHistoryAnalyzer();
      const isCompletionDocument = (analyzer as any).isCompletionDocument.bind(analyzer);
      
      // Primary pattern: task summary documents in docs/specs/
      expect(isCompletionDocument('docs/specs/feature/task-1-summary.md')).toBe(true);
      expect(isCompletionDocument('docs/specs/037-component-token/task-7-summary.md')).toBe(true);
      expect(isCompletionDocument('task-2-summary.md')).toBe(true);
      
      // Should NOT match old completion document patterns
      expect(isCompletionDocument('.kiro/specs/feature/completion/task-1-completion.md')).toBe(false);
      expect(isCompletionDocument('.kiro/specs/feature/completion/spec-completion-summary.md')).toBe(false);
      expect(isCompletionDocument('.kiro/specs/feature/requirements.md')).toBe(false);
      expect(isCompletionDocument('src/feature.ts')).toBe(false);
      expect(isCompletionDocument('README.md')).toBe(false);
    });

    it('should extract document metadata correctly from task summary format', () => {
      const analyzer = new GitHistoryAnalyzer();
      const extractMetadata = (analyzer as any).extractDocumentMetadata.bind(analyzer);
      
      const content = `# Task 1 Summary: Implement Feature

**Date**: 2025-01-15
**Task**: 1. Implement feature
**Spec**: F1 - Feature A

---

## What

Implemented the new feature with full test coverage.

## Why

This feature enables users to perform new actions.

## Impact

- New capability added
- Tests passing`;

      const metadata = extractMetadata(content, 'docs/specs/feature/task-1-summary.md');
      
      expect(metadata.title).toBe('Task 1 Summary: Implement Feature');
      expect(metadata.date).toBe('2025-01-15');
      expect(metadata.task).toBe('1. Implement feature');
      expect(metadata.spec).toBe('F1 - Feature A');
      expect(metadata.type).toBe('task-summary');
    });
  });
});