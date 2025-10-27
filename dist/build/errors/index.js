"use strict";
/**
 * Build Errors Module
 *
 * Exports all error handling functionality including:
 * - Error types and interfaces
 * - Error handler with recovery strategies
 * - Error documentation and suggestions
 * - Error formatting and reporting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorReporter = exports.generateErrorReport = exports.formatErrorMessage = exports.addErrorLocation = exports.enhanceErrorWithDocumentation = exports.getErrorDocumentation = exports.ERROR_DOCUMENTATION = exports.AbortStrategy = exports.FallbackStrategy = exports.SkipStrategy = exports.RetryStrategy = exports.RecoveryStrategyCoordinator = exports.ErrorHandler = exports.isBuildError = exports.createBuildError = exports.ErrorCodes = void 0;
// Core error types
var BuildError_1 = require("./BuildError");
Object.defineProperty(exports, "ErrorCodes", { enumerable: true, get: function () { return BuildError_1.ErrorCodes; } });
Object.defineProperty(exports, "createBuildError", { enumerable: true, get: function () { return BuildError_1.createBuildError; } });
Object.defineProperty(exports, "isBuildError", { enumerable: true, get: function () { return BuildError_1.isBuildError; } });
// Error handler
var ErrorHandler_1 = require("./ErrorHandler");
Object.defineProperty(exports, "ErrorHandler", { enumerable: true, get: function () { return ErrorHandler_1.ErrorHandler; } });
// Recovery strategies
var RecoveryStrategy_1 = require("./RecoveryStrategy");
Object.defineProperty(exports, "RecoveryStrategyCoordinator", { enumerable: true, get: function () { return RecoveryStrategy_1.RecoveryStrategyCoordinator; } });
Object.defineProperty(exports, "RetryStrategy", { enumerable: true, get: function () { return RecoveryStrategy_1.RetryStrategy; } });
Object.defineProperty(exports, "SkipStrategy", { enumerable: true, get: function () { return RecoveryStrategy_1.SkipStrategy; } });
Object.defineProperty(exports, "FallbackStrategy", { enumerable: true, get: function () { return RecoveryStrategy_1.FallbackStrategy; } });
Object.defineProperty(exports, "AbortStrategy", { enumerable: true, get: function () { return RecoveryStrategy_1.AbortStrategy; } });
// Error documentation
var ErrorDocumentation_1 = require("./ErrorDocumentation");
Object.defineProperty(exports, "ERROR_DOCUMENTATION", { enumerable: true, get: function () { return ErrorDocumentation_1.ERROR_DOCUMENTATION; } });
Object.defineProperty(exports, "getErrorDocumentation", { enumerable: true, get: function () { return ErrorDocumentation_1.getErrorDocumentation; } });
Object.defineProperty(exports, "enhanceErrorWithDocumentation", { enumerable: true, get: function () { return ErrorDocumentation_1.enhanceErrorWithDocumentation; } });
Object.defineProperty(exports, "addErrorLocation", { enumerable: true, get: function () { return ErrorDocumentation_1.addErrorLocation; } });
Object.defineProperty(exports, "formatErrorMessage", { enumerable: true, get: function () { return ErrorDocumentation_1.formatErrorMessage; } });
Object.defineProperty(exports, "generateErrorReport", { enumerable: true, get: function () { return ErrorDocumentation_1.generateErrorReport; } });
// Error reporting
var ErrorReporter_1 = require("./ErrorReporter");
Object.defineProperty(exports, "ErrorReporter", { enumerable: true, get: function () { return ErrorReporter_1.ErrorReporter; } });
//# sourceMappingURL=index.js.map