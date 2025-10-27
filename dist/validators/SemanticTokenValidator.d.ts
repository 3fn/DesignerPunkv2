/**
 * Semantic Token Validator
 *
 * Comprehensive validation for semantic tokens including primitive reference validation,
 * composition pattern validation, and semantic token hierarchy enforcement.
 * Coordinates validation across multiple validation components.
 */
import type { SemanticToken } from '../types/SemanticToken';
import type { ValidationResult } from '../types/ValidationResult';
import type { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import type { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import { PrimitiveReferenceValidator } from './PrimitiveReferenceValidator';
import { CompositionPatternValidator } from './CompositionPatternValidator';
export interface SemanticValidationOptions {
    /** Whether to validate primitive references (default: true) */
    validatePrimitiveReferences?: boolean;
    /** Whether to validate composition patterns (default: true) */
    validateCompositionPatterns?: boolean;
    /** Whether to allow empty primitive references (default: false) */
    allowEmptyReferences?: boolean;
    /** Whether to enforce strict validation (default: true) */
    strictValidation?: boolean;
}
export interface ComprehensiveValidationResult {
    /** Overall validation result */
    overall: ValidationResult;
    /** Primitive reference validation result */
    primitiveReferences?: ValidationResult;
    /** Composition pattern validation result */
    compositionPattern?: ValidationResult;
    /** Additional validation details */
    details: {
        hasValidReferences: boolean;
        referenceCount: number;
        usesRawValues: boolean;
        validationTimestamp: Date;
    };
}
export declare class SemanticTokenValidator {
    private primitiveReferenceValidator;
    private compositionPatternValidator;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Perform comprehensive validation on a semantic token
     */
    validate(semanticToken: SemanticToken, options?: SemanticValidationOptions): ComprehensiveValidationResult;
    /**
     * Validate semantic token structure and hierarchy
     */
    private validateSemanticStructure;
    /**
     * Determine overall validation result from multiple validation results
     */
    private determineOverallResult;
    /**
     * Validate multiple semantic tokens
     */
    validateMultiple(semanticTokens: SemanticToken[], options?: SemanticValidationOptions): ComprehensiveValidationResult[];
    /**
     * Get validation statistics for multiple tokens
     */
    getValidationStats(validationResults: ComprehensiveValidationResult[]): {
        total: number;
        passed: number;
        warnings: number;
        errors: number;
        withValidReferences: number;
        withRawValues: number;
        passRate: number;
    };
    /**
     * Get primitive reference validator for direct access
     */
    getPrimitiveReferenceValidator(): PrimitiveReferenceValidator;
    /**
     * Get composition pattern validator for direct access
     */
    getCompositionPatternValidator(): CompositionPatternValidator;
}
//# sourceMappingURL=SemanticTokenValidator.d.ts.map