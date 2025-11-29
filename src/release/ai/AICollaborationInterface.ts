/**
 * AI Collaboration Interface
 * 
 * Provides clear, structured interfaces for AI agents to interact with
 * the release management system. Focuses on status reporting, progress
 * tracking, and actionable guidance.
 * 
 * Requirements: 6.5
 */

import { ReleaseManager } from '../ReleaseManager';
import {
  ReleaseTrigger,
  ReleasePlan,
  ReleaseResult,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ReleaseError
} from '../types/ReleaseTypes';

/**
 * AI-friendly release status
 */
export interface AIReleaseStatus {
  /** Current state of the release */
  state: 'idle' | 'analyzing' | 'planning' | 'validating' | 'executing' | 'publishing' | 'completed' | 'failed';
  
  /** Current stage being executed */
  currentStage?: string;
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Human-readable status message */
  message: string;
  
  /** Version being released */
  version?: string;
  
  /** Packages being released */
  packages: string[];
  
  /** Errors encountered */
  errors: AIError[];
  
  /** Warnings that don't block release */
  warnings: AIWarning[];
  
  /** Timestamp of last update */
  lastUpdated: Date;
  
  /** Estimated time remaining (milliseconds) */
  estimatedTimeRemaining?: number;
  
  /** Can the release be resumed if failed? */
  resumable: boolean;
  
  /** Workflow ID for tracking */
  workflowId?: string;
}

/**
 * AI-friendly error with actionable guidance
 */
export interface AIError {
  /** Error code for programmatic handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Severity level */
  severity: 'error' | 'critical';
  
  /** Which step failed */
  step: string;
  
  /** Actionable guidance for resolution */
  guidance: string;
  
  /** Can this error be automatically recovered? */
  recoverable: boolean;
  
  /** Suggested actions to resolve */
  suggestedActions: string[];
  
  /** Related documentation links */
  documentation?: string[];
}

/**
 * AI-friendly warning
 */
export interface AIWarning {
  /** Warning code */
  code: string;
  
  /** Warning message */
  message: string;
  
  /** Which step generated the warning */
  step: string;
  
  /** Guidance on whether to proceed */
  guidance: string;
  
  /** Can this be safely ignored? */
  ignorable: boolean;
}

/**
 * AI-friendly progress update
 */
export interface AIProgressUpdate {
  /** Stage that just completed or started */
  stage: string;
  
  /** Stage status */
  status: 'started' | 'in-progress' | 'completed' | 'failed';
  
  /** Progress percentage for this stage (0-100) */
  stageProgress: number;
  
  /** Overall progress percentage (0-100) */
  overallProgress: number;
  
  /** Human-readable message */
  message: string;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Additional context */
  context?: Record<string, any>;
}

/**
 * AI-friendly release summary
 */
export interface AIReleaseSummary {
  /** Was the release successful? */
  success: boolean;
  
  /** Version released */
  version: string;
  
  /** Packages released */
  packages: string[];
  
  /** Duration in milliseconds */
  duration: number;
  
  /** Human-readable duration */
  durationFormatted: string;
  
  /** GitHub release URL */
  githubUrl?: string;
  
  /** npm package URLs */
  npmUrls: string[];
  
  /** Summary of what was released */
  summary: string;
  
  /** Errors encountered */
  errors: AIError[];
  
  /** Warnings encountered */
  warnings: AIWarning[];
  
  /** Next steps or recommendations */
  nextSteps: string[];
  
  /** Timestamp */
  completedAt: Date;
}

/**
 * AI Collaboration Interface
 * 
 * Wraps ReleaseManager with AI-friendly methods and clear status reporting
 */
export class AICollaborationInterface {
  private releaseManager: ReleaseManager;
  private progressCallbacks: ((update: AIProgressUpdate) => void)[] = [];

  constructor(releaseManager: ReleaseManager) {
    this.releaseManager = releaseManager;
  }

