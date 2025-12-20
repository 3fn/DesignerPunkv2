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
import type { IValidator } from './IValidator';

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

export interface SemanticValidationInput {
  semanticToken: SemanticToken;
  options?: SemanticValidationOptions;
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

export class SemanticTokenValidator implements IValidator<SemanticValidationInput> {
  readonly name = 'SemanticTokenValidator';
  private primitiveReferenceValidator: PrimitiveReferenceValidator;
  private compositionPatternValidator: CompositionPatternValidator;

  constructor(
    primitiveRegistry: PrimitiveTokenRegistry,
    semanticRegistry: SemanticTokenRegistry
  ) {
    this.primitiveReferenceValidator = new PrimitiveReferenceValidator(primitiveRegistry);
    this.compositionPatternValidator = new CompositionPatternValidator(semanticRegistry);
  }

  /**
   * Validate input using IValidator interface
   */
  validate(input: SemanticValidationInput): ValidationResult;
  validate(semanticToken: SemanticToken, options?: SemanticValidationOptions): ComprehensiveValidationResult;
  validate(
    inputOrToken: SemanticValidationInput | SemanticToken,
    options?: SemanticValidationOptions
  ): ValidationResult | ComprehensiveValidationResult {
    // Handle IValidator interface call
    if ('semanticToken' in inputOrToken) {
      const result = this.validateToken(inputOrToken.semanticToken, inputOrToken.options);
      return result.overall;
    }
    
    // Handle legacy direct call
    return this.validateToken(inputOrToken, options);
  }

  /**
   * Perform comprehensive validation on a semantic token (legacy method)
   */
  validateToken(
    semanticToken: SemanticToken,
    options: SemanticValidationOptions = {}
  ): ComprehensiveValidationResult {
    const {
      validatePrimitiveReferences = true,
      validateCompositionPatterns = true,
      allowEmptyReferences = false,
      strictValidation = true
    } = options;

    const validationResults: ValidationResult[] = [];
    let primitiveReferencesResult: ValidationResult | undefined;
    let compositionPatternResult: ValidationResult | undefined;

    // Validate primitive references
    if (validatePrimitiveReferences) {
      primitiveReferencesResult = this.primitiveReferenceValidator.validate(semanticToken, {
        allowEmptyReferences,
        strictValidation
      });
      validationResults.push(primitiveReferencesResult);
    }

    // Validate composition patterns (basic semantic token structure)
    if (validateCompositionPatterns) {
      compositionPatternResult = this.validateSemanticStructure(semanticToken);
      validationResults.push(compositionPatternResult);
    }

    // Determine overall validation result
    const overall = this.determineOverallResult(semanticToken, validationResults);

    // Gather validation details
    const details = {
      hasValidReferences: primitiveReferencesResult?.level === 'Pass',
      referenceCount: Object.keys(semanticToken.primitiveReferences || {}).length,
      usesRawValues: primitiveReferencesResult?.message.includes('raw values') || false,
      validationTimestamp: new Date()
    };

    return {
      overall,
      primitiveReferences: primitiveReferencesResult,
      compositionPattern: compositionPatternResult,
      details
    };
  }

  /**
   * Validate semantic token structure and hierarchy
   */
  private validateSemanticStructure(semanticToken: SemanticToken): ValidationResult {
    // Check required fields
    if (!semanticToken.name || semanticToken.name.trim() === '') {
      return {
        level: 'Error',
        token: semanticToken.name || 'unnamed',
        message: 'Semantic token missing required name',
        rationale: 'Semantic token must have a valid name',
        mathematicalReasoning: 'Token identification is required for proper system organization'
      };
    }

    if (!semanticToken.category) {
      return {
        level: 'Error',
        token: semanticToken.name,
        message: 'Semantic token missing required category',
        rationale: 'Semantic token must have a valid category',
        mathematicalReasoning: 'Token categorization is required for proper system organization'
      };
    }

    if (!semanticToken.description || semanticToken.description.trim() === '') {
      return {
        level: 'Warning',
        token: semanticToken.name,
        message: 'Semantic token missing description',
        rationale: 'Semantic token should have a description for clarity',
        suggestions: ['Add a description explaining the semantic meaning and usage'],
        mathematicalReasoning: 'Documentation improves token system maintainability'
      };
    }

    // Structure is valid
    return {
      level: 'Pass',
      token: semanticToken.name,
      message: 'Semantic token structure is valid',
      rationale: `Semantic token ${semanticToken.name} has all required fields`,
      mathematicalReasoning: 'Proper token structure maintains system organization and clarity'
    };
  }

