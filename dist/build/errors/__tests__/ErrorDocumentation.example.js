"use strict";
/**
 * Error Documentation Examples
 *
 * Demonstrates how to use the error documentation system in practice.
 * This file shows real-world usage patterns for error handling with
 * comprehensive documentation and suggestions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.example1_BasicError = example1_BasicError;
exports.example2_ErrorWithLocation = example2_ErrorWithLocation;
exports.example3_TokenError = example3_TokenError;
exports.example4_InterfaceError = example4_InterfaceError;
exports.example5_ErrorReport = example5_ErrorReport;
exports.example6_ErrorHandler = example6_ErrorHandler;
exports.example7_CustomSuggestions = example7_CustomSuggestions;
exports.runAllExamples = runAllExamples;
const index_1 = require("../index");
/**
 * Example 1: Basic error with automatic documentation enhancement
 */
function example1_BasicError() {
    console.log('=== Example 1: Basic Error ===\n');
    // Create a simple error
    const error = (0, index_1.createBuildError)({
        code: index_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
        message: 'Invalid platform: "iOS" (should be lowercase)',
        severity: 'error',
        category: 'config',
    });
    // Enhance with documentation
    const enhanced = (0, index_1.enhanceErrorWithDocumentation)(error);
    // Format for display
    console.log((0, index_1.formatErrorMessage)(enhanced));
}
/**
 * Example 2: Error with file location and code snippet
 */
function example2_ErrorWithLocation() {
    console.log('\n=== Example 2: Error with Location ===\n');
    // Create compilation error
    const error = (0, index_1.createBuildError)({
        code: index_1.ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Swift compilation failed: Missing required protocol method',
        severity: 'error',
        category: 'build',
        platform: 'ios',
        component: 'Button',
    });
    // Enhance with documentation
    const enhanced = (0, index_1.enhanceErrorWithDocumentation)(error);
    // Add location information
    const withLocation = (0, index_1.addErrorLocation)(enhanced, {
        filePath: 'src/components/Button.swift',
        lineNumber: 42,
        columnNumber: 15,
        codeSnippet: `  func onClick() {
    // Missing implementation
  }`,
    });
    // Format for display
    console.log((0, index_1.formatErrorMessage)(withLocation));
}
/**
 * Example 3: Token integration error
 */
function example3_TokenError() {
    console.log('\n=== Example 3: Token Error ===\n');
    // Create token error
    const error = (0, index_1.createBuildError)({
        code: index_1.ErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token "space999" not found in F1 token system',
        severity: 'error',
        category: 'token',
        component: 'Card',
        context: {
            requestedToken: 'space999',
            availableTokens: ['space100', 'space150', 'space200'],
        },
    });
    // Enhance with documentation
    const enhanced = (0, index_1.enhanceErrorWithDocumentation)(error);
    // Add location
    const withLocation = (0, index_1.addErrorLocation)(enhanced, {
        filePath: 'src/components/Card.ts',
        lineNumber: 18,
    });
    // Format for display
    console.log((0, index_1.formatErrorMessage)(withLocation));
}
/**
 * Example 4: Interface validation error
 */
function example4_InterfaceError() {
    console.log('\n=== Example 4: Interface Error ===\n');
    // Create interface mismatch error
    const error = (0, index_1.createBuildError)({
        code: index_1.ErrorCodes.INTERFACE_METHOD_MISMATCH,
        message: 'Method signature mismatch: onClick parameter types differ',
        severity: 'error',
        category: 'interface',
        component: 'Button',
        context: {
            ios: 'func onClick(handler: () -> Void)',
            android: 'fun onClick(handler: () -> Unit)',
            web: 'onClick(handler: () => void)',
            mismatch: 'Parameter names differ across platforms',
        },
    });
    // Enhance with documentation
    const enhanced = (0, index_1.enhanceErrorWithDocumentation)(error);
    // Format for display
    console.log((0, index_1.formatErrorMessage)(enhanced));
}
/**
 * Example 5: Multiple errors with report generation
 */
