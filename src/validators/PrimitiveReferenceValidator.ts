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

export class PrimitiveReferenceValidator {
  private primitiveRegistry: PrimitiveTokenRegistry;

  constructor(primitiveRegistry: PrimitiveTokenRegistry) {
    this.primitiveRegistry = primitiveRegistry;
  }

  /**
   * Validate that a semantic token references valid primitive tokens
   */
  validate(
    semanticToken: SemanticToken,
    options: PrimitiveReferenceValidationOptions = {}
  ): ValidationResult {
    const { allowEmptyReferences = false, strictValidation = true } = options;

    // Check if semantic token has primitive references
    if (!semanticToken.primitiveReferences || Object.keys(semanticToken.primitiveReferences).length === 0) {
      if (allowEmptyReferences) {
        return {
          level: 'Warning',
          token: semanticToken.name,
          message: 'Semantic token has no primitive references',
          rationale: `Semantic token ${semanticToken.name} does not reference any primitive tokens`,
          suggestions: ['Add primitive token references to maintain mathematical consistency'],
          mathematicalReasoning: 'Semantic tokens should reference primitives to inherit mathematical properties'
        };
      }

      return {
        level: 'Error',
        token: semanticToken.name,
        message: 'Semantic token must reference primitive tokens',
        rationale: `Semantic token ${semanticToken.name} has no primitive references`,
        suggestions: ['Add at least one primitive token reference'],
        mathematicalReasoning: 'Semantic tokens must reference primitives to maintain mathematical consistency'
      };
    }

    // Validate each primitive reference
    const invalidReferences: string[] = [];
    const validReferences: string[] = [];
    const rawValueReferences: string[] = [];

    for (const [key, reference] of Object.entries(semanticToken.primitiveReferences)) {
      // Check if reference looks like a raw value (number or direct value)
      if (this.isRawValue(reference)) {
        rawValueReferences.push(`${key}: ${reference}`);
        continue;
      }

      // Check if primitive token exists
      const primitiveToken = this.primitiveRegistry.get(reference);
      if (!primitiveToken) {
        invalidReferences.push(`${key}: ${reference}`);
      } else {
        validReferences.push(`${key}: ${reference}`);
      }
    }

    // Check for raw values (highest priority error)
    if (rawValueReferences.length > 0) {
      return {
        level: 'Error',
        token: semanticToken.name,
        message: 'Semantic token uses raw values instead of primitive references',
        rationale: `Semantic token ${semanticToken.name} contains raw values: ${rawValueReferences.join(', ')}`,
        suggestions: [
          'Replace raw values with primitive token references',
          'Create primitive tokens for these values if they don\'t exist',
          'Ensure all semantic tokens reference primitives, not raw values'
        ],
        mathematicalReasoning: 'Raw values in semantic tokens break mathematical consistency and token hierarchy'
      };
    }

    // Check for invalid references
    if (invalidReferences.length > 0) {
      return {
        level: 'Error',
        token: semanticToken.name,
        message: 'Semantic token references non-existent primitive tokens',
        rationale: `Semantic token ${semanticToken.name} references invalid primitives: ${invalidReferences.join(', ')}`,
        suggestions: [
          'Verify primitive token names are correct',
          'Register referenced primitive tokens before semantic tokens',
          'Check for typos in primitive token references'
        ],
        mathematicalReasoning: 'Semantic tokens must reference valid primitives to maintain mathematical relationships'
      };
    }

    // All references are valid
    const referenceCount = validReferences.length;
    return {
      level: 'Pass',
      token: semanticToken.name,
      message: `Semantic token references ${referenceCount} valid primitive token(s)`,
      rationale: `All primitive references are valid: ${validReferences.join(', ')}`,
      mathematicalReasoning: `Semantic token inherits mathematical properties from ${referenceCount} primitive token(s)`
    };
  }

  /**
   * Validate multiple semantic tokens
   */
  validateMultiple(semanticTokens: SemanticToken[]): ValidationResult[] {
    return semanticTokens.map(token => this.validate(token));
  }

  /**
   * Check if a reference string appears to be a raw value
   */
  private isRawValue(reference: string): boolean {
    // Check for numeric values
    if (!isNaN(Number(reference))) {
      return true;
    }

    // Check for common raw value patterns
    const rawValuePatterns = [
      /^\d+px$/i,           // e.g., "16px"
      /^\d+rem$/i,          // e.g., "1rem"
      /^\d+pt$/i,           // e.g., "16pt"
      /^\d+dp$/i,           // e.g., "16dp"
      /^\d+sp$/i,           // e.g., "16sp"
      /^#[0-9A-Fa-f]{3,8}$/, // e.g., "#FF0000"
      /^rgb\(/i,            // e.g., "rgb(255, 0, 0)"
      /^rgba\(/i,           // e.g., "rgba(255, 0, 0, 0.5)"
      /^hsl\(/i,            // e.g., "hsl(0, 100%, 50%)"
      /^\d+\.\d+$/,         // e.g., "1.5"
    ];

    return rawValuePatterns.some(pattern => pattern.test(reference));
  }

  /**
   * Get validation statistics for a set of semantic tokens
   */
  getValidationStats(semanticTokens: SemanticToken[]): {
    total: number;
    valid: number;
    invalid: number;
    withRawValues: number;
    withInvalidReferences: number;
  } {
    const results = this.validateMultiple(semanticTokens);
    
    return {
      total: results.length,
      valid: results.filter(r => r.level === 'Pass').length,
      invalid: results.filter(r => r.level === 'Error').length,
      withRawValues: results.filter(r => r.message.includes('raw values')).length,
      withInvalidReferences: results.filter(r => r.message.includes('non-existent')).length
    };
  }
}
