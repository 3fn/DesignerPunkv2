"use strict";
/**
 * Strategic Flexibility Tracker
 *
 * Monitors usage patterns of strategic flexibility tokens to ensure they remain
 * exceptional (≤20% of total token usage). Strategic flexibility tokens are
 * mathematically derived exceptions that break systematic progression within
 * their token families (e.g., space075 = 6).
 *
 * The tracker validates that strategic flexibility tokens are used sparingly
 * and provides insights into appropriateness of individual usages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategicFlexibilityTracker = exports.UsageAppropriateness = exports.UsageContext = void 0;
/**
 * Usage context for strategic flexibility token usage
 */
var UsageContext;
(function (UsageContext) {
    UsageContext["COMPONENT_INTERNAL"] = "component-internal";
    UsageContext["LAYOUT_SPACING"] = "layout-spacing";
    UsageContext["TYPOGRAPHY_ADJUSTMENT"] = "typography-adjustment";
    UsageContext["ACCESSIBILITY_TARGET"] = "accessibility-target";
    UsageContext["VISUAL_BALANCE"] = "visual-balance";
    UsageContext["UNKNOWN"] = "unknown"; // Context not specified
})(UsageContext || (exports.UsageContext = UsageContext = {}));
/**
 * Appropriateness assessment for strategic flexibility usage (informational)
 */
var UsageAppropriateness;
(function (UsageAppropriateness) {
    UsageAppropriateness["APPROPRIATE"] = "appropriate";
    UsageAppropriateness["QUESTIONABLE"] = "questionable";
    UsageAppropriateness["INAPPROPRIATE"] = "inappropriate"; // Clear misuse of strategic flexibility
})(UsageAppropriateness || (exports.UsageAppropriateness = UsageAppropriateness = {}));
/**
 * Tracker for strategic flexibility token usage patterns
 */
class StrategicFlexibilityTracker {
    constructor() {
        this.usages = [];
        this.USAGE_RATE_THRESHOLD = 0.20; // 20% threshold (SF should be ≤20% of total)
    }
    /**
     * Record a usage of a strategic flexibility token
     */
    recordUsage(usage) {
        if (!usage.token.isStrategicFlexibility) {
            throw new Error(`Token ${usage.token.name} is not a strategic flexibility token`);
        }
        this.usages.push(usage);
    }
    /**
     * Get usage statistics for strategic flexibility tokens
     * Requires total token usage count to calculate usage rate
     */
    getStatistics(totalTokenUsages) {
        const totalUsages = this.usages.length;
        const usageRate = totalTokenUsages > 0 ? totalUsages / totalTokenUsages : 0;
        const meetsThreshold = usageRate <= this.USAGE_RATE_THRESHOLD;
        // Appropriateness tracking (informational)
        const appropriateUsages = this.usages.filter(u => u.appropriateness === UsageAppropriateness.APPROPRIATE).length;
        const questionableUsages = this.usages.filter(u => u.appropriateness === UsageAppropriateness.QUESTIONABLE).length;
        const inappropriateUsages = this.usages.filter(u => u.appropriateness === UsageAppropriateness.INAPPROPRIATE).length;
        const appropriatenessRate = totalUsages > 0 ? appropriateUsages / totalUsages : 1.0;
        // Group by context
        const byContext = new Map();
        for (const usage of this.usages) {
            byContext.set(usage.context, (byContext.get(usage.context) || 0) + 1);
        }
        // Group by token
        const byToken = new Map();
        for (const usage of this.usages) {
            byToken.set(usage.token.name, (byToken.get(usage.token.name) || 0) + 1);
        }
        return {
            totalUsages,
            totalTokenUsages,
            usageRate,
            meetsThreshold,
            appropriateUsages,
            questionableUsages,
            inappropriateUsages,
            appropriatenessRate,
            byContext,
            byToken
        };
    }
    /**
     * Get feedback on strategic flexibility usage patterns
     * Requires total token usage count to provide accurate feedback
     */
    getFeedback(totalTokenUsages) {
        const stats = this.getStatistics(totalTokenUsages);
        const feedback = [];
        if (stats.totalUsages === 0) {
            feedback.push('No strategic flexibility token usage recorded yet.');
            return feedback;
        }
        // Primary threshold check (PASS/FAIL)
        if (!stats.meetsThreshold) {
            feedback.push(`⚠️ FAIL: Strategic flexibility usage exceeds 20% threshold (${(stats.usageRate * 100).toFixed(1)}%). ` +
                `Strategic flexibility tokens should be exceptional, not common. ` +
                `Review usage patterns and consider using regular tokens or creating semantic alternatives.`);
        }
        else {
            feedback.push(`✅ PASS: Strategic flexibility usage is within threshold (${(stats.usageRate * 100).toFixed(1)}% ≤ 20%). ` +
                `Strategic flexibility tokens are being used as exceptions.`);
        }
        // Informational appropriateness feedback
        if (stats.inappropriateUsages > 0) {
            feedback.push(`Found ${stats.inappropriateUsages} inappropriate usage(s) of strategic flexibility tokens. ` +
                `Review these usages and consider alternatives.`);
        }
        if (stats.questionableUsages > stats.appropriateUsages) {
            feedback.push(`Questionable usages (${stats.questionableUsages}) exceed appropriate usages (${stats.appropriateUsages}). ` +
                `Review usage patterns to ensure strategic flexibility is used correctly.`);
        }
        // Context-specific feedback
        const layoutUsages = stats.byContext.get(UsageContext.LAYOUT_SPACING) || 0;
        if (layoutUsages > stats.totalUsages * 0.3) {
            feedback.push(`High usage of strategic flexibility in layout spacing (${layoutUsages} usages). ` +
                `Consider creating semantic layout tokens for common spacing patterns.`);
        }
        // Positive reinforcement
        if (stats.meetsThreshold && stats.inappropriateUsages === 0 && stats.appropriatenessRate > 0.8) {
            feedback.push(`Strategic flexibility usage is excellent (${(stats.appropriatenessRate * 100).toFixed(1)}% appropriate). ` +
                `Continue using strategic flexibility for exceptional cases only.`);
        }
        return feedback;
    }
    /**
     * Get usages filtered by appropriateness level
     */
    getUsagesByAppropriateness(level) {
        return this.usages.filter(u => u.appropriateness === level);
    }
    /**
     * Get usages for a specific token
     */
    getUsagesForToken(tokenName) {
        return this.usages.filter(u => u.token.name === tokenName);
    }
    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear() {
        this.usages = [];
    }
    /**
     * Get the usage rate threshold (20%)
     */
    getThreshold() {
        return this.USAGE_RATE_THRESHOLD;
    }
    /**
     * Check if usage rate meets threshold (≤20%)
     */
    meetsThreshold(totalTokenUsages) {
        const stats = this.getStatistics(totalTokenUsages);
        return stats.meetsThreshold;
    }
}
exports.StrategicFlexibilityTracker = StrategicFlexibilityTracker;
//# sourceMappingURL=StrategicFlexibilityTracker.js.map