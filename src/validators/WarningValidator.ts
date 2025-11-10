/**
 * Warning-Level Validation Logic
 * 
 * Identifies mathematically valid but potentially problematic token usage patterns:
 * - Overuse of primitive tokens when semantic alternatives exist
 * - Strategic flexibility tokens used inappropriately
 * - Patterns that may indicate design system misunderstanding
 * - Usage that works but could be optimized
 */

import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { TokenCategory } from '../types';
import { isStrategicFlexibilityValue, STRATEGIC_FLEXIBILITY_VALUES } from '../constants/StrategicFlexibilityTokens';
import { ValidationReasoning, type ReasoningContext } from './ValidationReasoning';
import type { IValidator } from './IValidator';

/**
 * Warning validation context with usage pattern analysis
 */
export interface WarningValidationContext {
  /** Token being validated */
  token: PrimitiveToken | SemanticToken;
  
  /** Usage pattern information */
  usagePattern?: {
    /** Frequency of this token usage */
    usageFrequency?: number;
    
    /** Total usage count in project */
    totalUsageCount?: number;
    
    /** Alternative tokens available */
    availableAlternatives?: string[];
    
    /** Usage context (component, property, etc.) */
    usageContext?: string;
    
    /** Pattern classification */
    patternType?: 'overuse' | 'misuse' | 'suboptimal' | 'inconsistent';
  };
  
  /** Design system context */
  systemContext?: {
    /** Available semantic tokens */
    availableSemanticTokens?: string[];
    
    /** Strategic flexibility usage statistics */
    strategicFlexibilityStats?: {
      totalUsage: number;
      appropriateUsage: number;
      inappropriateUsage: number;
      usagePercentage: number;
    };
    
    /** Token family usage patterns */
    familyUsagePatterns?: Record<TokenCategory, {
      primitiveUsage: number;
      semanticUsage: number;
      totalUsage: number;
    }>;
  };
  
  /** Validation options */
  options?: {
    /** Threshold for strategic flexibility appropriate usage */
    strategicFlexibilityThreshold?: number;
    
    /** Threshold for primitive vs semantic usage warnings */
    primitiveUsageThreshold?: number;
    
    /** Enable pattern analysis */
    enablePatternAnalysis?: boolean;
  };
}

/**
 * Warning-level validator for potentially problematic patterns
 */
export class WarningValidator implements IValidator<WarningValidationContext> {
  readonly name = 'WarningValidator';
  private reasoningGenerator: ValidationReasoning;
  
  // Default thresholds
  private readonly DEFAULT_STRATEGIC_FLEXIBILITY_THRESHOLD = 0.8; // 80%
  private readonly DEFAULT_PRIMITIVE_USAGE_THRESHOLD = 0.3; // 30%

  constructor(reasoningGenerator?: ValidationReasoning) {
    this.reasoningGenerator = reasoningGenerator || new ValidationReasoning();
  }

  /**
   * Validate token usage for Warning-level concerns
   */
  validate(context: WarningValidationContext): ValidationResult | null {
    const { token, usagePattern, systemContext, options = {} } = context;

    // Check for strategic flexibility overuse
    const strategicFlexibilityWarning = this.checkStrategicFlexibilityOveruse(token, systemContext, options);
    if (strategicFlexibilityWarning) {
      return strategicFlexibilityWarning;
    }

    // Check for primitive token overuse when semantic alternatives exist
    const primitiveOveruseWarning = this.checkPrimitiveTokenOveruse(token, usagePattern, systemContext, options);
    if (primitiveOveruseWarning) {
      return primitiveOveruseWarning;
    }

    // Check for suboptimal usage patterns
    const suboptimalPatternWarning = this.checkSuboptimalUsagePatterns(token, usagePattern, options);
    if (suboptimalPatternWarning) {
      return suboptimalPatternWarning;
    }

    // Check for inconsistent usage patterns
    const inconsistentPatternWarning = this.checkInconsistentUsagePatterns(token, usagePattern, systemContext, options);
    if (inconsistentPatternWarning) {
      return inconsistentPatternWarning;
    }

    // Check for mathematical edge cases
    const mathematicalEdgeCaseWarning = this.checkMathematicalEdgeCases(token, options);
    if (mathematicalEdgeCaseWarning) {
      return mathematicalEdgeCaseWarning;
    }

    // No warnings detected
    return null;
  }

