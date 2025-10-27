/**
 * Primitive Reference Validator
 *
 * Validates that semantic tokens reference valid primitive tokens and prevents
 * the use of raw values in semantic token definitions. Ensures semantic tokens
 * maintain proper hierarchy and mathematical consistency through primitive references.
 */
import type { SemanticToken } from '../types/SemanticToken';
import type { ValidationResult } from '../types/ValidationResult';
import type { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
export interface PrimitiveReferenceValidationOptions {
    /** Whether to allow empty primitive references (default: false) */
    allowEmptyReferences?: boolean;
    /** Whether to validate that all references resolve to primitives (default: true) */
    strictValidation?: boolean;
}
export declare class PrimitiveReferenceValidator {
    private primitiveRegistry;
    constructor(primitiveRegistry: PrimitiveTokenRegistry);
    /**
     * Validate that a semantic token references valid primitive tokens
     */
    validate(semanticToken: SemanticToken, options?: PrimitiveReferenceValidationOptions): ValidationResult;
    /**
     * Validate multiple semantic tokens
     */
    validateMultiple(semanticTokens: SemanticToken[]): ValidationResult[];
    /**
     * Check if a reference string appears to be a raw value
     */
    private isRawValue;
    /**
     * Get validation statistics for a set of semantic tokens
     */
    getValidationStats(semanticTokens: SemanticToken[]): {
        total: number;
        valid: number;
        invalid: number;
        withRawValues: number;
        withInvalidReferences: number;
    };
}
//# sourceMappingURL=PrimitiveReferenceValidator.d.ts.map