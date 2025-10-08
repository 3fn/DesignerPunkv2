/**
 * Recovery Strategy Implementations
 * 
 * Provides concrete implementations for error recovery strategies:
 * - Retry: Attempt operation again for transient errors
 * - Skip: Skip problematic platform and continue with others
 * - Fallback: Use cached build or default configuration
 * - Abort: Stop build and require manual intervention
 */

import { BuildError, Platform } from './BuildError';

/**
 * Recovery strategy types
 */
export type RecoveryStrategyType = 
  | 'retry'    // Attempt operation again (transient errors)
  | 'skip'     // Skip problematic platform, continue with others
  | 'fallback' // Use cached build or default configuration
  | 'abort';   // Stop build, require manual intervention

/**
 * Recovery context for strategy execution
 */
export interface RecoveryContext {
  /** The error being recovered from */
  error: BuildError;
  
  /** Current retry attempt (for retry strategy) */
  retryAttempt?: number;
  
  /** Maximum retry attempts allowed */
  maxRetries?: number;
  
  /** Platform being built (for skip strategy) */
  platform?: Platform;
  
  /** Available platforms to continue with (for skip strategy) */
  remainingPlatforms?: Platform[];
  
  /** Cached build artifacts (for fallback strategy) */
  cachedArtifacts?: Record<string, unknown>;
  
  /** Default configuration (for fallback strategy) */
  defaultConfig?: Record<string, unknown>;
  
  /** Additional context data */
  metadata?: Record<string, unknown>;
}

/**
 * Recovery execution result
 */
export interface RecoveryExecutionResult {
  /** Whether recovery was successful */
  success: boolean;
  
  /** Strategy that was executed */
  strategy: RecoveryStrategyType;
  
  /** Message describing the outcome */
  message: string;
  
  /** Whether to continue with build */
  shouldContinue: boolean;
  
  /** Updated context after recovery */
  updatedContext?: Partial<RecoveryContext>;
  
  /** Any errors that occurred during recovery */
  errors?: BuildError[];
}

/**
 * Retry strategy implementation
 * 
 * Attempts the operation again for transient errors like network issues,
 * file locks, or temporary resource unavailability.
 */
export class RetryStrategy {
  /**
   * Execute retry strategy
   */
  async execute(context: RecoveryContext): Promise<RecoveryExecutionResult> {
    const { error, retryAttempt = 0, maxRetries = 3 } = context;
    
    // Check if we've exceeded max retries
    if (retryAttempt >= maxRetries) {
      return {
        success: false,
        strategy: 'retry',
        message: `Maximum retry attempts (${maxRetries}) exceeded for error: ${error.message}`,
        shouldContinue: false,
        errors: [error],
      };
    }
    
    // Calculate backoff delay (exponential backoff)
    const backoffDelay = this.calculateBackoff(retryAttempt);
    
    // Wait before retrying
    await this.delay(backoffDelay);
    
    return {
      success: true,
      strategy: 'retry',
      message: `Retrying operation (attempt ${retryAttempt + 1}/${maxRetries}) after ${backoffDelay}ms delay`,
      shouldContinue: true,
      updatedContext: {
        retryAttempt: retryAttempt + 1,
      },
    };
  }
  
  /**
   * Check if error is suitable for retry
   */
  canRetry(error: BuildError): boolean {
    // Transient error indicators
    const transientPatterns = [
      /network/i,
      /timeout/i,
      /econnrefused/i,
      /enotfound/i,
      /file.*lock/i,
      /resource.*unavailable/i,
      /temporary/i,
    ];
    
    return transientPatterns.some(pattern => 
      pattern.test(error.message) || 
      pattern.test(error.code)
    );
  }
  
  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    const baseDelay = 1000;
    const maxDelay = 30000; // Cap at 30 seconds
    
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.3 * delay;
    
    return Math.floor(delay + jitter);
  }
  
  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Skip strategy implementation
 * 
 * Skips the problematic platform and continues building other platforms.
 * Useful for platform-specific failures that shouldn't block the entire build.
 */
export class SkipStrategy {
  /**
   * Execute skip strategy
   */
  execute(context: RecoveryContext): RecoveryExecutionResult {
    const { error, platform, remainingPlatforms = [] } = context;
    
    if (!platform) {
      return {
        success: false,
        strategy: 'skip',
        message: 'Cannot skip: no platform specified in error context',
        shouldContinue: false,
        errors: [error],
      };
    }
    
    // Check if there are remaining platforms to build
    if (remainingPlatforms.length === 0) {
      return {
        success: false,
        strategy: 'skip',
        message: `Skipping ${platform} platform, but no remaining platforms to build`,
        shouldContinue: false,
        errors: [error],
      };
    }
    
    return {
      success: true,
      strategy: 'skip',
      message: `Skipping ${platform} platform due to error. Continuing with ${remainingPlatforms.length} remaining platform(s): ${remainingPlatforms.join(', ')}`,
      shouldContinue: true,
      updatedContext: {
        remainingPlatforms: remainingPlatforms.filter(p => p !== platform),
      },
    };
  }
  
