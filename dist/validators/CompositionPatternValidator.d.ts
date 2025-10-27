/**
 * Composition Pattern Validator
 *
 * Validates semantic token composition patterns to ensure proper token hierarchy
 * and usage. Enforces that semantic tokens are used appropriately and that
 * primitive tokens are only used as fallbacks when semantic tokens don't exist.
 */
import type { SemanticToken } from '../types/SemanticToken';
import type { PrimitiveToken } from '../types/PrimitiveToken';
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
export declare class CompositionPatternValidator {
    private semanticRegistry;
    constructor(semanticRegistry: SemanticTokenRegistry);
    /**
     * Validate token usage in a composition context
     * Prioritizes semantic tokens over primitive tokens
     */
    validateTokenUsage(token: SemanticToken | PrimitiveToken, context: CompositionContext, options?: CompositionValidationOptions): ValidationResult;
    /**
     * Validate semantic token usage (always Pass with context-appropriate feedback)
     */
    private validateSemanticTokenUsage;
    /**
     * Validate primitive token usage (Warning if semantic alternative exists)
     */
    private validatePrimitiveTokenUsage;
    /**
     * Find semantic token alternatives for a primitive token
     */
    private findSemanticAlternatives;
    /**
     * Map primitive token category to semantic category
     */
    private mapPrimitiveToSemanticCategory;
    /**
     * Validate composition pattern for multiple tokens
     */
    validateComposition(tokens: Array<{
        token: SemanticToken | PrimitiveToken;
        context: CompositionContext;
    }>, options?: CompositionValidationOptions): ValidationResult[];
    /**
     * Get composition statistics
     */
    getCompositionStats(validationResults: ValidationResult[]): {
        total: number;
        semanticUsage: number;
        primitiveUsage: number;
        warnings: number;
        errors: number;
        semanticFirstPercentage: number;
    };
    /**
     * Suggest semantic token for a given context
     */
    suggestSemanticToken(context: CompositionContext): SemanticToken[];
}
//# sourceMappingURL=CompositionPatternValidator.d.ts.map