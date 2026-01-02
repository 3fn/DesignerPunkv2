/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate Stemma System component naming convention rules
 */

/**
 * Stemma Component Naming Validator Tests
 *
 * Tests the component naming convention validation for the Stemma System.
 * Validates:
 * - [Family]-[Type]-[Variant] pattern (3 segments)
 * - [Family]-[Type] pattern (2 segments)
 * - [Family]-Base pattern (2 segments, Base as Type)
 * - PascalCase enforcement
 * - "Base" suffix detection for primitives
 * - Clear error messages for violations
 *
 * @see .kiro/steering/stemma-system-principles.md
 * @see Requirements: R8 (Health Guardrails and Validation)
 * @validates Requirements R8.1, R8.5, R8.6
 */

import {
  validateComponentName,
  validateComponentNames,
  isPascalCase,
  toPascalCase,
  determineComponentType,
  isPrimitiveComponent,
  isSemanticComponent,
  suggestCorrectedName,
  formatValidationErrors,
  formatValidationWarnings,
  RESERVED_KEYWORDS,
  KNOWN_FAMILIES,
  ComponentNameSegments
} from '../StemmaComponentNamingValidator';

describe('Stemma Component Naming Validator', () => {
  describe('Valid Component Names', () => {
    describe('3-segment pattern: [Family]-[Type]-[Variant]', () => {
      const validNames = [
        'Input-Text-Base',
        'Input-Text-Email',
        'Input-Text-Password',
        'Input-Text-PhoneNumber',
        'Avatar-User-Profile',
        'Avatar-User-Thumbnail',
        'Modal-Dialog-Base',
        'Badge-Status-Base',
        'DataDisplay-Text-Base',
        'Loading-Spinner-Base',
        'Nav-Link-Base',
      ];

      test.each(validNames)('"%s" should be valid', (name) => {
        const result = validateComponentName(name);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.segments).toBeDefined();
        expect(result.segments?.family).toBeDefined();
        expect(result.segments?.type).toBeDefined();
        expect(result.segments?.variant).toBeDefined();
      });
    });

    describe('2-segment pattern: [Family]-[Type]', () => {
      const validNames = [
        'Button-CTA',
        'Button-Icon',
        'Container-Base',
        'Icon-Base',
        'Divider-Base',
      ];

      test.each(validNames)('"%s" should be valid', (name) => {
        const result = validateComponentName(name);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.segments).toBeDefined();
        expect(result.segments?.family).toBeDefined();
        expect(result.segments?.type).toBeDefined();
        expect(result.segments?.variant).toBeUndefined();
      });
    });
  });

  describe('Invalid Component Names', () => {
    describe('Missing hyphens', () => {
      test('single word should be invalid', () => {
        const result = validateComponentName('InputTextEmail');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'MISSING_HYPHENS')).toBe(true);
      });

      test('camelCase without hyphens should be invalid', () => {
        const result = validateComponentName('buttonCTA');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'MISSING_HYPHENS')).toBe(true);
      });
    });

    describe('Wrong case', () => {
      test('all lowercase should be invalid', () => {
        const result = validateComponentName('input-text-email');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'WRONG_CASE')).toBe(true);
      });

      test('all uppercase should be invalid', () => {
        const result = validateComponentName('INPUT-TEXT-EMAIL');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'WRONG_CASE')).toBe(true);
      });

      test('inconsistent case should be invalid', () => {
        const result = validateComponentName('Input-text-Email');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'WRONG_CASE')).toBe(true);
      });
    });

    describe('Too many segments', () => {
      test('4 segments should be invalid', () => {
        const result = validateComponentName('Input-Text-Email-Validated');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'TOO_MANY_SEGMENTS')).toBe(true);
      });

      test('5 segments should be invalid', () => {
        const result = validateComponentName('Input-Text-Email-Validated-Extra');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'TOO_MANY_SEGMENTS')).toBe(true);
      });
    });

    describe('Too few segments', () => {
      test('1 segment should be invalid', () => {
        const result = validateComponentName('Input');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'MISSING_HYPHENS')).toBe(true);
      });
    });

    describe('Empty segments', () => {
      test('consecutive hyphens should be invalid', () => {
        const result = validateComponentName('Input--Email');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'EMPTY_SEGMENT')).toBe(true);
      });

      test('trailing hyphen should be invalid', () => {
        const result = validateComponentName('Input-Text-');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'EMPTY_SEGMENT')).toBe(true);
      });

      test('leading hyphen should be invalid', () => {
        const result = validateComponentName('-Input-Text');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'EMPTY_SEGMENT')).toBe(true);
      });
    });

    describe('Invalid characters', () => {
      test('underscores should be invalid', () => {
        const result = validateComponentName('Input_Text_Email');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'INVALID_CHARACTERS')).toBe(true);
      });

      test('dots should be invalid', () => {
        const result = validateComponentName('Input.Text.Email');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'INVALID_CHARACTERS')).toBe(true);
      });

      test('spaces should be invalid', () => {
        const result = validateComponentName('Input Text Email');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'INVALID_CHARACTERS')).toBe(true);
      });
    });

    describe('Reserved keyword misuse', () => {
      test('Abstract should suggest using Base', () => {
        const result = validateComponentName('Input-Text-Abstract');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'RESERVED_KEYWORD_MISUSE')).toBe(true);
      });

      test('Core should suggest using Base', () => {
        const result = validateComponentName('Input-Core');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'RESERVED_KEYWORD_MISUSE')).toBe(true);
      });

      test('Default should suggest using Base', () => {
        const result = validateComponentName('Button-Default');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'RESERVED_KEYWORD_MISUSE')).toBe(true);
      });

      test('Base should be allowed', () => {
        const result = validateComponentName('Input-Text-Base');
        expect(result.valid).toBe(true);
        expect(result.errors.some(e => e.code === 'RESERVED_KEYWORD_MISUSE')).toBe(false);
      });
    });

    describe('Empty name', () => {
      test('empty string should be invalid', () => {
        const result = validateComponentName('');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'EMPTY_SEGMENT')).toBe(true);
      });

      test('whitespace only should be invalid', () => {
        const result = validateComponentName('   ');
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.code === 'EMPTY_SEGMENT')).toBe(true);
      });
    });
  });

  describe('Component Type Detection', () => {
    describe('Primitive components (Base)', () => {
      test('Input-Text-Base should be primitive', () => {
        const result = validateComponentName('Input-Text-Base');
        expect(result.componentType).toBe('primitive');
      });

      test('Container-Base should be primitive', () => {
        const result = validateComponentName('Container-Base');
        expect(result.componentType).toBe('primitive');
      });

      test('Icon-Base should be primitive', () => {
        const result = validateComponentName('Icon-Base');
        expect(result.componentType).toBe('primitive');
      });

      test('Modal-Dialog-Base should be primitive', () => {
        const result = validateComponentName('Modal-Dialog-Base');
        expect(result.componentType).toBe('primitive');
      });
    });

    describe('Semantic components', () => {
      test('Input-Text-Email should be semantic', () => {
        const result = validateComponentName('Input-Text-Email');
        expect(result.componentType).toBe('semantic');
      });

      test('Input-Text-Password should be semantic', () => {
        const result = validateComponentName('Input-Text-Password');
        expect(result.componentType).toBe('semantic');
      });

      test('Avatar-User-Profile should be semantic', () => {
        const result = validateComponentName('Avatar-User-Profile');
        expect(result.componentType).toBe('semantic');
      });
    });

    describe('Standalone components', () => {
      test('Button-CTA should be standalone', () => {
        const result = validateComponentName('Button-CTA');
        expect(result.componentType).toBe('standalone');
      });

      test('Button-Icon should be standalone', () => {
        const result = validateComponentName('Button-Icon');
        expect(result.componentType).toBe('standalone');
      });
    });
  });

  describe('isPrimitiveComponent helper', () => {
    test('should return true for primitive components', () => {
      expect(isPrimitiveComponent('Input-Text-Base')).toBe(true);
      expect(isPrimitiveComponent('Container-Base')).toBe(true);
      expect(isPrimitiveComponent('Icon-Base')).toBe(true);
    });

    test('should return false for semantic components', () => {
      expect(isPrimitiveComponent('Input-Text-Email')).toBe(false);
      expect(isPrimitiveComponent('Input-Text-Password')).toBe(false);
    });

    test('should return false for standalone components', () => {
      expect(isPrimitiveComponent('Button-CTA')).toBe(false);
    });

    test('should return false for invalid names', () => {
      expect(isPrimitiveComponent('invalid')).toBe(false);
    });
  });

  describe('isSemanticComponent helper', () => {
    test('should return true for semantic components', () => {
      expect(isSemanticComponent('Input-Text-Email')).toBe(true);
      expect(isSemanticComponent('Input-Text-Password')).toBe(true);
      expect(isSemanticComponent('Avatar-User-Profile')).toBe(true);
    });

    test('should return false for primitive components', () => {
      expect(isSemanticComponent('Input-Text-Base')).toBe(false);
      expect(isSemanticComponent('Container-Base')).toBe(false);
    });

    test('should return false for standalone components', () => {
      expect(isSemanticComponent('Button-CTA')).toBe(false);
    });

    test('should return false for invalid names', () => {
      expect(isSemanticComponent('invalid')).toBe(false);
    });
  });

  describe('isPascalCase helper', () => {
    test('should return true for valid PascalCase', () => {
      expect(isPascalCase('Input')).toBe(true);
      expect(isPascalCase('TextEmail')).toBe(true);
      expect(isPascalCase('PhoneNumber')).toBe(true);
      expect(isPascalCase('CTA')).toBe(true);
      expect(isPascalCase('A')).toBe(true);
    });

    test('should return false for camelCase', () => {
      expect(isPascalCase('input')).toBe(false);
      expect(isPascalCase('textEmail')).toBe(false);
    });

    test('should return false for all uppercase (except single char)', () => {
      expect(isPascalCase('INPUT')).toBe(false);
      expect(isPascalCase('TEXT')).toBe(false);
    });

    test('should return false for snake_case', () => {
      expect(isPascalCase('text_email')).toBe(false);
      expect(isPascalCase('Text_Email')).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isPascalCase('')).toBe(false);
    });
  });

  describe('toPascalCase helper', () => {
    test('should convert camelCase to PascalCase', () => {
      expect(toPascalCase('textEmail')).toBe('TextEmail');
      expect(toPascalCase('phoneNumber')).toBe('PhoneNumber');
    });

    test('should convert lowercase to PascalCase', () => {
      expect(toPascalCase('input')).toBe('Input');
      expect(toPascalCase('text')).toBe('Text');
    });

    test('should convert snake_case to PascalCase', () => {
      expect(toPascalCase('text_email')).toBe('TextEmail');
      expect(toPascalCase('phone_number')).toBe('PhoneNumber');
    });

    test('should convert kebab-case to PascalCase', () => {
      expect(toPascalCase('text-email')).toBe('TextEmail');
      expect(toPascalCase('phone-number')).toBe('PhoneNumber');
    });

    test('should preserve already PascalCase', () => {
      expect(toPascalCase('Input')).toBe('Input');
      expect(toPascalCase('TextEmail')).toBe('TextEmail');
    });
  });

  describe('determineComponentType helper', () => {
    test('should identify primitive with Base as variant', () => {
      const segments: ComponentNameSegments = {
        family: 'Input',
        type: 'Text',
        variant: 'Base'
      };
      expect(determineComponentType(segments)).toBe('primitive');
    });

    test('should identify primitive with Base as type', () => {
      const segments: ComponentNameSegments = {
        family: 'Container',
        type: 'Base'
      };
      expect(determineComponentType(segments)).toBe('primitive');
    });

    test('should identify semantic with non-Base variant', () => {
      const segments: ComponentNameSegments = {
        family: 'Input',
        type: 'Text',
        variant: 'Email'
      };
      expect(determineComponentType(segments)).toBe('semantic');
    });

    test('should identify standalone with no variant', () => {
      const segments: ComponentNameSegments = {
        family: 'Button',
        type: 'CTA'
      };
      expect(determineComponentType(segments)).toBe('standalone');
    });
  });

  describe('suggestCorrectedName helper', () => {
    test('should suggest correction for camelCase', () => {
      expect(suggestCorrectedName('inputTextEmail')).toBe('Input-Text-Email');
      expect(suggestCorrectedName('buttonCTA')).toBe('Button-CTA');
    });

    test('should suggest correction for underscores', () => {
      expect(suggestCorrectedName('input_text_email')).toBe('Input-Text-Email');
      expect(suggestCorrectedName('button_cta')).toBe('Button-Cta');
    });

    test('should suggest correction for lowercase with hyphens', () => {
      expect(suggestCorrectedName('input-text-email')).toBe('Input-Text-Email');
      expect(suggestCorrectedName('button-cta')).toBe('Button-Cta');
    });

    test('should return undefined for already correct names', () => {
      expect(suggestCorrectedName('Input-Text-Email')).toBeUndefined();
      expect(suggestCorrectedName('Button-CTA')).toBeUndefined();
    });
  });

  describe('Warnings', () => {
    test('should warn for unknown family names', () => {
      const result = validateComponentName('Custom-Type-Variant');
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.code === 'UNUSUAL_FAMILY_NAME')).toBe(true);
    });

    test('should warn for long segment names', () => {
      const result = validateComponentName('Input-VeryLongTypeNameThatExceedsTwentyCharacters-Base');
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.code === 'LONG_SEGMENT_NAME')).toBe(true);
    });

    test('should not warn for known families', () => {
      const result = validateComponentName('Input-Text-Email');
      expect(result.warnings.some(w => w.code === 'UNUSUAL_FAMILY_NAME')).toBe(false);
    });
  });

  describe('Batch Validation', () => {
    test('should validate multiple names', () => {
      const names = [
        'Input-Text-Base',
        'Input-Text-Email',
        'invalid',
        'Button-CTA',
        'input-text-password'
      ];

      const { results, summary } = validateComponentNames(names);

      expect(results.size).toBe(5);
      expect(summary.total).toBe(5);
      expect(summary.valid).toBe(3);
      expect(summary.invalid).toBe(2);
      expect(summary.primitives).toBe(1);
      expect(summary.semantics).toBe(1);
      expect(summary.standalones).toBe(1);
    });
  });

  describe('Error Message Formatting', () => {
    test('should format valid result correctly', () => {
      const result = validateComponentName('Input-Text-Email');
      const formatted = formatValidationErrors(result);
      expect(formatted).toContain('✅');
      expect(formatted).toContain('Input-Text-Email');
      expect(formatted).toContain('semantic');
    });

    test('should format invalid result with errors', () => {
      const result = validateComponentName('invalid');
      const formatted = formatValidationErrors(result);
      expect(formatted).toContain('❌');
      expect(formatted).toContain('invalid');
      expect(formatted).toContain('→');
    });

    test('should include suggestion when available', () => {
      const result = validateComponentName('inputTextEmail');
      const formatted = formatValidationErrors(result);
      expect(formatted).toContain('💡');
      expect(formatted).toContain('Suggestion');
    });
  });

  describe('Warning Message Formatting', () => {
    test('should format warnings correctly', () => {
      const result = validateComponentName('Custom-Type-Variant');
      const formatted = formatValidationWarnings(result);
      expect(formatted).toContain('⚠️');
      expect(formatted).toContain('Custom');
    });

    test('should return empty string for no warnings', () => {
      const result = validateComponentName('Input-Text-Email');
      const formatted = formatValidationWarnings(result);
      expect(formatted).toBe('');
    });
  });

  describe('Constants', () => {
    test('RESERVED_KEYWORDS should include expected values', () => {
      expect(RESERVED_KEYWORDS).toContain('Base');
      expect(RESERVED_KEYWORDS).toContain('Abstract');
      expect(RESERVED_KEYWORDS).toContain('Core');
      expect(RESERVED_KEYWORDS).toContain('Default');
    });

    test('KNOWN_FAMILIES should include all 11 families', () => {
      expect(KNOWN_FAMILIES).toContain('Input');
      expect(KNOWN_FAMILIES).toContain('Button');
      expect(KNOWN_FAMILIES).toContain('Container');
      expect(KNOWN_FAMILIES).toContain('Icon');
      expect(KNOWN_FAMILIES).toContain('Modal');
      expect(KNOWN_FAMILIES).toContain('Avatar');
      expect(KNOWN_FAMILIES).toContain('Badge');
      expect(KNOWN_FAMILIES).toContain('DataDisplay');
      expect(KNOWN_FAMILIES).toContain('Divider');
      expect(KNOWN_FAMILIES).toContain('Loading');
      expect(KNOWN_FAMILIES).toContain('Nav');
      expect(KNOWN_FAMILIES).toHaveLength(11);
    });
  });

  describe('Real-World Component Names', () => {
    describe('Existing components in the codebase', () => {
      const existingComponents = [
        'Button-CTA',
        'Container-Base',
        'Icon-Base',
        'Input-Text-Base',
        'Input-Text-Email',
        'Input-Text-Password',
        'Input-Text-PhoneNumber',
      ];

      test.each(existingComponents)('"%s" should be valid', (name) => {
        const result = validateComponentName(name);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('Component type classification for existing components', () => {
      test('Button-CTA should be standalone', () => {
        const result = validateComponentName('Button-CTA');
        expect(result.componentType).toBe('standalone');
      });

      test('Container-Base should be primitive', () => {
        const result = validateComponentName('Container-Base');
        expect(result.componentType).toBe('primitive');
      });

      test('Icon-Base should be primitive', () => {
        const result = validateComponentName('Icon-Base');
        expect(result.componentType).toBe('primitive');
      });

      test('Input-Text-Base should be primitive', () => {
        const result = validateComponentName('Input-Text-Base');
        expect(result.componentType).toBe('primitive');
      });

      test('Input-Text-Email should be semantic', () => {
        const result = validateComponentName('Input-Text-Email');
        expect(result.componentType).toBe('semantic');
      });

      test('Input-Text-Password should be semantic', () => {
        const result = validateComponentName('Input-Text-Password');
        expect(result.componentType).toBe('semantic');
      });

      test('Input-Text-PhoneNumber should be semantic', () => {
        const result = validateComponentName('Input-Text-PhoneNumber');
        expect(result.componentType).toBe('semantic');
      });
    });
  });
});
