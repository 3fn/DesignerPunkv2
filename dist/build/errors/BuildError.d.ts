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
export type ErrorCategory = 'config' | 'build' | 'token' | 'interface';
/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';
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
export declare function createBuildError(params: {
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
}): BuildError;
/**
 * Common error codes for the build system
 */
export declare const ErrorCodes: {
    readonly CONFIG_INVALID_PLATFORM: "CONFIG_INVALID_PLATFORM";
    readonly CONFIG_MISSING_REQUIRED: "CONFIG_MISSING_REQUIRED";
    readonly CONFIG_CONFLICTING_OPTIONS: "CONFIG_CONFLICTING_OPTIONS";
    readonly CONFIG_INVALID_OUTPUT_DIR: "CONFIG_INVALID_OUTPUT_DIR";
    readonly BUILD_COMPILATION_FAILED: "BUILD_COMPILATION_FAILED";
    readonly BUILD_MISSING_DEPENDENCY: "BUILD_MISSING_DEPENDENCY";
    readonly BUILD_INVALID_SOURCE: "BUILD_INVALID_SOURCE";
    readonly BUILD_PACKAGE_GENERATION_FAILED: "BUILD_PACKAGE_GENERATION_FAILED";
    readonly TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND";
    readonly TOKEN_INVALID_SELECTION: "TOKEN_INVALID_SELECTION";
    readonly TOKEN_MATHEMATICAL_INCONSISTENCY: "TOKEN_MATHEMATICAL_INCONSISTENCY";
    readonly TOKEN_CONVERSION_FAILED: "TOKEN_CONVERSION_FAILED";
    readonly INTERFACE_METHOD_MISMATCH: "INTERFACE_METHOD_MISMATCH";
    readonly INTERFACE_PROPERTY_MISMATCH: "INTERFACE_PROPERTY_MISMATCH";
    readonly INTERFACE_MISSING_IMPLEMENTATION: "INTERFACE_MISSING_IMPLEMENTATION";
    readonly INTERFACE_BEHAVIORAL_INCONSISTENCY: "INTERFACE_BEHAVIORAL_INCONSISTENCY";
};
/**
 * Type guard to check if an error is a BuildError
 */
export declare function isBuildError(error: unknown): error is BuildError;
//# sourceMappingURL=BuildError.d.ts.map