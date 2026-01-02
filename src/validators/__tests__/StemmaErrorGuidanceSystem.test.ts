/**
 * Tests for Stemma System Error Guidance System
 * 
 * Tests error message templates, documentation links, IDE integration,
 * and formatting functions for the unified error guidance system.
 */

import {
  getErrorGuidance,
  getGuidanceByCategory,
  getGuidanceBySeverity,
  createIDEDiagnostic,
  convertNamingResultToGuidance,
  convertTokenUsageResultToGuidance,
  convertPropertyAccessibilityResultToGuidance,
  aggregateValidationResults,
  formatErrorGuidanceForConsole,
  formatErrorGuidanceForMarkdown,
  formatErrorGuidanceForJSON,
  formatAggregatedResultForConsole,
  formatAggregatedResultForMarkdown,
  getAllErrorCodes,
  getDocumentationLink,
  getQuickFix,
  hasAutoFix,
  getWCAGReference,
  getRelatedCodes,
  exportDiagnosticsForVSCode,
  exportDiagnosticsForESLint,
  DOCUMENTATION_LINKS,
  NAMING_ERROR_TEMPLATES,
  NAMING_WARNING_TEMPLATES,
  TOKEN_USAGE_ERROR_TEMPLATES,
  TOKEN_USAGE_WARNING_TEMPLATES,
  PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES,
  PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES,
  ErrorGuidance,
  ErrorCategory,
  ErrorSeverity
} from '../StemmaErrorGuidanceSystem';

import type { ComponentNameValidationResult } from '../StemmaComponentNamingValidator';
import type { TokenUsageValidationResult } from '../StemmaTokenUsageValidator';
import type { PropertyAccessibilityValidationResult } from '../StemmaPropertyAccessibilityValidator';

