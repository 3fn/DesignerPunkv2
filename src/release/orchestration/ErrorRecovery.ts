/**
 * Error Recovery Strategies
 * 
 * Implements comprehensive error recovery for the release management system:
 * - Recovery strategies per failure type (transient, permanent, partial)
 * - Retry logic with exponential backoff
 * - Partial completion handling and resume capabilities
 * - Recovery decision engine based on failure context
 * 
 * Requirements: 8.3, 8.4, 8.5
 */

import { ReleaseError } from '../types/ReleaseTypes';

/**
 * Error classification types
 */
export type ErrorType = 'transient' | 'permanent' | 'partial';

/**
 * Recovery action types
 */
export type RecoveryAction = 
  | 'retry'           // Retry the operation
  | 'skip'            // Skip this operation and continue
  | 'rollback'        // Rollback all operations
  | 'manual'          // Require manual intervention
  | 'resume';         // Resume from checkpoint

/**
 * Error classification result
 */
export interface ErrorClassification {
  /** Error type classification */
  type: ErrorType;
  
  /** Whether error is recoverable */
  recoverable: boolean;
  
  /** Recommended recovery action */
  recommendedAction: RecoveryAction;
  
  /** Confidence in classification (0-1) */
  confidence: number;
  
  /** Reasoning for classification */
  reasoning: string;
}

/**
 * Recovery strategy configuration
 */
export interface RecoveryStrategy {
  /** Maximum retry attempts */
  maxRetries: number;
  
  /** Initial retry delay in milliseconds */
  initialDelay: number;
  
  /** Maximum retry delay in milliseconds */
  maxDelay: number;
  
  /** Backoff multiplier */
  backoffMultiplier: number;
  
  /** Whether to use exponential backoff */
  exponentialBackoff: boolean;
  
  /** Timeout for each retry attempt */
  retryTimeout?: number;
}

/**
 * Recovery attempt result
 */
export interface RecoveryAttempt {
  /** Attempt number */
  attempt: number;
  
  /** Whether attempt succeeded */
  success: boolean;
  
  /** Error if attempt failed */
  error?: ReleaseError;
  
  /** Delay before this attempt */
  delay: number;
  
  /** Timestamp of attempt */
  timestamp: Date;
}

/**
 * Recovery result
 */
export interface RecoveryResult {
  /** Whether recovery succeeded */
  success: boolean;
  
  /** Recovery action taken */
  action: RecoveryAction;
  
  /** All recovery attempts */
  attempts: RecoveryAttempt[];
  
  /** Final error if recovery failed */
  finalError?: ReleaseError;
  
  /** Total recovery duration */
  duration: number;
  
  /** Recovery metadata */
  metadata: {
    errorType: ErrorType;
    retriesUsed: number;
    maxRetriesAllowed: number;
    totalDelay: number;
  };
}

/**
 * Checkpoint for partial completion handling
 */
export interface RecoveryCheckpoint {
  /** Checkpoint identifier */
  id: string;
  
  /** Stage that was completed */
  stage: string;
  
  /** Checkpoint data */
  data: any;
  
  /** Timestamp */
  timestamp: Date;
}

/**
 * Default recovery strategies per error type
 */
const DEFAULT_STRATEGIES: Record<ErrorType, RecoveryStrategy> = {
  transient: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    exponentialBackoff: true,
    retryTimeout: 30000
  },
  permanent: {
    maxRetries: 0,
    initialDelay: 0,
    maxDelay: 0,
    backoffMultiplier: 1,
    exponentialBackoff: false
  },
  partial: {
    maxRetries: 1,
    initialDelay: 2000,
    maxDelay: 5000,
    backoffMultiplier: 1.5,
    exponentialBackoff: true,
    retryTimeout: 60000
  }
};

/**
 * Error Recovery System
 * 
 * Provides comprehensive error recovery capabilities for the release pipeline
 */
export class ErrorRecovery {
  private checkpoints: Map<string, RecoveryCheckpoint> = new Map();
  private strategies: Map<ErrorType, RecoveryStrategy> = new Map();

  constructor(customStrategies?: Partial<Record<ErrorType, RecoveryStrategy>>) {
    // Initialize with default strategies
    this.strategies.set('transient', DEFAULT_STRATEGIES.transient);
    this.strategies.set('permanent', DEFAULT_STRATEGIES.permanent);
    this.strategies.set('partial', DEFAULT_STRATEGIES.partial);

    // Apply custom strategies if provided
    if (customStrategies) {
      Object.entries(customStrategies).forEach(([type, strategy]) => {
        this.strategies.set(type as ErrorType, strategy);
      });
    }
  }

