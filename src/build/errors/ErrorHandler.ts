/**
 * Error Handler
 * 
 * Central error handling system for the Cross-Platform Build System.
 * Provides error categorization, recovery strategies, and logging.
 */

import { BuildError, ErrorCategory, ErrorSeverity, Platform, isBuildError } from './BuildError';
import { 
  RecoveryStrategyType as RecoveryStrategy,
  RecoveryStrategyCoordinator,
  RecoveryContext,
  RecoveryExecutionResult,
} from './RecoveryStrategy';
import { enhanceErrorWithDocumentation, formatErrorMessage } from './ErrorDocumentation';
import { ErrorReporter, ErrorReport, ErrorReportOptions, BuildResultSummary } from './ErrorReporter';

// Re-export for backward compatibility
export type { RecoveryStrategy };
export type { ErrorReport, ErrorReportOptions, BuildResultSummary };

/**
 * Error recovery result
 */
export interface ErrorRecovery {
  /** Whether the error is recoverable */
  recoverable: boolean;
  
  /** Recommended recovery strategy */
  strategy: RecoveryStrategy;
  
  /** Actions to take for recovery */
  actions: string[];
  
  /** Additional context for recovery */
  context?: Record<string, unknown>;
}

/**
 * Recovery result after attempting recovery
 */
export interface RecoveryResult {
  /** Whether recovery was successful */
  success: boolean;
  
  /** Strategy that was used */
  strategy: RecoveryStrategy;
  
  /** Message describing the recovery outcome */
  message: string;
  
  /** Any errors that occurred during recovery */
  errors?: BuildError[];
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  /** Enable verbose logging */
  verbose?: boolean;
  
  /** Maximum retry attempts for transient errors */
  maxRetries?: number;
  
  /** Whether to continue on platform-specific failures */
  continueOnPlatformFailure?: boolean;
  
  /** Custom error logger */
  logger?: (error: BuildError) => void;
}

/**
 * Error Handler class
 * 
 * Provides centralized error handling with categorization,
 * recovery strategies, and logging capabilities.
 */
