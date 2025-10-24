/**
 * Unit tests for Border Width Mathematical Relationship Validation
 * 
 * Tests border width token validation including:
 * - borderWidth200 = borderWidth100 × 2
 * - borderWidth400 = borderWidth100 × 4
 * - Base value validation
 * - Error detection for violations
 */

import { ErrorValidator, type ErrorValidationContext } from '../ErrorValidator';
import { TokenCategory, type PrimitiveToken } from '../../types';

describe('Border Width Mathematical Relationship Validation', () => {
  let validator: ErrorValidator;

  beforeEach(() => {
    validator = new ErrorValidator();
  });

  describe('borderWidth100 validation', () => {
    it('should pass validation when borderWidth100 has correct base value', () => {
      const token: PrimitiveToken = {
        name: 'borderWidth100',
        category: TokenCategory.BORDER_WIDTH,
        baseValue: 1,
        familyBaseValue: 1,
        description: 'Base border width',
        mathematicalRelationship: 'base × 1 = 1 × 1 = 1',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 1, unit: 'px' },
          ios: { value: 1, unit: 'pt' },
          android: { value: 1, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).toBeNull();
    });

    it('should return error when borderWidth100 has incorrect base value', () => {
      const token: PrimitiveToken = {
        name: 'borderWidth100',
        category: TokenCategory.BORDER_WIDTH,
        baseValue: 2, // Should be 1
        familyBaseValue: 1,
        description: 'Base border width',
        mathematicalRelationship: 'base × 1 = 1 × 1 = 1',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 2, unit: 'px' },
          ios: { value: 2, unit: 'pt' },
          android: { value: 2, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('Error');
      expect(result?.message).toContain('Border width base value violation');
      expect(result?.rationale).toContain('expected: 1, actual: 2');
      expect(result?.suggestions).toContain('Set borderWidth100 base value to 1');
    });
  });

  describe('borderWidth200 validation', () => {
    it('should pass validation when borderWidth200 = borderWidth100 × 2', () => {
      const token: PrimitiveToken = {
        name: 'borderWidth200',
        category: TokenCategory.BORDER_WIDTH,
        baseValue: 2,
        familyBaseValue: 1,
        description: 'Emphasized border width',
        mathematicalRelationship: 'base × 2 = 1 × 2 = 2',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 2, unit: 'px' },
          ios: { value: 2, unit: 'pt' },
          android: { value: 2, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).toBeNull();
    });

    it('should return error when borderWidth200 does not equal borderWidth100 × 2', () => {
      const token: PrimitiveToken = {
        name: 'borderWidth200',
        category: TokenCategory.BORDER_WIDTH,
        baseValue: 3, // Should be 2
        familyBaseValue: 1,
        description: 'Emphasized border width',
        mathematicalRelationship: 'base × 2 = 1 × 2 = 2',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 3, unit: 'px' },
          ios: { value: 3, unit: 'pt' },
          android: { value: 3, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('Error');
      expect(result?.message).toContain('Border width mathematical relationship violation');
      expect(result?.rationale).toContain('borderWidth200 must equal borderWidth100 × 2');
      expect(result?.rationale).toContain('expected: 2, actual: 3');
      expect(result?.suggestions).toContain('Set borderWidth200 base value to 2');
      expect(result?.suggestions).toContain('Verify mathematical relationship: borderWidth200 = borderWidth100 × 2');
    });
  });

  describe('borderWidth400 validation', () => {
    it('should pass validation when borderWidth400 = borderWidth100 × 4', () => {
      const token: PrimitiveToken = {
        name: 'borderWidth400',
        category: TokenCategory.BORDER_WIDTH,
        baseValue: 4,
        familyBaseValue: 1,
        description: 'Heavy border width',
        mathematicalRelationship: 'base × 4 = 1 × 4 = 4',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 4, unit: 'px' },
          ios: { value: 4, unit: 'pt' },
          android: { value: 4, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).toBeNull();
    });

    it('should return error when borderWidth400 does not equal borderWidth100 × 4', () => {
      const token: PrimitiveToken = {
        name: 'borderWidth400',
        category: TokenCategory.BORDER_WIDTH,
        baseValue: 5, // Should be 4
        familyBaseValue: 1,
        description: 'Heavy border width',
        mathematicalRelationship: 'base × 4 = 1 × 4 = 4',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 5, unit: 'px' },
          ios: { value: 5, unit: 'pt' },
          android: { value: 5, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('Error');
      expect(result?.message).toContain('Border width mathematical relationship violation');
      expect(result?.rationale).toContain('borderWidth400 must equal borderWidth100 × 4');
      expect(result?.rationale).toContain('expected: 4, actual: 5');
      expect(result?.suggestions).toContain('Set borderWidth400 base value to 4');
      expect(result?.suggestions).toContain('Verify mathematical relationship: borderWidth400 = borderWidth100 × 4');
    });
  });

  describe('Non-border-width tokens', () => {
    it('should not validate non-border-width tokens', () => {
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base value',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const context: ErrorValidationContext = {
        token,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      // Should not trigger border width validation
      // May trigger other validations, but not border width specific
      if (result) {
        expect(result.message).not.toContain('borderWidth');
      }
    });
  });

  describe('Integration with actual border width tokens', () => {
    it('should validate actual borderWidth100 token', () => {
      const { borderWidthTokens } = require('../../tokens/BorderWidthTokens');
      
      const context: ErrorValidationContext = {
        token: borderWidthTokens.borderWidth100,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).toBeNull();
    });

    it('should validate actual borderWidth200 token', () => {
      const { borderWidthTokens } = require('../../tokens/BorderWidthTokens');
      
      const context: ErrorValidationContext = {
        token: borderWidthTokens.borderWidth200,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).toBeNull();
    });

    it('should validate actual borderWidth400 token', () => {
      const { borderWidthTokens } = require('../../tokens/BorderWidthTokens');
      
      const context: ErrorValidationContext = {
        token: borderWidthTokens.borderWidth400,
        options: {
          strictMathematics: true
        }
      };

      const result = validator.validate(context);

      expect(result).toBeNull();
    });
  });

  describe('Semantic border width token reference validation', () => {
    describe('borderDefault validation', () => {
      it('should pass validation when borderDefault references borderWidth100', () => {
        const semanticToken = {
          name: 'borderDefault',
          primitiveReferences: { value: 'borderWidth100' },
          category: 'border' as any,
          context: 'Default border width',
          description: 'Standard borders for cards, inputs at rest, buttons at rest, dividers'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth100', 'borderWidth200', 'borderWidth400']
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).toBeNull();
      });

      it('should return error when borderDefault references wrong primitive', () => {
        const semanticToken = {
          name: 'borderDefault',
          primitiveReferences: { value: 'borderWidth200' }, // Should be borderWidth100
          category: 'border' as any,
          context: 'Default border width',
          description: 'Standard borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          options: {}
        };

        const result = validator.validate(context);

        expect(result).not.toBeNull();
        expect(result?.level).toBe('Error');
        expect(result?.message).toContain('Border width semantic token reference violation');
        expect(result?.rationale).toContain('borderDefault must reference borderWidth100');
        expect(result?.rationale).toContain('actual: borderWidth200');
        expect(result?.suggestions).toContain('Update borderDefault to reference borderWidth100');
      });

      it('should return error when borderDefault has no reference', () => {
        const semanticToken = {
          name: 'borderDefault',
          primitiveReferences: { value: '' },
          category: 'border' as any,
          context: 'Default border width',
          description: 'Standard borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          options: {}
        };

        const result = validator.validate(context);

        expect(result).not.toBeNull();
        expect(result?.level).toBe('Error');
        expect(result?.message).toContain('Border width semantic token reference violation');
        expect(result?.rationale).toContain('borderDefault must reference borderWidth100');
        expect(result?.rationale).toContain('actual: none');
      });
    });

    describe('borderEmphasis validation', () => {
      it('should pass validation when borderEmphasis references borderWidth200', () => {
        const semanticToken = {
          name: 'borderEmphasis',
          primitiveReferences: { value: 'borderWidth200' },
          category: 'border' as any,
          context: 'Emphasized border width',
          description: 'Emphasized borders for inputs on focus, selected cards, active buttons'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth100', 'borderWidth200', 'borderWidth400']
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).toBeNull();
      });

      it('should return error when borderEmphasis references wrong primitive', () => {
        const semanticToken = {
          name: 'borderEmphasis',
          primitiveReferences: { value: 'borderWidth100' }, // Should be borderWidth200
          category: 'border' as any,
          context: 'Emphasized border width',
          description: 'Emphasized borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          options: {}
        };

        const result = validator.validate(context);

        expect(result).not.toBeNull();
        expect(result?.level).toBe('Error');
        expect(result?.message).toContain('Border width semantic token reference violation');
        expect(result?.rationale).toContain('borderEmphasis must reference borderWidth200');
        expect(result?.rationale).toContain('actual: borderWidth100');
        expect(result?.suggestions).toContain('Update borderEmphasis to reference borderWidth200');
      });
    });

    describe('borderHeavy validation', () => {
      it('should pass validation when borderHeavy references borderWidth400', () => {
        const semanticToken = {
          name: 'borderHeavy',
          primitiveReferences: { value: 'borderWidth400' },
          category: 'border' as any,
          context: 'Heavy border width',
          description: 'Heavy borders for strong visual weight'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth100', 'borderWidth200', 'borderWidth400']
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).toBeNull();
      });

      it('should return error when borderHeavy references wrong primitive', () => {
        const semanticToken = {
          name: 'borderHeavy',
          primitiveReferences: { value: 'borderWidth200' }, // Should be borderWidth400
          category: 'border' as any,
          context: 'Heavy border width',
          description: 'Heavy borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          options: {}
        };

        const result = validator.validate(context);

        expect(result).not.toBeNull();
        expect(result?.level).toBe('Error');
        expect(result?.message).toContain('Border width semantic token reference violation');
        expect(result?.rationale).toContain('borderHeavy must reference borderWidth400');
        expect(result?.rationale).toContain('actual: borderWidth200');
        expect(result?.suggestions).toContain('Update borderHeavy to reference borderWidth400');
      });
    });

    describe('Primitive token existence validation', () => {
      it('should return error when referenced primitive token does not exist', () => {
        const semanticToken = {
          name: 'borderDefault',
          primitiveReferences: { value: 'borderWidth100' },
          category: 'border' as any,
          context: 'Default border width',
          description: 'Standard borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth200', 'borderWidth400'] // borderWidth100 missing
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).not.toBeNull();
        expect(result?.level).toBe('Error');
        // General token reference validation catches this first
        expect(result?.message).toContain('Invalid primitive token reference');
        expect(result?.rationale).toContain('borderWidth100');
        expect(result?.suggestions).toContain('Reference existing primitive token(s)');
      });
    });

    describe('Integration with actual semantic border width tokens', () => {
      it('should validate actual borderDefault token', () => {
        const { borderDefault } = require('../../tokens/semantic/BorderWidthTokens');
        
        const semanticToken = {
          name: 'borderDefault',
          primitiveReferences: borderDefault,
          category: 'border' as any,
          context: 'Default border width',
          description: 'Standard borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth100', 'borderWidth200', 'borderWidth400']
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).toBeNull();
      });

      it('should validate actual borderEmphasis token', () => {
        const { borderEmphasis } = require('../../tokens/semantic/BorderWidthTokens');
        
        const semanticToken = {
          name: 'borderEmphasis',
          primitiveReferences: borderEmphasis,
          category: 'border' as any,
          context: 'Emphasized border width',
          description: 'Emphasized borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth100', 'borderWidth200', 'borderWidth400']
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).toBeNull();
      });

      it('should validate actual borderHeavy token', () => {
        const { borderHeavy } = require('../../tokens/semantic/BorderWidthTokens');
        
        const semanticToken = {
          name: 'borderHeavy',
          primitiveReferences: borderHeavy,
          category: 'border' as any,
          context: 'Heavy border width',
          description: 'Heavy borders'
        };

        const context: ErrorValidationContext = {
          token: semanticToken,
          registryContext: {
            availablePrimitiveTokens: ['borderWidth100', 'borderWidth200', 'borderWidth400']
          },
          options: {
            validateReferences: true
          }
        };

        const result = validator.validate(context);

        expect(result).toBeNull();
      });
    });
  });
});
