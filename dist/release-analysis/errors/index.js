"use strict";
/**
 * Release Analysis Error Handling Module
 *
 * Exports comprehensive error handling utilities for the release analysis system.
 * Provides centralized error management, recovery strategies, and user guidance.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultipleErrors = exports.formatErrorForCLI = exports.createErrorContext = exports.createRecoveryUtilities = exports.ConfigurationErrorRecovery = exports.DocumentErrorRecovery = exports.GitErrorRecovery = exports.withErrorHandling = exports.releaseAnalysisErrorHandler = exports.ReleaseAnalysisErrorHandler = void 0;
const ErrorHandler_1 = require("./ErrorHandler");
var ErrorHandler_2 = require("./ErrorHandler");
Object.defineProperty(exports, "ReleaseAnalysisErrorHandler", { enumerable: true, get: function () { return ErrorHandler_2.ReleaseAnalysisErrorHandler; } });
Object.defineProperty(exports, "releaseAnalysisErrorHandler", { enumerable: true, get: function () { return ErrorHandler_2.releaseAnalysisErrorHandler; } });
Object.defineProperty(exports, "withErrorHandling", { enumerable: true, get: function () { return ErrorHandler_2.withErrorHandling; } });
var ErrorRecovery_1 = require("./ErrorRecovery");
Object.defineProperty(exports, "GitErrorRecovery", { enumerable: true, get: function () { return ErrorRecovery_1.GitErrorRecovery; } });
Object.defineProperty(exports, "DocumentErrorRecovery", { enumerable: true, get: function () { return ErrorRecovery_1.DocumentErrorRecovery; } });
Object.defineProperty(exports, "ConfigurationErrorRecovery", { enumerable: true, get: function () { return ErrorRecovery_1.ConfigurationErrorRecovery; } });
Object.defineProperty(exports, "createRecoveryUtilities", { enumerable: true, get: function () { return ErrorRecovery_1.createRecoveryUtilities; } });
// Re-export commonly used error handling patterns
const createErrorContext = (operation, component, additionalContext) => ({
    operation,
    component,
    timestamp: new Date(),
    ...additionalContext
});
exports.createErrorContext = createErrorContext;
// Utility function for CLI error display
const formatErrorForCLI = (error) => {
    const severityIcon = {
        low: '💡',
        medium: '⚠️',
        high: '❌',
        critical: '🚨'
    }[error.severity];
    let output = `${severityIcon} ${error.message}\n`;
    if (error.userGuidance) {
        output += `   💡 ${error.userGuidance}\n`;
    }
    if (error.recoveryStrategies.length > 0) {
        output += `   🔧 Recovery: ${error.recoveryStrategies[0].description}\n`;
    }
    return output;
};
exports.formatErrorForCLI = formatErrorForCLI;
// Utility function for batch error handling
const handleMultipleErrors = async (operations, context, continueOnError = true) => {
    const results = [];
    const errors = [];
    for (let i = 0; i < operations.length; i++) {
        const operationContext = {
            ...context,
            operation: `batch-operation-${i}`,
            timestamp: new Date()
        };
        const result = await (0, ErrorHandler_1.withErrorHandling)(operations[i], operationContext);
        if (result.success && result.data !== undefined) {
            results.push(result.data);
        }
        else if (result.error) {
            errors.push(result.error);
            if (!continueOnError) {
                break;
            }
        }
    }
    return {
        results,
        errors,
        successCount: results.length
    };
};
exports.handleMultipleErrors = handleMultipleErrors;
//# sourceMappingURL=index.js.map