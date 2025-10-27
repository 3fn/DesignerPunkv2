/**
 * Build Error Handler
 *
 * Provides comprehensive error handling and fallback options for build system
 * integration. Ensures clear error messages and graceful degradation when
 * build integration encounters issues.
 */
import type { TargetPlatform, BuildSystemConfig } from './BuildSystemInterface';
/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';
/**
 * Error category for better organization
 */
export type ErrorCategory = 'configuration' | 'platform' | 'generation' | 'validation' | 'filesystem' | 'integration';
/**
 * Build error details
 */
export interface BuildError {
    /** Error code for programmatic handling */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Error severity */
    severity: ErrorSeverity;
    /** Error category */
    category: ErrorCategory;
    /** Detailed context about the error */
    context?: Record<string, unknown>;
    /** Suggested solutions */
    suggestions: string[];
    /** Related documentation links */
    documentation?: string[];
    /** Original error if wrapped */
    originalError?: Error;
}
/**
 * Fallback strategy for error recovery
 */
export type FallbackStrategy = 'use-default' | 'skip-platform' | 'use-cache' | 'manual' | 'abort';
/**
 * Fallback options
 */
export interface FallbackOptions {
    /** Fallback strategy to use */
    strategy: FallbackStrategy;
    /** Default platform to use as fallback */
    defaultPlatform?: TargetPlatform;
    /** Whether to cache successful builds */
    enableCache?: boolean;
    /** Maximum number of retry attempts */
    maxRetries?: number;
    /** Custom fallback handler */
    customHandler?: (error: BuildError) => Promise<void>;
}
/**
 * Error recovery result
 */
export interface ErrorRecoveryResult {
    /** Whether recovery was successful */
    recovered: boolean;
    /** Strategy used for recovery */
    strategy: FallbackStrategy;
    /** Actions taken during recovery */
    actions: string[];
    /** Warnings generated during recovery */
    warnings: string[];
    /** Whether manual intervention is required */
    requiresManualIntervention: boolean;
}
/**
 * Build error handler
 *
 * Handles errors during build system integration with clear messages,
 * helpful suggestions, and graceful fallback options.
 */
export declare class BuildErrorHandler {
    private errors;
    private fallbackOptions;
    constructor(fallbackOptions?: Partial<FallbackOptions>);
    /**
     * Handle a build error
     */
    handleError(error: Error | BuildError, context?: Record<string, unknown>): BuildError;
    /**
     * Attempt to recover from an error
     */
    recover(error: BuildError): Promise<ErrorRecoveryResult>;
    /**
     * Get all errors
     */
    getErrors(): BuildError[];
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity: ErrorSeverity): BuildError[];
    /**
     * Get errors by category
     */
    getErrorsByCategory(category: ErrorCategory): BuildError[];
    /**
     * Clear all errors
     */
    clearErrors(): void;
    /**
     * Format error for display
     */
    formatError(error: BuildError): string;
    /**
     * Create configuration error
     */
    static configurationError(message: string, config?: BuildSystemConfig, suggestions?: string[]): BuildError;
    /**
     * Create platform error
     */
    static platformError(platform: TargetPlatform, message: string, suggestions?: string[]): BuildError;
    /**
     * Create generation error
     */
    static generationError(message: string, tokenCount?: number, suggestions?: string[]): BuildError;
    /**
     * Create validation error
     */
    static validationError(message: string, validationErrors?: string[], suggestions?: string[]): BuildError;
    /**
     * Create warning
     */
    static warning(message: string, category: ErrorCategory, suggestions?: string[]): BuildError;
    private normalizeToBuildError;
    private isBuildError;
    private recoverWithDefault;
    private recoverBySkipping;
    private recoverFromCache;
}
/**
 * Create a build error handler with default options
 */
export declare function createBuildErrorHandler(options?: Partial<FallbackOptions>): BuildErrorHandler;
//# sourceMappingURL=BuildErrorHandler.d.ts.map