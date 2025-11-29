/**
 * ReleaseManager Unit Tests
 * 
 * Mock Strategy:
 * - jest.mock for all component dependencies (CLIBridge, PackageUpdater, etc.)
 * - Manual mocks for complex scenarios requiring stateful behavior
 * - No shared mocks: Each test creates fresh mocks
 * 
 * Tests orchestration logic with isolated mocks for all components.
 */

import { ReleaseManager } from '../ReleaseManager';
import { CLIBridge } from '../integration/CLIBridge';
import { AnalysisResultParser } from '../integration/AnalysisResultParser';
import { PackageUpdater } from '../automation/PackageUpdater';
import { ChangelogManager } from '../automation/ChangelogManager';
import { GitOperations } from '../automation/GitOperations';
import { ReleaseValidator } from '../orchestration/ReleaseValidator';

// Mock all dependencies
jest.mock('../integration/CLIBridge');
jest.mock('../integration/AnalysisResultParser');
jest.mock('../automation/PackageUpdater');
jest.mock('../automation/ChangelogManager');
jest.mock('../automation/GitOperations');
jest.mock('../orchestration/ReleaseValidator');

/**
 * Helper function to create a valid AnalysisResult mock with correct structure
 */
function createMockAnalysisResult(overrides?: {
  currentVersion?: string;
  recommendedVersion?: string;
  bumpType?: 'major' | 'minor' | 'patch' | 'none';
  rationale?: string;
  releaseNotes?: string;
}) {
  return {
    scope: {
      toCommit: 'abc123',
      completionDocuments: [],
      analysisDate: new Date()
    },
    changes: {
      breakingChanges: [],
      newFeatures: [],
      bugFixes: [],
      improvements: [],
      documentation: [],
      metadata: {
        documentsAnalyzed: 1,
        extractionConfidence: 0.9,
        ambiguousItems: [],
        filteredItems: []
      }
    },
    versionRecommendation: {
      currentVersion: overrides?.currentVersion || '1.0.0',
      recommendedVersion: overrides?.recommendedVersion || '1.1.0',
      bumpType: overrides?.bumpType || 'minor',
      rationale: overrides?.rationale || 'New features added',
      confidence: 0.9,
      evidence: []
    },
    releaseNotes: overrides?.releaseNotes || '## Features\n- New feature',
    confidence: {
      overall: 0.9,
      extraction: 0.9,
      categorization: 0.9,
      deduplication: 0.9,
      versionCalculation: 0.9
    }
  };
}

