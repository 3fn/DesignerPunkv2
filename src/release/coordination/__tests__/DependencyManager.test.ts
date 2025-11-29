/**
 * DependencyManager Tests
 * 
 * Tests for dependency graph analysis, conflict detection, and compatibility validation.
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real dependency analysis logic
 * - Focus on graph algorithms: Tests validate dependency resolution and conflict detection
 * - Pure logic testing: No file system or external dependencies
 * 
 * ============================================================================
 * JEST MATCHER PATTERNS - IMPORTANT TESTING GUIDELINES
 * ============================================================================
 * 
 * This test file demonstrates correct Jest matcher usage for array assertions.
 * Understanding these patterns prevents common test failures.
 * 
 * PATTERN 1: Exact Element Matching
 * ----------------------------------
 * Use toContain() when checking if an array contains an EXACT element:
 * 
 *   ✅ CORRECT:
 *   expect(['apple', 'banana', 'cherry']).toContain('banana');
 * 
 *   ❌ WRONG:
 *   expect(['apple pie', 'banana bread']).toContain('banana');
 *   // Fails! toContain() looks for exact match, not substring
 * 
 * PATTERN 2: Substring Matching in Arrays
 * ----------------------------------------
 * Use array.some() with includes() when checking if any array element 
 * contains a substring:
 * 
 *   ✅ CORRECT:
 *   expect(array.some(s => s.includes('Update'))).toBe(true);
 *   // Checks if ANY element contains 'Update' as substring
 * 
 *   ❌ WRONG:
 *   expect(array).toContain('Update');
 *   // Fails if array has 'Update dependencies' but not exact 'Update'
 * 
 * PATTERN 3: Pattern Matching with Jest Matchers
 * -----------------------------------------------
 * Use expect.arrayContaining() with expect.stringContaining() for 
 * flexible pattern matching:
 * 
 *   ✅ CORRECT:
 *   expect(array).toEqual(
 *     expect.arrayContaining([
 *       expect.stringContaining('pattern')
 *     ])
 *   );
 * 
 * EXAMPLE FROM THIS FILE:
 * -----------------------
 * See line ~280 in resolveConflicts test:
 * 
 *   // Correct: Use array.some() for substring matching
 *   expect(incompatibleResolution?.suggestedActions.some(s => s.includes('Update'))).toBe(true);
 * 
 *   // Would be wrong: expect(suggestedActions).toContain('Update')
 *   // Because suggestedActions contains 'Update dependencies', not 'Update'
 * 
 * WHY THIS MATTERS:
 * -----------------
 * - toContain() uses strict equality (===) for element matching
 * - String arrays often contain full sentences, not single words
 * - Substring matching requires explicit includes() check
 * - Using wrong matcher causes false test failures
 * 
 * ============================================================================
 */

import { DependencyManager } from '../DependencyManager';
import {
  PackageVersion,
  PackageUpdate
} from '../types';