  /**
   * Classify error to determine recovery approach
   * 
   * Requirements: 8.3
   */
  classifyError(error: ReleaseError): ErrorClassification {
    const code = error.code;
    const message = error.message.toLowerCase();

    // Transient errors (network, timeout, rate limiting)
    if (this.isTransientError(code, message)) {
      return {
        type: 'transient',
        recoverable: true,
        recommendedAction: 'retry',
        confidence: 0.9,
        reasoning: 'Error appears to be temporary and may succeed on retry'
      };
    }

    // Partial errors (some operations succeeded, some failed)
    if (this.isPartialError(code, message)) {
      return {
        type: 'partial',
        recoverable: true,
        recommendedAction: 'resume',
        confidence: 0.8,
        reasoning: 'Partial completion detected, can resume from checkpoint'
      };
    }

    // Permanent errors (validation, authentication, configuration)
    return {
      type: 'permanent',
      recoverable: false,
      recommendedAction: 'manual',
      confidence: 0.95,
      reasoning: 'Error requires manual intervention to resolve'
    };
  }

  /**
   * Execute operation with retry logic
   * 
   * Requirements: 8.3, 8.4
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    errorContext: { step: string; code: string },
    customStrategy?: RecoveryStrategy
  ): Promise<RecoveryResult & { result?: T }> {
    const startTime = Date.now();
    const attempts: RecoveryAttempt[] = [];
    let lastError: ReleaseError | undefined;
    let result: T | undefined;

    // Determine strategy based on error classification
    const classification = this.classifyError({
      code: errorContext.code,
      message: '',
      severity: 'error',
      step: errorContext.step
    });

    const strategy = customStrategy || this.strategies.get(classification.type)!;
    const maxRetries = strategy.maxRetries;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const delay = this.calculateDelay(attempt, strategy);
      
      // Wait before retry (except first attempt)
      if (attempt > 0 && delay > 0) {
        await this.sleep(delay);
      }

      try {
        result = await this.executeWithTimeout(operation, strategy.retryTimeout);
        
        attempts.push({
          attempt: attempt + 1,
          success: true,
          delay,
          timestamp: new Date()
        });

        // Success!
        return {
          success: true,
          action: attempt > 0 ? 'retry' : 'retry',
          attempts,
          duration: Date.now() - startTime,
          result,
          metadata: {
            errorType: classification.type,
            retriesUsed: attempt,
            maxRetriesAllowed: maxRetries,
            totalDelay: attempts.reduce((sum, a) => sum + a.delay, 0)
          }
        };
      } catch (error) {
        lastError = this.normalizeError(error, errorContext);
        
        attempts.push({
          attempt: attempt + 1,
          success: false,
          error: lastError,
          delay,
          timestamp: new Date()
        });

        // Reclassify error after each attempt
        const newClassification = this.classifyError(lastError);
        
        // If error became permanent, stop retrying
        if (newClassification.type === 'permanent') {
          break;
        }
      }
    }

    // All retries exhausted
    return {
      success: false,
      action: classification.recommendedAction,
      attempts,
      finalError: lastError,
      duration: Date.now() - startTime,
      metadata: {
        errorType: classification.type,
        retriesUsed: attempts.length - 1,
        maxRetriesAllowed: maxRetries,
        totalDelay: attempts.reduce((sum, a) => sum + a.delay, 0)
      }
    };
  }

  /**
   * Create checkpoint for partial completion handling
   * 
   * Requirements: 8.4
   */
  createCheckpoint(stage: string, data: any): RecoveryCheckpoint {
    const checkpoint: RecoveryCheckpoint = {
      id: `checkpoint-${stage}-${Date.now()}`,
      stage,
      data,
      timestamp: new Date()
    };

    this.checkpoints.set(checkpoint.id, checkpoint);
    return checkpoint;
  }

  /**
   * Get checkpoint for resuming
   * 
   * Requirements: 8.4
   */
  getCheckpoint(stage: string): RecoveryCheckpoint | undefined {
    // Find most recent checkpoint for this stage
    const checkpoints = Array.from(this.checkpoints.values())
      .filter(cp => cp.stage === stage)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return checkpoints[0];
  }

