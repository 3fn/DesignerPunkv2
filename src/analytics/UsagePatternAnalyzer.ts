/**
 * Usage Pattern Analyzer
 * 
 * Aggregates insights from all usage trackers to provide comprehensive analysis
 * of token usage patterns across the design system. Provides actionable feedback
 * for token system improvement and semantic token creation opportunities.
 */

import { StrategicFlexibilityTracker } from './StrategicFlexibilityTracker.js';
import { SemanticTokenUsageTracker } from './SemanticTokenUsageTracker.js';
import { PrimitiveTokenFallbackTracker } from './PrimitiveTokenFallbackTracker.js';

/**
 * Overall usage pattern analysis results
 */
export interface UsagePatternAnalysis {
  strategicFlexibility: {
    meetsThreshold: boolean;
    appropriatenessRate: number;
    feedback: string[];
  };
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
  overallHealth: {
    score: number;  // 0-100 score
    status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    recommendations: string[];
  };
}

/**
 * Analyzer for overall token usage patterns
 */
export class UsagePatternAnalyzer {
  constructor(
    private strategicFlexibilityTracker: StrategicFlexibilityTracker,
    private semanticTokenUsageTracker: SemanticTokenUsageTracker,
    private primitiveTokenFallbackTracker: PrimitiveTokenFallbackTracker
  ) {}

  /**
   * Analyze overall usage patterns across all trackers
   */
  analyze(): UsagePatternAnalysis {
    const sfStats = this.strategicFlexibilityTracker.getStatistics();
    const sfFeedback = this.strategicFlexibilityTracker.getFeedback();

    const semanticStats = this.semanticTokenUsageTracker.getStatistics();
    const semanticFeedback = this.semanticTokenUsageTracker.getFeedback();

    const fallbackStats = this.primitiveTokenFallbackTracker.getStatistics();
    const fallbackFeedback = this.primitiveTokenFallbackTracker.getFeedback();

    // Calculate adoption rate (semantic usages vs total token usages)
    const totalTokenUsages = semanticStats.totalUsages + fallbackStats.totalFallbacks;
    const adoptionRate = totalTokenUsages > 0 
      ? semanticStats.totalUsages / totalTokenUsages 
      : 0;

    // Calculate overall health score
    const healthScore = this.calculateHealthScore(
      sfStats.meetsThreshold,
      sfStats.appropriatenessRate,
      adoptionRate,
      fallbackStats.totalFallbacks
    );

    const healthStatus = this.getHealthStatus(healthScore);
    const recommendations = this.generateRecommendations(
      sfStats,
      semanticStats,
      fallbackStats,
      adoptionRate
    );

    return {
      strategicFlexibility: {
        meetsThreshold: sfStats.meetsThreshold,
        appropriatenessRate: sfStats.appropriatenessRate,
        feedback: sfFeedback
      },
      semanticTokens: {
        adoptionRate,
        totalUsages: semanticStats.totalUsages,
        feedback: semanticFeedback
      },
      primitiveFallbacks: {
        totalFallbacks: fallbackStats.totalFallbacks,
        semanticOpportunities: fallbackStats.semanticOpportunities.length,
        feedback: fallbackFeedback
      },
      overallHealth: {
        score: healthScore,
        status: healthStatus,
        recommendations
      }
    };
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(
    sfMeetsThreshold: boolean,
    sfAppropriatenessRate: number,
    semanticAdoptionRate: number,
    fallbackCount: number
  ): number {
    let score = 0;

    // Strategic flexibility component (40 points)
    if (sfMeetsThreshold) {
      score += 40;
    } else {
      score += sfAppropriatenessRate * 40;
    }

    // Semantic adoption component (40 points)
    score += semanticAdoptionRate * 40;

    // Fallback penalty component (20 points)
    // Fewer fallbacks = higher score
    if (fallbackCount === 0) {
      score += 20;
    } else if (fallbackCount <= 5) {
      score += 15;
    } else if (fallbackCount <= 10) {
      score += 10;
    } else if (fallbackCount <= 20) {
      score += 5;
    }
    // More than 20 fallbacks = 0 points

    return Math.round(score);
  }

  /**
   * Get health status based on score
   */
  private getHealthStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    sfStats: any,
    semanticStats: any,
    fallbackStats: any,
    adoptionRate: number
  ): string[] {
    const recommendations: string[] = [];

    // Strategic flexibility recommendations
    if (!sfStats.meetsThreshold) {
      recommendations.push(
        'Strategic flexibility usage is below threshold. Review inappropriate usages and ' +
        'create semantic tokens for common patterns.'
      );
    }

    // Semantic adoption recommendations
    if (adoptionRate < 0.6) {
      recommendations.push(
        `Semantic token adoption is low (${(adoptionRate * 100).toFixed(1)}%). ` +
        'Promote semantic token usage through documentation and developer education.'
      );
    }

    // Fallback recommendations
    if (fallbackStats.semanticOpportunities.length > 0) {
      recommendations.push(
        `Identified ${fallbackStats.semanticOpportunities.length} semantic token creation opportunity(ies). ` +
        'Review common primitive token usage patterns and create appropriate semantic tokens.'
      );
    }

    if (fallbackStats.totalFallbacks > 20) {
      recommendations.push(
        'High number of primitive token fallbacks detected. Consider expanding semantic token library ' +
        'to cover more use cases.'
      );
    }

    // Positive reinforcement
    if (sfStats.meetsThreshold && adoptionRate > 0.8 && fallbackStats.totalFallbacks < 5) {
      recommendations.push(
        'Token usage patterns are excellent! Continue following best practices and ' +
        'maintain high semantic token adoption.'
      );
    }

    return recommendations;
  }

