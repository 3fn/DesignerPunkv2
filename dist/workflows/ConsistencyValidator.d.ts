/**
 * Consistency Validator
 *
 * Validates mathematical consistency throughout the token generation workflow.
 * Ensures baseline grid alignment, cross-platform consistency, mathematical
 * relationships, and strategic flexibility usage patterns.
 */
import { TokenEngine } from '../TokenEngine';
import type { ValidationResult } from '../types';
/**
 * Consistency validation configuration
 */
export interface ConsistencyValidationConfig {
    checkBaselineGrid?: boolean;
    checkCrossPlatform?: boolean;
    checkMathematicalRelationships?: boolean;
    checkStrategicFlexibility?: boolean;
}
/**
 * Consistency validation result
 */
export interface ConsistencyValidationResult {
    category: string;
    results: ValidationResult[];
    passed: boolean;
    issueCount: number;
}
/**
 * Consistency Validator class
 */
export declare class ConsistencyValidator {
    private engine;
    private categoryResults;
    private initialized;
    constructor(engine: TokenEngine);
    /**
     * Initialize consistency validator
     */
    initialize(): void;
    /**
     * Reset consistency validator
     */
    reset(): void;
    /**
     * Execute complete consistency validation
     */
    validate(config?: ConsistencyValidationConfig): Promise<ValidationResult[]>;
    /**
     * Validate baseline grid alignment
     */
    private validateBaselineGrid;
    /**
     * Validate cross-platform consistency
     */
    private validateCrossPlatform;
    /**
     * Validate mathematical relationships
     */
    private validateMathematicalRelationships;
    /**
     * Validate strategic flexibility usage patterns
     */
    private validateStrategicFlexibility;
    /**
     * Create category result from validation results
     */
    private createCategoryResult;
    /**
     * Get all category results
     */
    getCategoryResults(): ConsistencyValidationResult[];
    /**
     * Get summary of consistency validation
     */
    getSummary(): {
        totalCategories: number;
        passedCategories: number;
        failedCategories: number;
        totalIssues: number;
        criticalIssues: number;
    };
    /**
     * Check if all consistency checks passed
     */
    isPassed(): boolean;
    /**
     * Get failed categories
     */
    getFailedCategories(): ConsistencyValidationResult[];
}
//# sourceMappingURL=ConsistencyValidator.d.ts.map