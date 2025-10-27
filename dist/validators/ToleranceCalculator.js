"use strict";
/**
 * Tolerance Calculator for Cross-Platform Mathematical Consistency
 *
 * Calculates appropriate tolerance levels for cross-platform validation
 * considering platform-specific rounding, unit conversion precision,
 * and mathematical relationship preservation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToleranceCalculator = exports.DEFAULT_TOLERANCE_CONFIG = void 0;
const types_1 = require("../types");
/**
 * Default tolerance configuration optimized for cross-platform consistency
 */
exports.DEFAULT_TOLERANCE_CONFIG = {
    baseTolerance: 0.001,
    conversionTolerance: 0.01,
    platformConstraintTolerance: 0.05,
    categoryTolerances: {
        [types_1.TokenCategory.SPACING]: 0.001,
        [types_1.TokenCategory.FONT_SIZE]: 0.002, // Higher tolerance for REM precision rounding
        [types_1.TokenCategory.LINE_HEIGHT]: 0.001,
        [types_1.TokenCategory.RADIUS]: 0.001,
        [types_1.TokenCategory.DENSITY]: 0.001,
        [types_1.TokenCategory.TAP_AREA]: 0.001,
        [types_1.TokenCategory.FONT_FAMILY]: 0, // Exact match required for strings
        [types_1.TokenCategory.FONT_WEIGHT]: 0, // Exact match required for weights
        [types_1.TokenCategory.LETTER_SPACING]: 0.001
    }
};
/**
 * Calculator for determining appropriate tolerance levels for cross-platform validation
 */
