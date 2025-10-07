/**
 * Interface Validator Tests
 * 
 * Tests for cross-platform interface validation functionality.
 */

import { InterfaceValidator } from '../InterfaceValidator';
import { InterfaceDefinition } from '../types/InterfaceDefinition';

describe('InterfaceValidator', () => {
  let validator: InterfaceValidator;

  beforeEach(() => {
    validator = new InterfaceValidator();
  });

  describe('validateInterfaces', () => {
    it('should validate matching interfaces across platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [
            { name: 'label', type: 'string', required: true },
            { name: 'disabled', type: 'boolean', required: false },
          ],
          methods: [
            {
              name: 'onClick',
              parameters: [],
              returnType: 'void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [
            { name: 'label', type: 'string', required: true },
            { name: 'disabled', type: 'boolean', required: false },
          ],
          methods: [
            {
              name: 'onClick',
              parameters: [],
              returnType: 'void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(true);
      expect(report.component).toBe('Button');
      expect(report.errorSummary.total).toBe(0);
      expect(report.results).toHaveLength(2);
    });

    it('should detect property mismatches', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [
            { name: 'label', type: 'string', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [
            { name: 'text', type: 'string', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      expect(report.errorSummary.total).toBeGreaterThan(0);
      
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'property_mismatch')).toBe(true);
    });

    it('should detect type mismatches', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [
            { name: 'label', type: 'string', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [
            { name: 'label', type: 'number', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'type_mismatch')).toBe(true);
    });

    it('should detect method signature mismatches', () => {
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
              parameters: [],
              returnType: 'void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      
      const errors = report.results.flatMap(r => r.errors);
      // Parameter count mismatch generates method_mismatch error
      expect(errors.some(e => e.type === 'method_mismatch')).toBe(true);
    });

    it('should detect return type mismatches', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [],
          methods: [
            {
              name: 'getValue',
              parameters: [],
              returnType: 'string',
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
              name: 'getValue',
              parameters: [],
              returnType: 'number',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'return_type_mismatch')).toBe(true);
    });

    it('should detect event mismatches', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [],
          methods: [],
          events: [
            { name: 'onPress', payloadType: 'PressEvent' },
          ],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [],
          methods: [],
          events: [
            { name: 'onClick', payloadType: 'ClickEvent' },
          ],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'event_mismatch')).toBe(true);
    });

    it('should detect state mismatches', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [],
          methods: [],
          events: [],
          states: [
            { name: 'pressed', type: 'boolean' },
          ],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [],
          methods: [],
          events: [],
          states: [
            { name: 'pressed', type: 'string' },
          ],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.valid).toBe(false);
      
      const errors = report.results.flatMap(r => r.errors);
      expect(errors.some(e => e.type === 'type_mismatch')).toBe(true);
    });

    it('should throw error when no interfaces provided', () => {
      expect(() => {
        validator.validateInterfaces([]);
      }).toThrow('No interfaces provided for validation');
    });

    it('should generate error summary correctly', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [
            { name: 'label', type: 'string', required: true },
            { name: 'size', type: 'number', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [
            { name: 'label', type: 'number', required: true },
            { name: 'size', type: 'string', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const report = validator.validateInterfaces(interfaces);

      expect(report.errorSummary.total).toBeGreaterThan(0);
      expect(report.errorSummary.byType.type_mismatch).toBeGreaterThan(0);
    });
  });
});