  /**
   * Check for strategic flexibility token overuse
   */
  private checkStrategicFlexibilityOveruse(
    token: PrimitiveToken | SemanticToken,
    systemContext?: WarningValidationContext['systemContext'],
    options: WarningValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;
    
    // Check if this is a strategic flexibility token
    if (!primitiveToken.isStrategicFlexibility && !isStrategicFlexibilityValue(primitiveToken.baseValue)) {
      return null;
    }

    // Check system-wide strategic flexibility usage
    const stats = systemContext?.strategicFlexibilityStats;
    if (!stats) {
      return null; // Cannot assess without usage statistics
    }

    const threshold = options.strategicFlexibilityThreshold || this.DEFAULT_STRATEGIC_FLEXIBILITY_THRESHOLD;
    const appropriateUsagePercentage = stats.totalUsage > 0 ? stats.appropriateUsage / stats.totalUsage : 1;

    if (appropriateUsagePercentage < threshold) {
      return this.generateWarningResult(
        token,
        'Strategic flexibility overuse detected',
        `Strategic flexibility usage is ${(appropriateUsagePercentage * 100).toFixed(1)}% appropriate, below ${(threshold * 100)}% threshold`,
        'problematic-pattern',
        {
          usagePattern: `Strategic flexibility overuse: ${stats.inappropriateUsage}/${stats.totalUsage} inappropriate usage`,
          expectedValue: threshold,
          actualValue: appropriateUsagePercentage
        },
        [
          'Review strategic flexibility token usage patterns',
          'Consider creating semantic tokens for common use cases',
          'Ensure strategic flexibility tokens are used only for exceptional design requirements',
          `Target ≥${(threshold * 100)}% appropriate usage of strategic flexibility tokens`
        ]
      );
    }

    return null;
  }

  /**
   * Check for primitive token overuse when semantic alternatives exist
   */
  private checkPrimitiveTokenOveruse(
    token: PrimitiveToken | SemanticToken,
    usagePattern?: WarningValidationContext['usagePattern'],
    systemContext?: WarningValidationContext['systemContext'],
    options: WarningValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;
    
    // Check if semantic alternatives are available
    const availableSemanticTokens = systemContext?.availableSemanticTokens || [];
    const hasSemanticAlternatives = availableSemanticTokens.length > 0;

    if (!hasSemanticAlternatives) {
      return null; // No semantic alternatives available
    }

    // Check family usage patterns
    const familyUsage = systemContext?.familyUsagePatterns?.[primitiveToken.category];
    if (!familyUsage) {
      return null; // Cannot assess without family usage data
    }

    const primitiveUsageRatio = familyUsage.totalUsage > 0 ? familyUsage.primitiveUsage / familyUsage.totalUsage : 0;
    const threshold = options.primitiveUsageThreshold || this.DEFAULT_PRIMITIVE_USAGE_THRESHOLD;

    // Warning if primitive usage is too high relative to semantic usage
    if (primitiveUsageRatio > (1 - threshold)) {
      return this.generateWarningResult(
        token,
        'High primitive token usage detected',
        `${(primitiveUsageRatio * 100).toFixed(1)}% primitive token usage in ${primitiveToken.category} family, consider semantic alternatives`,
        'problematic-pattern',
        {
          usagePattern: `High primitive usage: ${familyUsage.primitiveUsage}/${familyUsage.totalUsage} (${(primitiveUsageRatio * 100).toFixed(1)}%)`,
          expectedValue: 1 - threshold,
          actualValue: primitiveUsageRatio
        },
        [
          'Consider using semantic tokens for contextual abstraction',
          `Available semantic alternatives: ${availableSemanticTokens.join(', ')}`,
          'Review if primitive token usage provides necessary flexibility',
          'Create semantic tokens for common usage patterns'
        ]
      );
    }

    return null;
  }