  /**
   * Check if error is suitable for skip
   */
  canSkip(error: BuildError): boolean {
    // Skip is only appropriate for platform-specific errors
    return error.platform !== undefined;
  }
}

/**
 * Fallback strategy implementation
 * 
 * Uses cached build artifacts or default configuration when the primary
 * build fails. Allows the build to continue with degraded functionality.
 */
export class FallbackStrategy {
  /**
   * Execute fallback strategy
   */
  execute(context: RecoveryContext): RecoveryExecutionResult {
    const { error, cachedArtifacts, defaultConfig } = context;
    
    // Try cached artifacts first
    if (cachedArtifacts && Object.keys(cachedArtifacts).length > 0) {
      return {
        success: true,
        strategy: 'fallback',
        message: `Using cached build artifacts due to error: ${error.message}`,
        shouldContinue: true,
        updatedContext: {
          metadata: {
            usedCache: true,
            cacheKeys: Object.keys(cachedArtifacts),
          },
        },
      };
    }
    
    // Fall back to default configuration
    if (defaultConfig && Object.keys(defaultConfig).length > 0) {
      return {
        success: true,
        strategy: 'fallback',
        message: `Using default configuration due to error: ${error.message}`,
        shouldContinue: true,
        updatedContext: {
          metadata: {
            usedDefaultConfig: true,
            configKeys: Object.keys(defaultConfig),
          },
        },
      };
    }
    
    // No fallback available
    return {
      success: false,
      strategy: 'fallback',
      message: `No fallback available for error: ${error.message}`,
      shouldContinue: false,
      errors: [error],
    };
  }
  
  /**
   * Check if error is suitable for fallback
   */
  canFallback(error: BuildError, context: RecoveryContext): boolean {
    // Fallback is appropriate when we have cached artifacts or default config
    const hasCachedArtifacts = context.cachedArtifacts !== undefined && 
                               Object.keys(context.cachedArtifacts).length > 0;
    const hasDefaultConfig = context.defaultConfig !== undefined && 
                            Object.keys(context.defaultConfig).length > 0;
    
    return hasCachedArtifacts || hasDefaultConfig;
  }
}

/**
 * Abort strategy implementation
 * 
 * Stops the build immediately and requires manual intervention.
 * Used for critical errors that cannot be recovered automatically.
 */
export class AbortStrategy {
  /**
   * Execute abort strategy
   */
  execute(context: RecoveryContext): RecoveryExecutionResult {
    const { error } = context;
    
    return {
      success: false,
      strategy: 'abort',
      message: `Build aborted due to critical error: ${error.message}`,
      shouldContinue: false,
      errors: [error],
    };
  }
  
  /**
   * Check if error requires abort
   */
  shouldAbort(error: BuildError): boolean {
    // Abort for critical configuration errors
    if (error.category === 'config' && error.severity === 'error') {
      return true;
    }
    
    // Abort for errors explicitly marked as non-recoverable
    if (error.context.recoverable === false) {
      return true;
    }
    
    return false;
  }
}

/**
 * Recovery strategy coordinator
 * 
 * Coordinates the execution of different recovery strategies based on
 * error type and context.
 */
export class RecoveryStrategyCoordinator {
  private retryStrategy = new RetryStrategy();
  private skipStrategy = new SkipStrategy();
  private fallbackStrategy = new FallbackStrategy();
  private abortStrategy = new AbortStrategy();
  
  /**
   * Execute appropriate recovery strategy
   */
  async executeRecovery(
    strategyType: RecoveryStrategyType,
    context: RecoveryContext
  ): Promise<RecoveryExecutionResult> {
    switch (strategyType) {
      case 'retry':
        return this.retryStrategy.execute(context);
      
      case 'skip':
        return this.skipStrategy.execute(context);
      
      case 'fallback':
        return this.fallbackStrategy.execute(context);
      
      case 'abort':
        return this.abortStrategy.execute(context);
      
      default:
        return {
          success: false,
          strategy: strategyType,
          message: `Unknown recovery strategy: ${strategyType}`,
          shouldContinue: false,
          errors: [context.error],
        };
    }
  }
  
  /**
   * Determine best recovery strategy for an error
   */
  determineStrategy(error: BuildError, context: RecoveryContext): RecoveryStrategyType {
    // Check if abort is required
    if (this.abortStrategy.shouldAbort(error)) {
      return 'abort';
    }
    
    // Check if retry is appropriate
    if (this.retryStrategy.canRetry(error) && (context.retryAttempt || 0) < (context.maxRetries || 3)) {
      return 'retry';
    }
    
    // Check if skip is appropriate
    if (this.skipStrategy.canSkip(error) && context.remainingPlatforms && context.remainingPlatforms.length > 0) {
      return 'skip';
    }
    
    // Check if fallback is available
    if (this.fallbackStrategy.canFallback(error, context)) {
      return 'fallback';
    }
    
    // Default to abort if no other strategy is appropriate
    return 'abort';
  }
}
