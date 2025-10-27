/**
 * Validation Result Interfaces
 *
 * Defines the three-tier validation system interfaces for providing
 * clear feedback on token usage patterns and mathematical consistency.
 */
/**
 * Validation levels for the three-tier validation system
 */
export type ValidationLevel = 'Pass' | 'Warning' | 'Error';
/**
 * Validation result providing feedback on token usage
 */
export interface ValidationResult {
    /** Validation level indicating severity and compliance */
    level: ValidationLevel;
    /** Token name or identifier being validated */
    token: string;
    /** Human-readable validation message */
    message: string;
    /** Detailed rationale explaining the validation result */
    rationale: string;
    /** Optional suggestions for improvement or correction */
    suggestions?: string[];
    /** Mathematical reasoning behind the validation decision */
    mathematicalReasoning: string;
}
/**
 * Usage pattern analysis result for tracking token adoption
 */
export interface UsagePatternResult {
    /** Token or pattern being analyzed */
    identifier: string;
    /** Usage frequency or percentage */
    usageMetric: number;
    /** Whether usage meets established thresholds */
    meetsThreshold: boolean;
    /** Recommendations for improving usage patterns */
    recommendations: string[];
    /** Analysis period or context */
    analysisContext: string;
}
/**
 * Cross-platform consistency validation result
 */
export interface ConsistencyValidationResult {
    /** Platforms being compared */
    platforms: string[];
    /** Whether mathematical consistency is maintained */
    isConsistent: boolean;
    /** Tolerance level used for comparison */
    toleranceLevel: number;
    /** Detected inconsistencies if any */
    inconsistencies?: string[];
    /** Mathematical relationship validation details */
    relationshipValidation: string;
}
//# sourceMappingURL=ValidationResult.d.ts.map