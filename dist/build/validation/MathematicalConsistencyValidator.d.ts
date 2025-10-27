/**
 * Mathematical Consistency Validator
 *
 * F2 wrapper around F1 validators that adapts them to build context.
 * Validates mathematical consistency across platform builds including:
 * - Cross-platform token consistency (wraps F1's CrossPlatformConsistencyValidator)
 * - Mathematical relationships preservation (wraps F1's ThreeTierValidator)
 * - Strategic flexibility tokens (wraps F1's BaselineGridValidator)
 * - Accessibility requirements (WCAG 2.1 AA - NEW for F2)
 *
 * Requirements: 7.2, 7.3
 * F1 Dependencies: CrossPlatformConsistencyValidator, ThreeTierValidator, BaselineGridValidator
 */
import { CrossPlatformConsistencyValidator, DetailedConsistencyResult } from '../../validators/CrossPlatformConsistencyValidator';
import { ThreeTierValidator, ThreeTierValidationResult } from '../../validators/ThreeTierValidator';
import { BaselineGridValidator } from '../../validators/BaselineGridValidator';
import { UnitProvider } from '../../providers/UnitProvider';
import { BuildResult } from '../types/BuildResult';
import { Platform } from '../types/Platform';
import { PlatformTokens } from '../tokens/PlatformTokens';
/**
 * Accessibility validation result
 */
export interface AccessibilityValidationResult {
    valid: boolean;
    contrastRatioIssues: ContrastRatioIssue[];
    touchTargetIssues: TouchTargetIssue[];
    recommendations: string[];
}
/**
 * Contrast ratio issue (WCAG 2.1 AA)
 */
export interface ContrastRatioIssue {
    foregroundColor: string;
    backgroundColor: string;
    contrastRatio: number;
    requiredRatio: number;
    level: 'AA' | 'AAA';
    context: 'normal-text' | 'large-text' | 'ui-component';
}
/**
 * Touch target size issue
 */
export interface TouchTargetIssue {
    component: string;
    platform: Platform;
    actualSize: {
        width: number;
        height: number;
    };
    requiredSize: {
        width: number;
        height: number;
    };
    recommendation: string;
}
/**
 * Mathematical consistency validation result for build context
 */
export interface BuildMathematicalConsistencyResult {
    /** Overall validation success */
    valid: boolean;
    /** Cross-platform consistency results */
    crossPlatformConsistency: {
        valid: boolean;
        results: DetailedConsistencyResult[];
        summary: string;
    };
    /** Mathematical relationships validation */
    mathematicalRelationships: {
        valid: boolean;
        results: ThreeTierValidationResult[];
        summary: string;
    };
    /** Strategic flexibility validation */
    strategicFlexibility: {
        valid: boolean;
        results: any[];
        summary: string;
    };
    /** Accessibility validation (NEW for F2) */
    accessibility: AccessibilityValidationResult;
    /** Overall recommendations */
    recommendations: string[];
    /** Validation metadata */
    metadata: {
        timestamp: Date;
        platformsValidated: Platform[];
        tokensValidated: number;
        validationDuration: number;
    };
}
/**
 * Mathematical Consistency Validator
 *
 * Wraps F1 validators and adapts them to F2 build context
 */
export declare class MathematicalConsistencyValidator {
    private crossPlatformValidator;
    private threeTierValidator;
    private baselineGridValidator;
    constructor(crossPlatformValidator?: CrossPlatformConsistencyValidator, threeTierValidator?: ThreeTierValidator, baselineGridValidator?: BaselineGridValidator);
    /**
     * Validate mathematical consistency across build results
     */
    validateBuildResults(buildResults: BuildResult[], tokens: PlatformTokens[], unitProviders: Record<Platform, UnitProvider>): Promise<BuildMathematicalConsistencyResult>;
    /**
     * Validate cross-platform consistency using F1's CrossPlatformConsistencyValidator
     */
    private validateCrossPlatformConsistency;
    /**
     * Validate mathematical relationships using F1's ThreeTierValidator
     */
    private validateMathematicalRelationships;
    /**
     * Validate strategic flexibility using F1's BaselineGridValidator
     */
    private validateStrategicFlexibility;
    /**
     * Validate accessibility requirements (NEW for F2)
     * WCAG 2.1 AA compliance
     */
    private validateAccessibility;
    /**
     * Check contrast ratio for color token
     */
    private checkContrastRatio;
    /**
     * Check touch target size
     */
    private checkTouchTargetSize;
    /**
     * Extract primitive tokens from platform tokens
     */
    private extractPrimitiveTokens;
    /**
     * Extract color tokens
     */
    private extractColorTokens;
    /**
     * Extract sizing tokens
     */
    private extractSizingTokens;
    /**
     * Get expected progression for token category
     */
    private getExpectedProgression;
    /**
     * Count total tokens
     */
    private countTokens;
    /**
     * Generate comprehensive recommendations
     */
    private generateRecommendations;
}
//# sourceMappingURL=MathematicalConsistencyValidator.d.ts.map