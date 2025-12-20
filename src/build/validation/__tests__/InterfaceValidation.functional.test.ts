/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Interface Validation Functional Tests
 * 
 * End-to-end tests verifying interface validation detects mismatches
 */

import { InterfaceValidator } from '../InterfaceValidator';
import { InterfaceDefinition } from '../types/InterfaceDefinition';

describe('Interface Validation - Functional Tests', () => {
  let validator: InterfaceValidator;

  beforeEach(() => {
    validator = new InterfaceValidator();
  });

  describe('Cross-Platform API Contract Validation', () => {
    it('should detect method signature mismatches across platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [],
          methods: [
            {
              name: 'onClick',
              parameters: [
                { name: 'event', type: 'Event', required: true },
              ],
              returnType: 'void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [],
          methods: [
            {
              name: 'onClick',
              parameters: [
                { name: 'event', type: 'ClickEvent', required: true }, // Different type
              ],
              returnType: 'void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'web',
          properties: [],
          methods: [
            {
              name: 'onClick',
              parameters: [
                { name: 'event', type: 'Event', required: true },
              ],
              returnType: 'void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      // Should detect mismatch
      expect(report.valid).toBe(false);
      
      // Should have errors for android platform
      const androidErrors = report.results
        .find(r => r.platform === 'android')
        ?.errors || [];
      
      expect(androidErrors.length).toBeGreaterThan(0);
      expect(androidErrors.some(e => e.type === 'parameter_mismatch')).toBe(true);
    });

    it('should detect property type mismatches across platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Input',
          platform: 'ios',
          properties: [
            { name: 'value', type: 'string', required: true },
            { name: 'disabled', type: 'boolean', required: false },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Input',
          platform: 'android',
          properties: [
            { name: 'value', type: 'string', required: true },
            { name: 'disabled', type: 'string', required: false }, // Wrong type
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Input',
          platform: 'web',
          properties: [
            { name: 'value', type: 'string', required: true },
            { name: 'disabled', type: 'boolean', required: false },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      // Should detect mismatch
      expect(report.valid).toBe(false);
      
      // Should have type mismatch errors
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'type_mismatch')).toBe(true);
      expect(errors.some(e => e.message.includes('disabled'))).toBe(true);
    });

    it('should validate consistent interfaces across all platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Card',
          platform: 'ios',
          properties: [
            { name: 'title', type: 'string', required: true },
            { name: 'subtitle', type: 'string', required: false },
          ],
          methods: [
            {
              name: 'onPress',
              parameters: [],
              returnType: 'void',
            },
          ],
          events: [
            { name: 'cardPressed', payloadType: 'CardEvent' },
          ],
          states: [
            { name: 'isPressed', type: 'boolean', initialValue: false },
          ],
        },
        {
          name: 'Card',
          platform: 'android',
          properties: [
            { name: 'title', type: 'string', required: true },
            { name: 'subtitle', type: 'string', required: false },
          ],
          methods: [
            {
              name: 'onPress',
              parameters: [],
              returnType: 'void',
            },
          ],
          events: [
            { name: 'cardPressed', payloadType: 'CardEvent' },
          ],
          states: [
            { name: 'isPressed', type: 'boolean', initialValue: false },
          ],
        },
        {
          name: 'Card',
          platform: 'web',
          properties: [
            { name: 'title', type: 'string', required: true },
            { name: 'subtitle', type: 'string', required: false },
          ],
          methods: [
            {
              name: 'onPress',
              parameters: [],
              returnType: 'void',
            },
          ],
          events: [
            { name: 'cardPressed', payloadType: 'CardEvent' },
          ],
          states: [
            { name: 'isPressed', type: 'boolean', initialValue: false },
          ],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      // Should pass validation
      expect(report.valid).toBe(true);
      expect(report.errorSummary.total).toBe(0);
      
      // All platforms should be valid
      expect(report.results.every(r => r.valid)).toBe(true);
    });

    it('should provide actionable error messages with file paths', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Form',
          platform: 'ios',
          properties: [
            { name: 'email', type: 'string', required: true },
          ],
          methods: [
            {
              name: 'submit',
              parameters: [
                { name: 'data', type: 'FormData', required: true },
              ],
              returnType: 'Promise<Response>',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Form',
          platform: 'android',
          properties: [
            { name: 'email', type: 'string', required: true },
          ],
          methods: [
            {
              name: 'submit',
              parameters: [
                { name: 'data', type: 'FormData', required: true },
              ],
              returnType: 'Response', // Missing Promise wrapper
            },
          ],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      
      const errors = report.results.flatMap(r => r.errors);
      
      // Should have return type mismatch
      const returnTypeError = errors.find(e => e.type === 'return_type_mismatch');
      expect(returnTypeError).toBeDefined();
      
      // Should have actionable message
      expect(returnTypeError?.message).toContain('submit');
      expect(returnTypeError?.message).toContain('different return types');
      
      // Should have expected and actual values
      expect(returnTypeError?.expected).toBe('Promise<Response>');
      expect(returnTypeError?.actual).toBe('Response');
      
      // Should have platforms involved
      expect(returnTypeError?.platforms).toContain('ios');
      expect(returnTypeError?.platforms).toContain('android');
      
      // Should have location
      expect(returnTypeError?.location).toBe('submit');
    });

    it('should generate comprehensive validation reports', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'ComplexComponent',
          platform: 'ios',
          properties: [
            { name: 'prop1', type: 'string', required: true },
            { name: 'prop2', type: 'number', required: false },
          ],
          methods: [
            {
              name: 'method1',
              parameters: [],
              returnType: 'void',
            },
            {
              name: 'method2',
              parameters: [
                { name: 'arg', type: 'string', required: true },
              ],
              returnType: 'string',
            },
          ],
          events: [
            { name: 'event1', payloadType: 'Event1' },
          ],
          states: [
            { name: 'state1', type: 'boolean' },
          ],
        },
        {
          name: 'ComplexComponent',
          platform: 'android',
          properties: [
            { name: 'prop1', type: 'string', required: true },
            { name: 'prop2', type: 'string', required: false }, // Type mismatch
          ],
          methods: [
            {
              name: 'method1',
              parameters: [],
              returnType: 'void',
            },
            {
              name: 'method2',
              parameters: [
                { name: 'arg', type: 'number', required: true }, // Type mismatch
              ],
              returnType: 'string',
            },
          ],
          events: [
            { name: 'event1', payloadType: 'Event2' }, // Type mismatch
          ],
          states: [
            { name: 'state1', type: 'string' }, // Type mismatch
          ],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      // Should detect all mismatches
      expect(report.valid).toBe(false);
      
      // Should have error summary
      expect(report.errorSummary.total).toBeGreaterThan(0);
      expect(report.errorSummary.byType).toBeDefined();
      
      // Should have multiple error types
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'type_mismatch')).toBe(true);
      expect(errors.some(e => e.type === 'parameter_mismatch')).toBe(true);
      
      // Should have timestamp
      expect(report.timestamp).toBeInstanceOf(Date);
      
      // Should have component name
      expect(report.component).toBe('ComplexComponent');
    });
  });
});