  /**
   * Check for suboptimal usage patterns
   */
  private checkSuboptimalUsagePatterns(
    token: PrimitiveToken | SemanticToken,
    usagePattern?: WarningValidationContext['usagePattern'],
    options: WarningValidationContext['options'] = {}
  ): ValidationResult | null {
    if (!usagePattern || !options.enablePatternAnalysis) {
      return null;
    }

    // Check for high-frequency usage of specific tokens
    if (usagePattern.usageFrequency && usagePattern.totalUsageCount) {
      const usageRatio = usagePattern.usageFrequency / usagePattern.totalUsageCount;
      
      // Warning if single token represents >20% of total usage
      if (usageRatio > 0.2) {
        return this.generateWarningResult(
          token,
          'High-frequency token usage detected',
          `Token represents ${(usageRatio * 100).toFixed(1)}% of total usage, consider if semantic abstraction would be beneficial`,
          'problematic-pattern',
          {
            usagePattern: `High frequency: ${usagePattern.usageFrequency}/${usagePattern.totalUsageCount} (${(usageRatio * 100).toFixed(1)}%)`,
            actualValue: usageRatio
          },
          [
            'Consider creating semantic token for this common usage pattern',
            'Review if token usage indicates missing design system abstraction',
            'Evaluate if usage pattern suggests need for additional semantic tokens'
          ]
        );
      }
    }

    // Check for pattern type specific warnings
    if (usagePattern.patternType) {
      return this.checkSpecificPatternType(token, usagePattern);
    }

    return null;
  }

  /**
   * Check for inconsistent usage patterns
   */
  private checkInconsistentUsagePatterns(
    token: PrimitiveToken | SemanticToken,
    usagePattern?: WarningValidationContext['usagePattern'],
    systemContext?: WarningValidationContext['systemContext'],
    options: WarningValidationContext['options'] = {}
  ): ValidationResult | null {
    if (!usagePattern || !systemContext) {
      return null;
    }

    // Check for inconsistent usage across similar contexts
    if (usagePattern.availableAlternatives && usagePattern.availableAlternatives.length > 0) {
      const hasInconsistentUsage = this.detectInconsistentUsage(token, usagePattern, systemContext);
      
      if (hasInconsistentUsage) {
        return this.generateWarningResult(
          token,
          'Inconsistent usage pattern detected',
          'Similar contexts use different tokens, consider standardizing usage patterns',
          'problematic-pattern',
          {
            usagePattern: `Inconsistent usage with alternatives: ${usagePattern.availableAlternatives.join(', ')}`
          },
          [
            'Review usage patterns across similar contexts',
            'Consider standardizing token usage for consistency',
            'Evaluate if semantic tokens would provide better abstraction',
            `Alternative tokens available: ${usagePattern.availableAlternatives.join(', ')}`
          ]
        );
      }
    }

    return null;
  }

