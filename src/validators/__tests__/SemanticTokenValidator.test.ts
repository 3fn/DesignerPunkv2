/**
 * @category evergreen
 * @purpose Verify SemanticToken validation catches invalid patterns and enforces rules
 */
/**
 * Semantic Token Validator Tests
 * 
 * Comprehensive test coverage for semantic token validation including
 * primitive reference validation, composition patterns, and validation statistics.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { SemanticTokenValidator } from '../SemanticTokenValidator';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';
import { TokenCategory } from '../../types/PrimitiveToken';
import type { PrimitiveToken } from '../../types/PrimitiveToken';

describe('SemanticTokenValidator', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;
  let validator: SemanticTokenValidator;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);

    // Register test primitive tokens
    const space100: PrimitiveToken = {
      name: 'space100',
      category: TokenCategory.SPACING,
      baseValue: 8,
      familyBaseValue: 8,
      description: 'Base spacing',
      mathematicalRelationship: 'base × 1',
      baselineGridAlignment: true,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 8, unit: 'px' },
        ios: { value: 8, unit: 'pt' },
        android: { value: 8, unit: 'dp' }
      }
    };

    const space200: PrimitiveToken = {
      name: 'space200',
      category: TokenCategory.SPACING,
      baseValue: 16,
      familyBaseValue: 8,
      description: 'Double spacing',
      mathematicalRelationship: 'base × 2',
      baselineGridAlignment: true,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 16, unit: 'px' },
        ios: { value: 16, unit: 'pt' },
        android: { value: 16, unit: 'dp' }
      }
    };

    primitiveRegistry.register(space100);
    primitiveRegistry.register(space200);
  });

  describe('Comprehensive Validation', () => {
    it('should validate semantic token with valid primitive reference', () => {
      const semanticToken: SemanticToken = {
        name: 'space.grouped.normal',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Normal grouped spacing',
        context: 'Spacing between grouped elements'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Pass');
      expect(result.primitiveReferences?.level).toBe('Pass');
      expect(result.details.hasValidReferences).toBe(true);
      expect(result.details.referenceCount).toBe(1);
    });

    it('should validate semantic token with multiple primitive references', () => {
      const semanticToken: SemanticToken = {
        name: 'space.multi',
        category: SemanticCategory.SPACING,
        primitiveReferences: {
          horizontal: 'space100',
          vertical: 'space200'
        },
        description: 'Multi-reference spacing',
        context: 'Different horizontal and vertical spacing'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Pass');
      expect(result.details.referenceCount).toBe(2);
      expect(result.details.hasValidReferences).toBe(true);
    });

    it('should detect invalid primitive references', () => {
      const semanticToken: SemanticToken = {
        name: 'space.invalid',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'nonexistent' },
        description: 'Invalid reference',
        context: 'Test invalid'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Error');
      expect(result.primitiveReferences?.level).toBe('Error');
      expect(result.primitiveReferences?.message).toContain('non-existent');
      expect(result.details.hasValidReferences).toBe(false);
    });

    it('should detect missing primitive references', () => {
      const semanticToken: SemanticToken = {
        name: 'space.empty',
        category: SemanticCategory.SPACING,
        primitiveReferences: {},
        description: 'Empty references',
        context: 'Test empty'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Error');
      expect(result.primitiveReferences?.message).toContain('must reference primitive tokens');
    });

    it('should allow empty references with allowEmptyReferences option', () => {
      const semanticToken: SemanticToken = {
        name: 'space.empty',
        category: SemanticCategory.SPACING,
        primitiveReferences: {},
        description: 'Empty references',
        context: 'Test empty'
      };

      const result = validator.validate(semanticToken, { allowEmptyReferences: true });

      expect(result.overall.level).toBe('Warning');
      expect(result.primitiveReferences?.level).toBe('Warning');
    });

    it('should validate semantic token structure', () => {
      const semanticToken: SemanticToken = {
        name: 'space.valid',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Valid structure',
        context: 'Test structure'
      };

      const result = validator.validate(semanticToken);

      expect(result.compositionPattern?.level).toBe('Pass');
      expect(result.compositionPattern?.message).toContain('structure is valid');
    });

    it('should warn about missing description', () => {
      const semanticToken: SemanticToken = {
        name: 'space.nodesc',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: '',
        context: 'Test no description'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Warning');
      expect(result.compositionPattern?.level).toBe('Warning');
      expect(result.compositionPattern?.message).toContain('missing description');
    });

    it('should error on missing name', () => {
      const semanticToken: SemanticToken = {
        name: '',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Test',
        context: 'Test'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Error');
      expect(result.compositionPattern?.message).toContain('missing required name');
    });
  });

  describe('Validation Options', () => {
    it('should skip primitive reference validation when disabled', () => {
      const semanticToken: SemanticToken = {
        name: 'space.skip',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'nonexistent' },
        description: 'Skip validation',
        context: 'Test skip'
      };

      const result = validator.validate(semanticToken, {
        validatePrimitiveReferences: false
      });

      expect(result.primitiveReferences).toBeUndefined();
      expect(result.overall.level).toBe('Pass');
    });

    it('should skip composition pattern validation when disabled', () => {
      const semanticToken: SemanticToken = {
        name: '',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Test',
        context: 'Test'
      };

      const result = validator.validate(semanticToken, {
        validateCompositionPatterns: false
      });

      expect(result.compositionPattern).toBeUndefined();
    });

    it('should use strict validation by default', () => {
      const semanticToken: SemanticToken = {
        name: 'space.strict',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'nonexistent' },
        description: 'Strict test',
        context: 'Test'
      };

      const result = validator.validate(semanticToken);

      expect(result.overall.level).toBe('Error');
    });
  });

  describe('Multiple Token Validation', () => {
    it('should validate multiple semantic tokens', () => {
      const tokens: SemanticToken[] = [
        {
          name: 'space.valid1',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space100' },
          description: 'Valid 1',
          context: 'Test'
        },
        {
          name: 'space.valid2',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space200' },
          description: 'Valid 2',
          context: 'Test'
        },
        {
          name: 'space.invalid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'nonexistent' },
          description: 'Invalid',
          context: 'Test'
        }
      ];

      const results = validator.validateMultiple(tokens);

      expect(results).toHaveLength(3);
      expect(results[0].overall.level).toBe('Pass');
      expect(results[1].overall.level).toBe('Pass');
      expect(results[2].overall.level).toBe('Error');
    });
  });

  describe('Validation Statistics', () => {
    it('should calculate validation statistics', () => {
      const tokens: SemanticToken[] = [
        {
          name: 'space.pass1',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space100' },
          description: 'Pass 1',
          context: 'Test'
        },
        {
          name: 'space.pass2',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space200' },
          description: 'Pass 2',
          context: 'Test'
        },
        {
          name: 'space.warning',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space100' },
          description: '',
          context: 'Test'
        },
        {
          name: 'space.error',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'nonexistent' },
          description: 'Error',
          context: 'Test'
        }
      ];

      const results = validator.validateMultiple(tokens);
      const stats = validator.getValidationStats(results);

      expect(stats.total).toBe(4);
      expect(stats.passed).toBe(2);
      expect(stats.warnings).toBe(1);
      expect(stats.errors).toBe(1);
      expect(stats.passRate).toBe(50);
    });

    it('should track valid references in statistics', () => {
      const tokens: SemanticToken[] = [
        {
          name: 'space.valid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space100' },
          description: 'Valid',
          context: 'Test'
        },
        {
          name: 'space.invalid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'nonexistent' },
          description: 'Invalid',
          context: 'Test'
        }
      ];

      const results = validator.validateMultiple(tokens);
      const stats = validator.getValidationStats(results);

      expect(stats.withValidReferences).toBe(1);
    });

    it('should handle empty validation results', () => {
      const stats = validator.getValidationStats([]);

      expect(stats.total).toBe(0);
      expect(stats.passed).toBe(0);
      expect(stats.passRate).toBe(0);
    });
  });

  describe('Validator Access', () => {
    it('should provide access to primitive reference validator', () => {
      const primitiveValidator = validator.getPrimitiveReferenceValidator();

      expect(primitiveValidator).toBeDefined();
      expect(typeof primitiveValidator.validate).toBe('function');
    });

    it('should provide access to composition pattern validator', () => {
      const compositionValidator = validator.getCompositionPatternValidator();

      expect(compositionValidator).toBeDefined();
      expect(typeof compositionValidator.validateTokenUsage).toBe('function');
    });
  });

  describe('Validation Details', () => {
    it('should include validation timestamp in details', () => {
      const semanticToken: SemanticToken = {
        name: 'space.test',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Test',
        context: 'Test'
      };

      const result = validator.validate(semanticToken);

      expect(result.details.validationTimestamp).toBeInstanceOf(Date);
    });

    it('should track reference count in details', () => {
      const semanticToken: SemanticToken = {
        name: 'space.multi',
        category: SemanticCategory.SPACING,
        primitiveReferences: {
          horizontal: 'space100',
          vertical: 'space200'
        },
        description: 'Multi',
        context: 'Test'
      };

      const result = validator.validate(semanticToken);

      expect(result.details.referenceCount).toBe(2);
    });

    it('should indicate when token has valid references', () => {
      const semanticToken: SemanticToken = {
        name: 'space.valid',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Valid',
        context: 'Test'
      };

      const result = validator.validate(semanticToken);

      expect(result.details.hasValidReferences).toBe(true);
    });
  });

  describe('validateSemanticReferences', () => {
    it('should validate all semantic tokens with valid references', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'space.grouped.normal',
          category: SemanticCategory.SPACING,
          primitiveReferences: { value: 'space100' },
          description: 'Normal grouped spacing',
          context: 'Test'
        },
        {
          name: 'space.grouped.large',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space200' },
          description: 'Large grouped spacing',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' },
        { name: 'space200' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Pass');
      expect(result.message).toContain('All semantic token references are valid');
      expect(result.message).toContain('2 tokens validated');
    });

    it('should detect invalid single-reference token with value property', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'space.invalid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { value: 'nonexistent' },
          description: 'Invalid reference',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Error');
      expect(result.message).toContain('1 invalid semantic token reference');
      expect(result.rationale).toContain("references non-existent primitive 'nonexistent'");
    });

    it('should detect invalid single-reference token with default property', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'space.invalid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'missing' },
          description: 'Invalid reference',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Error');
      expect(result.rationale).toContain("references non-existent primitive 'missing'");
    });

    it('should validate typography tokens with all required properties', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'typography.body',
          category: SemanticCategory.TYPOGRAPHY,
          primitiveReferences: {
            fontSize: 'fontSize100',
            lineHeight: 'lineHeight100',
            fontFamily: 'fontFamily.system',
            fontWeight: 'fontWeight400',
            letterSpacing: 'letterSpacing000'
          },
          description: 'Body typography',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'fontSize100' },
        { name: 'lineHeight100' },
        { name: 'fontFamily.system' },
        { name: 'fontWeight400' },
        { name: 'letterSpacing000' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Pass');
    });

    it('should detect missing required typography properties', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'typography.incomplete',
          category: SemanticCategory.TYPOGRAPHY,
          primitiveReferences: {
            fontSize: 'fontSize100',
            lineHeight: 'lineHeight100'
            // Missing fontFamily, fontWeight, letterSpacing
          },
          description: 'Incomplete typography',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'fontSize100' },
        { name: 'lineHeight100' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Error');
      expect(result.rationale).toContain('missing required reference: fontFamily');
      expect(result.rationale).toContain('missing required reference: fontWeight');
      expect(result.rationale).toContain('missing required reference: letterSpacing');
    });

    it('should detect invalid typography property references', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'typography.invalid',
          category: SemanticCategory.TYPOGRAPHY,
          primitiveReferences: {
            fontSize: 'invalidFontSize',
            lineHeight: 'lineHeight100',
            fontFamily: 'fontFamily.system',
            fontWeight: 'fontWeight400',
            letterSpacing: 'letterSpacing000'
          },
          description: 'Invalid typography',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'fontSize100' },
        { name: 'lineHeight100' },
        { name: 'fontFamily.system' },
        { name: 'fontWeight400' },
        { name: 'letterSpacing000' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Error');
      expect(result.rationale).toContain("has invalid fontSize reference 'invalidFontSize'");
    });

    it('should validate multi-reference tokens (non-typography)', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'custom.multi',
          category: SemanticCategory.SPACING,
          primitiveReferences: {
            horizontal: 'space100',
            vertical: 'space200'
          },
          description: 'Multi-reference',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' },
        { name: 'space200' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Pass');
    });

    it('should detect invalid multi-reference token properties', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'custom.invalid',
          category: SemanticCategory.SPACING,
          primitiveReferences: {
            horizontal: 'space100',
            vertical: 'invalidSpace'
          },
          description: 'Invalid multi-reference',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Error');
      expect(result.rationale).toContain("has invalid vertical reference 'invalidSpace'");
    });

    it('should skip tokens without primitiveReferences', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'zIndex.modal',
          category: SemanticCategory.LAYERING,
          primitiveReferences: undefined as any,
          description: 'Modal z-index',
          context: 'Test'
        },
        {
          name: 'space.valid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { value: 'space100' },
          description: 'Valid spacing',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Pass');
      expect(result.message).toContain('2 tokens validated');
    });

    it('should provide helpful suggestions for invalid references', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'space.invalid',
          category: SemanticCategory.SPACING,
          primitiveReferences: { value: 'nonexistent' },
          description: 'Invalid',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'space100' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toContain('Verify that all referenced primitive tokens exist in the primitive token registry');
      expect(result.suggestions).toContain('Check for typos in primitive token names');
    });

    it('should handle empty semantic token array', () => {
      const result = validator.validateSemanticReferences([], [{ name: 'space100' }]);

      expect(result.level).toBe('Pass');
      expect(result.message).toContain('0 tokens validated');
    });

    it('should handle multiple invalid references in single token', () => {
      const semantics: SemanticToken[] = [
        {
          name: 'typography.multipleErrors',
          category: SemanticCategory.TYPOGRAPHY,
          primitiveReferences: {
            fontSize: 'invalidFontSize',
            lineHeight: 'invalidLineHeight',
            fontFamily: 'fontFamily.system',
            fontWeight: 'fontWeight400',
            letterSpacing: 'letterSpacing000'
          },
          description: 'Multiple errors',
          context: 'Test'
        }
      ];

      const primitives = [
        { name: 'fontFamily.system' },
        { name: 'fontWeight400' },
        { name: 'letterSpacing000' }
      ];

      const result = validator.validateSemanticReferences(semantics, primitives);

      expect(result.level).toBe('Error');
      expect(result.message).toContain('2 invalid semantic token reference');
      expect(result.rationale).toContain('invalidFontSize');
      expect(result.rationale).toContain('invalidLineHeight');
    });
  });
});
