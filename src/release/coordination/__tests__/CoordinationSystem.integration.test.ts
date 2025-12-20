/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Coordination System Integration Tests
 * 
 * Tests for end-to-end coordination system functionality including:
 * - Package version coordination across different scenarios
 * - Dependency management and conflict resolution
 * - Publishing order optimization and failure recovery
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real coordination system components
 * - Integration focus: Tests validate PackageCoordinator + DependencyManager + PublishingPlanner
 * - Pure logic testing: No file system or external dependencies
 * 
 * Requirements:
 * - 4.1: Core package synchronization
 * - 4.2: Component package independence
 * - 4.3: Dependency relationship management
 * - 4.4: Version conflict resolution
 * - 4.5: Publishing order coordination and failure recovery
 * 
 * Jest Matcher Usage Pattern:
 * - Use toContain() for exact element matches: expect(array).toContain('exact-string')
 * - Use array.some() for substring matching: expect(array.some(s => s.includes('substring'))).toBe(true)
 * - Use expect.arrayContaining() with expect.stringContaining() for pattern matching
 */

import { PackageCoordinator } from '../PackageCoordinator';
import { DependencyManager } from '../DependencyManager';
import { PublishingPlanner } from '../PublishingPlanner';
import {
  PackageVersion,
  CoordinationStrategy,
  PackageUpdate
} from '../types';

