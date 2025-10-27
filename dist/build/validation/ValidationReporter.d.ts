/**
 * Validation Reporter
 *
 * Generates detailed validation reports with platform differences,
 * actionable suggestions, file paths, and validation status summaries.
 */
import { ValidationReport, ValidationErrorType } from './types/ValidationResult';
import { Platform } from './types/InterfaceDefinition';
export interface DetailedValidationReport {
    /** Overall validation status */
    valid: boolean;
    /** Component name */
    component: string;
    /** Summary section */
    summary: ValidationSummary;
    /** Platform-specific results */
    platformResults: PlatformValidationDetail[];
    /** Cross-platform differences */
    differences: PlatformDifference[];
    /** Actionable suggestions */
    suggestions: ActionableSuggestion[];
    /** Report timestamp */
    timestamp: Date;
}
export interface ValidationSummary {
    /** Total errors across all platforms */
    totalErrors: number;
    /** Total warnings across all platforms */
    totalWarnings: number;
    /** Platforms validated */
    platforms: Platform[];
    /** Validation status by platform */
    platformStatus: Record<Platform, 'pass' | 'fail'>;
    /** Error breakdown by type */
    errorsByType: Record<ValidationErrorType, number>;
}
export interface PlatformValidationDetail {
    /** Platform name */
    platform: Platform;
    /** Validation status */
    status: 'pass' | 'fail';
    /** Number of errors */
    errorCount: number;
    /** Number of warnings */
    warningCount: number;
    /** Detailed errors with file paths */
    errors: DetailedError[];
    /** Detailed warnings */
    warnings: DetailedWarning[];
}
export interface DetailedError {
    /** Error type */
    type: ValidationErrorType;
    /** Error message */
    message: string;
    /** Expected value */
    expected: string;
    /** Actual value */
    actual: string;
    /** Location (property/method name) */
    location: string;
    /** File path where error occurred */
    filePath?: string;
    /** Line number in file */
    lineNumber?: number;
    /** Platforms involved */
    platforms: Platform[];
    /** Suggestion for fixing */
    suggestion: string;
}
export interface DetailedWarning {
    /** Warning type */
    type: string;
    /** Warning message */
    message: string;
    /** Location */
    location: string;
    /** File path */
    filePath?: string;
    /** Suggestion */
    suggestion?: string;
}
export interface PlatformDifference {
    /** Type of difference */
    type: 'property' | 'method' | 'event' | 'state';
    /** Name of the differing element */
    name: string;
    /** Platforms involved */
    platforms: Platform[];
    /** Description of difference */
    description: string;
    /** Platform-specific values */
    values: Record<Platform, string>;
    /** Suggestion for resolution */
    suggestion: string;
}
export interface ActionableSuggestion {
    /** Priority level */
    priority: 'high' | 'medium' | 'low';
    /** Suggestion title */
    title: string;
    /** Detailed description */
    description: string;
    /** Affected platforms */
    platforms: Platform[];
    /** Steps to resolve */
    steps: string[];
    /** Related errors */
    relatedErrors: string[];
}
export declare class ValidationReporter {
    /**
     * Generate detailed validation report from validation results
     */
    generateReport(report: ValidationReport): DetailedValidationReport;
    /**
     * Generate summary section
     */
    private generateSummary;
    /**
     * Generate platform-specific validation details
     */
    private generatePlatformResults;
    /**
     * Enrich error with file path and actionable suggestion
     */
    private enrichError;
    /**
     * Enrich warning with details
     */
    private enrichWarning;
    /**
     * Infer file path based on error and platform
     */
    private inferFilePath;
    /**
     * Generate actionable suggestion for error
     */
    private generateErrorSuggestion;
    /**
     * Extract platform differences from validation report
     */
    private extractPlatformDifferences;
    /**
     * Create platform difference from error
     */
    private createPlatformDifference;
    /**
     * Generate actionable suggestions for fixing validation issues
     */
    private generateActionableSuggestions;
    /**
     * Group errors by type
     */
    private groupErrorsByType;
    /**
     * Create suggestion for specific error type
     */
    private createSuggestionForErrorType;
    /**
     * Format report as human-readable text
     */
    formatAsText(report: DetailedValidationReport): string;
    /**
     * Format report as JSON
     */
    formatAsJSON(report: DetailedValidationReport): string;
    /**
     * Format report as Markdown
     */
    formatAsMarkdown(report: DetailedValidationReport): string;
}
//# sourceMappingURL=ValidationReporter.d.ts.map