  /**
   * Clear checkpoints
   * 
   * Requirements: 8.4
   */
  clearCheckpoints(): void {
    this.checkpoints.clear();
  }

  /**
   * Determine recovery action based on error and context
   * 
   * Requirements: 8.5
   */
  determineRecoveryAction(
    error: ReleaseError,
    context: {
      stage: string;
      attemptNumber: number;
      hasCheckpoint: boolean;
      criticalOperation: boolean;
    }
  ): RecoveryAction {
    const classification = this.classifyError(error);

    // Permanent errors require manual intervention
    if (classification.type === 'permanent') {
      return 'manual';
    }

    // Partial errors with checkpoint can resume
    if (classification.type === 'partial' && context.hasCheckpoint) {
      return 'resume';
    }

    // Transient errors can retry
    if (classification.type === 'transient') {
      const strategy = this.strategies.get('transient')!;
      
      // If we haven't exceeded max retries, retry
      if (context.attemptNumber < strategy.maxRetries) {
        return 'retry';
      }
      
      // If critical operation, rollback
      if (context.criticalOperation) {
        return 'rollback';
      }
      
      // Otherwise skip
      return 'skip';
    }

    // Default to manual intervention
    return 'manual';
  }

  /**
   * Get recovery strategy for error type
   * 
   * Requirements: 8.3
   */
  getStrategy(errorType: ErrorType): RecoveryStrategy {
    return this.strategies.get(errorType)!;
  }

  /**
   * Update recovery strategy
   * 
   * Requirements: 8.3
   */
  updateStrategy(errorType: ErrorType, strategy: RecoveryStrategy): void {
    this.strategies.set(errorType, strategy);
  }

  // Private helper methods

  private isTransientError(code: string, message: string): boolean {
    const transientCodes = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'RATE_LIMIT',
      'SERVICE_UNAVAILABLE',
      'CONNECTION_REFUSED',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND'
    ];

    const transientKeywords = [
      'timeout',
      'network',
      'connection',
      'unavailable',
      'rate limit',
      'too many requests',
      'temporary',
      'retry'
    ];

    return transientCodes.includes(code) ||
           transientKeywords.some(keyword => message.includes(keyword));
  }

  private isPartialError(code: string, message: string): boolean {
    const partialCodes = [
      'PARTIAL_SUCCESS',
      'PARTIAL_FAILURE',
      'INCOMPLETE_OPERATION'
    ];

    const partialKeywords = [
      'partial',
      'incomplete',
      'some succeeded',
      'some failed'
    ];

    return partialCodes.includes(code) ||
           partialKeywords.some(keyword => message.includes(keyword));
  }

  private calculateDelay(attempt: number, strategy: RecoveryStrategy): number {
    if (attempt === 0) {
      return 0;
    }

    if (!strategy.exponentialBackoff) {
      return strategy.initialDelay;
    }

    // Exponential backoff: delay = initialDelay * (multiplier ^ (attempt - 1))
    const delay = strategy.initialDelay * Math.pow(strategy.backoffMultiplier, attempt - 1);
    
    // Cap at maxDelay
    return Math.min(delay, strategy.maxDelay);
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    if (!timeout) {
      return operation();
    }

    return Promise.race([
      operation(),
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
      )
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeError(error: unknown, context: { step: string; code: string }): ReleaseError {
    if (this.isReleaseError(error)) {
      return error;
    }

    if (error instanceof Error) {
      // Check if error has a code property (common in Node.js errors)
      const errorCode = (error as any).code || context.code;
      
      return {
        code: errorCode,
        message: error.message,
        severity: 'error',
        step: context.step,
        stackTrace: error.stack
      };
    }

    return {
      code: context.code,
      message: String(error),
      severity: 'error',
      step: context.step
    };
  }

  private isReleaseError(error: unknown): error is ReleaseError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error &&
      'severity' in error
    );
  }
}

/**
 * Rollback Coordinator
 * 
 * Coordinates rollback operations across all release components:
 * - Git operations (commits, tags, pushes)
 * - Package.json updates
 * - CHANGELOG.md updates
 * - GitHub releases
 * - npm publications
 * 
 * Provides comprehensive rollback with validation and audit trail.
 * 
 * Requirements: 8.4, 8.5
 */

export interface RollbackOptions {
  /** Components to rollback */
  components?: RollbackComponent[];
  
  /** Whether to force rollback even if some operations fail */
  force?: boolean;
  
