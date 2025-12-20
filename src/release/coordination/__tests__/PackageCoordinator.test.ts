/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * PackageCoordinator Tests
 * 
 * Tests for multi-package version coordination and dependency management.
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real coordination logic
 * - Focus on coordination algorithms: Tests validate version synchronization and strategy application
 * - Pure logic testing: No file system or external dependencies
 */

import { PackageCoordinator } from '../PackageCoordinator';
import {
  PackageVersion,
  CoordinationStrategy,
  PackageUpdate
} from '../types';

describe('PackageCoordinator', () => {
  describe('coordinateVersions', () => {
    it('should coordinate versions across multiple packages', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
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
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.0.1']
      ]);

      const plan = coordinator.coordinateVersions(packages, proposedUpdates);

      expect(plan.packages).toHaveLength(2);
      expect(plan.packages[0].newVersion).toBe('1.1.0');
      expect(plan.packages[1].newVersion).toBe('1.0.1');
      expect(plan.dependencyUpdates).toHaveLength(1);
      expect(plan.dependencyUpdates[0].newVersion).toBe('^1.1.0');
    });

    it('should synchronize core packages when enabled', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: true,
        componentIndependence: true,
        dependencyUpdates: 'automatic',
        corePackages: ['@designerpunk/tokens', '@designerpunk/build-system']
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system'
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.0.1']
      ]);

      const plan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Both core packages should be synchronized to highest version
      expect(plan.packages).toHaveLength(2);
      expect(plan.packages[0].newVersion).toBe('1.1.0');
      expect(plan.packages[1].newVersion).toBe('1.1.0');
    });

    it('should allow independent versioning for component packages', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: true,
        componentIndependence: true,
        dependencyUpdates: 'automatic',
        corePackages: ['@designerpunk/tokens', '@designerpunk/build-system'],
        independentPackages: ['@designerpunk/components']
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
        },
        {
          name: '@designerpunk/components',
          currentVersion: '2.0.0',
          path: './packages/components'
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/components', '2.1.0']
      ]);

      const plan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Component package should maintain independent version
      expect(plan.packages).toHaveLength(2);
      expect(plan.packages[0].newVersion).toBe('1.1.0');
      expect(plan.packages[1].newVersion).toBe('2.1.0');
    });

    it('should detect version conflicts', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
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

      const plan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Should detect incompatible version
      expect(plan.conflicts.length).toBeGreaterThan(0);
      expect(plan.conflicts[0].conflictType).toBe('incompatible');
    });

    it('should generate correct publishing order', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
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
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.1.0'],
        ['@designerpunk/components', '1.1.0']
      ]);

      const plan = coordinator.coordinateVersions(packages, proposedUpdates);

      // Tokens should be first, components should be last
      expect(plan.publishingOrder[0]).toBe('@designerpunk/tokens');
      expect(plan.publishingOrder[plan.publishingOrder.length - 1]).toBe('@designerpunk/components');
    });
  });

  describe('validatePackageCompatibility', () => {
    it('should validate compatible packages', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
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

      const report = coordinator.validatePackageCompatibility(packages);

      expect(report.compatible).toBe(true);
      expect(report.issues).toHaveLength(0);
    });

    it('should detect incompatible versions', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '2.0.0',
          path: './packages/tokens'
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0' // Incompatible with 2.0.0
          }
        }
      ];

      const report = coordinator.validatePackageCompatibility(packages);

      expect(report.compatible).toBe(false);
      expect(report.issues.length).toBeGreaterThan(0);
      expect(report.issues[0].severity).toBe('error');
    });

    it('should detect circular dependencies', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

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

      const report = coordinator.validatePackageCompatibility(packages);

      expect(report.compatible).toBe(false);
      expect(report.issues.length).toBeGreaterThan(0);
      expect(report.issues[0].description).toContain('Circular dependency');
    });

    it('should warn about missing dependencies', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0' // Not in package list
          }
        }
      ];

      const report = coordinator.validatePackageCompatibility(packages);

      expect(report.warnings.length).toBeGreaterThan(0);
      expect(report.warnings[0].message).toContain('not found');
    });
  });

  describe('generatePublishingOrder', () => {
    it('should generate correct publishing order based on dependencies', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0',
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
        },
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
        }
      ];

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New features'
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/build-system',
          bumpType: 'minor',
          reason: 'New features'
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/components',
          bumpType: 'minor',
          reason: 'New features'
        }
      ];

      const order = coordinator.generatePublishingOrder(packages, updates);

      // Tokens should be first (no dependencies)
      expect(order[0]).toBe('@designerpunk/tokens');
      
      // Build-system should be before components (components depends on it)
      const buildSystemIndex = order.indexOf('@designerpunk/build-system');
      const componentsIndex = order.indexOf('@designerpunk/components');
      expect(buildSystemIndex).toBeLessThan(componentsIndex);
    });

    it('should only include packages being updated', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
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

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New features'
        }
      ];

      const order = coordinator.generatePublishingOrder(packages, updates);

      // Only tokens should be in the order (build-system not being updated)
      expect(order).toHaveLength(1);
      expect(order[0]).toBe('@designerpunk/tokens');
    });
  });

  describe('updateDependencies', () => {
    it('should return dependency updates from coordination plan', () => {
      const strategy: CoordinationStrategy = {
        corePackageSync: false,
        componentIndependence: true,
        dependencyUpdates: 'automatic'
      };

      const coordinator = new PackageCoordinator(strategy);

      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
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
        ['@designerpunk/tokens', '1.1.0']
      ]);

      const plan = coordinator.coordinateVersions(packages, proposedUpdates);
      const dependencyUpdates = coordinator.updateDependencies(plan);

      expect(dependencyUpdates).toHaveLength(1);
      expect(dependencyUpdates[0].package).toBe('@designerpunk/build-system');
      expect(dependencyUpdates[0].dependency).toBe('@designerpunk/tokens');
      expect(dependencyUpdates[0].newVersion).toBe('^1.1.0');
    });
  });
});
