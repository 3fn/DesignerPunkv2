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

export class SemanticTokenValidator {
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
   * Perform comprehensive validation on a semantic token
   */
  validate(
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
    return semanticTokens.map(token => this.validate(token, options));
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
}
