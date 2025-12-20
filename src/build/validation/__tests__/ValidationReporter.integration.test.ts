/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Integration tests for ValidationReporter with InterfaceValidator
 */

import { InterfaceValidator } from '../InterfaceValidator';
import { ValidationReporter } from '../ValidationReporter';
import { InterfaceDefinition } from '../types/InterfaceDefinition';

describe('ValidationReporter Integration', () => {
  let validator: InterfaceValidator;
  let reporter: ValidationReporter;

  beforeEach(() => {
    validator = new InterfaceValidator();
    reporter = new ValidationReporter();
  });

  it('should generate comprehensive report from interface validation', () => {
    // Define interfaces with mismatches
    const interfaces: InterfaceDefinition[] = [
      {
        name: 'Button',
        platform: 'ios',
        properties: [
          {
            name: 'title',
            type: 'String',
            required: true,
            description: 'Button title',
          },
          {
            name: 'disabled',
            type: 'Bool',
            required: false,
            description: 'Disabled state',
          },
        ],
        methods: [
          {
            name: 'onClick',
            parameters: [],
            returnType: 'Void',
            description: 'Click handler',
          },
        ],
        events: [],
        states: [],
      },
      {
        name: 'Button',
        platform: 'android',
        properties: [
          {
            name: 'title',
            type: 'String',
            required: true,
            description: 'Button title',
          },
          // Missing 'disabled' property
        ],
        methods: [
          {
            name: 'onClick',
            parameters: [],
            returnType: 'Unit',
            description: 'Click handler',
          },
        ],
        events: [],
        states: [],
      },
      {
        name: 'Button',
        platform: 'web',
        properties: [
          {
            name: 'title',
            type: 'string',
            required: true,
            description: 'Button title',
          },
          {
            name: 'disabled',
            type: 'boolean',
            required: false,
            description: 'Disabled state',
          },
        ],
        methods: [
          // Missing 'onClick' method
        ],
        events: [],
        states: [],
      },
    ];

    // Validate interfaces
    const validationReport = validator.validateInterfaces(interfaces);

    // Generate detailed report
    const detailedReport = reporter.generateReport(validationReport);

    // Verify report structure
    expect(detailedReport.valid).toBe(false);
    expect(detailedReport.component).toBe('Button');
    expect(detailedReport.summary.totalErrors).toBeGreaterThan(0);
    expect(detailedReport.summary.platforms).toEqual(['ios', 'android', 'web']);

    // Verify platform results
    expect(detailedReport.platformResults).toHaveLength(3);
    const androidResult = detailedReport.platformResults.find(r => r.platform === 'android');
    expect(androidResult).toBeDefined();
    expect(androidResult!.status).toBe('fail');

    // Verify differences are extracted
    expect(detailedReport.differences.length).toBeGreaterThan(0);

    // Verify actionable suggestions are generated
    expect(detailedReport.suggestions.length).toBeGreaterThan(0);
    const propertySuggestion = detailedReport.suggestions.find(
      s => s.title === 'Fix Property Mismatches'
    );
    expect(propertySuggestion).toBeDefined();
  });

  it('should format validation report as text with all sections', () => {
    const interfaces: InterfaceDefinition[] = [
      {
        name: 'Input',
        platform: 'ios',
        properties: [
          {
            name: 'value',
            type: 'String',
            required: true,
            description: 'Input value',
          },
          {
            name: 'placeholder',
            type: 'String?',
            required: false,
            description: 'Placeholder text',
          },
        ],
        methods: [],
        events: [],
        states: [],
      },
      {
        name: 'Input',
        platform: 'android',
        properties: [
          {
            name: 'value',
            type: 'String',
            required: true,
            description: 'Input value',
          },
          // Missing placeholder
        ],
        methods: [],
        events: [],
        states: [],
      },
    ];

    const validationReport = validator.validateInterfaces(interfaces);
    const detailedReport = reporter.generateReport(validationReport);
    const textReport = reporter.formatAsText(detailedReport);

    // Verify text format includes all sections
    expect(textReport).toContain('VALIDATION REPORT: Input');
    expect(textReport).toContain('SUMMARY');
    expect(textReport).toContain('PLATFORM RESULTS');
    expect(textReport).toContain('PLATFORM DIFFERENCES');
    expect(textReport).toContain('ACTIONABLE SUGGESTIONS');
    expect(textReport).toContain('END OF REPORT');

    // Verify platform status
    expect(textReport).toContain('ios:');
    expect(textReport).toContain('android:');

    // Verify error details
    expect(textReport).toContain('Location:');
    expect(textReport).toContain('Expected:');
    expect(textReport).toContain('Actual:');
    expect(textReport).toContain('Suggestion:');
  });

  it('should format validation report as Markdown with proper structure', () => {
    const interfaces: InterfaceDefinition[] = [
      {
        name: 'Card',
        platform: 'ios',
        properties: [
          {
            name: 'title',
            type: 'String',
            required: true,
            description: 'Card title',
          },
        ],
        methods: [
          {
            name: 'onTap',
            parameters: [],
            returnType: 'Void',
            description: 'Tap handler',
          },
        ],
        events: [],
        states: [],
      },
      {
        name: 'Card',
        platform: 'web',
        properties: [
          {
            name: 'title',
            type: 'string',
            required: true,
            description: 'Card title',
          },
        ],
        methods: [
          {
            name: 'onClick', // Different method name
            parameters: [],
            returnType: 'void',
            description: 'Click handler',
          },
        ],
        events: [],
        states: [],
      },
    ];

    const validationReport = validator.validateInterfaces(interfaces);
    const detailedReport = reporter.generateReport(validationReport);
    const markdownReport = reporter.formatAsMarkdown(detailedReport);

    // Verify Markdown structure
    expect(markdownReport).toContain('# Validation Report: Card');
    expect(markdownReport).toContain('## Summary');
    expect(markdownReport).toContain('### Platform Status');
    expect(markdownReport).toContain('## Platform Results');
    expect(markdownReport).toContain('### IOS');
    expect(markdownReport).toContain('### WEB');
    expect(markdownReport).toContain('## Actionable Suggestions');

    // Verify Markdown formatting
    expect(markdownReport).toContain('**Status:**');
    expect(markdownReport).toContain('**Total Errors:**');
    expect(markdownReport).toContain('- **');
    expect(markdownReport).toContain('`');
  });

  it('should generate JSON report that can be parsed', () => {
    const interfaces: InterfaceDefinition[] = [
      {
        name: 'Toggle',
        platform: 'ios',
        properties: [
          {
            name: 'isOn',
            type: 'Bool',
            required: true,
            description: 'Toggle state',
          },
        ],
        methods: [],
        events: [],
        states: [],
      },
      {
        name: 'Toggle',
        platform: 'android',
        properties: [
          {
            name: 'isOn',
            type: 'Boolean',
            required: true,
            description: 'Toggle state',
          },
        ],
        methods: [],
        events: [],
        states: [],
      },
    ];

    const validationReport = validator.validateInterfaces(interfaces);
    const detailedReport = reporter.generateReport(validationReport);
    const jsonReport = reporter.formatAsJSON(detailedReport);

    // Verify JSON can be parsed
    const parsed = JSON.parse(jsonReport);
    expect(parsed.component).toBe('Toggle');
    expect(parsed.summary).toBeDefined();
    expect(parsed.platformResults).toBeDefined();
    expect(parsed.differences).toBeDefined();
    expect(parsed.suggestions).toBeDefined();
    expect(parsed.timestamp).toBeDefined();
  });

  it('should provide file paths for all errors', () => {
    const interfaces: InterfaceDefinition[] = [
      {
        name: 'Modal',
        platform: 'ios',
        properties: [
          {
            name: 'visible',
            type: 'Bool',
            required: true,
            description: 'Visibility state',
          },
          {
            name: 'title',
            type: 'String',
            required: true,
            description: 'Modal title',
          },
        ],
        methods: [],
        events: [],
        states: [],
      },
      {
        name: 'Modal',
        platform: 'android',
        properties: [
          // Missing both properties
        ],
        methods: [],
        events: [],
        states: [],
      },
    ];

    const validationReport = validator.validateInterfaces(interfaces);
    const detailedReport = reporter.generateReport(validationReport);

    // Verify all errors have file paths
    for (const platformResult of detailedReport.platformResults) {
      for (const error of platformResult.errors) {
        expect(error.filePath).toBeDefined();
        expect(error.filePath).toContain('platforms/');
        
        if (platformResult.platform === 'ios') {
          expect(error.filePath).toContain('.swift');
        } else if (platformResult.platform === 'android') {
          expect(error.filePath).toContain('.kt');
        } else if (platformResult.platform === 'web') {
          expect(error.filePath).toContain('.ts');
        }
      }
    }
  });

  it('should provide actionable suggestions for all error types', () => {
    const interfaces: InterfaceDefinition[] = [
      {
        name: 'Form',
        platform: 'ios',
        properties: [
          {
            name: 'email',
            type: 'String',
            required: true,
            description: 'Email field',
          },
        ],
        methods: [
          {
            name: 'submit',
            parameters: [],
            returnType: 'Void',
            description: 'Submit form',
          },
        ],
        events: [
          {
            name: 'onSubmit',
            payloadType: 'FormData',
            description: 'Submit event',
          },
        ],
        states: [
          {
            name: 'isSubmitting',
            type: 'Bool',
            description: 'Submitting state',
          },
        ],
      },
      {
        name: 'Form',
        platform: 'web',
        properties: [], // Missing property
        methods: [], // Missing method
        events: [], // Missing event
        states: [], // Missing state
      },
    ];

    const validationReport = validator.validateInterfaces(interfaces);
    const detailedReport = reporter.generateReport(validationReport);

    // Verify suggestions exist for different error types
    expect(detailedReport.suggestions.length).toBeGreaterThan(0);
    
    // Each suggestion should have steps
    for (const suggestion of detailedReport.suggestions) {
      expect(suggestion.steps.length).toBeGreaterThan(0);
      expect(suggestion.description).toBeTruthy();
      expect(suggestion.platforms.length).toBeGreaterThan(0);
    }
  });
});
