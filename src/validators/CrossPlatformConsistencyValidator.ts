/**
 * Cross-Platform Mathematical Consistency Validator
 * 
 * Validates proportional relationships across web, iOS, and Android platforms
 * ensuring mathematical equivalence within tolerance levels while handling
 * platform-specific constraints gracefully.
 */

import { PrimitiveToken, TokenCategory, ConsistencyValidationResult } from '../types';
import { UnitProvider } from '../providers/UnitProvider';
import { ToleranceCalculator, ToleranceContext, ToleranceResult } from './ToleranceCalculator';
import { PlatformConstraintHandler, ConstraintHandlingResult } from './PlatformConstraintHandler';

/**
 * Cross-platform validation context
 */
export interface CrossPlatformValidationContext {
  /** Token being validated */
  token: PrimitiveToken;
  
  /** Unit providers for each platform */
  unitProviders: Record<string, UnitProvider>;
  
  /** Whether to apply constraint handling */
  handleConstraints: boolean;
  
  /** Additional validation options */
  options?: {
    /** Use relative tolerance for large values */
    useRelativeTolerance?: boolean;
    
    /** Strict mode - fail on any constraint handling */
    strictMode?: boolean;
    
    /** Custom tolerance multiplier */
    toleranceMultiplier?: number;
  };
}

/**
 * Detailed consistency validation result with mathematical analysis
 */
export interface DetailedConsistencyResult extends ConsistencyValidationResult {
  /** Token name being validated */
  tokenName: string;
  
  /** Token category */
  category: TokenCategory;
  
  /** Platform-specific converted values */
  platformValues: Record<string, any>;
  
  /** Tolerance calculation details */
  toleranceDetails: ToleranceResult;
  
  /** Constraint handling results if applicable */
  constraintHandling?: ConstraintHandlingResult;
  
  /** Detailed mathematical analysis */
  mathematicalAnalysis: {
    /** Proportional relationships between platforms */
    proportionalRelationships: Record<string, number>;
    
    /** Maximum deviation found */
    maxDeviation: number;
    
    /** Platform pairs that failed consistency */
    failedPairs: string[];
    
    /** Overall consistency score (0-1) */
    consistencyScore: number;
  };
  
  /** Recommendations for improving consistency */
  recommendations: string[];
}

/**
 * Cross-platform mathematical consistency validator
 */
export class CrossPlatformConsistencyValidator {
  private toleranceCalculator: ToleranceCalculator;
  private constraintHandler: PlatformConstraintHandler;

  constructor(
    toleranceCalculator?: ToleranceCalculator,
    constraintHandler?: PlatformConstraintHandler
  ) {
    this.toleranceCalculator = toleranceCalculator || new ToleranceCalculator();
    this.constraintHandler = constraintHandler || new PlatformConstraintHandler();
  }

  /**
   * Validate cross-platform mathematical consistency for a token
   */
  async validateToken(context: CrossPlatformValidationContext): Promise<DetailedConsistencyResult> {
    const { token, unitProviders, handleConstraints, options = {} } = context;
    
    // Convert token to platform-specific values
    const platformValues = this.convertToPlatformValues(token, unitProviders);
    
    // Calculate appropriate tolerance
    const toleranceContext: ToleranceContext = {
      category: token.category,
      platforms: Object.keys(unitProviders),
      hasUnitConversion: true,
      hasPlatformConstraints: handleConstraints,
      baseValue: token.baseValue,
      isStrategicFlexibility: token.isStrategicFlexibility
    };

    const toleranceDetails = options.useRelativeTolerance
      ? this.toleranceCalculator.calculateRelativeTolerance(token.baseValue, toleranceContext)
      : this.toleranceCalculator.calculateTolerance(toleranceContext);

    // Apply tolerance multiplier if specified
    if (options.toleranceMultiplier) {
      toleranceDetails.tolerance *= options.toleranceMultiplier;
    }

    // Handle platform constraints if requested
    let constraintHandling: ConstraintHandlingResult | undefined;
    let finalPlatformValues = platformValues;

    if (handleConstraints) {
      constraintHandling = this.constraintHandler.handleConstraints(
        token.name,
        token.category,
        platformValues,
        unitProviders
      );
      finalPlatformValues = constraintHandling.adjustedValues;

      // In strict mode, fail if any constraints were applied
      if (options.strictMode && constraintHandling.hasConstraints) {
        return this.createFailedResult(
          token,
          platformValues,
          toleranceDetails,
          constraintHandling,
          'Strict mode: constraints detected'
        );
      }
    }

    // Perform mathematical consistency analysis
    const mathematicalAnalysis = this.analyzeMathematicalConsistency(
      finalPlatformValues,
      toleranceDetails
    );

    // Determine overall consistency
    const isConsistent = mathematicalAnalysis.consistencyScore >= 0.95 && 
                        mathematicalAnalysis.failedPairs.length === 0;

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      token,
      mathematicalAnalysis,
      constraintHandling
    );

