/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Interface Contract Validator Tests
 * 
 * Tests for F2-specific interface contract validation that ensures
 * all platforms implement the same API.
 */

import { InterfaceContractValidator } from '../InterfaceContractValidator';
import { InterfaceDefinition } from '../types/InterfaceDefinition';

describe('InterfaceContractValidator', () => {
  let validator: InterfaceContractValidator;

  beforeEach(() => {
    validator = new InterfaceContractValidator();
  });

  describe('validateInterfaceContracts', () => {
    it('should validate matching interfaces across all platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [
            { name: 'label', type: 'String', required: true },
            { name: 'disabled', type: 'Bool', required: false },
          ],
          methods: [
            {
              name: 'onClick',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [
            { name: 'label', type: 'String', required: true },
            { name: 'disabled', type: 'Bool', required: false },
          ],
          methods: [
            {
              name: 'onClick',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'web',
          properties: [
            { name: 'label', type: 'String', required: true },
            { name: 'disabled', type: 'Bool', required: false },
          ],
          methods: [
            {
              name: 'onClick',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);

      expect(result.valid).toBe(true);
      expect(result.component).toBe('Button');
      expect(result.apiDifferences).toHaveLength(0);
      expect(result.report.errorSummary.total).toBe(0);
    });

    it('should detect method signature mismatches across platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'TextField',
          platform: 'ios',
          properties: [],
          methods: [
            {
              name: 'setValue',
              parameters: [
                { name: 'value', type: 'String', required: true },
              ],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'TextField',
          platform: 'android',
          properties: [],
          methods: [
            {
              name: 'setValue',
              parameters: [
                { name: 'value', type: 'Int', required: true },
              ],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);

      expect(result.valid).toBe(false);
      expect(result.apiDifferences.length).toBeGreaterThan(0);
      
      // The error location is the parameter name, not the method name
      const methodDiff = result.apiDifferences.find(
        d => d.type === 'method' && d.description.includes('setValue')
      );
      expect(methodDiff).toBeDefined();
      expect(methodDiff?.platforms).toContain('ios');
      expect(methodDiff?.platforms).toContain('android');
    });

    it('should detect property type mismatches across platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Counter',
          platform: 'ios',
          properties: [
            { name: 'count', type: 'Int', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Counter',
          platform: 'web',
          properties: [
            { name: 'count', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);

      expect(result.valid).toBe(false);
      
      const propertyDiff = result.apiDifferences.find(
        d => d.type === 'property' && d.name === 'count'
      );
      expect(propertyDiff).toBeDefined();
      expect(propertyDiff?.description).toContain('different types');
    });

    it('should provide file paths for affected interfaces', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Card',
          platform: 'ios',
          properties: [
            { name: 'title', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Card',
          platform: 'android',
          properties: [
            { name: 'heading', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);

      expect(result.affectedFiles.length).toBeGreaterThan(0);
      
      const iosFile = result.affectedFiles.find(f => f.platform === 'ios');
      expect(iosFile).toBeDefined();
      expect(iosFile?.path).toContain('Card.swift');
      
      const androidFile = result.affectedFiles.find(f => f.platform === 'android');
      expect(androidFile).toBeDefined();
      expect(androidFile?.path).toContain('Card.kt');
    });

    it('should generate comprehensive difference report', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Modal',
          platform: 'ios',
          properties: [
            { name: 'visible', type: 'Bool', required: true },
          ],
          methods: [
            {
              name: 'show',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Modal',
          platform: 'web',
          properties: [
            { name: 'visible', type: 'Boolean', required: true },
          ],
          methods: [
            {
              name: 'show',
              parameters: [
                { name: 'animated', type: 'Boolean', required: false },
              ],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);
      const report = validator.generateDifferenceReport(result);

      expect(report).toContain('Interface Contract Validation Report');
      expect(report).toContain('Component: Modal');
      expect(report).toContain('INVALID');
      expect(report).toContain('API difference');
    });
  });

  describe('validateMethodSignatures', () => {
    it('should validate matching method signatures', () => {
      const methods = new Map();
      methods.set('ios', [
        {
          name: 'onClick',
          parameters: [],
          returnType: 'Void',
        },
      ]);
      methods.set('android', [
        {
          name: 'onClick',
          parameters: [],
          returnType: 'Void',
        },
      ]);

      const differences = validator.validateMethodSignatures(methods);

      expect(differences).toHaveLength(0);
    });

    it('should detect missing methods', () => {
      const methods = new Map();
      methods.set('ios', [
        {
          name: 'onClick',
          parameters: [],
          returnType: 'Void',
        },
      ]);
      methods.set('android', []);

      const differences = validator.validateMethodSignatures(methods);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('not in android');
    });

    it('should detect return type mismatches', () => {
      const methods = new Map();
      methods.set('ios', [
        {
          name: 'getValue',
          parameters: [],
          returnType: 'String',
        },
      ]);
      methods.set('web', [
        {
          name: 'getValue',
          parameters: [],
          returnType: 'Number',
        },
      ]);

      const differences = validator.validateMethodSignatures(methods);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('different return types');
    });

    it('should detect parameter count mismatches', () => {
      const methods = new Map();
      methods.set('ios', [
        {
          name: 'setValue',
          parameters: [
            { name: 'value', type: 'String', required: true },
          ],
          returnType: 'Void',
        },
      ]);
      methods.set('android', [
        {
          name: 'setValue',
          parameters: [],
          returnType: 'Void',
        },
      ]);

      const differences = validator.validateMethodSignatures(methods);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('different parameter counts');
    });

    it('should detect parameter type mismatches', () => {
      const methods = new Map();
      methods.set('ios', [
        {
          name: 'setValue',
          parameters: [
            { name: 'value', type: 'String', required: true },
          ],
          returnType: 'Void',
        },
      ]);
      methods.set('web', [
        {
          name: 'setValue',
          parameters: [
            { name: 'value', type: 'Number', required: true },
          ],
          returnType: 'Void',
        },
      ]);

      const differences = validator.validateMethodSignatures(methods);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('different types');
    });
  });

  describe('validatePropertyTypes', () => {
    it('should validate matching property types', () => {
      const properties = new Map();
      properties.set('ios', [
        { name: 'label', type: 'String', required: true },
      ]);
      properties.set('android', [
        { name: 'label', type: 'String', required: true },
      ]);

      const differences = validator.validatePropertyTypes(properties);

      expect(differences).toHaveLength(0);
    });

    it('should detect missing properties', () => {
      const properties = new Map();
      properties.set('ios', [
        { name: 'label', type: 'String', required: true },
      ]);
      properties.set('web', []);

      const differences = validator.validatePropertyTypes(properties);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('not in web');
    });

    it('should detect type mismatches', () => {
      const properties = new Map();
      properties.set('ios', [
        { name: 'count', type: 'Int', required: true },
      ]);
      properties.set('android', [
        { name: 'count', type: 'String', required: true },
      ]);

      const differences = validator.validatePropertyTypes(properties);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('different types');
    });

    it('should detect required status mismatches', () => {
      const properties = new Map();
      properties.set('ios', [
        { name: 'label', type: 'String', required: true },
      ]);
      properties.set('web', [
        { name: 'label', type: 'String', required: false },
      ]);

      const differences = validator.validatePropertyTypes(properties);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences[0].description).toContain('different required status');
    });
  });

  describe('generateDifferenceReport', () => {
    it('should generate report for valid interfaces', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Button',
          platform: 'ios',
          properties: [
            { name: 'label', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Button',
          platform: 'android',
          properties: [
            { name: 'label', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);
      const report = validator.generateDifferenceReport(result);

      expect(report).toContain('VALID');
      expect(report).toContain('All platforms implement the same API');
    });

    it('should group differences by type in report', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Form',
          platform: 'ios',
          properties: [
            { name: 'title', type: 'String', required: true },
          ],
          methods: [
            {
              name: 'submit',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Form',
          platform: 'web',
          properties: [
            { name: 'title', type: 'Number', required: true },
          ],
          methods: [
            {
              name: 'submit',
              parameters: [],
              returnType: 'Boolean',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);
      const report = validator.generateDifferenceReport(result);

      expect(report).toContain('PROPERTY DIFFERENCES');
      expect(report).toContain('METHOD DIFFERENCES');
    });

    it('should include file paths in report', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Card',
          platform: 'ios',
          properties: [
            { name: 'title', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Card',
          platform: 'android',
          properties: [
            { name: 'title', type: 'Int', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);
      const report = validator.generateDifferenceReport(result);

      expect(report).toContain('Affected files');
      expect(report).toContain('Card.swift');
      expect(report).toContain('Card.kt');
    });
  });

  describe('cross-platform consistency', () => {
    it('should validate interfaces across all three platforms', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Checkbox',
          platform: 'ios',
          properties: [
            { name: 'checked', type: 'Bool', required: true },
            { name: 'label', type: 'String', required: true },
          ],
          methods: [
            {
              name: 'toggle',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Checkbox',
          platform: 'android',
          properties: [
            { name: 'checked', type: 'Bool', required: true },
            { name: 'label', type: 'String', required: true },
          ],
          methods: [
            {
              name: 'toggle',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
        {
          name: 'Checkbox',
          platform: 'web',
          properties: [
            { name: 'checked', type: 'Bool', required: true },
            { name: 'label', type: 'String', required: true },
          ],
          methods: [
            {
              name: 'toggle',
              parameters: [],
              returnType: 'Void',
            },
          ],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);

      expect(result.valid).toBe(true);
      expect(result.report.results).toHaveLength(3);
      expect(result.apiDifferences).toHaveLength(0);
    });

    it('should detect inconsistencies across any platform pair', () => {
      const interfaces: InterfaceDefinition[] = [
        {
          name: 'Slider',
          platform: 'ios',
          properties: [
            { name: 'value', type: 'Double', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Slider',
          platform: 'android',
          properties: [
            { name: 'value', type: 'Double', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
        {
          name: 'Slider',
          platform: 'web',
          properties: [
            { name: 'value', type: 'String', required: true },
          ],
          methods: [],
          events: [],
          states: [],
        },
      ];

      const result = validator.validateInterfaceContracts(interfaces);

      expect(result.valid).toBe(false);
      
      // Should detect web platform difference
      const webDiff = result.apiDifferences.find(
        d => d.platforms.includes('web')
      );
      expect(webDiff).toBeDefined();
    });
  });
});
