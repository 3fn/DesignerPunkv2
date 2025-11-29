/**
 * GitMockHelper - Utility for mocking git operations in tests
 * 
 * This helper provides reusable mock configurations for GitOperations methods,
 * ensuring tests correctly mock the exact sequence of git commands executed
 * by the implementation.
 * 
 * Each method documents the git command sequence it mocks, making it easy
 * to understand what's being tested and maintain tests as implementation changes.
 * 
 * Requirements: 2.1, 2.2, 5.1
 */

import { execSync } from 'child_process';

export class GitMockHelper {
  private mockExecSync: jest.MockedFunction<typeof execSync>;

  /**
   * Create a new GitMockHelper
   * 
   * @param mockExecSync - Mocked execSync function from jest.mock('child_process')
   */
  constructor(mockExecSync: jest.MockedFunction<typeof execSync>) {
    this.mockExecSync = mockExecSync;
  }

  /**
   * Mock a successful commit workflow
   * 
   * Git Command Sequence:
   * 1. git rev-parse --git-dir          → Check if git repository
   * 2. git rev-parse HEAD                → Save current commit hash for rollback
   * 3. git rev-parse --abbrev-ref HEAD   → Get current branch name
   * 4. git add <file>                    → Stage each file (caller must mock per file)
   * 5. git commit -m "<message>"         → Create commit
   * 
   * Note: This method mocks steps 1-3 and step 5. Caller must mock step 4
   * (git add) for each file being staged.
   * 
   * @param commitHash - Hash to return for the created commit (e.g., 'def456')
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockCommitSuccess('def456');
   * // Mock git add for each file
   * mockExecSync.mockReturnValueOnce(''); // git add file1
   * mockExecSync.mockReturnValueOnce(''); // git add file2
   * // Now createCommit() will succeed
   * ```
   */
  mockCommitSuccess(commitHash: string): void {
    // 1. Check if git repository
    this.mockExecSync.mockReturnValueOnce('');
    
    // 2. Save current commit hash for rollback state
    this.mockExecSync.mockReturnValueOnce('abc123\n');
    
    // 3. Get current branch name for rollback state
    this.mockExecSync.mockReturnValueOnce('main\n');
    
    // Note: Caller must mock git add for each file
    // Example: mockExecSync.mockReturnValueOnce(''); // git add file1
    
    // 5. Create commit (mocked at the end, after git add calls)
    this.mockExecSync.mockReturnValueOnce(`[main ${commitHash}] Commit message\n`);
  }

