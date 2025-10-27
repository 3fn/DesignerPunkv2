"use strict";
/**
 * Tests for BuildError interface and utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BuildError_1 = require("../BuildError");
describe('BuildError', () => {
    describe('createBuildError', () => {
        it('should create a BuildError with required fields', () => {
            const error = (0, BuildError_1.createBuildError)({
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
            const error = (0, BuildError_1.createBuildError)({
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
            const severities = ['error', 'warning', 'info'];
            severities.forEach(severity => {
                const error = (0, BuildError_1.createBuildError)({
                    code: 'TEST_ERROR',
                    message: 'Test message',
                    severity,
                    category: 'build',
                });
                expect(error.severity).toBe(severity);
            });
        });
        it('should create errors with different categories', () => {
            const categories = ['config', 'build', 'token', 'interface'];
            categories.forEach(category => {
                const error = (0, BuildError_1.createBuildError)({
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
            expect(BuildError_1.ErrorCodes.CONFIG_INVALID_PLATFORM).toBe('CONFIG_INVALID_PLATFORM');
            expect(BuildError_1.ErrorCodes.CONFIG_MISSING_REQUIRED).toBe('CONFIG_MISSING_REQUIRED');
            expect(BuildError_1.ErrorCodes.CONFIG_CONFLICTING_OPTIONS).toBe('CONFIG_CONFLICTING_OPTIONS');
            expect(BuildError_1.ErrorCodes.CONFIG_INVALID_OUTPUT_DIR).toBe('CONFIG_INVALID_OUTPUT_DIR');
        });
        it('should define build error codes', () => {
            expect(BuildError_1.ErrorCodes.BUILD_COMPILATION_FAILED).toBe('BUILD_COMPILATION_FAILED');
            expect(BuildError_1.ErrorCodes.BUILD_MISSING_DEPENDENCY).toBe('BUILD_MISSING_DEPENDENCY');
            expect(BuildError_1.ErrorCodes.BUILD_INVALID_SOURCE).toBe('BUILD_INVALID_SOURCE');
            expect(BuildError_1.ErrorCodes.BUILD_PACKAGE_GENERATION_FAILED).toBe('BUILD_PACKAGE_GENERATION_FAILED');
        });
        it('should define token error codes', () => {
            expect(BuildError_1.ErrorCodes.TOKEN_NOT_FOUND).toBe('TOKEN_NOT_FOUND');
            expect(BuildError_1.ErrorCodes.TOKEN_INVALID_SELECTION).toBe('TOKEN_INVALID_SELECTION');
            expect(BuildError_1.ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY).toBe('TOKEN_MATHEMATICAL_INCONSISTENCY');
            expect(BuildError_1.ErrorCodes.TOKEN_CONVERSION_FAILED).toBe('TOKEN_CONVERSION_FAILED');
        });
        it('should define interface error codes', () => {
            expect(BuildError_1.ErrorCodes.INTERFACE_METHOD_MISMATCH).toBe('INTERFACE_METHOD_MISMATCH');
            expect(BuildError_1.ErrorCodes.INTERFACE_PROPERTY_MISMATCH).toBe('INTERFACE_PROPERTY_MISMATCH');
            expect(BuildError_1.ErrorCodes.INTERFACE_MISSING_IMPLEMENTATION).toBe('INTERFACE_MISSING_IMPLEMENTATION');
            expect(BuildError_1.ErrorCodes.INTERFACE_BEHAVIORAL_INCONSISTENCY).toBe('INTERFACE_BEHAVIORAL_INCONSISTENCY');
        });
    });
    describe('isBuildError', () => {
        it('should return true for valid BuildError objects', () => {
            const error = (0, BuildError_1.createBuildError)({
                code: 'TEST_ERROR',
                message: 'Test message',
                severity: 'error',
                category: 'build',
            });
            expect((0, BuildError_1.isBuildError)(error)).toBe(true);
        });
        it('should return false for non-BuildError objects', () => {
            expect((0, BuildError_1.isBuildError)(null)).toBe(false);
            expect((0, BuildError_1.isBuildError)(undefined)).toBe(false);
            expect((0, BuildError_1.isBuildError)({})).toBe(false);
            expect((0, BuildError_1.isBuildError)(new Error('test'))).toBe(false);
            expect((0, BuildError_1.isBuildError)('string')).toBe(false);
            expect((0, BuildError_1.isBuildError)(123)).toBe(false);
        });
        it('should return false for objects missing required fields', () => {
            expect((0, BuildError_1.isBuildError)({ code: 'TEST' })).toBe(false);
            expect((0, BuildError_1.isBuildError)({ message: 'Test' })).toBe(false);
            expect((0, BuildError_1.isBuildError)({ code: 'TEST', message: 'Test' })).toBe(false);
            expect((0, BuildError_1.isBuildError)({ code: 'TEST', message: 'Test', severity: 'error' })).toBe(false);
        });
    });
    describe('BuildError structure', () => {
        it('should include timestamp', () => {
            const before = new Date();
            const error = (0, BuildError_1.createBuildError)({
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
            const error = (0, BuildError_1.createBuildError)({
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
            const error = (0, BuildError_1.createBuildError)({
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
//# sourceMappingURL=BuildError.test.js.map