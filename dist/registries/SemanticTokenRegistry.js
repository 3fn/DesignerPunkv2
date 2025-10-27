"use strict";
/**
 * Semantic Token Registry
 *
 * Manages semantic tokens with mode-aware primitive token references.
 * Enforces primitive token references and prevents raw values in semantic tokens.
 * Provides registration, retrieval, and resolution methods for all semantic categories.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokenRegistry = void 0;
const SemanticToken_1 = require("../types/SemanticToken");
class SemanticTokenRegistry {
    constructor(primitiveRegistry) {
        this.tokens = new Map();
        this.categoryIndex = new Map();
        this.primitiveRegistry = primitiveRegistry;
        this.initializeCategoryIndex();
    }
    /**
     * Register a semantic token with primitive reference validation
     */
    register(token, options = {}) {
        const { skipValidation = false, allowOverwrite = false } = options;
        // Check for existing token
        if (this.tokens.has(token.name) && !allowOverwrite) {
            return {
                level: 'Error',
                token: token.name,
                message: 'Semantic token already exists',
                rationale: `Semantic token ${token.name} is already registered. Use allowOverwrite option to replace.`,
                mathematicalReasoning: 'Token uniqueness prevents semantic inconsistencies in the system'
            };
        }
        // Validate token if not skipped
        let validationResult;
        if (!skipValidation) {
            validationResult = this.validateToken(token);
            if (validationResult.level === 'Error') {
                return validationResult;
            }
        }
        else {
            validationResult = {
                level: 'Pass',
                token: token.name,
                message: 'Validation skipped',
                rationale: 'Semantic token registered without validation',
                mathematicalReasoning: 'Validation bypassed by registration options'
            };
        }
        // Register the token
        this.tokens.set(token.name, token);
        this.addToCategory(token.category, token.name);
        return {
            level: 'Pass',
            token: token.name,
            message: 'Semantic token registered successfully',
            rationale: `Semantic token ${token.name} registered with ${validationResult.level} validation`,
            mathematicalReasoning: validationResult.mathematicalReasoning
        };
    }
    /**
     * Retrieve a semantic token by name
     */
    get(tokenName) {
        return this.tokens.get(tokenName);
    }
    /**
     * Check if a semantic token exists
     */
    has(tokenName) {
        return this.tokens.has(tokenName);
    }
    /**
     * Get all semantic tokens matching query options
     */
    query(options = {}) {
        let tokens = Array.from(this.tokens.values());
        // Filter by category
        if (options.category) {
            tokens = tokens.filter(token => token.category === options.category);
        }
        // Sort results
        if (options.sortBy) {
            tokens.sort((a, b) => {
                switch (options.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'category':
                        return a.category.localeCompare(b.category);
                    default:
                        return 0;
                }
            });
        }
        return tokens;
    }
    /**
     * Get all semantic tokens in a specific category
     */
    getByCategory(category) {
        const tokenNames = this.categoryIndex.get(category) || new Set();
        return Array.from(tokenNames)
            .map(name => this.tokens.get(name))
            .filter((token) => token !== undefined);
    }
    /**
     * Validate a semantic token against primitive reference requirements
     * Supports both single and multi-primitive token validation
     */
    validateToken(token) {
        const invalidReferences = [];
        const resolvedTokens = {};
        // Validate all primitive references
        for (const [key, primitiveRef] of Object.entries(token.primitiveReferences)) {
            const primitiveToken = this.primitiveRegistry.get(primitiveRef);
            if (!primitiveToken) {
                invalidReferences.push(`${key}: ${primitiveRef}`);
            }
            else {
                resolvedTokens[key] = primitiveToken;
            }
        }
        // Check if any references were invalid
        if (invalidReferences.length > 0) {
            return {
                level: 'Error',
                token: token.name,
                message: 'Invalid primitive token reference(s)',
                rationale: `Semantic token ${token.name} references non-existent primitive token(s): ${invalidReferences.join(', ')}`,
                mathematicalReasoning: 'Semantic tokens must reference valid primitive tokens to maintain mathematical consistency'
            };
        }
        // Attach resolved primitive tokens
        token.primitiveTokens = resolvedTokens;
        const referenceCount = Object.keys(token.primitiveReferences).length;
        const referenceList = Object.entries(token.primitiveReferences)
            .map(([key, ref]) => `${key}: ${ref}`)
            .join(', ');
        return {
            level: 'Pass',
            token: token.name,
            message: `Semantic token references ${referenceCount} valid primitive token(s)`,
            rationale: `Semantic token ${token.name} correctly references primitive token(s): ${referenceList}`,
            mathematicalReasoning: `Semantic token inherits mathematical properties from ${referenceCount} primitive token(s)`
        };
    }
    /**
     * Resolve mode-aware color token value based on system context
     * Works with both single-reference and multi-primitive color tokens
     */
    resolveColorValue(semanticToken, context) {
        if (semanticToken.category !== SemanticToken_1.SemanticCategory.COLOR) {
            return null;
        }
        // For color tokens, look for 'default' or 'color' key in primitiveTokens
        const primitiveToken = semanticToken.primitiveTokens?.default ||
            semanticToken.primitiveTokens?.color ||
            Object.values(semanticToken.primitiveTokens || {})[0];
        if (!primitiveToken) {
            return null;
        }
        // Get color value from primitive token
        const colorValue = primitiveToken.platforms.web.value;
        // Check if it's a mode-aware color token
        if (typeof colorValue === 'object' && 'light' in colorValue && 'dark' in colorValue) {
            const modeValue = colorValue[context.mode];
            return modeValue[context.theme];
        }
        // Fallback for non-mode-aware tokens (shouldn't happen with proper color tokens)
        return typeof colorValue === 'string' ? colorValue : null;
    }
    /**
     * Validate all registered semantic tokens
     */
    validateAll() {
        return Array.from(this.tokens.values()).map(token => this.validateToken(token));
    }
    /**
     * Get registry statistics
     */
    getStats() {
        const totalTokens = this.tokens.size;
        const categoryStats = new Map();
        for (const [category, tokenNames] of this.categoryIndex) {
            categoryStats.set(category, tokenNames.size);
        }
        return {
            totalTokens,
            categoryStats: Object.fromEntries(categoryStats)
        };
    }
    /**
     * Remove a semantic token from the registry
     */
    remove(tokenName) {
        const token = this.tokens.get(tokenName);
        if (!token) {
            return false;
        }
        this.tokens.delete(tokenName);
        this.removeFromCategory(token.category, tokenName);
        return true;
    }
    /**
     * Clear all semantic tokens
     */
    clear() {
        this.tokens.clear();
        this.categoryIndex.clear();
        this.initializeCategoryIndex();
    }
    /**
     * Initialize category index with all semantic categories
     */
    initializeCategoryIndex() {
        const categories = [
            SemanticToken_1.SemanticCategory.COLOR,
            SemanticToken_1.SemanticCategory.SPACING,
            SemanticToken_1.SemanticCategory.TYPOGRAPHY,
            SemanticToken_1.SemanticCategory.BORDER,
            SemanticToken_1.SemanticCategory.SHADOW,
            SemanticToken_1.SemanticCategory.LAYOUT,
            SemanticToken_1.SemanticCategory.INTERACTION
        ];
        categories.forEach(category => {
            this.categoryIndex.set(category, new Set());
        });
    }
    /**
     * Add semantic token to category index
     */
    addToCategory(category, tokenName) {
        if (!this.categoryIndex.has(category)) {
            this.categoryIndex.set(category, new Set());
        }
        this.categoryIndex.get(category).add(tokenName);
    }
    /**
     * Remove semantic token from category index
     */
    removeFromCategory(category, tokenName) {
        const categorySet = this.categoryIndex.get(category);
        if (categorySet) {
            categorySet.delete(tokenName);
        }
    }
}
exports.SemanticTokenRegistry = SemanticTokenRegistry;
//# sourceMappingURL=SemanticTokenRegistry.js.map