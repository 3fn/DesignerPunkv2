/**
 * Validation Coordinator
 * 
 * Coordinates validation services across the token system, managing three-tier
 * validation, usage pattern analysis, and comprehensive validation reporting.
 * Integrates with registries to provide system-wide validation insights.
 * 
 * Also provides component token validation for the component token generation pipeline.
 * @see Requirements 3.1-3.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */

import { ThreeTierValidator, ThreeTierValidationContext, ThreeTierValidationResult } from '../validators/ThreeTierValidator';
import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import { ComponentTokenRegistry, RegisteredComponentToken } from '../registries/ComponentTokenRegistry';
import { MathematicalRelationshipParser } from '../validators/MathematicalRelationshipParser';
import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { TokenCategory, SemanticCategory } from '../types';
import { SPACING_BASE_VALUE } from '../tokens/SpacingTokens';
import { RADIUS_BASE_VALUE } from '../tokens/RadiusTokens';

/**
 * Validation coordinator configuration
 */
export interface ValidationCoordinatorConfig {
  strategicFlexibilityThreshold: number;
  primitiveUsageThreshold: number;
  enableUsageTracking: boolean;
}

/**
 * Validation options for token validation
 */
export interface ValidationOptions {
  strictMathematics?: boolean;
  requireCrossPlatformConsistency?: boolean;
  enablePatternAnalysis?: boolean;
  validateReferences?: boolean;
}

/**
 * Comprehensive validation report
 */
export interface ComprehensiveValidationReport {
  summary: {
    totalTokens: number;
    passCount: number;
    warningCount: number;
    errorCount: number;
    overallHealthScore: number;
  };
  results: ThreeTierValidationResult[];
  systemAnalysis: {
    commonIssues: string[];
    criticalErrors: ValidationResult[];
    improvementRecommendations: string[];
    mathematicalConsistencyScore: number;
  };
  performanceMetrics: {
    totalValidationTime: number;
    averageValidationTime: number;
    validationTimeByLevel: Record<string, number>;
  };
  usagePatterns?: {
    strategicFlexibilityUsage: {
      totalUsage: number;
      appropriateUsage: number;
      inappropriateUsage: number;
      usagePercentage: number;
    };
    primitiveVsSemanticUsage: {
      primitiveUsage: number;
      semanticUsage: number;
      primitivePercentage: number;
    };
    categoryUsage: Record<string, number>;
  };
}

/**
 * Component token validation result
 * 
 * Result of validating a single component token.
 * @see Requirements 3.1-3.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */
export interface ComponentTokenValidationResult {
  /** Whether the token passed validation */
  valid: boolean;
  /** Validation errors (if any) */
  errors: string[];
  /** Validation warnings (if any) */
  warnings: string[];
}

/**
 * Family conformance validation result
 * 
 * Result of validating a value against a token family's value definition pattern.
 * @see Requirements 3.2, 3.3 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */
export interface FamilyConformanceResult {
  /** Whether the value conforms to the family pattern */
  valid: boolean;
  /** Error message if validation failed */
  message: string;
  /** Warning message (e.g., value matches existing primitive) */
  warning?: string;
}

/**
 * Family-aware value validation
 * 
 * Validates that a component token value conforms to the family's value definition pattern.
 * Different token families use different validation patterns:
 * 
 * 1. FORMULA-BASED FAMILIES (spacing, radius):
 *    - Values must be derivable from BASE_VALUE × multiplier
 *    - Base values imported from actual token implementation files
 *    - Example: spacing uses SPACING_BASE_VALUE (8) from SpacingTokens.ts
 * 
 * 2. MODULAR SCALE FAMILIES (fontSize):
 *    - Values follow exponential scale: BASE × ratio^n
 *    - Example: fontSize uses 16px base with 1.125 ratio
 * 
 * 3. DISCRETE VALUE FAMILIES (color):
 *    - Component tokens should reference existing primitives
 *    - Custom numeric values are not allowed
 * 
 * 4. UNKNOWN FAMILIES:
 *    - Allowed with warning suggesting adding validation or using primitive reference
 * 
 * @param family - The token family name (e.g., 'spacing', 'radius', 'fontSize', 'color')
 * @param value - The numeric value to validate
 * @param primitiveRegistry - The primitive token registry for checking existing primitives
 * @returns Validation result with valid flag, message, and optional warning
 * 
 * @see src/tokens/SpacingTokens.ts - SPACING_BASE_VALUE
 * @see src/tokens/RadiusTokens.ts - RADIUS_BASE_VALUE
 * @see Requirements 3.2, 3.3 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */
