/**
 * Component Token Generator
 * 
 * Generates component-specific tokens when semantic and primitive tokens
 * are mathematically insufficient for design requirements.
 * 
 * Component tokens are the fallback in the priority system:
 * semantic → primitive → component
 * 
 * @deprecated This class is deprecated and will be removed in a future version.
 * Use the new `defineComponentTokens()` helper from `src/build/tokens/defineComponentTokens.ts` instead.
 * 
 * Migration guide:
 * - Replace `ComponentTokenGenerator` class usage with `defineComponentTokens()` helper
 * - The new API handles token generation, validation, and registry integration automatically
 * - Validation is now handled by `ValidationCoordinator.validateComponentToken()`
 * - See `.kiro/specs/037-component-token-generation-pipeline/design.md` for architecture details
 * 
 * Key differences:
 * - OLD: Manual token generation with explicit platform values
 * - NEW: Automatic value extraction from primitive references
 * - OLD: Separate validation and promotion checking
 * - NEW: Integrated validation through ValidationCoordinator
 * - OLD: Complex ComponentToken interface with many required fields
 * - NEW: Lightweight defineComponentTokens() with minimal required fields
 * 
 * @example
 * ```typescript
 * // OLD (deprecated):
 * const generator = new ComponentTokenGenerator(primitiveRegistry);
 * const token = generator.generate({
 *   name: 'buttonIcon.inset.large',
 *   category: 'spacing',
 *   baseValue: 12,
 *   component: 'ButtonIcon',
 *   reasoning: 'Large button padding',
 *   createdBy: 'developer',
 * });
 * const validation = generator.validate(token);
 * 
 * // NEW (recommended):
 * import { defineComponentTokens } from './defineComponentTokens';
 * import { spacingTokens } from '../../tokens/SpacingTokens';
 * 
 * const ButtonIconTokens = defineComponentTokens({
 *   component: 'ButtonIcon',
 *   family: 'spacing',
 *   tokens: {
 *     'inset.large': {
 *       reference: spacingTokens.space150,
 *       reasoning: 'Large button requires 12px padding for visual balance',
 *     },
 *   },
 * });
 * // Validation happens automatically through ValidationCoordinator
 * ```
 * 
 * @see defineComponentTokens - The new recommended API for component tokens
 * @see ValidationCoordinator - For component token validation
 * @see ComponentTokenRegistry - Global registry for component token management
 */

import {
  ComponentToken,
  ComponentTokenSpec,
  ComponentTokenGenerator as IComponentTokenGenerator,
  ComponentTokenValidationResult,
  PromotionRecommendation,
  ComponentTokenPlatforms,
  ComponentTokenUsage,
  ComponentTokenMetadata
} from './ComponentToken';
import { Platform, PlatformValue } from './types';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { TokenCategory } from '../../types/PrimitiveToken';

/**
 * Component token generator implementation
 * 
 * Generates component tokens with:
 * - Mathematical validation
 * - Cross-platform unit conversion
 * - Usage tracking
 * - Promotion candidate detection
 * 
 * @deprecated Use `defineComponentTokens()` from `./defineComponentTokens` instead.
 * The new API handles token generation, validation, and registry integration automatically.
 */
export class ComponentTokenGenerator implements IComponentTokenGenerator {
  constructor(private primitiveRegistry: PrimitiveTokenRegistry) {}

  /**
   * Generate component token from specification
   * 
   * @param spec - Component token specification
   * @returns Generated component token
   */
  generate(spec: ComponentTokenSpec): ComponentToken {
    // Generate platform-specific values
    const platforms = this.generatePlatformValues(spec.baseValue, spec.name);

    // Initialize usage tracking
    const usage: ComponentTokenUsage = {
      usageCount: 0,
      contexts: [],
      appropriateUsage: true,
      appropriateUsageRate: 100,
      lastUsed: undefined
    };

    // Initialize metadata
    const metadata: ComponentTokenMetadata = {
      createdAt: new Date(),
      createdBy: spec.createdBy,
      modifiedAt: undefined,
      approved: false,
      approvalNotes: undefined,
      promotionCandidate: false,
      promotionReasoning: undefined
    };

    // Parse token references if provided
    const references = spec.references || [];

    const componentToken: ComponentToken = {
      name: spec.name,
      category: spec.category,
      baseValue: spec.baseValue,
      component: spec.component,
      reasoning: spec.reasoning,
      references,
      platforms,
      usage,
      metadata
    };

    return componentToken;
  }

