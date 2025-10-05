/**
 * Composition Pattern Validator
 * 
 * Validates semantic token composition patterns to ensure proper token hierarchy
 * and usage. Enforces that semantic tokens are used appropriately and that
 * primitive tokens are only used as fallbacks when semantic tokens don't exist.
 */

import type { SemanticToken } from '../types/SemanticToken';
import { SemanticCategory } from '../types/SemanticToken';
import type { PrimitiveToken } from '../types/PrimitiveToken';
import { TokenCategory } from '../types/PrimitiveToken';
import type { ValidationResult } from '../types/ValidationResult';
import type { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';

export interface CompositionContext {
  /** The context where the token is being used (e.g., 'button', 'card', 'layout') */
  usageContext: string;
  /** The type of property being set (e.g., 'padding', 'margin', 'color') */
  propertyType: string;
  /** Whether this is a component-level or layout-level usage */
  level: 'component' | 'layout' | 'global';
}

export interface CompositionValidationOptions {
  /** Whether to enforce semantic-first usage (default: true) */
  enforceSemanticFirst?: boolean;
  /** Whether to allow primitive fallback when no semantic exists (default: true) */
  allowPrimitiveFallback?: boolean;
  /** Whether to provide suggestions for better semantic tokens (default: true) */
  provideSuggestions?: boolean;
}

export class CompositionPatternValidator {
  private semanticRegistry: SemanticTokenRegistry;

  constructor(semanticRegistry: SemanticTokenRegistry) {
    this.semanticRegistry = semanticRegistry;
  }

  /**
   * Validate token usage in a composition context
   * Prioritizes semantic tokens over primitive tokens
   */
  validateTokenUsage(
    token: SemanticToken | PrimitiveToken,
    context: CompositionContext,
    options: CompositionValidationOptions = {}
  ): ValidationResult {
    const {
      enforceSemanticFirst = true,
      allowPrimitiveFallback = true,
      provideSuggestions = true
    } = options;

    // Check if token is semantic or primitive
    const isSemanticToken = 'primitiveReferences' in token;

    if (isSemanticToken) {
      // Semantic token usage is always preferred
      return this.validateSemanticTokenUsage(token as SemanticToken, context);
    } else {
      // Primitive token usage - check if semantic alternative exists
      return this.validatePrimitiveTokenUsage(
        token as PrimitiveToken,
        context,
        enforceSemanticFirst,
        allowPrimitiveFallback,
        provideSuggestions
      );
    }
  }

  /**
   * Validate semantic token usage (always Pass with context-appropriate feedback)
   */
  private validateSemanticTokenUsage(
    token: SemanticToken,
    context: CompositionContext
  ): ValidationResult {
    return {
      level: 'Pass',
      token: token.name,
      message: 'Semantic token usage follows best practices',
      rationale: `Using semantic token ${token.name} in ${context.usageContext} for ${context.propertyType}`,
      mathematicalReasoning: 'Semantic tokens provide contextual meaning while maintaining mathematical consistency'
    };
  }

  /**
   * Validate primitive token usage (Warning if semantic alternative exists)
   */
  private validatePrimitiveTokenUsage(
    token: PrimitiveToken,
    context: CompositionContext,
    enforceSemanticFirst: boolean,
    allowPrimitiveFallback: boolean,
    provideSuggestions: boolean
  ): ValidationResult {
    // Find potential semantic alternatives
    const semanticAlternatives = this.findSemanticAlternatives(token, context);

    if (semanticAlternatives.length > 0) {
      // Semantic alternatives exist
      if (enforceSemanticFirst) {
        return {
          level: 'Warning',
          token: token.name,
          message: 'Consider using semantic token instead of primitive',
          rationale: `Primitive token ${token.name} used in ${context.usageContext}, but semantic alternatives exist`,
          suggestions: provideSuggestions ? [
            `Consider using semantic tokens: ${semanticAlternatives.map(t => t.name).join(', ')}`,
            'Semantic tokens provide better contextual meaning and maintainability',
            'Use primitive tokens only when no appropriate semantic token exists'
          ] : undefined,
          mathematicalReasoning: 'Semantic tokens are preferred for better maintainability and contextual clarity'
        };
      }
    }

    // No semantic alternatives or fallback is allowed
    if (allowPrimitiveFallback) {
      return {
        level: 'Pass',
        token: token.name,
        message: 'Primitive token usage acceptable (no semantic alternative)',
        rationale: `Primitive token ${token.name} used as fallback in ${context.usageContext}`,
        mathematicalReasoning: 'Primitive token usage is acceptable when no appropriate semantic token exists'
      };
    }

    // Primitive fallback not allowed
    return {
      level: 'Error',
      token: token.name,
      message: 'Primitive token usage not allowed in this context',
      rationale: `Primitive token ${token.name} used in ${context.usageContext}, but semantic tokens are required`,
      suggestions: [
        'Create a semantic token for this use case',
        'Use existing semantic tokens if available',
        'Consult design system guidelines for semantic token usage'
      ],
      mathematicalReasoning: 'Semantic tokens are required to maintain proper token hierarchy'
    };
  }

  /**
   * Find semantic token alternatives for a primitive token
   */
  private findSemanticAlternatives(
    primitiveToken: PrimitiveToken,
    context: CompositionContext
  ): SemanticToken[] {
    // Map primitive token category to semantic category
    const semanticCategory = this.mapPrimitiveToSemanticCategory(primitiveToken.category);
    if (!semanticCategory) {
      return [];
    }

    // Get all semantic tokens in the category
    const semanticTokens = this.semanticRegistry.getByCategory(semanticCategory);

    // Filter to tokens that reference this primitive
    return semanticTokens.filter(semanticToken => {
      return Object.values(semanticToken.primitiveReferences).includes(primitiveToken.name);
    });
  }

  /**
   * Map primitive token category to semantic category
   */
  private mapPrimitiveToSemanticCategory(primitiveCategory: TokenCategory): SemanticCategory | null {
    const categoryMap: Record<string, SemanticCategory> = {
      [TokenCategory.SPACING]: SemanticCategory.SPACING,
      [TokenCategory.FONT_SIZE]: SemanticCategory.TYPOGRAPHY,
      [TokenCategory.FONT_FAMILY]: SemanticCategory.TYPOGRAPHY,
      [TokenCategory.FONT_WEIGHT]: SemanticCategory.TYPOGRAPHY,
      [TokenCategory.LINE_HEIGHT]: SemanticCategory.TYPOGRAPHY,
      [TokenCategory.LETTER_SPACING]: SemanticCategory.TYPOGRAPHY,
      [TokenCategory.COLOR]: SemanticCategory.COLOR,
      [TokenCategory.RADIUS]: SemanticCategory.BORDER,
    };

    return categoryMap[primitiveCategory] || null;
  }

  /**
   * Validate composition pattern for multiple tokens
   */
  validateComposition(
    tokens: Array<{ token: SemanticToken | PrimitiveToken; context: CompositionContext }>,
    options: CompositionValidationOptions = {}
  ): ValidationResult[] {
    return tokens.map(({ token, context }) => this.validateTokenUsage(token, context, options));
  }

  /**
   * Get composition statistics
   */
  getCompositionStats(
    validationResults: ValidationResult[]
  ): {
    total: number;
    semanticUsage: number;
    primitiveUsage: number;
    warnings: number;
    errors: number;
    semanticFirstPercentage: number;
  } {
    const total = validationResults.length;
    const semanticUsage = validationResults.filter(r => 
      r.message.includes('Semantic token usage')
    ).length;
    const primitiveUsage = total - semanticUsage;
    const warnings = validationResults.filter(r => r.level === 'Warning').length;
    const errors = validationResults.filter(r => r.level === 'Error').length;
    const semanticFirstPercentage = total > 0 ? (semanticUsage / total) * 100 : 0;

    return {
      total,
      semanticUsage,
      primitiveUsage,
      warnings,
      errors,
      semanticFirstPercentage
    };
  }

  /**
   * Suggest semantic token for a given context
   */
  suggestSemanticToken(
    context: CompositionContext
  ): SemanticToken[] {
    // Map property type to semantic category
    const categoryMap: Record<string, SemanticCategory> = {
      'padding': SemanticCategory.SPACING,
      'margin': SemanticCategory.SPACING,
      'gap': SemanticCategory.SPACING,
      'spacing': SemanticCategory.SPACING,
      'color': SemanticCategory.COLOR,
      'background': SemanticCategory.COLOR,
      'border': SemanticCategory.BORDER,
      'borderRadius': SemanticCategory.BORDER,
      'shadow': SemanticCategory.SHADOW,
      'fontSize': SemanticCategory.TYPOGRAPHY,
      'fontFamily': SemanticCategory.TYPOGRAPHY,
      'lineHeight': SemanticCategory.TYPOGRAPHY,
    };

    const category = categoryMap[context.propertyType];
    if (!category) {
      return [];
    }

    // Get all semantic tokens in the category
    return this.semanticRegistry.getByCategory(category);
  }
}
