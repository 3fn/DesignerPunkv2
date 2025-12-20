/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Tests for ErrorHandler class
 */

import { ErrorHandler } from '../ErrorHandler';
import { createBuildError, ErrorCodes } from '../BuildError';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
  });

  describe('constructor', () => {
    it('should create ErrorHandler with default options', () => {
      const handler = new ErrorHandler();
      expect(handler).toBeInstanceOf(ErrorHandler);
    });

    it('should create ErrorHandler with custom options', () => {
      const logger = jest.fn();
      const handler = new ErrorHandler({
        verbose: true,
        maxRetries: 5,
        continueOnPlatformFailure: false,
        logger,
      });

      expect(handler).toBeInstanceOf(ErrorHandler);
    });
  });

  describe('handleError', () => {
    it('should handle configuration errors with abort strategy', () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform specified',
        severity: 'error',
        category: 'config',
      });

      const recovery = errorHandler.handleError(error);

      expect(recovery.recoverable).toBe(false);
      expect(recovery.strategy).toBe('abort');
      expect(recovery.actions.length).toBeGreaterThan(0);
    });

    it('should handle build errors with retry strategy', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Compilation failed',
        severity: 'error',
        category: 'build',
      });

      const recovery = errorHandler.handleError(error);

      expect(recovery.recoverable).toBe(true);
      expect(recovery.strategy).toBe('retry');
    });

    it('should handle platform-specific errors with skip strategy', () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'iOS build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      });

      const recovery = errorHandler.handleError(error);

      expect(recovery.recoverable).toBe(true);
      expect(recovery.strategy).toBe('skip');
      expect(recovery.actions).toContain('Skip ios platform build');
    });

    it('should handle token errors with fallback strategy', () => {
      const error = createBuildError({
        code: ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        severity: 'error',
        category: 'token',
      });

      const recovery = errorHandler.handleError(error);

      expect(recovery.recoverable).toBe(true);
      expect(recovery.strategy).toBe('fallback');
    });

    it('should handle interface errors with fallback strategy', () => {
      const error = createBuildError({
        code: ErrorCodes.INTERFACE_METHOD_MISMATCH,
        message: 'Method signature mismatch',
        severity: 'error',
        category: 'interface',
      });

      const recovery = errorHandler.handleError(error);

      expect(recovery.recoverable).toBe(true);
      expect(recovery.strategy).toBe('fallback');
    });

    it('should handle warnings as recoverable', () => {
      const error = createBuildError({
        code: 'WARNING_TEST',
        message: 'Test warning',
        severity: 'warning',
        category: 'build',
      });

      const recovery = errorHandler.handleError(error);

      expect(recovery.recoverable).toBe(true);
      expect(recovery.strategy).toBe('skip');
    });
  });

  describe('recover', () => {
    it('should return failure for non-recoverable errors', async () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform',
        severity: 'error',
        category: 'config',
      });

      const result = await errorHandler.recover(error);

      expect(result.success).toBe(false);
      expect(result.strategy).toBe('abort');
      expect(result.errors).toContain(error);
    });

    it('should handle retry recovery', async () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Build failed',
        severity: 'error',
        category: 'build',
      });

      const result = await errorHandler.recover(error, {
        retryAttempt: 0,
        maxRetries: 3,
      });

      expect(result.strategy).toBe('retry');
      expect(result.success).toBe(true);
      expect(result.message).toContain('Retrying operation');
    });

    it('should handle skip recovery', async () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'iOS build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      });

      const result = await errorHandler.recover(error, {
        platform: 'ios',
        remainingPlatforms: ['android', 'web'],
      });

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('skip');
      expect(result.message).toContain('Skipping ios platform');
    });

    it('should handle fallback recovery', async () => {
      const error = createBuildError({
        code: ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        severity: 'error',
        category: 'token',
      });

      const result = await errorHandler.recover(error, {
        cachedArtifacts: { 'build': {} },
      });

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('fallback');
      expect(result.message).toContain('Using cached build artifacts');
    });
  });

  describe('recoverWithStrategy', () => {
    it('should execute explicit retry strategy', async () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Build failed',
        severity: 'error',
        category: 'build',
      });

      const result = await errorHandler.recoverWithStrategy(error, 'retry', {
        retryAttempt: 0,
        maxRetries: 3,
      });

      expect(result.strategy).toBe('retry');
      expect(result.success).toBe(true);
    });

    it('should execute explicit skip strategy', async () => {
      const error = createBuildError({
        code: ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'iOS build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      });

      const result = await errorHandler.recoverWithStrategy(error, 'skip', {
        platform: 'ios',
        remainingPlatforms: ['android', 'web'],
      });

      expect(result.strategy).toBe('skip');
      expect(result.success).toBe(true);
    });

    it('should execute explicit fallback strategy', async () => {
      const error = createBuildError({
        code: ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        severity: 'error',
        category: 'token',
      });

      const result = await errorHandler.recoverWithStrategy(error, 'fallback', {
        defaultConfig: { spacing: 8 },
      });

      expect(result.strategy).toBe('fallback');
      expect(result.success).toBe(true);
    });

    it('should execute explicit abort strategy', async () => {
      const error = createBuildError({
        code: ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform',
        severity: 'error',
        category: 'config',
      });

      const result = await errorHandler.recoverWithStrategy(error, 'abort');

      expect(result.strategy).toBe('abort');
      expect(result.success).toBe(false);
    });
  });

  describe('error logging', () => {
    it('should log errors when handled', () => {
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
      });

      errorHandler.handleError(error);

      const errors = errorHandler.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual(error);
    });

    it('should accumulate multiple errors', () => {
      const error1 = createBuildError({
        code: 'ERROR_1',
        message: 'First error',
        severity: 'error',
        category: 'build',
      });

      const error2 = createBuildError({
        code: 'ERROR_2',
        message: 'Second error',
        severity: 'warning',
        category: 'token',
      });

      errorHandler.handleError(error1);
      errorHandler.handleError(error2);

      const errors = errorHandler.getErrors();
      expect(errors).toHaveLength(2);
    });

    it('should clear error log', () => {
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
      });

      errorHandler.handleError(error);
      expect(errorHandler.getErrors()).toHaveLength(1);

      errorHandler.clearErrors();
      expect(errorHandler.getErrors()).toHaveLength(0);
    });
  });

  describe('error filtering', () => {
    beforeEach(() => {
      errorHandler.handleError(createBuildError({
        code: 'CONFIG_ERROR',
        message: 'Config error',
        severity: 'error',
        category: 'config',
      }));

      errorHandler.handleError(createBuildError({
        code: 'BUILD_ERROR',
        message: 'Build error',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      }));

      errorHandler.handleError(createBuildError({
        code: 'TOKEN_WARNING',
        message: 'Token warning',
        severity: 'warning',
        category: 'token',
        platform: 'android',
      }));
    });

    it('should filter errors by category', () => {
      const configErrors = errorHandler.getErrorsByCategory('config');
      expect(configErrors).toHaveLength(1);
      expect(configErrors[0].category).toBe('config');

      const buildErrors = errorHandler.getErrorsByCategory('build');
      expect(buildErrors).toHaveLength(1);
      expect(buildErrors[0].category).toBe('build');

      const tokenErrors = errorHandler.getErrorsByCategory('token');
      expect(tokenErrors).toHaveLength(1);
      expect(tokenErrors[0].category).toBe('token');
    });

    it('should filter errors by platform', () => {
      const iosErrors = errorHandler.getErrorsByPlatform('ios');
      expect(iosErrors).toHaveLength(1);
      expect(iosErrors[0].platform).toBe('ios');

      const androidErrors = errorHandler.getErrorsByPlatform('android');
      expect(androidErrors).toHaveLength(1);
      expect(androidErrors[0].platform).toBe('android');

      const webErrors = errorHandler.getErrorsByPlatform('web');
      expect(webErrors).toHaveLength(0);
    });

    it('should filter errors by severity', () => {
      const errors = errorHandler.getErrorsBySeverity('error');
      expect(errors).toHaveLength(2);
      errors.forEach(error => expect(error.severity).toBe('error'));

      const warnings = errorHandler.getErrorsBySeverity('warning');
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('warning');
    });
  });

  describe('hasCriticalErrors', () => {
    it('should return true when critical errors exist', () => {
      errorHandler.handleError(createBuildError({
        code: 'CRITICAL_ERROR',
        message: 'Critical error',
        severity: 'error',
        category: 'build',
      }));

      expect(errorHandler.hasCriticalErrors()).toBe(true);
    });

    it('should return false when only warnings exist', () => {
      errorHandler.handleError(createBuildError({
        code: 'WARNING',
        message: 'Warning',
        severity: 'warning',
        category: 'build',
      }));

      expect(errorHandler.hasCriticalErrors()).toBe(false);
    });

    it('should return false when no errors exist', () => {
      expect(errorHandler.hasCriticalErrors()).toBe(false);
    });
  });

  describe('categorizeError', () => {
    it('should return BuildError as-is', () => {
      const buildError = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
      });

      const categorized = errorHandler.categorizeError(buildError);
      expect(categorized).toBe(buildError);
    });

    it('should wrap Error objects', () => {
      const error = new Error('Test error');
      const categorized = errorHandler.categorizeError(error);

      expect(categorized.code).toBe('UNKNOWN_ERROR');
      expect(categorized.message).toBe('Test error');
      expect(categorized.severity).toBe('error');
      expect(categorized.category).toBe('build');
      expect(categorized.originalError).toBe(error);
    });

    it('should wrap non-Error objects', () => {
      const categorized = errorHandler.categorizeError('String error');

      expect(categorized.code).toBe('UNKNOWN_ERROR');
      expect(categorized.message).toBe('String error');
      expect(categorized.severity).toBe('error');
      expect(categorized.category).toBe('build');
    });
  });

  describe('custom logger', () => {
    it('should use custom logger when provided', () => {
      const customLogger = jest.fn();
      const handler = new ErrorHandler({ logger: customLogger });

      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
      });

      handler.handleError(error);

      expect(customLogger).toHaveBeenCalledWith(error);
    });
  });

  describe('continueOnPlatformFailure option', () => {
    it('should skip platform errors when continueOnPlatformFailure is true', () => {
      const handler = new ErrorHandler({ continueOnPlatformFailure: true });

      const error = createBuildError({
        code: 'BUILD_ERROR',
        message: 'iOS build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      });

      const recovery = handler.handleError(error);

      expect(recovery.recoverable).toBe(true);
      expect(recovery.strategy).toBe('skip');
    });

    it('should not skip platform errors when continueOnPlatformFailure is false', () => {
      const handler = new ErrorHandler({ continueOnPlatformFailure: false });

      const error = createBuildError({
        code: 'BUILD_ERROR',
        message: 'iOS build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      });

      const recovery = handler.handleError(error);

      expect(recovery.strategy).toBe('retry');
    });
  });
});
