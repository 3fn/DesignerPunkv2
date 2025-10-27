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
import type { PrimitiveToken } from '../types/PrimitiveToken.js';
/**
 * Usage context for strategic flexibility token usage
 */
export declare enum UsageContext {
    COMPONENT_INTERNAL = "component-internal",// Within component boundaries
    LAYOUT_SPACING = "layout-spacing",// Between layout elements
    TYPOGRAPHY_ADJUSTMENT = "typography-adjustment",// Typography fine-tuning
    ACCESSIBILITY_TARGET = "accessibility-target",// Accessibility requirements
    VISUAL_BALANCE = "visual-balance",// Visual design balance
    UNKNOWN = "unknown"
}
/**
 * Appropriateness assessment for strategic flexibility usage (informational)
 */
export declare enum UsageAppropriateness {
    APPROPRIATE = "appropriate",// Correct usage of strategic flexibility
    QUESTIONABLE = "questionable",// Potentially inappropriate usage
    INAPPROPRIATE = "inappropriate"
}
/**
 * Individual usage record for strategic flexibility token
 */
export interface StrategicFlexibilityUsage {
    token: PrimitiveToken;
    context: UsageContext;
    appropriateness: UsageAppropriateness;
    location: string;
    timestamp: Date;
    rationale?: string;
}
/**
 * Usage statistics for strategic flexibility tokens
 */
export interface StrategicFlexibilityStats {
    totalUsages: number;
    totalTokenUsages: number;
    usageRate: number;
    meetsThreshold: boolean;
    appropriateUsages: number;
    questionableUsages: number;
    inappropriateUsages: number;
    appropriatenessRate: number;
    byContext: Map<UsageContext, number>;
    byToken: Map<string, number>;
}
/**
 * Tracker for strategic flexibility token usage patterns
 */
export declare class StrategicFlexibilityTracker {
    private usages;
    private readonly USAGE_RATE_THRESHOLD;
    /**
     * Record a usage of a strategic flexibility token
     */
    recordUsage(usage: StrategicFlexibilityUsage): void;
    /**
     * Get usage statistics for strategic flexibility tokens
     * Requires total token usage count to calculate usage rate
     */
    getStatistics(totalTokenUsages: number): StrategicFlexibilityStats;
    /**
     * Get feedback on strategic flexibility usage patterns
     * Requires total token usage count to provide accurate feedback
     */
    getFeedback(totalTokenUsages: number): string[];
    /**
     * Get usages filtered by appropriateness level
     */
    getUsagesByAppropriateness(level: UsageAppropriateness): StrategicFlexibilityUsage[];
    /**
     * Get usages for a specific token
     */
    getUsagesForToken(tokenName: string): StrategicFlexibilityUsage[];
    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear(): void;
    /**
     * Get the usage rate threshold (20%)
     */
    getThreshold(): number;
    /**
     * Check if usage rate meets threshold (≤20%)
     */
    meetsThreshold(totalTokenUsages: number): boolean;
}
//# sourceMappingURL=StrategicFlexibilityTracker.d.ts.map