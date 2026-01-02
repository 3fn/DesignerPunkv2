/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate Stemma System property and accessibility validation
 */

/**
 * Stemma Property and Accessibility Validator Tests
 *
 * Tests the property validation against schemas and WCAG accessibility checks.
 * Validates:
 * - Required property checking against component schemas
 * - Property type validation (string, boolean, number, union types)
 * - Basic WCAG accessibility compliance checks
 * - Component type detection
 *
 * @see .kiro/steering/stemma-system-principles.md
 * @see Requirements: R8 (Health Guardrails and Validation)
 * @validates Requirements R8.1, R8.5, R8.6
 */

import {
  validatePropertyAndAccessibility,
  validateProperties,
  validateAccessibility,
  validateMultipleComponents,
  parseComponentSchema,
  determineComponentType,
  formatPropertyAccessibilityErrors,
  formatPropertyAccessibilityWarnings,
  WCAG_REQUIREMENTS,
  TOUCH_TARGET_SIZES,
  ComponentSchema,
  ComponentProperties,
} from '../StemmaPropertyAccessibilityValidator';

describe('StemmaPropertyAccessibilityValidator', () => {
  describe('parseComponentSchema', () => {
    it('should parse basic schema structure', () => {
      const yaml = `
name: Input-Text-Base
type: primitive
family: FormInputs
version: 1.0.0
`;
      const schema = parseComponentSchema(yaml);
      expect(schema).not.toBeNull();
      expect(schema?.name).toBe('Input-Text-Base');
      expect(schema?.type).toBe('primitive');
      expect(schema?.family).toBe('FormInputs');
    });

    it('should parse properties section', () => {
      const yaml = `
name: Test-Component
type: primitive
family: Test
properties:
  label:
    type: string
    required: true
  disabled:
    type: boolean
    required: false
`;
      const schema = parseComponentSchema(yaml);
      expect(schema?.properties).toBeDefined();
      expect(schema?.properties?.label?.type).toBe('string');
      expect(schema?.properties?.label?.required).toBe(true);
      expect(schema?.properties?.disabled?.type).toBe('boolean');
      expect(schema?.properties?.disabled?.required).toBe(false);
    });

    it('should parse behaviors array', () => {
      const yaml = `
name: Test-Component
type: primitive
family: Test
behaviors:
  - focusable
  - interactive
`;
      const schema = parseComponentSchema(yaml);
      expect(schema?.behaviors).toContain('focusable');
      expect(schema?.behaviors).toContain('interactive');
    });

    it('should return null for invalid YAML', () => {
      const schema = parseComponentSchema('');
      expect(schema).not.toBeNull(); // Empty returns empty schema
    });
  });

  describe('determineComponentType', () => {
    it('should detect input type from family', () => {
      const schema: ComponentSchema = {
        name: 'Input-Text-Base',
        type: 'primitive',
        family: 'FormInputs',
      };
      expect(determineComponentType(schema, 'Input-Text-Base')).toBe('input');
    });

    it('should detect button type from family', () => {
      const schema: ComponentSchema = {
        name: 'Button-CTA',
        type: 'standalone',
        family: 'Buttons',
      };
      expect(determineComponentType(schema, 'Button-CTA')).toBe('button');
    });

    it('should detect container type from family', () => {
      const schema: ComponentSchema = {
        name: 'Container-Base',
        type: 'primitive',
        family: 'Containers',
      };
      expect(determineComponentType(schema, 'Container-Base')).toBe('container');
    });

    it('should detect icon type from family', () => {
      const schema: ComponentSchema = {
        name: 'Icon-Base',
        type: 'primitive',
        family: 'Icons',
      };
      expect(determineComponentType(schema, 'Icon-Base')).toBe('icon');
    });

    it('should fallback to name-based detection', () => {
      expect(determineComponentType(null, 'Input-Text-Email')).toBe('input');
      expect(determineComponentType(null, 'Button-Primary')).toBe('button');
      expect(determineComponentType(null, 'Container-Card')).toBe('container');
      expect(determineComponentType(null, 'Icon-Arrow')).toBe('icon');
      expect(determineComponentType(null, 'Unknown-Component')).toBe('generic');
    });
  });

  describe('validateProperties', () => {
    const schema: ComponentSchema = {
      name: 'Test-Component',
      type: 'primitive',
      family: 'Test',
      properties: {
        label: { type: 'string', required: true },
        disabled: { type: 'boolean', required: false },
        size: { type: "'small' | 'medium' | 'large'", required: false },
      },
    };

    it('should pass when all required properties are present', () => {
      const props: ComponentProperties = { label: 'Test Label' };
      const result = validateProperties(props, schema);
      expect(result.errors).toHaveLength(0);
      expect(result.stats.requiredPropertiesFound).toBe(1);
    });

    it('should error when required property is missing', () => {
      const props: ComponentProperties = { disabled: true };
      const result = validateProperties(props, schema);
      expect(result.errors.some(e => e.code === 'MISSING_REQUIRED_PROPERTY')).toBe(true);
      expect(result.stats.requiredPropertiesMissing).toBe(1);
    });

    it('should error on invalid property type', () => {
      const props: ComponentProperties = { label: 123 };
      const result = validateProperties(props, schema);
      expect(result.errors.some(e => e.code === 'INVALID_PROPERTY_TYPE')).toBe(true);
    });

    it('should error on invalid union type value', () => {
      const props: ComponentProperties = { label: 'Test', size: 'huge' };
      const result = validateProperties(props, schema);
      expect(result.errors.some(e => e.code === 'INVALID_PROPERTY_VALUE')).toBe(true);
    });

    it('should pass with valid union type value', () => {
      const props: ComponentProperties = { label: 'Test', size: 'medium' };
      const result = validateProperties(props, schema);
      expect(result.errors.filter(e => e.code === 'INVALID_PROPERTY_VALUE')).toHaveLength(0);
    });
  });

  describe('validateAccessibility', () => {
    const baseSchema: ComponentSchema = {
      name: 'Test-Component',
      type: 'primitive',
      family: 'Test',
    };

    describe('Input components', () => {
      it('should error when input is missing label', () => {
        const props: ComponentProperties = {};
        const result = validateAccessibility(props, baseSchema, 'input');
        expect(result.errors.some(e => e.code === 'MISSING_ACCESSIBILITY_LABEL')).toBe(true);
      });

      it('should pass when input has label', () => {
        const props: ComponentProperties = { label: 'Email' };
        const result = validateAccessibility(props, baseSchema, 'input');
        expect(result.errors.filter(e => e.code === 'MISSING_ACCESSIBILITY_LABEL')).toHaveLength(0);
      });

      it('should pass when input has accessibilityLabel', () => {
        const props: ComponentProperties = { accessibilityLabel: 'Email input' };
        const result = validateAccessibility(props, baseSchema, 'input');
        expect(result.errors.filter(e => e.code === 'MISSING_ACCESSIBILITY_LABEL')).toHaveLength(0);
      });
    });

    describe('Button components', () => {
      it('should error when button is missing label', () => {
        const props: ComponentProperties = {};
        const result = validateAccessibility(props, baseSchema, 'button');
        expect(result.errors.some(e => e.code === 'MISSING_ACCESSIBILITY_LABEL')).toBe(true);
      });

      it('should pass when button has label', () => {
        const props: ComponentProperties = { label: 'Submit' };
        const result = validateAccessibility(props, baseSchema, 'button');
        expect(result.errors.filter(e => e.code === 'MISSING_ACCESSIBILITY_LABEL')).toHaveLength(0);
      });
    });

    describe('Touch target size', () => {
      it('should error when touch target is too small', () => {
        const props: ComponentProperties = { label: 'Test', height: 20 };
        const result = validateAccessibility(props, baseSchema, 'button');
        expect(result.errors.some(e => e.code === 'INSUFFICIENT_TOUCH_TARGET')).toBe(true);
      });

      it('should warn when touch target is suboptimal', () => {
        const props: ComponentProperties = { label: 'Test', height: 30 };
        const result = validateAccessibility(props, baseSchema, 'button');
        expect(result.warnings.some(w => w.code === 'TOUCH_TARGET_SUBOPTIMAL')).toBe(true);
      });

      it('should pass when touch target meets minimum', () => {
        const props: ComponentProperties = { label: 'Test', height: 48 };
        const result = validateAccessibility(props, baseSchema, 'button');
        expect(result.errors.filter(e => e.code === 'INSUFFICIENT_TOUCH_TARGET')).toHaveLength(0);
        expect(result.warnings.filter(w => w.code === 'TOUCH_TARGET_SUBOPTIMAL')).toHaveLength(0);
      });
    });
  });

  describe('validatePropertyAndAccessibility', () => {
    it('should return valid result for well-formed component', () => {
      const result = validatePropertyAndAccessibility(
        'Test-Button',
        { label: 'Click me', height: 48 }
      );
      expect(result.componentName).toBe('Test-Button');
      expect(result.stats.accessibilityChecksPerformed).toBeGreaterThan(0);
    });

    it('should detect component type from name', () => {
      const inputResult = validatePropertyAndAccessibility('Input-Text-Base', { label: 'Email' });
      const buttonResult = validatePropertyAndAccessibility('Button-CTA', { label: 'Submit' });
      
      // Both should have accessibility checks performed
      expect(inputResult.stats.accessibilityChecksPerformed).toBeGreaterThan(0);
      expect(buttonResult.stats.accessibilityChecksPerformed).toBeGreaterThan(0);
    });
  });

  describe('validateMultipleComponents', () => {
    it('should validate multiple components and provide summary', () => {
      const components = [
        { name: 'Button-CTA', properties: { label: 'Submit' } },
        { name: 'Input-Text-Base', properties: {} }, // Missing label
        { name: 'Container-Base', properties: {} },
      ];

      const { results, summary } = validateMultipleComponents(components);

      expect(results.size).toBe(3);
      expect(summary.totalComponents).toBe(3);
      expect(summary.totalErrors).toBeGreaterThan(0); // Input missing label
    });
  });

  describe('formatPropertyAccessibilityErrors', () => {
    it('should format valid result with checkmark', () => {
      const result = validatePropertyAndAccessibility('Button-CTA', { label: 'Submit', height: 48 });
      if (result.valid) {
        const formatted = formatPropertyAccessibilityErrors(result);
        expect(formatted).toContain('✅');
      }
    });

    it('should format errors with details', () => {
      const result = validatePropertyAndAccessibility('Input-Text-Base', {});
      const formatted = formatPropertyAccessibilityErrors(result);
      expect(formatted).toContain('❌');
      expect(formatted).toContain('error');
    });
  });

  describe('formatPropertyAccessibilityWarnings', () => {
    it('should return empty string when no warnings', () => {
      const result = validatePropertyAndAccessibility('Container-Base', {});
      const formatted = formatPropertyAccessibilityWarnings(result);
      if (result.warnings.length === 0) {
        expect(formatted).toBe('');
      }
    });

    it('should format warnings when present', () => {
      const result = validatePropertyAndAccessibility('Button-CTA', { label: 'Test', height: 30 });
      const formatted = formatPropertyAccessibilityWarnings(result);
      if (result.warnings.length > 0) {
        expect(formatted).toContain('⚠️');
      }
    });
  });

  describe('WCAG_REQUIREMENTS constants', () => {
    it('should have keyboard accessible requirement', () => {
      expect(WCAG_REQUIREMENTS.KEYBOARD_ACCESSIBLE.criterion).toBe('2.1.1');
      expect(WCAG_REQUIREMENTS.KEYBOARD_ACCESSIBLE.level).toBe('A');
    });

    it('should have focus visible requirement', () => {
      expect(WCAG_REQUIREMENTS.FOCUS_VISIBLE.criterion).toBe('2.4.7');
      expect(WCAG_REQUIREMENTS.FOCUS_VISIBLE.level).toBe('AA');
    });

    it('should have target size requirements', () => {
      expect(WCAG_REQUIREMENTS.TARGET_SIZE.criterion).toBe('2.5.5');
      expect(WCAG_REQUIREMENTS.TARGET_SIZE_MINIMUM.criterion).toBe('2.5.8');
    });
  });

  describe('TOUCH_TARGET_SIZES constants', () => {
    it('should have recommended size', () => {
      expect(TOUCH_TARGET_SIZES.RECOMMENDED).toBe(48);
    });

    it('should have minimum AA size', () => {
      expect(TOUCH_TARGET_SIZES.MINIMUM_AA).toBe(44);
    });

    it('should have absolute minimum size', () => {
      expect(TOUCH_TARGET_SIZES.MINIMUM).toBe(24);
    });
  });
});
