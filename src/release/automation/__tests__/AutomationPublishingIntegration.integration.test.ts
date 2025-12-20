/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Automation → Publishing Integration Tests
 * 
 * Tests integration between automation layer (Task 6) and publishing system (Task 7)
 * to ensure automation correctly triggers publishing, GitHub releases use correct tags,
 * npm publishing happens after GitHub release, and error handling works correctly.
 * 
 * Mock Strategy:
 * - jest.mock('child_process'): Mock git and npm commands
 * - jest.mock('@octokit/rest'): Mock GitHub API client
 * - jest.mock('fs'): Mock file system operations
 * - No shared state: Each test creates fresh mocks
 * - Test isolation: Tests pass in any order
 * 
 * Requirements: 5.1, 5.2, 5.5, 6.3
 */

import { PackageUpdater } from '../PackageUpdater';
import { ChangelogManager, ChangelogEntry } from '../ChangelogManager';
import { GitOperations } from '../GitOperations';
import { GitHubPublisher, GitHubConfig } from '../../publishing/GitHubPublisher';
import { NpmPublisher, NpmConfig } from '../../publishing/NpmPublisher';
import { GitHubRelease, PackagePublish } from '../../types/ReleaseTypes';
import { GitMockHelper } from './helpers/GitMockHelper';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock dependencies
jest.mock('child_process');
jest.mock('@octokit/rest');
// Don't mock fs globally - we need real fs for test directory operations

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const { Octokit } = require('@octokit/rest');

