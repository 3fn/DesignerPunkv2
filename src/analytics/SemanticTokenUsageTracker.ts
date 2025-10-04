/**
 * Semantic Token Usage Tracker
 * 
 * Tracks usage patterns of semantic tokens to provide insights into semantic token
 * adoption and identify opportunities for creating new semantic tokens based on
 * common primitive token usage patterns.
 */

import type { SemanticToken } from '../types/SemanticToken.js';
import type { PrimitiveToken } from '../types/PrimitiveToken.js';
import { SemanticCategory } from '../types/SemanticToken.js';

/**
 * Individual semantic token usage record
 */
export interface SemanticTokenUsage {
  token: SemanticToken;
  location: string;  // File path or component identifier
  timestamp: Date;
  context?: string;  // Optional usage context
}

/**
 * Usage statistics for semantic tokens
 */
export interface SemanticTokenStats {
  totalUsages: number;
  uniqueTokensUsed: number;
  byCategory: Map<SemanticCategory, number>;
  byToken: Map<string, number>;
  mostUsedTokens: Array<{ token: string; count: number }>;
  leastUsedTokens: Array<{ token: string; count: number }>;
}

/**
 * Tracker for semantic token usage patterns
 */
export class SemanticTokenUsageTracker {
  private usages: SemanticTokenUsage[] = [];
  private availableTokens: Set<string> = new Set();

  /**
   * Register available semantic tokens for tracking
   */
  registerAvailableToken(tokenName: string): void {
    this.availableTokens.add(tokenName);
  }

  /**
   * Record a usage of a semantic token
   */
  recordUsage(usage: SemanticTokenUsage): void {
    this.usages.push(usage);
    this.availableTokens.add(usage.token.name);
  }

  /**
   * Get usage statistics for semantic tokens
   */
  getStatistics(): SemanticTokenStats {
    const totalUsages = this.usages.length;
    const uniqueTokensUsed = new Set(this.usages.map(u => u.token.name)).size;

    // Group by category
    const byCategory = new Map<SemanticCategory, number>();
    for (const usage of this.usages) {
      byCategory.set(usage.token.category, (byCategory.get(usage.token.category) || 0) + 1);
    }

    // Group by token
    const byToken = new Map<string, number>();
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
  getFeedback(): string[] {
    const stats = this.getStatistics();
    const feedback: string[] = [];

    if (stats.totalUsages === 0) {
      feedback.push('No semantic token usage recorded yet.');
      return feedback;
    }

    // Adoption rate feedback
    const adoptionRate = stats.uniqueTokensUsed / this.availableTokens.size;
    if (adoptionRate < 0.5) {
      feedback.push(
        `Low semantic token adoption (${(adoptionRate * 100).toFixed(1)}% of available tokens used). ` +
        `Consider promoting semantic token usage over primitive tokens.`
      );
    } else if (adoptionRate > 0.8) {
      feedback.push(
        `Excellent semantic token adoption (${(adoptionRate * 100).toFixed(1)}% of available tokens used).`
      );
    }

    // Category distribution feedback
    const categoryEntries = Array.from(stats.byCategory.entries());
    if (categoryEntries.length > 0) {
      const dominantCategory = categoryEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      const dominantPercentage = (dominantCategory[1] / stats.totalUsages) * 100;
      
      if (dominantPercentage > 60) {
        feedback.push(
          `${dominantCategory[0]} tokens dominate usage (${dominantPercentage.toFixed(1)}%). ` +
          `Consider expanding semantic tokens in other categories.`
        );
      }
    }

    // Unused tokens feedback
    const unusedTokens = this.availableTokens.size - stats.uniqueTokensUsed;
    if (unusedTokens > 0) {
      feedback.push(
        `${unusedTokens} semantic token(s) are not being used. ` +
        `Review whether these tokens are needed or if they should be promoted.`
      );
    }

    // Most used tokens feedback
    if (stats.mostUsedTokens.length > 0) {
      const topToken = stats.mostUsedTokens[0];
      const topTokenPercentage = (topToken.count / stats.totalUsages) * 100;
      
      if (topTokenPercentage > 30) {
        feedback.push(
          `Token "${topToken.token}" is heavily used (${topTokenPercentage.toFixed(1)}% of all usages). ` +
          `This indicates a strong semantic pattern.`
        );
      }
    }

    return feedback;
  }

  /**
   * Get usages for a specific semantic token
   */
  getUsagesForToken(tokenName: string): SemanticTokenUsage[] {
    return this.usages.filter(u => u.token.name === tokenName);
  }

  /**
   * Get usages by category
   */
  getUsagesByCategory(category: SemanticCategory): SemanticTokenUsage[] {
    return this.usages.filter(u => u.token.category === category);
  }

  /**
   * Get unused semantic tokens
   */
  getUnusedTokens(): string[] {
    const usedTokens = new Set(this.usages.map(u => u.token.name));
    return Array.from(this.availableTokens).filter(token => !usedTokens.has(token));
  }

  /**
   * Clear all recorded usages (useful for testing or resetting)
   */
  clear(): void {
    this.usages = [];
  }

  /**
   * Clear available tokens registry
   */
  clearAvailableTokens(): void {
    this.availableTokens.clear();
  }
}
