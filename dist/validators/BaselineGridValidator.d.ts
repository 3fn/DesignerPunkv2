import type { ValidationResult } from '../types/ValidationResult';
/**
 * Baseline Grid Validator
 *
 * Validates that primitive tokens align with the 8-unit baseline grid system.
 * Strategic flexibility tokens (2, 4, 6, 10, 12, 20) are treated as Pass-level validation.
 */
export declare const BASELINE_GRID_UNIT = 8;
export interface BaselineGridValidationOptions {
    allowStrategicFlexibility?: boolean;
    customGridUnit?: number;
}
export declare class BaselineGridValidator {
    private readonly gridUnit;
    private readonly allowStrategicFlexibility;
    constructor(options?: BaselineGridValidationOptions);
    /**
     * Validate if a value aligns with the baseline grid
     */
    validate(value: number, tokenName?: string): ValidationResult;
    /**
     * Check if a value is aligned to the baseline grid
     */
    private isBaselineGridAligned;
    /**
     * Get the nearest valid baseline grid values
     */
    private getNearestValidValue;
    /**
     * Validate multiple values at once
     */
    validateBatch(values: Array<{
        value: number;
        tokenName?: string;
    }>): ValidationResult[];
    /**
     * Get baseline grid information
     */
    getGridInfo(): {
        gridUnit: number;
        allowStrategicFlexibility: boolean;
        strategicFlexibilityValues: number[];
    };
}
//# sourceMappingURL=BaselineGridValidator.d.ts.map