  /** Whether to validate rollback success */
  validate?: boolean;
  
  /** Maximum time to wait for rollback (ms) */
  timeout?: number;
}

export type RollbackComponent = 
  | 'git'
  | 'package-json'
  | 'changelog'
  | 'github'
  | 'npm';

export interface RollbackResult {
  /** Whether rollback succeeded */
  success: boolean;
  
  /** Components that were rolled back */
  rolledBackComponents: RollbackComponent[];
  
  /** Components that failed to rollback */
  failedComponents: RollbackComponent[];
  
  /** Rollback errors */
  errors: RollbackError[];
  
  /** Rollback duration */
  duration: number;
  
  /** Rollback audit trail */
  auditTrail: RollbackAuditEntry[];
  
  /** Validation results (if validation enabled) */
  validation?: RollbackValidation;
}

export interface RollbackError {
  component: RollbackComponent;
  operation: string;
  error: string;
  code: string;
  recoverable: boolean;
}

export interface RollbackAuditEntry {
  component: RollbackComponent;
  operation: string;
  timestamp: Date;
  success: boolean;
  details: string;
  error?: string;
}

export interface RollbackValidation {
  valid: boolean;
  checks: RollbackValidationCheck[];
}

export interface RollbackValidationCheck {
  component: RollbackComponent;
  check: string;
  passed: boolean;
  details: string;
}

export interface RollbackState {
  /** Git state before release */
  git?: {
    commitHash: string;
    branch: string;
    tags: string[];
  };
  
  /** Package.json state before release */
  packageJson?: {
    files: Map<string, string>; // path -> original content
  };
  
  /** CHANGELOG.md state before release */
  changelog?: {
    path: string;
    content: string;
  };
  
  /** GitHub release state */
  github?: {
    releaseId?: string;
    tagName?: string;
  };
  
  /** npm publication state */
  npm?: {
    packages: Array<{
      name: string;
      version: string;
      published: boolean;
    }>;
  };
}

export class RollbackCoordinator {
  private state: RollbackState = {};
  private auditTrail: RollbackAuditEntry[] = [];
  private stateManager?: any; // WorkflowStateManager
  private workflowId?: string;

  constructor(stateManager?: any, workflowId?: string) {
    this.stateManager = stateManager;
    this.workflowId = workflowId;
  }

  /**
   * Save state before release operations
   * 
   * Requirements: 8.4
   */
  saveState(component: RollbackComponent, data: any): void {
    switch (component) {
      case 'git':
        this.state.git = data;
        break;
      case 'package-json':
        this.state.packageJson = data;
        break;
      case 'changelog':
        this.state.changelog = data;
        break;
      case 'github':
        this.state.github = data;
        break;
      case 'npm':
        this.state.npm = data;
        break;
    }

    // Also persist to workflow state manager if available
    if (this.stateManager && this.workflowId) {
      this.stateManager.updateContext(this.workflowId, {
        rollbackState: this.state
      }).catch((error: Error) => {
        console.warn('Failed to persist rollback state:', error.message);
      });
    }
  }

  /**
   * Get saved state for component
   * 
   * Requirements: 8.4
   */
  getState(component: RollbackComponent): any {
    switch (component) {
      case 'git':
        return this.state.git;
      case 'package-json':
        return this.state.packageJson;
      case 'changelog':
        return this.state.changelog;
      case 'github':
        return this.state.github;
      case 'npm':
        return this.state.npm;
      default:
        return undefined;
    }
  }

  /**
   * Execute complete rollback across all components
   * 
   * Requirements: 8.4, 8.5
   */
  async executeRollback(
    components: {
      git?: any;
      packageUpdater?: any;
      changelogManager?: any;
      githubPublisher?: any;
      npmPublisher?: any;
    },
    options: RollbackOptions = {}
  ): Promise<RollbackResult> {
    const startTime = Date.now();
    const rolledBackComponents: RollbackComponent[] = [];
    const failedComponents: RollbackComponent[] = [];
    const errors: RollbackError[] = [];

    const componentsToRollback = options.components || [
      'npm',
      'github',
      'changelog',
      'package-json',
      'git'
    ];

    console.log('\n🔄 Starting comprehensive rollback...');
    console.log(`   Components: ${componentsToRollback.join(', ')}`);

    // Rollback in reverse order (npm → github → changelog → package-json → git)
    for (const component of componentsToRollback) {
      try {
        await this.rollbackComponent(
          component,
          components,
          rolledBackComponents,
          failedComponents,
          errors,
          options.force || false
        );
      } catch (error) {
        if (!options.force) {
          // Stop rollback if not forcing
          break;
        }
      }
    }

    const duration = Date.now() - startTime;

    // Validate rollback if requested
    let validation: RollbackValidation | undefined;
    if (options.validate) {
      validation = await this.validateRollback(rolledBackComponents, components);
    }

    const success = failedComponents.length === 0 && 
                   errors.filter(e => !e.recoverable).length === 0;

    console.log(success ? '\n✅ Rollback complete' : '\n⚠️  Rollback completed with errors');
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`   Rolled back: ${rolledBackComponents.join(', ')}`);
    if (failedComponents.length > 0) {
      console.log(`   Failed: ${failedComponents.join(', ')}`);
    }

