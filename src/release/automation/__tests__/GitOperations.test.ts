/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Tests for GitOperations
 * 
 * Tests git commit, tag, and push operations with rollback capabilities
 * 
 * Mock Strategy:
 * - jest.mock('child_process'): Mock execSync for git command testing
 * - Real test directory: Uses temporary directory for git repository simulation
 * - No shared mocks: Each test creates fresh mocks with specific command sequences
 */

import { GitOperations } from '../GitOperations';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock child_process
jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('GitOperations', () => {
  let gitOps: GitOperations;
  let testDir: string;

  beforeEach(() => {
    testDir = '/test/repo';
    gitOps = new GitOperations(testDir);
    jest.clearAllMocks();
  });

  describe('createCommit', () => {
    it('should create a commit with message', async () => {
      // Mock git repository check
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD (save state)
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('[main abc123] Release 1.0.0\n'); // git commit

      const result = await gitOps.createCommit({
        message: 'Release 1.0.0'
      });

      expect(result.success).toBe(true);
      expect(result.operation).toBe('commit');
      expect(result.errors).toHaveLength(0);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('git commit'),
        expect.any(Object)
      );
    });

    it('should stage specific files before committing', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      mockExecSync.mockReturnValueOnce(''); // git add CHANGELOG.md
      mockExecSync.mockReturnValueOnce('[main abc123] Release\n'); // git commit

      const result = await gitOps.createCommit({
        message: 'Release 1.0.0',
        files: ['package.json', 'CHANGELOG.md']
      });

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'git add "package.json"',
        expect.any(Object)
      );
      expect(mockExecSync).toHaveBeenCalledWith(
        'git add "CHANGELOG.md"',
        expect.any(Object)
      );
    });

    it('should allow empty commits when specified', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('[main abc123] Empty commit\n'); // git commit

      const result = await gitOps.createCommit({
        message: 'Empty commit',
        allowEmpty: true
      });

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('--allow-empty'),
        expect.any(Object)
      );
    });

    it('should fail if not in git repository', async () => {
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not a git repository');
      });

      const result = await gitOps.createCommit({
        message: 'Release 1.0.0'
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('NOT_GIT_REPO');
    });

    it('should escape commit message properly', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('[main abc123] Commit\n'); // git commit

      await gitOps.createCommit({
        message: 'Release "1.0.0" with \\ backslash'
      });

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('Release \\"1.0.0\\" with \\\\ backslash'),
        expect.any(Object)
      );
    });

    it('should handle commit failure', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Commit failed');
      });

      const result = await gitOps.createCommit({
        message: 'Release 1.0.0'
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('COMMIT_ERROR');
    });
  });

  describe('createTag', () => {
    it('should create annotated tag with version', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found'); // git rev-parse v1.0.0 (check if exists)
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const result = await gitOps.createTag({
        version: '1.0.0'
      });

      expect(result.success).toBe(true);
      expect(result.operation).toBe('tag');
      expect(result.details).toContain('v1.0.0');
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('git tag -a "v1.0.0"'),
        expect.any(Object)
      );
    });

    it('should create lightweight tag when specified', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag

      const result = await gitOps.createTag({
        version: '1.0.0',
        annotated: false
      });

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'git tag "v1.0.0"',
        expect.any(Object)
      );
    });

    it('should use custom message for annotated tag', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const result = await gitOps.createTag({
        version: '1.0.0',
        message: 'Custom release message'
      });

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('Custom release message'),
        expect.any(Object)
      );
    });

    it('should format tag name with v prefix', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag

      await gitOps.createTag({
        version: '1.0.0'
      });

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('"v1.0.0"'),
        expect.any(Object)
      );
    });

    it('should not add v prefix if already present', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag

      await gitOps.createTag({
        version: 'v1.0.0'
      });

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('"v1.0.0"'),
        expect.any(Object)
      );
      expect(mockExecSync).not.toHaveBeenCalledWith(
        expect.stringContaining('"vv1.0.0"'),
        expect.any(Object)
      );
    });

    it('should fail if tag already exists', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse v1.0.0 (exists)

      const result = await gitOps.createTag({
        version: '1.0.0'
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TAG_EXISTS');
    });

    it('should validate semantic version format', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir

      const result = await gitOps.createTag({
        version: 'invalid-version'
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_VERSION');
    });

    it('should accept pre-release versions', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag

      const result = await gitOps.createTag({
        version: '1.0.0-alpha.1'
      });

      expect(result.success).toBe(true);
    });
  });

  describe('push', () => {
    it('should push commits to remote', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push

      const result = await gitOps.push();

      expect(result.success).toBe(true);
      expect(result.operation).toBe('push');
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('git push'),
        expect.any(Object)
      );
    });

    it('should push to specified remote and branch', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push

      const result = await gitOps.push({
        remote: 'upstream',
        branch: 'develop'
      });

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('upstream develop'),
        expect.any(Object)
      );
    });

    it('should push tags when specified', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push --tags

      const result = await gitOps.push({
        tags: true
      });

      expect(result.success).toBe(true);
      expect(result.details).toContain('Pushed tags');
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('--tags'),
        expect.any(Object)
      );
    });

    it('should use force flag when specified', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push

      const result = await gitOps.push({
        force: true
      });

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('--force'),
        expect.any(Object)
      );
    });

    it('should handle push failure', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Push failed');
      });

      const result = await gitOps.push();

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('PUSH_ERROR');
    });

    it('should handle tag push failure separately', async () => {
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push (success)
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag push failed');
      });

      const result = await gitOps.push({
        tags: true
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('PUSH_TAGS_ERROR');
      expect(result.details).toContain('Pushed commits'); // Commits succeeded
    });
  });

  describe('rollback', () => {
    it('should rollback to previous commit', async () => {
      // Setup: Create commit to establish rollback state
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD (save state)
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('[main def456] New commit\n'); // git commit

      await gitOps.createCommit({ message: 'New commit' });

      // Rollback
      mockExecSync.mockReturnValueOnce(''); // git reset --hard

      const result = await gitOps.rollback();

      expect(result.success).toBe(true);
      expect(result.operation).toBe('rollback');
      expect(mockExecSync).toHaveBeenCalledWith(
        'git reset --hard abc123',
        expect.any(Object)
      );
    });

    it('should delete tags created during operation', async () => {
      // Setup: Create tag to establish rollback state
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag

      await gitOps.createTag({ version: '1.0.0' });

      // Manually add tag to rollback state (simulating tag creation)
      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push('v1.0.0');
      }

      // Rollback
      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const result = await gitOps.rollback();

      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'git tag -d "v1.0.0"',
        expect.any(Object)
      );
    });

    it('should fail if no rollback state available', async () => {
      const result = await gitOps.rollback();

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('NO_ROLLBACK_STATE');
    });

    it('should clear rollback state after rollback', async () => {
      // Setup rollback state
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('[main def456] Commit\n'); // git commit

      await gitOps.createCommit({ message: 'Commit' });

      expect(gitOps.getRollbackState()).not.toBeNull();

      // Rollback
      mockExecSync.mockReturnValueOnce(''); // git reset --hard

      await gitOps.rollback();

      expect(gitOps.getRollbackState()).toBeNull();
    });
  });

  describe('utility methods', () => {
    it('should get and set working directory', () => {
      expect(gitOps.getWorkingDirectory()).toBe(testDir);

      gitOps.setWorkingDirectory('/new/path');
      expect(gitOps.getWorkingDirectory()).toBe('/new/path');
    });

    it('should clear rollback state', () => {
      // Setup rollback state
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('[main def456] Commit\n'); // git commit

      gitOps.createCommit({ message: 'Commit' });

      expect(gitOps.getRollbackState()).not.toBeNull();

      gitOps.clearRollbackState();

      expect(gitOps.getRollbackState()).toBeNull();
    });
  });
});
