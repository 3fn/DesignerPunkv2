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
export const DEFAULT_TOLERANCE_CONFIG: ToleranceConfig = {
  baseTolerance: 0.001,
  conversionTolerance: 0.01,
  platformConstraintTolerance: 0.05,
  categoryTolerances: {
    [TokenCategory.SPACING]: 0.001,
    [TokenCategory.FONT_SIZE]: 0.002, // Higher tolerance for REM precision rounding
    [TokenCategory.LINE_HEIGHT]: 0.001,
    [TokenCategory.RADIUS]: 0.001,
    [TokenCategory.DENSITY]: 0.001,
    [TokenCategory.TAP_AREA]: 0.001,
    [TokenCategory.FONT_FAMILY]: 0, // Exact match required for strings
    [TokenCategory.FONT_WEIGHT]: 0, // Exact match required for weights
    [TokenCategory.LETTER_SPACING]: 0.001
  }
};

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
export class ToleranceCalculator {
  private config: ToleranceConfig;

  constructor(config: ToleranceConfig = DEFAULT_TOLERANCE_CONFIG) {
    this.config = config;
  }

  /**
   * Calculate tolerance for a specific validation context
   */
  calculateTolerance(context: ToleranceContext): ToleranceResult {
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
  private calculateConversionTolerance(context: ToleranceContext): number {
    const baseConversionTolerance = this.config.conversionTolerance;

    // Different categories may have different conversion precision requirements
    switch (context.category) {
      case TokenCategory.FONT_SIZE:
        // REM conversion introduces 3-decimal precision rounding (e.g., 0.8125 → 0.813)
        // Maximum rounding error is 0.0005 (half of the precision unit)
        return Math.max(baseConversionTolerance * 2.0, 0.001);

      case TokenCategory.SPACING:
      case TokenCategory.RADIUS:
      case TokenCategory.TAP_AREA:
        // These typically have 1:1 conversion ratios, minimal tolerance needed
        return baseConversionTolerance * 0.1;

      case TokenCategory.LINE_HEIGHT:
      case TokenCategory.DENSITY:
        // Unitless values should have minimal conversion tolerance
        return baseConversionTolerance * 0.1;

      case TokenCategory.LETTER_SPACING:
        // Em-based values may have slight precision variations
        return baseConversionTolerance * 0.3;

      default:
        return baseConversionTolerance;
    }
  }

  /**
   * Calculate tolerance for platform-specific constraints
   */
  private calculatePlatformConstraintTolerance(context: ToleranceContext): number {
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
    if (hasWeb && context.category === TokenCategory.FONT_SIZE) {
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
  private getCategoryTolerance(category: TokenCategory): number {
    return this.config.categoryTolerances[category] ?? this.config.baseTolerance;
  }

  /**
   * Generate human-readable reasoning for tolerance calculation
   */
  private generateToleranceReasoning(context: ToleranceContext, components: ToleranceResult['components']): string {
    const reasons: string[] = [];

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
  isWithinTolerance(value1: number | string, value2: number | string, toleranceResult: ToleranceResult): boolean {
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
  calculateRelativeTolerance(baseValue: number, context: ToleranceContext): ToleranceResult {
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
  updateConfig(newConfig: Partial<ToleranceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current tolerance configuration
   */
  getConfig(): ToleranceConfig {
    return { ...this.config };
  }
}