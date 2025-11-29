/**
 * Error Recovery Tests
 * 
 * Tests error recovery strategies, retry logic, and partial completion handling
 * 
 * Mock Strategy:
 * - No external dependencies to mock
 * - Tests use simulated operations and errors
 * - Each test creates isolated ErrorRecovery instance
 * 
 * Requirements: 8.3, 8.4, 8.5
 */

import { ErrorRecovery, ErrorType, RecoveryAction, RecoveryStrategy } from '../ErrorRecovery';
import { ReleaseError } from '../../types/ReleaseTypes';

describe('ErrorRecovery', () => {
  let errorRecovery: ErrorRecovery;

  beforeEach(() => {
    errorRecovery = new ErrorRecovery();
  });

  describe('Error Classification', () => {
    it('should classify network errors as transient', () => {
      const error: ReleaseError = {
        code: 'NETWORK_ERROR',
        message: 'Connection failed',
        severity: 'error',
        step: 'publish'
      };

      const classification = errorRecovery.classifyError(error);

      expect(classification.type).toBe('transient');
      expect(classification.recoverable).toBe(true);
      expect(classification.recommendedAction).toBe('retry');
      expect(classification.confidence).toBeGreaterThan(0.8);
    });

    it('should classify timeout errors as transient', () => {
      const error: ReleaseError = {
        code: 'TIMEOUT',
        message: 'Operation timed out',
        severity: 'error',
        step: 'publish'
      };

      const classification = errorRecovery.classifyError(error);

      expect(classification.type).toBe('transient');
      expect(classification.recoverable).toBe(true);
      expect(classification.recommendedAction).toBe('retry');
    });

    it('should classify rate limit errors as transient', () => {
      const error: ReleaseError = {
        code: 'RATE_LIMIT',
        message: 'Too many requests',
        severity: 'error',
        step: 'publish'
      };

      const classification = errorRecovery.classifyError(error);

      expect(classification.type).toBe('transient');
      expect(classification.recoverable).toBe(true);
    });

    it('should classify partial errors correctly', () => {
      const error: ReleaseError = {
        code: 'PARTIAL_SUCCESS',
        message: 'Some operations succeeded',
        severity: 'error',
        step: 'publish'
      };

      const classification = errorRecovery.classifyError(error);

      expect(classification.type).toBe('partial');
      expect(classification.recoverable).toBe(true);
      expect(classification.recommendedAction).toBe('resume');
    });

    it('should classify validation errors as permanent', () => {
      const error: ReleaseError = {
        code: 'VALIDATION_FAILED',
        message: 'Invalid version format',
        severity: 'error',
        step: 'validation'
      };

      const classification = errorRecovery.classifyError(error);

      expect(classification.type).toBe('permanent');
      expect(classification.recoverable).toBe(false);
      expect(classification.recommendedAction).toBe('manual');
    });

    it('should classify authentication errors as permanent', () => {
      const error: ReleaseError = {
        code: 'AUTH_FAILED',
        message: 'Invalid credentials',
        severity: 'error',
        step: 'publish'
      };

      const classification = errorRecovery.classifyError(error);

      expect(classification.type).toBe('permanent');
      expect(classification.recoverable).toBe(false);
    });
  });

  describe('Retry Logic with Exponential Backoff', () => {
    it('should succeed on first attempt', async () => {
      let attempts = 0;
      const operation = jest.fn(async () => {
        attempts++;
        return 'success';
      });

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TEST_ERROR' }
      );

      expect(result.success).toBe(true);
      expect(result.result).toBe('success');
      expect(result.attempts).toHaveLength(1);
      expect(result.attempts[0].success).toBe(true);
      expect(result.metadata.retriesUsed).toBe(0);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry transient errors with exponential backoff', async () => {
      let attempts = 0;
      const operation = jest.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Network timeout');
        }
        return 'success';
      });

      // Use custom strategy with very short delays for testing
      const customStrategy: RecoveryStrategy = {
        maxRetries: 3,
        initialDelay: 10, // Very short delay
        maxDelay: 100,
        backoffMultiplier: 2,
        exponentialBackoff: true
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TIMEOUT' },
        customStrategy
      );

      expect(result.success).toBe(true);
      expect(result.result).toBe('success');
      expect(result.attempts).toHaveLength(3);
      expect(result.metadata.retriesUsed).toBe(2);
      expect(operation).toHaveBeenCalledTimes(3);

      // Verify exponential backoff delays
      expect(result.attempts[0].delay).toBe(0); // First attempt
      expect(result.attempts[1].delay).toBeGreaterThan(0); // First retry
      expect(result.attempts[2].delay).toBeGreaterThan(result.attempts[1].delay); // Second retry
    });

    it('should respect max retries limit', async () => {
      const operation = jest.fn(async () => {
        throw new Error('Network timeout');
      });

      // Use custom strategy with very short delays for testing
      const customStrategy: RecoveryStrategy = {
        maxRetries: 2, // Fewer retries
        initialDelay: 10, // Very short delay
        maxDelay: 50,
        backoffMultiplier: 2,
        exponentialBackoff: true
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TIMEOUT' },
        customStrategy
      );

      expect(result.success).toBe(false);
      expect(result.finalError).toBeDefined();
      expect(result.attempts.length).toBeLessThanOrEqual(3); // 1 initial + 2 retries
      expect(result.metadata.retriesUsed).toBeLessThanOrEqual(2);
    });

    it('should not retry permanent errors', async () => {
      const operation = jest.fn(async () => {
        throw new Error('Invalid credentials');
      });

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'AUTH_FAILED' }
      );

      expect(result.success).toBe(false);
      expect(result.attempts).toHaveLength(1); // Only initial attempt
      expect(result.metadata.retriesUsed).toBe(0);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should use custom retry strategy', async () => {
      let attempts = 0;
      const operation = jest.fn(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Network timeout');
        }
        return 'success';
      });

      const customStrategy: RecoveryStrategy = {
        maxRetries: 5,
        initialDelay: 100,
        maxDelay: 1000,
        backoffMultiplier: 3,
        exponentialBackoff: true
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TIMEOUT' },
        customStrategy
      );

      expect(result.success).toBe(true);
      expect(result.metadata.maxRetriesAllowed).toBe(5);
    });

    it('should stop retrying if error becomes permanent', async () => {
      let attempts = 0;
      const operation = jest.fn(async () => {
        attempts++;
        if (attempts === 1) {
          const error: any = new Error('Network timeout');
          error.code = 'TIMEOUT';
          throw error;
        }
        // Second attempt throws permanent error with different code
        const error: any = new Error('Invalid credentials');
        error.code = 'AUTH_FAILED';
        throw error;
      });

      // Use custom strategy with very short delays for testing
      const customStrategy: RecoveryStrategy = {
        maxRetries: 3,
        initialDelay: 10, // Very short delay
        maxDelay: 50,
        backoffMultiplier: 2,
        exponentialBackoff: true
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TIMEOUT' },
        customStrategy
      );

      expect(result.success).toBe(false);
      expect(result.attempts).toHaveLength(2); // Initial + 1 retry
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe('Checkpoint Management', () => {
    it('should create checkpoint with stage data', () => {
      const checkpoint = errorRecovery.createCheckpoint('package-update', {
        packagesUpdated: ['pkg1', 'pkg2'],
        version: '1.0.0'
      });

      expect(checkpoint.id).toContain('checkpoint-package-update');
      expect(checkpoint.stage).toBe('package-update');
      expect(checkpoint.data.packagesUpdated).toEqual(['pkg1', 'pkg2']);
      expect(checkpoint.timestamp).toBeInstanceOf(Date);
    });

    it('should retrieve most recent checkpoint for stage', () => {
      // Create multiple checkpoints
      errorRecovery.createCheckpoint('package-update', { version: '1.0.0' });
      
      // Wait a bit to ensure different timestamps
      const secondCheckpoint = errorRecovery.createCheckpoint('package-update', { version: '1.1.0' });

      const retrieved = errorRecovery.getCheckpoint('package-update');

      expect(retrieved).toBeDefined();
      expect(retrieved!.data.version).toBe('1.1.0');
      expect(retrieved!.id).toBe(secondCheckpoint.id);
    });

    it('should return undefined for non-existent checkpoint', () => {
      const checkpoint = errorRecovery.getCheckpoint('non-existent-stage');

      expect(checkpoint).toBeUndefined();
    });

    it('should clear all checkpoints', () => {
      errorRecovery.createCheckpoint('stage1', { data: 'test1' });
      errorRecovery.createCheckpoint('stage2', { data: 'test2' });

      errorRecovery.clearCheckpoints();

      expect(errorRecovery.getCheckpoint('stage1')).toBeUndefined();
      expect(errorRecovery.getCheckpoint('stage2')).toBeUndefined();
    });
  });

  describe('Recovery Action Determination', () => {
    it('should recommend manual intervention for permanent errors', () => {
      const error: ReleaseError = {
        code: 'VALIDATION_FAILED',
        message: 'Invalid version',
        severity: 'error',
        step: 'validation'
      };

      const action = errorRecovery.determineRecoveryAction(error, {
        stage: 'validation',
        attemptNumber: 1,
        hasCheckpoint: false,
        criticalOperation: true
      });

      expect(action).toBe('manual');
    });

    it('should recommend resume for partial errors with checkpoint', () => {
      const error: ReleaseError = {
        code: 'PARTIAL_SUCCESS',
        message: 'Some operations failed',
        severity: 'error',
        step: 'publish'
      };

      const action = errorRecovery.determineRecoveryAction(error, {
        stage: 'publish',
        attemptNumber: 1,
        hasCheckpoint: true,
        criticalOperation: false
      });

      expect(action).toBe('resume');
    });

    it('should recommend retry for transient errors within retry limit', () => {
      const error: ReleaseError = {
        code: 'NETWORK_ERROR',
        message: 'Connection failed',
        severity: 'error',
        step: 'publish'
      };

      const action = errorRecovery.determineRecoveryAction(error, {
        stage: 'publish',
        attemptNumber: 1,
        hasCheckpoint: false,
        criticalOperation: false
      });

      expect(action).toBe('retry');
    });

    it('should recommend rollback for critical operations after max retries', () => {
      const error: ReleaseError = {
        code: 'NETWORK_ERROR',
        message: 'Connection failed',
        severity: 'error',
        step: 'publish'
      };

      const action = errorRecovery.determineRecoveryAction(error, {
        stage: 'publish',
        attemptNumber: 5, // Exceeds max retries
        hasCheckpoint: false,
        criticalOperation: true
      });

      expect(action).toBe('rollback');
    });

    it('should recommend skip for non-critical operations after max retries', () => {
      const error: ReleaseError = {
        code: 'NETWORK_ERROR',
        message: 'Connection failed',
        severity: 'error',
        step: 'artifact-upload'
      };

      const action = errorRecovery.determineRecoveryAction(error, {
        stage: 'artifact-upload',
        attemptNumber: 5, // Exceeds max retries
        hasCheckpoint: false,
        criticalOperation: false
      });

      expect(action).toBe('skip');
    });
  });

  describe('Strategy Management', () => {
    it('should get default strategy for error type', () => {
      const strategy = errorRecovery.getStrategy('transient');

      expect(strategy.maxRetries).toBeGreaterThan(0);
      expect(strategy.exponentialBackoff).toBe(true);
      expect(strategy.initialDelay).toBeGreaterThan(0);
    });

    it('should update strategy for error type', () => {
      const newStrategy: RecoveryStrategy = {
        maxRetries: 10,
        initialDelay: 500,
        maxDelay: 20000,
        backoffMultiplier: 3,
        exponentialBackoff: true
      };

      errorRecovery.updateStrategy('transient', newStrategy);

      const retrieved = errorRecovery.getStrategy('transient');
      expect(retrieved.maxRetries).toBe(10);
      expect(retrieved.initialDelay).toBe(500);
    });

    it('should accept custom strategies in constructor', () => {
      const customStrategies = {
        transient: {
          maxRetries: 5,
          initialDelay: 2000,
          maxDelay: 15000,
          backoffMultiplier: 2.5,
          exponentialBackoff: true
        }
      };

      const customRecovery = new ErrorRecovery(customStrategies);
      const strategy = customRecovery.getStrategy('transient');

      expect(strategy.maxRetries).toBe(5);
      expect(strategy.initialDelay).toBe(2000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle operation that throws non-Error objects', async () => {
      const operation = jest.fn(async () => {
        throw 'string error';
      });

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TEST_ERROR' }
      );

      expect(result.success).toBe(false);
      expect(result.finalError).toBeDefined();
      expect(result.finalError!.message).toBe('string error');
    });

    it('should handle operation timeout', async () => {
      const operation = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return 'success';
      });

      const customStrategy: RecoveryStrategy = {
        maxRetries: 1,
        initialDelay: 100,
        maxDelay: 1000,
        backoffMultiplier: 2,
        exponentialBackoff: true,
        retryTimeout: 100 // Very short timeout
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TEST_ERROR' },
        customStrategy
      );

      expect(result.success).toBe(false);
      expect(result.finalError?.message).toContain('timed out');
    });

    it('should handle zero max retries', async () => {
      const operation = jest.fn(async () => {
        throw new Error('Test error');
      });

      const customStrategy: RecoveryStrategy = {
        maxRetries: 0,
        initialDelay: 0,
        maxDelay: 0,
        backoffMultiplier: 1,
        exponentialBackoff: false
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TEST_ERROR' },
        customStrategy
      );

      expect(result.success).toBe(false);
      expect(result.attempts).toHaveLength(1);
      expect(result.metadata.retriesUsed).toBe(0);
    });

    it('should cap delay at maxDelay', async () => {
      let attempts = 0;
      const operation = jest.fn(async () => {
        attempts++;
        if (attempts < 4) {
          throw new Error('Network timeout');
        }
        return 'success';
      });

      const customStrategy: RecoveryStrategy = {
        maxRetries: 10,
        initialDelay: 10, // Very short initial delay
        maxDelay: 50, // Cap at 50ms
        backoffMultiplier: 10, // Very aggressive multiplier
        exponentialBackoff: true
      };

      const result = await errorRecovery.executeWithRetry(
        operation,
        { step: 'test', code: 'TIMEOUT' },
        customStrategy
      );

      expect(result.success).toBe(true);
      
      // Verify delays are capped
      const delays = result.attempts.slice(1).map(a => a.delay);
      delays.forEach(delay => {
        expect(delay).toBeLessThanOrEqual(50);
      });
    });
  });
});
