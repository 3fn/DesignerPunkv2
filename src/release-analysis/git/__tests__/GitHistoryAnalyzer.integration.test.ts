/**
 * @category evergreen
 * @purpose Verify GitHistoryAnalyzer.integration functionality works correctly
 */
import { GitHistoryAnalyzer } from '../GitHistoryAnalyzer';
import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('GitHistoryAnalyzer Integration Tests', () => {
  let tempDir: string;
  let analyzer: GitHistoryAnalyzer;

  beforeEach(() => {
    // Create temporary directory for Git repository
    tempDir = mkdtempSync(join(tmpdir(), 'git-analyzer-test-'));
    analyzer = new GitHistoryAnalyzer(tempDir);

    // Initialize Git repository
    execSync('git init', { cwd: tempDir });
    execSync('git config user.name "Test User"', { cwd: tempDir });
    execSync('git config user.email "test@example.com"', { cwd: tempDir });
  });

  afterEach(() => {
    // Clean up temporary directory
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe('Real Git Operations', () => {
    it('should work with actual Git repository', async () => {
      // Create initial commit
      writeFileSync(join(tempDir, 'README.md'), '# Test Repository');
      execSync('git add README.md', { cwd: tempDir });
      execSync('git commit -m "Initial commit"', { cwd: tempDir });

      // Create and tag a release
      execSync('git tag v1.0.0', { cwd: tempDir });

      // Add task summary document (new pattern: docs/specs/*/task-*-summary.md)
      const summaryDir = join(tempDir, 'docs', 'specs', 'test-feature');
      execSync(`mkdir -p "${summaryDir}"`, { cwd: tempDir });
      
      const summaryContent = `# Task 1 Summary: Implement Test Feature

**Date**: 2025-01-15
**Task**: 1. Implement test feature
**Spec**: F1 - Test Feature

---

## What

Implemented the test feature with full test coverage.

## Why

This feature enables users to perform new actions.

## Impact

- New capability added
- Tests passing`;

      writeFileSync(join(summaryDir, 'task-1-summary.md'), summaryContent);
      execSync('git add .', { cwd: tempDir });
      execSync('git commit -m "Add task summary"', { cwd: tempDir });

      // Test finding last release
      const lastRelease = await analyzer.findLastRelease();
      expect(lastRelease).not.toBeNull();
      expect(lastRelease?.name).toBe('v1.0.0');

      // Test getting changes since release
      const changes = await analyzer.getChangesSince('v1.0.0');
      expect(changes.commits).toHaveLength(1);
      expect(changes.commits[0].message).toBe('Add task summary');
      expect(changes.addedFiles).toContain('docs/specs/test-feature/task-1-summary.md');

      // Test finding task summary documents
      const summaryDocs = await analyzer.findCompletionDocuments(changes);
      expect(summaryDocs).toHaveLength(1);
      expect(summaryDocs[0].path).toBe('docs/specs/test-feature/task-1-summary.md');
      expect(summaryDocs[0].metadata.task).toBe('1. Implement test feature');
      expect(summaryDocs[0].metadata.type).toBe('task-summary');
    });

    it('should handle repository with no releases', async () => {
      // Create initial commit without tags
      writeFileSync(join(tempDir, 'README.md'), '# Test Repository');
      execSync('git add README.md', { cwd: tempDir });
      execSync('git commit -m "Initial commit"', { cwd: tempDir });

      const lastRelease = await analyzer.findLastRelease();
      expect(lastRelease).toBeNull();
    });

    it('should validate analysis scope with real Git data', async () => {
      // Create commits and tags
      writeFileSync(join(tempDir, 'README.md'), '# Test Repository');
      execSync('git add README.md', { cwd: tempDir });
      execSync('git commit -m "Initial commit"', { cwd: tempDir });
      
      const initialCommit = execSync('git rev-parse HEAD', { cwd: tempDir, encoding: 'utf-8' }).trim();
      
      execSync('git tag v1.0.0', { cwd: tempDir });

      // Add another commit
      writeFileSync(join(tempDir, 'feature.txt'), 'New feature');
      execSync('git add feature.txt', { cwd: tempDir });
      execSync('git commit -m "Add feature"', { cwd: tempDir });
      
      const headCommit = execSync('git rev-parse HEAD', { cwd: tempDir, encoding: 'utf-8' }).trim();

      // Test scope validation
      const scope = {
        fromTag: 'v1.0.0',
        fromCommit: initialCommit,
        toCommit: headCommit,
        completionDocuments: [],
        analysisDate: new Date()
      };

      const validation = analyzer.validateAnalysisScope(scope);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should handle non-semantic version tags correctly', async () => {
      // Create initial commit
      writeFileSync(join(tempDir, 'README.md'), '# Test Repository');
      execSync('git add README.md', { cwd: tempDir });
      execSync('git commit -m "Initial commit"', { cwd: tempDir });

      // Create non-semantic tags
      execSync('git tag feature-branch', { cwd: tempDir });
      execSync('git tag some-other-tag', { cwd: tempDir });
      
      // Create semantic version tag
      execSync('git tag v1.0.0', { cwd: tempDir });

      const lastRelease = await analyzer.findLastRelease();
      expect(lastRelease?.name).toBe('v1.0.0');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-Git directory gracefully', async () => {
      const nonGitAnalyzer = new GitHistoryAnalyzer('/tmp');
      
      const lastRelease = await nonGitAnalyzer.findLastRelease();
      // Graceful error handling returns an object with confidence reduction instead of null
      expect(lastRelease).toBeDefined();
      expect(lastRelease).toHaveProperty('confidenceReduction');
    });

    it('should handle invalid commit references', async () => {
      // Create Git repository
      writeFileSync(join(tempDir, 'README.md'), '# Test Repository');
      execSync('git add README.md', { cwd: tempDir });
      execSync('git commit -m "Initial commit"', { cwd: tempDir });

      const result = await analyzer.getChangesSince('invalid-commit');
      expect(result.commits).toEqual([]);
    });
  });
});