  /**
   * Check for mathematical edge cases that might cause issues
   */
  private checkMathematicalEdgeCases(
    token: PrimitiveToken | SemanticToken,
    options: WarningValidationContext['options'] = {}
  ): ValidationResult | null {
    // Only applies to primitive tokens
    if ('primitiveReferences' in token) {
      return null;
    }

    const primitiveToken = token as PrimitiveToken;

    // Check for very small values that might cause precision issues
    if (primitiveToken.baseValue < 1 && primitiveToken.baseValue > 0) {
      return this.generateWarningResult(
        token,
        'Small value precision concern',
        `Base value ${primitiveToken.baseValue} may cause precision issues in some contexts`,
        'problematic-pattern',
        {
          actualValue: primitiveToken.baseValue
        },
        [
          'Consider if larger base value with different mathematical relationship would be more robust',
          'Validate precision across all target platforms',
          'Test rendering at various scales and densities'
        ]
      );
    }

    // Check for very large values that might cause overflow
    if (primitiveToken.baseValue > 1000) {
      return this.generateWarningResult(
        token,
        'Large value overflow concern',
        `Base value ${primitiveToken.baseValue} is unusually large, verify intended usage`,
        'problematic-pattern',
        {
          actualValue: primitiveToken.baseValue
        },
        [
          'Verify large value is intentional and necessary',
          'Consider if value should be broken down into smaller components',
          'Test behavior at various scales and screen sizes'
        ]
      );
    }

    // Check for non-integer values in categories that typically use integers
    if (this.shouldUseIntegerValues(primitiveToken.category) && primitiveToken.baseValue % 1 !== 0) {
      return this.generateWarningResult(
        token,
        'Non-integer value in integer category',
        `${primitiveToken.category} tokens typically use integer values, but found ${primitiveToken.baseValue}`,
        'problematic-pattern',
        {
          actualValue: primitiveToken.baseValue
        },
        [
          'Consider if integer value would be more appropriate',
          'Verify fractional value is necessary for design requirements',
          'Test cross-platform rendering with fractional values'
        ]
      );
    }

    return null;
  }

  /**
   * Check specific pattern types for targeted warnings
   */
  private checkSpecificPatternType(
    token: PrimitiveToken | SemanticToken,
    usagePattern: WarningValidationContext['usagePattern']
  ): ValidationResult | null {
    if (!usagePattern) {
      return null;
    }
    
    switch (usagePattern.patternType) {
      case 'overuse':
        return this.generateWarningResult(
          token,
          'Token overuse pattern detected',
          'Token is used frequently across many contexts, consider semantic abstraction',
          'problematic-pattern',
          { usagePattern: 'overuse' },
          [
            'Create semantic tokens for common usage contexts',
            'Review if single token is being used for multiple semantic purposes',
            'Consider breaking down usage into more specific semantic tokens'
          ]
        );

      case 'misuse':
        return this.generateWarningResult(
          token,
          'Potential token misuse detected',
          'Token usage may not align with intended purpose or context',
          'problematic-pattern',
          { usagePattern: 'misuse' },
          [
            'Review token usage against intended purpose',
            'Consider if different token would be more appropriate',
            'Verify usage aligns with design system guidelines'
          ]
        );

      case 'suboptimal':
        return this.generateWarningResult(
          token,
          'Suboptimal usage pattern detected',
          'Token usage is valid but could be optimized for better design system consistency',
          'problematic-pattern',
          { usagePattern: 'suboptimal' },
          [
            'Review if semantic token would provide better abstraction',
            'Consider if usage pattern indicates missing design system component',
            'Evaluate optimization opportunities'
          ]
        );

      case 'inconsistent':
        return this.generateWarningResult(
          token,
          'Inconsistent usage pattern detected',
          'Token usage varies across similar contexts, affecting design consistency',
          'problematic-pattern',
          { usagePattern: 'inconsistent' },
          [
            'Standardize token usage across similar contexts',
            'Create usage guidelines for consistent application',
            'Consider semantic tokens for context-specific usage'
          ]
        );

      default:
        return null;
    }
  }

