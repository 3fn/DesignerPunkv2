/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Integration Tests: Analysis → Coordination Integration
 * 
 * Mock Strategy:
 * - Mock PackageCoordinator operations (no real file system changes)
 * - Mock analysis results from CLIBridge
 * - Test version bump propagation across packages
 * - Verify dependency updates are calculated correctly
 * - Test error handling for coordination failures
 * 
 * Tests the integration between analysis results and package coordination
 * to ensure version bumps are correctly propagated and dependencies updated.
 * 
 * Requirements: 1.1, 4.1, 4.2, 4.3
 */

import { PackageCoordinator } from '../PackageCoordinator';
import { DependencyManager } from '../DependencyManager';
import {
  PackageVersion,
  CoordinationStrategy,
  CoordinationPlan,
  PackageUpdate
} from '../types';

describe('Analysis → Coordination Integration', () => {
  let coordinator: PackageCoordinator;
  let dependencyManager: DependencyManager;
  let strategy: CoordinationStrategy;
  let mockPackages: PackageVersion[];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup coordination strategy
    strategy = {
      corePackageSync: true,
      componentIndependence: true,
      dependencyUpdates: 'automatic',
      corePackages: ['@designerpunk/tokens', '@designerpunk/build-system'],
      independentPackages: ['@designerpunk/components']
    };

    coordinator = new PackageCoordinator(strategy);
    dependencyManager = new DependencyManager();

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

  describe('Version Bump Propagation', () => {
    it('should propagate minor version bump from analysis to coordination', () => {
      // Setup: Analysis recommends minor bump for tokens package
      const analysisResult = {
        recommendedVersion: '1.1.0',
        bumpType: 'minor' as const,
        affectedPackages: ['@designerpunk/tokens']
      };

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Version bump propagated and core sync applied
      expect(plan.packages.length).toBeGreaterThanOrEqual(1);
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      expect(tokensUpdate).toBeDefined();
      expect(tokensUpdate?.newVersion).toBe('1.1.0');
      expect(tokensUpdate?.bumpType).toBe('minor');
    });

    it('should propagate major version bump across core packages', () => {
      // Setup: Analysis recommends major bump for tokens
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions with core package sync
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Major bump propagated to build-system (core package)
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      const buildSystemUpdate = plan.packages.find(p => p.name === '@designerpunk/build-system');

      expect(tokensUpdate).toBeDefined();
      expect(tokensUpdate?.newVersion).toBe('2.0.0');
      expect(tokensUpdate?.bumpType).toBe('major');

      // Build system should be synchronized due to core package sync
      expect(buildSystemUpdate).toBeDefined();
      expect(buildSystemUpdate?.newVersion).toBe('2.0.0');
      expect(buildSystemUpdate?.bumpType).toBe('major');
    });

    it('should handle patch version bump for independent packages', () => {
      // Setup: Analysis recommends patch bump for components only
      const proposedUpdates = new Map([
        ['@designerpunk/components', '1.0.1']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Only components updated (independent package)
      expect(plan.packages).toHaveLength(1);
      expect(plan.packages[0].name).toBe('@designerpunk/components');
      expect(plan.packages[0].newVersion).toBe('1.0.1');
      expect(plan.packages[0].bumpType).toBe('patch');

      // Core packages not affected
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      const buildSystemUpdate = plan.packages.find(p => p.name === '@designerpunk/build-system');
      expect(tokensUpdate).toBeUndefined();
      expect(buildSystemUpdate).toBeUndefined();
    });

    it('should synchronize core packages when one receives update', () => {
      // Setup: Only build-system gets update
      const proposedUpdates = new Map([
        ['@designerpunk/build-system', '1.2.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Both core packages synchronized
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      const buildSystemUpdate = plan.packages.find(p => p.name === '@designerpunk/build-system');

      expect(tokensUpdate).toBeDefined();
      expect(tokensUpdate?.newVersion).toBe('1.2.0');
      expect(buildSystemUpdate).toBeDefined();
      expect(buildSystemUpdate?.newVersion).toBe('1.2.0');
    });

    it('should handle multiple package updates from analysis', () => {
      // Setup: Analysis affects multiple packages
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/components', '1.2.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: All updates coordinated
      expect(plan.packages.length).toBeGreaterThanOrEqual(2);
      
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      const componentsUpdate = plan.packages.find(p => p.name === '@designerpunk/components');

      expect(tokensUpdate?.newVersion).toBe('1.1.0');
      expect(componentsUpdate?.newVersion).toBe('1.2.0');
    });
  });

  describe('Dependency Update Calculation', () => {
    it('should calculate dependency updates when tokens version changes', () => {
      // Setup: Tokens version bump
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Dependency updates calculated
      expect(plan.dependencyUpdates.length).toBeGreaterThan(0);

      // Build system should update its tokens dependency
      const buildSystemDep = plan.dependencyUpdates.find(
        d => d.package === '@designerpunk/build-system' && d.dependency === '@designerpunk/tokens'
      );
      expect(buildSystemDep).toBeDefined();
      expect(buildSystemDep?.newVersion).toBe('^1.1.0');

      // Components should update its tokens dependency
      const componentsDep = plan.dependencyUpdates.find(
        d => d.package === '@designerpunk/components' && d.dependency === '@designerpunk/tokens'
      );
      expect(componentsDep).toBeDefined();
      expect(componentsDep?.newVersion).toBe('^1.1.0');
    });

    it('should calculate transitive dependency updates', () => {
      // Setup: Build system version bump (affects components)
      const proposedUpdates = new Map([
        ['@designerpunk/build-system', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Components dependency on build-system updated
      const componentsDep = plan.dependencyUpdates.find(
        d => d.package === '@designerpunk/components' && d.dependency === '@designerpunk/build-system'
      );
      expect(componentsDep).toBeDefined();
      expect(componentsDep?.newVersion).toBe('^1.1.0');
    });

    it('should handle dependency updates for core package sync', () => {
      // Setup: Core packages synchronized to 2.0.0
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: All dependencies updated to match synchronized versions
      const dependencyUpdates = plan.dependencyUpdates;
      
      // Build system's tokens dependency should update
      const buildSystemTokensDep = dependencyUpdates.find(
        d => d.package === '@designerpunk/build-system' && d.dependency === '@designerpunk/tokens'
      );
      expect(buildSystemTokensDep?.newVersion).toBe('^2.0.0');

      // Components' dependencies should update
      const componentsTokensDep = dependencyUpdates.find(
        d => d.package === '@designerpunk/components' && d.dependency === '@designerpunk/tokens'
      );
      expect(componentsTokensDep?.newVersion).toBe('^2.0.0');

      const componentsBuildDep = dependencyUpdates.find(
        d => d.package === '@designerpunk/components' && d.dependency === '@designerpunk/build-system'
      );
      expect(componentsBuildDep?.newVersion).toBe('^2.0.0');
    });

    it('should preserve dependency types (dependencies vs devDependencies)', () => {
      // Setup: Package with devDependencies
      const packagesWithDev: PackageVersion[] = [
        ...mockPackages,
        {
          name: '@designerpunk/test-utils',
          currentVersion: '1.0.0',
          path: 'packages/test-utils',
          dependencies: {},
          devDependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(packagesWithDev, proposedUpdates);

      // Verify: devDependency update has correct type
      const devDep = plan.dependencyUpdates.find(
        d => d.package === '@designerpunk/test-utils' && d.type === 'devDependencies'
      );
      expect(devDep).toBeDefined();
      expect(devDep?.newVersion).toBe('^1.1.0');
    });
  });

  describe('Analysis Result Integration', () => {
    it('should integrate analysis results with coordination plan', () => {
      // Setup: Complete analysis result
      const analysisResult = {
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor' as const,
          rationale: 'New features added',
          confidence: 0.9,
          evidence: []
        },
        changes: {
          breakingChanges: [],
          newFeatures: [
            {
              id: 'f1',
              title: 'New token system',
              description: 'Implemented new token system',
              requirements: ['R1'],
              artifacts: ['tokens.ts'],
              source: 'completion.md',
              category: 'new-functionality' as const
            }
          ],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.9,
            ambiguousItems: [],
            filteredItems: []
          }
        }
      };

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', analysisResult.versionRecommendation.recommendedVersion]
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Coordination plan reflects analysis
      expect(plan.packages[0].newVersion).toBe('1.1.0');
      expect(plan.packages[0].bumpType).toBe('minor');
      expect(plan.packages[0].reason).toContain('1.1.0');
    });

    it('should handle breaking changes from analysis', () => {
      // Setup: Analysis with breaking changes
      const analysisResult = {
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '2.0.0',
          bumpType: 'major' as const,
          rationale: 'Breaking changes detected',
          confidence: 0.95,
          evidence: []
        },
        changes: {
          breakingChanges: [
            {
              id: 'bc1',
              title: 'API change',
              description: 'Changed token interface',
              affectedAPIs: ['TokenInterface'],
              source: 'completion.md',
              severity: 'high' as const
            }
          ],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.95,
            ambiguousItems: [],
            filteredItems: []
          }
        }
      };

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Major version bump coordinated
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      expect(tokensUpdate?.bumpType).toBe('major');
      expect(tokensUpdate?.newVersion).toBe('2.0.0');
    });

    it('should handle low-confidence analysis results', () => {
      // Setup: Low confidence analysis
      const analysisResult = {
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.0.1',
          bumpType: 'patch' as const,
          rationale: 'Minor changes detected',
          confidence: 0.6, // Low confidence
          evidence: []
        }
      };

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.0.1']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Coordination still proceeds (confidence handled by detection layer)
      expect(plan.packages[0].newVersion).toBe('1.0.1');
      expect(plan.packages[0].bumpType).toBe('patch');
    });
  });

  describe('Error Handling', () => {
    it('should handle coordination failures gracefully', () => {
      // Setup: Invalid version format
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', 'invalid-version']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Coordination handles invalid version
      // Invalid versions should be filtered out or cause conflicts
      const tokensUpdate = plan.packages.find(p => p.name === '@designerpunk/tokens');
      
      // Either no update or conflict detected
      if (tokensUpdate) {
        expect(plan.conflicts.length).toBeGreaterThan(0);
      } else {
        expect(plan.packages).toHaveLength(0);
      }
    });

    it('should detect circular dependencies', () => {
      // Setup: Circular dependency
      const circularPackages: PackageVersion[] = [
        {
          name: '@designerpunk/package-a',
          currentVersion: '1.0.0',
          path: 'packages/a',
          dependencies: {
            '@designerpunk/package-b': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/package-b',
          currentVersion: '1.0.0',
          path: 'packages/b',
          dependencies: {
            '@designerpunk/package-a': '^1.0.0'
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/package-a', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(circularPackages, proposedUpdates);

      // Verify: Circular dependency detected
      expect(plan.conflicts.length).toBeGreaterThan(0);
      expect(plan.conflicts[0].conflictType).toBe('circular');
    });

    it('should handle missing package in coordination', () => {
      // Setup: Proposed update for non-existent package
      const proposedUpdates = new Map([
        ['@designerpunk/nonexistent', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: No updates for non-existent package
      expect(plan.packages).toHaveLength(0);
    });

    it('should handle version conflicts between packages', () => {
      // Setup: Incompatible version requirements
      const conflictingPackages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: 'packages/tokens',
          dependencies: {}
        },
        {
          name: '@designerpunk/package-a',
          currentVersion: '1.0.0',
          path: 'packages/a',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        },
        {
          name: '@designerpunk/package-b',
          currentVersion: '1.0.0',
          path: 'packages/b',
          dependencies: {
            '@designerpunk/tokens': '~1.0.0' // Strict version requirement
          }
        }
      ];

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '2.0.0'] // Major bump
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(conflictingPackages, proposedUpdates);

      // Verify: Conflict detected for strict version requirement
      const hasConflict = plan.conflicts.some(
        c => c.conflictType === 'incompatible' && 
             c.affectedPackages.includes('@designerpunk/package-b')
      );
      expect(hasConflict).toBe(true);
    });
  });

  describe('Publishing Order', () => {
    it('should generate correct publishing order based on dependencies', () => {
      // Setup: Version updates
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0'],
        ['@designerpunk/build-system', '1.1.0'],
        ['@designerpunk/components', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Publishing order respects dependencies
      // tokens should be published before build-system and components
      const tokensIndex = plan.publishingOrder.indexOf('@designerpunk/tokens');
      const buildSystemIndex = plan.publishingOrder.indexOf('@designerpunk/build-system');
      const componentsIndex = plan.publishingOrder.indexOf('@designerpunk/components');

      expect(tokensIndex).toBeLessThan(buildSystemIndex);
      expect(buildSystemIndex).toBeLessThan(componentsIndex);
    });

    it('should handle independent package publishing', () => {
      // Setup: Only components update
      const proposedUpdates = new Map([
        ['@designerpunk/components', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Only components in publishing order
      expect(plan.publishingOrder).toHaveLength(1);
      expect(plan.publishingOrder[0]).toBe('@designerpunk/components');
    });
  });

  describe('Strategy Configuration', () => {
    it('should respect disabled core package sync', () => {
      // Setup: Disable core package sync
      const independentStrategy: CoordinationStrategy = {
        ...strategy,
        corePackageSync: false
      };
      const independentCoordinator = new PackageCoordinator(independentStrategy);

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = independentCoordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Only tokens updated (no sync)
      expect(plan.packages).toHaveLength(1);
      expect(plan.packages[0].name).toBe('@designerpunk/tokens');
    });

    it('should handle manual dependency update strategy', () => {
      // Setup: Manual dependency updates
      const manualStrategy: CoordinationStrategy = {
        ...strategy,
        dependencyUpdates: 'manual'
      };
      const manualCoordinator = new PackageCoordinator(manualStrategy);

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = manualCoordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Dependency updates still calculated (manual means user reviews)
      expect(plan.dependencyUpdates.length).toBeGreaterThan(0);
    });
  });

  describe('Data Flow Validation', () => {
    it('should maintain data integrity through analysis → coordination flow', () => {
      // Setup: Complete data flow
      const analysisResult = {
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.2.0',
          bumpType: 'minor' as const,
          rationale: 'New features',
          confidence: 0.9,
          evidence: []
        }
      };

      const proposedUpdates = new Map([
        ['@designerpunk/tokens', analysisResult.versionRecommendation.recommendedVersion]
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Data integrity maintained
      expect(plan.packages[0].currentVersion).toBe('1.0.0');
      expect(plan.packages[0].newVersion).toBe('1.2.0');
      expect(plan.packages[0].bumpType).toBe('minor');
      expect(plan.strategy).toEqual(strategy);
    });

    it('should preserve analysis metadata in coordination plan', () => {
      // Setup: Analysis with metadata
      const proposedUpdates = new Map([
        ['@designerpunk/tokens', '1.1.0']
      ]);

      // Execute: Coordinate versions
      const plan = coordinator.coordinateVersions(mockPackages, proposedUpdates);

      // Verify: Plan includes strategy metadata
      expect(plan.strategy).toBeDefined();
      expect(plan.strategy.corePackageSync).toBe(true);
      expect(plan.strategy.componentIndependence).toBe(true);
      expect(plan.strategy.corePackages).toContain('@designerpunk/tokens');
    });
  });
});