  /**
   * Determine overall validation result from multiple validation results
   */
  private determineOverallResult(
    semanticToken: SemanticToken,
    validationResults: ValidationResult[]
  ): ValidationResult {
    // Check for any errors
    const errors = validationResults.filter(r => r.level === 'Error');
    if (errors.length > 0) {
      return {
        level: 'Error',
        token: semanticToken.name,
        message: `Semantic token validation failed with ${errors.length} error(s)`,
        rationale: errors.map(e => e.message).join('; '),
        suggestions: errors.flatMap(e => e.suggestions || []),
        mathematicalReasoning: 'Semantic token must pass all validation checks to maintain system integrity'
      };
    }

    // Check for warnings
    const warnings = validationResults.filter(r => r.level === 'Warning');
    if (warnings.length > 0) {
      return {
        level: 'Warning',
        token: semanticToken.name,
        message: `Semantic token validation passed with ${warnings.length} warning(s)`,
        rationale: warnings.map(w => w.message).join('; '),
        suggestions: warnings.flatMap(w => w.suggestions || []),
        mathematicalReasoning: 'Semantic token is valid but could be improved'
      };
    }

    // All validations passed
    return {
      level: 'Pass',
      token: semanticToken.name,
      message: 'Semantic token validation passed',
      rationale: `Semantic token ${semanticToken.name} passed all validation checks`,
      mathematicalReasoning: 'Semantic token maintains proper hierarchy and mathematical consistency'
    };
  }

  /**
   * Validate multiple semantic tokens
   */
  validateMultiple(
    semanticTokens: SemanticToken[],
    options: SemanticValidationOptions = {}
  ): ComprehensiveValidationResult[] {
    return semanticTokens.map(token => this.validateToken(token, options));
  }

  /**
   * Get validation statistics for multiple tokens
   */
  getValidationStats(
    validationResults: ComprehensiveValidationResult[]
  ): {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
    withValidReferences: number;
    withRawValues: number;
    passRate: number;
  } {
    const total = validationResults.length;
    const passed = validationResults.filter(r => r.overall.level === 'Pass').length;
    const warnings = validationResults.filter(r => r.overall.level === 'Warning').length;
    const errors = validationResults.filter(r => r.overall.level === 'Error').length;
    const withValidReferences = validationResults.filter(r => r.details.hasValidReferences).length;
    const withRawValues = validationResults.filter(r => r.details.usesRawValues).length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    return {
      total,
      passed,
      warnings,
      errors,
      withValidReferences,
      withRawValues,
      passRate
    };
  }

  /**
   * Get primitive reference validator for direct access
   */
  getPrimitiveReferenceValidator(): PrimitiveReferenceValidator {
    return this.primitiveReferenceValidator;
  }

  /**
   * Get composition pattern validator for direct access
   */
  getCompositionPatternValidator(): CompositionPatternValidator {
    return this.compositionPatternValidator;
  }