describe('DependencyManager', () => {
  let manager: DependencyManager;

  beforeEach(() => {
    manager = new DependencyManager();
  });

  describe('analyzeDependencyGraph', () => {
    it('should build dependency graph correctly', () => {
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

      const analysis = manager.analyzeDependencyGraph(packages);

      expect(analysis.graph.nodes.size).toBe(2);
      expect(analysis.graph.nodes.get('@designerpunk/tokens')?.dependencies).toHaveLength(0);
      expect(analysis.graph.nodes.get('@designerpunk/build-system')?.dependencies).toHaveLength(1);
    });

    it('should calculate dependency levels correctly', () => {
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

      const analysis = manager.analyzeDependencyGraph(packages);

      // Tokens should be at level 0 (no dependencies)
      expect(analysis.levels[0]).toContain('@designerpunk/tokens');
      
      // Build-system should be at level 1 (depends on tokens)
      expect(analysis.levels[1]).toContain('@designerpunk/build-system');
      
      // Components should be at level 2 (depends on build-system)
      expect(analysis.levels[2]).toContain('@designerpunk/components');
    });

    it('should detect circular dependencies', () => {
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

      const analysis = manager.analyzeDependencyGraph(packages);

      expect(analysis.circularDependencies.length).toBeGreaterThan(0);
      expect(analysis.circularDependencies[0]).toContain('@designerpunk/tokens');
      expect(analysis.circularDependencies[0]).toContain('@designerpunk/build-system');
    });

    it('should identify orphaned packages', () => {
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
        },
        {
          name: '@designerpunk/orphan',
          currentVersion: '1.0.0',
          path: './packages/orphan'
        }
      ];

      const analysis = manager.analyzeDependencyGraph(packages);

      expect(analysis.orphanedPackages).toContain('@designerpunk/orphan');
    });
  });

  describe('calculateDependencyUpdates', () => {
    it('should calculate dependency updates for regular dependencies', () => {
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

      const dependencyUpdates = manager.calculateDependencyUpdates(packages, updates);

      expect(dependencyUpdates).toHaveLength(1);
      expect(dependencyUpdates[0].package).toBe('@designerpunk/build-system');
      expect(dependencyUpdates[0].dependency).toBe('@designerpunk/tokens');
      expect(dependencyUpdates[0].newVersion).toBe('^1.1.0');
      expect(dependencyUpdates[0].type).toBe('dependencies');
    });

    it('should calculate dependency updates for devDependencies', () => {
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
          devDependencies: {
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

      const dependencyUpdates = manager.calculateDependencyUpdates(packages, updates);

      expect(dependencyUpdates).toHaveLength(1);
      expect(dependencyUpdates[0].type).toBe('devDependencies');
      expect(dependencyUpdates[0].newVersion).toBe('^1.1.0');
    });

    it('should calculate dependency updates for peerDependencies', () => {
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          path: './packages/components',
          peerDependencies: {
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

      const dependencyUpdates = manager.calculateDependencyUpdates(packages, updates);

      expect(dependencyUpdates).toHaveLength(1);
      expect(dependencyUpdates[0].type).toBe('peerDependencies');
      expect(dependencyUpdates[0].newVersion).toBe('>=1.1.0');
    });

    it('should handle multiple dependency types', () => {
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/tokens',
          currentVersion: '1.0.0',
          path: './packages/tokens'
        },
        {
          name: '@designerpunk/components',
          currentVersion: '1.0.0',
          path: './packages/components',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          },
          devDependencies: {
            '@designerpunk/tokens': '^1.0.0'
          },
          peerDependencies: {
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

      const dependencyUpdates = manager.calculateDependencyUpdates(packages, updates);

      expect(dependencyUpdates).toHaveLength(3);
      expect(dependencyUpdates.find(d => d.type === 'dependencies')).toBeDefined();
      expect(dependencyUpdates.find(d => d.type === 'devDependencies')).toBeDefined();
      expect(dependencyUpdates.find(d => d.type === 'peerDependencies')).toBeDefined();
    });
  });

  describe('detectConflicts', () => {
    it('should detect circular dependency conflicts', () => {
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

      const updates: PackageUpdate[] = [];

      const conflicts = manager.detectConflicts(packages, updates);

      expect(conflicts.length).toBeGreaterThan(0);
      expect(conflicts[0].conflictType).toBe('circular');
      expect(conflicts[0].affectedPackages).toContain('@designerpunk/tokens');
      expect(conflicts[0].affectedPackages).toContain('@designerpunk/build-system');
    });

    it('should detect version incompatibility conflicts', () => {
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
          newVersion: '2.0.0',
          path: './packages/tokens',
          bumpType: 'major',
          reason: 'Breaking changes'
        }
      ];

      const conflicts = manager.detectConflicts(packages, updates);

      const incompatibleConflict = conflicts.find(c => c.conflictType === 'incompatible');
      expect(incompatibleConflict).toBeDefined();
      expect(incompatibleConflict?.affectedPackages).toContain('@designerpunk/build-system');
    });

    it('should detect missing dependency conflicts', () => {
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const updates: PackageUpdate[] = [];

      const conflicts = manager.detectConflicts(packages, updates);

      const missingConflict = conflicts.find(c => c.conflictType === 'missing');
      expect(missingConflict).toBeDefined();
      expect(missingConflict?.description).toContain('not in the package list');
    });
  });

  describe('resolveConflicts', () => {
    it('should provide manual resolution for circular dependencies', () => {
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

      const updates: PackageUpdate[] = [];
      const conflicts = manager.detectConflicts(packages, updates);
      const resolutions = manager.resolveConflicts(conflicts, packages);

      const circularResolution = resolutions.find(
        r => r.conflict.conflictType === 'circular'
      );
      expect(circularResolution).toBeDefined();
      expect(circularResolution?.strategy).toBe('manual');
      expect(circularResolution?.suggestedActions.length).toBeGreaterThan(0);
    });

    it('should provide update-dependent strategy for incompatible versions', () => {
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
          newVersion: '2.0.0',
          path: './packages/tokens',
          bumpType: 'major',
          reason: 'Breaking changes'
        }
      ];

      const conflicts = manager.detectConflicts(packages, updates);
      const resolutions = manager.resolveConflicts(conflicts, packages);

      const incompatibleResolution = resolutions.find(
        r => r.conflict.conflictType === 'incompatible'
      );
      expect(incompatibleResolution).toBeDefined();
      expect(incompatibleResolution?.strategy).toBe('update-dependent');
      // Correct matcher usage: Use array.some() for substring matching in array elements
      // toContain() only works for exact element matches, not substring matching
      expect(incompatibleResolution?.suggestedActions.some(s => s.includes('Update'))).toBe(true);
    });

    it('should provide manual resolution for missing dependencies', () => {
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const updates: PackageUpdate[] = [];
      const conflicts = manager.detectConflicts(packages, updates);
      const resolutions = manager.resolveConflicts(conflicts, packages);

      const missingResolution = resolutions.find(
        r => r.conflict.conflictType === 'missing'
      );
      expect(missingResolution).toBeDefined();
      expect(missingResolution?.strategy).toBe('manual');
    });
  });

  describe('validateCompatibility', () => {
    it('should validate compatible packages', () => {
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

      const report = manager.validateCompatibility(packages);

      expect(report.compatible).toBe(true);
      expect(report.issues.filter(i => i.severity === 'error')).toHaveLength(0);
    });

    it('should detect incompatible versions', () => {
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
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const report = manager.validateCompatibility(packages);

      expect(report.compatible).toBe(false);
      expect(report.issues.length).toBeGreaterThan(0);
      expect(report.issues[0].severity).toBe('error');
    });

    it('should validate compatibility with proposed updates', () => {
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

      const report = manager.validateCompatibility(packages, updates);

      expect(report.compatible).toBe(true);
    });

    it('should detect circular dependencies in compatibility check', () => {
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

      const report = manager.validateCompatibility(packages);

      expect(report.compatible).toBe(false);
      expect(report.issues.some(i => i.description.includes('Circular dependency'))).toBe(true);
    });

    it('should warn about missing DesignerPunk dependencies', () => {
      const packages: PackageVersion[] = [
        {
          name: '@designerpunk/build-system',
          currentVersion: '1.0.0',
          path: './packages/build-system',
          dependencies: {
            '@designerpunk/tokens': '^1.0.0'
          }
        }
      ];

      const report = manager.validateCompatibility(packages);

      expect(report.warnings.length).toBeGreaterThan(0);
      expect(report.warnings[0].message).toContain('not found');
    });
  });
});