  /**
   * Generate warning validation result with comprehensive reasoning
   */
  private generateWarningResult(
    token: PrimitiveToken | SemanticToken,
    message: string,
    rationale: string,
    scenario: 'problematic-pattern',
    contextData: ReasoningContext['contextData'],
    suggestions: string[]
  ): ValidationResult {
    const reasoningContext: ReasoningContext = {
      token,
      scenario,
      contextData
    };

    const mathematicalReasoning = this.reasoningGenerator.generateWarningReasoning(reasoningContext);

    return {
      level: 'Warning',
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
  private detectInconsistentUsage(
    token: PrimitiveToken | SemanticToken,
    usagePattern: WarningValidationContext['usagePattern'],
    systemContext: WarningValidationContext['systemContext']
  ): boolean {
    // Simplified inconsistency detection
    // In real implementation, this would analyze usage patterns across contexts
    return Boolean(usagePattern?.availableAlternatives && usagePattern.availableAlternatives.length > 2);
  }

  private shouldUseIntegerValues(category: TokenCategory): boolean {
    // Categories that typically use integer values
    return [
      TokenCategory.SPACING,
      TokenCategory.RADIUS,
      TokenCategory.FONT_SIZE,
      TokenCategory.TAP_AREA
    ].includes(category);
  }

  /**
   * Batch validation for multiple tokens
   */
  validateBatch(contexts: WarningValidationContext[]): ValidationResult[] {
    const warnings: ValidationResult[] = [];

    contexts.forEach(context => {
      const warning = this.validate(context);
      if (warning) {
        warnings.push(warning);
      }
    });

    return warnings;
  }

  /**
   * Generate usage pattern analysis report
   */
  generateUsagePatternReport(contexts: WarningValidationContext[]): {
    totalTokens: number;
    tokensWithWarnings: number;
    warningsByType: Record<string, number>;
    strategicFlexibilityOveruse: boolean;
    primitiveOveruseByCategory: Record<TokenCategory, number>;
    recommendations: string[];
  } {
    const warnings = this.validateBatch(contexts);
    const totalTokens = contexts.length;
    const tokensWithWarnings = warnings.length;

    // Analyze warning types
    const warningsByType: Record<string, number> = {};
    warnings.forEach(warning => {
      const type = this.extractWarningType(warning.message);
      warningsByType[type] = (warningsByType[type] || 0) + 1;
    });

    // Check for strategic flexibility overuse
    const strategicFlexibilityOveruse = warnings.some(w => 
      w.message.includes('Strategic flexibility overuse')
    );

    // Analyze primitive overuse by category
    const primitiveOveruseByCategory: Record<TokenCategory, number> = {} as Record<TokenCategory, number>;
    warnings.forEach(warning => {
      if (warning.message.includes('High primitive token usage')) {
        // Extract category from context - simplified implementation
        Object.values(TokenCategory).forEach(category => {
          if (warning.rationale.includes(category)) {
            primitiveOveruseByCategory[category] = (primitiveOveruseByCategory[category] || 0) + 1;
          }
        });
      }
    });

    // Generate recommendations
    const recommendations = this.generateSystemRecommendations(warnings, contexts);

    return {
      totalTokens,
      tokensWithWarnings,
      warningsByType,
      strategicFlexibilityOveruse,
      primitiveOveruseByCategory,
      recommendations
    };
  }

  private extractWarningType(message: string): string {
    if (message.includes('Strategic flexibility')) return 'strategic-flexibility';
    if (message.includes('primitive token usage')) return 'primitive-overuse';
    if (message.includes('High-frequency')) return 'high-frequency';
    if (message.includes('Inconsistent')) return 'inconsistent';
    if (message.includes('precision')) return 'precision';
    if (message.includes('overflow')) return 'overflow';
    return 'other';
  }

  private generateSystemRecommendations(
    warnings: ValidationResult[],
    contexts: WarningValidationContext[]
  ): string[] {
    const recommendations: string[] = [];

    // Strategic flexibility recommendations
    if (warnings.some(w => w.message.includes('Strategic flexibility'))) {
      recommendations.push('Review strategic flexibility token usage patterns and create semantic alternatives for common use cases');
    }

    // Primitive overuse recommendations
    if (warnings.some(w => w.message.includes('primitive token usage'))) {
      recommendations.push('Increase semantic token adoption to improve design system abstraction and consistency');
    }

    // Pattern consistency recommendations
    if (warnings.some(w => w.message.includes('Inconsistent'))) {
      recommendations.push('Establish usage guidelines and patterns for consistent token application across contexts');
    }

    // Mathematical edge case recommendations
    if (warnings.some(w => w.message.includes('precision') || w.message.includes('overflow'))) {
      recommendations.push('Review mathematical edge cases and validate token behavior across all target platforms');
    }

    return recommendations;
  }
}