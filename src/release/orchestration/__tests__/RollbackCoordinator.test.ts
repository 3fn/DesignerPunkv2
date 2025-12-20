/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Rollback Coordinator Tests
 * 
 * Tests comprehensive rollback mechanisms across all release components
 * 
 * Mock Strategy:
 * - Mock all component rollback methods
 * - Test rollback coordination and error handling
 * - Verify audit trail and validation
 * 
 * Requirements: 8.4, 8.5
 */

import { RollbackCoordinator, RollbackComponent } from '../ErrorRecovery';

describe('RollbackCoordinator', () => {
  let coordinator: RollbackCoordinator;

  beforeEach(() => {
    coordinator = new RollbackCoordinator();
  });

  describe('State Management', () => {
    it('should save and retrieve git state', () => {
      const gitState = {
        commitHash: 'abc123',
        branch: 'main',
        tags: ['v1.0.0']
      };

      coordinator.saveState('git', gitState);
      const retrieved = coordinator.getState('git');

      expect(retrieved).toEqual(gitState);
    });

    it('should save and retrieve package.json state', () => {
      const packageState = {
        files: new Map([
          ['package.json', '{"version": "1.0.0"}']
        ])
      };

      coordinator.saveState('package-json', packageState);
      const retrieved = coordinator.getState('package-json');

      expect(retrieved).toEqual(packageState);
    });

    it('should save and retrieve changelog state', () => {
      const changelogState = {
        path: 'CHANGELOG.md',
        content: '# Changelog\n\n## [1.0.0]'
      };

      coordinator.saveState('changelog', changelogState);
      const retrieved = coordinator.getState('changelog');

      expect(retrieved).toEqual(changelogState);
    });

    it('should save and retrieve GitHub state', () => {
      const githubState = {
        releaseId: 'release-123',
        tagName: 'v1.0.0'
      };

      coordinator.saveState('github', githubState);
      const retrieved = coordinator.getState('github');

      expect(retrieved).toEqual(githubState);
    });

    it('should save and retrieve npm state', () => {
      const npmState = {
        packages: [
          { name: 'pkg1', version: '1.0.0', published: true }
        ]
      };

      coordinator.saveState('npm', npmState);
      const retrieved = coordinator.getState('npm');

      expect(retrieved).toEqual(npmState);
    });

    it('should return undefined for non-existent state', () => {
      const state = coordinator.getState('git');
      expect(state).toBeUndefined();
    });

    it('should clear all state', () => {
      coordinator.saveState('git', { commitHash: 'abc123' });
      coordinator.saveState('npm', { packages: [] });

      coordinator.clear();

      expect(coordinator.getState('git')).toBeUndefined();
      expect(coordinator.getState('npm')).toBeUndefined();
    });
  });

  describe('Complete Rollback', () => {
    it('should rollback all components successfully', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        })
      };

      const mockPackageUpdater = {
        rollback: jest.fn().mockResolvedValue(undefined)
      };

      const mockChangelogManager = {};
      const mockGitHubPublisher = {};
      const mockNpmPublisher = {};

      const result = await coordinator.executeRollback({
        git: mockGit,
        packageUpdater: mockPackageUpdater,
        changelogManager: mockChangelogManager,
        githubPublisher: mockGitHubPublisher,
        npmPublisher: mockNpmPublisher
      });

      expect(result.success).toBe(true);
      expect(result.rolledBackComponents).toContain('git');
      expect(result.rolledBackComponents).toContain('package-json');
      expect(result.failedComponents).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
      expect(result.auditTrail.length).toBeGreaterThan(0);
    });

    it('should rollback specific components only', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        })
      };

      const mockPackageUpdater = {
        rollback: jest.fn().mockResolvedValue(undefined)
      };

      const result = await coordinator.executeRollback(
        {
          git: mockGit,
          packageUpdater: mockPackageUpdater
        },
        {
          components: ['git', 'package-json']
        }
      );

      expect(result.success).toBe(true);
      expect(result.rolledBackComponents).toEqual(['git', 'package-json']);
      expect(mockGit.rollback).toHaveBeenCalled();
      expect(mockPackageUpdater.rollback).toHaveBeenCalled();
    });

    it('should handle rollback failures without force', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: false,
          errors: [
            { operation: 'reset', error: 'Reset failed', code: 'RESET_ERROR' }
          ]
        })
      };

      const mockPackageUpdater = {
        rollback: jest.fn().mockResolvedValue(undefined)
      };

      const result = await coordinator.executeRollback(
        {
          git: mockGit,
          packageUpdater: mockPackageUpdater
        },
        {
          force: false
        }
      );

      expect(result.success).toBe(false);
      expect(result.failedComponents).toContain('git');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should continue rollback with force option', async () => {
      const mockGit = {
        rollback: jest.fn().mockRejectedValue(new Error('Git rollback failed'))
      };

      const mockPackageUpdater = {
        rollback: jest.fn().mockResolvedValue(undefined)
      };

      const result = await coordinator.executeRollback(
        {
          git: mockGit,
          packageUpdater: mockPackageUpdater
        },
        {
          force: true,
          components: ['package-json', 'git']
        }
      );

      expect(result.failedComponents).toContain('git');
      expect(result.rolledBackComponents).toContain('package-json');
      expect(mockPackageUpdater.rollback).toHaveBeenCalled();
    });

    it('should rollback in correct order (reverse of execution)', async () => {
      const rollbackOrder: string[] = [];

      const mockNpmPublisher = {
        unpublishPackage: jest.fn().mockImplementation(() => {
          rollbackOrder.push('npm');
          return Promise.resolve();
        })
      };

      const mockGitHubPublisher = {
        deleteRelease: jest.fn().mockImplementation(() => {
          rollbackOrder.push('github');
          return Promise.resolve();
        }),
        deleteTag: jest.fn().mockResolvedValue(true)
      };

      const mockPackageUpdater = {
        rollback: jest.fn().mockImplementation(() => {
          rollbackOrder.push('package-json');
          return Promise.resolve();
        })
      };

      const mockGit = {
        rollback: jest.fn().mockImplementation(() => {
          rollbackOrder.push('git');
          return Promise.resolve({ success: true, errors: [] });
        })
      };

      // Save state for npm and github
      coordinator.saveState('npm', {
        packages: [{ name: 'pkg1', version: '1.0.0', published: true }]
      });
      coordinator.saveState('github', {
        releaseId: 'release-123',
        tagName: 'v1.0.0'
      });

      await coordinator.executeRollback({
        git: mockGit,
        packageUpdater: mockPackageUpdater,
        githubPublisher: mockGitHubPublisher,
        npmPublisher: mockNpmPublisher
      });

      // Verify rollback order: npm → github → package-json → git
      expect(rollbackOrder[0]).toBe('npm');
      expect(rollbackOrder[rollbackOrder.length - 1]).toBe('git');
    });
  });

  describe('Component-Specific Rollback', () => {
    it('should rollback npm publications', async () => {
      const mockNpmPublisher = {
        unpublishPackage: jest.fn().mockResolvedValue(true)
      };

      coordinator.saveState('npm', {
        packages: [
          { name: 'pkg1', version: '1.0.0', published: true },
          { name: 'pkg2', version: '1.0.0', published: true }
        ]
      });

      const result = await coordinator.executeRollback(
        {
          npmPublisher: mockNpmPublisher
        },
        {
          components: ['npm']
        }
      );

      expect(result.success).toBe(true);
      expect(mockNpmPublisher.unpublishPackage).toHaveBeenCalledTimes(2);
      expect(mockNpmPublisher.unpublishPackage).toHaveBeenCalledWith('pkg1', '1.0.0');
      expect(mockNpmPublisher.unpublishPackage).toHaveBeenCalledWith('pkg2', '1.0.0');
    });

    it('should rollback GitHub release and tag', async () => {
      const mockGitHubPublisher = {
        deleteRelease: jest.fn().mockResolvedValue(true),
        deleteTag: jest.fn().mockResolvedValue(true)
      };

      coordinator.saveState('github', {
        releaseId: 'release-123',
        tagName: 'v1.0.0'
      });

      const result = await coordinator.executeRollback(
        {
          githubPublisher: mockGitHubPublisher
        },
        {
          components: ['github']
        }
      );

      expect(result.success).toBe(true);
      expect(mockGitHubPublisher.deleteRelease).toHaveBeenCalledWith('v1.0.0');
      expect(mockGitHubPublisher.deleteTag).toHaveBeenCalledWith('v1.0.0');
    });

    it('should handle npm unpublish failures gracefully', async () => {
      const mockNpmPublisher = {
        unpublishPackage: jest.fn()
          .mockResolvedValueOnce(true)
          .mockRejectedValueOnce(new Error('Unpublish failed'))
      };

      coordinator.saveState('npm', {
        packages: [
          { name: 'pkg1', version: '1.0.0', published: true },
          { name: 'pkg2', version: '1.0.0', published: true }
        ]
      });

      const result = await coordinator.executeRollback(
        {
          npmPublisher: mockNpmPublisher
        },
        {
          components: ['npm']
        }
      );

      expect(result.success).toBe(true); // npm failures are recoverable
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].recoverable).toBe(true);
    });

    it('should handle GitHub deletion failures gracefully', async () => {
      const mockGitHubPublisher = {
        deleteRelease: jest.fn().mockRejectedValue(new Error('Delete failed')),
        deleteTag: jest.fn().mockResolvedValue(true)
      };

      coordinator.saveState('github', {
        releaseId: 'release-123',
        tagName: 'v1.0.0'
      });

      const result = await coordinator.executeRollback(
        {
          githubPublisher: mockGitHubPublisher
        },
        {
          components: ['github']
        }
      );

      expect(result.success).toBe(true); // GitHub failures are recoverable
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].recoverable).toBe(true);
    });
  });

  describe('Audit Trail', () => {
    it('should record audit trail for successful rollback', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        })
      };

      await coordinator.executeRollback(
        {
          git: mockGit
        },
        {
          components: ['git']
        }
      );

      const auditTrail = coordinator.getAuditTrail();
      expect(auditTrail.length).toBeGreaterThan(0);
      expect(auditTrail[0]).toMatchObject({
        component: 'git',
        operation: 'rollback',
        success: true
      });
      expect(auditTrail[0].timestamp).toBeInstanceOf(Date);
    });

    it('should record audit trail for failed rollback', async () => {
      const mockGit = {
        rollback: jest.fn().mockRejectedValue(new Error('Rollback failed'))
      };

      await coordinator.executeRollback(
        {
          git: mockGit
        },
        {
          components: ['git'],
          force: true
        }
      );

      const auditTrail = coordinator.getAuditTrail();
      expect(auditTrail.length).toBeGreaterThan(0);
      
      const failedEntry = auditTrail.find(e => !e.success);
      expect(failedEntry).toBeDefined();
      expect(failedEntry!.error).toContain('Rollback failed');
    });

    it('should clear audit trail on clear()', () => {
      coordinator.saveState('git', { commitHash: 'abc123' });
      
      coordinator.clear();
      
      const auditTrail = coordinator.getAuditTrail();
      expect(auditTrail).toHaveLength(0);
    });
  });

  describe('Rollback Validation', () => {
    it('should validate successful rollback', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        }),
        executeGitCommand: jest.fn().mockReturnValue('abc123')
      };

      coordinator.saveState('git', {
        commitHash: 'abc123',
        branch: 'main',
        tags: []
      });

      const result = await coordinator.executeRollback(
        {
          git: mockGit
        },
        {
          components: ['git'],
          validate: true
        }
      );

      expect(result.validation).toBeDefined();
      expect(result.validation!.valid).toBe(true);
      expect(result.validation!.checks.length).toBeGreaterThan(0);
    });

    it('should detect validation failures', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        }),
        executeGitCommand: jest.fn().mockReturnValue('different-commit')
      };

      coordinator.saveState('git', {
        commitHash: 'abc123',
        branch: 'main',
        tags: []
      });

      const result = await coordinator.executeRollback(
        {
          git: mockGit
        },
        {
          components: ['git'],
          validate: true
        }
      );

      expect(result.validation).toBeDefined();
      expect(result.validation!.valid).toBe(false);
      
      const failedCheck = result.validation!.checks.find(c => !c.passed);
      expect(failedCheck).toBeDefined();
    });

    it('should skip validation when not requested', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        })
      };

      const result = await coordinator.executeRollback(
        {
          git: mockGit
        },
        {
          components: ['git'],
          validate: false
        }
      );

      expect(result.validation).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rollback with no components', async () => {
      const result = await coordinator.executeRollback({}, {
        components: []
      });

      expect(result.success).toBe(true);
      expect(result.rolledBackComponents).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle rollback with missing component implementations', async () => {
      const result = await coordinator.executeRollback(
        {},
        {
          components: ['git', 'npm']
        }
      );

      expect(result.success).toBe(true);
      // Missing components are still added to rolledBackComponents (they return early without error)
      expect(result.rolledBackComponents).toEqual(['git', 'npm']);
    });

    it('should handle rollback with no saved state', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        })
      };

      const result = await coordinator.executeRollback(
        {
          git: mockGit
        },
        {
          components: ['git']
        }
      );

      expect(result.success).toBe(true);
      expect(mockGit.rollback).toHaveBeenCalled();
    });

    it('should handle partial rollback failures', async () => {
      const mockGit = {
        rollback: jest.fn().mockResolvedValue({
          success: true,
          errors: []
        })
      };

      const mockPackageUpdater = {
        rollback: jest.fn().mockRejectedValue(new Error('Package rollback failed'))
      };

      const result = await coordinator.executeRollback(
        {
          git: mockGit,
          packageUpdater: mockPackageUpdater
        },
        {
          force: true
        }
      );

      expect(result.rolledBackComponents).toContain('git');
      expect(result.failedComponents).toContain('package-json');
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
