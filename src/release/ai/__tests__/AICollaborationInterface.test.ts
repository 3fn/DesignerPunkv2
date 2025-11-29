/**
 * AI Collaboration Interface Tests
 * 
 * Tests AI-friendly interfaces for release management system
 * 
 * Mock Strategy:
 * - jest.mock('../../ReleaseManager'): Mock ReleaseManager for AI interface testing
 * - No shared mocks: Each test creates fresh mocks
 * - Focus on interface behavior: Tests validate AI-friendly method signatures and responses
 * 
 * Requirements: 6.5
 */

import { AICollaborationInterface, AIProgressUpdate } from '../AICollaborationInterface';
import { ReleaseManager } from '../../ReleaseManager';
import { ReleaseTrigger, ReleasePlan, ReleaseResult } from '../../types/ReleaseTypes';

// Mock ReleaseManager
jest.mock('../../ReleaseManager');

describe('AICollaborationInterface', () => {
  let mockReleaseManager: jest.Mocked<ReleaseManager>;
  let aiInterface: AICollaborationInterface;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock release manager
    mockReleaseManager = {
      getPipelineState: jest.fn(),
      getWorkflowState: jest.fn(),
      executeRelease: jest.fn(),
      resumeRelease: jest.fn(),
      queryReleaseHistory: jest.fn(),
      validateRelease: jest.fn(),
      getWorkflowStatistics: jest.fn()
    } as any;

    aiInterface = new AICollaborationInterface(mockReleaseManager);
  });

  describe('getStatus', () => {
    it('should return idle status when no active release', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({ active: false });
      mockReleaseManager.getWorkflowState.mockReturnValue(null);

      const status = aiInterface.getStatus();

      expect(status.state).toBe('idle');
      expect(status.progress).toBe(0);
      expect(status.message).toBe('No active release');
      expect(status.packages).toEqual([]);
      expect(status.errors).toEqual([]);
      expect(status.resumable).toBe(false);
    });

    it('should return analyzing status at start of release', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 0,
          failedStages: [],
          currentStage: 'analysis',
          duration: 1000
        },
        context: {}
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'in-progress'
      } as any);

      const status = aiInterface.getStatus();

      expect(status.state).toBe('analyzing');
      expect(status.progress).toBe(0);
      expect(status.currentStage).toBe('analysis');
      expect(status.message).toContain('Analyzing');
    });

    it('should return executing status during release', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 5,
          failedStages: [],
          currentStage: 'package-update',
          duration: 5000
        },
        context: {
          plan: {
            version: { to: '1.2.0' },
            packages: [{ name: 'test-package' }]
          }
        }
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'in-progress'
      } as any);

      const status = aiInterface.getStatus();

      expect(status.state).toBe('executing');
      expect(status.progress).toBe(50);
      expect(status.currentStage).toBe('package-update');
      expect(status.version).toBe('1.2.0');
      expect(status.packages).toEqual(['test-package']);
    });

    it('should return completed status when all stages done', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 10,
          failedStages: [],
          currentStage: 'npm-publish',
          duration: 10000
        },
        context: {
          plan: {
            version: { to: '1.2.0' },
            packages: [{ name: 'test-package' }]
          }
        }
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'completed'
      } as any);

      const status = aiInterface.getStatus();

      expect(status.state).toBe('completed');
      expect(status.progress).toBe(100);
      expect(status.message).toContain('completed successfully');
    });

    it('should return failed status with resumable flag', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 5,
          failedStages: [{ stage: 'git-operations', error: 'Git push failed' }],
          currentStage: 'git-operations',
          duration: 5000
        },
        context: {
          errors: [{
            code: 'GIT_OPERATIONS_FAILED',
            message: 'Git push failed',
            severity: 'error',
            step: 'git-operations'
          }]
        }
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'failed'
      } as any);

      const status = aiInterface.getStatus();

      expect(status.state).toBe('failed');
      expect(status.resumable).toBe(true);
      expect(status.errors.length).toBeGreaterThan(0);
      expect(status.errors[0].code).toBe('GIT_OPERATIONS_FAILED');
    });

    it('should include AI-friendly error guidance', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 3,
          failedStages: [{ stage: 'validation', error: 'Invalid version' }],
          currentStage: 'validation',
          duration: 3000
        },
        context: {
          errors: [{
            code: 'VALIDATION_FAILED',
            message: 'Invalid version format',
            severity: 'error',
            step: 'validation'
          }]
        }
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'failed'
      } as any);

      const status = aiInterface.getStatus();

      expect(status.errors[0].guidance).toBeTruthy();
      expect(status.errors[0].suggestedActions).toBeTruthy();
      expect(status.errors[0].suggestedActions.length).toBeGreaterThan(0);
    });
  });

  describe('executeRelease', () => {
    it('should execute release and return AI-friendly summary', async () => {
      const trigger: ReleaseTrigger = {
        type: 'manual',
        source: 'test',
        triggeredAt: new Date()
      };

      const mockResult: ReleaseResult = {
        success: true,
        version: '1.2.0',
        releasedPackages: ['test-package'],
        githubReleaseUrl: 'https://github.com/test/repo/releases/tag/v1.2.0',
        npmPackageUrls: ['https://www.npmjs.com/package/test-package'],
        duration: 10000,
        errors: [],
        releasedAt: new Date()
      };

      mockReleaseManager.executeRelease.mockResolvedValue(mockResult);

      const summary = await aiInterface.executeRelease(trigger);

      expect(summary.success).toBe(true);
      expect(summary.version).toBe('1.2.0');
      expect(summary.packages).toEqual(['test-package']);
      expect(summary.githubUrl).toBe('https://github.com/test/repo/releases/tag/v1.2.0');
      expect(summary.npmUrls).toEqual(['https://www.npmjs.com/package/test-package']);
      expect(summary.summary).toContain('Successfully released');
      expect(summary.nextSteps.length).toBeGreaterThan(0);
    });

    it('should handle failed release with actionable guidance', async () => {
      const trigger: ReleaseTrigger = {
        type: 'manual',
        source: 'test',
        triggeredAt: new Date()
      };

      const mockResult: ReleaseResult = {
        success: false,
        version: 'unknown',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 5000,
        errors: [{
          code: 'PACKAGE_UPDATE_FAILED',
          message: 'Failed to update package.json',
          severity: 'error',
          step: 'package-update'
        }],
        releasedAt: new Date()
      };

      mockReleaseManager.executeRelease.mockResolvedValue(mockResult);

      const summary = await aiInterface.executeRelease(trigger);

      expect(summary.success).toBe(false);
      expect(summary.errors.length).toBeGreaterThan(0);
      expect(summary.errors[0].guidance).toBeTruthy();
      expect(summary.errors[0].suggestedActions.length).toBeGreaterThan(0);
      expect(summary.nextSteps.length).toBeGreaterThan(0);
    });

    it('should format duration in human-readable format', async () => {
      const trigger: ReleaseTrigger = {
        type: 'manual',
        source: 'test',
        triggeredAt: new Date()
      };

      const mockResult: ReleaseResult = {
        success: true,
        version: '1.2.0',
        releasedPackages: ['test-package'],
        npmPackageUrls: [],
        duration: 125000, // 2m 5s
        errors: [],
        releasedAt: new Date()
      };

      mockReleaseManager.executeRelease.mockResolvedValue(mockResult);

      const summary = await aiInterface.executeRelease(trigger);

      // Duration format can be either "Xs" for short durations or "Xm Ys" for longer durations
      expect(summary.durationFormatted).toMatch(/(\d+m \d+s|\d+s)/);
    });
  });

  describe('resumeRelease', () => {
    it('should resume failed release and return summary', async () => {
      const workflowId = 'workflow-123';

      const mockResult: ReleaseResult = {
        success: true,
        version: '1.2.0',
        releasedPackages: ['test-package'],
        npmPackageUrls: [],
        duration: 8000,
        errors: [],
        releasedAt: new Date()
      };

      mockReleaseManager.resumeRelease.mockResolvedValue(mockResult);

      const summary = await aiInterface.resumeRelease(workflowId);

      expect(mockReleaseManager.resumeRelease).toHaveBeenCalledWith(workflowId);
      expect(summary.success).toBe(true);
      expect(summary.version).toBe('1.2.0');
    });
  });

  describe('getReleaseHistory', () => {
    it('should return formatted release history', () => {
      const mockHistory = [
        {
          id: 'workflow-1',
          state: 'completed',
          context: { version: '1.0.0', packages: ['pkg1'] },
          startedAt: new Date('2025-01-01T10:00:00Z'),
          completedAt: new Date('2025-01-01T10:05:00Z')
        },
        {
          id: 'workflow-2',
          state: 'failed',
          context: { version: '1.1.0', packages: ['pkg1', 'pkg2'] },
          startedAt: new Date('2025-01-02T10:00:00Z'),
          completedAt: new Date('2025-01-02T10:03:00Z')
        }
      ];

      mockReleaseManager.queryReleaseHistory.mockReturnValue(mockHistory as any);

      const history = aiInterface.getReleaseHistory({ limit: 10 });

      expect(history.length).toBe(2);
      expect(history[0].id).toBe('workflow-1');
      expect(history[0].state).toBe('completed');
      expect(history[0].version).toBe('1.0.0');
      expect(history[0].packages).toEqual(['pkg1']);
      expect(history[0].duration).toBe(5 * 60 * 1000); // 5 minutes
    });

    it('should handle in-progress releases without duration', () => {
      const mockHistory = [
        {
          id: 'workflow-1',
          state: 'in-progress',
          context: { version: '1.2.0', packages: ['pkg1'] },
          startedAt: new Date('2025-01-01T10:00:00Z')
        }
      ];

      mockReleaseManager.queryReleaseHistory.mockReturnValue(mockHistory as any);

      const history = aiInterface.getReleaseHistory();

      expect(history[0].duration).toBeUndefined();
    });
  });

  describe('validateReleasePlan', () => {
    it('should validate plan and return AI-friendly result', async () => {
      const mockPlan: ReleasePlan = {
        version: { from: '1.0.0', to: '1.1.0', type: 'minor', rationale: 'New features', calculatedAt: new Date() },
        packages: [],
        releaseNotes: {} as any,
        publishingPlan: {} as any,
        validationResults: [],
        createdAt: new Date(),
        id: 'plan-1'
      };

      mockReleaseManager.validateRelease.mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'test-validation'
      });

      const result = await aiInterface.validateReleasePlan(mockPlan);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.guidance).toContain('valid and ready');
    });

    it('should provide guidance for invalid plan', async () => {
      const mockPlan: ReleasePlan = {
        version: { from: '1.0.0', to: 'invalid', type: 'minor', rationale: 'Test', calculatedAt: new Date() },
        packages: [],
        releaseNotes: {} as any,
        publishingPlan: {} as any,
        validationResults: [],
        createdAt: new Date(),
        id: 'plan-1'
      };

      mockReleaseManager.validateRelease.mockResolvedValue({
        valid: false,
        errors: [{
          code: 'INVALID_VERSION',
          message: 'Version format is invalid',
          severity: 'error',
          source: 'validation'
        }],
        warnings: [],
        validatedAt: new Date(),
        context: 'test-validation'
      });

      const result = await aiInterface.validateReleasePlan(mockPlan);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.guidance).toContain('validation errors');
      expect(result.guidance).toContain('Version format is invalid');
    });

    it('should provide guidance for plan with warnings', async () => {
      const mockPlan: ReleasePlan = {
        version: { from: '1.0.0', to: '1.1.0', type: 'minor', rationale: 'Test', calculatedAt: new Date() },
        packages: [],
        releaseNotes: {} as any,
        publishingPlan: {} as any,
        validationResults: [],
        createdAt: new Date(),
        id: 'plan-1'
      };

      mockReleaseManager.validateRelease.mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [{
          code: 'MISSING_CHANGELOG',
          message: 'CHANGELOG.md not found',
          source: 'validation'
        }],
        validatedAt: new Date(),
        context: 'test-validation'
      });

      const result = await aiInterface.validateReleasePlan(mockPlan);

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.guidance).toContain('valid but has warnings');
    });
  });

  describe('onProgress', () => {
    it('should register and call progress callbacks', async () => {
      const progressUpdates: AIProgressUpdate[] = [];
      
      aiInterface.onProgress((update) => {
        progressUpdates.push(update);
      });

      const trigger: ReleaseTrigger = {
        type: 'manual',
        source: 'test',
        triggeredAt: new Date()
      };

      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.0.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      await aiInterface.executeRelease(trigger);

      // Should have received at least the initialization progress update
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[0].stage).toBe('initialization');
      expect(progressUpdates[0].status).toBe('started');
    });

    it('should handle errors in progress callbacks gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      aiInterface.onProgress(() => {
        throw new Error('Callback error');
      });

      const trigger: ReleaseTrigger = {
        type: 'manual',
        source: 'test',
        triggeredAt: new Date()
      };

      mockReleaseManager.executeRelease.mockResolvedValue({
        success: true,
        version: '1.0.0',
        releasedPackages: [],
        npmPackageUrls: [],
        duration: 1000,
        errors: [],
        releasedAt: new Date()
      });

      // Should not throw despite callback error
      await expect(aiInterface.executeRelease(trigger)).resolves.toBeDefined();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getGuidance', () => {
    it('should provide guidance for idle state', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({ active: false });
      mockReleaseManager.getWorkflowState.mockReturnValue(null);

      const guidance = aiInterface.getGuidance();

      expect(guidance).toContain('No active release');
      expect(guidance).toContain('executeRelease');
    });

    it('should provide guidance for failed resumable state', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 5,
          failedStages: [{ stage: 'git-operations', error: 'Failed' }],
          currentStage: 'git-operations',
          duration: 5000
        },
        context: {}
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'failed'
      } as any);

      const guidance = aiInterface.getGuidance();

      expect(guidance).toContain('failed');
      expect(guidance).toContain('resumeRelease');
    });

    it('should provide guidance for completed state', () => {
      mockReleaseManager.getPipelineState.mockReturnValue({
        active: true,
        summary: {
          totalStages: 10,
          successfulStages: 10,
          failedStages: [],
          currentStage: 'npm-publish',
          duration: 10000
        },
        context: {
          plan: {
            version: { to: '1.2.0' },
            packages: [{ name: 'pkg1' }, { name: 'pkg2' }]
          }
        }
      });
      mockReleaseManager.getWorkflowState.mockReturnValue({
        id: 'workflow-1',
        state: 'completed'
      } as any);

      const guidance = aiInterface.getGuidance();

      expect(guidance).toContain('completed successfully');
      expect(guidance).toContain('1.2.0');
      expect(guidance).toContain('2 package');
    });
  });

  describe('getStatistics', () => {
    it('should return formatted statistics', () => {
      mockReleaseManager.getWorkflowStatistics.mockReturnValue({
        total: 10,
        byState: {
          'pending': 0,
          'in-progress': 1,
          'completed': 7,
          'failed': 2
        },
        byType: {},
        averageDuration: 8500
      });

      const stats = aiInterface.getStatistics();

      expect(stats.totalReleases).toBe(9); // completed + failed
      expect(stats.successfulReleases).toBe(7);
      expect(stats.failedReleases).toBe(2);
      expect(stats.averageDuration).toBe(8500);
      expect(stats.successRate).toBeCloseTo(77.78, 1);
    });

    it('should handle zero releases', () => {
      mockReleaseManager.getWorkflowStatistics.mockReturnValue({
        total: 0,
        byState: {
          'pending': 0,
          'in-progress': 0,
          'completed': 0,
          'failed': 0
        },
        byType: {},
        averageDuration: 0
      });

      const stats = aiInterface.getStatistics();

      expect(stats.totalReleases).toBe(0);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('error guidance', () => {
    it('should provide specific guidance for each error type', () => {
      const errorCodes = [
        'ANALYSIS_FAILED',
        'PLANNING_FAILED',
        'VALIDATION_FAILED',
        'PACKAGE_UPDATE_FAILED',
        'CHANGELOG_UPDATE_FAILED',
        'GIT_OPERATIONS_FAILED',
        'PUSH_FAILED',
        'GITHUB_PUBLISH_FAILED',
        'NPM_PUBLISH_FAILED'
      ];

      errorCodes.forEach(code => {
        mockReleaseManager.getPipelineState.mockReturnValue({
          active: true,
          summary: {
            totalStages: 10,
            successfulStages: 3,
            failedStages: [{ stage: 'test', error: 'Test error' }],
            currentStage: 'test',
            duration: 3000
          },
          context: {
            errors: [{
              code,
              message: 'Test error',
              severity: 'error',
              step: 'test'
            }]
          }
        });
        mockReleaseManager.getWorkflowState.mockReturnValue({
          id: 'workflow-1',
          state: 'failed'
        } as any);

        const status = aiInterface.getStatus();

        expect(status.errors[0].guidance).toBeTruthy();
        expect(status.errors[0].guidance.length).toBeGreaterThan(0);
        expect(status.errors[0].suggestedActions.length).toBeGreaterThan(0);
      });
    });

    it('should mark recoverable errors correctly', () => {
      const recoverableErrors = [
        'CHANGELOG_UPDATE_FAILED',
        'GITHUB_PUBLISH_FAILED',
        'NPM_PUBLISH_FAILED'
      ];

      recoverableErrors.forEach(code => {
        mockReleaseManager.getPipelineState.mockReturnValue({
          active: true,
          summary: {
            totalStages: 10,
            successfulStages: 7,
            failedStages: [{ stage: 'test', error: 'Test error' }],
            currentStage: 'test',
            duration: 7000
          },
          context: {
            errors: [{
              code,
              message: 'Test error',
              severity: 'error',
              step: 'test'
            }]
          }
        });
        mockReleaseManager.getWorkflowState.mockReturnValue({
          id: 'workflow-1',
          state: 'failed'
        } as any);

        const status = aiInterface.getStatus();

        expect(status.errors[0].recoverable).toBe(true);
      });
    });
  });
});