export function validateFamilyConformance(
  family: string,
  value: number,
  primitiveRegistry: PrimitiveTokenRegistry
): FamilyConformanceResult {
  switch (family) {
    // ============================================
    // FORMULA-BASED FAMILIES: BASE_VALUE × multiplier
    // ============================================
    
    case 'spacing': {
      const multiplier = value / SPACING_BASE_VALUE;
      
      // Valid multipliers match those used in SpacingTokens.ts primitive definitions
      // Check if multiplier produces a value derivable from the base
      // Multipliers: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8 (0.25 increments up to 8)
      const isValidMultiplier = multiplier >= 0 && 
                                 multiplier <= 8.0 && 
                                 (multiplier * 4) % 1 === 0; // 0.25 increments
      
      if (!isValidMultiplier) {
        return { 
          valid: false, 
          message: `Spacing value ${value} is not derivable from SPACING_BASE_VALUE (${SPACING_BASE_VALUE}). ` +
                   `Use SPACING_BASE_VALUE * multiplier (e.g., ${SPACING_BASE_VALUE} * 1.25 = ${SPACING_BASE_VALUE * 1.25}).`
        };
      }
      
      // Check if this value matches an existing primitive (suggest reference instead)
      const existingPrimitive = primitiveRegistry.query({ category: TokenCategory.SPACING })
        .find((t: PrimitiveToken) => t.baseValue === value);
      
      if (existingPrimitive) {
        return { 
          valid: true, 
          message: '',
          warning: `Value ${value} matches existing primitive '${existingPrimitive.name}'. ` +
                   `Consider using a reference instead of a custom value.`
        };
      }
      
      return { valid: true, message: '' };
    }

    case 'radius': {
      if (value < 0) {
        return { 
          valid: false, 
          message: 'Radius values must be non-negative.' 
        };
      }
      
      // Special case: 9999 is valid for pill/full radius
      if (value === 9999) {
        return { valid: true, message: '' };
      }
      
      // Special case: 0 is always valid
      if (value === 0) {
        return { valid: true, message: '' };
      }
      
      const multiplier = value / RADIUS_BASE_VALUE;
      
      // Valid multipliers match those used in RadiusTokens.ts primitive definitions
      // Multipliers: 0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4 (0.25 increments up to 4)
      const isValidMultiplier = multiplier >= 0 && 
                                 multiplier <= 4.0 && 
                                 (multiplier * 4) % 1 === 0; // 0.25 increments
      
      if (!isValidMultiplier) {
        return { 
          valid: false, 
          message: `Radius value ${value} is not derivable from RADIUS_BASE_VALUE (${RADIUS_BASE_VALUE}). ` +
                   `Use RADIUS_BASE_VALUE * multiplier or 9999 for pill shape.`
        };
      }
      
      // Check if this value matches an existing primitive
      const existingPrimitive = primitiveRegistry.query({ category: TokenCategory.RADIUS })
        .find((t: PrimitiveToken) => t.baseValue === value);
      
      if (existingPrimitive) {
        return { 
          valid: true, 
          message: '',
          warning: `Value ${value} matches existing primitive '${existingPrimitive.name}'. ` +
                   `Consider using a reference instead of a custom value.`
        };
      }
      
      return { valid: true, message: '' };
    }

    // ============================================
    // MODULAR SCALE FAMILIES: BASE × ratio^n
    // ============================================
    
    case 'fontSize': {
      // Typography uses modular scale
      const FONT_BASE_VALUE = 16; // Standard base
      const SCALE_RATIO = 1.125;
      
      if (value <= 0) {
        return { 
          valid: false, 
          message: 'Font size values must be positive.' 
        };
      }
      
      // Check if value is approximately on the modular scale
      const logValue = Math.log(value / FONT_BASE_VALUE) / Math.log(SCALE_RATIO);
      const nearestStep = Math.round(logValue);
      const expectedValue = FONT_BASE_VALUE * Math.pow(SCALE_RATIO, nearestStep);
      const tolerance = 0.5; // Allow 0.5px tolerance for rounding
      
      if (Math.abs(value - expectedValue) > tolerance) {
        return { 
          valid: false, 
          message: `Font size ${value} does not follow the 1.125 modular scale from base ${FONT_BASE_VALUE}px. ` +
                   `Expected approximately ${expectedValue.toFixed(1)}px.`
        };
      }
      return { valid: true, message: '' };
    }

    // ============================================
    // DISCRETE VALUE FAMILIES: Specific values, no formula
    // ============================================
    
    case 'color': {
      // Color tokens use hex values - component tokens should reference primitives
      // If a custom value is provided, it should be a valid hex or the developer
      // should be using a reference instead
      return { 
        valid: false, 
        message: `Color family does not support custom numeric values. ` +
                 `Use a reference to an existing color primitive instead.`
      };
    }

    // ============================================
    // UNKNOWN FAMILIES: Allow with warning
    // ============================================
    
    default:
      // Unknown family - allow but warn that validation may be incomplete
      return { 
        valid: true, 
        message: '',
        warning: `Family '${family}' does not have specific validation rules. ` +
                 `Consider adding validation for this family or using a primitive reference.`
      };
  }
}

