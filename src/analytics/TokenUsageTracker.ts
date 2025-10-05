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
export enum TokenType {
    PRIMITIVE = 'primitive',
    SEMANTIC = 'semantic'
}

/**
 * Individual token usage record
 */
export interface TokenUsage {
    tokenName: string;
    tokenType: TokenType;
    isStrategicFlexibility: boolean;
    category: TokenCategory | SemanticCategory;
    location: string;  // File path or component identifier
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
    strategicFlexibilityRate: number;  // SF usages / total usages
    byCategory: Map<TokenCategory | SemanticCategory, number>;
    byToken: Map<string, number>;
    mostUsedTokens: Array<{ token: string; count: number }>;
}

/**
 * Tracker for all token usages across the system
 */
export class TokenUsageTracker {
    private usages: TokenUsage[] = [];

    /**
     * Record a primitive token usage
     */
    recordPrimitiveUsage(
        token: PrimitiveToken,
        location: string,
        timestamp: Date = new Date()
    ): void {
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
    recordSemanticUsage(
        token: SemanticToken,
        location: string,
        timestamp: Date = new Date()
    ): void {
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
    getStatistics(): TokenUsageStats {
        const totalUsages = this.usages.length;
        const primitiveUsages = this.usages.filter(u => u.tokenType === TokenType.PRIMITIVE).length;
        const semanticUsages = this.usages.filter(u => u.tokenType === TokenType.SEMANTIC).length;
        const strategicFlexibilityUsages = this.usages.filter(u => u.isStrategicFlexibility).length;

        const strategicFlexibilityRate = totalUsages > 0
            ? strategicFlexibilityUsages / totalUsages
            : 0;

        // Group by category
        const byCategory = new Map<TokenCategory | SemanticCategory, number>();
        for (const usage of this.usages) {
            byCategory.set(usage.category, (byCategory.get(usage.category) || 0) + 1);
        }

        // Group by token
        const byToken = new Map<string, number>();
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
    getUsagesForToken(tokenName: string): TokenUsage[] {
        return this.usages.filter(u => u.tokenName === tokenName);
    }

    /**
     * Get all strategic flexibility usages
     */
    getStrategicFlexibilityUsages(): TokenUsage[] {
        return this.usages.filter(u => u.isStrategicFlexibility);
    }

    /**
     * Get usages by token type
     */
    getUsagesByType(type: TokenType): TokenUsage[] {
        return this.usages.filter(u => u.tokenType === type);
    }

    /**
     * Get usages by category
     */
    getUsagesByCategory(category: TokenCategory | SemanticCategory): TokenUsage[] {
        return this.usages.filter(u => u.category === category);
    }

    /**
     * Clear all recorded usages (useful for testing or resetting)
     */
    clear(): void {
        this.usages = [];
    }

    /**
     * Get total usage count
     */
    getTotalUsages(): number {
        return this.usages.length;
    }
}
