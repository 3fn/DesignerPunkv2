/**
 * Three-Tier Validation System
 *
 * Main validation orchestrator that coordinates Pass/Warning/Error validation
 * to provide comprehensive feedback on token usage patterns and mathematical consistency.
 *
 * Validation Levels:
 * - Pass: Token usage follows best practices and mathematical foundations
 * - Warning: Mathematically valid but potentially problematic usage patterns
 * - Error: Mathematical relationship violations or critical design system errors
 */
import type { PrimitiveToken, SemanticToken, ValidationResult, TokenCategory } from '../types';
import { type PassValidationContext } from './PassValidator';
import { type WarningValidationContext } from './WarningValidator';
import { type ErrorValidationContext } from './ErrorValidator';
import { ValidationReasoning } from './ValidationReasoning';
/**
 * Comprehensive validation context combining all validation levels
 */
export interface ThreeTierValidationContext {
    /** Token being validated */
    token: PrimitiveToken | SemanticToken;
    /** Usage context information */
    usageContext?: {
        /** Component or context where token is used */
        component?: string;
        /** Property or attribute where token is applied */
        property?: string;
        /** Usage frequency data */
        usageFrequency?: number;
        /** Total usage count in project */
        totalUsageCount?: number;
        /** Available alternative tokens */
        availableAlternatives?: string[];
        /** Additional usage metadata */
        metadata?: Record<string, any>;
    };
    /** Mathematical validation context */
    mathematicalContext?: {
        /** Expected mathematical relationship */
        expectedRelationship?: string;
        /** Actual calculated relationship */
        actualRelationship?: string;
        /** Baseline grid requirements */
        baselineGridRequirement?: {
            required: boolean;
            gridUnit: number;
            expectedAlignment: boolean;
            actualAlignment: boolean;
        };
        /** Cross-platform consistency data */
        crossPlatformData?: {
            platforms: string[];
            values: Record<string, any>;
            toleranceLevel: number;
            maxDeviation: number;
            failedPairs: string[];
        };
        /** Family mathematical foundation */
        familyFoundation?: {
            category: TokenCategory;
            baseValue: number;
            expectedProgression: string;
            actualProgression: string;
        };
    };
    /** Design system context */
    systemContext?: {
        /** Available semantic tokens */
        availableSemanticTokens?: string[];
        /** Available primitive tokens */
        availablePrimitiveTokens?: string[];
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
        /** Token dependency graph */
        dependencyGraph?: Record<string, string[]>;
        /** Circular reference detection */
        circularReferences?: string[];
    };
    /** Validation options */
    options?: {
        /** Validation levels to run */
        enabledLevels?: ('Pass' | 'Warning' | 'Error')[];
        /** Strict mathematical validation */
        strictMathematics?: boolean;
        /** Require cross-platform consistency */
        requireCrossPlatformConsistency?: boolean;
        /** Enable usage pattern analysis */
        enablePatternAnalysis?: boolean;
        /** Validate all token references */
        validateReferences?: boolean;
        /** Check for circular dependencies */
        checkCircularDependencies?: boolean;
        /** Strategic flexibility threshold */
        strategicFlexibilityThreshold?: number;
        /** Primitive usage threshold */
        primitiveUsageThreshold?: number;
    };
}
/**
 * Comprehensive validation result with all validation levels
 */
export interface ThreeTierValidationResult {
    /** Primary validation result (highest severity level found) */
    primaryResult: ValidationResult;
    /** All validation results by level */
    resultsByLevel: {
        pass?: ValidationResult;
        warning?: ValidationResult;
        error?: ValidationResult;
    };
    /** Overall validation summary */
    summary: {
        /** Final validation level */
        level: 'Pass' | 'Warning' | 'Error';
        /** Token name */
        token: string;
        /** Primary message */
        message: string;
        /** All issues found */
        allIssues: string[];
        /** All suggestions */
        allSuggestions: string[];
        /** Comprehensive mathematical reasoning */
        comprehensiveReasoning: string;
    };
    /** Validation metadata */
    metadata: {
        /** Validation timestamp */
        timestamp: Date;
        /** Validation levels executed */
        levelsExecuted: string[];
        /** Validation options used */
        optionsUsed: ThreeTierValidationContext['options'];
        /** Performance metrics */
        performanceMetrics?: {
            totalValidationTime: number;
            validationTimeByLevel: Record<string, number>;
        };
    };
}
import type { IValidator } from './IValidator';
/**
 * Three-tier validation system orchestrator
 */
export declare class ThreeTierValidator {
    private passValidator;
    private warningValidator;
    private errorValidator;
    private reasoningGenerator;
    constructor(passValidator?: IValidator<PassValidationContext>, warningValidator?: IValidator<WarningValidationContext>, errorValidator?: IValidator<ErrorValidationContext>, reasoningGenerator?: ValidationReasoning);
    /**
     * Perform comprehensive three-tier validation
     */
    validate(context: ThreeTierValidationContext): ThreeTierValidationResult;
    /**
     * Execute Error-level validation
     */
    private executeErrorValidation;
    /**
     * Execute Warning-level validation
     */
    private executeWarningValidation;
    /**
     * Execute Pass-level validation
     */
    private executePassValidation;
    /**
     * Determine primary validation result (highest severity)
     */
    private determinePrimaryResult;
    /**
     * Generate comprehensive mathematical reasoning combining all validation levels
     */
    private generateComprehensiveReasoning;
    /**
     * Determine usage pattern type for warning validation
     */
    private determinePatternType;
    /**
     * Batch validation for multiple tokens
     */
    validateBatch(contexts: ThreeTierValidationContext[]): ThreeTierValidationResult[];
    /**
     * Generate comprehensive validation report for multiple tokens
     */
    generateValidationReport(contexts: ThreeTierValidationContext[]): {
        summary: {
            totalTokens: number;
            passCount: number;
            warningCount: number;
            errorCount: number;
            overallHealthScore: number;
        };
        results: ThreeTierValidationResult[];
        systemAnalysis: {
            commonIssues: string[];
            criticalErrors: ValidationResult[];
            improvementRecommendations: string[];
            mathematicalConsistencyScore: number;
        };
        performanceMetrics: {
            totalValidationTime: number;
            averageValidationTime: number;
            validationTimeByLevel: Record<string, number>;
        };
    };
    /**
     * Generate system-level recommendations based on validation results
     */
    private generateSystemRecommendations;
    /**
     * Calculate mathematical consistency score across all tokens
     */
    private calculateMathematicalConsistencyScore;
    /**
     * Aggregate validation times by level across all results
     */
    private aggregateValidationTimesByLevel;
}
//# sourceMappingURL=ThreeTierValidator.d.ts.map