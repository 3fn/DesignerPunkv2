/**
 * Semantic Token Usage Tracker
 *
 * Tracks usage patterns of semantic tokens to provide insights into semantic token
 * adoption and identify opportunities for creating new semantic tokens based on
 * common primitive token usage patterns.
 */
import type { SemanticToken } from '../types/SemanticToken.js';
import { SemanticCategory } from '../types/SemanticToken.js';
/**
 * Individual semantic token usage record
 */
export interface SemanticTokenUsage {
    token: SemanticToken;
    location: string;
    timestamp: Date;
    context?: string;
}
/**
 * Usage statistics for semantic tokens
 */
export interface SemanticTokenStats {
    totalUsages: number;
    uniqueTokensUsed: number;
    byCategory: Map<SemanticCategory, number>;
    byToken: Map<string, number>;
    mostUsedTokens: Array<{
        token: string;
        count: number;
    }>;
    leastUsedTokens: Array<{
        token: string;
        count: number;
    }>;
}
/**
 * Tracker for semantic token usage patterns
 */
export declare class SemanticTokenUsageTracker {
    private usages;
    private availableTokens;
    /**
     * Register available semantic tokens for tracking
     */
    registerAvailableToken(tokenName: string): void;
    /**
     * Record a usage of a semantic token
     */
    recordUsage(usage: SemanticTokenUsage): void;
    /**
     * Get usage statistics for semantic tokens
     */
    getStatistics(): SemanticTokenStats;
    /**
     * Get feedback on semantic token usage patterns
     */
    getFeedback(): string[];
    /**
     * Get usages for a specific semantic token
     */
    getUsagesForToken(tokenName: string): SemanticTokenUsage[];
    /**
     * Get usages by category
     */
    getUsagesByCategory(category: SemanticCategory): SemanticTokenUsage[];
    /**
     * Get unused semantic tokens
     */
    getUnusedTokens(): string[];
    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear(): void;
    /**
     * Clear available tokens registry
     */
    clearAvailableTokens(): void;
}
//# sourceMappingURL=SemanticTokenUsageTracker.d.ts.map