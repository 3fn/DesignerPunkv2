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

      // Add completion document
      const completionDir = join(tempDir, '.kiro', 'specs', 'test-feature', 'completion');
      execSync(`mkdir -p "${completionDir}"`, { cwd: tempDir });
      
      const completionContent = `# Task 1 Completion

**Date**: 2025-01-15
**Task**: 1.1 Implement test feature
**Spec**: F1 - Test Feature
**Status**: Complete

## Summary
Test task completed successfully.`;

      writeFileSync(join(completionDir, 'task-1-completion.md'), completionContent);
      execSync('git add .', { cwd: tempDir });
      execSync('git commit -m "Add task completion"', { cwd: tempDir });

      // Test finding last release
      const lastRelease = await analyzer.findLastRelease();
      expect(lastRelease).not.toBeNull();
      expect(lastRelease?.name).toBe('v1.0.0');

      // Test getting changes since release
      const changes = await analyzer.getChangesSince('v1.0.0');
      expect(changes.commits).toHaveLength(1);
      expect(changes.commits[0].message).toBe('Add task completion');
      expect(changes.addedFiles).toContain('.kiro/specs/test-feature/completion/task-1-completion.md');

      // Test finding completion documents
      const completionDocs = await analyzer.findCompletionDocuments(changes);
      expect(completionDocs).toHaveLength(1);
      expect(completionDocs[0].path).toBe('.kiro/specs/test-feature/completion/task-1-completion.md');
      expect(completionDocs[0].metadata.task).toBe('1.1 Implement test feature');
      expect(completionDocs[0].metadata.type).toBe('task-completion');
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
      expect(lastRelease).toBeNull();
    });

    it('should handle invalid commit references', async () => {
      // Create Git repository
      writeFileSync(join(tempDir, 'README.md'), '# Test Repository');
      execSync('git add README.md', { cwd: tempDir });
      execSync('git commit -m "Initial commit"', { cwd: tempDir });

      await expect(analyzer.getChangesSince('invalid-commit')).rejects.toThrow(
        'Failed to get changes since invalid-commit'
      );
    });
  });
});