class ToleranceCalculator {
    constructor(config = exports.DEFAULT_TOLERANCE_CONFIG) {
        this.config = config;
    }
    /**
     * Calculate tolerance for a specific validation context
     */
    calculateTolerance(context) {
        // For string values (fontFamily), require exact match
        if (typeof context.baseValue === 'string') {
            return {
                tolerance: 0,
                reasoning: 'Categorical values require exact string matching across platforms',
                components: { base: 0, conversion: 0, platformConstraint: 0, categoryAdjustment: 0 },
                requiresExactMatch: true
            };
        }
        // Start with base tolerance
        let tolerance = this.config.baseTolerance;
        const components = {
            base: this.config.baseTolerance,
            conversion: 0,
            platformConstraint: 0,
            categoryAdjustment: 0
        };
        // Add conversion tolerance if unit conversion is involved
        if (context.hasUnitConversion) {
            const conversionTolerance = this.calculateConversionTolerance(context);
            tolerance += conversionTolerance;
            components.conversion = conversionTolerance;
        }
        // Add platform constraint tolerance if constraints are present
        if (context.hasPlatformConstraints) {
            const constraintTolerance = this.calculatePlatformConstraintTolerance(context);
            tolerance += constraintTolerance;
            components.platformConstraint = constraintTolerance;
        }
        // Apply category-specific adjustments
        const categoryAdjustment = this.getCategoryTolerance(context.category);
        if (categoryAdjustment !== this.config.baseTolerance) {
            tolerance = tolerance - this.config.baseTolerance + categoryAdjustment;
            components.categoryAdjustment = categoryAdjustment - this.config.baseTolerance;
        }
        // Strategic flexibility tokens may have slightly higher tolerance
        if (context.isStrategicFlexibility) {
            tolerance *= 1.1;
            components.base *= 1.1;
        }
        const reasoning = this.generateToleranceReasoning(context, components);
        return {
            tolerance,
            reasoning,
            components,
            requiresExactMatch: false
        };
    }
    /**
     * Calculate tolerance for unit conversion scenarios
     */
    calculateConversionTolerance(context) {
        const baseConversionTolerance = this.config.conversionTolerance;
        // Different categories may have different conversion precision requirements
        switch (context.category) {
            case types_1.TokenCategory.FONT_SIZE:
                // REM conversion introduces 3-decimal precision rounding (e.g., 0.8125 → 0.813)
                // Maximum rounding error is 0.0005 (half of the precision unit)
                return Math.max(baseConversionTolerance * 2.0, 0.001);
            case types_1.TokenCategory.SPACING:
            case types_1.TokenCategory.RADIUS:
            case types_1.TokenCategory.TAP_AREA:
                // These typically have 1:1 conversion ratios, minimal tolerance needed
                return baseConversionTolerance * 0.1;
            case types_1.TokenCategory.LINE_HEIGHT:
            case types_1.TokenCategory.DENSITY:
                // Unitless values should have minimal conversion tolerance
                return baseConversionTolerance * 0.1;
            case types_1.TokenCategory.LETTER_SPACING:
                // Em-based values may have slight precision variations
                return baseConversionTolerance * 0.3;
            default:
                return baseConversionTolerance;
        }
    }
    /**
     * Calculate tolerance for platform-specific constraints
     */
    calculatePlatformConstraintTolerance(context) {
        const baseConstraintTolerance = this.config.platformConstraintTolerance;
        // Platform constraints vary by category and platform combination
        const platformCount = context.platforms.length;
        const hasAndroid = context.platforms.includes('android');
        const hasIOS = context.platforms.includes('ios');
        const hasWeb = context.platforms.includes('web');
        let constraintMultiplier = 1.0;
        // Android density buckets may introduce constraints
        if (hasAndroid) {
            constraintMultiplier *= 1.1;
        }
        // iOS display scales may introduce constraints
        if (hasIOS) {
            constraintMultiplier *= 1.05;
        }
        // Web REM calculations may introduce precision variations
        if (hasWeb && context.category === types_1.TokenCategory.FONT_SIZE) {
            constraintMultiplier *= 1.2;
        }
        // More platforms = potentially more constraint variations
        if (platformCount > 2) {
            constraintMultiplier *= 1.1;
        }
        return baseConstraintTolerance * constraintMultiplier;
    }
    /**
     * Get category-specific tolerance
     */
    getCategoryTolerance(category) {
        return this.config.categoryTolerances[category] ?? this.config.baseTolerance;
    }
    /**
     * Generate human-readable reasoning for tolerance calculation
     */
    generateToleranceReasoning(context, components) {
        const reasons = [];
        reasons.push(`Base mathematical tolerance: ${components.base.toFixed(4)}`);
        if (components.conversion > 0) {
            reasons.push(`Unit conversion tolerance: ${components.conversion.toFixed(4)} (${context.category} conversion precision)`);
        }
        if (components.platformConstraint > 0) {
            reasons.push(`Platform constraint tolerance: ${components.platformConstraint.toFixed(4)} (${context.platforms.join(', ')} compatibility)`);
        }
        if (components.categoryAdjustment !== 0) {
            const adjustment = components.categoryAdjustment > 0 ? 'increased' : 'decreased';
            reasons.push(`Category adjustment: ${adjustment} by ${Math.abs(components.categoryAdjustment).toFixed(4)} for ${context.category} tokens`);
        }
        if (context.isStrategicFlexibility) {
            reasons.push('Strategic flexibility token: tolerance increased by 10%');
        }
        return reasons.join('; ');
    }
    /**
     * Determine if two values are within tolerance
     */
    isWithinTolerance(value1, value2, toleranceResult) {
        // Handle exact match requirement for categorical values
        if (toleranceResult.requiresExactMatch) {
            return value1 === value2;
        }
        // Both values must be numeric for tolerance comparison
        if (typeof value1 !== 'number' || typeof value2 !== 'number') {
            return value1 === value2;
        }
        const difference = Math.abs(value1 - value2);
        return difference <= toleranceResult.tolerance;
    }
    /**
     * Calculate relative tolerance based on value magnitude
     */
    calculateRelativeTolerance(baseValue, context) {
        const absoluteResult = this.calculateTolerance(context);
        // For very small values, use absolute tolerance
        if (Math.abs(baseValue) < 1) {
            return absoluteResult;
        }
        // For larger values, use relative tolerance (percentage of value)
        const relativeTolerancePercent = 0.001; // 0.1%
        const relativeTolerance = Math.abs(baseValue) * relativeTolerancePercent;
        // Use the larger of absolute or relative tolerance
        const finalTolerance = Math.max(absoluteResult.tolerance, relativeTolerance);
        return {
            ...absoluteResult,
            tolerance: finalTolerance,
            reasoning: `${absoluteResult.reasoning}; Relative tolerance applied: ${relativeTolerancePercent * 100}% of base value (${relativeTolerance.toFixed(4)})`
        };
    }
    /**
     * Update tolerance configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    /**
     * Get current tolerance configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
exports.ToleranceCalculator = ToleranceCalculator;
//# sourceMappingURL=ToleranceCalculator.js.map