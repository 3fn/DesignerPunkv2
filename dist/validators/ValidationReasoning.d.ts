/**
 * Mathematical Reasoning Explanations for Validation System
 *
 * Provides clear mathematical reasoning and explanations for validation decisions
 * across the three-tier validation system (Pass/Warning/Error).
 */
import type { PrimitiveToken, SemanticToken } from '../types';
/**
 * Reasoning context for validation explanations
 */
export interface ReasoningContext {
    /** Token being validated */
    token: PrimitiveToken | SemanticToken;
    /** Validation scenario */
    scenario: 'primitive-usage' | 'semantic-usage' | 'strategic-flexibility' | 'mathematical-violation' | 'problematic-pattern';
    /** Additional context data */
    contextData?: {
        /** Expected vs actual values */
        expectedValue?: number;
        actualValue?: number;
        /** Mathematical relationship details */
        relationship?: string;
        /** Usage pattern information */
        usagePattern?: string;
        /** Platform-specific information */
        platformInfo?: Record<string, any>;
        /** Baseline grid information */
        baselineGridInfo?: {
            gridUnit: number;
            isAligned: boolean;
            nearestValid?: number;
        };
    };
}
/**
 * Mathematical reasoning generator for validation results
 */
export declare class ValidationReasoning {
    /**
     * Generate mathematical reasoning for Pass-level validation
     */
    generatePassReasoning(context: ReasoningContext): string;
    /**
     * Generate mathematical reasoning for Warning-level validation
     */
    generateWarningReasoning(context: ReasoningContext): string;
    /**
     * Generate mathematical reasoning for Error-level validation
     */
    generateErrorReasoning(context: ReasoningContext): string;
    /**
     * Generate reasoning for primitive token Pass validation
     */
    private generatePrimitivePassReasoning;
    /**
     * Generate reasoning for semantic token Pass validation
     */
    private generateSemanticPassReasoning;
    /**
     * Generate reasoning for strategic flexibility token validation
     */
    private generateStrategicFlexibilityReasoning;
    /**
     * Generate reasoning for problematic pattern warnings
     */
    private generateProblematicPatternReasoning;
    /**
     * Generate reasoning for mathematical violation errors
     */
    private generateMathematicalViolationReasoning;
    /**
     * Generate suggestions for improving token usage
     */
    generateSuggestions(context: ReasoningContext): string[];
    /**
     * Generate suggestions for mathematical violations
     */
    private generateViolationSuggestions;
    /**
     * Generate suggestions for problematic patterns
     */
    private generatePatternSuggestions;
    /**
     * Generate suggestions for strategic flexibility usage
     */
    private generateFlexibilitySuggestions;
    /**
     * Check if token category requires baseline grid alignment
     */
    private requiresBaselineGridAlignment;
    /**
     * Generate comprehensive mathematical explanation
     */
    generateComprehensiveExplanation(context: ReasoningContext): {
        reasoning: string;
        suggestions: string[];
        mathematicalDetails: string;
    };
    /**
     * Generate detailed mathematical explanation
     */
    private generateMathematicalDetails;
}
//# sourceMappingURL=ValidationReasoning.d.ts.map