export class ErrorHandler {
  private options: Required<ErrorHandlerOptions>;
  private errorLog: BuildError[] = [];
  private recoveryCoordinator = new RecoveryStrategyCoordinator();
  private errorReporter: ErrorReporter;
  
  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      verbose: options.verbose ?? false,
      maxRetries: options.maxRetries ?? 3,
      continueOnPlatformFailure: options.continueOnPlatformFailure ?? true,
      logger: options.logger ?? this.defaultLogger.bind(this),
    };
    
    // Initialize error reporter with matching options
    this.errorReporter = new ErrorReporter({
      includeStackTraces: this.options.verbose,
      includeContext: this.options.verbose,
      includeRecommendations: true,
      format: 'text',
    });
  }
  
  /**
   * Handle a build error
   */
  handleError(error: BuildError): ErrorRecovery {
    // Enhance error with documentation and suggestions
    const enhancedError = enhanceErrorWithDocumentation(error);
    
    // Log the enhanced error
    this.logError(enhancedError);
    
    // Determine recovery strategy based on error category and severity
    const recovery = this.determineRecovery(enhancedError);
    
    if (this.options.verbose) {
      console.log(`[ErrorHandler] Recovery strategy: ${recovery.strategy}`);
      console.log(`[ErrorHandler] Recoverable: ${recovery.recoverable}`);
    }
    
    return recovery;
  }
  
  /**
   * Attempt to recover from an error
   */
  async recover(
    error: BuildError,
    context?: Partial<RecoveryContext>
  ): Promise<RecoveryResult> {
    const recovery = this.handleError(error);
    
    if (!recovery.recoverable) {
      return {
        success: false,
        strategy: recovery.strategy,
        message: `Error is not recoverable: ${error.message}`,
        errors: [error],
      };
    }
    
    try {
      // Build recovery context
      const recoveryContext: RecoveryContext = {
        error,
        maxRetries: this.options.maxRetries,
        ...context,
      };
      
      // Execute recovery strategy
      const executionResult = await this.recoveryCoordinator.executeRecovery(
        recovery.strategy,
        recoveryContext
      );
      
      return {
        success: executionResult.success,
        strategy: executionResult.strategy,
        message: executionResult.message,
        errors: executionResult.errors,
      };
    } catch (recoveryError) {
      const wrappedError = this.wrapError(recoveryError, error);
      return {
        success: false,
        strategy: recovery.strategy,
        message: `Recovery failed: ${wrappedError.message}`,
        errors: [error, wrappedError],
      };
    }
  }
  
  /**
   * Attempt to recover from an error with explicit strategy
   */
  async recoverWithStrategy(
    error: BuildError,
    strategy: RecoveryStrategy,
    context?: Partial<RecoveryContext>
  ): Promise<RecoveryResult> {
    try {
      // Build recovery context
      const recoveryContext: RecoveryContext = {
        error,
        maxRetries: this.options.maxRetries,
        ...context,
      };
      
      // Execute recovery strategy
      const executionResult = await this.recoveryCoordinator.executeRecovery(
        strategy,
        recoveryContext
      );
      
      return {
        success: executionResult.success,
        strategy: executionResult.strategy,
        message: executionResult.message,
        errors: executionResult.errors,
      };
    } catch (recoveryError) {
      const wrappedError = this.wrapError(recoveryError, error);
      return {
        success: false,
        strategy,
        message: `Recovery failed: ${wrappedError.message}`,
        errors: [error, wrappedError],
      };
    }
  }
  
  /**
   * Get all logged errors
   */
  getErrors(): BuildError[] {
    return [...this.errorLog];
  }
  
  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): BuildError[] {
    return this.errorLog.filter(error => error.category === category);
  }
  
  /**
   * Get errors by platform
   */
  getErrorsByPlatform(platform: Platform): BuildError[] {
    return this.errorLog.filter(error => error.platform === platform);
  }
  
  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): BuildError[] {
    return this.errorLog.filter(error => error.severity === severity);
  }
  
  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errorLog = [];
  }
  
  /**
   * Check if there are any critical errors
   */
  hasCriticalErrors(): boolean {
    return this.errorLog.some(error => error.severity === 'error');
  }
  
  /**
   * Categorize an unknown error
   */
  categorizeError(error: unknown): BuildError {
    if (isBuildError(error)) {
      return error;
    }
    
    // Wrap unknown errors as build errors
    return this.wrapError(error);
  }
  
  /**
   * Generate comprehensive error report
   */
  generateReport(buildSummary?: BuildResultSummary): ErrorReport {
    return this.errorReporter.generateReport(this.errorLog, buildSummary);
  }
  
  /**
   * Generate error summary for build results
   */
  generateErrorSummary(): string {
    return this.errorReporter.generateErrorSummary(this.errorLog);
  }
  
  /**
   * Set error reporter options
   */
  setReporterOptions(options: ErrorReportOptions): void {
    this.errorReporter = new ErrorReporter(options);
  }
  
  // Private methods
  
  private determineRecovery(error: BuildError): ErrorRecovery {
    // Critical errors are not recoverable
    if (error.severity === 'error') {
      // Platform-specific errors can be skipped if configured
      if (error.platform && this.options.continueOnPlatformFailure) {
        return {
          recoverable: true,
          strategy: 'skip',
          actions: [
            `Skip ${error.platform} platform build`,
            'Continue with remaining platforms',
            'Review error after build completes',
          ],
        };
      }
      
      // Configuration errors require manual intervention
      if (error.category === 'config') {
        return {
          recoverable: false,
          strategy: 'abort',
          actions: [
            'Fix configuration issues',
            'Review build configuration documentation',
            'Restart build after fixing configuration',
          ],
        };
      }
      
      // Build errors might be transient
      if (error.category === 'build') {
        return {
          recoverable: true,
          strategy: 'retry',
          actions: [
            'Retry build operation',
            'Check for transient issues (network, file locks)',
            'Review build logs for details',
          ],
        };
      }
      
      // Token and interface errors need fallback
      return {
        recoverable: true,
        strategy: 'fallback',
        actions: [
          'Use cached build artifacts if available',
          'Use default configuration',
          'Review error and fix underlying issue',
        ],
      };
    }
    
    // Warnings are always recoverable
    return {
      recoverable: true,
      strategy: 'skip',
      actions: [
        'Continue build with warning',
        'Review warning after build completes',
        'Consider addressing warning in future builds',
      ],
    };
  }
  
  private logError(error: BuildError): void {
    this.errorLog.push(error);
    this.options.logger(error);
  }
  
  private defaultLogger(error: BuildError): void {
    if (this.options.verbose) {
      // Use formatted error message for verbose output
      console.error(formatErrorMessage(error));
    } else {
      // Simple output for non-verbose mode
      const prefix = `[${error.severity.toUpperCase()}] [${error.category}]`;
      const platformInfo = error.platform ? ` [${error.platform}]` : '';
      const componentInfo = error.component ? ` [${error.component}]` : '';
      
      console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
      
      // Show top 3 suggestions even in non-verbose mode
      if (error.suggestions.length > 0) {
        console.error('Suggestions:');
        error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
        if (error.suggestions.length > 3) {
          console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);
        }
      }
    }
  }
  
  private wrapError(error: unknown, originalBuildError?: BuildError): BuildError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage,
      severity: 'error',
      category: 'build',
      context: {
        originalError: error,
        stack: errorStack,
        wrappedFrom: originalBuildError?.code,
      },
      suggestions: [
        'Review error details and stack trace',
        'Check build logs for additional context',
        'Report issue if error persists',
      ],
      documentation: [],
      originalError: error instanceof Error ? error : undefined,
      timestamp: new Date(),
    };
  }
}
