/**
 * Tests for ValidationReporter
 */

import { ValidationReporter } from '../ValidationReporter';
import {
  ValidationReport,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '../types/ValidationResult';
import { Platform } from '../types/InterfaceDefinition';

describe('ValidationReporter', () => {
  let reporter: ValidationReporter;

  beforeEach(() => {
    reporter = new ValidationReporter();
  });

  describe('generateReport', () => {
    it('should generate detailed report from validation results', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'property_mismatch',
                message: 'Property "disabled" exists in ios but not in android',
                expected: 'Property "disabled" in android',
                actual: 'Property not found',
                platforms: ['ios', 'android'],
                location: 'disabled',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
          {
            valid: true,
            component: 'Button',
            platform: 'android',
            errors: [],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 1,
          byType: {
            property_mismatch: 1,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);

      expect(report.valid).toBe(false);
      expect(report.component).toBe('Button');
      expect(report.summary.totalErrors).toBe(1);
      expect(report.summary.totalWarnings).toBe(0);
      expect(report.summary.platforms).toEqual(['ios', 'android']);
      expect(report.platformResults).toHaveLength(2);
      expect(report.differences.length).toBeGreaterThan(0);
      expect(report.suggestions.length).toBeGreaterThan(0);
    });

    it('should generate summary with platform status', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'method_mismatch',
                message: 'Method missing',
                expected: 'onClick',
                actual: 'not found',
                platforms: ['ios', 'web'],
                location: 'onClick',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
          {
            valid: true,
            component: 'Button',
            platform: 'web',
            errors: [],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 1,
          byType: {
            property_mismatch: 0,
            method_mismatch: 1,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);

      expect(report.summary.platformStatus['ios']).toBe('fail');
      expect(report.summary.platformStatus['web']).toBe('pass');
    });
  });

  describe('platform results', () => {
    it('should generate detailed platform results with file paths', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'type_mismatch',
                message: 'Type mismatch in title property',
                expected: 'string',
                actual: 'String?',
                platforms: ['ios', 'android'],
                location: 'title',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 1,
          byType: {
            property_mismatch: 0,
            method_mismatch: 0,
            type_mismatch: 1,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const iosResult = report.platformResults.find(r => r.platform === 'ios');

      expect(iosResult).toBeDefined();
      expect(iosResult!.status).toBe('fail');
      expect(iosResult!.errorCount).toBe(1);
      expect(iosResult!.errors[0].filePath).toBe('platforms/ios/title.swift');
      expect(iosResult!.errors[0].suggestion).toContain('Update the type');
    });

    it('should infer correct file paths for different platforms', () => {
      const platforms: Platform[] = ['ios', 'android', 'web'];
      const errors: ValidationError[] = platforms.map(platform => ({
        type: 'property_mismatch',
        message: `Property missing in ${platform}`,
        expected: 'label',
        actual: 'not found',
        platforms: [platform],
        location: 'label',
        severity: 'error',
      }));

      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: platforms.map((platform, index) => ({
          valid: false,
          component: 'Button',
          platform,
          errors: [errors[index]],
          warnings: [],
          timestamp: new Date(),
        })),
        errorSummary: {
          total: 3,
          byType: {
            property_mismatch: 3,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);

      const iosResult = report.platformResults.find(r => r.platform === 'ios');
      const androidResult = report.platformResults.find(r => r.platform === 'android');
      const webResult = report.platformResults.find(r => r.platform === 'web');

      expect(iosResult!.errors[0].filePath).toBe('platforms/ios/label.swift');
      expect(androidResult!.errors[0].filePath).toBe('platforms/android/label.kt');
      expect(webResult!.errors[0].filePath).toBe('platforms/web/label.ts');
    });
  });

  describe('actionable suggestions', () => {
    it('should generate suggestions for property mismatches', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'property_mismatch',
                message: 'Property "disabled" missing',
                expected: 'disabled',
                actual: 'not found',
                platforms: ['ios', 'android'],
                location: 'disabled',
                severity: 'error',
              },
              {
                type: 'property_mismatch',
                message: 'Property "loading" missing',
                expected: 'loading',
                actual: 'not found',
                platforms: ['ios', 'web'],
                location: 'loading',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 2,
          byType: {
            property_mismatch: 2,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const propertySuggestion = report.suggestions.find(s => s.title === 'Fix Property Mismatches');

      expect(propertySuggestion).toBeDefined();
      expect(propertySuggestion!.priority).toBe('high');
      expect(propertySuggestion!.steps.length).toBeGreaterThan(0);
      expect(propertySuggestion!.relatedErrors).toContain('disabled');
      expect(propertySuggestion!.relatedErrors).toContain('loading');
    });

    it('should generate suggestions for method mismatches', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'android',
            errors: [
              {
                type: 'method_mismatch',
                message: 'Method "onClick" missing',
                expected: 'onClick',
                actual: 'not found',
                platforms: ['android', 'web'],
                location: 'onClick',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 1,
          byType: {
            property_mismatch: 0,
            method_mismatch: 1,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const methodSuggestion = report.suggestions.find(s => s.title === 'Fix Method Mismatches');

      expect(methodSuggestion).toBeDefined();
      expect(methodSuggestion!.priority).toBe('high');
      expect(methodSuggestion!.description).toContain('method mismatches');
    });

    it('should suggest interface redesign for many errors', () => {
      const errors: ValidationError[] = Array.from({ length: 15 }, (_, i) => ({
        type: 'property_mismatch',
        message: `Property ${i} missing`,
        expected: `prop${i}`,
        actual: 'not found',
        platforms: ['ios', 'android'],
        location: `prop${i}`,
        severity: 'error',
      }));

      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors,
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 15,
          byType: {
            property_mismatch: 15,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const redesignSuggestion = report.suggestions.find(s => s.title === 'Consider Interface Redesign');

      expect(redesignSuggestion).toBeDefined();
      expect(redesignSuggestion!.priority).toBe('high');
      expect(redesignSuggestion!.description).toContain('15 validation errors');
    });

    it('should prioritize suggestions correctly', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'property_mismatch',
                message: 'Property missing',
                expected: 'prop',
                actual: 'not found',
                platforms: ['ios'],
                location: 'prop',
                severity: 'error',
              },
              {
                type: 'parameter_mismatch',
                message: 'Parameter missing',
                expected: 'param',
                actual: 'not found',
                platforms: ['ios'],
                location: 'method',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 2,
          byType: {
            property_mismatch: 1,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 1,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);

      // High priority suggestions should come first
      expect(report.suggestions[0].priority).toBe('high');
      
      // Medium priority should come after high
      const mediumIndex = report.suggestions.findIndex(s => s.priority === 'medium');
      if (mediumIndex !== -1) {
        const highIndex = report.suggestions.findIndex(s => s.priority === 'high');
        expect(mediumIndex).toBeGreaterThan(highIndex);
      }
    });
  });

  describe('platform differences', () => {
    it('should extract platform differences from errors', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'type_mismatch',
                message: 'Type mismatch in title',
                expected: 'string',
                actual: 'String?',
                platforms: ['ios', 'android'],
                location: 'title',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
          {
            valid: false,
            component: 'Button',
            platform: 'android',
            errors: [
              {
                type: 'type_mismatch',
                message: 'Type mismatch in title',
                expected: 'string',
                actual: 'String',
                platforms: ['ios', 'android'],
                location: 'title',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 2,
          byType: {
            property_mismatch: 0,
            method_mismatch: 0,
            type_mismatch: 2,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);

      expect(report.differences.length).toBeGreaterThan(0);
      const titleDiff = report.differences.find(d => d.name === 'title');
      expect(titleDiff).toBeDefined();
      expect(titleDiff!.type).toBe('property');
      expect(titleDiff!.platforms).toContain('ios');
      expect(titleDiff!.platforms).toContain('android');
    });
  });

  describe('format methods', () => {
    it('should format report as text', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'ios',
            errors: [
              {
                type: 'property_mismatch',
                message: 'Property missing',
                expected: 'disabled',
                actual: 'not found',
                platforms: ['ios', 'android'],
                location: 'disabled',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 1,
          byType: {
            property_mismatch: 1,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const text = reporter.formatAsText(report);

      expect(text).toContain('VALIDATION REPORT: Button');
      expect(text).toContain('FAIL ✗');
      expect(text).toContain('Total Errors: 1');
      expect(text).toContain('PLATFORM RESULTS');
      expect(text).toContain('ACTIONABLE SUGGESTIONS');
    });

    it('should format report as JSON', () => {
      const validationReport: ValidationReport = {
        valid: true,
        component: 'Button',
        results: [
          {
            valid: true,
            component: 'Button',
            platform: 'ios',
            errors: [],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 0,
          byType: {
            property_mismatch: 0,
            method_mismatch: 0,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const json = reporter.formatAsJSON(report);
      const parsed = JSON.parse(json);

      expect(parsed.valid).toBe(true);
      expect(parsed.component).toBe('Button');
      expect(parsed.summary).toBeDefined();
    });

    it('should format report as Markdown', () => {
      const validationReport: ValidationReport = {
        valid: false,
        component: 'Button',
        results: [
          {
            valid: false,
            component: 'Button',
            platform: 'web',
            errors: [
              {
                type: 'method_mismatch',
                message: 'Method missing',
                expected: 'onClick',
                actual: 'not found',
                platforms: ['web'],
                location: 'onClick',
                severity: 'error',
              },
            ],
            warnings: [],
            timestamp: new Date(),
          },
        ],
        errorSummary: {
          total: 1,
          byType: {
            property_mismatch: 0,
            method_mismatch: 1,
            type_mismatch: 0,
            parameter_mismatch: 0,
            return_type_mismatch: 0,
            event_mismatch: 0,
            state_mismatch: 0,
            missing_implementation: 0,
            signature_mismatch: 0,
          },
        },
        warningSummary: {
          total: 0,
          byType: {
            optional_property_difference: 0,
            description_missing: 0,
            naming_convention_difference: 0,
            default_value_difference: 0,
          },
        },
        timestamp: new Date(),
      };

      const report = reporter.generateReport(validationReport);
      const markdown = reporter.formatAsMarkdown(report);

      expect(markdown).toContain('# Validation Report: Button');
      expect(markdown).toContain('**Status:** ✗ FAIL');
      expect(markdown).toContain('## Summary');
      expect(markdown).toContain('## Platform Results');
      expect(markdown).toContain('### WEB');
      expect(markdown).toContain('## Actionable Suggestions');
    });
  });
});
