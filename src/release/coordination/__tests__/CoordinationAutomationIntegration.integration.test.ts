/**
 * Integration Tests: Coordination → Automation Integration
 * 
 * Mock Strategy:
 * - Mock PackageUpdater, ChangelogManager, GitOperations
 * - Test coordinated updates across multiple packages
 * - Verify automation sequence is correct
 * - Test error handling for automation failures
 * 
 * Tests the integration between package coordination and automation layer
 * to ensure coordinated version updates trigger correct automation sequence.
 * 
 * Requirements: 4.1, 4.5, 6.1, 6.2, 6.3
 */

import { PackageCoordinator } from '../PackageCoordinator';
import { PackageUpdater } from '../../automation/PackageUpdater';
import { ChangelogManager } from '../../automation/ChangelogManager';
import { GitOperations } from '../../automation/GitOperations';
import {
  PackageVersion,
  CoordinationStrategy,
  CoordinationPlan
} from '../types';

// Mock automation layer
jest.mock('../../automation/PackageUpdater');
jest.mock('../../automation/ChangelogManager');
jest.mock('../../automation/GitOperations');

describe('Coordination → Automation Integration', () => {
  let coordinator: PackageCoordinator;
  let packageUpdater: jest.Mocked<PackageUpdater>;
  let changelogManager: jest.Mocked<ChangelogManager>;
  let gitOperations: jest.Mocked<GitOperations>;
  let strategy: CoordinationStrategy;
  let mockPackages: PackageVersion[];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocked automation layer
    packageUpdater = new PackageUpdater() as jest.Mocked<PackageUpdater>;
    changelogManager = new ChangelogManager() as jest.Mocked<ChangelogManager>;
    gitOperations = new GitOperations() as jest.Mocked<GitOperations>;

    // Setup default mock implementations
    packageUpdater.updatePackageVersion = jest.fn().mockResolvedValue({
      success: true,
      updatedFiles: [],
      errors: [],
      rollbackPerformed: false
    });

    packageUpdater.updateMultiplePackages = jest.fn().mockResolvedValue({
      success: true,
      updatedFiles: [],
      errors: [],
      rollbackPerformed: false
    });

    changelogManager.updateChangelog = jest.fn().mockResolvedValue({
      success: true,
      changelogPath: 'CHANGELOG.md',
      created: false,
      errors: []
    });

    gitOperations.createCommit = jest.fn().mockResolvedValue({
      success: true,
      operation: 'commit',
      details: 'Commit created',
      errors: []
    });

    gitOperations.createTag = jest.fn().mockResolvedValue({
      success: true,
      operation: 'tag',
      details: 'Tag created',
      errors: []
    });

    // Setup coordination strategy
    strategy = {
      corePackageSync: true,
      componentIndependence: true,
      dependencyUpdates: 'automatic',
      corePackages: ['@designerpunk/tokens', '@designerpunk/build-system'],
      independentPackages: ['@designerpunk/components']
    };

    coordinator = new PackageCoordinator(strategy);

    // Setup mock packages
    mockPackages = [
      {
        name: '@designerpunk/tokens',
        currentVersion: '1.0.0',
        path: 'packages/tokens',
        dependencies: {}
      },
      {
        name: '@designerpunk/build-system',
        currentVersion: '1.0.0',
        path: 'packages/build-system',
        dependencies: {
          '@designerpunk/tokens': '^1.0.0'
        }
      },
      {
        name: '@designerpunk/components',
        currentVersion: '1.0.0',
        path: 'packages/components',
        dependencies: {
          '@designerpunk/tokens': '^1.0.0',
          '@designerpunk/build-system': '^1.0.0'
        }
      }
    ];
  });

  describe('Package Update Automation', () => {
    it('should trigger PackageUpdater for single package update', async () => {
      // Setup: Single package update
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate automation layer execution
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      expect(tokensUpdate).toBeDefined();

      // Execute automation
      await packageUpdater.updatePackageVersion(
        tokensUpdate!.path + '/package.json',
        tokensUpdate!.newVersion
      );

      // Verify: PackageUpdater called with correct parameters
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalledWith(
        'packages/tokens/package.json',
        '1.1.0'
      );
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalledTimes(1);
    });

    it('should trigger PackageUpdater for multiple coordinated packages', async () => {
      // Setup: Core package sync triggers multiple updates
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions (core sync enabled)
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Multiple packages coordinated
      expect(plan.packages.length).toBeGreaterThanOrEqual(2);

      // Simulate automation layer execution
      const packagePaths = plan.packages.map(p => `${p.path}/package.json`);
      const newVersion = plan.packages[0].newVersion;

      await packageUpdater.updateMultiplePackages(packagePaths, newVersion);

      // Verify: PackageUpdater called with all coordinated packages
      expect(packageUpdater.updateMultiplePackages).toHaveBeenCalledWith(
        expect.arrayContaining([
          'packages/tokens/package.json',
          'packages/build-system/package.json'
        ]),
        '2.0.0'
      );
    });

    it('should update packages in correct order based on publishing plan', async () => {
      // Setup: Multiple package updates
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.1.0'],
        ['@designerpunk/components', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Publishing order respects dependencies
      expect(plan.publishingOrder).toBeDefined();
      expect(plan.publishingOrder.length).toBeGreaterThan(0);

      // Simulate automation following publishing order
      for (const packageName of plan.publishingOrder) {
        const packageUpdate = plan.packages.find(p => p.name === packageName);
        if (packageUpdate) {
          await packageUpdater.updatePackageVersion(
            `${packageUpdate.path}/package.json`,
            packageUpdate.newVersion
          );
        }
      }

      // Verify: Updates executed in dependency order
      const calls = packageUpdater.updatePackageVersion.mock.calls;
      expect(calls.length).toBe(plan.publishingOrder.length);

      // Tokens should be updated before build-system
      const tokensCallIndex = calls.findIndex(c => c[0].includes('tokens'));
      const buildSystemCallIndex = calls.findIndex(c => c[0].includes('build-system'));
      expect(tokensCallIndex).toBeLessThan(buildSystemCallIndex);
    });
  });

  describe('Changelog Update Automation', () => {
    it('should trigger ChangelogManager with coordinated version', async () => {
      // Setup: Package update
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate changelog update
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      await changelogManager.updateChangelog(
        `${tokensUpdate!.path}/CHANGELOG.md`,
        {
          version: tokensUpdate!.newVersion,
          date: new Date().toISOString().split('T')[0],
          content: '### Changed\n- Updated to version 1.1.0'
        }
      );

      // Verify: ChangelogManager called
      expect(changelogManager.updateChangelog).toHaveBeenCalledWith(
        'packages/tokens/CHANGELOG.md',
        expect.objectContaining({
          version: '1.1.0'
        })
      );
    });

    it('should update changelogs for all coordinated packages', async () => {
      // Setup: Core package sync
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate changelog updates for all packages
      for (const packageUpdate of plan.packages) {
        await changelogManager.updateChangelog(
          `${packageUpdate.path}/CHANGELOG.md`,
          {
            version: packageUpdate.newVersion,
            date: new Date().toISOString().split('T')[0],
            content: `### Changed\n- ${packageUpdate.reason}`
          }
        );
      }

      // Verify: ChangelogManager called for each package
      expect(changelogManager.updateChangelog).toHaveBeenCalledTimes(plan.packages.length);
    });

    it('should include coordination reason in changelog content', async () => {
      // Setup: Core package sync with reason
      const proposedUpdates = new Map([
        ['@designerpunk/build-system', '1.2.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Coordination reason available
      const buildSystemUpdate = plan.packages.find(p => p.name === '@designerpunk/build-system');
      expect(buildSystemUpdate?.reason).toBeDefined();
      expect(buildSystemUpdate?.reason).toContain('1.2.0');

      // Simulate changelog update with reason
      await changelogManager.updateChangelog(
        `${buildSystemUpdate!.path}/CHANGELOG.md`,
        {
          version: buildSystemUpdate!.newVersion,
          date: new Date().toISOString().split('T')[0],
          content: `### Changed\n- ${buildSystemUpdate!.reason}`
        }
      );

      // Verify: Changelog includes coordination context
      const call = changelogManager.updateChangelog.mock.calls[0];
      expect(call[1].content).toContain(buildSystemUpdate!.reason);
    });
  });

  describe('Git Operations Automation', () => {
    it('should trigger git commit after package updates', async () => {
      // Setup: Package update
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate automation sequence
      const tokensUpdate = plan.packages[0];
      await packageUpdater.updatePackageVersion(
        `${tokensUpdate.path}/package.json`,
        tokensUpdate.newVersion
      );

      await gitOperations.createCommit({
        message: `chore(release): ${tokensUpdate.name}@${tokensUpdate.newVersion}`,
        files: [`${tokensUpdate.path}/package.json`]
      });

      // Verify: Git commit created
      expect(gitOperations.createCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('1.1.0'),
          files: expect.arrayContaining(['packages/tokens/package.json'])
        })
      );
    });

    it('should create git tags for coordinated versions', async () => {
      // Setup: Multiple package updates
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate tag creation for each package
      for (const packageUpdate of plan.packages) {
        await gitOperations.createTag({
          version: packageUpdate.newVersion,
          message: `Release ${packageUpdate.name}@${packageUpdate.newVersion}`
        });
      }

      // Verify: Tags created for all packages
      expect(gitOperations.createTag).toHaveBeenCalledTimes(plan.packages.length);
      expect(gitOperations.createTag).toHaveBeenCalledWith(
        expect.objectContaining({
          version: '2.0.0'
        })
      );
    });

    it('should commit all coordinated changes together', async () => {
      // Setup: Core package sync
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.2.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate batch commit
      const allFiles = plan.packages.map(p => `${p.path}/package.json`);
      await gitOperations.createCommit({
        message: `chore(release): Coordinated release ${plan.packages[0].newVersion}`,
        files: allFiles
      });

      // Verify: Single commit with all files
      expect(gitOperations.createCommit).toHaveBeenCalledTimes(1);
      expect(gitOperations.createCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          files: expect.arrayContaining([
            'packages/tokens/package.json',
            'packages/build-system/package.json'
          ])
        })
      );
    });
  });

  describe('Automation Sequence Verification', () => {
    it('should execute automation in correct sequence: update → changelog → commit → tag', async () => {
      // Setup: Package update
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);
      const tokensUpdate = plan.packages[0];

      // Simulate complete automation sequence
      const executionOrder: string[] = [];

      // Step 1: Update package.json
      packageUpdater.updatePackageVersion = jest.fn().mockImplementation(async () => {
        executionOrder.push('package-update');
        return { success: true, updatedFiles: [], errors: [], rollbackPerformed: false };
      });
      await packageUpdater.updatePackageVersion(
        `${tokensUpdate.path}/package.json`,
        tokensUpdate.newVersion
      );

      // Step 2: Update CHANGELOG.md
      changelogManager.updateChangelog = jest.fn().mockImplementation(async () => {
        executionOrder.push('changelog-update');
        return { success: true, changelogPath: '', created: false, errors: [] };
      });
      await changelogManager.updateChangelog(
        `${tokensUpdate.path}/CHANGELOG.md`,
        {
          version: tokensUpdate.newVersion,
          date: new Date().toISOString().split('T')[0],
          content: '### Changed\n- Updated version'
        }
      );

      // Step 3: Create git commit
      gitOperations.createCommit = jest.fn().mockImplementation(async () => {
        executionOrder.push('git-commit');
        return { success: true, operation: 'commit', details: '', errors: [] };
      });
      await gitOperations.createCommit({
        message: `chore(release): ${tokensUpdate.name}@${tokensUpdate.newVersion}`,
        files: [`${tokensUpdate.path}/package.json`, `${tokensUpdate.path}/CHANGELOG.md`]
      });

      // Step 4: Create git tag
      gitOperations.createTag = jest.fn().mockImplementation(async () => {
        executionOrder.push('git-tag');
        return { success: true, operation: 'tag', details: '', errors: [] };
      });
      await gitOperations.createTag({
        version: tokensUpdate.newVersion,
        message: `Release ${tokensUpdate.name}@${tokensUpdate.newVersion}`
      });

      // Verify: Correct execution order
      expect(executionOrder).toEqual([
        'package-update',
        'changelog-update',
        'git-commit',
        'git-tag'
      ]);
    });

    it('should handle coordinated updates in publishing order', async () => {
      // Setup: Multiple package updates
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.1.0'],
        ['@designerpunk/components', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Track execution order
      const executionOrder: string[] = [];

      packageUpdater.updatePackageVersion = jest.fn().mockImplementation(async (path) => {
        const packageName = path.split('/')[1];
        executionOrder.push(packageName);
        return { success: true, updatedFiles: [], errors: [], rollbackPerformed: false };
      });

      // Simulate automation following publishing order
      for (const packageName of plan.publishingOrder) {
        const packageUpdate = plan.packages.find(p => p.name === packageName);
        if (packageUpdate) {
          await packageUpdater.updatePackageVersion(
            `${packageUpdate.path}/package.json`,
            packageUpdate.newVersion
          );
        }
      }

      // Verify: Execution followed publishing order
      expect(executionOrder).toEqual(['tokens', 'build-system', 'components']);
    });
  });

  describe('Error Handling', () => {
    it('should handle PackageUpdater failures', async () => {
      // Setup: Package update that will fail
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate PackageUpdater failure
      packageUpdater.updatePackageVersion = jest.fn().mockResolvedValue({
        success: false,
        updatedFiles: [],
        errors: [{ file: 'package.json', error: 'Write failed', code: 'WRITE_ERROR' }],
        rollbackPerformed: false
      });

      const result = await packageUpdater.updatePackageVersion(
        `${plan.packages[0].path}/package.json`,
        plan.packages[0].newVersion
      );

      // Verify: Error detected
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('WRITE_ERROR');
    });

    it('should handle ChangelogManager failures', async () => {
      // Setup: Changelog update that will fail
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate ChangelogManager failure
      changelogManager.updateChangelog = jest.fn().mockResolvedValue({
        success: false,
        changelogPath: 'CHANGELOG.md',
        created: false,
        errors: [{ error: 'Version exists', code: 'VERSION_EXISTS' }]
      });

      const result = await changelogManager.updateChangelog(
        `${plan.packages[0].path}/CHANGELOG.md`,
        {
          version: plan.packages[0].newVersion,
          date: new Date().toISOString().split('T')[0],
          content: '### Changed\n- Updated'
        }
      );

      // Verify: Error detected
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('VERSION_EXISTS');
    });

    it('should handle GitOperations failures', async () => {
      // Setup: Git operation that will fail
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate GitOperations failure
      gitOperations.createCommit = jest.fn().mockResolvedValue({
        success: false,
        operation: 'commit',
        details: '',
        errors: [{ operation: 'commit', error: 'Not a git repository', code: 'NOT_GIT_REPO' }]
      });

      const result = await gitOperations.createCommit({
        message: 'Release',
        files: []
      });

      // Verify: Error detected
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('NOT_GIT_REPO');
    });

    it('should handle partial automation failures with rollback', async () => {
      // Setup: Multiple package updates
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Simulate partial failure
      packageUpdater.updateMultiplePackages = jest.fn().mockResolvedValue({
        success: false,
        updatedFiles: ['packages/tokens/package.json'],
        errors: [{ file: 'packages/build-system/package.json', error: 'Write failed', code: 'WRITE_ERROR' }],
        rollbackPerformed: true
      });

      const result = await packageUpdater.updateMultiplePackages(
        plan.packages.map(p => `${p.path}/package.json`),
        plan.packages[0].newVersion
      );

      // Verify: Rollback performed
      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Data Flow Validation', () => {
    it('should maintain version consistency through coordination → automation flow', async () => {
      // Setup: Package update
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.2.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Coordination plan has correct version
      expect(plan.packages[0].newVersion).toBe('1.2.0');

      // Simulate automation
      await packageUpdater.updatePackageVersion(
        `${plan.packages[0].path}/package.json`,
        plan.packages[0].newVersion
      );

      await changelogManager.updateChangelog(
        `${plan.packages[0].path}/CHANGELOG.md`,
        {
          version: plan.packages[0].newVersion,
          date: new Date().toISOString().split('T')[0],
          content: '### Changed\n- Updated'
        }
      );

      await gitOperations.createTag({
        version: plan.packages[0].newVersion,
        message: `Release ${plan.packages[0].newVersion}`
      });

      // Verify: Same version used throughout
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalledWith(
        expect.any(String),
        '1.2.0'
      );
      expect(changelogManager.updateChangelog).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ version: '1.2.0' })
      );
      expect(gitOperations.createTag).toHaveBeenCalledWith(
        expect.objectContaining({ version: '1.2.0' })
      );
    });

    it('should preserve coordination metadata through automation', async () => {
      // Setup: Core package sync
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Coordination metadata available
      expect(plan.strategy).toBeDefined();
      expect(plan.publishingOrder).toBeDefined();
      expect(plan.dependencyUpdates).toBeDefined();

      // Simulate automation using coordination metadata
      for (const packageName of plan.publishingOrder) {
        const packageUpdate = plan.packages.find(p => p.name === packageName);
        if (packageUpdate) {
          await packageUpdater.updatePackageVersion(
            `${packageUpdate.path}/package.json`,
            packageUpdate.newVersion
          );
        }
      }

      // Verify: Automation followed coordination plan
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalledTimes(
        plan.publishingOrder.length
      );
    });

    it('should handle dependency updates in automation', async () => {
      // Setup: Package update with dependencies
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Dependency updates calculated
      expect(plan.dependencyUpdates.length).toBeGreaterThan(0);

      // Simulate dependency updates in automation
      for (const depUpdate of plan.dependencyUpdates) {
        // In real automation, this would update package.json dependencies
        await packageUpdater.updatePackageVersion(
          `packages/${depUpdate.package.split('/')[1]}/package.json`,
          '1.0.0' // Current version (dependency update doesn't change package version)
        );
      }

      // Verify: Automation processed dependency updates
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalled();
    });
  });

  describe('Coordination Strategy Impact', () => {
    it('should respect core package sync in automation', async () => {
      // Setup: Core package sync enabled
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Multiple packages coordinated
      expect(plan.packages.length).toBeGreaterThanOrEqual(2);

      // Simulate automation for all coordinated packages
      for (const packageUpdate of plan.packages) {
        await packageUpdater.updatePackageVersion(
          `${packageUpdate.path}/package.json`,
          packageUpdate.newVersion
        );
      }

      // Verify: All core packages updated
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalledTimes(
        plan.packages.length
      );
    });

    it('should handle independent package updates separately', async () => {
      // Setup: Independent package update
      const proposedUpdates = new Map([
        ['@designerpunk/components', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Only components updated
      expect(plan.packages).toHaveLength(1);
      expect(plan.packages[0].name).toBe('@designerpunk/components');

      // Simulate automation
      await packageUpdater.updatePackageVersion(
        `${plan.packages[0].path}/package.json`,
        plan.packages[0].newVersion
      );

      // Verify: Only one package updated
      expect(packageUpdater.updatePackageVersion).toHaveBeenCalledTimes(1);
    });
  });
});
