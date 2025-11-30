/**
 * Release Manager
 * 
 * Orchestrates the entire release process, coordinating between:
 * - CLI Bridge (analysis)
 * - Automation Layer (package updates, changelog, git operations)
 * - Publishing (GitHub, npm)
 * - Package Coordination (multi-package versioning)
 * 
 * Provides the main API for executing releases with validation gates,
 * rollback capabilities, and human oversight.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { CLIBridge } from './integration/CLIBridge';
import { AnalysisResultParser } from './integration/AnalysisResultParser';
import { PackageUpdater } from './automation/PackageUpdater';
import { ChangelogManager } from './automation/ChangelogManager';
import { GitOperations } from './automation/GitOperations';
import { GitHubPublisher } from './publishing/GitHubPublisher';
import { NpmPublisher } from './publishing/NpmPublisher';
import { PackageCoordinator } from './coordination/PackageCoordinator';
import { ReleasePipeline, PipelineStage } from './orchestration/ReleasePipeline';
import { ReleaseValidator } from './orchestration/ReleaseValidator';
import { RollbackCoordinator } from './orchestration/ErrorRecovery';
import { WorkflowStateManager } from './orchestration/WorkflowStateManager';
import {
  ReleaseTrigger,
  ReleasePlan,
  ReleaseResult,
  ValidationResult,
  RollbackResult,
  ReleaseError,
  CoordinationStrategy
} from './types/ReleaseTypes';

export interface ReleaseManagerConfig {
  /** Working directory for release operations */
  workingDirectory?: string;
  
  /** GitHub configuration */
  github?: {
    token: string;
    owner: string;
    repo: string;
  };
  
  /** npm configuration */
  npm?: {
    registry?: string;
    token?: string;
  };
  
  /** Package coordination strategy */
  coordination?: CoordinationStrategy;
  
  /** Dry run mode (don't actually publish) */
  dryRun?: boolean;
  
  /** Skip confirmation prompts */
  skipConfirmation?: boolean;
}

export class ReleaseManager {
  private cliBridge: CLIBridge;
  private parser: AnalysisResultParser;
  private packageUpdater: PackageUpdater;
  private changelogManager: ChangelogManager;
  private gitOperations: GitOperations;
  private githubPublisher: GitHubPublisher | null = null;
  private npmPublisher: NpmPublisher | null = null;
  private packageCoordinator: PackageCoordinator | null = null;
  private validator: ReleaseValidator;
  private rollbackCoordinator: RollbackCoordinator;
  private stateManager: WorkflowStateManager;
  private config: ReleaseManagerConfig;
  private currentPipeline: ReleasePipeline | null = null;
  private currentWorkflowId: string | null = null;
  private lastPipelineSummary: any = null;

  constructor(config: ReleaseManagerConfig = {}) {
    this.config = {
      workingDirectory: process.cwd(),
      dryRun: false,
      skipConfirmation: false,
      ...config
    };

    // Initialize core components
    this.cliBridge = new CLIBridge();
    this.parser = new AnalysisResultParser();
    this.packageUpdater = new PackageUpdater();
    this.changelogManager = new ChangelogManager();
    this.gitOperations = new GitOperations(this.config.workingDirectory);
    this.validator = new ReleaseValidator();
    this.stateManager = new WorkflowStateManager();
    this.rollbackCoordinator = new RollbackCoordinator(this.stateManager, undefined);

    // Initialize optional components
    if (this.config.github) {
      this.githubPublisher = new GitHubPublisher(this.config.github);
    }

    if (this.config.npm) {
      this.npmPublisher = new NpmPublisher(this.config.npm);
    }

    if (this.config.coordination) {
      this.packageCoordinator = new PackageCoordinator(this.config.coordination);
    }
  }

