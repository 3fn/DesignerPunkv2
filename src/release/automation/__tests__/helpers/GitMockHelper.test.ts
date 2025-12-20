/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Tests for GitMockHelper utility
 * 
 * Validates that GitMockHelper correctly configures mocks for git operations,
 * ensuring the mock sequences match the actual GitOperations implementation.
 * 
 * Mock Strategy:
 * - jest.mock('child_process'): Mock execSync for git command testing
 * - Tests the helper itself: Validates GitMockHelper creates correct mock sequences
 * - No shared mocks: Each test creates fresh helper instance
 * 
 * Requirements: 2.1, 2.2
 */

import { execSync } from 'child_process';
import { GitMockHelper } from './GitMockHelper';

// Mock child_process
jest.mock('child_process');

describe('GitMockHelper', () => {
  let mockExecSync: jest.MockedFunction<typeof execSync>;
  let helper: GitMockHelper;

  beforeEach(() => {
    mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
    mockExecSync.mockClear();
    mockExecSync.mockReset();
    helper = new GitMockHelper(mockExecSync);
  });

  describe('mockCommitSuccess', () => {
    it('should configure mocks for successful commit workflow', () => {
      const commitHash = 'def456';
      
      helper.mockCommitSuccess(commitHash);
      
      // Verify mock was configured with correct sequence
      expect(mockExecSync).toHaveBeenCalledTimes(0); // Not called yet, just configured
      
      // Simulate the actual git command sequence
      const result1 = mockExecSync('git rev-parse --git-dir'); // git rev-parse --git-dir
      const result2 = mockExecSync('git rev-parse HEAD'); // git rev-parse HEAD
      const result3 = mockExecSync('git rev-parse --abbrev-ref HEAD'); // git rev-parse --abbrev-ref HEAD
      const result4 = mockExecSync('git commit'); // git commit
      
      // Verify return values match expected sequence
      expect(result1).toBe(''); // Repository check passes
      expect(result2).toBe('abc123\n'); // Current commit hash
      expect(result3).toBe('main\n'); // Current branch
      expect(result4).toBe(`[main ${commitHash}] Commit message\n`); // Commit result
    });

    it('should configure mocks that can be called in sequence', () => {
      helper.mockCommitSuccess('xyz789');
      
      // Execute the mock sequence
      mockExecSync('git rev-parse --git-dir'); // Check repo
      mockExecSync('git rev-parse HEAD'); // Get current hash
      mockExecSync('git rev-parse --abbrev-ref HEAD'); // Get branch
      const commitResult = mockExecSync('git commit'); // Create commit
      
      expect(commitResult).toContain('xyz789');
      expect(commitResult).toContain('[main xyz789]');
    });
  });

  describe('mockTagSuccess', () => {
    it('should configure mocks for successful tag creation workflow', () => {
      const version = '1.1.0';
      const tagHash = 'def456';
      
      helper.mockTagSuccess(version, tagHash);
      
      // Verify mock was configured
      expect(mockExecSync).toHaveBeenCalledTimes(0);
      
      // Simulate the actual git command sequence
      const result1 = mockExecSync('git rev-parse --git-dir'); // git rev-parse --git-dir
      
      // Tag check should throw (tag doesn't exist)
      expect(() => mockExecSync('git rev-parse v1.0.0')).toThrow('Tag not found');
      
      const result3 = mockExecSync('git rev-parse HEAD'); // git rev-parse HEAD
      const result4 = mockExecSync('git rev-parse --abbrev-ref HEAD'); // git rev-parse --abbrev-ref HEAD
      const result5 = mockExecSync('git tag'); // git tag
      
      // Verify return values
      expect(result1).toBe(''); // Repository check passes
      expect(result3).toBe(`${tagHash}\n`); // Current commit hash
      expect(result4).toBe('main\n'); // Current branch
      expect(result5).toBe(''); // Tag creation succeeds
    });

    it('should handle tag existence check correctly', () => {
      helper.mockTagSuccess('2.0.0', 'abc123');
      
      mockExecSync('git'); // Check repo
      
      // Tag check should throw
      expect(() => mockExecSync('git')).toThrow('Tag not found');
      
      // Continue with remaining mocks
      const hashResult = mockExecSync('git');
      expect(hashResult).toBe('abc123\n');
    });
  });

  describe('mockTagExists', () => {
    it('should configure mocks for tag already exists scenario', () => {
      const version = '1.1.0';
      
      helper.mockTagExists(version);
      
      // Simulate the git command sequence
      const result1 = mockExecSync('git'); // git rev-parse --git-dir
      const result2 = mockExecSync('git'); // git rev-parse <tag> (tag exists)
      
      // Verify return values
      expect(result1).toBe(''); // Repository check passes
      expect(result2).toBe('abc123\n'); // Tag exists (returns hash)
    });

    it('should indicate tag exists by returning hash', () => {
      helper.mockTagExists('3.0.0');
      
      mockExecSync('git'); // Check repo
      const tagCheckResult = mockExecSync('git'); // Check tag
      
      // Tag exists if it returns a hash
      expect(tagCheckResult).toBe('abc123\n');
      expect(tagCheckResult).not.toBe('');
    });
  });

  describe('mockGitRepoCheck', () => {
    it('should configure mock for valid git repository', () => {
      helper.mockGitRepoCheck(true);
      
      const result = mockExecSync('git'); // git rev-parse --git-dir
      
      expect(result).toBe(''); // Empty string indicates valid repo
    });

    it('should configure mock for invalid git repository', () => {
      helper.mockGitRepoCheck(false);
      
      // Should throw error for non-git directory
      expect(() => mockExecSync('git')).toThrow('Not a git repository');
    });

    it('should handle multiple repository checks', () => {
      helper.mockGitRepoCheck(true);
      helper.mockGitRepoCheck(false);
      
      // First check passes
      expect(mockExecSync('git')).toBe('');
      
      // Second check fails
      expect(() => mockExecSync('git')).toThrow('Not a git repository');
    });
  });

  describe('mockRollback', () => {
    it('should configure mocks for successful rollback', () => {
      const previousHash = 'abc123';
      
      helper.mockRollback(previousHash);
      
      // Simulate rollback command
      const result = mockExecSync('git'); // git reset --hard
      
      expect(result).toBe(''); // Reset succeeds
    });

    it('should allow caller to mock tag deletion', () => {
      helper.mockRollback('abc123');
      
      // Mock tag deletion (caller's responsibility)
      mockExecSync.mockReturnValueOnce(''); // git tag -d
      
      // Execute rollback sequence
      const resetResult = mockExecSync('git'); // git reset
      const tagDeleteResult = mockExecSync('git'); // git tag -d
      
      expect(resetResult).toBe('');
      expect(tagDeleteResult).toBe('');
    });
  });

  describe('mockCommitAndTag', () => {
    it('should configure mocks for complete commit and tag workflow', () => {
      const commitHash = 'def456';
      const version = '1.1.0';
      const fileCount = 2;
      
      helper.mockCommitAndTag(commitHash, version, commitHash, fileCount);
      
      // Simulate complete workflow
      mockExecSync('git'); // Check repo (commit)
      mockExecSync('git'); // Get current hash (commit)
      mockExecSync('git'); // Get branch (commit)
      mockExecSync('git'); // git add file1
      mockExecSync('git'); // git add file2
      const commitResult = mockExecSync('git'); // git commit
      
      mockExecSync('git'); // Check repo (tag)
      expect(() => mockExecSync('git')).toThrow('Tag not found'); // Tag check
      mockExecSync('git'); // Get current hash (tag)
      mockExecSync('git'); // Get branch (tag)
      const tagResult = mockExecSync('git'); // git tag
      
      expect(commitResult).toContain(commitHash);
      expect(tagResult).toBe('');
    });

    it('should handle zero files', () => {
      helper.mockCommitAndTag('abc123', '1.0.0', 'abc123', 0);
      
      // Should work without git add mocks
      mockExecSync('git'); // Check repo
      mockExecSync('git'); // Get hash
      mockExecSync('git'); // Get branch
      const commitResult = mockExecSync('git'); // Commit
      
      expect(commitResult).toContain('abc123');
    });
  });

  describe('mockCommitFailure', () => {
    it('should configure mocks for failed commit', () => {
      const errorMessage = 'Nothing to commit';
      
      helper.mockCommitFailure(errorMessage);
      
      // Initial checks pass
      expect(mockExecSync('git')).toBe(''); // Check repo
      expect(mockExecSync('git')).toBe('abc123\n'); // Get hash
      expect(mockExecSync('git')).toBe('main\n'); // Get branch
      
      // Commit fails
      expect(() => mockExecSync('git')).toThrow(errorMessage);
    });

    it('should use default error message if none provided', () => {
      helper.mockCommitFailure();
      
      mockExecSync('git'); // Check repo
      mockExecSync('git'); // Get hash
      mockExecSync('git'); // Get branch
      
      expect(() => mockExecSync('git')).toThrow('Commit failed');
    });
  });

  describe('mockTagFailure', () => {
    it('should configure mocks for failed tag creation', () => {
      const errorMessage = 'Permission denied';
      
      helper.mockTagFailure(errorMessage);
      
      // Initial checks pass
      expect(mockExecSync('git')).toBe(''); // Check repo
      expect(() => mockExecSync('git')).toThrow('Tag not found'); // Tag doesn't exist
      expect(mockExecSync('git')).toBe('abc123\n'); // Get hash
      expect(mockExecSync('git')).toBe('main\n'); // Get branch
      
      // Tag creation fails
      expect(() => mockExecSync('git')).toThrow(errorMessage);
    });

    it('should use default error message if none provided', () => {
      helper.mockTagFailure();
      
      mockExecSync('git'); // Check repo
      expect(() => mockExecSync('git')).toThrow('Tag not found'); // Tag check
      mockExecSync('git'); // Get hash
      mockExecSync('git'); // Get branch
      
      expect(() => mockExecSync('git')).toThrow('Tag creation failed');
    });
  });

  describe('clearMocks', () => {
    it('should clear all mock configurations', () => {
      helper.mockCommitSuccess('abc123');
      
      // Execute some mocks
      mockExecSync('git');
      mockExecSync('git');
      
      expect(mockExecSync).toHaveBeenCalledTimes(2);
      
      // Clear mocks
      helper.clearMocks();
      
      expect(mockExecSync).toHaveBeenCalledTimes(0);
    });

    it('should allow reconfiguration after clearing', () => {
      helper.mockCommitSuccess('first');
      mockExecSync('git'); // Use first mock
      
      helper.clearMocks();
      
      helper.mockCommitSuccess('second');
      mockExecSync('git'); // Check repo
      mockExecSync('git'); // Get hash
      mockExecSync('git'); // Get branch
      const result = mockExecSync('git'); // Commit
      
      expect(result).toContain('second');
    });
  });

  describe('getMock', () => {
    it('should return the mock function', () => {
      const mock = helper.getMock();
      
      expect(mock).toBe(mockExecSync);
    });

    it('should allow direct manipulation of mock', () => {
      const mock = helper.getMock();
      
      mock.mockReturnValueOnce('custom value');
      
      const result = mockExecSync('git');
      expect(result).toBe('custom value');
    });
  });

  describe('mock call counts', () => {
    it('should configure correct number of mocks for commit', () => {
      helper.mockCommitSuccess('abc123');
      
      // Commit workflow has 4 mock calls
      mockExecSync('git'); // 1
      mockExecSync('git'); // 2
      mockExecSync('git'); // 3
      mockExecSync('git'); // 4
      
      expect(mockExecSync).toHaveBeenCalledTimes(4);
    });

    it('should configure correct number of mocks for tag', () => {
      helper.mockTagSuccess('1.0.0', 'abc123');
      
      // Tag workflow has 5 mock calls (one throws)
      mockExecSync('git'); // 1
      try { mockExecSync('git'); } catch {} // 2 (throws)
      mockExecSync('git'); // 3
      mockExecSync('git'); // 4
      mockExecSync('git'); // 5
      
      expect(mockExecSync).toHaveBeenCalledTimes(5);
    });

    it('should configure correct number of mocks for rollback', () => {
      helper.mockRollback('abc123');
      
      // Rollback has 1 mock call
      mockExecSync('git');
      
      expect(mockExecSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('mock return values', () => {
    it('should return correct values for commit workflow', () => {
      helper.mockCommitSuccess('test123');
      
      const repoCheck = mockExecSync('git');
      const currentHash = mockExecSync('git');
      const branch = mockExecSync('git');
      const commit = mockExecSync('git');
      
      expect(repoCheck).toBe('');
      expect(currentHash).toBe('abc123\n');
      expect(branch).toBe('main\n');
      expect(commit).toContain('test123');
    });

    it('should return correct values for tag workflow', () => {
      helper.mockTagSuccess('2.0.0', 'xyz789');
      
      const repoCheck = mockExecSync('git');
      expect(repoCheck).toBe('');
      
      // Tag check throws
      expect(() => mockExecSync('git')).toThrow();
      
      const currentHash = mockExecSync('git');
      const branch = mockExecSync('git');
      const tag = mockExecSync('git');
      
      expect(currentHash).toBe('xyz789\n');
      expect(branch).toBe('main\n');
      expect(tag).toBe('');
    });
  });

  describe('integration with GitOperations', () => {
    it('should match GitOperations.createCommit command sequence', () => {
      // This test documents the expected command sequence
      helper.mockCommitSuccess('def456');
      
      // GitOperations.createCommit executes:
      // 1. Check if git repo
      const step1 = mockExecSync('git');
      expect(step1).toBe('');
      
      // 2. Save current commit hash
      const step2 = mockExecSync('git');
      expect(step2).toBe('abc123\n');
      
      // 3. Get current branch
      const step3 = mockExecSync('git');
      expect(step3).toBe('main\n');
      
      // 4. git add (caller mocks per file)
      // 5. git commit
      const step5 = mockExecSync('git');
      expect(step5).toContain('def456');
    });

    it('should match GitOperations.createTag command sequence', () => {
      // This test documents the expected command sequence
      helper.mockTagSuccess('1.1.0', 'def456');
      
      // GitOperations.createTag executes:
      // 1. Check if git repo
      const step1 = mockExecSync('git');
      expect(step1).toBe('');
      
      // 2. Check if tag exists (should throw)
      expect(() => mockExecSync('git')).toThrow('Tag not found');
      
      // 3. Save current commit hash
      const step3 = mockExecSync('git');
      expect(step3).toBe('def456\n');
      
      // 4. Get current branch
      const step4 = mockExecSync('git');
      expect(step4).toBe('main\n');
      
      // 5. Create tag
      const step5 = mockExecSync('git');
      expect(step5).toBe('');
    });
  });
});
