/**
 * CLI Error Handler
 * 
 * Handles CLI execution failures with clear error messages, retry logic,
 * and fallback mechanisms. Provides comprehensive error recovery strategies
 * for the automation layer.
 * 
 * Design Principles:
 * - Clear, actionable error messages
 * - Intelligent retry logic for transient failures
 * - Fallback mechanisms when CLI unavailable
 * - Error categorization for appropriate handling
 */

import { CLIExecutionResult } from './CLIBridge';
import { JSONParseError } from './AnalysisResultParser';

/**
 * Error categories for CLI failures
 */
export enum CLIErrorCategory {
  /** CLI command not found or unavailable */
  CLI_UNAVAILABLE = 'CLI_UNAVAILABLE',
  /** CLI execution timed out */
  TIMEOUT = 'TIMEOUT',
  /** CLI exited with non-zero code */
  EXECUTION_FAILED = 'EXECUTION_FAILED',
  /** JSON parsing failed */
  PARSE_ERROR = 'PARSE_ERROR',
  /** Network or I/O error */
  TRANSIENT = 'TRANSIENT',
  /** Invalid arguments or configuration */
  CONFIGURATION = 'CONFIGURATION',
  /** Unknown error */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Retry strategy configuration
 */
export interface RetryStrategy {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial delay in milliseconds */
  initialDelay: number;
  /** Delay multiplier for exponential backoff */
  backoffMultiplier: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
  /** Whether to retry this error category */
  shouldRetry: (category: CLIErrorCategory) => boolean;
}

/**
 * Fallback options when CLI is unavailable
 */
export interface FallbackOptions {
  /** Whether to use fallback mechanisms */
  enabled: boolean;
  /** Fallback to manual analysis prompt */
  promptManualAnalysis?: boolean;
  /** Fallback to cached results if available */
  useCachedResults?: boolean;
  /** Fallback to simplified analysis */
  useSimplifiedAnalysis?: boolean;
}

/**
 * Categorized CLI error with recovery suggestions
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly category: CLIErrorCategory,
    public readonly originalError?: Error,
    public readonly executionResult?: CLIExecutionResult,
    public readonly recoverySuggestions: string[] = []
  ) {
    super(message);
    this.name = 'CLIError';
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.category === CLIErrorCategory.TRANSIENT ||
           this.category === CLIErrorCategory.TIMEOUT;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    const categoryMessages: Record<CLIErrorCategory, string> = {
      [CLIErrorCategory.CLI_UNAVAILABLE]: 'Release analysis CLI is not available',
      [CLIErrorCategory.TIMEOUT]: 'Release analysis timed out',
      [CLIErrorCategory.EXECUTION_FAILED]: 'Release analysis failed to execute',
      [CLIErrorCategory.PARSE_ERROR]: 'Failed to parse analysis results',
      [CLIErrorCategory.TRANSIENT]: 'Temporary error occurred during analysis',
      [CLIErrorCategory.CONFIGURATION]: 'Invalid configuration for release analysis',
      [CLIErrorCategory.UNKNOWN]: 'Unknown error occurred during analysis'
    };

    return categoryMessages[this.category] || this.message;
  }

  /**
   * Get detailed error information for logging
   */
  getDetailedMessage(): string {
    const parts = [
      `Category: ${this.category}`,
      `Message: ${this.message}`
    ];

    if (this.originalError) {
      parts.push(`Original Error: ${this.originalError.message}`);
    }

    if (this.executionResult) {
      parts.push(`Exit Code: ${this.executionResult.exitCode}`);
      if (this.executionResult.stderr) {
        parts.push(`Stderr: ${this.executionResult.stderr.substring(0, 500)}`);
      }
    }

    if (this.recoverySuggestions.length > 0) {
      parts.push(`Recovery Suggestions:\n  - ${this.recoverySuggestions.join('\n  - ')}`);
    }

    return parts.join('\n');
  }
}

/**
 * CLI Error Handler for comprehensive error handling and recovery
 */
export class CLIErrorHandler {
  private readonly defaultRetryStrategy: RetryStrategy = {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    backoffMultiplier: 2,
    maxDelay: 10000, // 10 seconds
    shouldRetry: (category: CLIErrorCategory) => {
      return category === CLIErrorCategory.TRANSIENT ||
             category === CLIErrorCategory.TIMEOUT;
    }
  };

  private readonly defaultFallbackOptions: FallbackOptions = {
    enabled: true,
    promptManualAnalysis: true,
    useCachedResults: false,
    useSimplifiedAnalysis: false
  };

