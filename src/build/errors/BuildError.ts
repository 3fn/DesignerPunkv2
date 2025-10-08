/**
 * Build Error Interface and Types
 * 
 * Defines error structures for the Cross-Platform Build System.
 * Provides categorization, severity levels, and contextual information
 * for comprehensive error handling and reporting.
 */

/**
 * Error category types for build system errors
 */
export type ErrorCategory = 
  | 'config'      // Configuration errors (invalid platform, missing options)
  | 'build'       // Build execution errors (compilation, packaging)
  | 'token'       // Token integration errors (missing tokens, conversion failures)
  | 'interface';  // Interface validation errors (API mismatches)

/**
 * Error severity levels
 */
export type ErrorSeverity = 
  | 'error'   // Critical error that blocks build
  | 'warning' // Non-blocking issue that should be addressed
  | 'info';   // Informational message

/**
 * Platform type for platform-specific errors
 */
export type Platform = 'ios' | 'android' | 'web';

/**
 * Build error interface with comprehensive error information
 */
export interface BuildError {
  /** Unique error code for identification */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Error severity level */
  severity: ErrorSeverity;
  
  /** Error category for classification */
  category: ErrorCategory;
  
  /** Platform where error occurred (optional) */
  platform?: Platform;
  
  /** Component name where error occurred (optional) */
  component?: string;
  
  /** Additional context information */
  context: Record<string, unknown>;
  
  /** Actionable suggestions for fixing the error */
  suggestions: string[];
  
  /** Links to relevant documentation */
  documentation: string[];
  
  /** Original error if this wraps another error */
  originalError?: Error;
  
  /** Timestamp when error occurred */
  timestamp: Date;
}

/**
 * Factory function to create BuildError instances
 */
export function createBuildError(params: {
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  platform?: Platform;
  component?: string;
  context?: Record<string, unknown>;
  suggestions?: string[];
  documentation?: string[];
  originalError?: Error;
}): BuildError {
  return {
    code: params.code,
    message: params.message,
    severity: params.severity,
    category: params.category,
    platform: params.platform,
    component: params.component,
    context: params.context || {},
    suggestions: params.suggestions || [],
    documentation: params.documentation || [],
    originalError: params.originalError,
    timestamp: new Date(),
  };
}

/**
 * Common error codes for the build system
 */
export const ErrorCodes = {
  // Configuration errors (CONFIG_*)
  CONFIG_INVALID_PLATFORM: 'CONFIG_INVALID_PLATFORM',
  CONFIG_MISSING_REQUIRED: 'CONFIG_MISSING_REQUIRED',
  CONFIG_CONFLICTING_OPTIONS: 'CONFIG_CONFLICTING_OPTIONS',
  CONFIG_INVALID_OUTPUT_DIR: 'CONFIG_INVALID_OUTPUT_DIR',
  
  // Build errors (BUILD_*)
  BUILD_COMPILATION_FAILED: 'BUILD_COMPILATION_FAILED',
  BUILD_MISSING_DEPENDENCY: 'BUILD_MISSING_DEPENDENCY',
  BUILD_INVALID_SOURCE: 'BUILD_INVALID_SOURCE',
  BUILD_PACKAGE_GENERATION_FAILED: 'BUILD_PACKAGE_GENERATION_FAILED',
  
  // Token errors (TOKEN_*)
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  TOKEN_INVALID_SELECTION: 'TOKEN_INVALID_SELECTION',
  TOKEN_MATHEMATICAL_INCONSISTENCY: 'TOKEN_MATHEMATICAL_INCONSISTENCY',
  TOKEN_CONVERSION_FAILED: 'TOKEN_CONVERSION_FAILED',
  
  // Interface errors (INTERFACE_*)
  INTERFACE_METHOD_MISMATCH: 'INTERFACE_METHOD_MISMATCH',
  INTERFACE_PROPERTY_MISMATCH: 'INTERFACE_PROPERTY_MISMATCH',
  INTERFACE_MISSING_IMPLEMENTATION: 'INTERFACE_MISSING_IMPLEMENTATION',
  INTERFACE_BEHAVIORAL_INCONSISTENCY: 'INTERFACE_BEHAVIORAL_INCONSISTENCY',
} as const;

/**
 * Type guard to check if an error is a BuildError
 */
export function isBuildError(error: unknown): error is BuildError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'severity' in error &&
    'category' in error
  );
}
