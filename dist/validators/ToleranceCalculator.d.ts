/**
 * Tolerance Calculator for Cross-Platform Mathematical Consistency
 *
 * Calculates appropriate tolerance levels for cross-platform validation
 * considering platform-specific rounding, unit conversion precision,
 * and mathematical relationship preservation.
 */
import { TokenCategory } from '../types';
/**
 * Tolerance configuration for different validation scenarios
 */
export interface ToleranceConfig {
    /** Base tolerance for mathematical calculations */
    baseTolerance: number;
    /** Additional tolerance for unit conversion rounding */
    conversionTolerance: number;
    /** Tolerance for platform-specific constraints */
    platformConstraintTolerance: number;
    /** Category-specific tolerance adjustments */
    categoryTolerances: Record<string, number>;
}
/**
 * Default tolerance configuration optimized for cross-platform consistency
 */
export declare const DEFAULT_TOLERANCE_CONFIG: ToleranceConfig;
/**
 * Tolerance calculation context for specific validation scenarios
 */
export interface ToleranceContext {
    /** Token category being validated */
    category: TokenCategory;
    /** Platforms being compared */
    platforms: string[];
    /** Whether unit conversion is involved */
    hasUnitConversion: boolean;
    /** Whether platform constraints are present */
    hasPlatformConstraints: boolean;
    /** Base value being validated */
    baseValue: number | string;
    /** Whether this is a strategic flexibility token */
    isStrategicFlexibility: boolean;
}
/**
 * Calculated tolerance result with reasoning
 */
export interface ToleranceResult {
    /** Calculated tolerance value */
    tolerance: number;
    /** Reasoning for the tolerance calculation */
    reasoning: string;
    /** Components that contributed to the tolerance */
    components: {
        base: number;
        conversion: number;
        platformConstraint: number;
        categoryAdjustment: number;
    };
    /** Whether exact match is required (for categorical values) */
    requiresExactMatch: boolean;
}
/**
 * Calculator for determining appropriate tolerance levels for cross-platform validation
 */
export declare class ToleranceCalculator {
    private config;
    constructor(config?: ToleranceConfig);
    /**
     * Calculate tolerance for a specific validation context
     */
    calculateTolerance(context: ToleranceContext): ToleranceResult;
    /**
     * Calculate tolerance for unit conversion scenarios
     */
    private calculateConversionTolerance;
    /**
     * Calculate tolerance for platform-specific constraints
     */
    private calculatePlatformConstraintTolerance;
    /**
     * Get category-specific tolerance
     */
    private getCategoryTolerance;
    /**
     * Generate human-readable reasoning for tolerance calculation
     */
    private generateToleranceReasoning;
    /**
     * Determine if two values are within tolerance
     */
    isWithinTolerance(value1: number | string, value2: number | string, toleranceResult: ToleranceResult): boolean;
    /**
     * Calculate relative tolerance based on value magnitude
     */
    calculateRelativeTolerance(baseValue: number, context: ToleranceContext): ToleranceResult;
    /**
     * Update tolerance configuration
     */
    updateConfig(newConfig: Partial<ToleranceConfig>): void;
    /**
     * Get current tolerance configuration
     */
    getConfig(): ToleranceConfig;
}
//# sourceMappingURL=ToleranceCalculator.d.ts.map