  /**
   * Categorize CLI execution error
   */
  categorizeError(result: CLIExecutionResult, parseError?: Error): CLIErrorCategory {
    // Check for timeout
    if (result.timedOut) {
      return CLIErrorCategory.TIMEOUT;
    }

    // Check for parse errors
    if (parseError instanceof JSONParseError) {
      return CLIErrorCategory.PARSE_ERROR;
    }

    // Check for CLI unavailable
    if (result.error?.includes('ENOENT') || 
        result.error?.includes('command not found') ||
        result.error?.includes('Failed to spawn')) {
      return CLIErrorCategory.CLI_UNAVAILABLE;
    }

    // Check for transient errors (network, I/O) - check before execution failures
    if (result.error?.includes('ECONNREFUSED') ||
        result.error?.includes('ETIMEDOUT') ||
        result.error?.includes('ENOTFOUND') ||
        result.error?.includes('network error') ||
        result.stderr?.includes('ECONNREFUSED') ||
        result.stderr?.includes('ETIMEDOUT') ||
        result.stderr?.includes('ENOTFOUND') ||
        result.stderr?.includes('network') ||
        result.stderr?.includes('connection')) {
      return CLIErrorCategory.TRANSIENT;
    }

    // Check for configuration errors
    if (result.stderr?.includes('Invalid argument') ||
        result.stderr?.includes('Unknown option') ||
        result.exitCode === 2) {
      return CLIErrorCategory.CONFIGURATION;
    }

    // Check for execution failures (standard exit codes 1-2)
    if (result.exitCode !== null && result.exitCode !== 0 && result.exitCode <= 2) {
      return CLIErrorCategory.EXECUTION_FAILED;
    }

    // Check for unknown errors (unusual exit codes or no specific indicators)
    if (result.exitCode !== null && result.exitCode > 2) {
      return CLIErrorCategory.UNKNOWN;
    }

    // Check for unknown errors with no specific indicators
    if (result.error && !result.exitCode) {
      return CLIErrorCategory.UNKNOWN;
    }

    return CLIErrorCategory.UNKNOWN;
  }

  /**
   * Create CLIError from execution result
   */
  createError(
    result: CLIExecutionResult,
    parseError?: Error
  ): CLIError {
    const category = this.categorizeError(result, parseError);
    const recoverySuggestions = this.getRecoverySuggestions(category, result);

    let message: string;
    if (parseError) {
      message = `Failed to parse CLI output: ${parseError.message}`;
    } else if (result.error) {
      message = result.error;
    } else {
      message = `CLI execution failed with exit code ${result.exitCode}`;
    }

    return new CLIError(
      message,
      category,
      parseError,
      result,
      recoverySuggestions
    );
  }

