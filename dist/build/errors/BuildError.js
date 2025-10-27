"use strict";
/**
 * Build Error Interface and Types
 *
 * Defines error structures for the Cross-Platform Build System.
 * Provides categorization, severity levels, and contextual information
 * for comprehensive error handling and reporting.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
exports.createBuildError = createBuildError;
exports.isBuildError = isBuildError;
/**
 * Factory function to create BuildError instances
 */
function createBuildError(params) {
    return {
        code: params.code,
        message: params.message,
        severity: params.severity,
        category: params.category,
        platform: params.platform,
        component: params.component,
        context: params.context || {},
        suggestions: params.suggestions || [],
        documentation: params.documentation || [],
        originalError: params.originalError,
        timestamp: new Date(),
    };
}
/**
 * Common error codes for the build system
 */
exports.ErrorCodes = {
    // Configuration errors (CONFIG_*)
    CONFIG_INVALID_PLATFORM: 'CONFIG_INVALID_PLATFORM',
    CONFIG_MISSING_REQUIRED: 'CONFIG_MISSING_REQUIRED',
    CONFIG_CONFLICTING_OPTIONS: 'CONFIG_CONFLICTING_OPTIONS',
    CONFIG_INVALID_OUTPUT_DIR: 'CONFIG_INVALID_OUTPUT_DIR',
    // Build errors (BUILD_*)
    BUILD_COMPILATION_FAILED: 'BUILD_COMPILATION_FAILED',
    BUILD_MISSING_DEPENDENCY: 'BUILD_MISSING_DEPENDENCY',
    BUILD_INVALID_SOURCE: 'BUILD_INVALID_SOURCE',
    BUILD_PACKAGE_GENERATION_FAILED: 'BUILD_PACKAGE_GENERATION_FAILED',
    // Token errors (TOKEN_*)
    TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
    TOKEN_INVALID_SELECTION: 'TOKEN_INVALID_SELECTION',
    TOKEN_MATHEMATICAL_INCONSISTENCY: 'TOKEN_MATHEMATICAL_INCONSISTENCY',
    TOKEN_CONVERSION_FAILED: 'TOKEN_CONVERSION_FAILED',
    // Interface errors (INTERFACE_*)
    INTERFACE_METHOD_MISMATCH: 'INTERFACE_METHOD_MISMATCH',
    INTERFACE_PROPERTY_MISMATCH: 'INTERFACE_PROPERTY_MISMATCH',
    INTERFACE_MISSING_IMPLEMENTATION: 'INTERFACE_MISSING_IMPLEMENTATION',
    INTERFACE_BEHAVIORAL_INCONSISTENCY: 'INTERFACE_BEHAVIORAL_INCONSISTENCY',
};
/**
 * Type guard to check if an error is a BuildError
 */
function isBuildError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error &&
        'severity' in error &&
        'category' in error);
}
//# sourceMappingURL=BuildError.js.map