    return {
      success,
      rolledBackComponents,
      failedComponents,
      errors,
      duration,
      auditTrail: this.auditTrail,
      validation
    };
  }

  /**
   * Rollback individual component
   * 
   * Requirements: 8.4
   */
  private async rollbackComponent(
    component: RollbackComponent,
    components: any,
    rolledBackComponents: RollbackComponent[],
    failedComponents: RollbackComponent[],
    errors: RollbackError[],
    force: boolean
  ): Promise<void> {
    console.log(`\n🔄 Rolling back ${component}...`);

    try {
      switch (component) {
        case 'npm':
          await this.rollbackNpm(components.npmPublisher, errors);
          break;
        case 'github':
          await this.rollbackGitHub(components.githubPublisher, errors);
          break;
        case 'changelog':
          await this.rollbackChangelog(components.changelogManager, errors);
          break;
        case 'package-json':
          await this.rollbackPackageJson(components.packageUpdater, errors);
          break;
        case 'git':
          await this.rollbackGit(components.git, errors);
          break;
      }

      rolledBackComponents.push(component);
      this.addAuditEntry(component, 'rollback', true, `Successfully rolled back ${component}`);
      console.log(`✅ Rolled back ${component}`);
    } catch (error) {
      failedComponents.push(component);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      errors.push({
        component,
        operation: 'rollback',
        error: errorMessage,
        code: 'ROLLBACK_FAILED',
        recoverable: false
      });

      this.addAuditEntry(component, 'rollback', false, '', errorMessage);
      console.error(`❌ Failed to rollback ${component}: ${errorMessage}`);

      if (!force) {
        throw error;
      }
    }
  }

  /**
   * Rollback npm publications
   * 
   * Requirements: 8.4
   */
  private async rollbackNpm(npmPublisher: any, errors: RollbackError[]): Promise<void> {
    if (!npmPublisher || !this.state.npm) {
      return;
    }

    for (const pkg of this.state.npm.packages) {
      if (pkg.published) {
        try {
          await npmPublisher.unpublishPackage(pkg.name, pkg.version);
          this.addAuditEntry('npm', 'unpublish', true, `Unpublished ${pkg.name}@${pkg.version}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push({
            component: 'npm',
            operation: 'unpublish',
            error: errorMessage,
            code: 'NPM_UNPUBLISH_FAILED',
            recoverable: true
          });
          this.addAuditEntry('npm', 'unpublish', false, '', errorMessage);
        }
      }
    }
  }

  /**
   * Rollback GitHub release
   * 
   * Requirements: 8.4
   */
  private async rollbackGitHub(githubPublisher: any, errors: RollbackError[]): Promise<void> {
    if (!githubPublisher || !this.state.github) {
      return;
    }

    // Delete release if created
    if (this.state.github.releaseId && this.state.github.tagName) {
      try {
        await githubPublisher.deleteRelease(this.state.github.tagName);
        this.addAuditEntry('github', 'delete-release', true, `Deleted release ${this.state.github.tagName}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({
          component: 'github',
          operation: 'delete-release',
          error: errorMessage,
          code: 'GITHUB_DELETE_FAILED',
          recoverable: true
        });
        this.addAuditEntry('github', 'delete-release', false, '', errorMessage);
      }
    }

    // Delete tag if created
    if (this.state.github.tagName) {
      try {
        await githubPublisher.deleteTag(this.state.github.tagName);
        this.addAuditEntry('github', 'delete-tag', true, `Deleted tag ${this.state.github.tagName}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({
          component: 'github',
          operation: 'delete-tag',
          error: errorMessage,
          code: 'GITHUB_TAG_DELETE_FAILED',
          recoverable: true
        });
        this.addAuditEntry('github', 'delete-tag', false, '', errorMessage);
      }
    }
  }

  /**
   * Rollback CHANGELOG.md changes
   * 
   * Requirements: 8.4
   */
  private async rollbackChangelog(changelogManager: any, errors: RollbackError[]): Promise<void> {
    if (!changelogManager || !this.state.changelog) {
      return;
    }

    try {
      const fs = require('fs');
      fs.writeFileSync(this.state.changelog.path, this.state.changelog.content, 'utf-8');
      this.addAuditEntry('changelog', 'restore', true, `Restored ${this.state.changelog.path}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push({
        component: 'changelog',
        operation: 'restore',
        error: errorMessage,
        code: 'CHANGELOG_RESTORE_FAILED',
        recoverable: false
      });
      this.addAuditEntry('changelog', 'restore', false, '', errorMessage);
      throw error;
    }
  }

  /**
   * Rollback package.json changes
   * 
   * Requirements: 8.4
   */
  private async rollbackPackageJson(packageUpdater: any, errors: RollbackError[]): Promise<void> {
    if (!packageUpdater) {
      return;
    }

    try {
      await packageUpdater.rollback();
      this.addAuditEntry('package-json', 'restore', true, 'Restored package.json files');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push({
        component: 'package-json',
        operation: 'restore',
        error: errorMessage,
        code: 'PACKAGE_JSON_RESTORE_FAILED',
        recoverable: false
      });
      this.addAuditEntry('package-json', 'restore', false, '', errorMessage);
      throw error;
    }
  }

  /**
   * Rollback git operations
   * 
   * Requirements: 8.4
   */
  private async rollbackGit(git: any, errors: RollbackError[]): Promise<void> {
    if (!git) {
      return;
    }

    try {
      const result = await git.rollback();
      if (!result.success) {
        for (const error of result.errors) {
          errors.push({
            component: 'git',
            operation: error.operation,
            error: error.error,
            code: error.code,
            recoverable: false
          });
        }
        throw new Error('Git rollback failed');
      }
      this.addAuditEntry('git', 'rollback', true, 'Rolled back git operations');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push({
        component: 'git',
        operation: 'rollback',
        error: errorMessage,
        code: 'GIT_ROLLBACK_FAILED',
        recoverable: false
      });
      this.addAuditEntry('git', 'rollback', false, '', errorMessage);
      throw error;
    }
  }

  /**
   * Validate rollback success
   * 
   * Requirements: 8.5
   */
  private async validateRollback(
    rolledBackComponents: RollbackComponent[],
    components: any
  ): Promise<RollbackValidation> {
    const checks: RollbackValidationCheck[] = [];

    for (const component of rolledBackComponents) {
      switch (component) {
        case 'git':
          checks.push(await this.validateGitRollback(components.git));
          break;
        case 'package-json':
          checks.push(await this.validatePackageJsonRollback(components.packageUpdater));
          break;
        case 'changelog':
          checks.push(await this.validateChangelogRollback());
          break;
        case 'github':
          checks.push(await this.validateGitHubRollback(components.githubPublisher));
          break;
        case 'npm':
          checks.push(await this.validateNpmRollback(components.npmPublisher));
          break;
      }
    }

    const valid = checks.every(check => check.passed);

    return {
      valid,
      checks
    };
  }

  /**
   * Validate git rollback
   */
  private async validateGitRollback(git: any): Promise<RollbackValidationCheck> {
    if (!git || !this.state.git) {
      return {
        component: 'git',
        check: 'state-restored',
        passed: true,
        details: 'No git state to validate'
      };
    }

    try {
      // Check if we're back at the original commit
      const currentCommit = git.executeGitCommand('git rev-parse HEAD').trim();
      const passed = currentCommit === this.state.git.commitHash;

      return {
        component: 'git',
        check: 'commit-restored',
        passed,
        details: passed 
          ? `Restored to commit ${this.state.git.commitHash}`
          : `Current commit ${currentCommit} doesn't match original ${this.state.git.commitHash}`
      };
    } catch (error) {
      return {
        component: 'git',
        check: 'commit-restored',
        passed: false,
        details: `Validation failed: ${error}`
      };
    }
  }

  /**
   * Validate package.json rollback
   */
  private async validatePackageJsonRollback(packageUpdater: any): Promise<RollbackValidationCheck> {
    if (!packageUpdater || !this.state.packageJson) {
      return {
        component: 'package-json',
        check: 'versions-restored',
        passed: true,
        details: 'No package.json state to validate'
      };
    }

    try {
      const fs = require('fs');
      let allRestored = true;
      const details: string[] = [];

      for (const [filePath, originalContent] of this.state.packageJson.files.entries()) {
        const currentContent = fs.readFileSync(filePath, 'utf-8');
        if (currentContent !== originalContent) {
          allRestored = false;
          details.push(`${filePath} not restored`);
        }
      }

      return {
        component: 'package-json',
        check: 'versions-restored',
        passed: allRestored,
        details: allRestored 
          ? 'All package.json files restored'
          : details.join(', ')
      };
    } catch (error) {
      return {
        component: 'package-json',
        check: 'versions-restored',
        passed: false,
        details: `Validation failed: ${error}`
      };
    }
  }

  /**
   * Validate changelog rollback
   */
  private async validateChangelogRollback(): Promise<RollbackValidationCheck> {
    if (!this.state.changelog) {
      return {
        component: 'changelog',
        check: 'content-restored',
        passed: true,
        details: 'No changelog state to validate'
      };
    }

    try {
      const fs = require('fs');
      const currentContent = fs.readFileSync(this.state.changelog.path, 'utf-8');
      const passed = currentContent === this.state.changelog.content;

      return {
        component: 'changelog',
        check: 'content-restored',
        passed,
        details: passed 
          ? 'Changelog restored'
          : 'Changelog content differs from original'
      };
    } catch (error) {
      return {
        component: 'changelog',
        check: 'content-restored',
        passed: false,
        details: `Validation failed: ${error}`
      };
    }
  }

  /**
   * Validate GitHub rollback
   */
  private async validateGitHubRollback(githubPublisher: any): Promise<RollbackValidationCheck> {
    if (!githubPublisher || !this.state.github?.tagName) {
      return {
        component: 'github',
        check: 'release-deleted',
        passed: true,
        details: 'No GitHub state to validate'
      };
    }

    try {
      const exists = await githubPublisher.releaseExists(this.state.github.tagName);
      const passed = !exists;

      return {
        component: 'github',
        check: 'release-deleted',
        passed,
        details: passed 
          ? `Release ${this.state.github.tagName} deleted`
          : `Release ${this.state.github.tagName} still exists`
      };
    } catch (error) {
      return {
        component: 'github',
        check: 'release-deleted',
        passed: false,
        details: `Validation failed: ${error}`
      };
    }
  }

  /**
   * Validate npm rollback
   */
  private async validateNpmRollback(npmPublisher: any): Promise<RollbackValidationCheck> {
    if (!npmPublisher || !this.state.npm) {
      return {
        component: 'npm',
        check: 'packages-unpublished',
        passed: true,
        details: 'No npm state to validate'
      };
    }

    try {
      let allUnpublished = true;
      const details: string[] = [];

      for (const pkg of this.state.npm.packages) {
        if (pkg.published) {
          const exists = await npmPublisher.packageVersionExists(pkg.name, pkg.version);
          if (exists) {
            allUnpublished = false;
            details.push(`${pkg.name}@${pkg.version} still published`);
          }
        }
      }

      return {
        component: 'npm',
        check: 'packages-unpublished',
        passed: allUnpublished,
        details: allUnpublished 
          ? 'All packages unpublished'
          : details.join(', ')
      };
    } catch (error) {
      return {
        component: 'npm',
        check: 'packages-unpublished',
        passed: false,
        details: `Validation failed: ${error}`
      };
    }
  }

  /**
   * Add entry to audit trail
   */
  private addAuditEntry(
    component: RollbackComponent,
    operation: string,
    success: boolean,
    details: string,
    error?: string
  ): void {
    this.auditTrail.push({
      component,
      operation,
      timestamp: new Date(),
      success,
      details,
      error
    });
  }

  /**
   * Get audit trail
   */
  getAuditTrail(): RollbackAuditEntry[] {
    return [...this.auditTrail];
  }

  /**
   * Clear all state and audit trail
   */
  clear(): void {
    this.state = {};
    this.auditTrail = [];
  }

  /**
   * Get current state
   */
  getCurrentState(): RollbackState {
    return { ...this.state };
  }
}