  /**
   * Get recovery suggestions based on error category
   */
  private getRecoverySuggestions(
    category: CLIErrorCategory,
    result: CLIExecutionResult
  ): string[] {
    const suggestions: string[] = [];

    switch (category) {
      case CLIErrorCategory.CLI_UNAVAILABLE:
        suggestions.push('Verify npm is installed and in PATH');
        suggestions.push('Check that release:analyze script exists in package.json');
        suggestions.push('Run "npm install" to ensure dependencies are installed');
        suggestions.push('Try running "npm run release:analyze" manually to verify CLI works');
        break;

      case CLIErrorCategory.TIMEOUT:
        suggestions.push('Increase timeout value for complex analysis');
        suggestions.push('Check if analysis is stuck on user confirmation prompts');
        suggestions.push('Verify completion documents are not excessively large');
        suggestions.push('Try running with --skip-confirmation flag');
        break;

      case CLIErrorCategory.EXECUTION_FAILED:
        if (result.stderr) {
          suggestions.push('Check stderr output for specific error details');
        }
        suggestions.push('Verify completion documents are properly formatted');
        suggestions.push('Check git repository is in valid state');
        suggestions.push('Try running with --dry-run flag to test without side effects');
        break;

      case CLIErrorCategory.PARSE_ERROR:
        suggestions.push('Verify CLI is outputting valid JSON with --format json');
        suggestions.push('Check for unexpected output mixed with JSON');
        suggestions.push('Try running CLI manually to inspect output format');
        suggestions.push('Update CLI to latest version if available');
        break;

      case CLIErrorCategory.TRANSIENT:
        suggestions.push('Retry the operation (transient errors often resolve)');
        suggestions.push('Check network connectivity if error is network-related');
        suggestions.push('Verify file system is accessible and not full');
        break;

      case CLIErrorCategory.CONFIGURATION:
        suggestions.push('Check CLI arguments are valid');
        suggestions.push('Verify configuration file format if using config');
        suggestions.push('Run CLI with --help to see valid options');
        suggestions.push('Check for typos in argument names');
        break;

      case CLIErrorCategory.UNKNOWN:
        suggestions.push('Check CLI output for error details');
        suggestions.push('Try running CLI manually to reproduce issue');
        suggestions.push('Enable debug logging if available');
        suggestions.push('Report issue with full error details');
        break;
    }

    return suggestions;
  }

  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    strategy: Partial<RetryStrategy> = {}
  ): Promise<T> {
    const retryStrategy = { ...this.defaultRetryStrategy, ...strategy };
    let lastError: Error | undefined;
    let attempt = 0;

    while (attempt < retryStrategy.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;

        // Check if we should retry
        if (error instanceof CLIError) {
          if (!retryStrategy.shouldRetry(error.category)) {
            throw error;
          }
        }

        // Don't retry if we've exhausted attempts
        if (attempt >= retryStrategy.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          retryStrategy.initialDelay * Math.pow(retryStrategy.backoffMultiplier, attempt - 1),
          retryStrategy.maxDelay
        );

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw new CLIError(
      `Operation failed after ${attempt} attempts: ${lastError?.message}`,
      CLIErrorCategory.UNKNOWN,
      lastError,
      undefined,
      ['All retry attempts exhausted', 'Check error details for root cause']
    );
  }

  /**
   * Handle CLI error with fallback mechanisms
   */
  async handleError(
    error: CLIError,
    fallbackOptions: Partial<FallbackOptions> = {}
  ): Promise<void> {
    const options = { ...this.defaultFallbackOptions, ...fallbackOptions };

    // Log detailed error information
    console.error('CLI Error Details:');
    console.error(error.getDetailedMessage());

    // If fallbacks disabled, just throw
    if (!options.enabled) {
      throw error;
    }

    // Try fallback mechanisms based on error category
    switch (error.category) {
      case CLIErrorCategory.CLI_UNAVAILABLE:
        if (options.promptManualAnalysis) {
          console.warn('\nCLI is unavailable. Please run release analysis manually:');
          console.warn('  npm run release:analyze');
          console.warn('\nOr install dependencies:');
          console.warn('  npm install');
        }
        break;

      case CLIErrorCategory.TIMEOUT:
        console.warn('\nAnalysis timed out. Try:');
        console.warn('  - Increasing timeout value');
        console.warn('  - Running with --skip-confirmation');
        console.warn('  - Breaking analysis into smaller scopes');
        break;

      case CLIErrorCategory.PARSE_ERROR:
        console.warn('\nFailed to parse CLI output. Try:');
        console.warn('  - Running CLI manually to inspect output');
        console.warn('  - Verifying --format json is working correctly');
        console.warn('  - Updating CLI to latest version');
        break;

      default:
        console.warn('\nError occurred during CLI execution.');
        console.warn('Recovery suggestions:');
        error.recoverySuggestions.forEach(suggestion => {
          console.warn(`  - ${suggestion}`);
        });
    }

    // Re-throw error after logging and fallback attempts
    throw error;
  }

  /**
   * Validate CLI execution result
   */
  validateResult(result: CLIExecutionResult): void {
    if (!result.success) {
      const error = this.createError(result);
      throw error;
    }

    // Additional validation
    if (result.stdout.trim().length === 0) {
      throw new CLIError(
        'CLI produced no output',
        CLIErrorCategory.EXECUTION_FAILED,
        undefined,
        result,
        ['Check if CLI is configured correctly', 'Verify completion documents exist']
      );
    }
  }

  /**
   * Validate JSON parsing result
   */
  validateParsing(result: CLIExecutionResult, parseError?: Error): void {
    if (parseError) {
      const error = this.createError(result, parseError);
      throw error;
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(error: Error): boolean {
    if (error instanceof CLIError) {
      return error.isRetryable();
    }
    return false;
  }

  /**
   * Get retry delay for error
   */
  getRetryDelay(attempt: number, strategy: Partial<RetryStrategy> = {}): number {
    const retryStrategy = { ...this.defaultRetryStrategy, ...strategy };
    return Math.min(
      retryStrategy.initialDelay * Math.pow(retryStrategy.backoffMultiplier, attempt),
      retryStrategy.maxDelay
    );
  }
}
