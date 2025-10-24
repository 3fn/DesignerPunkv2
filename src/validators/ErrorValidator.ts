/**
 * Error-Level Validation Logic
 * 
 * Catches mathematical relationship violations and critical design system errors:
 * - Baseline grid violations (non-strategic flexibility tokens)
 * - Mathematical relationship breakdowns
 * - Cross-platform consistency failures
 * - Invalid token references or compositions
 * - Critical design system constraint violations
 */

import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { TokenCategory } from '../types';
import { isStrategicFlexibilityValue } from '../constants/StrategicFlexibilityTokens';
import { ValidationReasoning, type ReasoningContext } from './ValidationReasoning';

/**
 * Error validation context with detailed mathematical analysis
 */
export interface ErrorValidationContext {
  /** Token being validated */
  token: PrimitiveToken | SemanticToken;

  /** Mathematical validation context */
  mathematicalContext?: {
    /** Expected mathematical relationship */
    expectedRelationship?: string;

    /** Actual calculated relationship */
    actualRelationship?: string;

    /** Baseline grid requirements */
    baselineGridRequirement?: {
      required: boolean;
      gridUnit: number;
      expectedAlignment: boolean;
      actualAlignment: boolean;
    };

    /** Cross-platform consistency data */
    crossPlatformData?: {
      platforms: string[];
      values: Record<string, any>;
      toleranceLevel: number;
      maxDeviation: number;
      failedPairs: string[];
    };

    /** Family mathematical foundation */
    familyFoundation?: {
      category: TokenCategory;
      baseValue: number;
      expectedProgression: string;
      actualProgression: string;
    };
  };

  /** Token registry context for reference validation */
  registryContext?: {
    /** Available primitive tokens */
    availablePrimitiveTokens?: string[];

    /** Available semantic tokens */
    availableSemanticTokens?: string[];

    /** Token dependency graph */
    dependencyGraph?: Record<string, string[]>;

    /** Circular reference detection */
    circularReferences?: string[];
  };

  /** Validation options */
  options?: {
    /** Strict mathematical validation */
    strictMathematics?: boolean;

    /** Require cross-platform consistency */
    requireCrossPlatformConsistency?: boolean;

    /** Validate all token references */
    validateReferences?: boolean;

    /** Check for circular dependencies */
    checkCircularDependencies?: boolean;
  };
}

/**
 * Error-level validator for critical design system violations
 */
export class ErrorValidator {
  private reasoningGenerator: ValidationReasoning;

  // Mathematical constants
  private readonly BASELINE_GRID_UNIT = 8;
  private readonly CROSS_PLATFORM_TOLERANCE = 0.01; // 1% tolerance

  constructor(reasoningGenerator?: ValidationReasoning) {
    this.reasoningGenerator = reasoningGenerator || new ValidationReasoning();
  }

  /**
   * Validate token for Error-level violations
   */
  validate(context: ErrorValidationContext): ValidationResult | null {
    const { token, mathematicalContext, registryContext, options = {} } = context;

    // Check for mathematical relationship violations
    const mathematicalError = this.validateMathematicalRelationships(token, mathematicalContext, options);
    if (mathematicalError) {
      return mathematicalError;
    }

    // Check for border width specific mathematical relationships
    const borderWidthError = this.validateBorderWidthMathematicalRelationships(token, options);
    if (borderWidthError) {
      return borderWidthError;
    }

    // Check for baseline grid violations
    const baselineGridError = this.validateBaselineGridCompliance(token, mathematicalContext, options);
    if (baselineGridError) {
      return baselineGridError;
    }

    // Check for cross-platform consistency violations
    const crossPlatformError = this.validateCrossPlatformConsistency(token, mathematicalContext, options);
    if (crossPlatformError) {
      return crossPlatformError;
    }

    // Check for token reference violations
    const referenceError = this.validateTokenReferences(token, registryContext, options);
    if (referenceError) {
      return referenceError;
    }

    // Check for border width semantic token reference violations
    const borderWidthSemanticError = this.validateBorderWidthSemanticReferences(token, registryContext, options);
    if (borderWidthSemanticError) {
      return borderWidthSemanticError;
    }

    // Check for circular dependency violations
    const circularDependencyError = this.validateCircularDependencies(token, registryContext, options);
    if (circularDependencyError) {
      return circularDependencyError;
    }

    // Check for family foundation violations
    const familyFoundationError = this.validateFamilyFoundation(token, mathematicalContext, options);
    if (familyFoundationError) {
      return familyFoundationError;
    }

    // No errors detected
    return null;
  }