describe('StemmaErrorGuidanceSystem', () => {
  describe('DOCUMENTATION_LINKS', () => {
    it('should have all required documentation links', () => {
      expect(DOCUMENTATION_LINKS.STEMMA_PRINCIPLES).toBeDefined();
      expect(DOCUMENTATION_LINKS.COMPONENT_QUICK_REFERENCE).toBeDefined();
      expect(DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE).toBeDefined();
      expect(DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE).toBeDefined();
      expect(DOCUMENTATION_LINKS.WCAG_GUIDELINES).toBeDefined();
    });

    it('should have valid file paths for local documentation', () => {
      expect(DOCUMENTATION_LINKS.STEMMA_PRINCIPLES).toContain('.kiro/steering/');
      expect(DOCUMENTATION_LINKS.COMPONENT_QUICK_REFERENCE).toContain('.kiro/steering/');
      expect(DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE).toContain('.kiro/steering/');
    });

    it('should have valid URL for WCAG guidelines', () => {
      expect(DOCUMENTATION_LINKS.WCAG_GUIDELINES).toMatch(/^https:\/\//);
    });
  });

  describe('Error Templates', () => {
    describe('NAMING_ERROR_TEMPLATES', () => {
      it('should have all required naming error codes', () => {
        expect(NAMING_ERROR_TEMPLATES.MISSING_HYPHENS).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.WRONG_CASE).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.TOO_MANY_SEGMENTS).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.TOO_FEW_SEGMENTS).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.INVALID_SEGMENT_FORMAT).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.RESERVED_KEYWORD_MISUSE).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.EMPTY_SEGMENT).toBeDefined();
        expect(NAMING_ERROR_TEMPLATES.INVALID_CHARACTERS).toBeDefined();
      });

      it('should have proper structure for each error template', () => {
        for (const [code, template] of Object.entries(NAMING_ERROR_TEMPLATES)) {
          expect(template.code).toBe(code);
          expect(template.category).toBe('naming');
          expect(template.severity).toBe('error');
          expect(template.title).toBeDefined();
          expect(template.description).toBeDefined();
          expect(template.guidance).toBeInstanceOf(Array);
          expect(template.guidance.length).toBeGreaterThan(0);
        }
      });
    });

    describe('NAMING_WARNING_TEMPLATES', () => {
      it('should have all required naming warning codes', () => {
        expect(NAMING_WARNING_TEMPLATES.BASE_NOT_AT_END).toBeDefined();
        expect(NAMING_WARNING_TEMPLATES.UNUSUAL_FAMILY_NAME).toBeDefined();
        expect(NAMING_WARNING_TEMPLATES.LONG_SEGMENT_NAME).toBeDefined();
      });

      it('should have warning severity for all templates', () => {
        for (const template of Object.values(NAMING_WARNING_TEMPLATES)) {
          expect(template.severity).toBe('warning');
        }
      });
    });

    describe('TOKEN_USAGE_ERROR_TEMPLATES', () => {
      it('should have all required token usage error codes', () => {
        expect(TOKEN_USAGE_ERROR_TEMPLATES.INLINE_STYLE_COLOR).toBeDefined();
        expect(TOKEN_USAGE_ERROR_TEMPLATES.INLINE_STYLE_SPACING).toBeDefined();
        expect(TOKEN_USAGE_ERROR_TEMPLATES.INLINE_STYLE_TYPOGRAPHY).toBeDefined();
        expect(TOKEN_USAGE_ERROR_TEMPLATES.HARDCODED_COLOR).toBeDefined();
        expect(TOKEN_USAGE_ERROR_TEMPLATES.HARDCODED_SPACING).toBeDefined();
        expect(TOKEN_USAGE_ERROR_TEMPLATES.MISSING_REQUIRED_TOKEN).toBeDefined();
        expect(TOKEN_USAGE_ERROR_TEMPLATES.INVALID_TOKEN_REFERENCE).toBeDefined();
      });

      it('should have token-usage category for all templates', () => {
        for (const template of Object.values(TOKEN_USAGE_ERROR_TEMPLATES)) {
          expect(template.category).toBe('token-usage');
        }
      });
    });

    describe('TOKEN_USAGE_WARNING_TEMPLATES', () => {
      it('should have all required token usage warning codes', () => {
        expect(TOKEN_USAGE_WARNING_TEMPLATES.OPACITY_WORKAROUND).toBeDefined();
        expect(TOKEN_USAGE_WARNING_TEMPLATES.MAGIC_NUMBER).toBeDefined();
        expect(TOKEN_USAGE_WARNING_TEMPLATES.DEPRECATED_TOKEN).toBeDefined();
      });
    });

    describe('PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES', () => {
      it('should have all required property/accessibility error codes', () => {
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_REQUIRED_PROPERTY).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.INVALID_PROPERTY_TYPE).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_ACCESSIBILITY_LABEL).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_FOCUS_INDICATOR).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.INSUFFICIENT_TOUCH_TARGET).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_KEYBOARD_SUPPORT).toBeDefined();
      });

      it('should have WCAG references for accessibility errors', () => {
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_ACCESSIBILITY_LABEL.wcag).toBe('4.1.2');
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_FOCUS_INDICATOR.wcag).toBe('2.4.7');
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.INSUFFICIENT_TOUCH_TARGET.wcag).toBe('2.5.8');
        expect(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES.MISSING_KEYBOARD_SUPPORT.wcag).toBe('2.1.1');
      });
    });

    describe('PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES', () => {
      it('should have all required property/accessibility warning codes', () => {
        expect(PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES.OPTIONAL_PROPERTY_MISSING).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES.DEPRECATED_PROPERTY).toBeDefined();
        expect(PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES.TOUCH_TARGET_SUBOPTIMAL).toBeDefined();
      });
    });
  });

  describe('getErrorGuidance', () => {
    it('should return guidance for naming error codes', () => {
      const guidance = getErrorGuidance('MISSING_HYPHENS');
      expect(guidance).toBeDefined();
      expect(guidance?.code).toBe('MISSING_HYPHENS');
      expect(guidance?.category).toBe('naming');
    });

    it('should return guidance for naming warning codes', () => {
      const guidance = getErrorGuidance('UNUSUAL_FAMILY_NAME');
      expect(guidance).toBeDefined();
      expect(guidance?.code).toBe('UNUSUAL_FAMILY_NAME');
      expect(guidance?.severity).toBe('warning');
    });

    it('should return guidance for token usage error codes', () => {
      const guidance = getErrorGuidance('HARDCODED_COLOR');
      expect(guidance).toBeDefined();
      expect(guidance?.code).toBe('HARDCODED_COLOR');
      expect(guidance?.category).toBe('token-usage');
    });

    it('should return guidance for property/accessibility error codes', () => {
      const guidance = getErrorGuidance('MISSING_ACCESSIBILITY_LABEL');
      expect(guidance).toBeDefined();
      expect(guidance?.code).toBe('MISSING_ACCESSIBILITY_LABEL');
      expect(guidance?.category).toBe('accessibility');
    });

    it('should return undefined for unknown codes', () => {
      const guidance = getErrorGuidance('UNKNOWN_CODE');
      expect(guidance).toBeUndefined();
    });
  });

  describe('getGuidanceByCategory', () => {
    it('should return all naming guidance', () => {
      const guidance = getGuidanceByCategory('naming');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance.every(g => g.category === 'naming')).toBe(true);
    });

    it('should return all token-usage guidance', () => {
      const guidance = getGuidanceByCategory('token-usage');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance.every(g => g.category === 'token-usage')).toBe(true);
    });

    it('should return all accessibility guidance', () => {
      const guidance = getGuidanceByCategory('accessibility');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance.every(g => g.category === 'accessibility')).toBe(true);
    });
  });

  describe('getGuidanceBySeverity', () => {
    it('should return all error guidance', () => {
      const guidance = getGuidanceBySeverity('error');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance.every(g => g.severity === 'error')).toBe(true);
    });

    it('should return all warning guidance', () => {
      const guidance = getGuidanceBySeverity('warning');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance.every(g => g.severity === 'warning')).toBe(true);
    });

    it('should return all info guidance', () => {
      const guidance = getGuidanceBySeverity('info');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance.every(g => g.severity === 'info')).toBe(true);
    });
  });

  describe('createIDEDiagnostic', () => {
    it('should create a valid IDE diagnostic', () => {
      const guidance = getErrorGuidance('MISSING_HYPHENS')!;
      const diagnostic = createIDEDiagnostic(guidance, 'test-file.ts', 10, 5);
      
      expect(diagnostic.severity).toBe(1); // error
      expect(diagnostic.code).toBe('MISSING_HYPHENS');
      expect(diagnostic.source).toBe('stemma-system');
      expect(diagnostic.range.start.line).toBe(9); // 0-indexed
      expect(diagnostic.range.start.character).toBe(4); // 0-indexed
    });

    it('should include related information for documentation links', () => {
      const guidance = getErrorGuidance('MISSING_HYPHENS')!;
      const diagnostic = createIDEDiagnostic(guidance, 'test-file.ts');
      
      expect(diagnostic.relatedInformation).toBeDefined();
      expect(diagnostic.relatedInformation?.length).toBeGreaterThan(0);
    });

    it('should include code actions for auto-applicable quick fixes', () => {
      const guidance = getErrorGuidance('MISSING_HYPHENS')!;
      const diagnostic = createIDEDiagnostic(guidance, 'test-file.ts');
      
      expect(diagnostic.codeActions).toBeDefined();
      expect(diagnostic.codeActions?.length).toBeGreaterThan(0);
    });

    it('should map severity correctly', () => {
      const errorGuidance = getErrorGuidance('MISSING_HYPHENS')!;
      const warningGuidance = getErrorGuidance('UNUSUAL_FAMILY_NAME')!;
      const infoGuidance = getErrorGuidance('OPTIONAL_PROPERTY_MISSING')!;
      
      expect(createIDEDiagnostic(errorGuidance, 'test.ts').severity).toBe(1);
      expect(createIDEDiagnostic(warningGuidance, 'test.ts').severity).toBe(2);
      expect(createIDEDiagnostic(infoGuidance, 'test.ts').severity).toBe(3);
    });
  });

  describe('convertNamingResultToGuidance', () => {
    it('should convert naming validation errors to guidance', () => {
      const result: ComponentNameValidationResult = {
        valid: false,
        name: 'inputtext',
        segments: { family: 'inputtext', type: '', variant: '' },
        errors: [{
          code: 'MISSING_HYPHENS',
          message: 'Component name must use hyphens',
          guidance: 'Add hyphens between segments'
        }],
        warnings: []
      };
      
      const { errors, warnings } = convertNamingResultToGuidance(result);
      
      expect(errors.length).toBe(1);
      expect(errors[0].code).toBe('MISSING_HYPHENS');
      expect(warnings.length).toBe(0);
    });

    it('should convert naming validation warnings to guidance', () => {
      const result: ComponentNameValidationResult = {
        valid: true,
        name: 'Custom-Button',
        segments: { family: 'Custom', type: 'Button', variant: '' },
        errors: [],
        warnings: [{
          code: 'UNUSUAL_FAMILY_NAME',
          message: 'Unknown family name',
          guidance: 'Consider using a known family'
        }]
      };
      
      const { errors, warnings } = convertNamingResultToGuidance(result);
      
      expect(errors.length).toBe(0);
      expect(warnings.length).toBe(1);
      expect(warnings[0].code).toBe('UNUSUAL_FAMILY_NAME');
    });
  });

  describe('convertTokenUsageResultToGuidance', () => {
    it('should convert token usage validation errors to guidance', () => {
      const result: TokenUsageValidationResult = {
        valid: false,
        filePath: 'test.ts',
        platform: 'web',
        errors: [{
          code: 'HARDCODED_COLOR',
          message: 'Hardcoded color found',
          guidance: 'Use a color token',
          line: 10,
          column: 5,
          snippet: 'color: #FF0000'
        }],
        warnings: [],
        stats: {
          linesAnalyzed: 100,
          inlineStyleViolations: 0,
          hardcodedValueViolations: 1,
          tokenReferencesFound: 5,
          missingRequiredTokens: 0
        }
      };
      
      const { errors, warnings } = convertTokenUsageResultToGuidance(result);
      
      expect(errors.length).toBe(1);
      expect(errors[0].code).toBe('HARDCODED_COLOR');
      expect(warnings.length).toBe(0);
    });

    it('should convert token usage validation warnings to guidance', () => {
      const result: TokenUsageValidationResult = {
        valid: true,
        filePath: 'test.ts',
        platform: 'web',
        errors: [],
        warnings: [{
          code: 'MAGIC_NUMBER',
          message: 'Magic number detected',
          guidance: 'Consider using a token',
          line: 15,
          snippet: 'padding: 16'
        }],
        stats: {
          linesAnalyzed: 100,
          inlineStyleViolations: 0,
          hardcodedValueViolations: 0,
          tokenReferencesFound: 5,
          missingRequiredTokens: 0
        }
      };
      
      const { errors, warnings } = convertTokenUsageResultToGuidance(result);
      
      expect(errors.length).toBe(0);
      expect(warnings.length).toBe(1);
      expect(warnings[0].code).toBe('MAGIC_NUMBER');
    });
  });

  describe('convertPropertyAccessibilityResultToGuidance', () => {
    it('should convert property validation errors to guidance', () => {
      const result: PropertyAccessibilityValidationResult = {
        valid: false,
        componentName: 'Button-CTA',
        errors: [{
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Missing required property: label',
          guidance: 'Add the label property',
          property: 'label'
        }],
        warnings: [],
        stats: {
          propertiesChecked: 5,
          requiredPropertiesFound: 2,
          requiredPropertiesMissing: 1,
          accessibilityChecksPerformed: 3,
          accessibilityChecksPassed: 2
        }
      };
      
      const { errors, warnings } = convertPropertyAccessibilityResultToGuidance(result);
      
      expect(errors.length).toBe(1);
      expect(errors[0].code).toBe('MISSING_REQUIRED_PROPERTY');
    });

    it('should convert accessibility validation errors to guidance', () => {
      const result: PropertyAccessibilityValidationResult = {
        valid: false,
        componentName: 'Button-CTA',
        errors: [{
          code: 'MISSING_ACCESSIBILITY_LABEL',
          message: 'Missing accessibility label',
          guidance: 'Add accessibilityLabel property',
          wcag: '4.1.2'
        }],
        warnings: [],
        stats: {
          propertiesChecked: 5,
          requiredPropertiesFound: 3,
          requiredPropertiesMissing: 0,
          accessibilityChecksPerformed: 3,
          accessibilityChecksPassed: 1
        }
      };
      
      const { errors, warnings } = convertPropertyAccessibilityResultToGuidance(result);
      
      expect(errors.length).toBe(1);
      expect(errors[0].code).toBe('MISSING_ACCESSIBILITY_LABEL');
      expect(errors[0].wcag).toBe('4.1.2');
    });
  });

  describe('aggregateValidationResults', () => {
    it('should aggregate results from all validators', () => {
      const namingResult: ComponentNameValidationResult = {
        valid: false,
        name: 'inputtext',
        segments: { family: 'inputtext', type: '', variant: '' },
        errors: [{
          code: 'MISSING_HYPHENS',
          message: 'Missing hyphens',
          guidance: 'Add hyphens'
        }],
        warnings: []
      };
      
      const tokenResult: TokenUsageValidationResult = {
        valid: false,
        filePath: 'test.ts',
        platform: 'web',
        errors: [{
          code: 'HARDCODED_COLOR',
          message: 'Hardcoded color',
          guidance: 'Use token',
          line: 10,
          column: 5,
          snippet: 'color: #FF0000'
        }],
        warnings: [],
        stats: {
          linesAnalyzed: 100,
          inlineStyleViolations: 0,
          hardcodedValueViolations: 1,
          tokenReferencesFound: 0,
          missingRequiredTokens: 0
        }
      };
      
      const result = aggregateValidationResults(namingResult, tokenResult);
      
      expect(result.valid).toBe(false);
      expect(result.summary.totalErrors).toBe(2);
      expect(result.summary.byCategory.naming.errors).toBe(1);
      expect(result.summary.byCategory['token-usage'].errors).toBe(1);
      expect(result.diagnostics.length).toBe(2);
    });

    it('should return valid when all validators pass', () => {
      const namingResult: ComponentNameValidationResult = {
        valid: true,
        name: 'Input-Text',
        segments: { family: 'Input', type: 'Text', variant: '' },
        errors: [],
        warnings: []
      };
      
      const result = aggregateValidationResults(namingResult);
      
      expect(result.valid).toBe(true);
      expect(result.summary.totalErrors).toBe(0);
    });

    it('should handle undefined validator results', () => {
      const result = aggregateValidationResults(undefined, undefined, undefined);
      
      expect(result.valid).toBe(true);
      expect(result.summary.totalErrors).toBe(0);
      expect(result.summary.totalWarnings).toBe(0);
    });
  });

  describe('Formatting Functions', () => {
    describe('formatErrorGuidanceForConsole', () => {
      it('should format error guidance for console output', () => {
        const guidance = getErrorGuidance('MISSING_HYPHENS')!;
        const output = formatErrorGuidanceForConsole(guidance);
        
        expect(output).toContain('❌');
        expect(output).toContain('MISSING_HYPHENS');
        expect(output).toContain('How to fix:');
        expect(output).toContain('📚 Documentation:');
      });

      it('should use warning icon for warnings', () => {
        const guidance = getErrorGuidance('UNUSUAL_FAMILY_NAME')!;
        const output = formatErrorGuidanceForConsole(guidance);
        
        expect(output).toContain('⚠️');
      });

      it('should include WCAG reference for accessibility errors', () => {
        const guidance = getErrorGuidance('MISSING_ACCESSIBILITY_LABEL')!;
        const output = formatErrorGuidanceForConsole(guidance);
        
        expect(output).toContain('♿ WCAG:');
        expect(output).toContain('4.1.2');
      });
    });

    describe('formatErrorGuidanceForMarkdown', () => {
      it('should format error guidance for markdown output', () => {
        const guidance = getErrorGuidance('MISSING_HYPHENS')!;
        const output = formatErrorGuidanceForMarkdown(guidance);
        
        expect(output).toContain('### ❌');
        expect(output).toContain('**Code:** `MISSING_HYPHENS`');
        expect(output).toContain('**How to fix:**');
        expect(output).toContain('**Documentation:**');
      });

      it('should include WCAG reference in markdown', () => {
        const guidance = getErrorGuidance('MISSING_ACCESSIBILITY_LABEL')!;
        const output = formatErrorGuidanceForMarkdown(guidance);
        
        expect(output).toContain('**WCAG Reference:**');
      });
    });

    describe('formatErrorGuidanceForJSON', () => {
      it('should format error guidance as valid JSON', () => {
        const guidance = getErrorGuidance('MISSING_HYPHENS')!;
        const output = formatErrorGuidanceForJSON(guidance);
        
        const parsed = JSON.parse(output);
        expect(parsed.code).toBe('MISSING_HYPHENS');
        expect(parsed.category).toBe('naming');
      });
    });

    describe('formatAggregatedResultForConsole', () => {
      it('should format aggregated result for console', () => {
        const result = aggregateValidationResults();
        const output = formatAggregatedResultForConsole(result);
        
        expect(output).toContain('✅ All validations passed!');
      });

      it('should show error count when validation fails', () => {
        const namingResult: ComponentNameValidationResult = {
          valid: false,
          name: 'inputtext',
          segments: { family: 'inputtext', type: '', variant: '' },
          errors: [{
            code: 'MISSING_HYPHENS',
            message: 'Missing hyphens',
            guidance: 'Add hyphens'
          }],
          warnings: []
        };
        
        const result = aggregateValidationResults(namingResult);
        const output = formatAggregatedResultForConsole(result);
        
        expect(output).toContain('❌ Validation failed:');
        expect(output).toContain('1 error(s)');
      });
    });

    describe('formatAggregatedResultForMarkdown', () => {
      it('should format aggregated result for markdown', () => {
        const result = aggregateValidationResults();
        const output = formatAggregatedResultForMarkdown(result);
        
        expect(output).toContain('# Stemma System Validation Report');
        expect(output).toContain('## Summary');
        expect(output).toContain('| Category | Errors | Warnings |');
      });
    });
  });

  describe('IDE Integration Helpers', () => {
    describe('getAllErrorCodes', () => {
      it('should return all error codes as a Map', () => {
        const codes = getAllErrorCodes();
        
        expect(codes instanceof Map).toBe(true);
        expect(codes.size).toBeGreaterThan(30); // We have many error codes
        expect(codes.has('MISSING_HYPHENS')).toBe(true);
        expect(codes.has('HARDCODED_COLOR')).toBe(true);
        expect(codes.has('MISSING_ACCESSIBILITY_LABEL')).toBe(true);
      });
    });

    describe('getDocumentationLink', () => {
      it('should return documentation link for known codes', () => {
        const link = getDocumentationLink('MISSING_HYPHENS');
        expect(link).toBeDefined();
        expect(link).toContain('stemma-system-principles');
      });

      it('should return undefined for unknown codes', () => {
        const link = getDocumentationLink('UNKNOWN_CODE');
        expect(link).toBeUndefined();
      });
    });

    describe('getQuickFix', () => {
      it('should return quick fix for codes with fixes', () => {
        const quickFix = getQuickFix('MISSING_HYPHENS');
        expect(quickFix).toBeDefined();
        expect(quickFix?.title).toBeDefined();
        expect(quickFix?.type).toBe('replace');
      });

      it('should return undefined for codes without fixes', () => {
        const quickFix = getQuickFix('TOO_MANY_SEGMENTS');
        expect(quickFix).toBeUndefined();
      });
    });

    describe('hasAutoFix', () => {
      it('should return true for auto-applicable fixes', () => {
        expect(hasAutoFix('MISSING_HYPHENS')).toBe(true);
        expect(hasAutoFix('WRONG_CASE')).toBe(true);
      });

      it('should return false for non-auto-applicable fixes', () => {
        expect(hasAutoFix('HARDCODED_COLOR')).toBe(false);
      });

      it('should return false for codes without fixes', () => {
        expect(hasAutoFix('TOO_MANY_SEGMENTS')).toBe(false);
      });
    });

    describe('getWCAGReference', () => {
      it('should return WCAG reference for accessibility errors', () => {
        expect(getWCAGReference('MISSING_ACCESSIBILITY_LABEL')).toBe('4.1.2');
        expect(getWCAGReference('MISSING_FOCUS_INDICATOR')).toBe('2.4.7');
        expect(getWCAGReference('INSUFFICIENT_TOUCH_TARGET')).toBe('2.5.8');
      });

      it('should return undefined for non-accessibility errors', () => {
        expect(getWCAGReference('MISSING_HYPHENS')).toBeUndefined();
      });
    });

    describe('getRelatedCodes', () => {
      it('should return related codes when available', () => {
        const related = getRelatedCodes('MISSING_HYPHENS');
        expect(related).toContain('WRONG_CASE');
        expect(related).toContain('TOO_FEW_SEGMENTS');
      });

      it('should return empty array when no related codes', () => {
        const related = getRelatedCodes('TOO_MANY_SEGMENTS');
        expect(related).toEqual([]);
      });
    });

    describe('exportDiagnosticsForVSCode', () => {
      it('should export diagnostics in VS Code format', () => {
        const guidance = getErrorGuidance('MISSING_HYPHENS')!;
        const diagnostic = createIDEDiagnostic(guidance, 'test.ts');
        
        const exported = exportDiagnosticsForVSCode([diagnostic], 'file:///test.ts');
        
        expect(exported.uri).toBe('file:///test.ts');
        expect(exported.diagnostics.length).toBe(1);
        expect(exported.diagnostics[0].code).toBe('MISSING_HYPHENS');
      });
    });

    describe('exportDiagnosticsForESLint', () => {
      it('should export diagnostics in ESLint format', () => {
        const guidance = getErrorGuidance('MISSING_HYPHENS')!;
        const diagnostic = createIDEDiagnostic(guidance, 'test.ts', 10, 5);
        
        const exported = exportDiagnosticsForESLint([diagnostic], 'test.ts');
        
        expect(exported.length).toBe(1);
        expect(exported[0].ruleId).toBe('stemma/MISSING_HYPHENS');
        expect(exported[0].severity).toBe(2); // ESLint error
        expect(exported[0].line).toBe(10);
        expect(exported[0].column).toBe(5);
      });

      it('should map warning severity correctly', () => {
        const guidance = getErrorGuidance('UNUSUAL_FAMILY_NAME')!;
        const diagnostic = createIDEDiagnostic(guidance, 'test.ts');
        
        const exported = exportDiagnosticsForESLint([diagnostic], 'test.ts');
        
        expect(exported[0].severity).toBe(1); // ESLint warning
      });
    });
  });
});
