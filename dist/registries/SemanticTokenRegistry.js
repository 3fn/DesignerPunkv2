"use strict";
/**
 * Semantic Token Registry
 *
 * Manages semantic tokens with mode-aware primitive token references.
 * Enforces primitive token references and prevents raw values in semantic tokens.
 * Provides registration, retrieval, and resolution methods for all semantic categories.
 *
 * Implements IRegistry<SemanticToken> for consistent registry interface.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokenRegistry = void 0;
const SemanticToken_1 = require("../types/SemanticToken");
class SemanticTokenRegistry {
    constructor(primitiveRegistry) {
        /**
         * Registry name for identification
         */
        this.name = 'SemanticTokenRegistry';
        this.tokens = new Map();
        this.categoryIndex = new Map();
        this.primitiveRegistry = primitiveRegistry;
        this.initializeCategoryIndex();
    }
    /**
     * Register a semantic token
     *
     * Implements IRegistry.register() interface.
     * Callers should validate tokens before registration using appropriate validators.
     */
    register(token, options = {}) {
        const { allowOverwrite = false } = options;
        // Check for existing token
        if (this.tokens.has(token.name) && !allowOverwrite) {
            throw new Error(`Semantic token ${token.name} is already registered. Use allowOverwrite option to replace.`);
        }
        // Register the token
        this.tokens.set(token.name, token);
        this.addToCategory(token.category, token.name);
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
     * Resolve mode-aware color token value based on system context
     * Works with both single-reference and multi-primitive color tokens
     */
    resolveColorValue(semanticToken, context) {
        if (semanticToken.category !== SemanticToken_1.SemanticCategory.COLOR) {
            return null;
        }
        // Resolve primitive token reference on-the-fly
        const primitiveRef = semanticToken.primitiveReferences.default ||
            semanticToken.primitiveReferences.color ||
            Object.values(semanticToken.primitiveReferences)[0];
        if (!primitiveRef) {
            return null;
        }
        const primitiveToken = this.primitiveRegistry.get(primitiveRef);
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
            SemanticToken_1.SemanticCategory.INTERACTION,
            SemanticToken_1.SemanticCategory.ACCESSIBILITY
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