/**
 * Error Reporter
 *
 * Generates comprehensive error reports for build failures.
 * Provides detailed error context, stack traces, recovery recommendations,
 * and build result summaries.
 */
import { BuildError, ErrorCategory, Platform } from './BuildError';
/**
 * Error report interface
 */
export interface ErrorReport {
    /** Report generation timestamp */
    timestamp: Date;
    /** Total number of errors */
    totalErrors: number;
    /** Errors by severity */
    errorsBySeverity: {
        error: number;
        warning: number;
        info: number;
    };
    /** Errors by category */
    errorsByCategory: Record<ErrorCategory, number>;
    /** Errors by platform */
    errorsByPlatform: Record<Platform, number>;
    /** All errors included in report */
    errors: BuildError[];
    /** Summary of build results */
    summary: string;
    /** Recovery recommendations */
    recommendations: string[];
    /** Critical errors that require immediate attention */
    criticalErrors: BuildError[];
    /** Formatted report text */
    formattedReport: string;
}
/**
 * Error report options
 */
export interface ErrorReportOptions {
    /** Include full stack traces */
    includeStackTraces?: boolean;
    /** Include error context details */
    includeContext?: boolean;
    /** Include recovery recommendations */
    includeRecommendations?: boolean;
    /** Maximum number of errors to include in detail */
    maxDetailedErrors?: number;
    /** Format for output (text, json, markdown) */
    format?: 'text' | 'json' | 'markdown';
}
/**
 * Build result summary for error reporting
 */
export interface BuildResultSummary {
    /** Total platforms attempted */
    totalPlatforms: number;
    /** Successful platform builds */
    successfulPlatforms: Platform[];
    /** Failed platform builds */
    failedPlatforms: Platform[];
    /** Build duration in milliseconds */
    duration?: number;
    /** Overall build status */
    status: 'success' | 'partial' | 'failed';
}
/**
 * Error Reporter class
 *
 * Generates comprehensive error reports with detailed context,
 * stack traces, recovery recommendations, and build summaries.
 */
export declare class ErrorReporter {
    private options;
    constructor(options?: ErrorReportOptions);
    /**
     * Generate comprehensive error report
     */
    generateReport(errors: BuildError[], buildSummary?: BuildResultSummary): ErrorReport;
    /**
     * Generate error summary for build results
     */
    generateErrorSummary(errors: BuildError[]): string;
    /**
     * Generate detailed error context
     */
    generateErrorContext(error: BuildError): string;
    /**
     * Generate recovery recommendations based on errors
     */
    generateRecommendations(errors: BuildError[], buildSummary?: BuildResultSummary): string[];
    private countBySeverity;
    private countByCategory;
    private countByPlatform;
    private generateSummary;
    private formatReport;
    private formatAsText;
    private formatAsMarkdown;
    private formatAsJson;
}
//# sourceMappingURL=ErrorReporter.d.ts.map