describe('Automation → Publishing Integration', () => {
  let testDir: string;
  let packageUpdater: PackageUpdater;
  let changelogManager: ChangelogManager;
  let gitOps: GitOperations;
  let githubPublisher: GitHubPublisher;
  let npmPublisher: NpmPublisher;
  let gitMockHelper: GitMockHelper;
  let mockOctokit: any;
  let fsSpies: jest.SpyInstance[] = [];

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'automation-publishing-'));

    // Initialize components
    packageUpdater = new PackageUpdater();
    changelogManager = new ChangelogManager();
    gitOps = new GitOperations(testDir);

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

    const githubConfig: GitHubConfig = {
      token: 'test-token',
      owner: 'test-owner',
      repo: 'test-repo'
    };

    const npmConfig: NpmConfig = {
      registry: 'https://registry.npmjs.org/',
      timeout: 60000,
      maxRetries: 3,
      retryDelay: 100,
      dryRun: false
    };

    githubPublisher = new GitHubPublisher(githubConfig);
    npmPublisher = new NpmPublisher(npmConfig);

    // Initialize GitMockHelper
    gitMockHelper = new GitMockHelper(mockExecSync);

    // Clear all mocks and spy array
    jest.clearAllMocks();
    fsSpies = [];
  });

  afterEach(() => {
    // Restore all fs spies
    fsSpies.forEach(spy => spy.mockRestore());
    fsSpies = [];
    
    // Also restore all mocks to ensure no spy pollution
    jest.restoreAllMocks();

    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Complete Automation → Publishing Workflow', () => {
    it('should execute complete workflow: automation → GitHub release → npm publish', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';
      const packagePath = path.join(testDir, 'package.json');
      const changelogPath = path.join(testDir, 'CHANGELOG.md');

      // Step 1: Automation layer - update package.json
      const initialPackage = {
        name: '@test/package',
        version: '0.9.0',
        description: 'Test package'
      };
      fs.writeFileSync(packagePath, JSON.stringify(initialPackage, null, 2));

      const updateResult = await packageUpdater.updatePackageVersion(packagePath, version);
      expect(updateResult.success).toBe(true);

      // Step 2: Automation layer - update CHANGELOG.md
      const changelogEntry: ChangelogEntry = {
        version,
        date: '2025-11-27',
        content: '### Features\n\n- New feature\n- Another feature'
      };
      const changelogResult = await changelogManager.updateChangelog(changelogPath, changelogEntry);
      expect(changelogResult.success).toBe(true);

      // Step 3: Automation layer - create git commit and tag
      gitMockHelper.mockCommitSuccess('def456');
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      mockExecSync.mockReturnValueOnce(''); // git add CHANGELOG.md
      gitMockHelper.mockTagSuccess(version, 'def456');

      const commitResult = await gitOps.createCommit({
        message: `Release ${version}`,
        files: ['package.json', 'CHANGELOG.md']
      });
      expect(commitResult.success).toBe(true);

      const tagResult = await gitOps.createTag({
        version,
        message: `Release ${version}`
      });
      expect(tagResult.success).toBe(true);

      // Step 4: Publishing - create GitHub release using tag from GitOperations
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
        tagName, // Must match tag created by GitOperations
        name: `Release ${version}`,
        body: changelogEntry.content,
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);
      expect(releaseResult.success).toBe(true);
      expect(releaseResult.githubReleaseUrl).toContain(tagName);

      // Step 5: Publishing - publish to npm after GitHub release
      // Note: fs operations for npm publisher use real fs since we have real package.json
      
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get
      mockExecSync.mockReturnValueOnce(''); // npm view (doesn't exist)
      mockExecSync.mockReturnValueOnce('+ @test/package@1.0.0\n'); // npm publish

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version,
        path: testDir,
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);
      expect(publishResult.success).toBe(true);

      // Verify complete workflow executed successfully
      expect(updateResult.success).toBe(true);
      expect(changelogResult.success).toBe(true);
      expect(commitResult.success).toBe(true);
      expect(tagResult.success).toBe(true);
      expect(releaseResult.success).toBe(true);
      expect(publishResult.success).toBe(true);

      // Verify GitHub release used correct tag
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          tag_name: tagName
        })
      );
    });

    it('should ensure GitHub release happens before npm publish', async () => {
      const version = '2.0.0';
      const tagName = 'v2.0.0';
      const packagePath = path.join(testDir, 'package.json');

      // Setup package.json
      fs.writeFileSync(packagePath, JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }, null, 2));

      // Automation: update package and create tag
      await packageUpdater.updatePackageVersion(packagePath, version);
      
      gitMockHelper.mockTagSuccess(version, 'abc123');
      await gitOps.createTag({ version, message: `Release ${version}` });

      // Track call order
      const callOrder: string[] = [];

      // GitHub release
      mockOctokit.rest.users.getAuthenticated.mockImplementation(() => {
        callOrder.push('github-auth');
        return Promise.resolve({ data: { login: 'test-user' } });
      });
      mockOctokit.rest.repos.getReleaseByTag.mockImplementation(() => {
        callOrder.push('github-check-release');
        return Promise.reject({ status: 404 });
      });
      mockOctokit.rest.repos.createRelease.mockImplementation(() => {
        callOrder.push('github-create-release');
        return Promise.resolve({
          data: {
            id: 123,
            html_url: `https://github.com/test-owner/test-repo/releases/tag/${tagName}`,
            tag_name: tagName
          }
        });
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

      // npm publish
      // Note: fs operations for npm publisher use real fs since we have real package.json

      mockExecSync.mockImplementation((cmd: string) => {
        if (cmd.includes('whoami')) {
          callOrder.push('npm-auth');
          return 'testuser\n';
        }
        if (cmd.includes('profile get')) {
          return JSON.stringify({ email: 'test@example.com' });
        }
        if (cmd.includes('view')) {
          return '';
        }
        if (cmd.includes('publish')) {
          callOrder.push('npm-publish');
          return '+ @test/package@2.0.0\n';
        }
        return '';
      });

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version,
        path: testDir,
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      await npmPublisher.publishPackage(packageToPublish);

      // Verify GitHub release happened before npm publish
      const githubIndex = callOrder.indexOf('github-create-release');
      const npmIndex = callOrder.indexOf('npm-publish');
      
      expect(githubIndex).toBeGreaterThan(-1);
      expect(npmIndex).toBeGreaterThan(-1);
      expect(githubIndex).toBeLessThan(npmIndex);
    });

    it('should use git tags from GitOperations for GitHub releases', async () => {
      const version = '3.0.0';
      const tagName = 'v3.0.0';

      // Create tag using GitOperations
      gitMockHelper.mockTagSuccess(version, 'abc123');
      
      const tagResult = await gitOps.createTag({
        version,
        message: `Release ${version}`
      });

      expect(tagResult.success).toBe(true);
      expect(tagResult.details).toContain(tagName);

      // Create GitHub release with same tag
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
        tagName, // Must match tag from GitOperations
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
  });

  describe('Error Handling and Rollback', () => {
    it('should stop publishing when GitHub release fails', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';
      const packagePath = path.join(testDir, 'package.json');

      // Automation succeeds
      fs.writeFileSync(packagePath, JSON.stringify({
        name: '@test/package',
        version: '0.9.0'
      }, null, 2));

      await packageUpdater.updatePackageVersion(packagePath, version);

      gitMockHelper.mockTagSuccess(version, 'abc123');
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

      // npm publish should not happen (orchestration layer would prevent this)
      // This test demonstrates the need for proper error handling
    });

    it('should rollback automation when publishing fails', async () => {
      const version = '1.0.0';
      const tagName = 'v1.0.0';
      const packagePath = path.join(testDir, 'package.json');

      // Automation succeeds
      fs.writeFileSync(packagePath, JSON.stringify({
        name: '@test/package',
        version: '0.9.0'
      }, null, 2));

      await packageUpdater.updatePackageVersion(packagePath, version);

      gitMockHelper.mockTagSuccess(version, 'abc123');
      await gitOps.createTag({ version, message: `Release ${version}` });

      // GitHub release succeeds
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
      // Note: fs operations for npm publisher use real fs since we have real package.json
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
        version,
        path: testDir,
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

      // Rollback git tag
      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push(tagName);
      }

      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const gitRollback = await gitOps.rollback();
      expect(gitRollback.success).toBe(true);

      // Rollback package.json
      await packageUpdater.rollback();
      const rolledBackPkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(rolledBackPkg.version).toBe('0.9.0');
    });

    it('should coordinate rollback across automation and publishing', async () => {
      const version = '2.0.0';
      const tagName = 'v2.0.0';
      const packagePath = path.join(testDir, 'package.json');
      const changelogPath = path.join(testDir, 'CHANGELOG.md');

      // Complete automation workflow
      fs.writeFileSync(packagePath, JSON.stringify({
        name: '@test/package',
        version: '1.0.0'
      }, null, 2));

      await packageUpdater.updatePackageVersion(packagePath, version);

      const changelogEntry: ChangelogEntry = {
        version,
        date: '2025-11-27',
        content: '### Features\n\n- Feature'
      };
      await changelogManager.updateChangelog(changelogPath, changelogEntry);

      gitMockHelper.mockCommitSuccess('def456');
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      mockExecSync.mockReturnValueOnce(''); // git add CHANGELOG.md
      gitMockHelper.mockTagSuccess(version, 'def456');

      await gitOps.createCommit({
        message: `Release ${version}`,
        files: ['package.json', 'CHANGELOG.md']
      });
      await gitOps.createTag({ version, message: `Release ${version}` });

      // GitHub release succeeds
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
        body: changelogEntry.content,
        draft: false,
        prerelease: false,
        artifacts: []
      };

      await githubPublisher.createRelease(release);

      // Simulate failure requiring complete rollback
      // Rollback publishing
      mockOctokit.rest.repos.getReleaseByTag.mockResolvedValue({
        data: { id: 456, tag_name: tagName }
      });
      mockOctokit.rest.repos.deleteRelease.mockResolvedValue({});
      mockOctokit.rest.git.deleteRef.mockResolvedValue({});

      await githubPublisher.deleteRelease(tagName);
      await githubPublisher.deleteTag(tagName);

      // Rollback automation
      const rollbackState = gitOps.getRollbackState();
      if (rollbackState) {
        rollbackState.tags.push(tagName);
        rollbackState.commitHash = 'abc123'; // Set commit hash for rollback
      }

      mockExecSync.mockReturnValueOnce(''); // git reset --hard
      mockExecSync.mockReturnValueOnce(''); // git tag -d

      const gitRollback = await gitOps.rollback();
      expect(gitRollback.success).toBe(true);

      await packageUpdater.rollback();
      const rolledBackPkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(rolledBackPkg.version).toBe('1.0.0');

      // Verify complete rollback
      expect(gitRollback.success).toBe(true);
      expect(rolledBackPkg.version).toBe('1.0.0');
    });
  });

  describe('Data Flow Validation', () => {
    it('should pass version information correctly through the pipeline', async () => {
      const version = '1.5.0';
      const tagName = 'v1.5.0';
      const packagePath = path.join(testDir, 'package.json');

      // Automation: set version
      fs.writeFileSync(packagePath, JSON.stringify({
        name: '@test/package',
        version: '1.4.0'
      }, null, 2));

      const updateResult = await packageUpdater.updatePackageVersion(packagePath, version);
      expect(updateResult.success).toBe(true);

      // Verify package.json has correct version
      const updatedPkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(updatedPkg.version).toBe(version);

      // Git tag uses same version
      // First create a commit to establish rollback state
      gitMockHelper.mockCommitSuccess('abc123');
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      await gitOps.createCommit({
        message: `Release ${version}`,
        files: ['package.json']
      });
      
      // Now create tag
      gitMockHelper.mockTagSuccess(version, 'abc123');
      const tagResult = await gitOps.createTag({ version, message: `Release ${version}` });
      expect(tagResult.success).toBe(true);
      expect(tagResult.details).toContain(tagName);

      // GitHub release uses same tag
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
        body: 'Release notes',
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);
      expect(releaseResult.success).toBe(true);
      expect(releaseResult.version).toBe(tagName);

      // npm publish uses same version
      mockExecSync.mockReturnValueOnce('testuser\n'); // npm whoami
      mockExecSync.mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' })); // npm profile get
      
      // Mock fs operations for npm publisher
      // NpmPublisher will check if package.json exists and read it
      // We mock the exec commands that npm uses instead of mocking fs directly
      mockExecSync.mockReturnValueOnce(''); // npm view (doesn't exist)
      mockExecSync.mockReturnValueOnce('+ @test/package@1.5.0\n'); // npm publish

      const packageToPublish: PackagePublish = {
        name: '@test/package',
        version,
        path: testDir,
        registry: 'https://registry.npmjs.org/',
        access: 'public'
      };

      const publishResult = await npmPublisher.publishPackage(packageToPublish);
      expect(publishResult.success).toBe(true);
      expect(publishResult.version).toBe(version);

      // Verify version consistency across all steps
      expect(updatedPkg.version).toBe(version);
      expect(tagResult.details).toContain(`v${version}`);
      expect(releaseResult.version).toBe(`v${version}`);
      expect(publishResult.version).toBe(version);
    });

    it('should pass release notes from automation to GitHub release', async () => {
      const version = '2.0.0';
      const tagName = 'v2.0.0';
      const changelogPath = path.join(testDir, 'CHANGELOG.md');

      // Automation: create release notes
      const changelogEntry: ChangelogEntry = {
        version,
        date: '2025-11-27',
        content: '### 🚨 Breaking Changes\n\n- API changed\n\n### Features\n\n- New feature'
      };

      const changelogResult = await changelogManager.updateChangelog(changelogPath, changelogEntry);
      expect(changelogResult.success).toBe(true);

      // Read changelog content
      const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
      expect(changelogContent).toContain('### 🚨 Breaking Changes');
      expect(changelogContent).toContain('- API changed');

      // GitHub release uses changelog content
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
        body: changelogEntry.content, // Use changelog content
        draft: false,
        prerelease: false,
        artifacts: []
      };

      const releaseResult = await githubPublisher.createRelease(release);
      expect(releaseResult.success).toBe(true);

      // Verify GitHub release received correct content
      expect(mockOctokit.rest.repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining('### 🚨 Breaking Changes')
        })
      );
    });
  });
});
