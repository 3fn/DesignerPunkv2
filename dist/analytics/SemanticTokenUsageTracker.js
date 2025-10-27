"use strict";
/**
 * Semantic Token Usage Tracker
 *
 * Tracks usage patterns of semantic tokens to provide insights into semantic token
 * adoption and identify opportunities for creating new semantic tokens based on
 * common primitive token usage patterns.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTokenUsageTracker = void 0;
/**
 * Tracker for semantic token usage patterns
 */
class SemanticTokenUsageTracker {
    constructor() {
        this.usages = [];
        this.availableTokens = new Set();
    }
    /**
     * Register available semantic tokens for tracking
     */
    registerAvailableToken(tokenName) {
        this.availableTokens.add(tokenName);
    }
    /**
     * Record a usage of a semantic token
     */
    recordUsage(usage) {
        this.usages.push(usage);
        this.availableTokens.add(usage.token.name);
    }
    /**
     * Get usage statistics for semantic tokens
     */
    getStatistics() {
        const totalUsages = this.usages.length;
        const uniqueTokensUsed = new Set(this.usages.map(u => u.token.name)).size;
        // Group by category
        const byCategory = new Map();
        for (const usage of this.usages) {
            byCategory.set(usage.token.category, (byCategory.get(usage.token.category) || 0) + 1);
        }
        // Group by token
        const byToken = new Map();
        for (const usage of this.usages) {
            byToken.set(usage.token.name, (byToken.get(usage.token.name) || 0) + 1);
        }
        // Get most and least used tokens
        const tokenCounts = Array.from(byToken.entries())
            .map(([token, count]) => ({ token, count }))
            .sort((a, b) => b.count - a.count);
        const mostUsedTokens = tokenCounts.slice(0, 5);
        const leastUsedTokens = tokenCounts.slice(-5).reverse();
        return {
            totalUsages,
            uniqueTokensUsed,
            byCategory,
            byToken,
            mostUsedTokens,
            leastUsedTokens
        };
    }
    /**
     * Get feedback on semantic token usage patterns
     */
    getFeedback() {
        const stats = this.getStatistics();
        const feedback = [];
        if (stats.totalUsages === 0) {
            feedback.push('No semantic token usage recorded yet.');
            return feedback;
        }
        // Adoption rate feedback
        const adoptionRate = stats.uniqueTokensUsed / this.availableTokens.size;
        if (adoptionRate < 0.5) {
            feedback.push(`Low semantic token adoption (${(adoptionRate * 100).toFixed(1)}% of available tokens used). ` +
                `Consider promoting semantic token usage over primitive tokens.`);
        }
        else if (adoptionRate > 0.8) {
            feedback.push(`Excellent semantic token adoption (${(adoptionRate * 100).toFixed(1)}% of available tokens used).`);
        }
        // Category distribution feedback
        const categoryEntries = Array.from(stats.byCategory.entries());
        if (categoryEntries.length > 0) {
            const dominantCategory = categoryEntries.reduce((a, b) => a[1] > b[1] ? a : b);
            const dominantPercentage = (dominantCategory[1] / stats.totalUsages) * 100;
            if (dominantPercentage > 60) {
                feedback.push(`${dominantCategory[0]} tokens dominate usage (${dominantPercentage.toFixed(1)}%). ` +
                    `Consider expanding semantic tokens in other categories.`);
            }
        }
        // Unused tokens feedback
        const unusedTokens = this.availableTokens.size - stats.uniqueTokensUsed;
        if (unusedTokens > 0) {
            feedback.push(`${unusedTokens} semantic token(s) are not being used. ` +
                `Review whether these tokens are needed or if they should be promoted.`);
        }
        // Most used tokens feedback
        if (stats.mostUsedTokens.length > 0) {
            const topToken = stats.mostUsedTokens[0];
            const topTokenPercentage = (topToken.count / stats.totalUsages) * 100;
            if (topTokenPercentage > 30) {
                feedback.push(`Token "${topToken.token}" is heavily used (${topTokenPercentage.toFixed(1)}% of all usages). ` +
                    `This indicates a strong semantic pattern.`);
            }
        }
        return feedback;
    }
    /**
     * Get usages for a specific semantic token
     */
    getUsagesForToken(tokenName) {
        return this.usages.filter(u => u.token.name === tokenName);
    }
    /**
     * Get usages by category
     */
    getUsagesByCategory(category) {
        return this.usages.filter(u => u.token.category === category);
    }
    /**
     * Get unused semantic tokens
     */
    getUnusedTokens() {
        const usedTokens = new Set(this.usages.map(u => u.token.name));
        return Array.from(this.availableTokens).filter(token => !usedTokens.has(token));
    }
    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear() {
        this.usages = [];
    }
    /**
     * Clear available tokens registry
     */
    clearAvailableTokens() {
        this.availableTokens.clear();
    }
}
exports.SemanticTokenUsageTracker = SemanticTokenUsageTracker;
//# sourceMappingURL=SemanticTokenUsageTracker.js.map