/**
 * Validation Coordinator class managing validation services
 */
export class ValidationCoordinator {
  private validator: ThreeTierValidator;
  private primitiveRegistry: PrimitiveTokenRegistry;
  private semanticRegistry: SemanticTokenRegistry;
  private config: ValidationCoordinatorConfig;
  private parser: MathematicalRelationshipParser;
  private validationCache: Map<string, {
    result: ThreeTierValidationResult;
    timestamp: Date;
  }> = new Map();

  constructor(
    validator: ThreeTierValidator,
    primitiveRegistry: PrimitiveTokenRegistry,
    semanticRegistry: SemanticTokenRegistry,
    config: ValidationCoordinatorConfig
  ) {
    this.validator = validator;
    this.primitiveRegistry = primitiveRegistry;
    this.semanticRegistry = semanticRegistry;
    this.config = config;
    this.parser = new MathematicalRelationshipParser();
  }

  // ============================================================================
  // Token Validation
  // ============================================================================

  /**
   * Validate a single token with comprehensive three-tier validation
   * 
   * This method performs validation only and does not register the token.
   * The caller is responsible for registering the token after successful validation.
   * 
   * @param token - Token to validate
   * @param options - Validation options
   * @returns Validation result indicating whether the token is valid
   */
  validateToken(
    token: PrimitiveToken | SemanticToken,
    options: ValidationOptions = {}
  ): ValidationResult {
    const context = this.buildValidationContext(token, options);
    const result = this.validator.validate(context);
    
    // Cache validation result
    this.cacheValidationResult(token.name, result);
    
    return result.primaryResult;
  }

  /**
   * Validate all registered tokens
   * 
   * This method validates all tokens currently in the registries.
   * It does not perform registration - tokens are already registered.
   * 
   * @param options - Validation options
   * @returns Array of validation results for all tokens
   */
  validateAllTokens(options: ValidationOptions = {}): ValidationResult[] {
    const allTokens: (PrimitiveToken | SemanticToken)[] = [
      ...this.primitiveRegistry.query(),
      ...this.semanticRegistry.query()
    ];

    return allTokens.map(token => this.validateToken(token, options));
  }