  /**
   * Mock a successful tag creation workflow
   * 
   * Git Command Sequence:
   * 1. git rev-parse --git-dir          → Check if git repository
   * 2. git rev-parse <tagName>          → Check if tag already exists (should throw)
   * 3. git rev-parse HEAD                → Save current commit hash for rollback
   * 4. git rev-parse --abbrev-ref HEAD   → Get current branch name
   * 5. git tag -a <tagName> -m "<msg>"  → Create annotated tag
   * 
   * @param version - Version for the tag (e.g., '1.1.0' or 'v1.1.0')
   * @param tagHash - Hash of the commit being tagged (e.g., 'def456')
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockTagSuccess('1.1.0', 'def456');
   * // Now createTag({ version: '1.1.0' }) will succeed
   * ```
   */
  mockTagSuccess(version: string, tagHash: string): void {
    // 1. Check if git repository
    this.mockExecSync.mockReturnValueOnce('');
    
    // 2. Check if tag exists (should throw error - tag doesn't exist)
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error('Tag not found');
    });
    
    // 3. Save current commit hash for rollback state
    this.mockExecSync.mockReturnValueOnce(`${tagHash}\n`);
    
    // 4. Get current branch name for rollback state
    this.mockExecSync.mockReturnValueOnce('main\n');
    
    // 5. Create tag (annotated by default)
    this.mockExecSync.mockReturnValueOnce('');
  }

  /**
   * Mock a tag already exists scenario (tag creation should fail)
   * 
   * Git Command Sequence:
   * 1. git rev-parse --git-dir          → Check if git repository
   * 2. git rev-parse <tagName>          → Check if tag exists (returns hash - tag exists)
   * 
   * This causes createTag() to fail with TAG_EXISTS error.
   * 
   * @param version - Version for the tag that already exists
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockTagExists('1.1.0');
   * // Now createTag({ version: '1.1.0' }) will fail with TAG_EXISTS
   * ```
   */
  mockTagExists(version: string): void {
    // 1. Check if git repository
    this.mockExecSync.mockReturnValueOnce('');
    
    // 2. Check if tag exists (returns hash - tag exists, causing failure)
    this.mockExecSync.mockReturnValueOnce('abc123\n');
  }

  /**
   * Mock git repository check
   * 
   * Git Command Sequence:
   * 1. git rev-parse --git-dir          → Check if git repository
   * 
   * @param isRepo - Whether the directory should be detected as a git repository
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * 
   * // Mock as git repository
   * helper.mockGitRepoCheck(true);
   * 
   * // Mock as NOT a git repository
   * helper.mockGitRepoCheck(false);
   * ```
   */
  mockGitRepoCheck(isRepo: boolean): void {
    if (isRepo) {
      // Return empty string - is a git repository (actual value doesn't matter, just needs to not throw)
      this.mockExecSync.mockReturnValueOnce('');
    } else {
      // Throw error - not a git repository
      this.mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not a git repository');
      });
    }
  }

  /**
   * Mock a successful rollback operation
   * 
   * Git Command Sequence:
   * 1. git reset --hard <commitHash>    → Reset to previous commit
   * 2. git tag -d <tagName>             → Delete tag (if any tags in rollback state)
   * 
   * Note: The number of git tag -d commands depends on how many tags are in
   * the rollback state. This method mocks the reset command. Caller must mock
   * git tag -d for each tag that needs to be deleted.
   * 
   * @param previousHash - Hash to reset to (e.g., 'abc123')
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockRollback('abc123');
   * // If rollback state has tags, also mock:
   * mockExecSync.mockReturnValueOnce(''); // git tag -d v1.1.0
   * // Now rollback() will succeed
   * ```
   */
  mockRollback(previousHash: string): void {
    // 1. Reset to previous commit
    this.mockExecSync.mockReturnValueOnce('');
    
    // Note: Caller must mock git tag -d for each tag in rollback state
    // Example: mockExecSync.mockReturnValueOnce(''); // git tag -d v1.1.0
  }

  /**
   * Mock a complete commit + tag workflow
   * 
   * This is a convenience method that sets up mocks for both commit and tag operations
   * in the correct sequence, including git add commands for files.
   * 
   * @param commitHash - Hash for the created commit
   * @param version - Version for the tag
   * @param tagHash - Hash of the commit being tagged (usually same as commitHash)
   * @param fileCount - Number of files being staged (for git add mocks)
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockCommitAndTag('def456', '1.1.0', 'def456', 2);
   * // Now createCommit() and createTag() will both succeed
   * ```
   */
  mockCommitAndTag(commitHash: string, version: string, tagHash: string, fileCount: number = 0): void {
    // Mock commit workflow - but manually to insert git add mocks in the right place
    // 1. Check if git repository
    this.mockExecSync.mockReturnValueOnce('');
    
    // 2. Save current commit hash for rollback state
    this.mockExecSync.mockReturnValueOnce('abc123\n');
    
    // 3. Get current branch name for rollback state
    this.mockExecSync.mockReturnValueOnce('main\n');
    
    // 4-N. Mock git add for each file (inserted here, before commit)
    for (let i = 0; i < fileCount; i++) {
      this.mockExecSync.mockReturnValueOnce('');
    }
    
    // N+1. Create commit
    this.mockExecSync.mockReturnValueOnce(`[main ${commitHash}] Commit message\n`);
    
    // Mock tag workflow
    this.mockTagSuccess(version, tagHash);
  }

  /**
   * Mock a failed commit scenario
   * 
   * This mocks the initial checks passing but the commit command failing.
   * Useful for testing error handling.
   * 
   * @param errorMessage - Error message to throw on commit
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockCommitFailure('Nothing to commit');
   * // Now createCommit() will fail with COMMIT_ERROR
   * ```
   */
  mockCommitFailure(errorMessage: string = 'Commit failed'): void {
    // 1. Check if git repository (passes)
    this.mockExecSync.mockReturnValueOnce('');
    
    // 2. Save current commit hash (passes)
    this.mockExecSync.mockReturnValueOnce('abc123\n');
    
    // 3. Get current branch (passes)
    this.mockExecSync.mockReturnValueOnce('main\n');
    
    // Note: Caller must mock git add for each file
    
    // 5. Commit fails
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
  }

  /**
   * Mock a failed tag scenario
   * 
   * This mocks the initial checks passing but the tag command failing.
   * Useful for testing error handling.
   * 
   * @param errorMessage - Error message to throw on tag creation
   * 
   * @example
   * ```typescript
   * const helper = new GitMockHelper(mockExecSync);
   * helper.mockTagFailure('Permission denied');
   * // Now createTag() will fail with TAG_ERROR
   * ```
   */
  mockTagFailure(errorMessage: string = 'Tag creation failed'): void {
    // 1. Check if git repository (passes)
    this.mockExecSync.mockReturnValueOnce('');
    
    // 2. Check if tag exists (passes - tag doesn't exist)
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error('Tag not found');
    });
    
    // 3. Save current commit hash (passes)
    this.mockExecSync.mockReturnValueOnce('abc123\n');
    
    // 4. Get current branch (passes)
    this.mockExecSync.mockReturnValueOnce('main\n');
    
    // 5. Tag creation fails
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
  }

  /**
   * Clear all mock configurations
   * 
   * This resets both the call history AND all mock implementations,
   * ensuring a completely clean slate for the next test.
   * 
   * @example
   * ```typescript
   * afterEach(() => {
   *   helper.clearMocks();
   * });
   * ```
   */
  clearMocks(): void {
    this.mockExecSync.mockClear();
    this.mockExecSync.mockReset();
  }

  /**
   * Get the mock function for direct manipulation if needed
   * 
   * @returns The mocked execSync function
   */
  getMock(): jest.MockedFunction<typeof execSync> {
    return this.mockExecSync;
  }
}
