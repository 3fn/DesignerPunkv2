"use strict";
/**
 * Composition Pattern Validator
 *
 * Validates semantic token composition patterns to ensure proper token hierarchy
 * and usage. Enforces that semantic tokens are used appropriately and that
 * primitive tokens are only used as fallbacks when semantic tokens don't exist.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositionPatternValidator = void 0;
const SemanticToken_1 = require("../types/SemanticToken");
const PrimitiveToken_1 = require("../types/PrimitiveToken");
class CompositionPatternValidator {
    constructor(semanticRegistry) {
        this.semanticRegistry = semanticRegistry;
    }
    /**
     * Validate token usage in a composition context
     * Prioritizes semantic tokens over primitive tokens
     */
    validateTokenUsage(token, context, options = {}) {
        const { enforceSemanticFirst = true, allowPrimitiveFallback = true, provideSuggestions = true } = options;
        // Check if token is semantic or primitive
        const isSemanticToken = 'primitiveReferences' in token;
        if (isSemanticToken) {
            // Semantic token usage is always preferred
            return this.validateSemanticTokenUsage(token, context);
        }
        else {
            // Primitive token usage - check if semantic alternative exists
            return this.validatePrimitiveTokenUsage(token, context, enforceSemanticFirst, allowPrimitiveFallback, provideSuggestions);
        }
    }
    /**
     * Validate semantic token usage (always Pass with context-appropriate feedback)
     */
    validateSemanticTokenUsage(token, context) {
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
    validatePrimitiveTokenUsage(token, context, enforceSemanticFirst, allowPrimitiveFallback, provideSuggestions) {
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
    findSemanticAlternatives(primitiveToken, context) {
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
    mapPrimitiveToSemanticCategory(primitiveCategory) {
        const categoryMap = {
            [PrimitiveToken_1.TokenCategory.SPACING]: SemanticToken_1.SemanticCategory.SPACING,
            [PrimitiveToken_1.TokenCategory.FONT_SIZE]: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            [PrimitiveToken_1.TokenCategory.FONT_FAMILY]: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            [PrimitiveToken_1.TokenCategory.FONT_WEIGHT]: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            [PrimitiveToken_1.TokenCategory.LINE_HEIGHT]: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            [PrimitiveToken_1.TokenCategory.LETTER_SPACING]: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            [PrimitiveToken_1.TokenCategory.COLOR]: SemanticToken_1.SemanticCategory.COLOR,
            [PrimitiveToken_1.TokenCategory.RADIUS]: SemanticToken_1.SemanticCategory.BORDER,
        };
        return categoryMap[primitiveCategory] || null;
    }
    /**
     * Validate composition pattern for multiple tokens
     */
    validateComposition(tokens, options = {}) {
        return tokens.map(({ token, context }) => this.validateTokenUsage(token, context, options));
    }
    /**
     * Get composition statistics
     */
    getCompositionStats(validationResults) {
        const total = validationResults.length;
        const semanticUsage = validationResults.filter(r => r.message.includes('Semantic token usage')).length;
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
    suggestSemanticToken(context) {
        // Map property type to semantic category
        const categoryMap = {
            'padding': SemanticToken_1.SemanticCategory.SPACING,
            'margin': SemanticToken_1.SemanticCategory.SPACING,
            'gap': SemanticToken_1.SemanticCategory.SPACING,
            'spacing': SemanticToken_1.SemanticCategory.SPACING,
            'color': SemanticToken_1.SemanticCategory.COLOR,
            'background': SemanticToken_1.SemanticCategory.COLOR,
            'border': SemanticToken_1.SemanticCategory.BORDER,
            'borderRadius': SemanticToken_1.SemanticCategory.BORDER,
            'shadow': SemanticToken_1.SemanticCategory.SHADOW,
            'fontSize': SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            'fontFamily': SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            'lineHeight': SemanticToken_1.SemanticCategory.TYPOGRAPHY,
        };
        const category = categoryMap[context.propertyType];
        if (!category) {
            return [];
        }
        // Get all semantic tokens in the category
        return this.semanticRegistry.getByCategory(category);
    }
}
exports.CompositionPatternValidator = CompositionPatternValidator;
//# sourceMappingURL=CompositionPatternValidator.js.map