  /**
   * Validate primitive tokens only
   * 
   * This method validates all primitive tokens currently in the registry.
   * It does not perform registration - tokens are already registered.
   * 
   * @param options - Validation options
   * @returns Array of validation results for primitive tokens
   */
  validatePrimitiveTokens(options: ValidationOptions = {}): ValidationResult[] {
    const primitiveTokens = this.primitiveRegistry.query();
    return primitiveTokens.map(token => this.validateToken(token, options));
  }

  /**
   * Validate semantic tokens only
   * 
   * This method validates all semantic tokens currently in the registry.
   * It does not perform registration - tokens are already registered.
   * 
   * @param options - Validation options
   * @returns Array of validation results for semantic tokens
   */
  validateSemanticTokens(options: ValidationOptions = {}): ValidationResult[] {
    const semanticTokens = this.semanticRegistry.query();
    return semanticTokens.map(token => this.validateToken(token, options));
  }

  // ============================================================================
  // Validation Context Building
  // ============================================================================

  /**
   * Build comprehensive validation context for a token
   */
  private buildValidationContext(
    token: PrimitiveToken | SemanticToken,
    options: ValidationOptions
  ): ThreeTierValidationContext {
    const isPrimitive = 'baseValue' in token;
    
    const context: ThreeTierValidationContext = {
      token,
      usageContext: this.buildUsageContext(token),
      mathematicalContext: isPrimitive ? this.buildMathematicalContext(token as PrimitiveToken) : undefined,
      systemContext: this.buildSystemContext(),
      options: {
        enabledLevels: ['Pass', 'Warning', 'Error'],
        strictMathematics: options.strictMathematics ?? true,
        requireCrossPlatformConsistency: options.requireCrossPlatformConsistency ?? true,
        enablePatternAnalysis: options.enablePatternAnalysis ?? this.config.enableUsageTracking,
        validateReferences: options.validateReferences ?? true,
        checkCircularDependencies: true,
        strategicFlexibilityThreshold: this.config.strategicFlexibilityThreshold,
        primitiveUsageThreshold: this.config.primitiveUsageThreshold
      }
    };

    return context;
  }

  /**
   * Build usage context for a token
   */
  private buildUsageContext(token: PrimitiveToken | SemanticToken): ThreeTierValidationContext['usageContext'] {
    // In a real implementation, this would track actual usage across the codebase
    // For now, we provide basic context
    return {
      component: 'system',
      property: token.category,
      metadata: {
        tokenType: 'baseValue' in token ? 'primitive' : 'semantic'
      }
    };
  }

  /**
   * Build mathematical context for primitive tokens
   */
  private buildMathematicalContext(token: PrimitiveToken): ThreeTierValidationContext['mathematicalContext'] {
    // Validate the mathematical relationship using the parser
    // Parser will return validation result even if it can't parse the format
    const validationResult = this.parser.validate(
      token.mathematicalRelationship,
      token.baseValue,
      token.familyBaseValue
    );

    return {
      expectedRelationship: token.mathematicalRelationship,
      actualRelationship: token.mathematicalRelationship,
      baselineGridRequirement: {
        required: token.baselineGridAlignment,
        gridUnit: 8,
        expectedAlignment: token.baselineGridAlignment,
        actualAlignment: token.baseValue % 8 === 0 || token.isStrategicFlexibility
      },
      familyFoundation: {
        category: token.category as TokenCategory,
        baseValue: token.familyBaseValue,
        expectedProgression: token.mathematicalRelationship,
        actualProgression: token.mathematicalRelationship,
        validationResult // Include parser validation result for ErrorValidator
      }
    };
  }

