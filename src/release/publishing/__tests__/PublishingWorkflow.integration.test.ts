/**
 * @category evergreen
 * @purpose Verify publishing workflow coordinates release process correctly
 */
/**
 * Publishing Workflow Integration Tests
 * 
 * Tests complete publishing workflow including GitHub releases and npm publishing.
 * Validates coordination between GitHubPublisher, NpmPublisher, and GitOperations.
 * 
 * Mock Strategy:
 * - jest.mock('@octokit/rest'): Mock GitHub API client (no real API calls)
 * - jest.mock('child_process'): Mock npm and git commands (no real operations)
 * - jest.mock('fs'): Mock file system operations
 * - No shared state: Each test creates fresh mocks
 * - Test isolation: Tests pass in any order
 * - Document mock strategy in test file header
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { GitHubPublisher, GitHubConfig } from '../GitHubPublisher';
import { NpmPublisher, NpmConfig } from '../NpmPublisher';
import { GitOperations } from '../../automation/GitOperations';
import { GitHubRelease, PackagePublish } from '../../types/ReleaseTypes';
import { GitMockHelper } from '../../automation/__tests__/helpers/GitMockHelper';
import { execSync } from 'child_process';
import * as fs from 'fs';

// Mock dependencies
jest.mock('@octokit/rest');
jest.mock('child_process');
jest.mock('fs');

const { Octokit } = require('@octokit/rest');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('Publishing Workflow Integration', () => {
  let githubPublisher: GitHubPublisher;
  let npmPublisher: NpmPublisher;
  let gitOps: GitOperations;
  let mockOctokit: any;
  let githubConfig: GitHubConfig;
  let npmConfig: NpmConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecSync.mockReset(); // Clear mock implementations, not just call history

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
          deleteRelease: jest.fn(),
          uploadReleaseAsset: jest.fn()
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

    githubConfig = {
      token: 'test-token',
      owner: 'test-owner',
      repo: 'test-repo'
    };

    npmConfig = {
      registry: 'https://registry.npmjs.org/',
      timeout: 60000,
      maxRetries: 3,
      retryDelay: 100,
      dryRun: false
    };

    githubPublisher = new GitHubPublisher(githubConfig);
    npmPublisher = new NpmPublisher(npmConfig);
    gitOps = new GitOperations('/test/repo');
  });

  describe('Complete Release Workflow', () => {
    it('should execute complete release workflow: tag -> GitHub release -> npm publish', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';

      // Step 1: Create local git tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const tagResult = await gitOps.createTag({
        version,
        message: `Release ${version}`
      });

      expect(tagResult.success).toBe(true);

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
          id: 123,
          html_url: `https://github.com/test-owner/test-repo/releases/tag/${tagName}`,
          tag_name: tagName
        }
      });

      const release: GitHubRelease = {
        tagName,
        name: `Release ${version}`,
        body: '## Changes\n- Feature 1\n- Feature 2',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);
      expect(releaseResult.githubReleaseUrl).toContain(tagName);

      // Step 4: Publish to npm
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      mockExecSync.mockReturnValueOnce(''); // npm view (doesn't exist)
      mockExecSync.mockReturnValueOnce('+ @test/package@1.0.0\n'); // npm publish

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version: '1.0.0',
        path: '/test/path',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);

      expect(publishResult.success).toBe(true);
      expect(publishResult.version).toBe('1.0.0');

      // Verify complete workflow executed successfully
      expect(tagResult.success).toBe(true);
      expect(pushResult.success).toBe(true);
      expect(releaseResult.success).toBe(true);
      expect(publishResult.success).toBe(true);
    });

    it('should handle workflow with artifacts', async () => {
      const version = '2.0.0';
      const tagName = 'v2.0.0';

      // Create tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({ version, message: `Release ${version}` });

      // Create GitHub release with artifacts
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
        body: 'Release with artifacts',
        draft: false,
        prerelease: false,
        artifacts: [
          {
            name: 'build.zip',
            path: '/path/to/build.zip',
            contentType: 'application/zip',
            size: 1024
          }
        ]
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);

      // Upload artifacts
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(Buffer.from('test content'));
      mockOctokit.rest.repos.uploadReleaseAsset.mockResolvedValue({
        data: {
          browser_download_url: `https://github.com/test-owner/test-repo/releases/download/${tagName}/build.zip`
        }
      });

      const uploadResults = await githubPublisher.uploadArtifacts('456', release.artifacts);

      expect(uploadResults).toHaveLength(1);
      expect(uploadResults[0].success).toBe(true);
    });

    it('should handle prerelease workflow', async () => {
      const version = '1.0.0-beta.1';
      const tagName = 'v1.0.0-beta.1';

      // Create tag
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({ version, message: `Release ${version}` });

      // Create prerelease on GitHub
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 789,
          html_url: `https://github.com/test-owner/test-repo/releases/tag/${tagName}`,
          tag_name: tagName
        }
      });

      const release: GitHubRelease = {
        tagName,
        name: `Release ${version}`,
        body: 'Beta release',
        draft: false,
        prerelease: true,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          prerelease: true
        })
      );

      // Publish to npm with beta tag
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0-beta.1'
      }));
      mockExecSync.mockReturnValueOnce(''); // npm view (doesn't exist)
      mockExecSync.mockReturnValueOnce('+ @test/package@1.0.0-beta.1\n'); // npm publish

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version: '1.0.0-beta.1',
        path: '/test/path',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);

      expect(publishResult.success).toBe(true);
    });
  });

  describe('Workflow Error Handling', () => {
    it('should stop workflow when tag creation fails', async () => {
      // Tag creation fails
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

      // Workflow should stop - no GitHub release or npm publish should occur
      // (This would be enforced by the orchestration layer)
    });

    it('should rollback on GitHub release failure', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';

      // Create tag successfully
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      const tagResult = await gitOps.createTag({ version, message: `Release ${version}` });

      expect(tagResult.success).toBe(true);

      // GitHub release fails
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
        tagName,
        name: `Release ${version}`,
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(false);

      // Rollback local tag
      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push(tagName);
      }

      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const rollbackResult = await gitOps.rollback();

      expect(rollbackResult.success).toBe(true);
    });

    it('should rollback on npm publish failure', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';

      // Create tag and GitHub release successfully
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({ version, message: `Release ${version}` });

      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 123,
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

      // npm publish fails
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));
      mockExecSync.mockReturnValueOnce(''); // npm view (doesn't exist)
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('npm publish failed');
      });
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('npm publish failed');
      });
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('npm publish failed');
      });

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version: '1.0.0',
        path: '/test/path',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);

      expect(publishResult.success).toBe(false);

      // Rollback GitHub release
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({
        data: { id: 123, tag_name: tagName }
      });
      mockOctokit.rest.repos.deleteRelease.mockResolvedValue({});

      const deleteResult = await githubPublisher.deleteRelease(tagName);

      expect(deleteResult).toBe(true);
    });

    it('should handle partial rollback when some operations fail', async () => {
      const tagName = 'v1.0.0';

      // Create rollback state
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Tag not found');
      });
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git tag -a

      await gitOps.createTag({ version: '1.0.0' });

      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push(tagName);
      }

      // Local rollback succeeds
      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const localRollback = await gitOps.rollback();

      expect(localRollback.success).toBe(true);

      // Remote rollback fails
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue(
        new Error('Release not found')
      );

      await expect(githubPublisher.deleteRelease(tagName)).rejects.toThrow(
        'Failed to delete release'
      );

      // Verify local rollback succeeded even though remote failed
      expect(localRollback.success).toBe(true);
    });
  });

  describe('Multi-Package Publishing', () => {
    it('should publish multiple packages in sequence', async () => {
      const packages: PackagePublish[] = [
        {
          name: '@test/package1',
          version: '1.0.0',
          path: '/test/path1',
          registry: 'https://registry.npmjs.org/',
          access: 'public'
        },
        {
          name: '@test/package2',
          version: '1.0.0',
          path: '/test/path2',
          registry: 'https://registry.npmjs.org/',
          access: 'public'
        }
      ];

      // Mock package validation - return correct package.json for each package
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync
        .mockReturnValueOnce(JSON.stringify({ name: '@test/package1', version: '1.0.0' })) // Package 1 validation
        .mockReturnValueOnce(JSON.stringify({ name: '@test/package2', version: '1.0.0' })); // Package 2 validation

      // Package 1 publish sequence (authentication + validation + publish)
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami (authentication)
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get
      mockExecSync.mockReturnValueOnce(''); // npm view (version check - doesn't exist)
      mockExecSync.mockReturnValueOnce('+ @test/package1@1.0.0\n'); // npm publish
      
      // Package 2 publish sequence (no re-authentication needed - already authenticated)
      mockExecSync.mockReturnValueOnce(''); // npm view (version check - doesn't exist)
      mockExecSync.mockReturnValueOnce('+ @test/package2@1.0.0\n'); // npm publish

      const results = await npmPublisher.publishPackages(packages);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    it('should stop publishing on first failure', async () => {
      const packages: PackagePublish[] = [
        {
          name: '@test/package1',
          version: '1.0.0',
          path: '/test/path1',
          registry: 'https://registry.npmjs.org/',
          access: 'public'
        },
        {
          name: '@test/package2',
          version: '1.0.0',
          path: '/test/path2',
          registry: 'https://registry.npmjs.org/',
          access: 'public'
        }
      ];

      // Mock authentication
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get

      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path) => {
        if (path.toString().includes('package1')) {
          return JSON.stringify({ name: '@test/package1', version: '1.0.0' });
        }
        return JSON.stringify({ name: '@test/package2', version: '1.0.0' });
      });

      // Mock first package version check
      mockExecSync.mockReturnValueOnce(''); // package1 version check

      // Mock first package publish fails (all retries)
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Publish failed');
      });
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Publish failed');
      });
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Publish failed');
      });

      const results = await npmPublisher.publishPackages(packages);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(false);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain('Publishing stopped due to previous failure');
    });
  });

  describe('Coordination Validation', () => {
    it('should ensure tag names match between git and GitHub', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';

      // Create fresh GitOperations instance to avoid state pollution
      const freshGitOps = new GitOperations('/test/repo');

      // Use GitMockHelper for proper mock sequence
      const gitMockHelper = new GitMockHelper(mockExecSync);
      
      // Create local tag (GitMockHelper handles all git commands)
      gitMockHelper.mockTagSuccess(version, 'def456');

      const tagResult = await freshGitOps.createTag({ version, message: `Release ${version}` });

      expect(tagResult.success).toBe(true);
      expect(tagResult.details).toContain(tagName);

      // Create GitHub release with matching tag
      mockOctokit.rest.users.getAuthenticated.mockResolvedValue({
        data: { login: 'test-user' }
      });
      mockOctokit.rest.repos.getReleaseByTag.mockRejectedValue({
        status: 404
      });
      mockOctokit.rest.repos.createRelease.mockResolvedValue({
        data: {
          id: 123,
          html_url: `https://github.com/test-owner/test-repo/releases/tag/${tagName}`,
          tag_name: tagName
        }
      });

      const release: GitHubRelease = {
        tagName, // Must match local tag
        name: `Release ${version}`,
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);

      expect(releaseResult.success).toBe(true);
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          tag_name: tagName
        })
      );
    });

    it('should ensure package versions match between package.json and npm', async () => {
      const version = '1.0.0';

      // Mock package.json with version
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));

      // Mock authentication
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get

      // Mock version check
      mockExecSync.mockReturnValueOnce(''); // npm view (doesn't exist)

      // Mock publish
      mockExecSync.mockReturnValueOnce('+ @test/package@1.0.0\n'); // npm publish

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version, // Must match package.json
        path: '/test/path',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);

      expect(publishResult.success).toBe(true);
      expect(publishResult.version).toBe(version);
    });

    it('should validate authentication before publishing', async () => {
      // Mock package validation
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }));

      // Mock failed authentication (npm whoami throws error)
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not logged in');
      });

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version: '1.0.0',
        path: '/test/path',
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);

      expect(publishResult.success).toBe(false);
      expect(publishResult.error).toContain('Not authenticated');
    });
  });
});
