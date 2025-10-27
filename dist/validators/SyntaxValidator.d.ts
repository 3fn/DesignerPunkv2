import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
/**
 * Syntax validation result
 */
export interface SyntaxValidationResult {
    /** Whether syntax is valid */
    valid: boolean;
    /** Platform being validated */
    platform: TargetPlatform;
    /** Output format being validated */
    format: OutputFormat;
    /** Validation errors (if any) */
    errors?: SyntaxError[];
    /** Validation warnings (if any) */
    warnings?: SyntaxWarning[];
    /** Additional validation details */
    details?: string;
}
/**
 * Syntax error details
 */
export interface SyntaxError {
    /** Error message */
    message: string;
    /** Line number where error occurred (if applicable) */
    line?: number;
    /** Column number where error occurred (if applicable) */
    column?: number;
    /** Severity level */
    severity: 'error' | 'critical';
    /** Suggested fix (if available) */
    suggestion?: string;
}
/**
 * Syntax warning details
 */
export interface SyntaxWarning {
    /** Warning message */
    message: string;
    /** Line number where warning occurred (if applicable) */
    line?: number;
    /** Suggested improvement */
    suggestion?: string;
}
/**
 * Validates platform-specific syntax for generated token files
 */
export declare class SyntaxValidator {
    private rules;
    constructor();
    /**
     * Initialize platform-specific syntax rules
     */
    private initializeRules;
    /**
     * Validate syntax for a specific platform and format
     */
    validate(content: string, platform: TargetPlatform, format: OutputFormat): SyntaxValidationResult;
    /**
     * Check if delimiters are balanced
     */
    private checkBalancedDelimiters;
    /**
     * Escape special regex characters
     */
    private escapeRegex;
    /**
     * Perform format-specific validation checks
     */
    private performFormatSpecificChecks;
    /**
     * Generate validation details summary
     */
    private generateValidationDetails;
    /**
     * Validate file extension
     */
    validateExtension(filename: string, platform: TargetPlatform, format: OutputFormat): {
        valid: boolean;
        error?: string;
    };
    /**
     * Batch validate multiple files
     */
    validateBatch(files: Array<{
        content: string;
        platform: TargetPlatform;
        format: OutputFormat;
    }>): Map<string, SyntaxValidationResult>;
    /**
     * Get validation summary
     */
    getSummary(results: Map<string, SyntaxValidationResult>): {
        total: number;
        valid: number;
        invalid: number;
        totalErrors: number;
        totalWarnings: number;
    };
}
//# sourceMappingURL=SyntaxValidator.d.ts.map