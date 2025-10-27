"use strict";
/**
 * Primitive Token Fallback Tracker
 *
 * Tracks instances where primitive tokens are used directly instead of semantic tokens.
 * This helps identify opportunities for creating new semantic tokens based on common
 * primitive token usage patterns and promotes semantic token adoption.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimitiveTokenFallbackTracker = exports.FallbackReason = void 0;
/**
 * Reason for using primitive token instead of semantic token
 */
var FallbackReason;
(function (FallbackReason) {
    FallbackReason["NO_SEMANTIC_AVAILABLE"] = "no-semantic-available";
    FallbackReason["SEMANTIC_NOT_SUITABLE"] = "semantic-not-suitable";
    FallbackReason["DEVELOPER_PREFERENCE"] = "developer-preference";
    FallbackReason["PROTOTYPING"] = "prototyping";
    FallbackReason["UNKNOWN"] = "unknown"; // Reason not specified
})(FallbackReason || (exports.FallbackReason = FallbackReason = {}));
/**
 * Tracker for primitive token fallback usage patterns
 */
class PrimitiveTokenFallbackTracker {
    constructor() {
        this.fallbacks = [];
    }
    /**
     * Record a primitive token fallback usage
     */
    recordFallback(fallback) {
        this.fallbacks.push(fallback);
    }
    /**
     * Get usage statistics for primitive token fallbacks
     */
    getStatistics() {
        const totalFallbacks = this.fallbacks.length;
        // Group by reason
        const byReason = new Map();
        for (const fallback of this.fallbacks) {
            byReason.set(fallback.reason, (byReason.get(fallback.reason) || 0) + 1);
        }
        // Group by category
        const byCategory = new Map();
        for (const fallback of this.fallbacks) {
            byCategory.set(fallback.token.category, (byCategory.get(fallback.token.category) || 0) + 1);
        }
        // Group by token
        const byToken = new Map();
        for (const fallback of this.fallbacks) {
            byToken.set(fallback.token.name, (byToken.get(fallback.token.name) || 0) + 1);
        }
        // Get most common fallbacks
        const tokenCounts = Array.from(byToken.entries())
            .map(([token, count]) => ({ token, count }))
            .sort((a, b) => b.count - a.count);
        const mostCommonFallbacks = tokenCounts.slice(0, 10);
        // Identify semantic token opportunities (NO_SEMANTIC_AVAILABLE with high usage)
        const semanticOpportunities = this.fallbacks
            .filter(f => f.reason === FallbackReason.NO_SEMANTIC_AVAILABLE)
            .reduce((acc, fallback) => {
            const existing = acc.find(item => item.token === fallback.token.name);
            if (existing) {
                existing.count++;
            }
            else {
                acc.push({ token: fallback.token.name, count: 1, reason: fallback.reason });
            }
            return acc;
        }, [])
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        return {
            totalFallbacks,
            byReason,
            byCategory,
            byToken,
            mostCommonFallbacks,
            semanticOpportunities
        };
    }
    /**
     * Get feedback on primitive token fallback patterns
     */
    getFeedback() {
        const stats = this.getStatistics();
        const feedback = [];
        if (stats.totalFallbacks === 0) {
            feedback.push('No primitive token fallback usage recorded yet.');
            return feedback;
        }
        // Overall fallback rate feedback
        feedback.push(`Recorded ${stats.totalFallbacks} primitive token fallback usage(s). ` +
            `Consider creating semantic tokens for common patterns.`);
        // Reason-specific feedback
        const noSemanticCount = stats.byReason.get(FallbackReason.NO_SEMANTIC_AVAILABLE) || 0;
        if (noSemanticCount > stats.totalFallbacks * 0.4) {
            feedback.push(`${noSemanticCount} fallback(s) due to missing semantic tokens (${((noSemanticCount / stats.totalFallbacks) * 100).toFixed(1)}%). ` +
                `Review semantic token opportunities below.`);
        }
        const preferenceCount = stats.byReason.get(FallbackReason.DEVELOPER_PREFERENCE) || 0;
        if (preferenceCount > stats.totalFallbacks * 0.3) {
            feedback.push(`${preferenceCount} fallback(s) due to developer preference. ` +
                `Consider promoting semantic token benefits and usage guidelines.`);
        }
        // Semantic token opportunities
        if (stats.semanticOpportunities.length > 0) {
            feedback.push(`Identified ${stats.semanticOpportunities.length} semantic token opportunity(ies):`);
            for (const opportunity of stats.semanticOpportunities) {
                feedback.push(`  - "${opportunity.token}" used ${opportunity.count} time(s) without semantic alternative`);
            }
        }
        // Category-specific feedback
        const categoryEntries = Array.from(stats.byCategory.entries());
        if (categoryEntries.length > 0) {
            const dominantCategory = categoryEntries.reduce((a, b) => a[1] > b[1] ? a : b);
            const dominantPercentage = (dominantCategory[1] / stats.totalFallbacks) * 100;
            if (dominantPercentage > 50) {
                feedback.push(`${dominantCategory[0]} tokens account for ${dominantPercentage.toFixed(1)}% of fallbacks. ` +
                    `Focus semantic token creation efforts on this category.`);
            }
        }
        // Most common fallbacks
        if (stats.mostCommonFallbacks.length > 0) {
            const topFallback = stats.mostCommonFallbacks[0];
            const topPercentage = (topFallback.count / stats.totalFallbacks) * 100;
            if (topPercentage > 20) {
                feedback.push(`Token "${topFallback.token}" is the most common fallback (${topPercentage.toFixed(1)}% of all fallbacks). ` +
                    `Strong candidate for semantic token creation.`);
            }
        }
        return feedback;
    }
    /**
     * Get fallbacks by reason
     */
    getFallbacksByReason(reason) {
        return this.fallbacks.filter(f => f.reason === reason);
    }
    /**
     * Get fallbacks for a specific token
     */
    getFallbacksForToken(tokenName) {
        return this.fallbacks.filter(f => f.token.name === tokenName);
    }
    /**
     * Get fallbacks by category
     */
    getFallbacksByCategory(category) {
        return this.fallbacks.filter(f => f.token.category === category);
    }
    /**
     * Get semantic token creation opportunities
     */
    getSemanticOpportunities() {
        return this.getStatistics().semanticOpportunities;
    }
    /**
     * Clear all recorded fallbacks (useful for testing or resetting)
     */
    clear() {
        this.fallbacks = [];
    }
}
exports.PrimitiveTokenFallbackTracker = PrimitiveTokenFallbackTracker;
//# sourceMappingURL=PrimitiveTokenFallbackTracker.js.map