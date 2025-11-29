/**
 * Integration Tests for Automation Layer
 * 
 * Tests the complete automation workflow:
 * - PackageUpdater + ChangelogManager + GitOperations working together
 * - End-to-end release automation scenarios
 * - Rollback coordination across all components
 * - Error handling and recovery
 * 
 * Mock Strategy:
 * - GitMockHelper: Provides consistent mock sequencing for git operations
 * - Real file operations: Uses temporary directory for package.json and CHANGELOG.md
 * - Mock cleanup: jest.clearAllMocks() between tests to prevent pollution
 * 
 * Validates Requirements:
 * - 1.1, 1.4: Version updates in package.json
 * - 3.1: CHANGELOG.md creation and updates
 * - 6.1, 6.2, 6.3: Git operations (commit, tag, push)
 */

import { PackageUpdater } from '../PackageUpdater';
import { ChangelogManager, ChangelogEntry } from '../ChangelogManager';
import { GitOperations } from '../GitOperations';
import { GitMockHelper } from './helpers/GitMockHelper';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

// Mock child_process for GitOperations
jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

/**
 * Git Command Sequences Documentation
 * 
 * This section documents the exact sequence of git commands executed by GitOperations
 * methods. These sequences are critical for correctly mocking git operations in tests.
 * 
 * ============================================================================
 * createCommit() Command Sequence
 * ============================================================================
 * 
 * 1. git rev-parse --git-dir
 *    Purpose: Validate we're in a git repository
 *    Expected: Returns empty string (success) or throws error (not a repo)
 * 
 * 2. git rev-parse HEAD
 *    Purpose: Save current commit hash for potential rollback
 *    Expected: Returns current commit hash (e.g., "abc123\n")
 * 
 * 3. git rev-parse --abbrev-ref HEAD
 *    Purpose: Get current branch name for rollback state
 *    Expected: Returns branch name (e.g., "main\n")
 * 
 * 4. git add "<file>" (for each file in options.files)
 *    Purpose: Stage files for commit
 *    Expected: Returns empty string (success)
 * 
 * 5. git commit [--allow-empty] -m "<message>"
 *    Purpose: Create commit with staged files
 *    Expected: Returns commit info (e.g., "[main def456] Release 1.1.0\n")
 * 
 * ============================================================================
 * createTag() Command Sequence
 * ============================================================================
 * 
 * 1. git rev-parse --git-dir
 *    Purpose: Validate we're in a git repository
 *    Expected: Returns empty string (success) or throws error (not a repo)
 * 
 * 2. git rev-parse "<tagName>"
 *    Purpose: Check if tag already exists
 *    Expected: Throws error "Tag not found" (tag doesn't exist - good)
 *             Returns hash if tag exists (error condition)
 * 
 * 3. git rev-parse HEAD
 *    Purpose: Save current commit hash for potential rollback
 *    Expected: Returns current commit hash (e.g., "def456\n")
 * 
 * 4. git rev-parse --abbrev-ref HEAD
 *    Purpose: Get current branch name for rollback state
 *    Expected: Returns branch name (e.g., "main\n")
 * 
 * 5. git tag -a "<tagName>" -m "<message>" (annotated tag, default)
 *    OR
 *    git tag "<tagName>" (lightweight tag, if annotated=false)
 *    Purpose: Create the tag
 *    Expected: Returns empty string (success)
 * 
 * ============================================================================
 * rollback() Command Sequence
 * ============================================================================
 * 
 * 1. git reset --hard <commitHash>
 *    Purpose: Reset to previous commit state
 *    Expected: Returns empty string (success)
 *    Note: Only executed if rollbackState.commitHash exists
 * 
 * 2. git tag -d "<tagName>" (for each tag in rollbackState.tags)
 *    Purpose: Delete tags that were created
 *    Expected: Returns empty string (success)
 *    Note: Only executed for tags in rollbackState.tags array
 * 
 * ============================================================================
 * Mock Configuration Examples
 * ============================================================================
 * 
 * Example 1: Successful commit workflow
 * mockExecSync.mockReturnValueOnce('');           // git rev-parse --git-dir
 * mockExecSync.mockReturnValueOnce('abc123\n');   // git rev-parse HEAD (save state)
 * mockExecSync.mockReturnValueOnce('main\n');     // git rev-parse --abbrev-ref HEAD
 * mockExecSync.mockReturnValueOnce('');           // git add file1
 * mockExecSync.mockReturnValueOnce('');           // git add file2
 * mockExecSync.mockReturnValueOnce('[main def456] Commit message\n'); // git commit
 * 
 * Example 2: Successful tag creation workflow
 * mockExecSync.mockReturnValueOnce('');           // git rev-parse --git-dir
 * mockExecSync.mockImplementationOnce(() => {     // git rev-parse v1.1.0 (check exists)
 *   throw new Error('Tag not found');             // Tag doesn't exist (good)
 * });
 * mockExecSync.mockReturnValueOnce('def456\n');   // git rev-parse HEAD (save state)
 * mockExecSync.mockReturnValueOnce('main\n');     // git rev-parse --abbrev-ref HEAD
 * mockExecSync.mockReturnValueOnce('');           // git tag -a v1.1.0 -m "message"
 * 
 * Example 3: Rollback workflow
 * mockExecSync.mockReturnValueOnce('');           // git reset --hard abc123
 * mockExecSync.mockReturnValueOnce('');           // git tag -d v1.1.0 (if tag exists)
 * 
 * ============================================================================
 * Important Notes for Test Writers
 * ============================================================================
 * 
 * 1. Mock Order Matters: Git commands are executed in the exact order shown above.
 *    Mocks must be configured in the same order.
 * 
 * 2. Tag Existence Check: The git rev-parse <tagName> command SHOULD throw an error
 *    when the tag doesn't exist. This is the expected success case for tag creation.
 * 
 * 3. Rollback State: createCommit() and createTag() both save rollback state before
 *    executing their operations. This adds extra git commands at the beginning.
 * 
 * 4. File Staging: createCommit() stages each file individually with separate
 *    git add commands. Mock one git add per file in options.files.
 * 
 * 5. Branch Names: Tests should use realistic branch names like "main" or "develop"
 *    to match actual git repository behavior.
 */