  /**
   * Validate component token follows mathematical principles
   * 
   * @param token - Component token to validate
   * @returns Validation result
   */
  validate(token: ComponentToken): ComponentTokenValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate base value is positive
    if (token.baseValue <= 0) {
      errors.push(`Base value must be positive, got ${token.baseValue}`);
    }

    // Validate reasoning is provided
    if (!token.reasoning || token.reasoning.trim().length === 0) {
      errors.push('Component token must include reasoning for why existing tokens are insufficient');
    }

    // Check if base value aligns with baseline grid (8-unit)
    const baselineGrid = 8;
    const isBaselineAligned = token.baseValue % baselineGrid === 0;
    
    if (!isBaselineAligned && token.category === 'spacing') {
      warnings.push(
        `Base value ${token.baseValue} does not align with ${baselineGrid}-unit baseline grid. ` +
        `Consider using a baseline-aligned value or documenting why off-grid is necessary.`
      );
    }

    // Check if similar primitive token exists
    const similarPrimitive = this.findSimilarPrimitiveToken(token);
    if (similarPrimitive) {
      warnings.push(
        `Similar primitive token '${similarPrimitive.name}' exists with baseValue ${similarPrimitive.baseValue}. ` +
        `Consider using primitive token instead of component token.`
      );
      suggestions.push(`Use primitive token '${similarPrimitive.name}' instead`);
    }

    // Validate platform values are consistent
    const platformConsistency = this.validatePlatformConsistency(token);
    if (!platformConsistency.consistent) {
      errors.push(...platformConsistency.errors);
    }

    // Check if token references are valid
    if (token.references && token.references.length > 0) {
      for (const ref of token.references) {
        const primitiveToken = this.primitiveRegistry.get(ref.tokenName);
        if (!primitiveToken) {
          errors.push(`Referenced primitive token '${ref.tokenName}' does not exist`);
        }
      }
    }

    // Suggest promotion if usage is high
    if (token.usage.usageCount > 10 && token.usage.appropriateUsageRate >= 80) {
      suggestions.push(
        `Token has high usage (${token.usage.usageCount} times) with ${token.usage.appropriateUsageRate}% appropriate usage. ` +
        `Consider promoting to primitive token.`
      );
    }

    const mathematicallyConsistent = 
      errors.length === 0 && 
      platformConsistency.consistent;

