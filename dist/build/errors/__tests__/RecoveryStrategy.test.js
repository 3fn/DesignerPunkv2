"use strict";
/**
 * Tests for Recovery Strategy implementations
 */
Object.defineProperty(exports, "__esModule", { value: true });
const RecoveryStrategy_1 = require("../RecoveryStrategy");
const BuildError_1 = require("../BuildError");
describe('RetryStrategy', () => {
    let retryStrategy;
    beforeEach(() => {
        retryStrategy = new RecoveryStrategy_1.RetryStrategy();
    });
    describe('execute', () => {
        it('should execute retry with backoff delay', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'Network timeout',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                retryAttempt: 0,
                maxRetries: 3,
            };
            const result = await retryStrategy.execute(context);
            expect(result.success).toBe(true);
            expect(result.strategy).toBe('retry');
            expect(result.shouldContinue).toBe(true);
            expect(result.message).toContain('Retrying operation');
            expect(result.updatedContext?.retryAttempt).toBe(1);
        });
        it('should fail when max retries exceeded', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'Network timeout',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                retryAttempt: 3,
                maxRetries: 3,
            };
            const result = await retryStrategy.execute(context);
            expect(result.success).toBe(false);
            expect(result.strategy).toBe('retry');
            expect(result.shouldContinue).toBe(false);
            expect(result.message).toContain('Maximum retry attempts');
            expect(result.errors).toContain(error);
        });
        it('should increment retry attempt', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'Temporary failure',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                retryAttempt: 1,
                maxRetries: 3,
            };
            const result = await retryStrategy.execute(context);
            expect(result.updatedContext?.retryAttempt).toBe(2);
            expect(result.message).toContain('attempt 2/3');
        });
    });
    describe('canRetry', () => {
        it('should identify network errors as retryable', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'NETWORK_ERROR',
                message: 'Network connection failed',
                severity: 'error',
                category: 'build',
            });
            expect(retryStrategy.canRetry(error)).toBe(true);
        });
        it('should identify timeout errors as retryable', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'TIMEOUT',
                message: 'Operation timed out',
                severity: 'error',
                category: 'build',
            });
            expect(retryStrategy.canRetry(error)).toBe(true);
        });
        it('should identify file lock errors as retryable', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'FILE_LOCK',
                message: 'File is locked by another process',
                severity: 'error',
                category: 'build',
            });
            expect(retryStrategy.canRetry(error)).toBe(true);
        });
        it('should not identify configuration errors as retryable', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
                message: 'Invalid platform',
                severity: 'error',
                category: 'config',
            });
            expect(retryStrategy.canRetry(error)).toBe(false);
        });
    });
});
describe('SkipStrategy', () => {
    let skipStrategy;
    beforeEach(() => {
        skipStrategy = new RecoveryStrategy_1.SkipStrategy();
    });
    describe('execute', () => {
        it('should skip platform and continue with remaining platforms', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'iOS build failed',
                severity: 'error',
                category: 'build',
                platform: 'ios',
            });
            const context = {
                error,
                platform: 'ios',
                remainingPlatforms: ['android', 'web'],
            };
            const result = skipStrategy.execute(context);
            expect(result.success).toBe(true);
            expect(result.strategy).toBe('skip');
            expect(result.shouldContinue).toBe(true);
            expect(result.message).toContain('Skipping ios platform');
            expect(result.message).toContain('android, web');
            expect(result.updatedContext?.remainingPlatforms).toEqual(['android', 'web']);
        });
        it('should fail when no platform specified', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'Build failed',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                remainingPlatforms: ['android', 'web'],
            };
            const result = skipStrategy.execute(context);
            expect(result.success).toBe(false);
            expect(result.shouldContinue).toBe(false);
            expect(result.message).toContain('no platform specified');
        });
        it('should fail when no remaining platforms', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'iOS build failed',
                severity: 'error',
                category: 'build',
                platform: 'ios',
            });
            const context = {
                error,
                platform: 'ios',
                remainingPlatforms: [],
            };
            const result = skipStrategy.execute(context);
            expect(result.success).toBe(false);
            expect(result.shouldContinue).toBe(false);
            expect(result.message).toContain('no remaining platforms');
        });
    });
    describe('canSkip', () => {
        it('should allow skip for platform-specific errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'iOS build failed',
                severity: 'error',
                category: 'build',
                platform: 'ios',
            });
            expect(skipStrategy.canSkip(error)).toBe(true);
        });
        it('should not allow skip for non-platform-specific errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'Build failed',
                severity: 'error',
                category: 'build',
            });
            expect(skipStrategy.canSkip(error)).toBe(false);
        });
    });
});
describe('FallbackStrategy', () => {
    let fallbackStrategy;
    beforeEach(() => {
        fallbackStrategy = new RecoveryStrategy_1.FallbackStrategy();
    });
    describe('execute', () => {
        it('should use cached artifacts when available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
                cachedArtifacts: {
                    'ios-build': { path: '/cache/ios' },
                    'android-build': { path: '/cache/android' },
                },
            };
            const result = fallbackStrategy.execute(context);
            expect(result.success).toBe(true);
            expect(result.strategy).toBe('fallback');
            expect(result.shouldContinue).toBe(true);
            expect(result.message).toContain('Using cached build artifacts');
            expect(result.updatedContext?.metadata?.usedCache).toBe(true);
        });
        it('should use default configuration when no cache available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
                defaultConfig: {
                    spacing: 8,
                    colors: { primary: '#000000' },
                },
            };
            const result = fallbackStrategy.execute(context);
            expect(result.success).toBe(true);
            expect(result.strategy).toBe('fallback');
            expect(result.shouldContinue).toBe(true);
            expect(result.message).toContain('Using default configuration');
            expect(result.updatedContext?.metadata?.usedDefaultConfig).toBe(true);
        });
        it('should fail when no fallback available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
            };
            const result = fallbackStrategy.execute(context);
            expect(result.success).toBe(false);
            expect(result.shouldContinue).toBe(false);
            expect(result.message).toContain('No fallback available');
            expect(result.errors).toContain(error);
        });
    });
    describe('canFallback', () => {
        it('should allow fallback when cached artifacts available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
                cachedArtifacts: { 'build': {} },
            };
            expect(fallbackStrategy.canFallback(error, context)).toBe(true);
        });
        it('should allow fallback when default config available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
                defaultConfig: { spacing: 8 },
            };
            expect(fallbackStrategy.canFallback(error, context)).toBe(true);
        });
        it('should not allow fallback when nothing available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
            };
            expect(fallbackStrategy.canFallback(error, context)).toBe(false);
        });
    });
});
describe('AbortStrategy', () => {
    let abortStrategy;
    beforeEach(() => {
        abortStrategy = new RecoveryStrategy_1.AbortStrategy();
    });
    describe('execute', () => {
        it('should abort build with error message', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
                message: 'Invalid platform',
                severity: 'error',
                category: 'config',
            });
            const context = {
                error,
            };
            const result = abortStrategy.execute(context);
            expect(result.success).toBe(false);
            expect(result.strategy).toBe('abort');
            expect(result.shouldContinue).toBe(false);
            expect(result.message).toContain('Build aborted');
            expect(result.message).toContain('Invalid platform');
            expect(result.errors).toContain(error);
        });
    });
    describe('shouldAbort', () => {
        it('should abort for critical configuration errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
                message: 'Invalid platform',
                severity: 'error',
                category: 'config',
            });
            expect(abortStrategy.shouldAbort(error)).toBe(true);
        });
        it('should abort for explicitly non-recoverable errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'CRITICAL_ERROR',
                message: 'Critical error',
                severity: 'error',
                category: 'build',
                context: { recoverable: false },
            });
            expect(abortStrategy.shouldAbort(error)).toBe(true);
        });
        it('should not abort for recoverable build errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'Build failed',
                severity: 'error',
                category: 'build',
            });
            expect(abortStrategy.shouldAbort(error)).toBe(false);
        });
    });
});
describe('RecoveryStrategyCoordinator', () => {
    let coordinator;
    beforeEach(() => {
        coordinator = new RecoveryStrategy_1.RecoveryStrategyCoordinator();
    });
    describe('executeRecovery', () => {
        it('should execute retry strategy', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'NETWORK_ERROR',
                message: 'Network timeout',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                retryAttempt: 0,
                maxRetries: 3,
            };
            const result = await coordinator.executeRecovery('retry', context);
            expect(result.strategy).toBe('retry');
            expect(result.success).toBe(true);
        });
        it('should execute skip strategy', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'iOS build failed',
                severity: 'error',
                category: 'build',
                platform: 'ios',
            });
            const context = {
                error,
                platform: 'ios',
                remainingPlatforms: ['android', 'web'],
            };
            const result = await coordinator.executeRecovery('skip', context);
            expect(result.strategy).toBe('skip');
            expect(result.success).toBe(true);
        });
        it('should execute fallback strategy', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
                cachedArtifacts: { 'build': {} },
            };
            const result = await coordinator.executeRecovery('fallback', context);
            expect(result.strategy).toBe('fallback');
            expect(result.success).toBe(true);
        });
        it('should execute abort strategy', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
                message: 'Invalid platform',
                severity: 'error',
                category: 'config',
            });
            const context = {
                error,
            };
            const result = await coordinator.executeRecovery('abort', context);
            expect(result.strategy).toBe('abort');
            expect(result.success).toBe(false);
        });
        it('should handle unknown strategy', async () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'TEST_ERROR',
                message: 'Test error',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
            };
            const result = await coordinator.executeRecovery('unknown', context);
            expect(result.success).toBe(false);
            expect(result.message).toContain('Unknown recovery strategy');
        });
    });
    describe('determineStrategy', () => {
        it('should determine abort for configuration errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
                message: 'Invalid platform',
                severity: 'error',
                category: 'config',
            });
            const context = {
                error,
            };
            const strategy = coordinator.determineStrategy(error, context);
            expect(strategy).toBe('abort');
        });
        it('should determine retry for transient errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'NETWORK_ERROR',
                message: 'Network timeout',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                retryAttempt: 0,
                maxRetries: 3,
            };
            const strategy = coordinator.determineStrategy(error, context);
            expect(strategy).toBe('retry');
        });
        it('should determine skip for platform-specific errors', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED,
                message: 'iOS build failed',
                severity: 'error',
                category: 'build',
                platform: 'ios',
            });
            const context = {
                error,
                platform: 'ios',
                remainingPlatforms: ['android', 'web'],
                retryAttempt: 3,
                maxRetries: 3,
            };
            const strategy = coordinator.determineStrategy(error, context);
            expect(strategy).toBe('skip');
        });
        it('should determine fallback when cache available', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: BuildError_1.ErrorCodes.TOKEN_NOT_FOUND,
                message: 'Token not found',
                severity: 'error',
                category: 'token',
            });
            const context = {
                error,
                cachedArtifacts: { 'build': {} },
                retryAttempt: 3,
                maxRetries: 3,
            };
            const strategy = coordinator.determineStrategy(error, context);
            expect(strategy).toBe('fallback');
        });
        it('should default to abort when no strategy appropriate', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'UNKNOWN_ERROR',
                message: 'Unknown error',
                severity: 'error',
                category: 'build',
            });
            const context = {
                error,
                retryAttempt: 3,
                maxRetries: 3,
            };
            const strategy = coordinator.determineStrategy(error, context);
            expect(strategy).toBe('abort');
        });
    });
});
//# sourceMappingURL=RecoveryStrategy.test.js.map