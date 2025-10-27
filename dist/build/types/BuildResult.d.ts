/**
 * Build Result Interface
 *
 * Defines the structure for build output and status reporting.
 * Provides detailed information about build success, failures, warnings,
 * and generated artifacts.
 */
import { Platform } from './Platform';
/**
 * Build error categories
 */
export type ErrorCategory = 'configuration' | 'build' | 'token' | 'interface' | 'validation';
/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';
/**
 * Build error details
 */
export interface BuildError {
    /** Error code for categorization */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Error severity level */
    severity: ErrorSeverity;
    /** Error category */
    category: ErrorCategory;
    /** Platform where error occurred (if applicable) */
    platform?: Platform;
    /** Component where error occurred (if applicable) */
    component?: string;
    /** Additional error context */
    context: Record<string, unknown>;
    /** Suggested actions to resolve the error */
    suggestions: string[];
    /** Links to relevant documentation */
    documentation: string[];
}
/**
 * Build status
 */
export type BuildStatus = 'success' | 'failure' | 'partial';
/**
 * Build result for a single platform
 */
export interface BuildResult {
    /** Target platform */
    platform: Platform;
    /** Build success status */
    success: boolean;
    /** Path to generated package */
    packagePath: string;
    /** Build duration in milliseconds */
    duration: number;
    /** Build warnings (non-fatal issues) */
    warnings: string[];
    /** Build errors (fatal issues) */
    errors: BuildError[];
    /** Additional metadata about the build */
    metadata?: {
        /** Number of components built */
        componentsBuilt?: number;
        /** Number of tokens generated */
        tokensGenerated?: number;
        /** Package size in bytes */
        packageSize?: number;
        /** Build timestamp */
        timestamp?: string;
    };
}
/**
 * Aggregated build results for multiple platforms
 */
export interface BuildResultSummary {
    /** Overall build status */
    status: BuildStatus;
    /** Individual platform results */
    results: BuildResult[];
    /** Total build duration in milliseconds */
    totalDuration: number;
    /** Number of successful builds */
    successCount: number;
    /** Number of failed builds */
    failureCount: number;
    /** Aggregated warnings from all platforms */
    allWarnings: string[];
    /** Aggregated errors from all platforms */
    allErrors: BuildError[];
}
//# sourceMappingURL=BuildResult.d.ts.map