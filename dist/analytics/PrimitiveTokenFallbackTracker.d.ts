/**
 * Primitive Token Fallback Tracker
 *
 * Tracks instances where primitive tokens are used directly instead of semantic tokens.
 * This helps identify opportunities for creating new semantic tokens based on common
 * primitive token usage patterns and promotes semantic token adoption.
 */
import type { PrimitiveToken } from '../types/PrimitiveToken.js';
import { TokenCategory } from '../types/PrimitiveToken.js';
/**
 * Reason for using primitive token instead of semantic token
 */
export declare enum FallbackReason {
    NO_SEMANTIC_AVAILABLE = "no-semantic-available",// No appropriate semantic token exists
    SEMANTIC_NOT_SUITABLE = "semantic-not-suitable",// Semantic token doesn't fit use case
    DEVELOPER_PREFERENCE = "developer-preference",// Developer chose primitive over semantic
    PROTOTYPING = "prototyping",// Rapid prototyping phase
    UNKNOWN = "unknown"
}
/**
 * Individual primitive token fallback usage record
 */
export interface PrimitiveTokenFallback {
    token: PrimitiveToken;
    reason: FallbackReason;
    location: string;
    timestamp: Date;
    suggestedSemanticToken?: string;
    notes?: string;
}
/**
 * Usage statistics for primitive token fallbacks
 */
export interface PrimitiveTokenFallbackStats {
    totalFallbacks: number;
    byReason: Map<FallbackReason, number>;
    byCategory: Map<TokenCategory, number>;
    byToken: Map<string, number>;
    mostCommonFallbacks: Array<{
        token: string;
        count: number;
    }>;
    semanticOpportunities: Array<{
        token: string;
        count: number;
        reason: FallbackReason;
    }>;
}
/**
 * Tracker for primitive token fallback usage patterns
 */
export declare class PrimitiveTokenFallbackTracker {
    private fallbacks;
    /**
     * Record a primitive token fallback usage
     */
    recordFallback(fallback: PrimitiveTokenFallback): void;
    /**
     * Get usage statistics for primitive token fallbacks
     */
    getStatistics(): PrimitiveTokenFallbackStats;
    /**
     * Get feedback on primitive token fallback patterns
     */
    getFeedback(): string[];
    /**
     * Get fallbacks by reason
     */
    getFallbacksByReason(reason: FallbackReason): PrimitiveTokenFallback[];
    /**
     * Get fallbacks for a specific token
     */
    getFallbacksForToken(tokenName: string): PrimitiveTokenFallback[];
    /**
     * Get fallbacks by category
     */
    getFallbacksByCategory(category: TokenCategory): PrimitiveTokenFallback[];
    /**
     * Get semantic token creation opportunities
     */
    getSemanticOpportunities(): Array<{
        token: string;
        count: number;
        reason: FallbackReason;
    }>;
    /**
     * Clear all recorded fallbacks (useful for testing or resetting)
     */
    clear(): void;
}
//# sourceMappingURL=PrimitiveTokenFallbackTracker.d.ts.map