  /**
   * Validate mathematical relationships
   */
  private validateMathematicalRelationships(
    token: PrimitiveToken | SemanticToken,
    mathematicalContext?: ErrorValidationContext['mathematicalContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;

    // Check if mathematical relationship is defined and valid
    if (!primitiveToken.mathematicalRelationship || primitiveToken.mathematicalRelationship.trim().length === 0) {
      return this.generateErrorResult(
        token,
        'Missing mathematical relationship',
        `Primitive token ${primitiveToken.name} lacks required mathematical relationship definition`,
        'mathematical-violation',
        {
          relationship: 'Mathematical relationship required for all primitive tokens'
        },
        [
          'Define mathematical relationship to family base value',
          `Specify relationship for ${primitiveToken.category} family (base: ${primitiveToken.familyBaseValue})`,
          'Ensure relationship explains how token value is derived',
          'Follow mathematical progression patterns for token family'
        ]
      );
    }

    // Validate mathematical relationship accuracy
    if (mathematicalContext?.expectedRelationship && mathematicalContext?.actualRelationship) {
      if (mathematicalContext.expectedRelationship !== mathematicalContext.actualRelationship) {
        return this.generateErrorResult(
          token,
          'Mathematical relationship violation',
          'Calculated mathematical relationship does not match expected relationship',
          'mathematical-violation',
          {
            relationship: `Expected: ${mathematicalContext.expectedRelationship}, Actual: ${mathematicalContext.actualRelationship}`
          },
          [
            `Correct mathematical relationship to: ${mathematicalContext.expectedRelationship}`,
            'Verify token value calculation against family base value',
            'Ensure mathematical progression follows family patterns',
            'Review token derivation methodology'
          ]
        );
      }
    }

    // Validate base value consistency
    if (primitiveToken.baseValue <= 0) {
      return this.generateErrorResult(
        token,
        'Invalid base value',
        `Base value ${primitiveToken.baseValue} must be positive`,
        'mathematical-violation',
        {
          actualValue: primitiveToken.baseValue,
          relationship: 'Base values must be positive for mathematical consistency'
        },
        [
          'Use positive base value',
          'Verify token value calculation',
          'Check mathematical relationship derivation'
        ]
      );
    }

    // Validate family base value consistency
    if (primitiveToken.familyBaseValue <= 0) {
      return this.generateErrorResult(
        token,
        'Invalid family base value',
        `Family base value ${primitiveToken.familyBaseValue} must be positive`,
        'mathematical-violation',
        {
          actualValue: primitiveToken.familyBaseValue,
          relationship: 'Family base values must be positive for mathematical consistency'
        },
        [
          'Verify family base value configuration',
          'Check token family mathematical foundation',
          'Ensure consistent family base value across all tokens in family'
        ]
      );
    }

    return null;
  }

  /**
   * Validate border width mathematical relationships
   * 
   * Border width tokens follow a doubling progression:
   * - borderWidth100 = 1 (base value)
   * - borderWidth200 = borderWidth100 × 2 = 2
   * - borderWidth400 = borderWidth100 × 4 = 4
   */
  private validateBorderWidthMathematicalRelationships(
    token: PrimitiveToken | SemanticToken,
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive border width tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;

    // Only validate border width tokens
    if (primitiveToken.category !== TokenCategory.BORDER_WIDTH) {
      return null;
    }

    const baseValue = 1; // Border width base value
    const tokenName = primitiveToken.name;

    // Validate borderWidth200 = borderWidth100 × 2
    if (tokenName === 'borderWidth200') {
      const expectedValue = baseValue * 2;
      if (primitiveToken.baseValue !== expectedValue) {
        return this.generateErrorResult(
          token,
          'Border width mathematical relationship violation',
          `borderWidth200 must equal borderWidth100 × 2 (expected: ${expectedValue}, actual: ${primitiveToken.baseValue})`,
          'mathematical-violation',
          {
            expectedValue,
            actualValue: primitiveToken.baseValue,
            relationship: 'borderWidth200 = borderWidth100 × 2'
          },
          [
            `Set borderWidth200 base value to ${expectedValue}`,
            'Verify mathematical relationship: borderWidth200 = borderWidth100 × 2',
            'Ensure doubling progression is maintained',
            'Review border width token mathematical foundation'
          ]
        );
      }
    }

    // Validate borderWidth400 = borderWidth100 × 4
    if (tokenName === 'borderWidth400') {
      const expectedValue = baseValue * 4;
      if (primitiveToken.baseValue !== expectedValue) {
        return this.generateErrorResult(
          token,
          'Border width mathematical relationship violation',
          `borderWidth400 must equal borderWidth100 × 4 (expected: ${expectedValue}, actual: ${primitiveToken.baseValue})`,
          'mathematical-violation',
          {
            expectedValue,
            actualValue: primitiveToken.baseValue,
            relationship: 'borderWidth400 = borderWidth100 × 4'
          },
          [
            `Set borderWidth400 base value to ${expectedValue}`,
            'Verify mathematical relationship: borderWidth400 = borderWidth100 × 4',
            'Ensure doubling progression is maintained',
            'Review border width token mathematical foundation'
          ]
        );
      }
    }

    // Validate borderWidth100 base value
    if (tokenName === 'borderWidth100') {
      if (primitiveToken.baseValue !== baseValue) {
        return this.generateErrorResult(
          token,
          'Border width base value violation',
          `borderWidth100 must equal base value (expected: ${baseValue}, actual: ${primitiveToken.baseValue})`,
          'mathematical-violation',
          {
            expectedValue: baseValue,
            actualValue: primitiveToken.baseValue,
            relationship: 'borderWidth100 = 1 (base value)'
          },
          [
            `Set borderWidth100 base value to ${baseValue}`,
            'Verify border width base value is 1',
            'Ensure all border width tokens derive from this base',
            'Review border width token mathematical foundation'
          ]
        );
      }
    }

    return null;
  }

  /**
   * Validate border width semantic token references
   * 
   * Semantic border width tokens must reference the correct primitive tokens:
   * - borderDefault must reference borderWidth100
   * - borderEmphasis must reference borderWidth200
   * - borderHeavy must reference borderWidth400
   */
  private validateBorderWidthSemanticReferences(
    token: PrimitiveToken | SemanticToken,
    registryContext?: ErrorValidationContext['registryContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to semantic tokens
    if (!('primitiveReferences' in token)) {
      return null;
    }

    const semanticToken = token as SemanticToken;

    // Only validate border width semantic tokens
    // Border width semantic tokens have names: borderDefault, borderEmphasis, borderHeavy
    const borderWidthSemanticTokens = ['borderDefault', 'borderEmphasis', 'borderHeavy'];
    if (!borderWidthSemanticTokens.includes(semanticToken.name)) {
      return null;
    }

    // Define expected primitive references for each semantic token
    const expectedReferences: Record<string, string> = {
      borderDefault: 'borderWidth100',
      borderEmphasis: 'borderWidth200',
      borderHeavy: 'borderWidth400'
    };

    const expectedPrimitive = expectedReferences[semanticToken.name];
    
    // Get the actual primitive reference
    // Semantic border width tokens use { value: 'primitiveTokenName' } pattern
    const actualPrimitive = semanticToken.primitiveReferences.value;

    // Validate that the semantic token references the correct primitive
    if (actualPrimitive !== expectedPrimitive) {
      return this.generateErrorResult(
        token,
        'Border width semantic token reference violation',
        `${semanticToken.name} must reference ${expectedPrimitive} (actual: ${actualPrimitive || 'none'})`,
        'mathematical-violation',
        {
          relationship: `Expected: ${semanticToken.name} → ${expectedPrimitive}, Actual: ${semanticToken.name} → ${actualPrimitive || 'none'}`
        },
        [
          `Update ${semanticToken.name} to reference ${expectedPrimitive}`,
          'Verify semantic token follows border width reference pattern',
          'Ensure semantic tokens maintain mathematical consistency with primitives',
          'Review border width semantic token definitions'
        ]
      );
    }

    // Validate that the referenced primitive token exists (if registry context provided)
    if (registryContext?.availablePrimitiveTokens) {
      const availablePrimitives = registryContext.availablePrimitiveTokens;
      if (!availablePrimitives.includes(expectedPrimitive)) {
        return this.generateErrorResult(
          token,
          'Border width primitive token not found',
          `${semanticToken.name} references ${expectedPrimitive} which does not exist`,
          'mathematical-violation',
          {
            relationship: `${semanticToken.name} → ${expectedPrimitive} (primitive token not found in registry)`
          },
          [
            `Register primitive token ${expectedPrimitive} before semantic token`,
            'Verify primitive border width tokens are defined',
            'Ensure border width token registration order (primitives before semantics)',
            'Review border width token system setup'
          ]
        );
      }
    }

    return null;
  }

  /**
   * Validate baseline grid compliance
   */
  private validateBaselineGridCompliance(
    token: PrimitiveToken | SemanticToken,
    mathematicalContext?: ErrorValidationContext['mathematicalContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;

    // Only spacing and radius tokens require baseline grid alignment
    if (!this.requiresBaselineGridAlignment(primitiveToken.category)) {
      return null;
    }

    // Strategic flexibility tokens are exempt from baseline grid requirements
    // Strategic flexibility values: 2, 4, 6, 10, 12, 20
    // - 2: Fine-grain spacing for exceptional component-internal needs
    // - 4, 12: Sub-grid spacing for medium/large adjustments
    // - 6, 10, 20: Specific design requirements that break 8-unit grid
    if (primitiveToken.isStrategicFlexibility || isStrategicFlexibilityValue(primitiveToken.baseValue)) {
      return null;
    }

    // Check baseline grid alignment (8-unit primary grid)
    // Spacing and radius tokens must align to 8-unit grid or be strategic flexibility
    const gridRequirement = mathematicalContext?.baselineGridRequirement;
    const gridUnit = gridRequirement?.gridUnit || this.BASELINE_GRID_UNIT;
    const isAligned = primitiveToken.baseValue % gridUnit === 0;

    if (!isAligned) {
      const nearestLower = Math.floor(primitiveToken.baseValue / gridUnit) * gridUnit;
      const nearestUpper = Math.ceil(primitiveToken.baseValue / gridUnit) * gridUnit;

      return this.generateErrorResult(
        token,
        'Baseline grid alignment violation',
        `Token value ${primitiveToken.baseValue} does not align with ${gridUnit}-unit baseline grid`,
        'mathematical-violation',
        {
          actualValue: primitiveToken.baseValue,
          relationship: `${primitiveToken.baseValue} ÷ ${gridUnit} = ${primitiveToken.baseValue / gridUnit} (non-integer)`,
          baselineGridInfo: {
            gridUnit,
            isAligned: false,
            nearestValid: nearestLower !== primitiveToken.baseValue ? nearestLower : nearestUpper
          }
        },
        [
          `Use ${nearestLower} or ${nearestUpper} for baseline grid alignment`,
          `Ensure value is multiple of ${gridUnit}`,
          'Consider if this should be a strategic flexibility token',
          'Review mathematical relationship to ensure grid alignment'
        ]
      );
    }

    // Validate baseline grid alignment flag consistency
    if (primitiveToken.baselineGridAlignment !== isAligned) {
      return this.generateErrorResult(
        token,
        'Baseline grid alignment flag inconsistency',
        `Token baselineGridAlignment flag (${primitiveToken.baselineGridAlignment}) does not match actual alignment (${isAligned})`,
        'mathematical-violation',
        {
          relationship: 'Baseline grid alignment flag must match actual mathematical alignment'
        },
        [
          `Set baselineGridAlignment to ${isAligned}`,
          'Ensure flag consistency with mathematical calculation',
          'Verify token configuration accuracy'
        ]
      );
    }

    return null;
  }

  /**
   * Validate cross-platform consistency
   */
  private validateCrossPlatformConsistency(
    token: PrimitiveToken | SemanticToken,
    mathematicalContext?: ErrorValidationContext['mathematicalContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    if (!options.requireCrossPlatformConsistency) {
      return null;
    }

    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;
    const crossPlatformData = mathematicalContext?.crossPlatformData;

    if (!crossPlatformData) {
      return null; // Cannot validate without cross-platform data
    }

    // Check if there are consistency failures
    if (crossPlatformData.failedPairs.length > 0) {
      return this.generateErrorResult(
        token,
        'Cross-platform consistency violation',
        `Mathematical relationships not maintained across platforms: ${crossPlatformData.failedPairs.join(', ')}`,
        'mathematical-violation',
        {
          platformInfo: crossPlatformData.values,
          relationship: `Failed platform pairs: ${crossPlatformData.failedPairs.join(', ')}`,
          expectedValue: crossPlatformData.toleranceLevel,
          actualValue: crossPlatformData.maxDeviation
        },
        [
          'Review unit conversion algorithms for affected platforms',
          'Ensure mathematical relationships are preserved across platforms',
          'Consider platform-specific constraints and limitations',
          'Validate tolerance levels are appropriate for token category'
        ]
      );
    }

    // Check if maximum deviation exceeds tolerance
    if (crossPlatformData.maxDeviation > crossPlatformData.toleranceLevel) {
      return this.generateErrorResult(
        token,
        'Cross-platform tolerance exceeded',
        `Maximum deviation ${crossPlatformData.maxDeviation.toFixed(4)} exceeds tolerance ${crossPlatformData.toleranceLevel.toFixed(4)}`,
        'mathematical-violation',
        {
          platformInfo: crossPlatformData.values,
          expectedValue: crossPlatformData.toleranceLevel,
          actualValue: crossPlatformData.maxDeviation,
          relationship: 'Cross-platform mathematical consistency within tolerance levels'
        },
        [
          'Adjust token value to reduce cross-platform deviation',
          'Review platform-specific unit conversion accuracy',
          'Consider if tolerance level is appropriate for this token category',
          'Validate mathematical relationships across all platforms'
        ]
      );
    }

    return null;
  }

  /**
   * Validate token references
   */
  private validateTokenReferences(
    token: PrimitiveToken | SemanticToken,
    registryContext?: ErrorValidationContext['registryContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    if (!options.validateReferences || !registryContext) {
      return null;
    }

    // Only applies to semantic tokens
    if (!('primitiveReferences' in token)) {
      return null;
    }

    const semanticToken = token as SemanticToken;

    // Check if primitive references exist
    const availablePrimitives = registryContext.availablePrimitiveTokens || [];
    const invalidReferences: string[] = [];
    
    for (const [key, primitiveRef] of Object.entries(semanticToken.primitiveReferences)) {
      if (!availablePrimitives.includes(primitiveRef)) {
        invalidReferences.push(`${key}: ${primitiveRef}`);
      }
    }
    
    if (invalidReferences.length > 0) {
      return this.generateErrorResult(
        token,
        'Invalid primitive token reference(s)',
        `Referenced primitive token(s) do not exist: ${invalidReferences.join(', ')}`,
        'mathematical-violation',
        {
          relationship: 'Semantic tokens must reference existing primitive tokens'
        },
        [
          'Reference existing primitive token(s)',
          `Available primitive tokens: ${availablePrimitives.slice(0, 5).join(', ')}${availablePrimitives.length > 5 ? '...' : ''}`,
          'Verify primitive token name spelling and availability',
          'Ensure primitive token(s) are registered before semantic token creation'
        ]
      );
    }

    // Check for self-reference (semantic token referencing itself)
    const selfReferences = Object.values(semanticToken.primitiveReferences).filter(ref => ref === semanticToken.name);
    if (selfReferences.length > 0) {
      return this.generateErrorResult(
        token,
        'Self-reference violation',
        'Semantic token cannot reference itself',
        'mathematical-violation',
        {
          relationship: 'Semantic tokens must reference primitive tokens, not themselves'
        },
        [
          'Reference a different primitive token',
          'Ensure semantic token name differs from primitive reference(s)',
          'Review token naming conventions'
        ]
      );
    }

    return null;
  }

  /**
   * Validate circular dependencies
   */
  private validateCircularDependencies(
    token: PrimitiveToken | SemanticToken,
    registryContext?: ErrorValidationContext['registryContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    if (!options.checkCircularDependencies || !registryContext) {
      return null;
    }

    // Check for circular references
    const circularReferences = registryContext.circularReferences || [];
    const tokenName = token.name;

    if (circularReferences.includes(tokenName)) {
      return this.generateErrorResult(
        token,
        'Circular dependency detected',
        `Token ${tokenName} is part of a circular dependency chain`,
        'mathematical-violation',
        {
          relationship: 'Circular dependencies violate token hierarchy and mathematical consistency'
        },
        [
          'Break circular dependency by restructuring token references',
          'Ensure semantic tokens only reference primitive tokens',
          'Review token dependency graph for cycles',
          'Consider flattening token hierarchy to eliminate cycles'
        ]
      );
    }

    return null;
  }

  /**
   * Validate family foundation compliance
   */
  private validateFamilyFoundation(
    token: PrimitiveToken | SemanticToken,
    mathematicalContext?: ErrorValidationContext['mathematicalContext'],
    options: ErrorValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;
    const familyFoundation = mathematicalContext?.familyFoundation;

    if (!familyFoundation) {
      return null; // Cannot validate without family foundation data
    }

    // Check if token follows family mathematical progression
    if (familyFoundation.expectedProgression !== familyFoundation.actualProgression) {
      return this.generateErrorResult(
        token,
        'Family foundation violation',
        `Token does not follow ${familyFoundation.category} family mathematical progression`,
        'mathematical-violation',
        {

          relationship: `Family foundation requires: ${familyFoundation.expectedProgression}`
        },
        [
          `Follow ${familyFoundation.category} family mathematical progression: ${familyFoundation.expectedProgression}`,
          `Verify relationship to family base value: ${familyFoundation.baseValue}`,
          'Review family mathematical foundation documentation',
          'Ensure token fits within established family patterns'
        ]
      );
    }

    // Check family base value consistency
    if (primitiveToken.familyBaseValue !== familyFoundation.baseValue) {
      return this.generateErrorResult(
        token,
        'Family base value inconsistency',
        `Token family base value ${primitiveToken.familyBaseValue} does not match family foundation ${familyFoundation.baseValue}`,
        'mathematical-violation',
        {
          expectedValue: familyFoundation.baseValue,
          actualValue: primitiveToken.familyBaseValue,
          relationship: 'All tokens in family must use consistent family base value'
        },
        [
          `Set family base value to ${familyFoundation.baseValue}`,
          'Ensure consistency across all tokens in family',
          'Verify family foundation configuration',
          'Review token family mathematical specifications'
        ]
      );
    }

    return null;
  }

  /**
   * Generate error validation result with comprehensive reasoning
   */
  private generateErrorResult(
    token: PrimitiveToken | SemanticToken,
    message: string,
    rationale: string,
    scenario: 'mathematical-violation',
    contextData: ReasoningContext['contextData'],
    suggestions: string[]
  ): ValidationResult {
    const reasoningContext: ReasoningContext = {
      token,
      scenario,
      contextData
    };

    const mathematicalReasoning = this.reasoningGenerator.generateErrorReasoning(reasoningContext);

    return {
      level: 'Error',
      token: token.name,
      message,
      rationale,
      mathematicalReasoning,
      suggestions
    };
  }

  /**
   * Helper methods
   */
  private requiresBaselineGridAlignment(category: TokenCategory): boolean {
    return category === TokenCategory.SPACING || category === TokenCategory.RADIUS;
  }

  /**
   * Batch validation for multiple tokens
   */
  validateBatch(contexts: ErrorValidationContext[]): ValidationResult[] {
    const errors: ValidationResult[] = [];

    contexts.forEach(context => {
      const error = this.validate(context);
      if (error) {
        errors.push(error);
      }
    });

    return errors;
  }

  /**
   * Generate comprehensive error analysis report
   */
  generateErrorAnalysisReport(contexts: ErrorValidationContext[]): {
    totalTokens: number;
    tokensWithErrors: number;
    errorsByType: Record<string, number>;
    criticalErrors: ValidationResult[];
    mathematicalViolations: ValidationResult[];
    baselineGridViolations: ValidationResult[];
    crossPlatformViolations: ValidationResult[];
    referenceViolations: ValidationResult[];
    circularDependencies: ValidationResult[];
    familyFoundationViolations: ValidationResult[];
    recommendations: string[];
  } {
    const errors = this.validateBatch(contexts);
    const totalTokens = contexts.length;
    const tokensWithErrors = errors.length;

    // Categorize errors
    const errorsByType: Record<string, number> = {};
    const criticalErrors: ValidationResult[] = [];
    const mathematicalViolations: ValidationResult[] = [];
    const baselineGridViolations: ValidationResult[] = [];
    const crossPlatformViolations: ValidationResult[] = [];
    const referenceViolations: ValidationResult[] = [];
    const circularDependencies: ValidationResult[] = [];
    const familyFoundationViolations: ValidationResult[] = [];

    errors.forEach(error => {
      const type = this.categorizeError(error);
      errorsByType[type] = (errorsByType[type] || 0) + 1;

      // Categorize for detailed analysis
      if (error.message.includes('mathematical relationship') || error.message.includes('base value')) {
        mathematicalViolations.push(error);
      }
      if (error.message.includes('Baseline grid')) {
        baselineGridViolations.push(error);
      }
      if (error.message.includes('Cross-platform')) {
        crossPlatformViolations.push(error);
      }
      if (error.message.includes('reference') || error.message.includes('Self-reference')) {
        referenceViolations.push(error);
      }
      if (error.message.includes('Circular dependency')) {
        circularDependencies.push(error);
      }
      if (error.message.includes('Family foundation')) {
        familyFoundationViolations.push(error);
      }

      // Mark critical errors (those that break mathematical consistency)
      if (this.isCriticalError(error)) {
        criticalErrors.push(error);
      }
    });

    // Generate system-level recommendations
    const recommendations = this.generateSystemErrorRecommendations(errors);

    return {
      totalTokens,
      tokensWithErrors,
      errorsByType,
      criticalErrors,
      mathematicalViolations,
      baselineGridViolations,
      crossPlatformViolations,
      referenceViolations,
      circularDependencies,
      familyFoundationViolations,
      recommendations
    };
  }

  private categorizeError(error: ValidationResult): string {
    if (error.message.includes('mathematical relationship')) return 'mathematical-relationship';
    if (error.message.includes('Baseline grid')) return 'baseline-grid';
    if (error.message.includes('Cross-platform')) return 'cross-platform';
    if (error.message.includes('reference')) return 'token-reference';
    if (error.message.includes('Circular dependency')) return 'circular-dependency';
    if (error.message.includes('Family foundation')) return 'family-foundation';
    if (error.message.includes('base value')) return 'base-value';
    return 'other';
  }

  private isCriticalError(error: ValidationResult): boolean {
    const criticalPatterns = [
      'mathematical relationship',
      'Circular dependency',
      'Cross-platform consistency',
      'Family foundation'
    ];

    return criticalPatterns.some(pattern => error.message.includes(pattern));
  }

  private generateSystemErrorRecommendations(errors: ValidationResult[]): string[] {
    const recommendations: string[] = [];

    // Mathematical relationship recommendations
    if (errors.some(e => e.message.includes('mathematical relationship'))) {
      recommendations.push('Review and establish clear mathematical relationships for all primitive tokens');
      recommendations.push('Implement automated mathematical relationship validation in token creation process');
    }

    // Baseline grid recommendations
    if (errors.some(e => e.message.includes('Baseline grid'))) {
      recommendations.push('Audit all spacing and radius tokens for baseline grid compliance');
      recommendations.push('Consider strategic flexibility tokens for necessary exceptions to baseline grid');
    }

    // Cross-platform recommendations
    if (errors.some(e => e.message.includes('Cross-platform'))) {
      recommendations.push('Review unit conversion algorithms and tolerance levels for cross-platform consistency');
      recommendations.push('Implement comprehensive cross-platform testing for all token values');
    }

    // Reference validation recommendations
    if (errors.some(e => e.message.includes('reference'))) {
      recommendations.push('Implement token registry validation to prevent invalid references');
      recommendations.push('Establish token creation workflow with reference validation');
    }

    // Circular dependency recommendations
    if (errors.some(e => e.message.includes('Circular dependency'))) {
      recommendations.push('Implement dependency graph analysis to prevent circular references');
      recommendations.push('Establish clear token hierarchy with semantic tokens only referencing primitives');
    }

    // Family foundation recommendations
    if (errors.some(e => e.message.includes('Family foundation'))) {
      recommendations.push('Review and document mathematical foundations for all token families');
      recommendations.push('Implement family foundation validation in token creation process');
    }

    return recommendations;
  }
}