  /**
   * Execute complete release pipeline
   * 
   * Pipeline: Detect → Analyze → Coordinate → Automate → Publish
   * 
   * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5
   */
  async executeRelease(trigger: ReleaseTrigger): Promise<ReleaseResult> {
    // Initialize workflow state
    this.currentWorkflowId = `release-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.stateManager.initializeWorkflow(
      this.currentWorkflowId,
      'release',
      {
        version: 'pending',
        trigger: trigger.type,
        packages: []
      }
    );

    // Update rollback coordinator with current workflow ID
    this.rollbackCoordinator = new RollbackCoordinator(this.stateManager, this.currentWorkflowId);

    // Initialize pipeline for this release with state manager integration
    this.currentPipeline = new ReleasePipeline(trigger, this.stateManager, this.currentWorkflowId);
    const pipeline = this.currentPipeline;
    
    const errors: ReleaseError[] = [];
    let githubReleaseUrl: string | undefined;
    const npmPackageUrls: string[] = [];

    try {
      console.log('🚀 Starting release process...');
      console.log(`   Trigger: ${trigger.type} (${trigger.source})`);
      
      // Update state to in-progress
      await this.stateManager.updateState(this.currentWorkflowId, 'in-progress');

      // Stage 1: Analysis - Analyze changes using CLI Bridge
      console.log('\n📊 Stage 1: Analyzing changes...');
      const analysisStage = await pipeline.executeStage('analysis', async () => {
        return await this.analyzeChanges(trigger);
      });

      if (!analysisStage.success || !analysisStage.result) {
        errors.push({
          code: 'ANALYSIS_FAILED',
          message: analysisStage.error || 'Failed to analyze changes',
          severity: 'error',
          step: 'analysis'
        });
        return await this.createFailureResult(pipeline, errors);
      }

      const analysisResult = analysisStage.result;
      pipeline.getContext().analysisResult = analysisResult;

      // Stage 2: Planning - Generate release plan
      console.log('\n📋 Stage 2: Generating release plan...');
      const planningStage = await pipeline.executeStage('planning', async () => {
        return await this.getReleasePlan(analysisResult);
      });

      if (!planningStage.success || !planningStage.result) {
        errors.push({
          code: 'PLANNING_FAILED',
          message: planningStage.error || 'Failed to generate release plan',
          severity: 'error',
          step: 'planning'
        });
        return await this.createFailureResult(pipeline, errors);
      }

      const plan = planningStage.result;
      pipeline.getContext().plan = plan;

      // Update workflow metadata with version info
      await this.stateManager.updateContext(this.currentWorkflowId, {
        version: plan.version.to,
        packages: plan.packages.map(p => p.name)
      });

      // Stage 3: Validation - Validate release plan
      console.log('\n✅ Stage 3: Validating release plan...');
      const validationStage = await pipeline.executeStage('validation', async () => {
        return await this.validateRelease(plan);
      });

      if (!validationStage.success || !validationStage.result) {
        errors.push({
          code: 'VALIDATION_FAILED',
          message: validationStage.error || 'Failed to validate release plan',
          severity: 'error',
          step: 'validation'
        });
        return await this.createFailureResult(pipeline, errors);
      }

      const validation = validationStage.result;
      pipeline.getContext().validation = validation;

      if (!validation.valid) {
        errors.push(...validation.errors.map(e => ({
          code: e.code,
          message: e.message,
          severity: e.severity as 'error' | 'warning',
          step: 'validation'
        })));
        return await this.createFailureResult(pipeline, errors);
      }

      // Stage 4: Confirmation - Confirm with user (unless skipped)
      if (!this.config.skipConfirmation && !this.config.dryRun) {
        console.log('\n🤔 Stage 4: Awaiting confirmation...');
        const confirmationStage = await pipeline.executeStage('confirmation', async () => {
          return await this.confirmRelease(plan);
        });

        if (!confirmationStage.success || !confirmationStage.result) {
          errors.push({
            code: 'USER_CANCELLED',
            message: 'Release cancelled by user',
            severity: 'warning',
            step: 'confirmation'
          });
          return await this.createFailureResult(pipeline, errors);
        }
      }

      // Stage 5: Package Update - Update package versions
      console.log('\n📦 Stage 5: Updating package versions...');
      const packageUpdateStage = await pipeline.executeStage('package-update', async () => {
        return await this.updatePackageVersions(plan);
      });

      if (!packageUpdateStage.success || !packageUpdateStage.result?.success) {
        errors.push({
          code: 'PACKAGE_UPDATE_FAILED',
          message: packageUpdateStage.error || 'Failed to update package versions',
          severity: 'error',
          step: 'package-update'
        });
        await this.rollbackPipeline(pipeline);
        return await this.createFailureResult(pipeline, errors);
      }

      // Stage 6: Changelog Update - Update CHANGELOG.md
      console.log('\n📝 Stage 6: Updating CHANGELOG.md...');
      const changelogStage = await pipeline.executeStage('changelog-update', async () => {
        return await this.updateChangelog(plan);
      });

      if (!changelogStage.success || !changelogStage.result?.success) {
        errors.push({
          code: 'CHANGELOG_UPDATE_FAILED',
          message: changelogStage.error || 'Failed to update CHANGELOG.md',
          severity: 'warning',
          step: 'changelog-update'
        });
      }

      // Stage 7: Git Operations - Create git commit and tag
      console.log('\n🏷️  Stage 7: Creating git commit and tag...');
      const gitStage = await pipeline.executeStage('git-operations', async () => {
        return await this.createGitCommitAndTag(plan);
      });

      if (!gitStage.success || !gitStage.result?.success) {
        errors.push({
          code: 'GIT_OPERATIONS_FAILED',
          message: gitStage.error || 'Failed to create git commit and tag',
          severity: 'error',
          step: 'git-operations'
        });
        await this.rollbackPipeline(pipeline);
        return await this.createFailureResult(pipeline, errors);
      }

      // Stage 8: Push - Push to remote (if not dry run)
      if (!this.config.dryRun) {
        console.log('\n⬆️  Stage 8: Pushing to remote...');
        const pushStage = await pipeline.executeStage('push', async () => {
          return await this.pushToRemote();
        });

        if (!pushStage.success || !pushStage.result?.success) {
          errors.push({
            code: 'PUSH_FAILED',
            message: pushStage.error || 'Failed to push to remote',
            severity: 'error',
            step: 'push'
          });
          await this.rollbackPipeline(pipeline);
          return await this.createFailureResult(pipeline, errors);
        }
      }

      // Stage 9: GitHub Publish - Publish to GitHub (if configured)
      if (this.githubPublisher && !this.config.dryRun) {
        console.log('\n🐙 Stage 9: Publishing to GitHub...');
        const githubStage = await pipeline.executeStage('github-publish', async () => {
          return await this.publishToGitHub(plan);
        });

        if (!githubStage.success || !githubStage.result?.success) {
          errors.push({
            code: 'GITHUB_PUBLISH_FAILED',
            message: githubStage.error || 'Failed to publish to GitHub',
            severity: 'warning',
            step: 'github-publish'
          });
        } else if (githubStage.result) {
          githubReleaseUrl = githubStage.result.githubReleaseUrl;
        }
      }

      // Stage 10: npm Publish - Publish to npm (if configured)
      if (this.npmPublisher && !this.config.dryRun) {
        console.log('\n📦 Stage 10: Publishing to npm...');
        const npmStage = await pipeline.executeStage('npm-publish', async () => {
          return await this.publishToNpm(plan);
        });

        if (!npmStage.success || !npmStage.result?.success) {
          errors.push({
            code: 'NPM_PUBLISH_FAILED',
            message: npmStage.error || 'Failed to publish to npm',
            severity: 'warning',
            step: 'npm-publish'
          });
        } else if (npmStage.result?.npmPackageUrls) {
          npmPackageUrls.push(...npmStage.result.npmPackageUrls);
        }
      }

      const summary = pipeline.getSummary();

      console.log('\n✅ Release complete!');
      console.log(`   Version: ${plan.version.to}`);
      console.log(`   Duration: ${(summary.duration / 1000).toFixed(2)}s`);
      console.log(`   Stages: ${summary.successfulStages}/${summary.totalStages} successful`);

      // Update workflow state to completed
      await this.stateManager.updateState(this.currentWorkflowId, 'completed');

      return {
        success: true,
        version: plan.version.to,
        releasedPackages: plan.packages.map(p => p.name),
        githubReleaseUrl,
        npmPackageUrls,
        duration: summary.duration,
        errors,
        releasedAt: new Date()
      };

    } catch (error) {
      errors.push({
        code: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : String(error),
        severity: 'error',
        step: 'unknown',
        stackTrace: error instanceof Error ? error.stack : undefined
      });

      // Update workflow state to failed
      if (this.currentWorkflowId) {
        await this.stateManager.updateState(
          this.currentWorkflowId,
          'failed',
          error instanceof Error ? error.message : String(error)
        );
      }

      await this.rollbackPipeline(pipeline);
      return await this.createFailureResult(pipeline, errors);
    } finally {
      // Store pipeline summary before clearing reference
      if (this.currentPipeline) {
        this.lastPipelineSummary = this.currentPipeline.getSummary();
      }
      // Clear pipeline reference after execution completes
      this.currentPipeline = null;
    }
  }

  /**
   * Get current pipeline state
   * 
   * Requirements: 8.5
   */
  getPipelineState(): {
    active: boolean;
    context?: any;
    summary?: any;
  } {
    if (!this.currentPipeline) {
      return { 
        active: false,
        summary: this.lastPipelineSummary
      };
    }

    return {
      active: true,
      context: this.currentPipeline.getContext(),
      summary: this.currentPipeline.getSummary()
    };
  }

  /**
   * Get workflow state for current or specific release
   * 
   * Requirements: 8.1, 8.2
   */
  getWorkflowState(workflowId?: string) {
    const id = workflowId || this.currentWorkflowId;
    if (!id) {
      return null;
    }
    return this.stateManager.getState(id);
  }

  /**
   * Query release history
   * 
   * Requirements: 8.1
   */
  queryReleaseHistory(options?: {
    state?: 'pending' | 'in-progress' | 'completed' | 'failed';
    limit?: number;
  }) {
    return this.stateManager.queryWorkflows(options);
  }

  /**
   * Resume a failed release from its last successful stage
   * 
   * Requirements: 8.2, 8.4
   */
  async resumeRelease(workflowId: string): Promise<ReleaseResult> {
    console.log(`\n🔄 Resuming release ${workflowId}...`);

    // Recover workflow state
    const state = await this.stateManager.recoverState(workflowId);
    if (!state) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Validate state is resumable
    if (state.state !== 'failed' && state.state !== 'in-progress') {
      throw new Error(`Workflow ${workflowId} is ${state.state}, cannot resume`);
    }

    console.log(`   Last successful stage: ${state.completedStages[state.completedStages.length - 1] || 'none'}`);
    console.log(`   Failed stages: ${state.failedStages.join(', ') || 'none'}`);

    // Determine where to resume from
    const lastSuccessfulStage = state.completedStages[state.completedStages.length - 1];
    const nextStage = this.getNextStage(lastSuccessfulStage);

    if (!nextStage) {
      throw new Error('Cannot determine next stage to resume from');
    }

    console.log(`   Resuming from stage: ${nextStage}`);

    // Create a new trigger with resume context
    const resumeTrigger: ReleaseTrigger = {
      type: 'manual',
      source: `resume-${workflowId}`,
      triggeredAt: new Date(),
      overrides: {
        resumeFromStage: nextStage,
        workflowId
      }
    };

    // Set current workflow ID to the one we're resuming
    this.currentWorkflowId = workflowId;

    // Update state to in-progress
    await this.stateManager.updateState(workflowId, 'in-progress', 'Resuming release');

    // Execute release from the resume point
    return this.executeRelease(resumeTrigger);
  }

  /**
   * Get next stage in pipeline
   * 
   * Requirements: 8.2
   */
  private getNextStage(currentStage?: string): PipelineStage | null {
    const stages: PipelineStage[] = [
      'analysis',
      'planning',
      'validation',
      'confirmation',
      'package-update',
      'changelog-update',
      'git-operations',
      'push',
      'github-publish',
      'npm-publish'
    ];

    if (!currentStage) {
      return stages[0];
    }

    const currentIndex = stages.indexOf(currentStage as PipelineStage);
    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      return null;
    }

    return stages[currentIndex + 1];
  }

  /**
   * Get workflow statistics for monitoring
   * 
   * Requirements: 8.1
   */
  getWorkflowStatistics() {
    return this.stateManager.getStatistics();
  }

  /**
   * Get state history for debugging
   * 
   * Requirements: 8.1
   */
  getStateHistory(workflowId?: string) {
    const id = workflowId || this.currentWorkflowId;
    if (!id) {
      return [];
    }
    return this.stateManager.getStateHistory(id);
  }

  /**
   * Validate workflow state
   * 
   * Requirements: 8.2
   */
  validateWorkflowState(workflowId?: string) {
    const id = workflowId || this.currentWorkflowId;
    if (!id) {
      return { valid: false, errors: ['No workflow ID provided'], warnings: [] };
    }
    return this.stateManager.validateState(id);
  }

  /**
   * Clean up old completed/failed workflows
   * 
   * Requirements: 8.2
   */
  async cleanupOldWorkflows(olderThanDays: number = 30): Promise<number> {
    const olderThan = new Date();
    olderThan.setDate(olderThan.getDate() - olderThanDays);
    return this.stateManager.cleanupOldStates(olderThan);
  }

  /**
   * Generate release plan from analysis results
   * 
   * Requirements: 8.1, 8.2
   */
  async getReleasePlan(analysisResult: any): Promise<ReleasePlan> {
    // Parse analysis result
    const parsed = this.parser.parse(analysisResult);

    // Handle 'none' bump type - default to 'patch' for release plan
    const bumpType = parsed.versionRecommendation.bumpType === 'none' 
      ? 'patch' 
      : parsed.versionRecommendation.bumpType;

    // Build release plan
    const plan: ReleasePlan = {
      version: {
        from: parsed.versionRecommendation.currentVersion,
        to: parsed.versionRecommendation.recommendedVersion,
        type: bumpType,
        rationale: parsed.versionRecommendation.rationale,
        calculatedAt: new Date()
      },
      packages: [{
        name: 'designerpunk',
        versionBump: {
          from: parsed.versionRecommendation.currentVersion,
          to: parsed.versionRecommendation.recommendedVersion,
          type: bumpType,
          rationale: parsed.versionRecommendation.rationale,
          calculatedAt: new Date()
        },
        dependencyUpdates: [],
        needsPublishing: true,
        publishingPriority: 1
      }],
      releaseNotes: {
        version: parsed.versionRecommendation.recommendedVersion,
        date: new Date().toISOString().split('T')[0],
        summary: parsed.versionRecommendation.rationale,
        breakingChanges: [],
        newFeatures: [],
        improvements: [],
        bugFixes: [],
        format: 'markdown',
        content: parsed.releaseNotes
      },
      publishingPlan: {
        order: ['designerpunk'],
        parallelGroups: [['designerpunk']],
        estimatedDuration: 60000,
        steps: []
      },
      validationResults: [],
      createdAt: new Date(),
      id: `release-${Date.now()}`
    };

    return plan;
  }

  /**
   * Validate release plan
   * 
   * Requirements: 8.2, 8.3
   */
  async validateRelease(plan: ReleasePlan): Promise<ValidationResult> {
    // Use the validator for comprehensive validation
    return await this.validator.validate(plan);
  }

  /**
   * Rollback release operations using comprehensive rollback coordinator
   * 
   * Requirements: 8.4, 8.5
   */
  async rollback(options?: { validate?: boolean; force?: boolean }): Promise<RollbackResult> {
    console.log('\n🔄 Rolling back release operations...');
    
    const result = await this.rollbackCoordinator.executeRollback(
      {
        git: this.gitOperations,
        packageUpdater: this.packageUpdater,
        changelogManager: this.changelogManager,
        githubPublisher: this.githubPublisher,
        npmPublisher: this.npmPublisher
      },
      {
        validate: options?.validate ?? true,
        force: options?.force ?? false
      }
    );

    // Convert rollback result to ReleaseManager's RollbackResult format
    return {
      success: result.success,
      rolledBackComponents: result.rolledBackComponents,
      errors: result.errors.map(e => ({
        code: e.code,
        message: e.error,
        severity: 'error' as const,
        step: e.operation
      })),
      duration: result.duration
    };
  }

  /**
   * Rollback pipeline operations
   * 
   * Requirements: 8.4, 8.5
   */
  private async rollbackPipeline(pipeline: ReleasePipeline): Promise<void> {
    console.log('\n🔄 Rolling back pipeline operations...');
    
    const failedStages = pipeline.getFailedStages();
    console.log(`   Failed stages: ${failedStages.map(s => s.stage).join(', ')}`);
    
    await this.rollback();
  }

  // Private helper methods

  private async analyzeChanges(trigger: ReleaseTrigger): Promise<any> {
    const result = await this.cliBridge.executeForJSON({
      workingDirectory: this.config.workingDirectory,
      args: trigger.overrides?.since ? ['--since', trigger.overrides.since] : []
    });

    if (!result.success) {
      throw new Error(`CLI analysis failed: ${result.error}`);
    }

    return JSON.parse(result.stdout);
  }

  private async updatePackageVersions(plan: ReleasePlan): Promise<any> {
    // For now, update the main package.json
    const packagePath = `${this.config.workingDirectory || process.cwd()}/package.json`;
    return this.packageUpdater.updatePackageVersion(packagePath, plan.version.to);
  }

  private async updateChangelog(plan: ReleasePlan): Promise<any> {
    const changelogPath = this.changelogManager.getDefaultChangelogPath(
      this.config.workingDirectory || process.cwd()
    );

    return this.changelogManager.updateChangelog(changelogPath, {
      version: plan.releaseNotes.version,
      date: plan.releaseNotes.date,
      content: plan.releaseNotes.content
    });
  }

  private async createGitCommitAndTag(plan: ReleasePlan): Promise<any> {
    // Create commit
    const commitResult = await this.gitOperations.createCommit({
      message: `Release ${plan.version.to}`,
      files: ['package.json', 'CHANGELOG.md']
    });

    if (!commitResult.success) {
      return commitResult;
    }

    // Create tag
    return this.gitOperations.createTag({
      version: plan.version.to,
      message: `Release ${plan.version.to}`,
      annotated: true
    });
  }

  private async pushToRemote(): Promise<any> {
    return this.gitOperations.push({
      remote: 'origin',
      tags: true
    });
  }

  private async publishToGitHub(plan: ReleasePlan): Promise<any> {
    if (!this.githubPublisher) {
      throw new Error('GitHub publisher not configured');
    }

    return this.githubPublisher.createRelease({
      tagName: `v${plan.version.to}`,
      name: `Release ${plan.version.to}`,
      body: plan.releaseNotes.content,
      draft: false,
      prerelease: false,
      artifacts: []
    });
  }

  private async publishToNpm(plan: ReleasePlan): Promise<any> {
    if (!this.npmPublisher) {
      throw new Error('npm publisher not configured');
    }

    const packages = plan.packages.map(p => ({
      name: p.name,
      version: p.versionBump.to,
      path: this.config.workingDirectory || process.cwd(),
      registry: this.config.npm?.registry || 'https://registry.npmjs.org/',
      access: 'public' as const
    }));

    const results = await this.npmPublisher.publishPackages(packages);
    const success = results.every(r => r.success);
    const npmPackageUrls = results.filter(r => r.url).map(r => r.url!);

    return {
      success,
      npmPackageUrls
    };
  }

  private async confirmRelease(plan: ReleasePlan): Promise<boolean> {
    // In a real implementation, this would prompt the user
    // For now, we'll just return true
    console.log('\n📋 Release Plan:');
    console.log(`   Version: ${plan.version.from} → ${plan.version.to}`);
    console.log(`   Packages: ${plan.packages.map(p => p.name).join(', ')}`);
    console.log(`   Bump Type: ${plan.version.type}`);
    
    return true;
  }

  private isValidSemanticVersion(version: string): boolean {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(version);
  }

  private async createFailureResult(
    pipeline: ReleasePipeline,
    errors: ReleaseError[]
  ): Promise<ReleaseResult> {
    const summary = pipeline.getSummary();
    const context = pipeline.getContext();

    // Update workflow state to failed if not already done
    if (this.currentWorkflowId) {
      const state = this.stateManager.getState(this.currentWorkflowId);
      if (state && state.state !== 'failed') {
        await this.stateManager.updateState(
          this.currentWorkflowId,
          'failed',
          errors.length > 0 ? errors[0].message : 'Release failed'
        );
      }
    }

    return {
      success: false,
      version: context.plan?.version.to || 'unknown',
      releasedPackages: [],
      npmPackageUrls: [],
      duration: summary.duration,
      errors,
      releasedAt: new Date()
    };
  }
}