describe('Automation Layer Integration', () => {
  let testDir: string;
  let packageUpdater: PackageUpdater;
  let changelogManager: ChangelogManager;
  let gitOps: GitOperations;
  let packagePath: string;
  let changelogPath: string;
  let gitMockHelper: GitMockHelper;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'automation-integration-'));
    packagePath = path.join(testDir, 'package.json');
    changelogPath = path.join(testDir, 'CHANGELOG.md');

    // Initialize components
    packageUpdater = new PackageUpdater();
    changelogManager = new ChangelogManager();
    gitOps = new GitOperations(testDir);

    // Initialize GitMockHelper
    gitMockHelper = new GitMockHelper(mockExecSync);

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Complete Release Workflow', () => {
    it('should execute complete release workflow: update package.json, update CHANGELOG, commit, and tag', async () => {
      // Arrange: Create initial package.json
      const initialPackage = {
        name: 'test-package',
        version: '1.0.0',
        description: 'Test package'
      };
      fs.writeFileSync(packagePath, JSON.stringify(initialPackage, null, 2));

      // Mock git operations using GitMockHelper
      gitMockHelper.mockCommitSuccess('def456');
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      mockExecSync.mockReturnValueOnce(''); // git add CHANGELOG.md
      gitMockHelper.mockTagSuccess('1.1.0', 'def456');

      // Act: Execute complete workflow
      // Step 1: Update package.json
      const updateResult = await packageUpdater.updatePackageVersion(packagePath, '1.1.0');
      expect(updateResult.success).toBe(true);

      // Step 2: Update CHANGELOG.md
      const changelogEntry: ChangelogEntry = {
        version: '1.1.0',
        date: '2025-11-26',
        content: '### Features\n\n- New feature added\n- Another feature'
      };
      const changelogResult = await changelogManager.updateChangelog(changelogPath, changelogEntry);
      expect(changelogResult.success).toBe(true);

      // Step 3: Create git commit
      const commitResult = await gitOps.createCommit({
        message: 'Release 1.1.0',
        files: ['package.json', 'CHANGELOG.md']
      });
      expect(commitResult.success).toBe(true);

      // Step 4: Create git tag
      const tagResult = await gitOps.createTag({
        version: '1.1.0',
        message: 'Release 1.1.0'
      });
      expect(tagResult.success).toBe(true);

      // Assert: Verify all operations succeeded
      expect(updateResult.success).toBe(true);
      expect(changelogResult.success).toBe(true);
      expect(commitResult.success).toBe(true);
      expect(tagResult.success).toBe(true);

      // Verify package.json updated
      const updatedPackage = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(updatedPackage.version).toBe('1.1.0');

      // Verify CHANGELOG.md created and updated
      const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
      expect(changelogContent).toContain('## [1.1.0] - 2025-11-26');
      expect(changelogContent).toContain('- New feature added');
    });

    it('should handle multiple package updates in monorepo scenario', async () => {
      // Arrange: Create multiple package.json files
      const package1Path = path.join(testDir, 'packages', 'core', 'package.json');
      const package2Path = path.join(testDir, 'packages', 'utils', 'package.json');

      fs.mkdirSync(path.dirname(package1Path), { recursive: true });
      fs.mkdirSync(path.dirname(package2Path), { recursive: true });

      fs.writeFileSync(package1Path, JSON.stringify({ name: '@test/core', version: '1.0.0' }, null, 2));
      fs.writeFileSync(package2Path, JSON.stringify({ name: '@test/utils', version: '1.0.0' }, null, 2));

      // Mock git operations
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git add package1
      mockExecSync.mockReturnValueOnce(''); // git add package2
      mockExecSync.mockReturnValueOnce(''); // git add CHANGELOG
      mockExecSync.mockReturnValueOnce('[main def456] Release 2.0.0\n'); // git commit

      // Act: Update multiple packages
      const updateResult = await packageUpdater.updateMultiplePackages(
        [package1Path, package2Path],
        '2.0.0'
      );
      expect(updateResult.success).toBe(true);

      // Update CHANGELOG
      const changelogEntry: ChangelogEntry = {
        version: '2.0.0',
        date: '2025-11-26',
        content: '### 🚨 Breaking Changes\n\n- Major API changes\n\n### Features\n\n- New features'
      };
      const changelogResult = await changelogManager.updateChangelog(changelogPath, changelogEntry);
      expect(changelogResult.success).toBe(true);

      // Create commit
      const commitResult = await gitOps.createCommit({
        message: 'Release 2.0.0',
        files: [package1Path, package2Path, changelogPath]
      });
      expect(commitResult.success).toBe(true);

      // Assert: Verify all packages updated
      const pkg1 = JSON.parse(fs.readFileSync(package1Path, 'utf-8'));
      const pkg2 = JSON.parse(fs.readFileSync(package2Path, 'utf-8'));
      expect(pkg1.version).toBe('2.0.0');
      expect(pkg2.version).toBe('2.0.0');

      // Verify CHANGELOG contains breaking changes
      const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
      expect(changelogContent).toContain('### 🚨 Breaking Changes');
    });

    it('should handle pre-release workflow', async () => {
      // Arrange
      const initialPackage = { name: 'test', version: '1.0.0' };
      fs.writeFileSync(packagePath, JSON.stringify(initialPackage, null, 2));

      // Mock git operations for alpha release using GitMockHelper
      gitMockHelper.mockCommitSuccess('def456');
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      mockExecSync.mockReturnValueOnce(''); // git add CHANGELOG.md
      gitMockHelper.mockTagSuccess('1.1.0-alpha.1', 'def456');

      // Act: Alpha release
      const alphaVersion = '1.1.0-alpha.1';
      await packageUpdater.updatePackageVersion(packagePath, alphaVersion);
      
      const alphaEntry: ChangelogEntry = {
        version: alphaVersion,
        date: '2025-11-26',
        content: '### Features\n\n- Alpha feature'
      };
      await changelogManager.updateChangelog(changelogPath, alphaEntry);
      
      await gitOps.createCommit({
        message: `Release ${alphaVersion}`,
        files: ['package.json', 'CHANGELOG.md']
      });
      
      const tagResult = await gitOps.createTag({
        version: alphaVersion,
        message: `Alpha release ${alphaVersion}`
      });

      // Assert
      expect(tagResult.success).toBe(true);
      
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(pkg.version).toBe(alphaVersion);
      
      const changelog = fs.readFileSync(changelogPath, 'utf-8');
      expect(changelog).toContain(`## [${alphaVersion}]`);
    });
  });

  describe('Rollback Scenarios', () => {
    it('should rollback all changes when package update fails', async () => {
      // Arrange: Create valid and invalid package paths
      const validPath = path.join(testDir, 'valid', 'package.json');
      const invalidPath = path.join(testDir, 'invalid', 'package.json');

      fs.mkdirSync(path.dirname(validPath), { recursive: true });
      fs.mkdirSync(path.dirname(invalidPath), { recursive: true });

      fs.writeFileSync(validPath, JSON.stringify({ name: 'valid', version: '1.0.0' }, null, 2));
      fs.writeFileSync(invalidPath, '{ bad json }');

      // Act: Try to update both packages (should fail and rollback)
      const result = await packageUpdater.updateMultiplePackages(
        [validPath, invalidPath],
        '2.0.0'
      );

      // Assert: Update failed and rolled back
      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);

      // Verify valid package was rolled back
      const validPkg = JSON.parse(fs.readFileSync(validPath, 'utf-8'));
      expect(validPkg.version).toBe('1.0.0'); // Unchanged
    });

    it('should rollback git operations when tag creation fails', async () => {
      // Arrange
      const initialPackage = { name: 'test', version: '1.0.0' };
      fs.writeFileSync(packagePath, JSON.stringify(initialPackage, null, 2));

      // Mock git operations - commit succeeds, tag fails
      gitMockHelper.mockCommitSuccess('def456');
      mockExecSync.mockReturnValueOnce(''); // git add package.json
      gitMockHelper.mockTagExists('1.1.0');

      // Act: Update package and commit
      await packageUpdater.updatePackageVersion(packagePath, '1.1.0');
      
      const commitResult = await gitOps.createCommit({
        message: 'Release 1.1.0',
        files: ['package.json']
      });
      expect(commitResult.success).toBe(true);

      // Try to create tag (will fail because tag exists)
      const tagResult = await gitOps.createTag({
        version: '1.1.0'
      });
      expect(tagResult.success).toBe(false);

      // Rollback git operations
      gitMockHelper.mockRollback('abc123');

      const rollbackResult = await gitOps.rollback();
      expect(rollbackResult.success).toBe(true);

      // Note: In real scenario, would also rollback package.json changes
      // This demonstrates the need for coordinated rollback
    });

    it('should coordinate rollback across all automation components', async () => {
      // Arrange
      const initialPackage = { name: 'test', version: '1.0.0' };
      fs.writeFileSync(packagePath, JSON.stringify(initialPackage, null, 2));

      // Mock git operations
      mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
      mockExecSync.mockReturnValueOnce('abc123\n'); // git rev-parse HEAD
      mockExecSync.mockReturnValueOnce('main\n'); // git rev-parse --abbrev-ref HEAD
      mockExecSync.mockReturnValueOnce(''); // git add
      mockExecSync.mockReturnValueOnce(''); // git add
      mockExecSync.mockReturnValueOnce('[main def456] Release 1.1.0\n'); // git commit

      // Act: Perform operations
      const updateResult = await packageUpdater.updatePackageVersion(packagePath, '1.1.0');
      expect(updateResult.success).toBe(true);

      const changelogEntry: ChangelogEntry = {
        version: '1.1.0',
        date: '2025-11-26',
        content: '### Features\n\n- Feature'
      };
      const changelogResult = await changelogManager.updateChangelog(changelogPath, changelogEntry);
      expect(changelogResult.success).toBe(true);

      const commitResult = await gitOps.createCommit({
        message: 'Release 1.1.0',
        files: ['package.json', 'CHANGELOG.md']
      });
      expect(commitResult.success).toBe(true);

      // Simulate failure requiring rollback
      // In real scenario, this would be triggered by a failed operation

      // Rollback git
      mockExecSync.mockReturnValueOnce(''); // git reset --hard
      const gitRollback = await gitOps.rollback();
      expect(gitRollback.success).toBe(true);

      // Rollback package.json
      await packageUpdater.rollback();
      const rolledBackPkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(rolledBackPkg.version).toBe('1.0.0');

      // Note: CHANGELOG rollback would need to be implemented
      // This test demonstrates the coordination needed
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle package.json update failure gracefully', async () => {
      // Arrange: Invalid package path
      const invalidPath = path.join(testDir, 'nonexistent', 'package.json');

      // Act
      const result = await packageUpdater.updatePackageVersion(invalidPath, '1.0.0');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('FILE_NOT_FOUND');
      expect(result.rollbackPerformed).toBe(false); // No rollback needed
    });

    it('should handle CHANGELOG duplicate version gracefully', async () => {
      // Arrange: Create CHANGELOG with existing version
      const entry1: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-20',
        content: '### Features\n\n- Initial'
      };
      await changelogManager.updateChangelog(changelogPath, entry1);

      // Act: Try to add same version again
      const entry2: ChangelogEntry = {
        version: '1.0.0',
        date: '2025-11-26',
        content: '### Features\n\n- Duplicate'
      };
      const result = await changelogManager.updateChangelog(changelogPath, entry2);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('VERSION_EXISTS');

      // Verify original content unchanged
      const content = fs.readFileSync(changelogPath, 'utf-8');
      expect(content).toContain('- Initial');
      expect(content).not.toContain('- Duplicate');
    });

    it('should handle git operation failures gracefully', async () => {
      // Arrange: Mock git failure using GitMockHelper
      gitMockHelper.mockGitRepoCheck(false);

      // Act
      const result = await gitOps.createCommit({
        message: 'Release 1.0.0'
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('NOT_GIT_REPO');
    });

    it('should provide clear error messages for validation failures', async () => {
      // Arrange
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));

      // Act: Try invalid version
      const result = await packageUpdater.updatePackageVersion(packagePath, 'invalid-version');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_VERSION');
      expect(result.errors[0].error).toContain('Invalid semantic version format');
      expect(result.errors[0].error).toContain('invalid-version');
    });
  });

  describe('Version Format Validation', () => {
    it('should validate semantic versions across all components', async () => {
      const validVersions = [
        '1.0.0',
        '1.2.3',
        '1.0.0-alpha.1',
        '1.0.0-beta.2',
        '1.0.0-rc.1',
        '1.0.0+build.123'
      ];

      for (const version of validVersions) {
        // Clear all mocks between iterations to ensure fresh state
        jest.clearAllMocks();
        gitMockHelper.clearMocks();

        // Reinitialize GitOperations to clear internal state
        gitOps = new GitOperations(testDir);

        // Test PackageUpdater
        const packagePath = path.join(testDir, `package-${version}.json`);
        fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
        const pkgResult = await packageUpdater.updatePackageVersion(packagePath, version);
        expect(pkgResult.success).toBe(true);

        // Test ChangelogManager
        const entry: ChangelogEntry = {
          version,
          date: '2025-11-26',
          content: '### Features\n\n- Feature'
        };
        expect(changelogManager.validateEntry(entry)).toBe(true);

        // Test GitOperations using GitMockHelper
        // Note: mockTagSuccess includes git repo check, so no need to call mockGitRepoCheck separately
        gitMockHelper.mockTagSuccess(version, 'abc123');

        const tagResult = await gitOps.createTag({ version });
        expect(tagResult.success).toBe(true);
      }
    });

    it('should reject invalid versions consistently', async () => {
      const invalidVersions = [
        'v1.0.0',
        '1.0',
        '1',
        'not-a-version',
        ''
      ];

      for (const version of invalidVersions) {
        // Test PackageUpdater
        const packagePath = path.join(testDir, `package-${version}.json`);
        fs.writeFileSync(packagePath, JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2));
        const pkgResult = await packageUpdater.updatePackageVersion(packagePath, version);
        expect(pkgResult.success).toBe(false);

        // Test ChangelogManager
        const entry: ChangelogEntry = {
          version,
          date: '2025-11-26',
          content: '### Features\n\n- Feature'
        };
        expect(changelogManager.validateEntry(entry)).toBe(false);

        // Test GitOperations
        mockExecSync.mockReturnValueOnce(''); // git rev-parse --git-dir
        const tagResult = await gitOps.createTag({ version });
        expect(tagResult.success).toBe(false);
      }
    });
  });

  describe('Atomic Operations', () => {
    it('should ensure package updates are atomic', async () => {
      // Arrange: Multiple packages, one will fail
      const pkg1Path = path.join(testDir, 'pkg1', 'package.json');
      const pkg2Path = path.join(testDir, 'pkg2', 'package.json');
      const pkg3Path = path.join(testDir, 'nonexistent', 'package.json');

      fs.mkdirSync(path.dirname(pkg1Path), { recursive: true });
      fs.mkdirSync(path.dirname(pkg2Path), { recursive: true });

      fs.writeFileSync(pkg1Path, JSON.stringify({ name: 'pkg1', version: '1.0.0' }, null, 2));
      fs.writeFileSync(pkg2Path, JSON.stringify({ name: 'pkg2', version: '1.0.0' }, null, 2));

      // Act: Update all packages (will fail on pkg3)
      const result = await packageUpdater.updateMultiplePackages(
        [pkg1Path, pkg2Path, pkg3Path],
        '2.0.0'
      );

      // Assert: All or nothing - all should be rolled back
      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);

      const pkg1 = JSON.parse(fs.readFileSync(pkg1Path, 'utf-8'));
      const pkg2 = JSON.parse(fs.readFileSync(pkg2Path, 'utf-8'));
      expect(pkg1.version).toBe('1.0.0'); // Rolled back
      expect(pkg2.version).toBe('1.0.0'); // Rolled back
    });

    it('should preserve package.json formatting during updates', async () => {
      // Arrange: Package with specific formatting
      const packagePath = path.join(testDir, 'package.json');
      const originalPackage = {
        name: 'test-package',
        version: '1.0.0',
        description: 'Test',
        scripts: {
          test: 'jest',
          build: 'tsc'
        },
        dependencies: {
          'some-dep': '^1.0.0'
        }
      };
      fs.writeFileSync(packagePath, JSON.stringify(originalPackage, null, 2));

      // Act: Update version
      await packageUpdater.updatePackageVersion(packagePath, '1.1.0');

      // Assert: Formatting preserved
      const content = fs.readFileSync(packagePath, 'utf-8');
      expect(content).toContain('"version": "1.1.0"');
      expect(content).toContain('"test": "jest"');
      expect(content).toContain('"build": "tsc"');
      expect(content).toContain('"some-dep": "^1.0.0"');

      // Verify structure preserved
      const updated = JSON.parse(content);
      expect(updated.scripts).toEqual(originalPackage.scripts);
      expect(updated.dependencies).toEqual(originalPackage.dependencies);
    });
  });
});
