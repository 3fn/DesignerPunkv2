/**
 * Strategic Flexibility Tracker
 * 
 * Monitors usage patterns of strategic flexibility tokens to ensure ≥80% appropriate usage.
 * Strategic flexibility tokens are mathematically derived exceptions that break systematic
 * progression within their token families (e.g., space075 = 6).
 * 
 * The tracker maintains usage statistics and provides feedback when usage patterns
 * fall below the 80% appropriate usage threshold.
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
 * Appropriateness assessment for strategic flexibility usage
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
  appropriateUsages: number;
  questionableUsages: number;
  inappropriateUsages: number;
  appropriatenessRate: number;  // Percentage of appropriate usages
  meetsThreshold: boolean;      // Whether ≥80% threshold is met
  byContext: Map<UsageContext, number>;
  byToken: Map<string, number>;
}

/**
 * Tracker for strategic flexibility token usage patterns
 */
export class StrategicFlexibilityTracker {
  private usages: StrategicFlexibilityUsage[] = [];
  private readonly APPROPRIATENESS_THRESHOLD = 0.80;  // 80% threshold

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
   */
  getStatistics(): StrategicFlexibilityStats {
    const totalUsages = this.usages.length;
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
    const meetsThreshold = appropriatenessRate >= this.APPROPRIATENESS_THRESHOLD;

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
      appropriateUsages,
      questionableUsages,
      inappropriateUsages,
      appropriatenessRate,
      meetsThreshold,
      byContext,
      byToken
    };
  }

  /**
   * Get feedback on strategic flexibility usage patterns
   */
  getFeedback(): string[] {
    const stats = this.getStatistics();
    const feedback: string[] = [];

    if (!stats.meetsThreshold) {
      feedback.push(
        `Strategic flexibility usage is below 80% threshold (${(stats.appropriatenessRate * 100).toFixed(1)}%). ` +
        `Consider using semantic tokens for common use cases.`
      );
    }

    if (stats.inappropriateUsages > 0) {
      feedback.push(
        `Found ${stats.inappropriateUsages} inappropriate usage(s) of strategic flexibility tokens. ` +
        `Review these usages and consider semantic token alternatives.`
      );
    }

    if (stats.questionableUsages > stats.appropriateUsages) {
      feedback.push(
        `Questionable usages (${stats.questionableUsages}) exceed appropriate usages (${stats.appropriateUsages}). ` +
        `Review usage patterns and ensure strategic flexibility is used for exceptional cases only.`
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

    if (stats.totalUsages === 0) {
      feedback.push('No strategic flexibility token usage recorded yet.');
    } else if (stats.meetsThreshold && stats.inappropriateUsages === 0) {
      feedback.push(
        `Strategic flexibility usage is healthy (${(stats.appropriatenessRate * 100).toFixed(1)}% appropriate). ` +
        `Continue using strategic flexibility for exceptional cases.`
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
   * Get the appropriateness threshold (80%)
   */
  getThreshold(): number {
    return this.APPROPRIATENESS_THRESHOLD;
  }
}
