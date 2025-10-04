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
export enum UsageContext {
  COMPONENT_INTERNAL = 'component-internal',  // Within component boundaries
  LAYOUT_SPACING = 'layout-spacing',          // Between layout elements
  TYPOGRAPHY_ADJUSTMENT = 'typography-adjustment', // Typography fine-tuning
  ACCESSIBILITY_TARGET = 'accessibility-target',   // Accessibility requirements
  VISUAL_BALANCE = 'visual-balance',          // Visual design balance
  UNKNOWN = 'unknown'                         // Context not specified
}

/**
 * Appropriateness assessment for strategic flexibility usage (informational)
 */
export enum UsageAppropriateness {
  APPROPRIATE = 'appropriate',      // Correct usage of strategic flexibility
  QUESTIONABLE = 'questionable',    // Potentially inappropriate usage
  INAPPROPRIATE = 'inappropriate'   // Clear misuse of strategic flexibility
}

/**
 * Individual usage record for strategic flexibility token
 */
export interface StrategicFlexibilityUsage {
  token: PrimitiveToken;
  context: UsageContext;
  appropriateness: UsageAppropriateness;
  location: string;  // File path or component identifier
  timestamp: Date;
  rationale?: string;  // Optional explanation for usage
}

/**
 * Usage statistics for strategic flexibility tokens
 */
export interface StrategicFlexibilityStats {
  totalUsages: number;
  totalTokenUsages: number;         // Total usages across all tokens
  usageRate: number;                // SF usages / total usages
  meetsThreshold: boolean;          // Whether ≤20% threshold is met
  appropriateUsages: number;        // Informational
  questionableUsages: number;       // Informational
  inappropriateUsages: number;      // Informational
  appropriatenessRate: number;      // Informational
  byContext: Map<UsageContext, number>;
  byToken: Map<string, number>;
}

/**
 * Tracker for strategic flexibility token usage patterns
 */
export class StrategicFlexibilityTracker {
  private usages: StrategicFlexibilityUsage[] = [];
  private readonly USAGE_RATE_THRESHOLD = 0.20;  // 20% threshold (SF should be ≤20% of total)

  /**
   * Record a usage of a strategic flexibility token
   */
  recordUsage(usage: StrategicFlexibilityUsage): void {
    if (!usage.token.isStrategicFlexibility) {
      throw new Error(`Token ${usage.token.name} is not a strategic flexibility token`);
    }
    this.usages.push(usage);
  }

  /**
   * Get usage statistics for strategic flexibility tokens
   * Requires total token usage count to calculate usage rate
   */
  getStatistics(totalTokenUsages: number): StrategicFlexibilityStats {
    const totalUsages = this.usages.length;
    const usageRate = totalTokenUsages > 0 ? totalUsages / totalTokenUsages : 0;
    const meetsThreshold = usageRate <= this.USAGE_RATE_THRESHOLD;

    // Appropriateness tracking (informational)
    const appropriateUsages = this.usages.filter(
      u => u.appropriateness === UsageAppropriateness.APPROPRIATE
    ).length;
    const questionableUsages = this.usages.filter(
      u => u.appropriateness === UsageAppropriateness.QUESTIONABLE
    ).length;
    const inappropriateUsages = this.usages.filter(
      u => u.appropriateness === UsageAppropriateness.INAPPROPRIATE
    ).length;

    const appropriatenessRate = totalUsages > 0 ? appropriateUsages / totalUsages : 1.0;

    // Group by context
    const byContext = new Map<UsageContext, number>();
    for (const usage of this.usages) {
      byContext.set(usage.context, (byContext.get(usage.context) || 0) + 1);
    }

    // Group by token
    const byToken = new Map<string, number>();
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
  getFeedback(totalTokenUsages: number): string[] {
    const stats = this.getStatistics(totalTokenUsages);
    const feedback: string[] = [];

    if (stats.totalUsages === 0) {
      feedback.push('No strategic flexibility token usage recorded yet.');
      return feedback;
    }

    // Primary threshold check (PASS/FAIL)
    if (!stats.meetsThreshold) {
      feedback.push(
        `⚠️ FAIL: Strategic flexibility usage exceeds 20% threshold (${(stats.usageRate * 100).toFixed(1)}%). ` +
        `Strategic flexibility tokens should be exceptional, not common. ` +
        `Review usage patterns and consider using regular tokens or creating semantic alternatives.`
      );
    } else {
      feedback.push(
        `✅ PASS: Strategic flexibility usage is within threshold (${(stats.usageRate * 100).toFixed(1)}% ≤ 20%). ` +
        `Strategic flexibility tokens are being used as exceptions.`
      );
    }

    // Informational appropriateness feedback
    if (stats.inappropriateUsages > 0) {
      feedback.push(
        `Found ${stats.inappropriateUsages} inappropriate usage(s) of strategic flexibility tokens. ` +
        `Review these usages and consider alternatives.`
      );
    }

    if (stats.questionableUsages > stats.appropriateUsages) {
      feedback.push(
        `Questionable usages (${stats.questionableUsages}) exceed appropriate usages (${stats.appropriateUsages}). ` +
        `Review usage patterns to ensure strategic flexibility is used correctly.`
      );
    }

    // Context-specific feedback
    const layoutUsages = stats.byContext.get(UsageContext.LAYOUT_SPACING) || 0;
    if (layoutUsages > stats.totalUsages * 0.3) {
      feedback.push(
        `High usage of strategic flexibility in layout spacing (${layoutUsages} usages). ` +
        `Consider creating semantic layout tokens for common spacing patterns.`
      );
    }

    // Positive reinforcement
    if (stats.meetsThreshold && stats.inappropriateUsages === 0 && stats.appropriatenessRate > 0.8) {
      feedback.push(
        `Strategic flexibility usage is excellent (${(stats.appropriatenessRate * 100).toFixed(1)}% appropriate). ` +
        `Continue using strategic flexibility for exceptional cases only.`
      );
    }

    return feedback;
  }

  /**
   * Get usages filtered by appropriateness level
   */
  getUsagesByAppropriateness(level: UsageAppropriateness): StrategicFlexibilityUsage[] {
    return this.usages.filter(u => u.appropriateness === level);
  }

  /**
   * Get usages for a specific token
   */
  getUsagesForToken(tokenName: string): StrategicFlexibilityUsage[] {
    return this.usages.filter(u => u.token.name === tokenName);
  }

  /**
   * Clear all recorded usages (useful for testing or resetting)
   */
  clear(): void {
    this.usages = [];
  }

  /**
   * Get the usage rate threshold (20%)
   */
  getThreshold(): number {
    return this.USAGE_RATE_THRESHOLD;
  }

  /**
   * Check if usage rate meets threshold (≤20%)
   */
  meetsThreshold(totalTokenUsages: number): boolean {
    const stats = this.getStatistics(totalTokenUsages);
    return stats.meetsThreshold;
  }
}