    return {
      valid: errors.length === 0,
      mathematicallyConsistent,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Check if component token should be promoted to primitive
   * 
   * @param token - Component token to check
   * @returns Promotion recommendation
   */
  checkPromotion(token: ComponentToken): PromotionRecommendation {
    const usageThreshold = 10;
    const appropriateUsageThreshold = 80;

    const shouldPromote = 
      token.usage.usageCount >= usageThreshold &&
      token.usage.appropriateUsageRate >= appropriateUsageThreshold &&
      token.usage.contexts.length >= 3;

    let reasoning: string;
    if (shouldPromote) {
      reasoning = 
        `Token '${token.name}' is used ${token.usage.usageCount} times across ${token.usage.contexts.length} contexts ` +
        `with ${token.usage.appropriateUsageRate}% appropriate usage. This indicates the token represents a ` +
        `common design pattern that should be promoted to a primitive token for broader reuse.`;
    } else {
      const reasons: string[] = [];
      if (token.usage.usageCount < usageThreshold) {
        reasons.push(`usage count (${token.usage.usageCount}) below threshold (${usageThreshold})`);
      }
      if (token.usage.appropriateUsageRate < appropriateUsageThreshold) {
        reasons.push(`appropriate usage rate (${token.usage.appropriateUsageRate}%) below threshold (${appropriateUsageThreshold}%)`);
      }
      if (token.usage.contexts.length < 3) {
        reasons.push(`used in only ${token.usage.contexts.length} context(s), need at least 3`);
      }
      reasoning = `Token '${token.name}' should not be promoted: ${reasons.join(', ')}.`;
    }

    const suggestedPrimitiveName = shouldPromote
      ? this.generatePrimitiveName(token)
      : undefined;

    return {
      shouldPromote,
      reasoning,
      usageStats: {
        totalUsage: token.usage.usageCount,
        appropriateUsageRate: token.usage.appropriateUsageRate,
        contexts: token.usage.contexts
      },
      suggestedPrimitiveName
    };
  }

  /**
   * Generate platform-specific values from base value
   */
  private generatePlatformValues(baseValue: number, tokenName: string): ComponentTokenPlatforms {
    return {
      ios: {
        value: baseValue,
        unit: 'pt',
        token: tokenName
      },
      android: {
        value: baseValue,
        unit: 'dp',
        token: tokenName
      },
      web: {
        value: baseValue,
        unit: 'px',
        token: tokenName
      }
    };
  }

  /**
   * Validate platform values are mathematically consistent
   */
  private validatePlatformConsistency(token: ComponentToken): {
    consistent: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const { ios, android, web } = token.platforms;

    // All platform values should equal the base value
    if (ios.value !== token.baseValue) {
      errors.push(`iOS value (${ios.value}) does not match base value (${token.baseValue})`);
    }
    if (android.value !== token.baseValue) {
      errors.push(`Android value (${android.value}) does not match base value (${token.baseValue})`);
    }
    if (web.value !== token.baseValue) {
      errors.push(`Web value (${web.value}) does not match base value (${token.baseValue})`);
    }

    // Validate units are correct for each platform
    if (ios.unit !== 'pt') {
      errors.push(`iOS unit should be 'pt', got '${ios.unit}'`);
    }
    if (android.unit !== 'dp' && android.unit !== 'sp') {
      errors.push(`Android unit should be 'dp' or 'sp', got '${android.unit}'`);
    }
    if (web.unit !== 'px' && web.unit !== 'rem') {
      errors.push(`Web unit should be 'px' or 'rem', got '${web.unit}'`);
    }

    return {
      consistent: errors.length === 0,
      errors
    };
  }

  /**
   * Find similar primitive token if exists
   */
  private findSimilarPrimitiveToken(token: ComponentToken): any {
    // Get all primitive tokens in same category
    const categoryMap: Record<string, TokenCategory> = {
      'spacing': TokenCategory.SPACING,
      'fontSize': TokenCategory.FONT_SIZE,
      'radius': TokenCategory.RADIUS
    };

    const primitiveCategory = categoryMap[token.category];
    if (!primitiveCategory) {
      return null;
    }

    // Query primitive tokens
    const primitiveTokens = this.primitiveRegistry.query({
      category: primitiveCategory
    });

    // Find token with same or very similar base value
    const tolerance = 0.5;
    for (const primitive of primitiveTokens) {
      if (Math.abs(primitive.baseValue - token.baseValue) <= tolerance) {
        return primitive;
      }
    }

    return null;
  }

  /**
   * Generate suggested primitive token name
   */
  private generatePrimitiveName(token: ComponentToken): string {
    const categoryPrefix = token.category;
    const value = Math.round(token.baseValue);
    
    // Calculate multiplier from family base (assuming 8 for spacing)
    const familyBase = 8;
    const multiplier = Math.round((value / familyBase) * 100);
    
    return `${categoryPrefix}${multiplier}`;
  }
}