  /**
   * Generate a comprehensive usage report
   */
  generateReport(): string {
    const analysis = this.analyze();
    const lines: string[] = [];

    lines.push('=== Token Usage Pattern Analysis Report ===\n');

    // Overall health
    lines.push(`Overall Health: ${analysis.overallHealth.status.toUpperCase()} (Score: ${analysis.overallHealth.score}/100)\n`);

    // Strategic flexibility
    lines.push('--- Strategic Flexibility ---');
    lines.push(`Meets Threshold: ${analysis.strategicFlexibility.meetsThreshold ? 'YES' : 'NO'}`);
    lines.push(`Appropriateness Rate: ${(analysis.strategicFlexibility.appropriatenessRate * 100).toFixed(1)}%`);
    if (analysis.strategicFlexibility.feedback.length > 0) {
      lines.push('Feedback:');
      analysis.strategicFlexibility.feedback.forEach(f => lines.push(`  - ${f}`));
    }
    lines.push('');

    // Semantic tokens
    lines.push('--- Semantic Token Usage ---');
    lines.push(`Adoption Rate: ${(analysis.semanticTokens.adoptionRate * 100).toFixed(1)}%`);
    lines.push(`Total Usages: ${analysis.semanticTokens.totalUsages}`);
    if (analysis.semanticTokens.feedback.length > 0) {
      lines.push('Feedback:');
      analysis.semanticTokens.feedback.forEach(f => lines.push(`  - ${f}`));
    }
    lines.push('');

    // Primitive fallbacks
    lines.push('--- Primitive Token Fallbacks ---');
    lines.push(`Total Fallbacks: ${analysis.primitiveFallbacks.totalFallbacks}`);
    lines.push(`Semantic Opportunities: ${analysis.primitiveFallbacks.semanticOpportunities}`);
    if (analysis.primitiveFallbacks.feedback.length > 0) {
      lines.push('Feedback:');
      analysis.primitiveFallbacks.feedback.forEach(f => lines.push(`  - ${f}`));
    }
    lines.push('');

    // Recommendations
    if (analysis.overallHealth.recommendations.length > 0) {
      lines.push('--- Recommendations ---');
      analysis.overallHealth.recommendations.forEach(r => lines.push(`  - ${r}`));
    }

    return lines.join('\n');
  }
}
