"use strict";
/**
 * Token Selector
 *
 * Implements token selection priority logic: semantic → primitive → component
 *
 * Selection Priority:
 * 1. First: Attempt to use semantic tokens (space.inset.small, color.primary, etc.)
 * 2. Second: Attempt to use primitive tokens (space100, space125, color.blue500, etc.)
 * 3. Third: Create component token only if semantic and primitive tokens cannot achieve design requirements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSelector = void 0;
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
const SemanticToken_1 = require("../../types/SemanticToken");
/**
 * Token selector implementation
 *
 * Follows the priority system to select the most appropriate token
 * for a given request, documenting reasoning at each step.
 */
class TokenSelector {
    constructor(primitiveRegistry, semanticRegistry) {
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
    }
    /**
     * Select appropriate token following priority: semantic → primitive → component
     *
     * @param request - Token request specification
     * @param options - Selection options
     * @returns Token selection with reasoning
     */
    selectToken(request, options = {}) {
        const timestamp = new Date();
        // Step 1: Attempt semantic token selection (first priority)
        const semanticResult = this.trySemanticToken(request, options);
        if (semanticResult && 'token' in semanticResult) {
            return {
                requested: request,
                semantic: semanticResult.token,
                priority: 'semantic',
                reasoning: semanticResult.reasoning,
                mathematicallyValid: true,
                timestamp
            };
        }
        // Step 2: Attempt primitive token selection (second priority)
        const primitiveResult = this.tryPrimitiveToken(request, options);
        if (primitiveResult && 'token' in primitiveResult) {
            const semanticInsufficiency = semanticResult && 'insufficiencyReason' in semanticResult
                ? semanticResult.insufficiencyReason
                : 'No suitable semantic token found';
            return {
                requested: request,
                primitive: primitiveResult.token,
                priority: 'primitive',
                reasoning: primitiveResult.reasoning,
                semanticInsufficiencyReason: semanticInsufficiency,
                mathematicallyValid: true,
                timestamp
            };
        }
        // Step 3: Component token generation (fallback)
        const semanticInsufficiency = semanticResult && 'insufficiencyReason' in semanticResult
            ? semanticResult.insufficiencyReason
            : 'No suitable semantic token found';
        const primitiveInsufficiency = primitiveResult && 'insufficiencyReason' in primitiveResult
            ? primitiveResult.insufficiencyReason
            : 'No suitable primitive token found';
        // Only if allowed by options
        if (options.allowComponentTokens === false) {
            return {
                requested: request,
                priority: 'component',
                reasoning: 'No suitable semantic or primitive token found, but component token generation is disabled',
                semanticInsufficiencyReason: semanticInsufficiency,
                primitiveInsufficiencyReason: primitiveInsufficiency,
                mathematicallyValid: false,
                timestamp
            };
        }
        // Return selection indicating component token needed
        return {
            requested: request,
            priority: 'component',
            reasoning: 'Component token generation required - no suitable semantic or primitive tokens found',
            semanticInsufficiencyReason: semanticInsufficiency,
            primitiveInsufficiencyReason: primitiveInsufficiency,
            mathematicallyValid: false,
            timestamp
        };
    }
    /**
     * Try to select a semantic token (first priority)
     *
     * @param request - Token request
     * @param options - Selection options
     * @returns Semantic token and reasoning, or null if not found
     */
    trySemanticToken(request, options) {
        // If specific token name requested, try to get it
        if (request.tokenName) {
            const token = this.semanticRegistry.get(request.tokenName);
            if (token) {
                return {
                    token,
                    reasoning: `Semantic token '${request.tokenName}' selected as explicitly requested. Provides contextual meaning while maintaining mathematical consistency through primitive token references.`
                };
            }
            return {
                insufficiencyReason: `Requested semantic token '${request.tokenName}' not found in registry`
            };
        }
        // Map request category to semantic category
        const semanticCategory = this.mapToSemanticCategory(request.category);
        if (!semanticCategory) {
            return {
                insufficiencyReason: `Category '${request.category}' does not map to a semantic category`
            };
        }
        // Get all semantic tokens in category
        const semanticTokens = this.semanticRegistry.getByCategory(semanticCategory);
        if (semanticTokens.length === 0) {
            return {
                insufficiencyReason: `No semantic tokens found in category '${semanticCategory}'`
            };
        }
        // If preferred category specified in options, filter by that
        if (options.preferredCategory) {
            const filtered = semanticTokens.filter(t => t.name.includes(options.preferredCategory));
            if (filtered.length > 0) {
                const token = filtered[0];
                return {
                    token,
                    reasoning: `Semantic token '${token.name}' selected from category '${semanticCategory}' matching preferred category '${options.preferredCategory}'. Provides contextual abstraction over primitive tokens.`
                };
            }
        }
        // Use context to find best match
        if (request.context) {
            const contextMatch = this.findSemanticTokenByContext(semanticTokens, request.context);
            if (contextMatch) {
                return {
                    token: contextMatch,
                    reasoning: `Semantic token '${contextMatch.name}' selected based on context match. Context: ${contextMatch.context}. Maintains mathematical consistency through primitive references.`
                };
            }
        }
        // Return first token in category as fallback
        const token = semanticTokens[0];
        return {
            token,
            reasoning: `Semantic token '${token.name}' selected as default from category '${semanticCategory}'. Provides semantic meaning while referencing primitive tokens for mathematical consistency.`
        };
    }
    /**
     * Try to select a primitive token (second priority)
     *
     * @param request - Token request
     * @param options - Selection options
     * @returns Primitive token and reasoning, or null if not found
     */
    tryPrimitiveToken(request, options) {
        // If specific token name requested, try to get it
        if (request.tokenName) {
            const token = this.primitiveRegistry.get(request.tokenName);
            if (token) {
                return {
                    token,
                    reasoning: `Primitive token '${request.tokenName}' selected as explicitly requested. Provides mathematical foundation with baseValue ${token.baseValue} (${token.mathematicalRelationship}).`
                };
            }
            return {
                insufficiencyReason: `Requested primitive token '${request.tokenName}' not found in registry`
            };
        }
        // Map request category to token category
        const tokenCategory = this.mapToTokenCategory(request.category);
        if (!tokenCategory) {
            return {
                insufficiencyReason: `Category '${request.category}' does not map to a primitive token category`
            };
        }
        // Get all primitive tokens in category
        const primitiveTokens = this.primitiveRegistry.getByCategory(tokenCategory);
        if (primitiveTokens.length === 0) {
            return {
                insufficiencyReason: `No primitive tokens found in category '${tokenCategory}'`
            };
        }
        // If preferred category specified in options, filter by that
        if (options.preferredCategory) {
            const filtered = primitiveTokens.filter(t => t.name.includes(options.preferredCategory));
            if (filtered.length > 0) {
                const token = filtered[0];
                return {
                    token,
                    reasoning: `Primitive token '${token.name}' selected from category '${tokenCategory}' matching preferred category '${options.preferredCategory}'. BaseValue: ${token.baseValue}, Mathematical relationship: ${token.mathematicalRelationship}.`
                };
            }
        }
        // Use context to find best match
        if (request.context) {
            const contextMatch = this.findPrimitiveTokenByContext(primitiveTokens, request.context);
            if (contextMatch) {
                return {
                    token: contextMatch,
                    reasoning: `Primitive token '${contextMatch.name}' selected based on context match. BaseValue: ${contextMatch.baseValue}, ${contextMatch.mathematicalRelationship}. ${contextMatch.baselineGridAlignment ? 'Aligns with baseline grid.' : ''}`
                };
            }
        }
        // Return first token in category as fallback
        const token = primitiveTokens[0];
        return {
            token,
            reasoning: `Primitive token '${token.name}' selected as default from category '${tokenCategory}'. BaseValue: ${token.baseValue}, Mathematical relationship: ${token.mathematicalRelationship}.`
        };
    }
    /**
     * Document reasoning for token selection
     *
     * @param selection - Token selection result
     * @returns Detailed reasoning documentation
     */
    documentSelection(selection) {
        const lines = [];
        lines.push(`Token Selection for: ${selection.requested.property}`);
        lines.push(`Category: ${selection.requested.category}`);
        lines.push(`Priority Used: ${selection.priority}`);
        lines.push('');
        lines.push(`Reasoning: ${selection.reasoning}`);
        if (selection.semantic) {
            lines.push('');
            lines.push('Selected Semantic Token:');
            lines.push(`  Name: ${selection.semantic.name}`);
            lines.push(`  Context: ${selection.semantic.context}`);
            lines.push(`  Primitive References: ${Object.entries(selection.semantic.primitiveReferences).map(([k, v]) => `${k}=${v}`).join(', ')}`);
        }
        if (selection.primitive) {
            lines.push('');
            lines.push('Selected Primitive Token:');
            lines.push(`  Name: ${selection.primitive.name}`);
            lines.push(`  Base Value: ${selection.primitive.baseValue}`);
            lines.push(`  Mathematical Relationship: ${selection.primitive.mathematicalRelationship}`);
            lines.push(`  Baseline Grid Aligned: ${selection.primitive.baselineGridAlignment}`);
        }
        if (selection.component) {
            lines.push('');
            lines.push('Generated Component Token:');
            lines.push(`  Name: ${selection.component.name}`);
            lines.push(`  Base Value: ${selection.component.baseValue}`);
            lines.push(`  Component: ${selection.component.component}`);
            lines.push(`  Reasoning: ${selection.component.reasoning}`);
        }
        if (selection.semanticInsufficiencyReason) {
            lines.push('');
            lines.push(`Semantic Token Insufficiency: ${selection.semanticInsufficiencyReason}`);
        }
        if (selection.primitiveInsufficiencyReason) {
            lines.push('');
            lines.push(`Primitive Token Insufficiency: ${selection.primitiveInsufficiencyReason}`);
        }
        lines.push('');
        lines.push(`Mathematically Valid: ${selection.mathematicallyValid}`);
        lines.push(`Timestamp: ${selection.timestamp.toISOString()}`);
        return lines.join('\n');
    }
    /**
     * Map request category to semantic category
     */
    mapToSemanticCategory(category) {
        const mapping = {
            'color': SemanticToken_1.SemanticCategory.COLOR,
            'spacing': SemanticToken_1.SemanticCategory.SPACING,
            'typography': SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            'border': SemanticToken_1.SemanticCategory.BORDER,
            'shadow': SemanticToken_1.SemanticCategory.SHADOW,
            'layout': SemanticToken_1.SemanticCategory.LAYOUT,
            'interaction': SemanticToken_1.SemanticCategory.INTERACTION
        };
        return mapping[category.toLowerCase()] || null;
    }
    /**
     * Map request category to token category
     */
    mapToTokenCategory(category) {
        const mapping = {
            'spacing': PrimitiveToken_1.TokenCategory.SPACING,
            'fontsize': PrimitiveToken_1.TokenCategory.FONT_SIZE,
            'fontfamily': PrimitiveToken_1.TokenCategory.FONT_FAMILY,
            'fontweight': PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
            'lineheight': PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
            'letterspacing': PrimitiveToken_1.TokenCategory.LETTER_SPACING,
            'radius': PrimitiveToken_1.TokenCategory.RADIUS,
            'density': PrimitiveToken_1.TokenCategory.DENSITY,
            'taparea': PrimitiveToken_1.TokenCategory.TAP_AREA,
            'color': PrimitiveToken_1.TokenCategory.COLOR
        };
        return mapping[category.toLowerCase()] || null;
    }
    /**
     * Find semantic token by context matching
     */
    findSemanticTokenByContext(tokens, context) {
        // Look for context keywords in token context or name
        const contextStr = JSON.stringify(context).toLowerCase();
        for (const token of tokens) {
            const tokenContext = token.context.toLowerCase();
            const tokenName = token.name.toLowerCase();
            // Check if any context values match token context or name
            if (contextStr.includes(tokenContext) || contextStr.includes(tokenName)) {
                return token;
            }
        }
        return null;
    }
    /**
     * Find primitive token by context matching
     */
    findPrimitiveTokenByContext(tokens, context) {
        // Look for specific values or keywords in context
        const contextStr = JSON.stringify(context).toLowerCase();
        for (const token of tokens) {
            const tokenName = token.name.toLowerCase();
            const tokenDesc = token.description.toLowerCase();
            // Check if context mentions token name or description
            if (contextStr.includes(tokenName) || contextStr.includes(tokenDesc)) {
                return token;
            }
        }
        return null;
    }
}
exports.TokenSelector = TokenSelector;
//# sourceMappingURL=TokenSelector.js.map