  /**
   * Get current release status in AI-friendly format
   * 
   * Requirements: 6.5
   */
  getStatus(): AIReleaseStatus {
    const pipelineState = this.releaseManager.getPipelineState();
    const workflowState = this.releaseManager.getWorkflowState();

    if (!pipelineState.active) {
      return {
        state: 'idle',
        progress: 0,
        message: 'No active release',
        packages: [],
        errors: [],
        warnings: [],
        lastUpdated: new Date(),
        resumable: false
      };
    }

    const summary = pipelineState.summary;
    const context = pipelineState.context;

    // Calculate progress
    const totalStages = summary?.totalStages || 10;
    const completedStages = summary?.successfulStages || 0;
    const progress = Math.round((completedStages / totalStages) * 100);

    // Determine current state
    let state: AIReleaseStatus['state'] = 'executing';
    if (summary?.failedStages && summary.failedStages.length > 0) {
      state = 'failed';
    } else if (completedStages === totalStages) {
      state = 'completed';
    } else if (completedStages === 0) {
      state = 'analyzing';
    }

    // Get current stage
    const currentStage = summary?.currentStage;

    // Convert errors to AI-friendly format
    const errors = this.convertErrors(context?.errors || []);
    const warnings = this.convertWarnings(context?.warnings || []);

    return {
      state,
      currentStage,
      progress,
      message: this.getStatusMessage(state, currentStage),
      version: context?.plan?.version.to,
      packages: context?.plan?.packages.map((p: any) => p.name) || [],
      errors,
      warnings,
      lastUpdated: new Date(),
      estimatedTimeRemaining: this.estimateTimeRemaining(progress, summary?.duration),
      resumable: state === 'failed' && workflowState?.state === 'failed',
      workflowId: workflowState?.id
    };
  }

  /**
   * Execute release with progress tracking
   * 
   * Requirements: 6.5
   */
  async executeRelease(trigger: ReleaseTrigger): Promise<AIReleaseSummary> {
    // Notify progress: Starting
    this.notifyProgress({
      stage: 'initialization',
      status: 'started',
      stageProgress: 0,
      overallProgress: 0,
      message: 'Starting release process...',
      timestamp: new Date()
    });

    const startTime = Date.now();
    const result = await this.releaseManager.executeRelease(trigger);
    const duration = Date.now() - startTime;

    // Convert to AI-friendly summary
    return this.convertToSummary(result, duration);
  }

  /**
   * Resume a failed release
   * 
   * Requirements: 6.5
   */
  async resumeRelease(workflowId: string): Promise<AIReleaseSummary> {
    this.notifyProgress({
      stage: 'resume',
      status: 'started',
      stageProgress: 0,
      overallProgress: 0,
      message: `Resuming release ${workflowId}...`,
      timestamp: new Date()
    });

    const startTime = Date.now();
    const result = await this.releaseManager.resumeRelease(workflowId);
    const duration = Date.now() - startTime;

    return this.convertToSummary(result, duration);
  }

  /**
   * Get release history
   * 
   * Requirements: 6.5
   */
  getReleaseHistory(options?: {
    state?: 'pending' | 'in-progress' | 'completed' | 'failed';
    limit?: number;
  }): Array<{
    id: string;
    state: string;
    version?: string;
    packages: string[];
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
  }> {
    const workflows = this.releaseManager.queryReleaseHistory(options);
    
    return workflows.map(w => ({
      id: w.id,
      state: w.state,
      version: w.context?.version,
      packages: w.context?.packages || [],
      startedAt: w.startedAt,
      completedAt: w.completedAt,
      duration: w.completedAt ? w.completedAt.getTime() - w.startedAt.getTime() : undefined
    }));
  }

  /**
   * Validate a release plan before execution
   * 
   * Requirements: 6.5
   */
  async validateReleasePlan(plan: ReleasePlan): Promise<{
    valid: boolean;
    errors: AIError[];
    warnings: AIWarning[];
    guidance: string;
  }> {
    const validation = await this.releaseManager.validateRelease(plan);

    const errors = this.convertErrors(validation.errors);
    const warnings = this.convertWarnings(validation.warnings);

    let guidance = '';
    if (!validation.valid) {
      guidance = 'Release plan has validation errors that must be resolved before proceeding.';
      if (errors.length > 0) {
        guidance += ` Primary issue: ${errors[0].message}`;
      }
    } else if (warnings.length > 0) {
      guidance = 'Release plan is valid but has warnings. Review warnings before proceeding.';
    } else {
      guidance = 'Release plan is valid and ready for execution.';
    }

    return {
      valid: validation.valid,
      errors,
      warnings,
      guidance
    };
  }

  /**
   * Register progress callback for real-time updates
   * 
   * Requirements: 6.5
   */
  onProgress(callback: (update: AIProgressUpdate) => void): void {
    this.progressCallbacks.push(callback);
  }

