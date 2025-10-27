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
        usageRate: number;
        meetsThreshold: boolean;
        status: 'PASS' | 'FAIL';
        feedback: string[];
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
export declare class UsagePatternAnalyzer {
    private tokenUsageTracker;
    private strategicFlexibilityTracker;
    private semanticTokenUsageTracker;
    private primitiveTokenFallbackTracker;
    constructor(tokenUsageTracker: TokenUsageTracker, strategicFlexibilityTracker: StrategicFlexibilityTracker, semanticTokenUsageTracker: SemanticTokenUsageTracker, primitiveTokenFallbackTracker: PrimitiveTokenFallbackTracker);
    /**
     * Analyze overall usage patterns across all trackers
     */
    analyze(): UsagePatternAnalysis;
    /**
     * Generate a comprehensive usage report
     */
    generateReport(): string;
}
//# sourceMappingURL=UsagePatternAnalyzer.d.ts.map