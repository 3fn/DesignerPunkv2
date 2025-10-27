/**
 * Error Documentation and Suggestions
 *
 * Provides comprehensive documentation, actionable suggestions, and
 * contextual information for all build system error types.
 */
import { BuildError } from './BuildError';
/**
 * Documentation entry for an error code
 */
export interface ErrorDocumentation {
    /** Error code */
    code: string;
    /** Brief description of the error */
    description: string;
    /** Detailed explanation of what causes this error */
    cause: string;
    /** Actionable suggestions for fixing the error */
    suggestions: string[];
    /** Links to relevant documentation */
    documentationLinks: string[];
    /** Example scenarios where this error occurs */
    examples?: string[];
    /** Related error codes */
    relatedErrors?: string[];
}
/**
 * Error documentation registry
 *
 * Comprehensive documentation for all error codes in the build system.
 */
export declare const ERROR_DOCUMENTATION: Record<string, ErrorDocumentation>;
/**
 * Get documentation for an error code
 */
export declare function getErrorDocumentation(code: string): ErrorDocumentation | undefined;
/**
 * Enhance a BuildError with comprehensive documentation and suggestions
 */
export declare function enhanceErrorWithDocumentation(error: BuildError): BuildError;
/**
 * Format error with file paths and line numbers for debugging
 */
export interface ErrorLocation {
    /** File path where error occurred */
    filePath?: string;
    /** Line number where error occurred */
    lineNumber?: number;
    /** Column number where error occurred */
    columnNumber?: number;
    /** Code snippet around the error location */
    codeSnippet?: string;
}
/**
 * Add location information to error context
 */
export declare function addErrorLocation(error: BuildError, location: ErrorLocation): BuildError;
/**
 * Format error message with context for display
 */
export declare function formatErrorMessage(error: BuildError): string;
/**
 * Generate error report with all errors formatted
 */
export declare function generateErrorReport(errors: BuildError[]): string;
//# sourceMappingURL=ErrorDocumentation.d.ts.map