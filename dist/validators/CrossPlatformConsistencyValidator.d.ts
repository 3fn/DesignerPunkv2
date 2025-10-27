/**
 * Cross-Platform Mathematical Consistency Validator
 *
 * Validates proportional relationships across web, iOS, and Android platforms
 * ensuring mathematical equivalence within tolerance levels while handling
 * platform-specific constraints gracefully.
 */
import { PrimitiveToken, TokenCategory, ConsistencyValidationResult } from '../types';
import { UnitProvider } from '../providers/UnitProvider';
import { ToleranceCalculator, ToleranceResult } from './ToleranceCalculator';
import { PlatformConstraintHandler, ConstraintHandlingResult } from './PlatformConstraintHandler';
/**
 * Cross-platform validation context
 */
export interface CrossPlatformValidationContext {
    /** Token being validated */
    token: PrimitiveToken;
    /** Unit providers for each platform */
    unitProviders: Record<string, UnitProvider>;
    /** Whether to apply constraint handling */
    handleConstraints: boolean;
    /** Additional validation options */
    options?: {
        /** Use relative tolerance for large values */
        useRelativeTolerance?: boolean;
        /** Strict mode - fail on any constraint handling */
        strictMode?: boolean;
        /** Custom tolerance multiplier */
        toleranceMultiplier?: number;
    };
}
/**
 * Detailed consistency validation result with mathematical analysis
 */
export interface DetailedConsistencyResult extends ConsistencyValidationResult {
    /** Token name being validated */
    tokenName: string;
    /** Token category */
    category: TokenCategory;
    /** Platform-specific converted values */
    platformValues: Record<string, any>;
    /** Tolerance calculation details */
    toleranceDetails: ToleranceResult;
    /** Constraint handling results if applicable */
    constraintHandling?: ConstraintHandlingResult;
    /** Detailed mathematical analysis */
    mathematicalAnalysis: {
        /** Proportional relationships between platforms */
        proportionalRelationships: Record<string, number>;
        /** Maximum deviation found */
        maxDeviation: number;
        /** Platform pairs that failed consistency */
        failedPairs: string[];
        /** Overall consistency score (0-1) */
        consistencyScore: number;
    };
    /** Recommendations for improving consistency */
    recommendations: string[];
}
/**
 * Cross-platform mathematical consistency validator
 */
export declare class CrossPlatformConsistencyValidator {
    private toleranceCalculator;
    private constraintHandler;
    constructor(toleranceCalculator?: ToleranceCalculator, constraintHandler?: PlatformConstraintHandler);
    /**
     * Validate cross-platform mathematical consistency for a token
     */
    validateToken(context: CrossPlatformValidationContext): Promise<DetailedConsistencyResult>;
    /**
     * Convert token to platform-specific values using unit providers
     */
    private convertToPlatformValues;
    /**
     * Analyze mathematical consistency across platform values
     */
    private analyzeMathematicalConsistency;
    /**
     * Generate relationship validation description
     */
    private generateRelationshipValidation;
    /**
     * Generate recommendations for improving consistency
     */
    private generateRecommendations;
    /**
     * Create a failed validation result
     */
    private createFailedResult;
    /**
     * Validate multiple tokens for batch consistency checking
     */
    validateTokens(tokens: PrimitiveToken[], unitProviders: Record<string, UnitProvider>, options?: {
        handleConstraints?: boolean;
        strictMode?: boolean;
        useRelativeTolerance?: boolean;
        toleranceMultiplier?: number;
    }): Promise<DetailedConsistencyResult[]>;
    /**
     * Generate summary report for multiple token validations
     */
    generateSummaryReport(results: DetailedConsistencyResult[]): {
        totalTokens: number;
        consistentTokens: number;
        inconsistentTokens: number;
        averageConsistencyScore: number;
        commonIssues: string[];
        platformIssues: Record<string, number>;
    };
}
//# sourceMappingURL=CrossPlatformConsistencyValidator.d.ts.map