  /**
   * Get actionable guidance for current state
   * 
   * Requirements: 6.5
   */
  getGuidance(): string {
    const status = this.getStatus();

    switch (status.state) {
      case 'idle':
        return 'No active release. Use executeRelease() to start a new release.';
      
      case 'analyzing':
        return 'Analyzing changes to determine version bump and generate release notes.';
      
      case 'planning':
        return 'Generating release plan based on analysis results.';
      
      case 'validating':
        return 'Validating release plan against semantic versioning rules and safety checks.';
      
      case 'executing':
        return `Executing release: ${status.currentStage || 'in progress'}. Progress: ${status.progress}%`;
      
      case 'publishing':
        return 'Publishing release to GitHub and npm registries.';
      
      case 'completed':
        return `Release ${status.version} completed successfully. ${status.packages.length} package(s) released.`;
      
      case 'failed':
        if (status.resumable) {
          return `Release failed at ${status.currentStage}. Use resumeRelease() to retry from last successful stage.`;
        }
        return `Release failed at ${status.currentStage}. Review errors and start a new release.`;
      
      default:
        return 'Unknown state. Check status for details.';
    }
  }

  /**
   * Get statistics about release system
   * 
   * Requirements: 6.5
   */
  getStatistics(): {
    totalReleases: number;
    successfulReleases: number;
    failedReleases: number;
    averageDuration: number;
    successRate: number;
  } {
    const stats = this.releaseManager.getWorkflowStatistics();
    
    const completed = stats.byState['completed'] || 0;
    const failed = stats.byState['failed'] || 0;
    const total = completed + failed;
    const successRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      totalReleases: total,
      successfulReleases: completed,
      failedReleases: failed,
      averageDuration: stats.averageDuration,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  // Private helper methods

  private convertErrors(errors: ValidationError[]): AIError[] {
    return errors.map(error => ({
      code: error.code,
      message: error.message,
      severity: error.severity === 'warning' || error.severity === 'info' ? 'error' : 'critical',
      step: error.source || 'unknown',
      guidance: this.getErrorGuidance(error),
      recoverable: this.isRecoverable(error),
      suggestedActions: this.getSuggestedActions(error),
      documentation: this.getDocumentationLinks(error)
    }));
  }

  private convertWarnings(warnings: ValidationWarning[]): AIWarning[] {
    return warnings.map(warning => ({
      code: warning.code || 'UNKNOWN_WARNING',
      message: warning.message,
      step: warning.source || 'unknown',
      guidance: this.getWarningGuidance(warning),
      ignorable: this.isIgnorable(warning)
    }));
  }

  private getErrorGuidance(error: ValidationError): string {
    const guidanceMap: Record<string, string> = {
      'ANALYSIS_FAILED': 'Check that completion documents exist and are properly formatted. Ensure release-analysis CLI is working.',
      'PLANNING_FAILED': 'Verify analysis results are valid. Check that version calculation logic is working correctly.',
      'VALIDATION_FAILED': 'Review validation errors. Ensure release plan follows semantic versioning rules.',
      'PACKAGE_UPDATE_FAILED': 'Check package.json file permissions and format. Ensure version is valid.',
      'CHANGELOG_UPDATE_FAILED': 'Verify CHANGELOG.md exists and is writable. Check markdown formatting.',
      'GIT_OPERATIONS_FAILED': 'Ensure git repository is clean and up to date. Check git credentials.',
      'PUSH_FAILED': 'Verify network connectivity and git remote configuration. Check authentication.',
      'GITHUB_PUBLISH_FAILED': 'Check GitHub token permissions. Verify repository access.',
      'NPM_PUBLISH_FAILED': 'Verify npm token and registry configuration. Check package access.',
      'USER_CANCELLED': 'User cancelled the release. No action needed.',
      'UNEXPECTED_ERROR': 'An unexpected error occurred. Check logs for details.'
    };

    return guidanceMap[error.code] || 'Review error details and check system logs.';
  }

  private getWarningGuidance(warning: any): string {
    return 'This warning does not block the release but should be reviewed.';
  }

  private isRecoverable(error: ValidationError): boolean {
    const recoverableCodes = [
      'CHANGELOG_UPDATE_FAILED',
      'GITHUB_PUBLISH_FAILED',
      'NPM_PUBLISH_FAILED'
    ];
    return recoverableCodes.includes(error.code);
  }

  private isIgnorable(warning: any): boolean {
    // Most warnings are ignorable but should be reviewed
    return true;
  }

  private getSuggestedActions(error: ValidationError): string[] {
    const actionsMap: Record<string, string[]> = {
      'ANALYSIS_FAILED': [
        'Verify completion documents exist in .kiro/specs/*/completion/',
        'Run release-analysis CLI manually to test',
        'Check CLI output for specific errors'
      ],
      'VALIDATION_FAILED': [
        'Review validation errors in detail',
        'Ensure version bump follows semantic versioning',
        'Check that breaking changes are documented'
      ],
      'PACKAGE_UPDATE_FAILED': [
        'Check package.json file permissions',
        'Verify package.json is valid JSON',
        'Ensure version format is correct (x.y.z)'
      ],
      'GIT_OPERATIONS_FAILED': [
        'Run git status to check repository state',
        'Ensure working directory is clean',
        'Verify git credentials are configured'
      ],
      'PUSH_FAILED': [
        'Check network connectivity',
        'Verify git remote is configured correctly',
        'Ensure you have push permissions'
      ],
      'GITHUB_PUBLISH_FAILED': [
        'Verify GitHub token has repo and write:packages permissions',
        'Check that repository exists and is accessible',
        'Ensure tag was created successfully'
      ],
      'NPM_PUBLISH_FAILED': [
        'Verify npm token is valid',
        'Check package name is available',
        'Ensure you have publish permissions'
      ]
    };

    return actionsMap[error.code] || ['Review error details', 'Check system logs', 'Contact support if issue persists'];
  }

  private getDocumentationLinks(error: ValidationError): string[] {
    const docsMap: Record<string, string[]> = {
      'ANALYSIS_FAILED': [
        'docs/release-analysis-system.md',
        '.kiro/specs/release-management-system/design.md'
      ],
      'VALIDATION_FAILED': [
        'docs/semantic-versioning.md',
        '.kiro/specs/release-management-system/design.md#validation'
      ],
      'GITHUB_PUBLISH_FAILED': [
        'docs/github-integration.md',
        'https://docs.github.com/en/rest/releases'
      ],
      'NPM_PUBLISH_FAILED': [
        'docs/npm-publishing.md',
        'https://docs.npmjs.com/cli/publish'
      ]
    };

    return docsMap[error.code] || [];
  }

  private getStatusMessage(state: AIReleaseStatus['state'], currentStage?: string): string {
    const messages: Record<AIReleaseStatus['state'], string> = {
      'idle': 'No active release',
      'analyzing': 'Analyzing changes and calculating version bump',
      'planning': 'Generating release plan',
      'validating': 'Validating release plan',
      'executing': currentStage ? `Executing: ${currentStage}` : 'Executing release',
      'publishing': 'Publishing to GitHub and npm',
      'completed': 'Release completed successfully',
      'failed': 'Release failed'
    };

    return messages[state];
  }

  private estimateTimeRemaining(progress: number, elapsedMs?: number): number | undefined {
    if (!elapsedMs || progress === 0) {
      return undefined;
    }

    const totalEstimated = (elapsedMs / progress) * 100;
    return Math.max(0, totalEstimated - elapsedMs);
  }

  private convertToSummary(result: ReleaseResult, duration: number): AIReleaseSummary {
    const errors = this.convertErrors(result.errors);
    const warnings: AIWarning[] = []; // Extract warnings if available

    const durationSeconds = Math.round(duration / 1000);
    const durationFormatted = this.formatDuration(durationSeconds);

    let summary = '';
    if (result.success) {
      summary = `Successfully released version ${result.version}`;
      if (result.releasedPackages.length > 0) {
        summary += ` for ${result.releasedPackages.length} package(s)`;
      }
    } else {
      summary = `Release failed: ${errors.length > 0 ? errors[0].message : 'Unknown error'}`;
    }

    const nextSteps: string[] = [];
    if (result.success) {
      nextSteps.push('Verify release on GitHub');
      if (result.npmPackageUrls.length > 0) {
        nextSteps.push('Verify packages on npm');
      }
      nextSteps.push('Update documentation if needed');
      nextSteps.push('Notify team of release');
    } else {
      if (errors.some(e => e.recoverable)) {
        nextSteps.push('Review errors and use resumeRelease() to retry');
      } else {
        nextSteps.push('Review errors and fix issues');
        nextSteps.push('Start a new release when ready');
      }
    }

    return {
      success: result.success,
      version: result.version,
      packages: result.releasedPackages,
      duration,
      durationFormatted,
      githubUrl: result.githubReleaseUrl,
      npmUrls: result.npmPackageUrls,
      summary,
      errors,
      warnings,
      nextSteps,
      completedAt: result.releasedAt
    };
  }

  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  private notifyProgress(update: AIProgressUpdate): void {
    this.progressCallbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in progress callback:', error);
      }
    });
  }
}
