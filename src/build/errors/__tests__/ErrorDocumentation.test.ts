/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Error Documentation Tests
 * 
 * Tests for error documentation, suggestions, and formatting functionality.
 */

import {
  ERROR_DOCUMENTATION,
  getErrorDocumentation,
  enhanceErrorWithDocumentation,
  addErrorLocation,
  formatErrorMessage,
  generateErrorReport,
  ErrorLocation,
} from '../ErrorDocumentation';
import { createBuildError, ErrorCodes } from '../BuildError';

describe('ErrorDocumentation', () => {
  describe('ERROR_DOCUMENTATION', () => {
    it('should have documentation for all error codes', () => {
      // Verify all error codes have documentation
      Object.values(ErrorCodes).forEach(code => {
        expect(ERROR_DOCUMENTATION[code]).toBeDefined();
        expect(ERROR_DOCUMENTATION[code].code).toBe(code);
      });
    });
    
    it('should have required fields for each documentation entry', () => {
      Object.values(ERROR_DOCUMENTATION).forEach(doc => {
        expect(doc.code).toBeDefined();
        expect(doc.description).toBeDefined();
        expect(doc.cause).toBeDefined();
        expect(doc.suggestions).toBeDefined();
        expect(doc.suggestions.length).toBeGreaterThan(0);
        expect(doc.documentationLinks).toBeDefined();
        expect(doc.documentationLinks.length).toBeGreaterThan(0);
      });
    });
    
    it('should have actionable suggestions', () => {
      Object.values(ERROR_DOCUMENTATION).forEach(doc => {
        doc.suggestions.forEach(suggestion => {
          // Suggestions should be actionable (start with verb or instruction)
          expect(suggestion.length).toBeGreaterThan(10);
          expect(suggestion).not.toMatch(/^(maybe|perhaps|possibly)/i);
        });
      });
    });
  });
  
  describe('getErrorDocumentation', () => {
    it('should return documentation for valid error code', () => {
      const doc = getErrorDocumentation(ErrorCodes.CONFIG_INVALID_PLATFORM);
      
      expect(doc).toBeDefined();
      expect(doc?.code).toBe(ErrorCodes.CONFIG_INVALID_PLATFORM);
      expect(doc?.description).toContain('Invalid platform');
    });
    
    it('should return undefined for unknown error code', () => {
      const doc = getErrorDocumentation('UNKNOWN_ERROR_CODE');
      
      expect(doc).toBeUndefined();
    });
  });
  
  describe('enhanceErrorWithDocumentation', () => {
    it('should enhance error with documentation suggestions', () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform: "iOS"',
        severity: 'error',
        category: 'config',
        suggestions: ['Check platform name'],
      });
      
      const enhanced = enhanceErrorWithDocumentation(error);
      
      expect(enhanced.suggestions.length).toBeGreaterThan(error.suggestions.length);
      expect(enhanced.suggestions).toContain('Check platform name');
      expect(enhanced.suggestions.some(s => s.includes('platform'))).toBe(true);
    });
    
    it('should enhance error with documentation links', () => {
      const error = createBuildError({
        code: ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token "space999" not found',
        severity: 'error',
        category: 'token',
      });
      
      const enhanced = enhanceErrorWithDocumentation(error);
      
      expect(enhanced.documentation.length).toBeGreaterThan(0);
      expect(enhanced.documentation.some(d => d.includes('token'))).toBe(true);
    });
    
    it('should add error description and cause to context', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Swift compilation failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      });
      
      const enhanced = enhanceErrorWithDocumentation(error);
      
      expect(enhanced.context.errorDescription).toBeDefined();
      expect(enhanced.context.errorCause).toBeDefined();
      expect(enhanced.context.examples).toBeDefined();
      expect(enhanced.context.relatedErrors).toBeDefined();
    });
    
    it('should not duplicate existing suggestions', () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform',
        severity: 'error',
        category: 'config',
        suggestions: ['Check the platform value in your build configuration'],
      });
      
      const enhanced = enhanceErrorWithDocumentation(error);
      
      // Count occurrences of the suggestion
      const count = enhanced.suggestions.filter(
        s => s === 'Check the platform value in your build configuration'
      ).length;
      
      expect(count).toBe(1);
    });
    
    it('should return error unchanged if no documentation found', () => {
      const error = createBuildError({
        code: 'CUSTOM_ERROR',
        message: 'Custom error',
        severity: 'error',
        category: 'build',
      });
      
      const enhanced = enhanceErrorWithDocumentation(error);
      
      expect(enhanced).toEqual(error);
    });
  });
  
  describe('addErrorLocation', () => {
    it('should add file path to error context', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Compilation failed',
        severity: 'error',
        category: 'build',
      });
      
      const location: ErrorLocation = {
        filePath: 'src/components/Button.swift',
        lineNumber: 42,
        columnNumber: 15,
      };
      
      const errorWithLocation = addErrorLocation(error, location);
      
      expect(errorWithLocation.context.location).toEqual(location);
    });
    
    it('should add code snippet to error context', () => {
      const error = createBuildError({
        code: ErrorCodes.INTERFACE_METHOD_MISMATCH,
        message: 'Method signature mismatch',
        severity: 'error',
        category: 'interface',
      });
      
      const location: ErrorLocation = {
        filePath: 'src/components/Button.kt',
        lineNumber: 25,
        codeSnippet: '  fun onClick(handler: () -> Unit) {',
      };
      
      const errorWithLocation = addErrorLocation(error, location);
      
      expect(errorWithLocation.context.location).toEqual(location);
    });
  });
  
  describe('formatErrorMessage', () => {
    it('should format basic error message', () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform specified',
        severity: 'error',
        category: 'config',
      });
      
      const formatted = formatErrorMessage(error);
      
      expect(formatted).toContain('[ERROR]');
      expect(formatted).toContain(ErrorCodes.CONFIG_INVALID_PLATFORM);
      expect(formatted).toContain('Invalid platform specified');
    });
    
    it('should include platform and component info', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Compilation failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
        component: 'Button',
      });
      
      const formatted = formatErrorMessage(error);
      
      expect(formatted).toContain('Platform: ios');
      expect(formatted).toContain('Component: Button');
    });
    
    it('should include file location', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Compilation failed',
        severity: 'error',
        category: 'build',
      });
      
      const errorWithLocation = addErrorLocation(error, {
        filePath: 'src/Button.swift',
        lineNumber: 42,
        columnNumber: 15,
      });
      
      const formatted = formatErrorMessage(errorWithLocation);
      
      expect(formatted).toContain('src/Button.swift:42:15');
    });
    
    it('should include code snippet', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Compilation failed',
        severity: 'error',
        category: 'build',
      });
      
      const codeSnippet = '  func onClick() {\n    // Missing implementation\n  }';
      const errorWithLocation = addErrorLocation(error, {
        filePath: 'src/Button.swift',
        lineNumber: 42,
        codeSnippet,
      });
      
      const formatted = formatErrorMessage(errorWithLocation);
      
      expect(formatted).toContain('Code:');
      expect(formatted).toContain(codeSnippet);
    });
    
    it('should include suggestions', () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform',
        severity: 'error',
        category: 'config',
        suggestions: ['Check platform name', 'Use lowercase'],
      });
      
      const formatted = formatErrorMessage(error);
      
      expect(formatted).toContain('Suggestions:');
      expect(formatted).toContain('Check platform name');
      expect(formatted).toContain('Use lowercase');
    });
    
    it('should include documentation links', () => {
      const error = createBuildError({
        code: ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        severity: 'error',
        category: 'token',
        documentation: ['docs/tokens/integration.md'],
      });
      
      const formatted = formatErrorMessage(error);
      
      expect(formatted).toContain('Documentation:');
      expect(formatted).toContain('docs/tokens/integration.md');
    });
    
    it('should include enhanced documentation context', () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform',
        severity: 'error',
        category: 'config',
      });
      
      const enhanced = enhanceErrorWithDocumentation(error);
      const formatted = formatErrorMessage(enhanced);
      
      expect(formatted).toContain('Description:');
      expect(formatted).toContain('Cause:');
      expect(formatted).toContain('Examples:');
      expect(formatted).toContain('Related Errors:');
    });
  });
  
  describe('generateErrorReport', () => {
    it('should generate report for empty error list', () => {
      const report = generateErrorReport([]);
      
      expect(report).toContain('No errors to report');
    });
    
    it('should generate summary with error counts', () => {
      const errors = [
        createBuildError({
          code: ErrorCodes.CONFIG_INVALID_PLATFORM,
          message: 'Error 1',
          severity: 'error',
          category: 'config',
        }),
        createBuildError({
          code: ErrorCodes.TOKEN_NOT_FOUND,
          message: 'Error 2',
          severity: 'warning',
          category: 'token',
        }),
        createBuildError({
          code: ErrorCodes.BUILD_COMPILATION_FAILED,
          message: 'Error 3',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const report = generateErrorReport(errors);
      
      expect(report).toContain('Total Errors: 3');
      expect(report).toContain('Critical Errors: 2');
      expect(report).toContain('Warnings: 1');
    });
    
    it('should group errors by category', () => {
      const errors = [
        createBuildError({
          code: ErrorCodes.CONFIG_INVALID_PLATFORM,
          message: 'Error 1',
          severity: 'error',
          category: 'config',
        }),
        createBuildError({
          code: ErrorCodes.CONFIG_MISSING_REQUIRED,
          message: 'Error 2',
          severity: 'error',
          category: 'config',
        }),
        createBuildError({
          code: ErrorCodes.TOKEN_NOT_FOUND,
          message: 'Error 3',
          severity: 'error',
          category: 'token',
        }),
      ];
      
      const report = generateErrorReport(errors);
      
      expect(report).toContain('Errors by Category:');
      expect(report).toContain('config: 2');
      expect(report).toContain('token: 1');
    });
    
    it('should include detailed error information', () => {
      const errors = [
        createBuildError({
          code: ErrorCodes.BUILD_COMPILATION_FAILED,
          message: 'Compilation failed',
          severity: 'error',
          category: 'build',
          platform: 'ios',
          suggestions: ['Check syntax'],
        }),
      ];
      
      const report = generateErrorReport(errors);
      
      expect(report).toContain('DETAILED ERRORS');
      expect(report).toContain('[1/1]');
      expect(report).toContain('BUILD_COMPILATION_FAILED');
      expect(report).toContain('Compilation failed');
      expect(report).toContain('Platform: ios');
      expect(report).toContain('Check syntax');
    });
    
    it('should format multiple errors with separators', () => {
      const errors = [
        createBuildError({
          code: ErrorCodes.CONFIG_INVALID_PLATFORM,
          message: 'Error 1',
          severity: 'error',
          category: 'config',
        }),
        createBuildError({
          code: ErrorCodes.TOKEN_NOT_FOUND,
          message: 'Error 2',
          severity: 'error',
          category: 'token',
        }),
      ];
      
      const report = generateErrorReport(errors);
      
      expect(report).toContain('[1/2]');
      expect(report).toContain('[2/2]');
      expect(report.split('-'.repeat(80)).length).toBeGreaterThan(2);
    });
  });
  
  describe('Integration with ErrorHandler', () => {
    it('should provide comprehensive error information', () => {
      // Create error with minimal information
      const error = createBuildError({
        code: ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token "space999" not found',
        severity: 'error',
        category: 'token',
        component: 'Button',
      });
      
      // Enhance with documentation
      const enhanced = enhanceErrorWithDocumentation(error);
      
      // Add location
      const withLocation = addErrorLocation(enhanced, {
        filePath: 'src/components/Button.ts',
        lineNumber: 25,
      });
      
      // Format for display
      const formatted = formatErrorMessage(withLocation);
      
      // Verify comprehensive information
      expect(formatted).toContain('TOKEN_NOT_FOUND');
      expect(formatted).toContain('Token "space999" not found');
      expect(formatted).toContain('Component: Button');
      expect(formatted).toContain('src/components/Button.ts:25');
      expect(formatted).toContain('Suggestions:');
      expect(formatted).toContain('Documentation:');
      expect(formatted).toContain('Description:');
      expect(formatted).toContain('Cause:');
    });
  });
});
