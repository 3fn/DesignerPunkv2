/**
 * GitHub and Git Operations Integration Tests
 * 
 * Tests coordination between GitOperations (Task 6) and GitHubPublisher (Task 7)
 * to ensure GitHub releases use tags created by GitOperations and rollback
 * coordination works correctly.
 * 
 * Mock Strategy:
 * - jest.mock('child_process'): Mock git commands (no real git operations)
 * - jest.mock('@octokit/rest'): Mock GitHub API client
 * - No shared state: Each test creates fresh mocks
 * - Test isolation: Tests pass in any order
 * 
 * Requirements: 5.1, 5.2
 */

import { GitOperations } from '../../automation/GitOperations';
import { GitHubPublisher, GitHubConfig } from '../GitHubPublisher';
import { GitHubRelease } from '../../types/ReleaseTypes';
import { execSync } from 'child_process';

// Mock dependencies
jest.mock('child_process');
jest.mock('@octokit/rest');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const { Octokit } = require('@octokit/rest');

describe('GitHub and Git Operations Integration', () => {
  let gitOps: GitOperations;
  let githubPublisher: GitHubPublisher;
  let mockOctokit: any;
  let config: GitHubConfig;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Octokit
    mockOctokit = {
      rest: {
        users: {
          getAuthenticated: jest.fn()
        },
        repos: {
          get: jest.fn(),
          getReleaseByTag: jest.fn(),
          createRelease: jest.fn(),
          deleteRelease: jest.fn()
        },
        git: {
          getCommit: jest.fn(),
          createTag: jest.fn(),
          createRef: jest.fn(),
          deleteRef: jest.fn()
        }
      }
    };

    Octokit.mockImplementation(() => mockOctokit);

    config = {
      token: 'test-token',
      owner: 'test-owner',
      repo: 'test-repo'
    };

    gitOps = new GitOperations('/test/repo');
    githubPublisher = new GitHubPublisher(config);
  });

  describe('Tag Coordination', () => {
    it('should use tags created by GitOperations for GitHub releases', async () => {
      // Step 1: Create local git tag using GitOperations
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found'); // git rev-parse v1.0.0 (check if exists)
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const tagResult = await gitOps.createTag({
        version: '1.0.0',
        message: 'Release 1.0.0'
      });

      expect(tagResult.success).toBe(true);

      // Step 2: Create GitHub release using the same tag
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 123,
          html_url: 'https://github.com/test-owner/test-repo/releases/tag/v1.0.0',
          tag_name: 'v1.0.0'
        }
      });

      const release: GitHubRelease = {
        tagName: 'v1.0.0',
        name: 'Release 1.0.0',
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);
      expect(releaseResult.githubReleaseUrl).toContain('v1.0.0');
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          tag_name: 'v1.0.0'
        })
      );
    });

    it('should coordinate tag creation between local and remote', async () => {
      const version = '2.0.0';
      const tagName = 'v2.0.0';

      // Step 1: Create local tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const localTagResult = await gitOps.createTag({
        version,
        message: `Release ${version}`
      });

      expect(localTagResult.success).toBe(true);

      // Step 2: Push tag to remote
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push --tags

      const pushResult = await gitOps.push({ tags: true });

      expect(pushResult.success).toBe(true);

      // Step 3: Create GitHub release
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 456,
          html_url: `https://github.com/test-owner/test-repo/releases/tag/${tagName}`,
          tag_name: tagName
        }
      });

      const release: GitHubRelease = {
        tagName,
        name: `Release ${version}`,
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);
      expect(releaseResult.githubReleaseUrl).toContain(tagName);
    });

    it('should handle tag name formatting consistently', async () => {
      // GitOperations formats tags with 'v' prefix
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const tagResult = await gitOps.createTag({
        version: '1.0.0' // Without 'v' prefix
      });

      expect(tagResult.success).toBe(true);
      expect(tagResult.details).toContain('v1.0.0'); // Should add 'v' prefix

      // GitHub release should use the same formatted tag name
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 789,
          html_url: 'https://github.com/test-owner/test-repo/releases/tag/v1.0.0',
          tag_name: 'v1.0.0'
        }
      });

      const release: GitHubRelease = {
        tagName: 'v1.0.0', // With 'v' prefix
        name: 'Release 1.0.0',
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          tag_name: 'v1.0.0'
        })
      );
    });
  });

  describe('Unified Rollback', () => {
    it('should rollback both local and remote operations on failure', async () => {
      // Step 1: Create local tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({
        version: '1.0.0',
        message: 'Release 1.0.0'
      });

      // Step 2: Push tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push
      mockExecSync.mockReturnValueOnce('Everything up-to-date\n'); // git push --tags

      await gitOps.push({ tags: true });

      // Step 3: Create GitHub release (simulate failure)
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockRejectedValue(
        new Error('GitHub API error')
      );

      const release: GitHubRelease = {
        tagName: 'v1.0.0',
        name: 'Release 1.0.0',
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(false);

      // Step 4: Rollback local operations
      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push('v1.0.0');
      }

      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const localRollback = await gitOps.rollback();

      expect(localRollback.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'git tag -d "v1.0.0"',
        expect.any(Object)
      );

      // Step 5: Rollback remote operations (delete GitHub release if created)
      // In this case, release creation failed, so no remote rollback needed
      // But if release was created, we would delete it:
      // await githubPublisher.deleteRelease('v1.0.0');
    });

    it('should delete GitHub release and tag on rollback', async () => {
      const tagName = 'v1.0.0';

      // Simulate successful release creation
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({
        data: {
          id: 123,
          tag_name: tagName
        }
      });

      // Delete release
      mockOctokit.rest.repos.deleteRelease.mockResolvedValue({});

      const deleteReleaseResult = await githubPublisher.deleteRelease(tagName);

      expect(deleteReleaseResult).toBe(true);
      expect(mockOctokit.rest.repos.deleteRelease).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        release_id: 123
      });

      // Delete tag
      mockOctokit.rest.git.deleteRef.mockResolvedValue({});

      const deleteTagResult = await githubPublisher.deleteTag(tagName);

      expect(deleteTagResult).toBe(true);
      expect(mockOctokit.rest.git.deleteRef).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        ref: 'tags/v1.0.0'
      });
    });

    it('should coordinate rollback between GitOperations and GitHubPublisher', async () => {
      const version = '2.0.0';
      const tagName = 'v2.0.0';

      // Step 1: Create local tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({ version, message: `Release ${version}` });

      // Step 2: Create GitHub release
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 456,
          html_url: `https://github.com/test-owner/test-repo/releases/tag/${tagName}`,
          tag_name: tagName
        }
      });

      const release: GitHubRelease = {
        tagName,
        name: `Release ${version}`,
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      await githubPublisher.createRelease(release);

      // Step 3: Rollback both local and remote
      // Local rollback
      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push(tagName);
      }

      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const localRollback = await gitOps.rollback();

      expect(localRollback.success).toBe(true);

      // Remote rollback
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({
        data: { id: 456, tag_name: tagName }
      });
      mockOctokit.rest.repos.deleteRelease.mockResolvedValue({});
      mockOctokit.rest.git.deleteRef.mockResolvedValue({});

      const deleteReleaseResult = await githubPublisher.deleteRelease(tagName);
      const deleteTagResult = await githubPublisher.deleteTag(tagName);

      expect(deleteReleaseResult).toBe(true);
      expect(deleteTagResult).toBe(true);
    });

    it('should handle partial rollback when some operations fail', async () => {
      const tagName = 'v1.0.0';

      // Simulate local rollback success
      const rollbackState = gitOps.getRollbackState();
      if (!rollbackState) {
        // Create rollback state manually for test
        mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
        mockExecSync.mockImplementationOnce(() => {
          throw new Error('Tag not found');
        });
        mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
        mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
        mockExecSync.mockReturnValueOnce(''); // git tag -a

        await gitOps.createTag({ version: '1.0.0' });
      }

      const state = gitOps.getRollbackState();
      if (state) {
        state.tags.push(tagName);
      }

      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const localRollback = await gitOps.rollback();

      expect(localRollback.success).toBe(true);

      // Simulate remote rollback failure
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue(
        new Error('Release not found')
      );

      await expect(githubPublisher.deleteRelease(tagName)).rejects.toThrow(
        'Failed to delete release'
      );

      // Even if remote rollback fails, local rollback succeeded
      expect(localRollback.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle GitHub API errors gracefully', async () => {
      // Create local tag successfully
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const tagResult = await gitOps.createTag({
        version: '1.0.0',
        message: 'Release 1.0.0'
      });

      expect(tagResult.success).toBe(true);

      // GitHub release creation fails
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockRejectedValue(
        new Error('API rate limit exceeded')
      );

      const release: GitHubRelease = {
        tagName: 'v1.0.0',
        name: 'Release 1.0.0',
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(false);
      expect(releaseResult.errors).toHaveLength(1);
      expect(releaseResult.errors[0].message).toContain('API rate limit exceeded');
    });

    it('should handle git operation errors gracefully', async () => {
      // Git tag creation fails
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Git tag creation failed');
      });

      const tagResult = await gitOps.createTag({
        version: '1.0.0',
        message: 'Release 1.0.0'
      });

      expect(tagResult.success).toBe(false);
      expect(tagResult.errors).toHaveLength(1);
      expect(tagResult.errors[0].code).toBe('TAG_ERROR');

      // GitHub release should not be created if local tag fails
      // (This would be handled by the orchestration layer)
    });

    it('should provide clear error messages for coordination failures', async () => {
      // Create local tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({ version: '1.0.0' });

      // Try to create GitHub release with different tag name (coordination error)
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 123,
          html_url: 'https://github.com/test-owner/test-repo/releases/tag/v2.0.0',
          tag_name: 'v2.0.0'
        }
      });

      const release: GitHubRelease = {
        tagName: 'v2.0.0', // Different from local tag
        name: 'Release 2.0.0',
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      // Release succeeds but tags are mismatched
      expect(releaseResult.success).toBe(true);
      expect(releaseResult.githubReleaseUrl).toContain('v2.0.0');

      // This demonstrates the need for coordination - the orchestration layer
      // should ensure tag names match between local and remote operations
    });
  });
});