describe('Coordination System Integration', () => {
  describe('End-to-End Package Coordination', () => {
    it('should coordinate versions, manage dependencies, and generate publishing plan', () => {
      // Requirements: 4.1, 4.2, 4.3, 4.5
      const strategy: CoordinationStrategy = {
        corePackageSync: true,
        componentIndependence: true,
        dependencyUpdates: 'automatic',
        corePackages: ['@designerpunk/tokens', '@designerpunk/build-system'],
        independentPackages: ['@designerpunk/components']
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/components',
          currentVersion: '2.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/build-system': '^1.0.0'
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.0.1'],
        ['@designerpunk/components', '2.1.0']
      ]);

      // Step 1: Coordinate versions
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Verify core packages are synchronized
      const tokensUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/tokens');
      const buildSystemUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/build-system');
      expect(tokensUpdate?.newVersion).toBe('1.1.0');
      expect(buildSystemUpdate?.newVersion).toBe('1.1.0'); // Synchronized to highest

      // Verify component package maintains independence
      const componentsUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/components');
      expect(componentsUpdate?.newVersion).toBe('2.1.0');

      // Verify dependency updates are calculated
      expect(coordinationPlan.dependencyUpdates.length).toBeGreaterThan(0);

      // Step 2: Validate compatibility
      const compatibilityReport = dependencyManager.validateCompatibility(
        packages,
        coordinationPlan.packages
      );
      expect(compatibilityReport.compatible).toBe(true);

      // Step 3: Generate publishing plan
      const publishingPlan = publishingPlanner.generatePublishingPlan(
        packages,
        coordinationPlan.packages
      );

      // Verify publishing order respects dependencies
      expect(publishingPlan.totalPackages).toBe(3);
      expect(publishingPlan.order[0]).toContain('@designerpunk/tokens');
      
      const lastLevel = publishingPlan.order[publishingPlan.order.length - 1];
      expect(lastLevel).toContain('@designerpunk/components');
    });

    it('should handle major version bumps with dependency conflicts', () => {
      // Requirements: 4.3, 4.4
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0'] // Major version bump
      ]);

      // Step 1: Coordinate versions
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Step 2: Detect conflicts
      expect(coordinationPlan.conflicts.length).toBeGreaterThan(0);
      const incompatibleConflict = coordinationPlan.conflicts.find(
        c => c.conflictType === 'incompatible'
      );
      expect(incompatibleConflict).toBeDefined();
      expect(incompatibleConflict?.affectedPackages).toContain('@designerpunk/build-system');

      // Step 3: Resolve conflicts
      const resolutions = dependencyManager.resolveConflicts(
        coordinationPlan.conflicts,
        packages
      );

      const resolution = resolutions.find(r => r.conflict.conflictType === 'incompatible');
      expect(resolution?.strategy).toBe('update-dependent');
      expect(resolution?.suggestedActions.length).toBeGreaterThan(0);
    });

    it('should handle circular dependency detection and resolution', () => {
      // Requirements: 4.4
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {
            '@designerpunk/build-system': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      // Step 1: Validate compatibility
      const compatibilityReport = coordinator.validatePackageCompatibility(packages);

      expect(compatibilityReport.compatible).toBe(false);
      expect(compatibilityReport.issues.length).toBeGreaterThan(0);

      const circularIssue = compatibilityReport.issues.find(
        i => i.description.includes('Circular dependency')
      );
      expect(circularIssue).toBeDefined();

      // Step 2: Analyze dependency graph
      const analysis = dependencyManager.analyzeDependencyGraph(packages);
      expect(analysis.circularDependencies.length).toBeGreaterThan(0);

      // Step 3: Get resolution strategy
      const proposedUpdates = new Map<string, string>();
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);
      const resolutions = dependencyManager.resolveConflicts(
        coordinationPlan.conflicts,
        packages
      );

      const circularResolution = resolutions.find(
        r => r.conflict.conflictType === 'circular'
      );
      expect(circularResolution?.strategy).toBe('manual');
      // Correct matcher usage: Use array.some() for substring matching in array elements
      // toContain() only works for exact element matches, not substring matching
      expect(circularResolution?.suggestedActions.some(s => s.includes('Review package architecture'))).toBe(true);
    });
  });

  describe('Publishing Order Optimization', () => {
    it('should optimize publishing order for complex dependency graph', () => {
      // Requirements: 4.5
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/utils',
          currentVersion: '1.0.0',
          path: './packages/utils',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/utils': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/build-system': '^1.0.0'
          }
        }
      ];

      const updates: PackageUpdate[] = packages.map(pkg => ({
        name: pkg.name,
        currentVersion: pkg.currentVersion,
        newVersion: '1.1.0',
        path: pkg.path,
        bumpType: 'minor' as const,
        reason: 'Updates'
      }));

      // Step 1: Generate publishing plan
      const publishingPlan = publishingPlanner.generatePublishingPlan(packages, updates);

      // Step 2: Verify dependency levels
      expect(publishingPlan.order.length).toBeGreaterThan(2);
      expect(publishingPlan.order[0]).toContain('@designerpunk/tokens');

      // Step 3: Validate publishing order
      const flatOrder = publishingPlan.order.flat();
      const conflicts = publishingPlanner.validatePublishingOrder(packages, flatOrder);
      expect(conflicts).toEqual([]);

      // Step 4: Generate detailed stages
      const stages = publishingPlanner.generatePublishingStages(packages, updates);
      expect(stages.length).toBe(publishingPlan.order.length);

      // Verify each stage has correct dependencies
      for (let i = 1; i < stages.length; i++) {
        expect(stages[i].dependencies.length).toBeGreaterThan(0);
      }
    });

    it('should handle parallel publishable packages correctly', () => {
      // Requirements: 4.5
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/utils',
          currentVersion: '1.0.0',
          path: './packages/utils',
          dependencies: {}
        },
        {
          name: '@designerpunk/icons',
          currentVersion: '1.0.0',
          path: './packages/icons',
          dependencies: {}
        }
      ];

      const updates: PackageUpdate[] = packages.map(pkg => ({
        name: pkg.name,
        currentVersion: pkg.currentVersion,
        newVersion: '1.1.0',
        path: pkg.path,
        bumpType: 'minor' as const,
        reason: 'Updates'
      }));

      const publishingPlan = publishingPlanner.generatePublishingPlan(packages, updates);

      // All packages should be in the same level (parallel publishable)
      expect(publishingPlan.order.length).toBe(1);
      expect(publishingPlan.order[0]).toHaveLength(3);
      expect(publishingPlan.order[0]).toContain('@designerpunk/tokens');
      expect(publishingPlan.order[0]).toContain('@designerpunk/utils');
      expect(publishingPlan.order[0]).toContain('@designerpunk/icons');
    });
  });

  describe('Staged Publishing with Failure Recovery', () => {
    it('should execute staged publishing and rollback on failure', async () => {
      // Requirements: 4.5
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const stages = [
        {
          stage: 0,
          packages: ['@designerpunk/tokens'],
          dependencies: [],
          estimatedDuration: 30
        },
        {
          stage: 1,
          packages: ['@designerpunk/build-system'],
          dependencies: ['@designerpunk/tokens'],
          estimatedDuration: 30
        },
        {
          stage: 2,
          packages: ['@designerpunk/components'],
          dependencies: ['@designerpunk/tokens', '@designerpunk/build-system'],
          estimatedDuration: 30
        }
      ];

      const publishedPackages: string[] = [];
      const publishFn = async (packageName: string) => {
        publishedPackages.push(packageName);
        if (packageName === '@designerpunk/build-system') {
          throw new Error('Publishing failed');
        }
      };

      // Step 1: Execute staged publishing (should fail at stage 1)
      const result = await publishingPlanner.executeStagedPublishing(stages, publishFn, {
        retry: { maxAttempts: 1, initialDelay: 10, backoffMultiplier: 1, maxDelay: 10 }
      });

      expect(result.success).toBe(false);
      expect(result.completedStages).toBe(1); // Only stage 0 completed
      expect(result.failedPackages).toContain('@designerpunk/build-system');
      expect(publishedPackages).toContain('@designerpunk/tokens');
      expect(publishedPackages).not.toContain('@designerpunk/components');

      // Step 2: Rollback published packages
      const successfullyPublished = result.packageResults
        .filter(r => r.success)
        .map(r => r.package);

      const rolledBackPackages: string[] = [];
      const rollbackFn = async (packageName: string) => {
        rolledBackPackages.push(packageName);
      };

      const rollbackResult = await publishingPlanner.rollbackPublishing(
        successfullyPublished,
        rollbackFn
      );

      expect(rollbackResult.success).toBe(true);
      expect(rollbackResult.rolledBackPackages).toContain('@designerpunk/tokens');
      expect(rollbackResult.failedRollbacks).toEqual([]);
    });

    it('should retry failed packages with exponential backoff', async () => {
      // Requirements: 4.5
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      let attempts = 0;
      const publishFn = async (packageName: string) => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
      };

      const result = await publishingPlanner.retryPackagePublishing(
        '@designerpunk/tokens',
        publishFn,
        { maxAttempts: 3, initialDelay: 10, backoffMultiplier: 2, maxDelay: 100 }
      );

      expect(result.success).toBe(true);
      expect(attempts).toBe(3);
    });

    it('should handle partial rollback failures', async () => {
      // Requirements: 4.5
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const publishedPackages = [
        '@designerpunk/tokens',
        '@designerpunk/build-system',
        '@designerpunk/components'
      ];

      const rollbackFn = async (packageName: string) => {
        if (packageName === '@designerpunk/build-system') {
          throw new Error('Rollback failed');
        }
      };

      const rollbackResult = await publishingPlanner.rollbackPublishing(
        publishedPackages,
        rollbackFn
      );

      expect(rollbackResult.success).toBe(false);
      expect(rollbackResult.rolledBackPackages).toContain('@designerpunk/components');
      expect(rollbackResult.rolledBackPackages).toContain('@designerpunk/tokens');
      expect(rollbackResult.failedRollbacks).toContain('@designerpunk/build-system');
      expect(rollbackResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Multi-Package Coordination Scenarios', () => {
    it('should handle monorepo with mixed update types', () => {
      // Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
      const strategy: CoordinationStrategy = {
        corePackageSync: true,
        componentIndependence: true,
        dependencyUpdates: 'automatic',
        corePackages: ['@designerpunk/tokens', '@designerpunk/build-system'],
        independentPackages: ['@designerpunk/components', '@designerpunk/icons']
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/components',
          currentVersion: '2.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/build-system': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/icons',
          currentVersion: '3.0.0',
          path: './packages/icons',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.2.0'],      // Minor bump
        ['@designerpunk/build-system', '1.0.1'], // Patch bump
        ['@designerpunk/components', '2.1.0'],   // Minor bump (independent)
        ['@designerpunk/icons', '3.0.1']         // Patch bump (independent)
      ]);

      // Step 1: Coordinate versions
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Verify core packages are synchronized to highest version
      const tokensUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/tokens');
      const buildSystemUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/build-system');
      expect(tokensUpdate?.newVersion).toBe('1.2.0');
      expect(buildSystemUpdate?.newVersion).toBe('1.2.0'); // Synchronized

      // Verify independent packages maintain their versions
      const componentsUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/components');
      const iconsUpdate = coordinationPlan.packages.find(p => p.name === '@designerpunk/icons');
      expect(componentsUpdate?.newVersion).toBe('2.1.0');
      expect(iconsUpdate?.newVersion).toBe('3.0.1');

      // Step 2: Validate compatibility
      const compatibilityReport = dependencyManager.validateCompatibility(
        packages,
        coordinationPlan.packages
      );
      expect(compatibilityReport.compatible).toBe(true);

      // Step 3: Generate publishing plan
      const publishingPlan = publishingPlanner.generatePublishingPlan(
        packages,
        coordinationPlan.packages
      );

      // Verify tokens is published first
      expect(publishingPlan.order[0]).toContain('@designerpunk/tokens');

      // Verify components and icons are published after their dependencies
      const flatOrder = publishingPlan.order.flat();
      const tokensIndex = flatOrder.indexOf('@designerpunk/tokens');
      const componentsIndex = flatOrder.indexOf('@designerpunk/components');
      const iconsIndex = flatOrder.indexOf('@designerpunk/icons');
      expect(tokensIndex).toBeLessThan(componentsIndex);
      expect(tokensIndex).toBeLessThan(iconsIndex);
    });

    it('should handle no updates scenario', () => {
      // Requirements: 4.1, 4.2, 4.3
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        }
      ];

      const proposedUpdates = new Map<string, string>();

      // Step 1: Coordinate versions (no updates)
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);
      expect(coordinationPlan.packages).toHaveLength(0);

      // Step 2: Validate compatibility (should still work)
      const compatibilityReport = dependencyManager.validateCompatibility(packages);
      expect(compatibilityReport.compatible).toBe(true);

      // Step 3: Generate publishing plan (empty)
      const publishingPlan = publishingPlanner.generatePublishingPlan(
        packages,
        coordinationPlan.packages
      );
      expect(publishingPlan.totalPackages).toBe(0);
      expect(publishingPlan.order).toEqual([]);
    });

    it('should handle selective package updates', () => {
      // Requirements: 4.1, 4.2, 4.3, 4.5
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();
      const publishingPlanner = new PublishingPlanner(dependencyManager);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/build-system': '^1.0.0'
          }
        }
      ];

      // Only update tokens
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Step 1: Coordinate versions
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);
      expect(coordinationPlan.packages).toHaveLength(1);
      expect(coordinationPlan.packages[0].name).toBe('@designerpunk/tokens');

      // Step 2: Verify dependency updates are calculated for dependent packages
      expect(coordinationPlan.dependencyUpdates.length).toBeGreaterThan(0);
      const buildSystemDepUpdate = coordinationPlan.dependencyUpdates.find(
        d => d.package === '@designerpunk/build-system' && d.dependency === '@designerpunk/tokens'
      );
      expect(buildSystemDepUpdate).toBeDefined();
      expect(buildSystemDepUpdate?.newVersion).toBe('^1.1.0');

      // Step 3: Generate publishing plan (only tokens)
      const publishingPlan = publishingPlanner.generatePublishingPlan(
        packages,
        coordinationPlan.packages
      );
      expect(publishingPlan.totalPackages).toBe(1);
      expect(publishingPlan.order).toEqual([['@designerpunk/tokens']]);
    });
  });

  describe('Dependency Conflict Resolution', () => {
    it('should provide actionable resolution strategies for conflicts', () => {
      // Requirements: 4.4
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/build-system': '^1.0.0'
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0'] // Breaking change
      ]);

      // Step 1: Coordinate versions and detect conflicts
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);
      expect(coordinationPlan.conflicts.length).toBeGreaterThan(0);

      // Step 2: Resolve conflicts
      const resolutions = dependencyManager.resolveConflicts(
        coordinationPlan.conflicts,
        packages
      );

      // Verify each conflict has a resolution strategy
      expect(resolutions.length).toBe(coordinationPlan.conflicts.length);

      for (const resolution of resolutions) {
        expect(resolution.strategy).toBeDefined();
        expect(resolution.suggestedActions.length).toBeGreaterThan(0);

        // Verify suggested actions are actionable
        for (const action of resolution.suggestedActions) {
          expect(action.length).toBeGreaterThan(0);
          expect(typeof action).toBe('string');
        }
      }
    });

    it('should handle multiple simultaneous conflicts', () => {
      // Requirements: 4.4
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);
      const dependencyManager = new DependencyManager();

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {
            '@designerpunk/utils': '^1.0.0' // Circular dependency
          }
        },
        {
          name: '@designerpunk/utils',
          currentVersion: '1.0.0',
          path: './packages/utils',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0' // Circular dependency
          }
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
            '@designerpunk/missing': '^1.0.0' // Missing dependency
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0'] // Incompatible version
      ]);

      // Step 1: Detect all conflicts
      const coordinationPlan = coordinator.coordinateVersions(packages, proposedUpdates);
      const allConflicts = dependencyManager.detectConflicts(packages, coordinationPlan.packages);

      // Should detect circular, missing, and incompatible conflicts
      expect(allConflicts.length).toBeGreaterThan(2);
      expect(allConflicts.some(c => c.conflictType === 'circular')).toBe(true);
      expect(allConflicts.some(c => c.conflictType === 'missing')).toBe(true);
      expect(allConflicts.some(c => c.conflictType === 'incompatible')).toBe(true);

      // Step 2: Resolve all conflicts
      const resolutions = dependencyManager.resolveConflicts(allConflicts, packages);
      expect(resolutions.length).toBe(allConflicts.length);

      // Verify each conflict type has appropriate strategy
      const circularResolution = resolutions.find(r => r.conflict.conflictType === 'circular');
      expect(circularResolution?.strategy).toBe('manual');

      const missingResolution = resolutions.find(r => r.conflict.conflictType === 'missing');
      expect(missingResolution?.strategy).toBe('manual');

      const incompatibleResolution = resolutions.find(r => r.conflict.conflictType === 'incompatible');
      expect(incompatibleResolution?.strategy).toBe('update-dependent');
    });
  });
});
