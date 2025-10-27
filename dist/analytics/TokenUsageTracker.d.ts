/**
 * Token Usage Tracker
 *
 * Tracks all token usages across the system to provide baseline metrics
 * for calculating strategic flexibility usage rates and overall token adoption.
 */
import type { PrimitiveToken } from '../types/PrimitiveToken.js';
import type { SemanticToken } from '../types/SemanticToken.js';
import { TokenCategory } from '../types/PrimitiveToken.js';
import { SemanticCategory } from '../types/SemanticToken.js';
/**
 * Token type for usage tracking
 */
export declare enum TokenType {
    PRIMITIVE = "primitive",
    SEMANTIC = "semantic"
}
/**
 * Individual token usage record
 */
export interface TokenUsage {
    tokenName: string;
    tokenType: TokenType;
    isStrategicFlexibility: boolean;
    category: TokenCategory | SemanticCategory;
    location: string;
    timestamp: Date;
}
/**
 * Overall token usage statistics
 */
export interface TokenUsageStats {
    totalUsages: number;
    primitiveUsages: number;
    semanticUsages: number;
    strategicFlexibilityUsages: number;
    strategicFlexibilityRate: number;
    byCategory: Map<TokenCategory | SemanticCategory, number>;
    byToken: Map<string, number>;
    mostUsedTokens: Array<{
        token: string;
        count: number;
    }>;
}
/**
 * Tracker for all token usages across the system
 */
export declare class TokenUsageTracker {
    private usages;
    /**
     * Record a primitive token usage
     */
    recordPrimitiveUsage(token: PrimitiveToken, location: string, timestamp?: Date): void;
    /**
     * Record a semantic token usage
     */
    recordSemanticUsage(token: SemanticToken, location: string, timestamp?: Date): void;
    /**
     * Get overall token usage statistics
     */
    getStatistics(): TokenUsageStats;
    /**
     * Get all usages for a specific token
     */
    getUsagesForToken(tokenName: string): TokenUsage[];
    /**
     * Get all strategic flexibility usages
     */
    getStrategicFlexibilityUsages(): TokenUsage[];
    /**
     * Get usages by token type
     */
    getUsagesByType(type: TokenType): TokenUsage[];
    /**
     * Get usages by category
     */
    getUsagesByCategory(category: TokenCategory | SemanticCategory): TokenUsage[];
    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear(): void;
    /**
     * Get total usage count
     */
    getTotalUsages(): number;
}
//# sourceMappingURL=TokenUsageTracker.d.ts.map