  /**
   * Validate semantic token references against primitive tokens
   * Checks that all primitive references in semantic tokens exist in the primitive token list
   * 
   * This method validates that:
   * - All primitive token references exist in the provided primitive token list
   * - Single-reference tokens (with 'value' or 'default' property) reference valid primitives
   * - Multi-reference tokens (typography) have all required properties
   * - Multi-reference tokens reference valid primitives for each property
   * 
   * @param semantics - Array of semantic tokens to validate
   * @param primitives - Array of primitive tokens to validate against
   * @returns ValidationResult with comprehensive error messages for invalid references
   */
  validateSemanticReferences(
    semantics: SemanticToken[],
    primitives: Array<{ name: string }>
  ): ValidationResult {
    const invalidReferences: Array<{
      semanticToken: string;
      property: string;
      reference: string;
      reason: string;
    }> = [];

    // Create a set of primitive token names for fast lookup
    const primitiveNames = new Set(primitives.map(p => p.name));

    // Validate each semantic token
    for (const semantic of semantics) {
      // Skip tokens without primitiveReferences (e.g., layering tokens)
      if (!semantic.primitiveReferences) {
        continue;
      }
      
      const refs = semantic.primitiveReferences;

      // Check single-reference tokens (have 'value' or 'default' property)
      if (refs.value !== undefined) {
        if (!primitiveNames.has(refs.value)) {
          invalidReferences.push({
            semanticToken: semantic.name,
            property: 'value',
            reference: refs.value,
            reason: `Semantic token '${semantic.name}' references non-existent primitive '${refs.value}'`
          });
        }
      } else if (refs.default !== undefined) {
        if (!primitiveNames.has(refs.default)) {
          invalidReferences.push({
            semanticToken: semantic.name,
            property: 'default',
            reference: refs.default,
            reason: `Semantic token '${semantic.name}' references non-existent primitive '${refs.default}'`
          });
        }
      } else {
        // Check multi-reference tokens (typography tokens with multiple properties)
        // Required properties for typography tokens
        const requiredTypographyProps = ['fontSize', 'lineHeight', 'fontFamily', 'fontWeight', 'letterSpacing'];

        // Check if this is a typography token by category (not just by having fontSize/lineHeight)
        // Icon tokens also have fontSize and lineHeight but are not typography tokens
        const isTypographyToken = semantic.category === 'typography';

        if (isTypographyToken) {
          // Validate all required typography properties exist
          for (const prop of requiredTypographyProps) {
            if (refs[prop] === undefined) {
              invalidReferences.push({
                semanticToken: semantic.name,
                property: prop,
                reference: '',
                reason: `Typography token '${semantic.name}' missing required reference: ${prop}`
              });
            } else if (!primitiveNames.has(refs[prop])) {
              invalidReferences.push({
                semanticToken: semantic.name,
                property: prop,
                reference: refs[prop],
                reason: `Semantic token '${semantic.name}' has invalid ${prop} reference '${refs[prop]}'`
              });
            }
          }
        } else {
          // For other multi-reference tokens (including icon tokens), validate all references exist
          // UPDATED (Spec 025 F4): Support custom multiplier pattern (custom:X.XXX)
          for (const [prop, ref] of Object.entries(refs)) {
            if (typeof ref === 'string') {
              // Check if it's a custom multiplier (e.g., custom:1.231)
              const isCustomMultiplier = ref.startsWith('custom:');
              
              if (isCustomMultiplier) {
                // Validate that the custom multiplier is a valid number
                const multiplierValue = parseFloat(ref.slice('custom:'.length));
                if (isNaN(multiplierValue)) {
                  invalidReferences.push({
                    semanticToken: semantic.name,
                    property: prop,
                    reference: ref,
                    reason: `Semantic token '${semantic.name}' has invalid custom multiplier '${ref}' (must be a valid number)`
                  });
                }
                // Valid custom multiplier - continue to next reference
              } else if (!primitiveNames.has(ref)) {
                // Not a custom multiplier and not in primitive registry - invalid
                invalidReferences.push({
                  semanticToken: semantic.name,
                  property: prop,
                  reference: ref,
                  reason: `Semantic token '${semantic.name}' has invalid ${prop} reference '${ref}'`
                });
              }
            }
          }
        }
      }
    }

    // Return validation result
    if (invalidReferences.length === 0) {
      return {
        level: 'Pass',
        token: 'semantic-references',
        message: `All semantic token references are valid (${semantics.length} tokens validated)`,
        rationale: 'All semantic tokens reference existing primitive tokens',
        mathematicalReasoning: 'Semantic tokens maintain proper hierarchy by referencing valid primitive tokens'
      };
    } else {
      const errorMessages = invalidReferences.map(ref => ref.reason);
      const suggestions = [
        'Verify that all referenced primitive tokens exist in the primitive token registry',
        'Check for typos in primitive token names',
        'Ensure typography tokens include all required properties: fontSize, lineHeight, fontFamily, fontWeight, letterSpacing',
        'For custom multipliers, use format: custom:X.XXX (e.g., custom:1.231)'
      ];

      return {
        level: 'Error',
        token: 'semantic-references',
        message: `Found ${invalidReferences.length} invalid semantic token reference(s)`,
        rationale: errorMessages.join('; '),
        suggestions,
        mathematicalReasoning: 'Semantic tokens must reference valid primitive tokens to maintain system integrity and mathematical consistency'
      };
    }
  }
}
