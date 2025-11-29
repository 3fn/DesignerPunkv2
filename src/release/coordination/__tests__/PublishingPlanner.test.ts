/**
 * Publishing Planner Tests
 * 
 * Tests for publishing order optimization, staged publishing, and rollback capabilities.
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real publishing planning logic
 * - Focus on ordering algorithms: Tests validate dependency-aware publishing order
 * - Pure logic testing: No file system or external dependencies
 * 
 * Requirements:
 * - 4.5: Publishing order coordination
 * - 4.5: Staged publishing with rollback
 * - 4.5: Publishing failure recovery and retry logic
 */

import { PublishingPlanner } from '../PublishingPlanner';
import { DependencyManager } from '../DependencyManager';
import { PackageVersion, PackageUpdate } from '../types';

describe('PublishingPlanner', () => {
  let planner: PublishingPlanner;
  let dependencyManager: DependencyManager;

  beforeEach(() => {
    dependencyManager = new DependencyManager();
    planner = new PublishingPlanner(dependencyManager);
  });

  describe('generatePublishingPlan', () => {
    it('should generate publishing plan with correct order', () => {
      // Requirements: 4.5
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

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New tokens added'
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/build-system',
          bumpType: 'minor',
          reason: 'Build improvements'
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/components',
          bumpType: 'minor',
          reason: 'New components'
        }
      ];

      const plan = planner.generatePublishingPlan(packages, updates);

      expect(plan.totalPackages).toBe(3);
      expect(plan.order.length).toBeGreaterThan(0);
      expect(plan.estimatedDuration).toBeGreaterThan(0);

      // Verify tokens is published before build-system
      const tokensLevel = plan.order.findIndex(level => level.includes('@designerpunk/tokens'));
      const buildSystemLevel = plan.order.findIndex(level => level.includes('@designerpunk/build-system'));
      expect(tokensLevel).toBeLessThan(buildSystemLevel);

      // Verify build-system is published before components
      const componentsLevel = plan.order.findIndex(level => level.includes('@designerpunk/components'));
      expect(buildSystemLevel).toBeLessThan(componentsLevel);
    });

    it('should handle packages with no dependencies', () => {
      // Requirements: 4.5
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        }
      ];

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New tokens'
        }
      ];

      const plan = planner.generatePublishingPlan(packages, updates);

      expect(plan.totalPackages).toBe(1);
      expect(plan.order).toEqual([['@designerpunk/tokens']]);
    });

    it('should handle parallel publishable packages', () => {
      // Requirements: 4.5
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
        }
      ];

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New tokens'
        },
        {
          name: '@designerpunk/utils',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/utils',
          bumpType: 'minor',
          reason: 'New utilities'
        }
      ];

      const plan = planner.generatePublishingPlan(packages, updates);

      expect(plan.totalPackages).toBe(2);
      // Both packages should be in the same level since they have no dependencies
      expect(plan.order[0]).toContain('@designerpunk/tokens');
      expect(plan.order[0]).toContain('@designerpunk/utils');
    });
  });

  describe('generatePublishingStages', () => {
    it('should generate detailed publishing stages', () => {
      // Requirements: 4.5
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

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New tokens'
        },
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/build-system',
          bumpType: 'minor',
          reason: 'Build improvements'
        }
      ];

      const stages = planner.generatePublishingStages(packages, updates);

      expect(stages.length).toBeGreaterThan(0);
      expect(stages[0].stage).toBe(0);
      expect(stages[0].packages).toContain('@designerpunk/tokens');
      expect(stages[0].dependencies).toEqual([]);
      expect(stages[0].estimatedDuration).toBeGreaterThan(0);

      if (stages.length > 1) {
        expect(stages[1].dependencies).toContain('@designerpunk/tokens');
      }
    });
  });

  describe('executeStagedPublishing', () => {
    it('should execute staged publishing successfully', async () => {
      // Requirements: 4.5
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
        }
      ];

      const publishedPackages: string[] = [];
      const publishFn = async (packageName: string) => {
        publishedPackages.push(packageName);
      };

      const result = await planner.executeStagedPublishing(stages, publishFn);

      expect(result.success).toBe(true);
      expect(result.completedStages).toBe(2);
      expect(result.totalStages).toBe(2);
      expect(result.packageResults.length).toBe(2);
      expect(result.failedPackages).toEqual([]);
      expect(publishedPackages).toEqual(['@designerpunk/tokens', '@designerpunk/build-system']);
    });

    it('should stop on stage failure', async () => {
      // Requirements: 4.5
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
        }
      ];

      const publishFn = async (packageName: string) => {
        if (packageName === '@designerpunk/tokens') {
          throw new Error('Publishing failed');
        }
      };

      const result = await planner.executeStagedPublishing(stages, publishFn, {
        retry: { maxAttempts: 1, initialDelay: 10, backoffMultiplier: 1, maxDelay: 10 }
      });

      expect(result.success).toBe(false);
      expect(result.completedStages).toBe(0);
      expect(result.failedPackages).toContain('@designerpunk/tokens');
    });

    it('should support parallel publishing within stages', async () => {
      // Requirements: 4.5
      const stages = [
        {
          stage: 0,
          packages: ['@designerpunk/tokens', '@designerpunk/utils'],
          dependencies: [],
          estimatedDuration: 30
        }
      ];

      const publishedPackages: string[] = [];
      const publishFn = async (packageName: string) => {
        publishedPackages.push(packageName);
      };

      const result = await planner.executeStagedPublishing(stages, publishFn, {
        parallel: true
      });

      expect(result.success).toBe(true);
      expect(result.packageResults.length).toBe(2);
      expect(publishedPackages).toHaveLength(2);
    });
  });

  describe('rollbackPublishing', () => {
    it('should rollback published packages in reverse order', async () => {
      // Requirements: 4.5
      const publishedPackages = [
        '@designerpunk/tokens',
        '@designerpunk/build-system',
        '@designerpunk/components'
      ];

      const rolledBackPackages: string[] = [];
      const rollbackFn = async (packageName: string) => {
        rolledBackPackages.push(packageName);
      };

      const result = await planner.rollbackPublishing(publishedPackages, rollbackFn);

      expect(result.success).toBe(true);
      expect(result.rolledBackPackages).toEqual([
        '@designerpunk/components',
        '@designerpunk/build-system',
        '@designerpunk/tokens'
      ]);
      expect(result.failedRollbacks).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it('should handle rollback failures', async () => {
      // Requirements: 4.5
      const publishedPackages = [
        '@designerpunk/tokens',
        '@designerpunk/build-system'
      ];

      const rollbackFn = async (packageName: string) => {
        if (packageName === '@designerpunk/build-system') {
          throw new Error('Rollback failed');
        }
      };

      const result = await planner.rollbackPublishing(publishedPackages, rollbackFn);

      expect(result.success).toBe(false);
      expect(result.rolledBackPackages).toContain('@designerpunk/tokens');
      expect(result.failedRollbacks).toContain('@designerpunk/build-system');
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('retryPackagePublishing', () => {
    it('should retry failed publishing with exponential backoff', async () => {
      // Requirements: 4.5
      let attempts = 0;
      const publishFn = async (packageName: string) => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Publishing failed');
        }
      };

      const result = await planner.retryPackagePublishing(
        '@designerpunk/tokens',
        publishFn,
        { maxAttempts: 3, initialDelay: 10, backoffMultiplier: 2, maxDelay: 100 }
      );

      expect(result.success).toBe(true);
      expect(attempts).toBe(3);
    });

    it('should fail after max attempts', async () => {
      // Requirements: 4.5
      let attempts = 0;
      const publishFn = async (packageName: string) => {
        attempts++;
        throw new Error('Publishing failed');
      };

      const result = await planner.retryPackagePublishing(
        '@designerpunk/tokens',
        publishFn,
        { maxAttempts: 3, initialDelay: 10, backoffMultiplier: 2, maxDelay: 100 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Publishing failed');
      expect(attempts).toBe(3);
    });

    it('should respect max delay', async () => {
      // Requirements: 4.5
      const publishFn = async (packageName: string) => {
        throw new Error('Publishing failed');
      };

      const startTime = Date.now();
      await planner.retryPackagePublishing(
        '@designerpunk/tokens',
        publishFn,
        { maxAttempts: 3, initialDelay: 100, backoffMultiplier: 10, maxDelay: 150 }
      );
      const duration = Date.now() - startTime;

      // Total delay should be approximately: 100 + 150 = 250ms (not 100 + 1000)
      expect(duration).toBeLessThan(500);
    });
  });

  describe('validatePublishingOrder', () => {
    it('should validate correct publishing order', () => {
      // Requirements: 4.5
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

      const publishingOrder = ['@designerpunk/tokens', '@designerpunk/build-system'];

      const conflicts = planner.validatePublishingOrder(packages, publishingOrder);

      expect(conflicts).toEqual([]);
    });

    it('should detect incorrect publishing order', () => {
      // Requirements: 4.5
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

      const publishingOrder = ['@designerpunk/build-system', '@designerpunk/tokens'];

      const conflicts = planner.validatePublishingOrder(packages, publishingOrder);

      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0].conflictType).toBe('incompatible');
      expect(conflicts[0].package).toBe('@designerpunk/build-system');
    });

    it('should detect missing packages', () => {
      // Requirements: 4.5
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        }
      ];

      const publishingOrder = ['@designerpunk/tokens', '@designerpunk/missing'];

      const conflicts = planner.validatePublishingOrder(packages, publishingOrder);

      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0].conflictType).toBe('missing');
      expect(conflicts[0].package).toBe('@designerpunk/missing');
    });
  });

  describe('edge cases', () => {
    it('should handle empty package list', () => {
      // Requirements: 4.5
      const packages: PackageVersion[] = [];
      const updates: PackageUpdate[] = [];

      const plan = planner.generatePublishingPlan(packages, updates);

      expect(plan.totalPackages).toBe(0);
      expect(plan.order).toEqual([]);
    });

    it('should handle single package', () => {
      // Requirements: 4.5
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens',
          dependencies: {}
        }
      ];

      const updates: PackageUpdate[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
          path: './packages/tokens',
          bumpType: 'minor',
          reason: 'New tokens'
        }
      ];

      const plan = planner.generatePublishingPlan(packages, updates);

      expect(plan.totalPackages).toBe(1);
      expect(plan.order).toEqual([['@designerpunk/tokens']]);
    });

    it('should handle complex dependency graph', () => {
      // Requirements: 4.5
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

      const plan = planner.generatePublishingPlan(packages, updates);

      expect(plan.totalPackages).toBe(4);
      expect(plan.order.length).toBeGreaterThan(0);

      // Verify tokens is in first level
      expect(plan.order[0]).toContain('@designerpunk/tokens');

      // Verify components is in last level
      const lastLevel = plan.order[plan.order.length - 1];
      expect(lastLevel).toContain('@designerpunk/components');
    });
  });
});