  /**
   * Build system context with registry information
   */
  private buildSystemContext(): ThreeTierValidationContext['systemContext'] {
    const primitiveTokens = this.primitiveRegistry.query();
    const semanticTokens = this.semanticRegistry.query();
    const primitiveStats = this.primitiveRegistry.getStats();

    // Calculate strategic flexibility stats
    const strategicFlexibilityTokens = primitiveTokens.filter(t => t.isStrategicFlexibility);
    const strategicFlexibilityStats = {
      totalUsage: strategicFlexibilityTokens.length,
      appropriateUsage: strategicFlexibilityTokens.length, // Assume appropriate for now
      inappropriateUsage: 0,
      usagePercentage: primitiveStats.strategicFlexibilityPercentage
    };

    // Calculate family usage patterns
    const familyUsagePatterns: Record<TokenCategory, {
      primitiveUsage: number;
      semanticUsage: number;
      totalUsage: number;
    }> = {} as any;

    for (const category of Object.values(TokenCategory)) {
      const primitiveCount = primitiveTokens.filter(t => t.category === category).length;
      const semanticCount = semanticTokens.filter(t => t.category === category as unknown as SemanticCategory).length;
      
      familyUsagePatterns[category as TokenCategory] = {
        primitiveUsage: primitiveCount,
        semanticUsage: semanticCount,
        totalUsage: primitiveCount + semanticCount
      };
    }

    return {
      availableSemanticTokens: semanticTokens.map(t => t.name),
      availablePrimitiveTokens: primitiveTokens.map(t => t.name),
      strategicFlexibilityStats,
      familyUsagePatterns
    };
  }

  // ============================================================================
  // Validation Reporting
  // ============================================================================

  /**
   * Generate comprehensive validation report
   */
  generateValidationReport(options: ValidationOptions = {}): ComprehensiveValidationReport {
    const allTokens: (PrimitiveToken | SemanticToken)[] = [
      ...this.primitiveRegistry.query(),
      ...this.semanticRegistry.query()
    ];

    const contexts = allTokens.map(token => this.buildValidationContext(token, options));
    const report = this.validator.generateValidationReport(contexts);

    // Add usage pattern analysis if enabled
    let usagePatterns: ComprehensiveValidationReport['usagePatterns'];
    if (this.config.enableUsageTracking) {
      usagePatterns = this.analyzeUsagePatterns();
    }

    return {
      ...report,
      usagePatterns
    };
  }

  /**
   * Analyze usage patterns across the token system
   */
  private analyzeUsagePatterns(): ComprehensiveValidationReport['usagePatterns'] {
    const primitiveTokens = this.primitiveRegistry.query();
    const semanticTokens = this.semanticRegistry.query();
    const primitiveStats = this.primitiveRegistry.getStats();

    // Strategic flexibility usage
    const strategicFlexibilityTokens = primitiveTokens.filter(t => t.isStrategicFlexibility);
    const strategicFlexibilityUsage = {
      totalUsage: strategicFlexibilityTokens.length,
      appropriateUsage: strategicFlexibilityTokens.length, // Assume appropriate for now
      inappropriateUsage: 0,
      usagePercentage: primitiveStats.strategicFlexibilityPercentage
    };

    // Primitive vs semantic usage
    const totalTokens = primitiveTokens.length + semanticTokens.length;
    const primitiveVsSemanticUsage = {
      primitiveUsage: primitiveTokens.length,
      semanticUsage: semanticTokens.length,
      primitivePercentage: totalTokens > 0 ? (primitiveTokens.length / totalTokens) * 100 : 0
    };

    // Category usage
    const categoryUsage: Record<string, number> = {};
    for (const category of Object.values(TokenCategory)) {
      const count = primitiveTokens.filter(t => t.category === category).length;
      categoryUsage[category] = count;
    }

    return {
      strategicFlexibilityUsage,
      primitiveVsSemanticUsage,
      categoryUsage
    };
  }

  /**
   * Get validation summary for quick health check
   */
  getValidationSummary(): {
    totalTokens: number;
    passCount: number;
    warningCount: number;
    errorCount: number;
    healthScore: number;
    status: 'healthy' | 'warning' | 'critical';
  } {
    const results = this.validateAllTokens();
    
    const totalTokens = results.length;
    const passCount = results.filter(r => r.level === 'Pass').length;
    const warningCount = results.filter(r => r.level === 'Warning').length;
    const errorCount = results.filter(r => r.level === 'Error').length;
    const healthScore = totalTokens > 0 ? (passCount + warningCount * 0.5) / totalTokens : 1;

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (errorCount > 0 || healthScore < 0.5) {
      status = 'critical';
    } else if (warningCount > 0 || healthScore < 0.8) {
      status = 'warning';
    }

    return {
      totalTokens,
      passCount,
      warningCount,
      errorCount,
      healthScore,
      status
    };
  }

