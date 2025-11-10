"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveTokenRegistry = void 0;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
const BaselineGridValidator_1 = require("../validators/BaselineGridValidator");
class PrimitiveTokenRegistry {
    constructor() {
        /**
         * Registry name for identification
         */
        this.name = 'PrimitiveTokenRegistry';
        this.tokens = new Map();
        this.categoryIndex = new Map();
        this.validator = new BaselineGridValidator_1.BaselineGridValidator({
            allowStrategicFlexibility: true
        });
        // Initialize category index
        this.initializeCategoryIndex();
    }
    /**
     * Register a primitive token with validation
     *
     * Implements IRegistry.register() interface.
     * Note: Validation methods (validateToken, validateAll) will be removed in Phase 3.
     * Callers should validate tokens before registration using appropriate validators.
     */
    register(token, options = {}) {
        const { skipValidation = false, allowOverwrite = false } = options;
        // Check for existing token
        if (this.tokens.has(token.name) && !allowOverwrite) {
            throw new Error(`Token ${token.name} is already registered. Use allowOverwrite option to replace.`);
        }
        // Validate token if not skipped
        if (!skipValidation) {
            const validationResult = this.validateToken(token);
            if (validationResult.level === 'Error') {
                throw new Error(`Validation failed for token ${token.name}: ${validationResult.message}`);
            }
        }
        // Register the token
        this.tokens.set(token.name, token);
        this.addToCategory(token.category, token.name);
    }
    /**
     * Retrieve a token by name
     */
    get(tokenName) {
        return this.tokens.get(tokenName);
    }
    /**
     * Check if a token exists
     */
    has(tokenName) {
        return this.tokens.has(tokenName);
    }
    /**
     * Get all tokens matching query options
     */
    query(options = {}) {
        let tokens = Array.from(this.tokens.values());
        // Filter by category
        if (options.category) {
            tokens = tokens.filter(token => token.category === options.category);
        }
        // Filter strategic flexibility if requested
        if (options.includeStrategicFlexibility === false) {
            tokens = tokens.filter(token => !token.isStrategicFlexibility);
        }
        // Sort results
        if (options.sortBy) {
            tokens.sort((a, b) => {
                switch (options.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'value':
                        return a.baseValue - b.baseValue;
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
     * Get all tokens in a specific category
     */
    getByCategory(category) {
        const tokenNames = this.categoryIndex.get(category) || new Set();
        return Array.from(tokenNames)
            .map(name => this.tokens.get(name))
            .filter((token) => token !== undefined);
    }
    /**
     * Validate a token against baseline grid requirements
     */
    validateToken(token) {
        // Categories that require baseline grid alignment
        const baselineGridCategories = [PrimitiveToken_1.TokenCategory.SPACING, PrimitiveToken_1.TokenCategory.RADIUS];
        if (baselineGridCategories.includes(token.category)) {
            return this.validator.validate({ value: token.baseValue, tokenName: token.name });
        }
        // Other categories pass validation (they have their own mathematical foundations)
        return {
            level: 'Pass',
            token: token.name,
            message: 'Token category does not require baseline grid validation',
            rationale: `Category ${token.category} uses its own mathematical foundation (base: ${token.familyBaseValue})`,
            mathematicalReasoning: `Token follows ${token.category} family mathematical progression with base value ${token.familyBaseValue}`
        };
    }
    /**
     * Validate all registered tokens
     */
    validateAll() {
        return Array.from(this.tokens.values()).map(token => this.validateToken(token));
    }
    /**
     * Get registry statistics
     */
    getStats() {
        const totalTokens = this.tokens.size;
        const strategicFlexibilityCount = Array.from(this.tokens.values())
            .filter(token => token.isStrategicFlexibility).length;
        const categoryStats = new Map();
        for (const [category, tokenNames] of this.categoryIndex) {
            categoryStats.set(category, tokenNames.size);
        }
        return {
            totalTokens,
            strategicFlexibilityCount,
            strategicFlexibilityPercentage: totalTokens > 0 ? (strategicFlexibilityCount / totalTokens) * 100 : 0,
            categoryStats: Object.fromEntries(categoryStats),
            validationInfo: this.validator.getGridInfo()
        };
    }
    /**
     * Remove a token from the registry
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
     * Clear all tokens
     */
    clear() {
        this.tokens.clear();
        this.categoryIndex.clear();
        this.initializeCategoryIndex();
    }
    /**
     * Initialize category index with all token categories
     */
    initializeCategoryIndex() {
        const categories = [
            PrimitiveToken_1.TokenCategory.SPACING,
            PrimitiveToken_1.TokenCategory.FONT_SIZE,
            PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
            PrimitiveToken_1.TokenCategory.RADIUS,
            PrimitiveToken_1.TokenCategory.DENSITY,
            PrimitiveToken_1.TokenCategory.TAP_AREA,
            PrimitiveToken_1.TokenCategory.BORDER_WIDTH
        ];
        categories.forEach(category => {
            this.categoryIndex.set(category, new Set());
        });
    }
    /**
     * Add token to category index
     */
    addToCategory(category, tokenName) {
        if (!this.categoryIndex.has(category)) {
            this.categoryIndex.set(category, new Set());
        }
        this.categoryIndex.get(category).add(tokenName);
    }
    /**
     * Remove token from category index
     */
    removeFromCategory(category, tokenName) {
        const categorySet = this.categoryIndex.get(category);
        if (categorySet) {
            categorySet.delete(tokenName);
        }
    }
}
exports.PrimitiveTokenRegistry = PrimitiveTokenRegistry;
//# sourceMappingURL=PrimitiveTokenRegistry.js.map