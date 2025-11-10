/**
 * Pass-Level Validation Logic
 *
 * Handles validation for token usage that follows best practices:
 * - Primitive tokens used appropriately within their mathematical foundations
 * - Semantic tokens providing proper contextual abstraction
 * - Strategic flexibility tokens used for exceptional design requirements
 */
import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
import { ValidationReasoning } from './ValidationReasoning';
import type { IValidator } from './IValidator';
/**
 * Pass validation context
 */
export interface PassValidationContext {
    /** Token being validated */
    token: PrimitiveToken | SemanticToken;
    /** Usage context information */
    usageContext?: {
        /** Component or context where token is used */
        component?: string;
        /** Property or attribute where token is applied */
        property?: string;
        /** Additional usage metadata */
        metadata?: Record<string, any>;
    };
    /** Validation options */
    options?: {
        /** Strict mode - more rigorous validation */
        strictMode?: boolean;
        /** Check cross-platform consistency */
        checkCrossPlatform?: boolean;
        /** Validate mathematical relationships */
        validateMathematics?: boolean;
    };
}
/**
 * Pass-level validator for tokens following best practices
 */
export declare class PassValidator implements IValidator<PassValidationContext> {
    readonly name = "PassValidator";
    private reasoningGenerator;
    constructor(reasoningGenerator?: ValidationReasoning);
    /**
     * Validate token usage for Pass-level compliance
     */
    validate(context: PassValidationContext): ValidationResult;
    /**
     * Validate primitive token usage
     */
    private validatePrimitiveToken;
    /**
     * Validate semantic token usage
     */
    private validateSemanticToken;
    /**
     * Validate strategic flexibility token usage
     */
    private validateStrategicFlexibilityToken;
    /**
     * Validate mathematical foundation compliance
     */
    private validateMathematicalFoundation;
    /**
     * Validate baseline grid alignment for applicable token categories
     */
    private validateBaselineGridAlignment;
    /**
     * Validate cross-platform consistency
     */
    private validateCrossPlatformConsistency;
    /**
     * Validate primitive reference in semantic token
     */
    private validatePrimitiveReference;
    /**
     * Validate contextual appropriateness of semantic token
     */
    private validateContextualAppropriateness;
    /**
     * Validate semantic abstraction provides value
     */
    private validateSemanticAbstraction;
    /**
     * Generate Pass validation result with appropriate reasoning
     */
    private generatePassResult;
    /**
     * Helper methods for validation logic
     */
    private checkMathematicalRelationship;
    private performStrictMathematicalValidation;
    private requiresBaselineGridAlignment;
    private checkCrossPlatformMathematicalConsistency;
    private checkContextAlignment;
    private assessAbstractionValue;
    private getPassMessage;
    private getPassRationale;
}
//# sourceMappingURL=PassValidator.d.ts.map