  // ============================================================================
  // Validation Cache Management
  // ============================================================================

  /**
   * Cache validation result for a token
   */
  private cacheValidationResult(tokenName: string, result: ThreeTierValidationResult): void {
    this.validationCache.set(tokenName, {
      result,
      timestamp: new Date()
    });
  }

  /**
   * Get cached validation result if available and not stale
   */
  getCachedValidationResult(tokenName: string, maxAge: number = 60000): ThreeTierValidationResult | null {
    const cached = this.validationCache.get(tokenName);
    
    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp.getTime();
    if (age > maxAge) {
      this.validationCache.delete(tokenName);
      return null;
    }

    return cached.result;
  }

  /**
   * Clear validation cache
   */
  clearValidationCache(): void {
    this.validationCache.clear();
  }

  /**
   * Invalidate cache for a specific token
   */
  invalidateCacheFor(tokenName: string): void {
    this.validationCache.delete(tokenName);
  }

  // ============================================================================
  // Configuration Management
  // ============================================================================

  /**
   * Update coordinator configuration
   */
  updateConfig(config: Partial<ValidationCoordinatorConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };

    // Clear cache when configuration changes
    this.clearValidationCache();
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ValidationCoordinatorConfig> {
    return { ...this.config };
  }

  // ============================================================================
  // Component Token Validation
  // ============================================================================

  /**
   * Validate a single component token
   * 
   * Validates that the component token meets all requirements:
   * - Has a non-empty reasoning string (Requirement 3.4)
   * - If it has a primitive reference, the reference exists in PrimitiveTokenRegistry (Requirement 3.5)
   * - If it has a custom value, the value conforms to the family's value definition pattern (Requirement 3.2, 3.3)
   * 
   * @param token - The component token to validate
   * @returns Validation result with errors and warnings
   * 
   * @see Requirements 3.1-3.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
   */
  validateComponentToken(token: RegisteredComponentToken): ComponentTokenValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Reasoning is required (Requirement 3.4)
    if (!token.reasoning || token.reasoning.trim() === '') {
      errors.push(
        `Token "${token.name}" is missing required reasoning. ` +
        `Add a reasoning string explaining why this token exists.`
      );
    }

    // Rule 2: Validate primitive reference if present (Requirement 3.5)
    if (token.primitiveReference) {
      if (!this.primitiveRegistry.has(token.primitiveReference)) {
        errors.push(
          `Token "${token.name}" references non-existent primitive "${token.primitiveReference}". ` +
          `Ensure the primitive token is registered in PrimitiveTokenRegistry.`
        );
      }
    } else {
      // Rule 3: Validate family conformance for custom values (Requirement 3.2, 3.3)
      const familyResult = validateFamilyConformance(token.family, token.value, this.primitiveRegistry);
      
      if (!familyResult.valid) {
        errors.push(
          `Token "${token.name}" value ${token.value} does not conform to ${token.family} family pattern. ` +
          familyResult.message
        );
      }
      
      if (familyResult.warning) {
        warnings.push(`Token "${token.name}": ${familyResult.warning}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate all registered component tokens
   * 
   * Validates all tokens currently in the ComponentTokenRegistry.
   * Returns a combined result with all errors and warnings.
   * 
   * @returns Combined validation result for all component tokens
   * 
   * @see Requirements 3.1, 3.4, 3.5, 3.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
   */
  validateAllComponentTokens(): ComponentTokenValidationResult {
    const allTokens = ComponentTokenRegistry.getAll();
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const token of allTokens) {
      const result = this.validateComponentToken(token);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}
