/**
 * Error-Level Validation Logic
 *
 * Catches mathematical relationship violations and critical design system errors:
 * - Baseline grid violations (non-strategic flexibility tokens)
 * - Mathematical relationship breakdowns
 * - Cross-platform consistency failures
 * - Invalid token references or compositions
 * - Critical design system constraint violations
 */
import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { TokenCategory } from '../types';
import { ValidationReasoning } from './ValidationReasoning';
import type { IValidator } from './IValidator';
/**
 * Error validation context with detailed mathematical analysis
 */
export interface ErrorValidationContext {
    /** Token being validated */
    token: PrimitiveToken | SemanticToken;
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
    /** Token registry context for reference validation */
    registryContext?: {
        /** Available primitive tokens */
        availablePrimitiveTokens?: string[];
        /** Available semantic tokens */
        availableSemanticTokens?: string[];
        /** Token dependency graph */
        dependencyGraph?: Record<string, string[]>;
        /** Circular reference detection */
        circularReferences?: string[];
    };
    /** Validation options */
    options?: {
        /** Strict mathematical validation */
        strictMathematics?: boolean;
        /** Require cross-platform consistency */
        requireCrossPlatformConsistency?: boolean;
        /** Validate all token references */
        validateReferences?: boolean;
        /** Check for circular dependencies */
        checkCircularDependencies?: boolean;
    };
}
/**
 * Error-level validator for critical design system violations
 */
export declare class ErrorValidator implements IValidator<ErrorValidationContext> {
    readonly name = "ErrorValidator";
    private reasoningGenerator;
    private readonly BASELINE_GRID_UNIT;
    private readonly CROSS_PLATFORM_TOLERANCE;
    constructor(reasoningGenerator?: ValidationReasoning);
    /**
     * Validate token for Error-level violations
     */
    validate(context: ErrorValidationContext): ValidationResult | null;
    /**
     * Validate mathematical relationships
     */
    private validateMathematicalRelationships;
    /**
     * Validate border width mathematical relationships
     *
     * Border width tokens follow a doubling progression:
     * - borderWidth100 = 1 (base value)
     * - borderWidth200 = borderWidth100 × 2 = 2
     * - borderWidth400 = borderWidth100 × 4 = 4
     */
    private validateBorderWidthMathematicalRelationships;
    /**
     * Validate border width semantic token references
     *
     * Semantic border width tokens must reference the correct primitive tokens:
     * - borderDefault must reference borderWidth100
     * - borderEmphasis must reference borderWidth200
     * - borderHeavy must reference borderWidth400
     */
    private validateBorderWidthSemanticReferences;
    /**
     * Validate baseline grid compliance
     */
    private validateBaselineGridCompliance;
    /**
     * Validate cross-platform consistency
     */
    private validateCrossPlatformConsistency;
    /**
     * Validate token references
     */
    private validateTokenReferences;
    /**
     * Validate circular dependencies
     */
    private validateCircularDependencies;
    /**
     * Validate family foundation compliance
     */
    private validateFamilyFoundation;
    /**
     * Generate error validation result with comprehensive reasoning
     */
    private generateErrorResult;
    /**
     * Helper methods
     */
    private requiresBaselineGridAlignment;
    /**
     * Batch validation for multiple tokens
     */
    validateBatch(contexts: ErrorValidationContext[]): ValidationResult[];
    /**
     * Generate comprehensive error analysis report
     */
    generateErrorAnalysisReport(contexts: ErrorValidationContext[]): {
        totalTokens: number;
        tokensWithErrors: number;
        errorsByType: Record<string, number>;
        criticalErrors: ValidationResult[];
        mathematicalViolations: ValidationResult[];
        baselineGridViolations: ValidationResult[];
        crossPlatformViolations: ValidationResult[];
        referenceViolations: ValidationResult[];
        circularDependencies: ValidationResult[];
        familyFoundationViolations: ValidationResult[];
        recommendations: string[];
    };
    private categorizeError;
    private isCriticalError;
    private generateSystemErrorRecommendations;
}
//# sourceMappingURL=ErrorValidator.d.ts.map