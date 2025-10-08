/**
 * Tests for BuildError interface and utilities
 */

import {
  BuildError,
  createBuildError,
  ErrorCodes,
  isBuildError,
  ErrorSeverity,
  ErrorCategory,
} from '../BuildError';

describe('BuildError', () => {
  describe('createBuildError', () => {
    it('should create a BuildError with required fields', () => {
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error message',
        severity: 'error',
        category: 'build',
      });

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.severity).toBe('error');
      expect(error.category).toBe('build');
      expect(error.context).toEqual({});
      expect(error.suggestions).toEqual([]);
      expect(error.documentation).toEqual([]);
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create a BuildError with optional fields', () => {
      const originalError = new Error('Original error');
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error message',
        severity: 'warning',
        category: 'token',
        platform: 'ios',
        component: 'Button',
        context: { tokenName: 'space100' },
        suggestions: ['Check token definition'],
        documentation: ['https://docs.example.com'],
        originalError,
      });

      expect(error.platform).toBe('ios');
      expect(error.component).toBe('Button');
      expect(error.context).toEqual({ tokenName: 'space100' });
      expect(error.suggestions).toEqual(['Check token definition']);
      expect(error.documentation).toEqual(['https://docs.example.com']);
      expect(error.originalError).toBe(originalError);
    });

    it('should create errors with different severity levels', () => {
      const severities: ErrorSeverity[] = ['error', 'warning', 'info'];

      severities.forEach(severity => {
        const error = createBuildError({
          code: 'TEST_ERROR',
          message: 'Test message',
          severity,
          category: 'build',
        });

        expect(error.severity).toBe(severity);
      });
    });

    it('should create errors with different categories', () => {
      const categories: ErrorCategory[] = ['config', 'build', 'token', 'interface'];

      categories.forEach(category => {
        const error = createBuildError({
          code: 'TEST_ERROR',
          message: 'Test message',
          severity: 'error',
          category,
        });

        expect(error.category).toBe(category);
      });
    });
  });

  describe('ErrorCodes', () => {
    it('should define configuration error codes', () => {
      expect(ErrorCodes.CONFIG_INVALID_PLATFORM).toBe('CONFIG_INVALID_PLATFORM');
      expect(ErrorCodes.CONFIG_MISSING_REQUIRED).toBe('CONFIG_MISSING_REQUIRED');
      expect(ErrorCodes.CONFIG_CONFLICTING_OPTIONS).toBe('CONFIG_CONFLICTING_OPTIONS');
      expect(ErrorCodes.CONFIG_INVALID_OUTPUT_DIR).toBe('CONFIG_INVALID_OUTPUT_DIR');
    });

    it('should define build error codes', () => {
      expect(ErrorCodes.BUILD_COMPILATION_FAILED).toBe('BUILD_COMPILATION_FAILED');
      expect(ErrorCodes.BUILD_MISSING_DEPENDENCY).toBe('BUILD_MISSING_DEPENDENCY');
      expect(ErrorCodes.BUILD_INVALID_SOURCE).toBe('BUILD_INVALID_SOURCE');
      expect(ErrorCodes.BUILD_PACKAGE_GENERATION_FAILED).toBe('BUILD_PACKAGE_GENERATION_FAILED');
    });

    it('should define token error codes', () => {
      expect(ErrorCodes.TOKEN_NOT_FOUND).toBe('TOKEN_NOT_FOUND');
      expect(ErrorCodes.TOKEN_INVALID_SELECTION).toBe('TOKEN_INVALID_SELECTION');
      expect(ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY).toBe('TOKEN_MATHEMATICAL_INCONSISTENCY');
      expect(ErrorCodes.TOKEN_CONVERSION_FAILED).toBe('TOKEN_CONVERSION_FAILED');
    });

    it('should define interface error codes', () => {
      expect(ErrorCodes.INTERFACE_METHOD_MISMATCH).toBe('INTERFACE_METHOD_MISMATCH');
      expect(ErrorCodes.INTERFACE_PROPERTY_MISMATCH).toBe('INTERFACE_PROPERTY_MISMATCH');
      expect(ErrorCodes.INTERFACE_MISSING_IMPLEMENTATION).toBe('INTERFACE_MISSING_IMPLEMENTATION');
      expect(ErrorCodes.INTERFACE_BEHAVIORAL_INCONSISTENCY).toBe('INTERFACE_BEHAVIORAL_INCONSISTENCY');
    });
  });

  describe('isBuildError', () => {
    it('should return true for valid BuildError objects', () => {
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test message',
        severity: 'error',
        category: 'build',
      });

      expect(isBuildError(error)).toBe(true);
    });

    it('should return false for non-BuildError objects', () => {
      expect(isBuildError(null)).toBe(false);
      expect(isBuildError(undefined)).toBe(false);
      expect(isBuildError({})).toBe(false);
      expect(isBuildError(new Error('test'))).toBe(false);
      expect(isBuildError('string')).toBe(false);
      expect(isBuildError(123)).toBe(false);
    });

    it('should return false for objects missing required fields', () => {
      expect(isBuildError({ code: 'TEST' })).toBe(false);
      expect(isBuildError({ message: 'Test' })).toBe(false);
      expect(isBuildError({ code: 'TEST', message: 'Test' })).toBe(false);
      expect(isBuildError({ code: 'TEST', message: 'Test', severity: 'error' })).toBe(false);
    });
  });

  describe('BuildError structure', () => {
    it('should include timestamp', () => {
      const before = new Date();
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test message',
        severity: 'error',
        category: 'build',
      });
      const after = new Date();

      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should support complex context objects', () => {
      const context = {
        file: 'test.ts',
        line: 42,
        column: 10,
        metadata: {
          nested: 'value',
          array: [1, 2, 3],
        },
      };

      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test message',
        severity: 'error',
        category: 'build',
        context,
      });

      expect(error.context).toEqual(context);
    });

    it('should support multiple suggestions and documentation links', () => {
      const suggestions = [
        'First suggestion',
        'Second suggestion',
        'Third suggestion',
      ];
      const documentation = [
        'https://docs.example.com/guide1',
        'https://docs.example.com/guide2',
      ];

      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test message',
        severity: 'error',
        category: 'build',
        suggestions,
        documentation,
      });

      expect(error.suggestions).toEqual(suggestions);
      expect(error.documentation).toEqual(documentation);
    });
  });
});
