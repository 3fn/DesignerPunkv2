/**
 * Warning-Level Validation Logic
 *
 * Identifies mathematically valid but potentially problematic token usage patterns:
 * - Overuse of primitive tokens when semantic alternatives exist
 * - Strategic flexibility tokens used inappropriately
 * - Patterns that may indicate design system misunderstanding
 * - Usage that works but could be optimized
 */
import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { TokenCategory } from '../types';
import { ValidationReasoning } from './ValidationReasoning';
/**
 * Warning validation context with usage pattern analysis
 */
export interface WarningValidationContext {
    /** Token being validated */
    token: PrimitiveToken | SemanticToken;
    /** Usage pattern information */
    usagePattern?: {
        /** Frequency of this token usage */
        usageFrequency?: number;
        /** Total usage count in project */
        totalUsageCount?: number;
        /** Alternative tokens available */
        availableAlternatives?: string[];
        /** Usage context (component, property, etc.) */
        usageContext?: string;
        /** Pattern classification */
        patternType?: 'overuse' | 'misuse' | 'suboptimal' | 'inconsistent';
    };
    /** Design system context */
    systemContext?: {
        /** Available semantic tokens */
        availableSemanticTokens?: string[];
        /** Strategic flexibility usage statistics */
        strategicFlexibilityStats?: {
            totalUsage: number;
            appropriateUsage: number;
            inappropriateUsage: number;
            usagePercentage: number;
        };
        /** Token family usage patterns */
        familyUsagePatterns?: Record<TokenCategory, {
            primitiveUsage: number;
            semanticUsage: number;
            totalUsage: number;
        }>;
    };
    /** Validation options */
    options?: {
        /** Threshold for strategic flexibility appropriate usage */
        strategicFlexibilityThreshold?: number;
        /** Threshold for primitive vs semantic usage warnings */
        primitiveUsageThreshold?: number;
        /** Enable pattern analysis */
        enablePatternAnalysis?: boolean;
    };
}
/**
 * Warning-level validator for potentially problematic patterns
 */
export declare class WarningValidator {
    private reasoningGenerator;
    private readonly DEFAULT_STRATEGIC_FLEXIBILITY_THRESHOLD;
    private readonly DEFAULT_PRIMITIVE_USAGE_THRESHOLD;
    constructor(reasoningGenerator?: ValidationReasoning);
    /**
     * Validate token usage for Warning-level concerns
     */
    validate(context: WarningValidationContext): ValidationResult | null;
    /**
     * Check for strategic flexibility token overuse
     */
    private checkStrategicFlexibilityOveruse;
    /**
     * Check for primitive token overuse when semantic alternatives exist
     */
    private checkPrimitiveTokenOveruse;
    /**
     * Check for suboptimal usage patterns
     */
    private checkSuboptimalUsagePatterns;
    /**
     * Check for inconsistent usage patterns
     */
    private checkInconsistentUsagePatterns;
    /**
     * Check for mathematical edge cases that might cause issues
     */
    private checkMathematicalEdgeCases;
    /**
     * Check specific pattern types for targeted warnings
     */
    private checkSpecificPatternType;
    /**
     * Generate warning validation result with comprehensive reasoning
     */
    private generateWarningResult;
    /**
     * Helper methods
     */
    private detectInconsistentUsage;
    private shouldUseIntegerValues;
    /**
     * Batch validation for multiple tokens
     */
    validateBatch(contexts: WarningValidationContext[]): ValidationResult[];
    /**
     * Generate usage pattern analysis report
     */
    generateUsagePatternReport(contexts: WarningValidationContext[]): {
        totalTokens: number;
        tokensWithWarnings: number;
        warningsByType: Record<string, number>;
        strategicFlexibilityOveruse: boolean;
        primitiveOveruseByCategory: Record<TokenCategory, number>;
        recommendations: string[];
    };
    private extractWarningType;
    private generateSystemRecommendations;
}
//# sourceMappingURL=WarningValidator.d.ts.map