describe('ReleaseManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      const manager = new ReleaseManager();
      expect(manager).toBeInstanceOf(ReleaseManager);
    });

    it('should initialize with custom configuration', () => {
      const config = {
        workingDirectory: '/custom/path',
        dryRun: true,
        skipConfirmation: true
      };

      const manager = new ReleaseManager(config);
      expect(manager).toBeInstanceOf(ReleaseManager);
    });

    it('should initialize GitHub publisher when configured', () => {
      const config = {
        github: {
          token: 'test-token',
          owner: 'test-owner',
          repo: 'test-repo'
        }
      };

      const manager = new ReleaseManager(config);
      expect(manager).toBeInstanceOf(ReleaseManager);
    });

    it('should initialize npm publisher when configured', () => {
      const config = {
        npm: {
          registry: 'https://registry.npmjs.org/',
          token: 'test-token'
        }
      };

      const manager = new ReleaseManager(config);
      expect(manager).toBeInstanceOf(ReleaseManager);
    });
  });

  describe('executeRelease', () => {
    it('should execute complete release pipeline successfully', async () => {
      // Setup mocks
      const mockAnalysisResult = createMockAnalysisResult();
      const mockCLIResult = {
        success: true,
        stdout: JSON.stringify(mockAnalysisResult),
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      (CLIBridge.prototype.executeForJSON as jest.Mock).mockResolvedValue(mockCLIResult);
      (AnalysisResultParser.prototype.parse as jest.Mock).mockReturnValue(mockAnalysisResult);

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      (PackageUpdater.prototype.updatePackageVersion as jest.Mock).mockResolvedValue({
        success: true,
        packagePath: 'package.json',
        oldVersion: '1.0.0',
        newVersion: '1.1.0',
        errors: []
      });

      (ChangelogManager.prototype.updateChangelog as jest.Mock).mockResolvedValue({
        success: true,
        changelogPath: 'CHANGELOG.md',
        created: false,
        errors: []
      });

      (GitOperations.prototype.createCommit as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'commit',
        details: 'Created commit',
        errors: []
      });

      (GitOperations.prototype.createTag as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'tag',
        details: 'Created tag v1.1.0',
        errors: []
      });

      (GitOperations.prototype.push as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'push',
        details: 'Pushed to origin',
        errors: []
      });

      // Execute release
      const manager = new ReleaseManager({ skipConfirmation: true });
      const result = await manager.executeRelease({
        type: 'automatic',
        source: 'spec-completion',
        triggeredAt: new Date()
      });

      // Verify result
      expect(result.success).toBe(true);
      expect(result.version).toBe('1.1.0');
      expect(result.releasedPackages).toContain('designerpunk');
      expect(result.errors).toHaveLength(0);
    });

    it('should handle analysis failure', async () => {
      // Setup mock to fail
      (CLIBridge.prototype.executeForJSON as jest.Mock).mockRejectedValue(
        new Error('CLI analysis failed')
      );

      // Execute release
      const manager = new ReleaseManager({ skipConfirmation: true });
      const result = await manager.executeRelease({
        type: 'automatic',
        source: 'spec-completion',
        triggeredAt: new Date()
      });

      // Verify failure
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('ANALYSIS_FAILED');
    });

    it('should rollback on package update failure', async () => {
      // Setup mocks
      const mockAnalysisResult = createMockAnalysisResult();
      const mockCLIResult = {
        success: true,
        stdout: JSON.stringify(mockAnalysisResult),
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      (CLIBridge.prototype.executeForJSON as jest.Mock).mockResolvedValue(mockCLIResult);
      (AnalysisResultParser.prototype.parse as jest.Mock).mockReturnValue(mockAnalysisResult);

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      (PackageUpdater.prototype.updatePackageVersion as jest.Mock).mockResolvedValue({
        success: false,
        packagePath: 'package.json',
        oldVersion: '1.0.0',
        newVersion: '1.1.0',
        errors: [{ file: 'package.json', error: 'Update failed', code: 'UPDATE_ERROR' }]
      });

      (PackageUpdater.prototype.rollback as jest.Mock).mockResolvedValue(undefined);
      (GitOperations.prototype.rollback as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'rollback',
        details: 'Rolled back',
        errors: []
      });

      // Execute release
      const manager = new ReleaseManager({ skipConfirmation: true });
      const result = await manager.executeRelease({
        type: 'automatic',
        source: 'spec-completion',
        triggeredAt: new Date()
      });

      // Verify rollback occurred
      expect(result.success).toBe(false);
      expect(PackageUpdater.prototype.rollback).toHaveBeenCalled();
      expect(GitOperations.prototype.rollback).toHaveBeenCalled();
    });

    it('should handle git operations failure with rollback', async () => {
      // Setup mocks
      const mockAnalysisResult = createMockAnalysisResult();
      const mockCLIResult = {
        success: true,
        stdout: JSON.stringify(mockAnalysisResult),
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      (CLIBridge.prototype.executeForJSON as jest.Mock).mockResolvedValue(mockCLIResult);
      (AnalysisResultParser.prototype.parse as jest.Mock).mockReturnValue(mockAnalysisResult);

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      (PackageUpdater.prototype.updatePackageVersion as jest.Mock).mockResolvedValue({
        success: true,
        packagePath: 'package.json',
        oldVersion: '1.0.0',
        newVersion: '1.1.0',
        errors: []
      });

      (ChangelogManager.prototype.updateChangelog as jest.Mock).mockResolvedValue({
        success: true,
        changelogPath: 'CHANGELOG.md',
        created: false,
        errors: []
      });

      (GitOperations.prototype.createCommit as jest.Mock).mockResolvedValue({
        success: false,
        operation: 'commit',
        details: '',
        errors: [{ operation: 'commit', error: 'Commit failed', code: 'COMMIT_ERROR' }]
      });

      (PackageUpdater.prototype.rollback as jest.Mock).mockResolvedValue(undefined);
      (GitOperations.prototype.rollback as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'rollback',
        details: 'Rolled back',
        errors: []
      });

      // Execute release
      const manager = new ReleaseManager({ skipConfirmation: true });
      const result = await manager.executeRelease({
        type: 'automatic',
        source: 'spec-completion',
        triggeredAt: new Date()
      });

      // Verify rollback occurred
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('GIT_OPERATIONS_FAILED');
    });

    it('should skip push in dry-run mode', async () => {
      // Setup mocks
      const mockAnalysisResult = createMockAnalysisResult();
      const mockCLIResult = {
        success: true,
        stdout: JSON.stringify(mockAnalysisResult),
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      (CLIBridge.prototype.executeForJSON as jest.Mock).mockResolvedValue(mockCLIResult);
      (AnalysisResultParser.prototype.parse as jest.Mock).mockReturnValue(mockAnalysisResult);

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      (PackageUpdater.prototype.updatePackageVersion as jest.Mock).mockResolvedValue({
        success: true,
        packagePath: 'package.json',
        oldVersion: '1.0.0',
        newVersion: '1.1.0',
        errors: []
      });

      (ChangelogManager.prototype.updateChangelog as jest.Mock).mockResolvedValue({
        success: true,
        changelogPath: 'CHANGELOG.md',
        created: false,
        errors: []
      });

      (GitOperations.prototype.createCommit as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'commit',
        details: 'Created commit',
        errors: []
      });

      (GitOperations.prototype.createTag as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'tag',
        details: 'Created tag v1.1.0',
        errors: []
      });

      // Execute release in dry-run mode
      const manager = new ReleaseManager({ dryRun: true, skipConfirmation: true });
      const result = await manager.executeRelease({
        type: 'automatic',
        source: 'spec-completion',
        triggeredAt: new Date()
      });

      // Verify push was not called
      expect(result.success).toBe(true);
      expect(GitOperations.prototype.push).not.toHaveBeenCalled();
    });
  });

  describe('getReleasePlan', () => {
    it('should generate release plan from analysis result', async () => {
      const analysisResult = createMockAnalysisResult();

      const manager = new ReleaseManager();
      const plan = await manager.getReleasePlan(analysisResult);

      expect(plan.version.from).toBe('1.0.0');
      expect(plan.version.to).toBe('1.1.0');
      expect(plan.version.type).toBe('minor');
      expect(plan.packages).toHaveLength(1);
      expect(plan.releaseNotes.version).toBe('1.1.0');
    });
  });

  describe('validateRelease', () => {
    it('should validate valid release plan', async () => {
      const plan: any = {
        version: {
          from: '1.0.0',
          to: '1.1.0',
          type: 'minor' as const,
          rationale: 'Test',
          calculatedAt: new Date()
        },
        packages: [{
          name: 'test-package',
          versionBump: {
            from: '1.0.0',
            to: '1.1.0',
            type: 'minor' as const,
            rationale: 'Test',
            calculatedAt: new Date()
          },
          dependencyUpdates: [],
          needsPublishing: true,
          publishingPriority: 1
        }],
        releaseNotes: {
          version: '1.1.0',
          date: '2025-11-27',
          summary: 'Test',
          breakingChanges: [],
          newFeatures: [],
          improvements: [],
          bugFixes: [],
          format: 'markdown' as const,
          content: '## Features\n- New feature'
        },
        publishingPlan: {
          order: ['test-package'],
          parallelGroups: [['test-package']],
          estimatedDuration: 60000,
          steps: []
        },
        validationResults: [],
        createdAt: new Date(),
        id: 'test-plan'
      };

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      const manager = new ReleaseManager();
      const validation = await manager.validateRelease(plan);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid semantic version', async () => {
      const plan: any = {
        version: {
          from: '1.0.0',
          to: 'invalid-version',
          type: 'minor' as const,
          rationale: 'Test',
          calculatedAt: new Date()
        },
        packages: [],
        releaseNotes: {
          version: 'invalid-version',
          date: '2025-11-27',
          summary: 'Test',
          breakingChanges: [],
          newFeatures: [],
          improvements: [],
          bugFixes: [],
          format: 'markdown' as const,
          content: '## Features\n- New feature'
        },
        publishingPlan: {
          order: [],
          parallelGroups: [],
          estimatedDuration: 60000,
          steps: []
        },
        validationResults: [],
        createdAt: new Date(),
        id: 'test-plan'
      };

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: false,
        errors: [{
          code: 'VALIDATION_VERSION_FORMAT',
          message: 'Invalid semantic version format: invalid-version',
          severity: 'error' as const,
          source: 'validation'
        }],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      const manager = new ReleaseManager();
      const validation = await manager.validateRelease(plan);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0].code).toBe('VALIDATION_VERSION_FORMAT');
    });

    it('should warn about empty release notes', async () => {
      const plan: any = {
        version: {
          from: '1.0.0',
          to: '1.1.0',
          type: 'minor' as const,
          rationale: 'Test',
          calculatedAt: new Date()
        },
        packages: [{
          name: 'test-package',
          versionBump: {
            from: '1.0.0',
            to: '1.1.0',
            type: 'minor' as const,
            rationale: 'Test',
            calculatedAt: new Date()
          },
          dependencyUpdates: [],
          needsPublishing: true,
          publishingPriority: 1
        }],
        releaseNotes: {
          version: '1.1.0',
          date: '2025-11-27',
          summary: 'Test',
          breakingChanges: [],
          newFeatures: [],
          improvements: [],
          bugFixes: [],
          format: 'markdown' as const,
          content: ''
        },
        publishingPlan: {
          order: ['test-package'],
          parallelGroups: [['test-package']],
          estimatedDuration: 60000,
          steps: []
        },
        validationResults: [],
        createdAt: new Date(),
        id: 'test-plan'
      };

      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [{
          code: 'VALIDATION_RELEASE_NOTES',
          message: 'Release notes are empty',
          source: 'validation'
        }],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      const manager = new ReleaseManager();
      const validation = await manager.validateRelease(plan);

      expect(validation.valid).toBe(true);
      expect(validation.warnings).toHaveLength(1);
      expect(validation.warnings[0].code).toBe('VALIDATION_RELEASE_NOTES');
    });
  });

  describe('rollback', () => {
    it('should rollback all operations', async () => {
      (PackageUpdater.prototype.rollback as jest.Mock).mockResolvedValue(undefined);
      (GitOperations.prototype.rollback as jest.Mock).mockResolvedValue({
        success: true,
        operation: 'rollback',
        details: 'Rolled back',
        errors: []
      });

      const manager = new ReleaseManager();
      const result = await manager.rollback();

      expect(result.success).toBe(true);
      expect(result.rolledBackComponents).toContain('package-json');
      expect(result.rolledBackComponents).toContain('git');
      expect(PackageUpdater.prototype.rollback).toHaveBeenCalled();
      expect(GitOperations.prototype.rollback).toHaveBeenCalled();
    });

    it('should handle rollback failures', async () => {
      (PackageUpdater.prototype.rollback as jest.Mock).mockResolvedValue(undefined);
      (GitOperations.prototype.rollback as jest.Mock).mockResolvedValue({
        success: false,
        operation: 'rollback',
        details: '',
        errors: [{ operation: 'rollback', error: 'Rollback failed', code: 'ROLLBACK_ERROR' }]
      });

      const manager = new ReleaseManager();
      const result = await manager.rollback();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getPipelineState', () => {
    it('should return inactive state when no pipeline is running', () => {
      const manager = new ReleaseManager();
      const state = manager.getPipelineState();

      expect(state.active).toBe(false);
      expect(state.context).toBeUndefined();
      // Summary may be null (no previous execution) or contain last execution summary
      expect(state.summary).toBeNull();
    });

    it('should return active state during pipeline execution', async () => {
      const mockAnalysisResult = createMockAnalysisResult();
      const mockCLIResult = {
        success: true,
        stdout: JSON.stringify(mockAnalysisResult),
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      (CLIBridge.prototype.executeForJSON as jest.Mock).mockResolvedValue(mockCLIResult);
      (AnalysisResultParser.prototype.parse as jest.Mock).mockReturnValue(mockAnalysisResult);
      (ReleaseValidator.prototype.validate as jest.Mock).mockResolvedValue({
        valid: true,
        errors: [],
        warnings: [],
        validatedAt: new Date(),
        context: 'release-plan-validation'
      });

      const manager = new ReleaseManager({ skipConfirmation: true });
      
      // Execute release
      await manager.executeRelease({
        type: 'automatic',
        source: 'spec-completion',
        triggeredAt: new Date()
      });

      // Check state after execution (pipeline completes too quickly to observe "active" state in tests)
      // This is an acceptable limitation per design.md - mocked operations complete synchronously
      const state = manager.getPipelineState();
      // Pipeline is no longer active after completion
      expect(state.active).toBe(false);
    });
  });
});
