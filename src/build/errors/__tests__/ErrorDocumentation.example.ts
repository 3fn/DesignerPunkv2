/**
 * Error Documentation Examples
 * 
 * Demonstrates how to use the error documentation system in practice.
 * This file shows real-world usage patterns for error handling with
 * comprehensive documentation and suggestions.
 */

import {
  createBuildError,
  ErrorCodes,
  ErrorHandler,
  enhanceErrorWithDocumentation,
  addErrorLocation,
  formatErrorMessage,
  generateErrorReport,
} from '../index';

/**
 * Example 1: Basic error with automatic documentation enhancement
 */
export function example1_BasicError() {
  console.log('=== Example 1: Basic Error ===\n');
  
  // Create a simple error
  const error = createBuildError({
    code: ErrorCodes.CONFIG_INVALID_PLATFORM,
    message: 'Invalid platform: "iOS" (should be lowercase)',
    severity: 'error',
    category: 'config',
  });
  
  // Enhance with documentation
  const enhanced = enhanceErrorWithDocumentation(error);
  
  // Format for display
  console.log(formatErrorMessage(enhanced));
}

/**
 * Example 2: Error with file location and code snippet
 */
export function example2_ErrorWithLocation() {
  console.log('\n=== Example 2: Error with Location ===\n');
  
  // Create compilation error
  const error = createBuildError({
    code: ErrorCodes.BUILD_COMPILATION_FAILED,
    message: 'Swift compilation failed: Missing required protocol method',
    severity: 'error',
    category: 'build',
    platform: 'ios',
    component: 'Button',
  });
  
  // Enhance with documentation
  const enhanced = enhanceErrorWithDocumentation(error);
  
  // Add location information
  const withLocation = addErrorLocation(enhanced, {
    filePath: 'src/components/Button.swift',
    lineNumber: 42,
    columnNumber: 15,
    codeSnippet: `  func onClick() {
    // Missing implementation
  }`,
  });
  
  // Format for display
  console.log(formatErrorMessage(withLocation));
}

/**
 * Example 3: Token integration error
 */
export function example3_TokenError() {
  console.log('\n=== Example 3: Token Error ===\n');
  
  // Create token error
  const error = createBuildError({
    code: ErrorCodes.TOKEN_NOT_FOUND,
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
  const enhanced = enhanceErrorWithDocumentation(error);
  
  // Add location
  const withLocation = addErrorLocation(enhanced, {
    filePath: 'src/components/Card.ts',
    lineNumber: 18,
  });
  
  // Format for display
  console.log(formatErrorMessage(withLocation));
}

/**
 * Example 4: Interface validation error
 */
export function example4_InterfaceError() {
  console.log('\n=== Example 4: Interface Error ===\n');
  
  // Create interface mismatch error
  const error = createBuildError({
    code: ErrorCodes.INTERFACE_METHOD_MISMATCH,
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
  const enhanced = enhanceErrorWithDocumentation(error);
  
  // Format for display
  console.log(formatErrorMessage(enhanced));
}

/**
 * Example 5: Multiple errors with report generation
 */
export function example5_ErrorReport() {
  console.log('\n=== Example 5: Error Report ===\n');
  
  // Create multiple errors
  const errors = [
    createBuildError({
      code: ErrorCodes.CONFIG_INVALID_PLATFORM,
      message: 'Invalid platform: "iOS"',
      severity: 'error',
      category: 'config',
    }),
    createBuildError({
      code: ErrorCodes.TOKEN_NOT_FOUND,
      message: 'Token "space999" not found',
      severity: 'error',
      category: 'token',
      component: 'Button',
    }),
    createBuildError({
      code: ErrorCodes.BUILD_COMPILATION_FAILED,
      message: 'Swift compilation failed',
      severity: 'error',
      category: 'build',
      platform: 'ios',
    }),
    createBuildError({
      code: ErrorCodes.INTERFACE_METHOD_MISMATCH,
      message: 'Method signature mismatch',
      severity: 'warning',
      category: 'interface',
      component: 'Card',
    }),
  ];
  
  // Enhance all errors
  const enhanced = errors.map(enhanceErrorWithDocumentation);
  
  // Generate comprehensive report
  console.log(generateErrorReport(enhanced));
}

/**
 * Example 6: Using ErrorHandler with automatic enhancement
 */
export async function example6_ErrorHandler() {
  console.log('\n=== Example 6: ErrorHandler Integration ===\n');
  
  // Create error handler
  const handler = new ErrorHandler({
    verbose: true,
    maxRetries: 3,
    continueOnPlatformFailure: true,
  });
  
  // Create error
  const error = createBuildError({
    code: ErrorCodes.BUILD_COMPILATION_FAILED,
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
export function example7_CustomSuggestions() {
  console.log('\n=== Example 7: Custom Suggestions ===\n');
  
  // Create error with custom suggestions
  const error = createBuildError({
    code: ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY,
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
  const enhanced = enhanceErrorWithDocumentation(error);
  
  // Add location
  const withLocation = addErrorLocation(enhanced, {
    filePath: 'src/build/tokens/UnitConverter.ts',
    lineNumber: 125,
  });
  
  // Format for display
  console.log(formatErrorMessage(withLocation));
}

/**
 * Run all examples
 */
export function runAllExamples() {
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
