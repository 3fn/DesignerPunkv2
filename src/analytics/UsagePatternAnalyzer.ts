/**
 * Usage Pattern Analyzer
 * 
 * Aggregates insights from all usage trackers to provide comprehensive analysis
 * of token usage patterns across the design system. Provides pass/fail validation
 * for strategic flexibility usage (≤20% threshold) and informational insights
 * for semantic token adoption and primitive fallback patterns.
 */

import { TokenUsageTracker } from './TokenUsageTracker.js';
import { StrategicFlexibilityTracker } from './StrategicFlexibilityTracker.js';
import { SemanticTokenUsageTracker } from './SemanticTokenUsageTracker.js';
import { PrimitiveTokenFallbackTracker } from './PrimitiveTokenFallbackTracker.js';

/**
 * Overall usage pattern analysis results
 */
export interface UsagePatternAnalysis {
  overallUsage: {
    totalUsages: number;
    primitiveUsages: number;
    semanticUsages: number;
    strategicFlexibilityUsages: number;
  };
  strategicFlexibility: {
    usageRate: number;            // SF usages / total usages
    meetsThreshold: boolean;      // PASS/FAIL: ≤20%
    status: 'PASS' | 'FAIL';
    feedback: string[];
    // Informational appropriateness data
    appropriatenessRate: number;
    appropriateUsages: number;
    questionableUsages: number;
    inappropriateUsages: number;
  };
  insights: {
    semanticTokens: {
      adoptionRate: number;
      totalUsages: number;
      feedback: string[];
    };
    primitiveFallbacks: {
      totalFallbacks: number;
      semanticOpportunities: number;
      feedback: string[];
    };
  };
}

/**
 * Analyzer for overall token usage patterns
 */
export class UsagePatternAnalyzer {
  constructor(
    private tokenUsageTracker: TokenUsageTracker,
    private strategicFlexibilityTracker: StrategicFlexibilityTracker,
    private semanticTokenUsageTracker: SemanticTokenUsageTracker,
    private primitiveTokenFallbackTracker: PrimitiveTokenFallbackTracker
  ) {}

  /**
   * Analyze overall usage patterns across all trackers
   */
  analyze(): UsagePatternAnalysis {
    // Get overall usage statistics
    const overallStats = this.tokenUsageTracker.getStatistics();
    const totalTokenUsages = overallStats.totalUsages;

    // Get strategic flexibility statistics (with total usage count)
    const sfStats = this.strategicFlexibilityTracker.getStatistics(totalTokenUsages);
    const sfFeedback = this.strategicFlexibilityTracker.getFeedback(totalTokenUsages);

    // Get semantic token statistics (informational)
    const semanticStats = this.semanticTokenUsageTracker.getStatistics();
    const semanticFeedback = this.semanticTokenUsageTracker.getFeedback();

    // Get fallback statistics (informational)
    const fallbackStats = this.primitiveTokenFallbackTracker.getStatistics();
    const fallbackFeedback = this.primitiveTokenFallbackTracker.getFeedback();

    // Calculate semantic adoption rate (informational)
    const adoptionRate = totalTokenUsages > 0 
      ? semanticStats.totalUsages / totalTokenUsages 
      : 0;

    return {
      overallUsage: {
        totalUsages: overallStats.totalUsages,
        primitiveUsages: overallStats.primitiveUsages,
        semanticUsages: overallStats.semanticUsages,
        strategicFlexibilityUsages: overallStats.strategicFlexibilityUsages
      },
      strategicFlexibility: {
        usageRate: sfStats.usageRate,
        meetsThreshold: sfStats.meetsThreshold,
        status: sfStats.meetsThreshold ? 'PASS' : 'FAIL',
        feedback: sfFeedback,
        // Informational appropriateness data
        appropriatenessRate: sfStats.appropriatenessRate,
        appropriateUsages: sfStats.appropriateUsages,
        questionableUsages: sfStats.questionableUsages,
        inappropriateUsages: sfStats.inappropriateUsages
      },
      insights: {
        semanticTokens: {
          adoptionRate,
          totalUsages: semanticStats.totalUsages,
          feedback: semanticFeedback
        },
        primitiveFallbacks: {
          totalFallbacks: fallbackStats.totalFallbacks,
          semanticOpportunities: fallbackStats.semanticOpportunities.length,
          feedback: fallbackFeedback
        }
      }
    };
  }



  /**
   * Generate a comprehensive usage report
   */
  generateReport(): string {
    const analysis = this.analyze();
    const lines: string[] = [];

    lines.push('=== Token Usage Pattern Analysis Report ===\n');

    // Overall usage statistics
    lines.push('--- Overall Token Usage ---');
    lines.push(`Total Token Usages: ${analysis.overallUsage.totalUsages}`);
    lines.push(`  - Primitive Tokens: ${analysis.overallUsage.primitiveUsages}`);
    lines.push(`  - Semantic Tokens: ${analysis.overallUsage.semanticUsages}`);
    lines.push(`  - Strategic Flexibility: ${analysis.overallUsage.strategicFlexibilityUsages}`);
    lines.push('');

    // Strategic flexibility (PASS/FAIL)
    lines.push('--- Strategic Flexibility Validation ---');
    lines.push(`Status: ${analysis.strategicFlexibility.status}`);
    lines.push(`Usage Rate: ${(analysis.strategicFlexibility.usageRate * 100).toFixed(1)}% (threshold: ≤20%)`);
    lines.push(`Meets Threshold: ${analysis.strategicFlexibility.meetsThreshold ? 'YES ✅' : 'NO ❌'}`);
    lines.push('');
    lines.push('Appropriateness Breakdown (Informational):');
    lines.push(`  - Appropriate: ${analysis.strategicFlexibility.appropriateUsages}`);
    lines.push(`  - Questionable: ${analysis.strategicFlexibility.questionableUsages}`);
    lines.push(`  - Inappropriate: ${analysis.strategicFlexibility.inappropriateUsages}`);
    lines.push(`  - Appropriateness Rate: ${(analysis.strategicFlexibility.appropriatenessRate * 100).toFixed(1)}%`);
    if (analysis.strategicFlexibility.feedback.length > 0) {
      lines.push('');
      lines.push('Feedback:');
      analysis.strategicFlexibility.feedback.forEach(f => lines.push(`  ${f}`));
    }
    lines.push('');

    // Semantic tokens (informational)
    lines.push('--- Semantic Token Insights ---');
    lines.push(`Adoption Rate: ${(analysis.insights.semanticTokens.adoptionRate * 100).toFixed(1)}%`);
    lines.push(`Total Usages: ${analysis.insights.semanticTokens.totalUsages}`);
    if (analysis.insights.semanticTokens.feedback.length > 0) {
      lines.push('Feedback:');
      analysis.insights.semanticTokens.feedback.forEach(f => lines.push(`  - ${f}`));
    }
    lines.push('');

    // Primitive fallbacks (informational)
    lines.push('--- Primitive Token Fallback Insights ---');
    lines.push(`Total Fallbacks: ${analysis.insights.primitiveFallbacks.totalFallbacks}`);
    lines.push(`Semantic Opportunities: ${analysis.insights.primitiveFallbacks.semanticOpportunities}`);
    if (analysis.insights.primitiveFallbacks.feedback.length > 0) {
      lines.push('Feedback:');
      analysis.insights.primitiveFallbacks.feedback.forEach(f => lines.push(`  - ${f}`));
    }

    return lines.join('\n');
  }
}