    return {
      tokenName: token.name,
      category: token.category,
      platforms: Object.keys(unitProviders),
      isConsistent,
      toleranceLevel: toleranceDetails.tolerance,
      inconsistencies: mathematicalAnalysis.failedPairs.length > 0 
        ? [`Failed consistency pairs: ${mathematicalAnalysis.failedPairs.join(', ')}`]
        : undefined,
      relationshipValidation: this.generateRelationshipValidation(mathematicalAnalysis),
      platformValues: finalPlatformValues,
      toleranceDetails,
      constraintHandling,
      mathematicalAnalysis,
      recommendations
    };
  }

  /**
   * Convert token to platform-specific values using unit providers
   */
  private convertToPlatformValues(
    token: PrimitiveToken,
    unitProviders: Record<string, UnitProvider>
  ): Record<string, any> {
    const platformValues: Record<string, any> = {};

    Object.entries(unitProviders).forEach(([platform, provider]) => {
      try {
        platformValues[platform] = provider.convertToken(token);
      } catch (error) {
        // Handle conversion errors gracefully
        platformValues[platform] = {
          value: token.baseValue,
          unit: 'error',
          error: error instanceof Error ? error.message : 'Unknown conversion error'
        };
      }
    });

    return platformValues;
  }

  /**
   * Analyze mathematical consistency across platform values
   */
  private analyzeMathematicalConsistency(
    platformValues: Record<string, any>,
    toleranceDetails: ToleranceResult
  ): DetailedConsistencyResult['mathematicalAnalysis'] {
    const platforms = Object.keys(platformValues);
    const proportionalRelationships: Record<string, number> = {};
    const failedPairs: string[] = [];
    let maxDeviation = 0;
    let totalComparisons = 0;
    let successfulComparisons = 0;

    // Compare all platform pairs
    for (let i = 0; i < platforms.length - 1; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        const platform1 = platforms[i];
        const platform2 = platforms[j];
        const value1 = platformValues[platform1];
        const value2 = platformValues[platform2];

        // Skip if either value has an error
        if (value1.unit === 'error' || value2.unit === 'error') {
          failedPairs.push(`${platform1}-${platform2} (conversion error)`);
          continue;
        }

        const pairKey = `${platform1}-${platform2}`;
        totalComparisons++;

        // For string values, check exact equality
        if (typeof value1.value === 'string' || typeof value2.value === 'string') {
          if (value1.value === value2.value) {
            proportionalRelationships[pairKey] = 1.0;
            successfulComparisons++;
          } else {
            proportionalRelationships[pairKey] = 0.0;
            failedPairs.push(`${pairKey} (string mismatch: "${value1.value}" ≠ "${value2.value}")`);
          }
          continue;
        }

        // For numeric values, check within tolerance
        const numValue1 = value1.value as number;
        const numValue2 = value2.value as number;

        // Calculate proportional relationship
        const ratio = numValue2 !== 0 ? numValue1 / numValue2 : (numValue1 === 0 ? 1 : Infinity);
        proportionalRelationships[pairKey] = ratio;

        // Check if values are within tolerance
        const isWithinTolerance = this.toleranceCalculator.isWithinTolerance(
          numValue1,
          numValue2,
          toleranceDetails
        );

        if (isWithinTolerance) {
          successfulComparisons++;
        } else {
          const deviation = Math.abs(numValue1 - numValue2);
          maxDeviation = Math.max(maxDeviation, deviation);
          failedPairs.push(
            `${pairKey} (deviation: ${deviation.toFixed(4)}, tolerance: ${toleranceDetails.tolerance.toFixed(4)})`
          );
        }
      }
    }

    // Calculate overall consistency score
    const consistencyScore = totalComparisons > 0 ? successfulComparisons / totalComparisons : 1.0;

    return {
      proportionalRelationships,
      maxDeviation,
      failedPairs,
      consistencyScore
    };
  }

  /**
   * Generate relationship validation description
   */
  private generateRelationshipValidation(
    analysis: DetailedConsistencyResult['mathematicalAnalysis']
  ): string {
    const validations: string[] = [];

    validations.push(`Consistency score: ${(analysis.consistencyScore * 100).toFixed(1)}%`);

    if (analysis.maxDeviation > 0) {
      validations.push(`Maximum deviation: ${analysis.maxDeviation.toFixed(4)}`);
    }

    if (analysis.failedPairs.length === 0) {
      validations.push('All platform pairs maintain mathematical consistency');
    } else {
      validations.push(`${analysis.failedPairs.length} platform pairs failed consistency checks`);
    }

    // Analyze proportional relationships
    const relationships = Object.values(analysis.proportionalRelationships);
    if (relationships.length > 0) {
      const avgRatio = relationships.reduce((sum, ratio) => sum + (isFinite(ratio) ? ratio : 0), 0) / relationships.length;
      validations.push(`Average proportional ratio: ${avgRatio.toFixed(3)}`);
    }

    return validations.join('; ');
  }

  /**
   * Generate recommendations for improving consistency
   */
  private generateRecommendations(
    token: PrimitiveToken,
    analysis: DetailedConsistencyResult['mathematicalAnalysis'],
    constraintHandling?: ConstraintHandlingResult
  ): string[] {
    const recommendations: string[] = [];

    // Recommendations based on consistency score
    if (analysis.consistencyScore < 0.95) {
      recommendations.push(
        'Consider adjusting base value to improve cross-platform mathematical consistency'
      );
    }

    // Recommendations based on failed pairs
    if (analysis.failedPairs.length > 0) {
      const platformsWithIssues = new Set<string>();
      analysis.failedPairs.forEach(pair => {
        const platforms = pair.split(' ')[0].split('-');
        platforms.forEach(p => platformsWithIssues.add(p));
      });

      recommendations.push(
        `Review unit conversion for platforms: ${Array.from(platformsWithIssues).join(', ')}`
      );
    }

    // Recommendations based on constraint handling
    if (constraintHandling?.hasConstraints) {
      const highSeverityConstraints = constraintHandling.constraints.filter(c => c.severity === 'high');
      if (highSeverityConstraints.length > 0) {
        recommendations.push(
          'High-severity platform constraints detected - consider design system adjustments'
        );
      }

      constraintHandling.constraints.forEach(constraint => {
        if (constraint.recommendation) {
          recommendations.push(constraint.recommendation);
        }
      });
    }

    // Category-specific recommendations
    switch (token.category) {
      case TokenCategory.FONT_SIZE:
        if (analysis.maxDeviation > 0.1) {
          recommendations.push('Consider using font sizes that convert cleanly to REM values');
        }
        break;

      case TokenCategory.TAP_AREA:
        recommendations.push('Ensure tap areas meet platform accessibility requirements (44pt iOS, 48dp Android)');
        break;

      case TokenCategory.SPACING:
      case TokenCategory.RADIUS:
        if (!token.baselineGridAlignment && !token.isStrategicFlexibility) {
          recommendations.push('Consider aligning with 8-unit baseline grid for better consistency');
        }
        break;
    }

    return recommendations;
  }

  /**
   * Create a failed validation result
   */
  private createFailedResult(
    token: PrimitiveToken,
    platformValues: Record<string, any>,
    toleranceDetails: ToleranceResult,
    constraintHandling?: ConstraintHandlingResult,
    reason?: string
  ): DetailedConsistencyResult {
    return {
      tokenName: token.name,
      category: token.category,
      platforms: Object.keys(platformValues),
      isConsistent: false,
      toleranceLevel: toleranceDetails.tolerance,
      inconsistencies: [reason || 'Validation failed'],
      relationshipValidation: reason || 'Failed validation',
      platformValues,
      toleranceDetails,
      constraintHandling,
      mathematicalAnalysis: {
        proportionalRelationships: {},
        maxDeviation: Infinity,
        failedPairs: ['validation-failed'],
        consistencyScore: 0
      },
      recommendations: ['Review token configuration and platform requirements']
    };
  }

  /**
   * Validate multiple tokens for batch consistency checking
   */
  async validateTokens(
    tokens: PrimitiveToken[],
    unitProviders: Record<string, UnitProvider>,
    options?: {
      handleConstraints?: boolean;
      strictMode?: boolean;
      useRelativeTolerance?: boolean;
      toleranceMultiplier?: number;
    }
  ): Promise<DetailedConsistencyResult[]> {
    const results: DetailedConsistencyResult[] = [];

    for (const token of tokens) {
      const context: CrossPlatformValidationContext = {
        token,
        unitProviders,
        handleConstraints: options?.handleConstraints ?? true,
        options
      };

      const result = await this.validateToken(context);
      results.push(result);
    }

    return results;
  }

  /**
   * Generate summary report for multiple token validations
   */
  generateSummaryReport(results: DetailedConsistencyResult[]): {
    totalTokens: number;
    consistentTokens: number;
    inconsistentTokens: number;
    averageConsistencyScore: number;
    commonIssues: string[];
    platformIssues: Record<string, number>;
  } {
    const totalTokens = results.length;
    const consistentTokens = results.filter(r => r.isConsistent).length;
    const inconsistentTokens = totalTokens - consistentTokens;

    const averageConsistencyScore = results.reduce(
      (sum, result) => sum + result.mathematicalAnalysis.consistencyScore,
      0
    ) / totalTokens;

    // Analyze common issues
    const issueFrequency: Record<string, number> = {};
    const platformIssues: Record<string, number> = {};

    results.forEach(result => {
      result.mathematicalAnalysis.failedPairs.forEach(pair => {
        const platforms = pair.split(' ')[0].split('-');
        platforms.forEach(platform => {
          platformIssues[platform] = (platformIssues[platform] || 0) + 1;
        });
      });

      result.inconsistencies?.forEach(issue => {
        issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
      });
    });

    const commonIssues = Object.entries(issueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);

    return {
      totalTokens,
      consistentTokens,
      inconsistentTokens,
      averageConsistencyScore,
      commonIssues,
      platformIssues
    };
  }
}