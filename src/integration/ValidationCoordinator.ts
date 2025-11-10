/**
 * Validation Coordinator
 * 
 * Coordinates validation services across the token system, managing three-tier
 * validation, usage pattern analysis, and comprehensive validation reporting.
 * Integrates with registries to provide system-wide validation insights.
 */

import { ThreeTierValidator, ThreeTierValidationContext, ThreeTierValidationResult } from '../validators/ThreeTierValidator';
import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { TokenCategory, SemanticCategory } from '../types';

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
 * Validation Coordinator class managing validation services
 */
export class ValidationCoordinator {
  private validator: ThreeTierValidator;
  private primitiveRegistry: PrimitiveTokenRegistry;
  private semanticRegistry: SemanticTokenRegistry;
  private config: ValidationCoordinatorConfig;
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
        expectedProgression: `Based on ${token.familyBaseValue}`,
        actualProgression: token.mathematicalRelationship
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
}
