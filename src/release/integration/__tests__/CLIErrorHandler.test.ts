/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Unit Tests for CLI Error Handler
 * 
 * Tests error categorization, retry logic, fallback mechanisms, and recovery strategies.
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real error handling logic
 * - Focus on error categorization: Tests validate error type detection and retry strategies
 * - Pure logic testing: No file system or external dependencies
 */

import {
  CLIErrorHandler,
  CLIError,
  CLIErrorCategory,
  RetryStrategy,
  FallbackOptions
} from '../CLIErrorHandler';
import { CLIExecutionResult } from '../CLIBridge';
import { JSONParseError } from '../AnalysisResultParser';

describe('CLIErrorHandler', () => {
  let handler: CLIErrorHandler;

  beforeEach(() => {
    handler = new CLIErrorHandler();
    // Suppress console output during tests
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('categorizeError', () => {
    it('should categorize timeout errors', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 300000,
        timedOut: true,
        error: 'CLI execution timed out after 300000ms'
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.TIMEOUT);
    });

    it('should categorize parse errors', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: 'invalid json',
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      const parseError = new JSONParseError('Unexpected token');
      const category = handler.categorizeError(result, parseError);
      expect(category).toBe(CLIErrorCategory.PARSE_ERROR);
    });

    it('should categorize CLI unavailable errors', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 100,
        error: 'Failed to spawn CLI process: ENOENT'
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.CLI_UNAVAILABLE);
    });

    it('should categorize configuration errors', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: 'Invalid argument: --unknown-flag',
        exitCode: 2,
        duration: 500
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.CONFIGURATION);
    });

    it('should categorize transient network errors', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: 'Error: ECONNREFUSED',
        exitCode: 1,
        duration: 2000
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.TRANSIENT);
    });

    it('should categorize execution failures', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: 'Error: Analysis failed',
        exitCode: 1,
        duration: 5000
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.EXECUTION_FAILED);
    });

    it('should categorize unknown errors', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: 99,
        duration: 1000
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.UNKNOWN);
    });
  });

  describe('createError', () => {
    it('should create CLIError with correct category and message', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 300000,
        timedOut: true,
        error: 'CLI execution timed out'
      };

      const error = handler.createError(result);

      expect(error).toBeInstanceOf(CLIError);
      expect(error.category).toBe(CLIErrorCategory.TIMEOUT);
      expect(error.message).toContain('timed out');
      expect(error.executionResult).toBe(result);
      expect(error.recoverySuggestions.length).toBeGreaterThan(0);
    });

    it('should include parse error in CLIError', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: 'invalid json',
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      const parseError = new JSONParseError('Unexpected token');
      const error = handler.createError(result, parseError);

      expect(error.category).toBe(CLIErrorCategory.PARSE_ERROR);
      expect(error.originalError).toBe(parseError);
      expect(error.message).toContain('Failed to parse CLI output');
    });

    it('should include recovery suggestions', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 100,
        error: 'ENOENT: command not found'
      };

      const error = handler.createError(result);

      expect(error.recoverySuggestions).toContain('Verify npm is installed and in PATH');
      expect(error.recoverySuggestions).toContain('Check that release:analyze script exists in package.json');
    });
  });

  describe('CLIError', () => {
    it('should identify retryable errors', () => {
      const transientError = new CLIError(
        'Network error',
        CLIErrorCategory.TRANSIENT
      );
      expect(transientError.isRetryable()).toBe(true);

      const timeoutError = new CLIError(
        'Timeout',
        CLIErrorCategory.TIMEOUT
      );
      expect(timeoutError.isRetryable()).toBe(true);

      const configError = new CLIError(
        'Invalid config',
        CLIErrorCategory.CONFIGURATION
      );
      expect(configError.isRetryable()).toBe(false);
    });

    it('should provide user-friendly error messages', () => {
      const error = new CLIError(
        'Technical error message',
        CLIErrorCategory.CLI_UNAVAILABLE
      );

      const userMessage = error.getUserMessage();
      expect(userMessage).toBe('Release analysis CLI is not available');
    });

    it('should provide detailed error information', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: 'Error details',
        exitCode: 1,
        duration: 1000
      };

      const error = new CLIError(
        'Execution failed',
        CLIErrorCategory.EXECUTION_FAILED,
        undefined,
        result,
        ['Suggestion 1', 'Suggestion 2']
      );

      const detailed = error.getDetailedMessage();
      expect(detailed).toContain('Category: EXECUTION_FAILED');
      expect(detailed).toContain('Message: Execution failed');
      expect(detailed).toContain('Exit Code: 1');
      expect(detailed).toContain('Stderr: Error details');
      expect(detailed).toContain('Suggestion 1');
      expect(detailed).toContain('Suggestion 2');
    });
  });

  describe('executeWithRetry', () => {
    it('should succeed on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await handler.executeWithRetry(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry transient errors', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new CLIError('Network error', CLIErrorCategory.TRANSIENT))
        .mockRejectedValueOnce(new CLIError('Network error', CLIErrorCategory.TRANSIENT))
        .mockResolvedValue('success');

      const strategy: Partial<RetryStrategy> = {
        maxAttempts: 3,
        initialDelay: 10,
        backoffMultiplier: 1
      };

      const result = await handler.executeWithRetry(operation, strategy);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      const operation = jest.fn()
        .mockRejectedValue(new CLIError('Config error', CLIErrorCategory.CONFIGURATION));

      const strategy: Partial<RetryStrategy> = {
        maxAttempts: 3,
        initialDelay: 10
      };

      await expect(handler.executeWithRetry(operation, strategy)).rejects.toThrow('Config error');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should throw after max attempts exhausted', async () => {
      const operation = jest.fn()
        .mockRejectedValue(new CLIError('Transient error', CLIErrorCategory.TRANSIENT));

      const strategy: Partial<RetryStrategy> = {
        maxAttempts: 2,
        initialDelay: 10
      };

      await expect(handler.executeWithRetry(operation, strategy)).rejects.toThrow('Operation failed after 2 attempts');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should use exponential backoff', async () => {
      const delays: number[] = [];
      const operation = jest.fn()
        .mockRejectedValue(new CLIError('Transient error', CLIErrorCategory.TRANSIENT));

      // Mock sleep to capture delays
      const sleepSpy = jest.spyOn(handler as any, 'sleep').mockImplementation((...args: unknown[]) => {
        const ms = args[0] as number;
        delays.push(ms);
        return Promise.resolve();
      });

      const strategy: Partial<RetryStrategy> = {
        maxAttempts: 3,
        initialDelay: 100,
        backoffMultiplier: 2,
        maxDelay: 1000
      };

      await expect(handler.executeWithRetry(operation, strategy)).rejects.toThrow();

      expect(delays).toEqual([100, 200]); // First retry: 100ms, second retry: 200ms
      sleepSpy.mockRestore();
    });

    it('should respect max delay', async () => {
      const delays: number[] = [];
      const operation = jest.fn()
        .mockRejectedValue(new CLIError('Transient error', CLIErrorCategory.TRANSIENT));

      const sleepSpy = jest.spyOn(handler as any, 'sleep').mockImplementation((...args: unknown[]) => {
        const ms = args[0] as number;
        delays.push(ms);
        return Promise.resolve();
      });

      const strategy: Partial<RetryStrategy> = {
        maxAttempts: 4,
        initialDelay: 100,
        backoffMultiplier: 3,
        maxDelay: 500
      };

      await expect(handler.executeWithRetry(operation, strategy)).rejects.toThrow();

      // Delays should be capped at maxDelay
      expect(delays).toEqual([100, 300, 500]); // Third delay capped at 500
      sleepSpy.mockRestore();
    });
  });

  describe('handleError', () => {
    it('should log error details', async () => {
      const error = new CLIError(
        'Test error',
        CLIErrorCategory.EXECUTION_FAILED,
        undefined,
        undefined,
        ['Suggestion 1']
      );

      await expect(handler.handleError(error)).rejects.toThrow(error);
      expect(console.error).toHaveBeenCalledWith('CLI Error Details:');
    });

    it('should provide fallback guidance for CLI unavailable', async () => {
      const error = new CLIError(
        'CLI not found',
        CLIErrorCategory.CLI_UNAVAILABLE
      );

      await expect(handler.handleError(error)).rejects.toThrow(error);
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CLI is unavailable'));
    });

    it('should provide fallback guidance for timeout', async () => {
      const error = new CLIError(
        'Timeout',
        CLIErrorCategory.TIMEOUT
      );

      await expect(handler.handleError(error)).rejects.toThrow(error);
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Analysis timed out'));
    });

    it('should provide fallback guidance for parse errors', async () => {
      const error = new CLIError(
        'Parse failed',
        CLIErrorCategory.PARSE_ERROR
      );

      await expect(handler.handleError(error)).rejects.toThrow(error);
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Failed to parse CLI output'));
    });

    it('should throw immediately when fallbacks disabled', async () => {
      const error = new CLIError(
        'Test error',
        CLIErrorCategory.EXECUTION_FAILED
      );

      const options: Partial<FallbackOptions> = {
        enabled: false
      };

      await expect(handler.handleError(error, options)).rejects.toThrow(error);
      // Should not log warnings when fallbacks disabled
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('validateResult', () => {
    it('should pass for successful results', () => {
      const result: CLIExecutionResult = {
        success: true,
        stdout: 'Analysis complete',
        stderr: '',
        exitCode: 0,
        duration: 5000
      };

      expect(() => handler.validateResult(result)).not.toThrow();
    });

    it('should throw for failed results', () => {
      const result: CLIExecutionResult = {
        success: false,
        stdout: '',
        stderr: 'Error',
        exitCode: 1,
        duration: 1000,
        error: 'CLI failed'
      };

      expect(() => handler.validateResult(result)).toThrow(CLIError);
    });

    it('should throw for empty output', () => {
      const result: CLIExecutionResult = {
        success: true,
        stdout: '   ',
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      expect(() => handler.validateResult(result)).toThrow('CLI produced no output');
    });
  });

  describe('validateParsing', () => {
    it('should pass when no parse error', () => {
      const result: CLIExecutionResult = {
        success: true,
        stdout: '{"valid": "json"}',
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      expect(() => handler.validateParsing(result)).not.toThrow();
    });

    it('should throw when parse error provided', () => {
      const result: CLIExecutionResult = {
        success: true,
        stdout: 'invalid json',
        stderr: '',
        exitCode: 0,
        duration: 1000
      };

      const parseError = new JSONParseError('Unexpected token');

      expect(() => handler.validateParsing(result, parseError)).toThrow(CLIError);
    });
  });

  describe('isRecoverable', () => {
    it('should identify recoverable errors', () => {
      const transientError = new CLIError('Network error', CLIErrorCategory.TRANSIENT);
      expect(handler.isRecoverable(transientError)).toBe(true);

      const timeoutError = new CLIError('Timeout', CLIErrorCategory.TIMEOUT);
      expect(handler.isRecoverable(timeoutError)).toBe(true);
    });

    it('should identify non-recoverable errors', () => {
      const configError = new CLIError('Config error', CLIErrorCategory.CONFIGURATION);
      expect(handler.isRecoverable(configError)).toBe(false);

      const genericError = new Error('Generic error');
      expect(handler.isRecoverable(genericError)).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('should calculate delay with exponential backoff', () => {
      const strategy: Partial<RetryStrategy> = {
        initialDelay: 100,
        backoffMultiplier: 2,
        maxDelay: 10000
      };

      expect(handler.getRetryDelay(0, strategy)).toBe(100);
      expect(handler.getRetryDelay(1, strategy)).toBe(200);
      expect(handler.getRetryDelay(2, strategy)).toBe(400);
      expect(handler.getRetryDelay(3, strategy)).toBe(800);
    });

    it('should cap delay at maxDelay', () => {
      const strategy: Partial<RetryStrategy> = {
        initialDelay: 100,
        backoffMultiplier: 10,
        maxDelay: 500
      };

      expect(handler.getRetryDelay(0, strategy)).toBe(100);
      expect(handler.getRetryDelay(1, strategy)).toBe(500); // Capped
      expect(handler.getRetryDelay(2, strategy)).toBe(500); // Capped
    });

    it('should use default strategy when not provided', () => {
      const delay = handler.getRetryDelay(0);
      expect(delay).toBeGreaterThan(0);
    });
  });
});
