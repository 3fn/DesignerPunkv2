"use strict";
/**
 * Token Usage Tracker
 *
 * Tracks all token usages across the system to provide baseline metrics
 * for calculating strategic flexibility usage rates and overall token adoption.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenUsageTracker = exports.TokenType = void 0;
/**
 * Token type for usage tracking
 */
var TokenType;
(function (TokenType) {
    TokenType["PRIMITIVE"] = "primitive";
    TokenType["SEMANTIC"] = "semantic";
})(TokenType || (exports.TokenType = TokenType = {}));
/**
 * Tracker for all token usages across the system
 */
class TokenUsageTracker {
    constructor() {
        this.usages = [];
    }
    /**
     * Record a primitive token usage
     */
    recordPrimitiveUsage(token, location, timestamp = new Date()) {
        this.usages.push({
            tokenName: token.name,
            tokenType: TokenType.PRIMITIVE,
            isStrategicFlexibility: token.isStrategicFlexibility,
            category: token.category,
            location,
            timestamp
        });
    }
    /**
     * Record a semantic token usage
     */
    recordSemanticUsage(token, location, timestamp = new Date()) {
        // Get the first primitive token to check strategic flexibility
        const firstPrimitiveToken = token.primitiveTokens ? Object.values(token.primitiveTokens)[0] : undefined;
        this.usages.push({
            tokenName: token.name,
            tokenType: TokenType.SEMANTIC,
            isStrategicFlexibility: firstPrimitiveToken?.isStrategicFlexibility || false,
            category: token.category,
            location,
            timestamp
        });
    }
    /**
     * Get overall token usage statistics
     */
    getStatistics() {
        const totalUsages = this.usages.length;
        const primitiveUsages = this.usages.filter(u => u.tokenType === TokenType.PRIMITIVE).length;
        const semanticUsages = this.usages.filter(u => u.tokenType === TokenType.SEMANTIC).length;
        const strategicFlexibilityUsages = this.usages.filter(u => u.isStrategicFlexibility).length;
        const strategicFlexibilityRate = totalUsages > 0
            ? strategicFlexibilityUsages / totalUsages
            : 0;
        // Group by category
        const byCategory = new Map();
        for (const usage of this.usages) {
            byCategory.set(usage.category, (byCategory.get(usage.category) || 0) + 1);
        }
        // Group by token
        const byToken = new Map();
        for (const usage of this.usages) {
            byToken.set(usage.tokenName, (byToken.get(usage.tokenName) || 0) + 1);
        }
        // Get most used tokens
        const tokenCounts = Array.from(byToken.entries())
            .map(([token, count]) => ({ token, count }))
            .sort((a, b) => b.count - a.count);
        const mostUsedTokens = tokenCounts.slice(0, 10);
        return {
            totalUsages,
            primitiveUsages,
            semanticUsages,
            strategicFlexibilityUsages,
            strategicFlexibilityRate,
            byCategory,
            byToken,
            mostUsedTokens
        };
    }
    /**
     * Get all usages for a specific token
     */
    getUsagesForToken(tokenName) {
        return this.usages.filter(u => u.tokenName === tokenName);
    }
    /**
     * Get all strategic flexibility usages
     */
    getStrategicFlexibilityUsages() {
        return this.usages.filter(u => u.isStrategicFlexibility);
    }
    /**
     * Get usages by token type
     */
    getUsagesByType(type) {
        return this.usages.filter(u => u.tokenType === type);
    }
    /**
     * Get usages by category
     */
    getUsagesByCategory(category) {
        return this.usages.filter(u => u.category === category);
    }
    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear() {
        this.usages = [];
    }
    /**
     * Get total usage count
     */
    getTotalUsages() {
        return this.usages.length;
    }
}
exports.TokenUsageTracker = TokenUsageTracker;
//# sourceMappingURL=TokenUsageTracker.js.map