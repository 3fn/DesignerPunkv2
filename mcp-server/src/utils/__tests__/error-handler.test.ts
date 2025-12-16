/**
 * Tests for error handling utilities
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { ErrorHandler, ErrorLogEntry } from '../error-handler';

describe('ErrorHandler', () => {
  const testLogDir = 'test-logs';
  const testLogFile = path.join(testLogDir, 'errors.log');
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler(testLogDir);
    // Clean up test log directory
    if (fs.existsSync(testLogDir)) {
      fs.rmSync(testLogDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test log directory
    if (fs.existsSync(testLogDir)) {
      fs.rmSync(testLogDir, { recursive: true });
    }
  });

  describe('formatFileNotFound', () => {
    it('should format FileNotFound error with path', () => {
      const error = errorHandler.formatFileNotFound('.kiro/steering/NonExistent.md');
      
      expect(error.error).toBe('FileNotFound');
      expect(error.message).toBe('Document not found: .kiro/steering/NonExistent.md');
      expect(error.filePath).toBe('.kiro/steering/NonExistent.md');
    });

    it('should include suggestions when provided', () => {
      const suggestions = [
        '.kiro/steering/Component Development Guide.md',
        '.kiro/steering/Spec Planning Standards.md'
      ];
      const error = errorHandler.formatFileNotFound('.kiro/steering/NonExistent.md', suggestions);
      
      expect(error.suggestions).toEqual(suggestions);
    });

    it('should not include suggestions when empty', () => {
      const error = errorHandler.formatFileNotFound('.kiro/steering/NonExistent.md', []);
      
      expect(error.suggestions).toBeUndefined();
    });
  });

  describe('formatSectionNotFound', () => {
    it('should format SectionNotFound error with heading', () => {
      const error = errorHandler.formatSectionNotFound(
        '.kiro/steering/Test.md',
        'Invalid Heading'
      );
      
      expect(error.error).toBe('SectionNotFound');
      expect(error.message).toBe('Section "Invalid Heading" not found in Test.md');
      expect(error.filePath).toBe('.kiro/steering/Test.md');
    });

    it('should include available sections as suggestions', () => {
      const availableSections = [
        'Token Selection Decision Framework',
        'Common Component Patterns',
        'Anti-Patterns to Avoid'
      ];
      const error = errorHandler.formatSectionNotFound(
        '.kiro/steering/Test.md',
        'Invalid Heading',
        availableSections
      );
      
      expect(error.suggestions).toEqual(availableSections);
    });
  });

  describe('formatMalformedMetadata', () => {
    it('should format MalformedMetadata error with issues', () => {
      const issues = [
        { field: 'layer', issue: 'Missing required field', severity: 'error' as const },
        { field: 'lastReviewed', issue: 'Invalid date format', severity: 'warning' as const }
      ];
      const error = errorHandler.formatMalformedMetadata('.kiro/steering/Test.md', issues);
      
      expect(error.error).toBe('MalformedMetadata');
      expect(error.message).toBe('Metadata validation failed for Test.md');
      expect(error.issues).toEqual(issues);
    });

    it('should include partial content when provided', () => {
      const issues = [{ field: 'layer', issue: 'Missing', severity: 'error' as const }];
      const partialContent = '# Test Document\n\nSome content...';
      const error = errorHandler.formatMalformedMetadata(
        '.kiro/steering/Test.md',
        issues,
        partialContent
      );
      
      expect(error.partialContent).toBe(partialContent);
    });
  });

  describe('formatInvalidCrossReference', () => {
    it('should format InvalidCrossReference error', () => {
      const error = errorHandler.formatInvalidCrossReference(
        '.kiro/steering/Source.md',
        'docs/missing-file.md',
        'Token Selection',
        42
      );
      
      expect(error.error).toBe('InvalidCrossReference');
      expect(error.message).toBe('Cross-reference target not found: docs/missing-file.md');
      expect(error.filePath).toBe('.kiro/steering/Source.md');
      expect(error.suggestions).toContain('Source: Source.md, Section: Token Selection, Line: 42');
    });
  });

  describe('logError', () => {
    it('should create log directory if it does not exist', () => {
      expect(fs.existsSync(testLogDir)).toBe(false);
      
      errorHandler.logError('FileNotFound', '/test/path.md', 'Test error');
      
      expect(fs.existsSync(testLogDir)).toBe(true);
    });

    it('should write error to log file with timestamp', () => {
      errorHandler.logError('FileNotFound', '/test/path.md', 'Test error message');
      
      expect(fs.existsSync(testLogFile)).toBe(true);
      const content = fs.readFileSync(testLogFile, 'utf-8');
      const entry = JSON.parse(content.trim()) as ErrorLogEntry;
      
      expect(entry.errorType).toBe('FileNotFound');
      expect(entry.filePath).toBe('/test/path.md');
      expect(entry.message).toBe('Test error message');
      expect(entry.timestamp).toBeDefined();
      expect(new Date(entry.timestamp).getTime()).not.toBeNaN();
    });

    it('should include context when provided', () => {
      errorHandler.logError('SectionNotFound', '/test/path.md', 'Test error', {
        heading: 'Test Heading',
        availableSections: ['Section 1', 'Section 2']
      });
      
      const content = fs.readFileSync(testLogFile, 'utf-8');
      const entry = JSON.parse(content.trim()) as ErrorLogEntry;
      
      expect(entry.context).toEqual({
        heading: 'Test Heading',
        availableSections: ['Section 1', 'Section 2']
      });
    });

    it('should append multiple errors to log file', () => {
      errorHandler.logError('FileNotFound', '/path1.md', 'Error 1');
      errorHandler.logError('SectionNotFound', '/path2.md', 'Error 2');
      errorHandler.logError('MalformedMetadata', '/path3.md', 'Error 3');
      
      const content = fs.readFileSync(testLogFile, 'utf-8');
      const lines = content.trim().split('\n');
      
      expect(lines.length).toBe(3);
    });
  });

  describe('handle methods', () => {
    it('handleFileNotFound should format and log error', () => {
      const error = errorHandler.handleFileNotFound('/test/path.md', ['suggestion1.md']);
      
      expect(error.error).toBe('FileNotFound');
      expect(fs.existsSync(testLogFile)).toBe(true);
    });

    it('handleSectionNotFound should format and log error', () => {
      const error = errorHandler.handleSectionNotFound('/test/path.md', 'Missing Section', ['Section 1']);
      
      expect(error.error).toBe('SectionNotFound');
      expect(fs.existsSync(testLogFile)).toBe(true);
    });

    it('handleMalformedMetadata should format and log error', () => {
      const issues = [{ field: 'layer', issue: 'Missing', severity: 'error' as const }];
      const error = errorHandler.handleMalformedMetadata('/test/path.md', issues);
      
      expect(error.error).toBe('MalformedMetadata');
      expect(fs.existsSync(testLogFile)).toBe(true);
    });

    it('handleInvalidCrossReference should format and log error', () => {
      const error = errorHandler.handleInvalidCrossReference(
        '/source.md',
        '/target.md',
        'Section',
        10
      );
      
      expect(error.error).toBe('InvalidCrossReference');
      expect(fs.existsSync(testLogFile)).toBe(true);
    });
  });

  describe('getRecentErrors', () => {
    it('should return empty array when log file does not exist', () => {
      const errors = errorHandler.getRecentErrors();
      expect(errors).toEqual([]);
    });

    it('should return recent errors from log file', () => {
      errorHandler.logError('FileNotFound', '/path1.md', 'Error 1');
      errorHandler.logError('SectionNotFound', '/path2.md', 'Error 2');
      
      const errors = errorHandler.getRecentErrors();
      
      expect(errors.length).toBe(2);
      expect(errors[0].errorType).toBe('FileNotFound');
      expect(errors[1].errorType).toBe('SectionNotFound');
    });

    it('should limit results to specified count', () => {
      for (let i = 0; i < 5; i++) {
        errorHandler.logError('FileNotFound', `/path${i}.md`, `Error ${i}`);
      }
      
      const errors = errorHandler.getRecentErrors(3);
      
      expect(errors.length).toBe(3);
      expect(errors[0].message).toBe('Error 2');
      expect(errors[2].message).toBe('Error 4');
    });
  });

  describe('clearErrorLog', () => {
    it('should clear the error log file', () => {
      errorHandler.logError('FileNotFound', '/path.md', 'Error');
      expect(fs.readFileSync(testLogFile, 'utf-8').length).toBeGreaterThan(0);
      
      errorHandler.clearErrorLog();
      
      expect(fs.readFileSync(testLogFile, 'utf-8')).toBe('');
    });

    it('should not throw if log file does not exist', () => {
      expect(() => errorHandler.clearErrorLog()).not.toThrow();
    });
  });
});