function example5_ErrorReport() {
    console.log('\n=== Example 5: Error Report ===\n');
    // Create multiple errors
    const errors = [
        (0, index_1.createBuildError)({
            code: index_1.ErrorCodes.CONFIG_INVALID_PLATFORM,
            message: 'Invalid platform: "iOS"',
            severity: 'error',
            category: 'config',
        }),
        (0, index_1.createBuildError)({
            code: index_1.ErrorCodes.TOKEN_NOT_FOUND,
            message: 'Token "space999" not found',
            severity: 'error',
            category: 'token',
            component: 'Button',
        }),
        (0, index_1.createBuildError)({
            code: index_1.ErrorCodes.BUILD_COMPILATION_FAILED,
            message: 'Swift compilation failed',
            severity: 'error',
            category: 'build',
            platform: 'ios',
        }),
        (0, index_1.createBuildError)({
            code: index_1.ErrorCodes.INTERFACE_METHOD_MISMATCH,
            message: 'Method signature mismatch',
            severity: 'warning',
            category: 'interface',
            component: 'Card',
        }),
    ];
    // Enhance all errors
    const enhanced = errors.map(index_1.enhanceErrorWithDocumentation);
    // Generate comprehensive report
    console.log((0, index_1.generateErrorReport)(enhanced));
}
/**
 * Example 6: Using ErrorHandler with automatic enhancement
 */
async function example6_ErrorHandler() {
    console.log('\n=== Example 6: ErrorHandler Integration ===\n');
    // Create error handler
    const handler = new index_1.ErrorHandler({
        verbose: true,
        maxRetries: 3,
        continueOnPlatformFailure: true,
    });
    // Create error
    const error = (0, index_1.createBuildError)({
        code: index_1.ErrorCodes.BUILD_COMPILATION_FAILED,
        message: 'Kotlin compilation failed: Type mismatch',
        severity: 'error',
        category: 'build',
        platform: 'android',
        component: 'Button',
    });
    // Handle error (automatically enhances with documentation)
    const recovery = handler.handleError(error);
    console.log('Recovery Strategy:', recovery.strategy);
    console.log('Recoverable:', recovery.recoverable);
    console.log('Actions:');
    recovery.actions.forEach(action => console.log(`  • ${action}`));
    // Attempt recovery
    const result = await handler.recover(error, {
        platform: 'android',
        remainingPlatforms: ['ios', 'web'],
    });
    console.log('\nRecovery Result:');
    console.log('  Success:', result.success);
    console.log('  Strategy:', result.strategy);
    console.log('  Message:', result.message);
}
/**
 * Example 7: Custom error with suggestions
 */
function example7_CustomSuggestions() {
    console.log('\n=== Example 7: Custom Suggestions ===\n');
    // Create error with custom suggestions
    const error = (0, index_1.createBuildError)({
        code: index_1.ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY,
        message: 'Token values are mathematically inconsistent across platforms',
        severity: 'error',
        category: 'token',
        context: {
            token: 'space100',
            ios: '8pt',
            android: '8dp',
            web: '10px', // Inconsistent!
            expectedWeb: '8px',
        },
        suggestions: [
            'Check unit conversion logic for web platform',
            'Verify baseValue is correctly applied',
        ],
    });
    // Enhance with documentation (merges with custom suggestions)
    const enhanced = (0, index_1.enhanceErrorWithDocumentation)(error);
    // Add location
    const withLocation = (0, index_1.addErrorLocation)(enhanced, {
        filePath: 'src/build/tokens/UnitConverter.ts',
        lineNumber: 125,
    });
    // Format for display
    console.log((0, index_1.formatErrorMessage)(withLocation));
}
/**
 * Run all examples
 */
function runAllExamples() {
    example1_BasicError();
    example2_ErrorWithLocation();
    example3_TokenError();
    example4_InterfaceError();
    example5_ErrorReport();
    example6_ErrorHandler();
    example7_CustomSuggestions();
}
// Uncomment to run examples:
// runAllExamples();
//# sourceMappingURL=ErrorDocumentation.example.js.map