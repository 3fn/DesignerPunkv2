/**
 * Error Documentation and Suggestions
 * 
 * Provides comprehensive documentation, actionable suggestions, and
 * contextual information for all build system error types.
 */

import { BuildError, ErrorCategory, ErrorCodes, Platform } from './BuildError';

/**
 * Documentation entry for an error code
 */
export interface ErrorDocumentation {
  /** Error code */
  code: string;
  
  /** Brief description of the error */
  description: string;
  
  /** Detailed explanation of what causes this error */
  cause: string;
  
  /** Actionable suggestions for fixing the error */
  suggestions: string[];
  
  /** Links to relevant documentation */
  documentationLinks: string[];
  
  /** Example scenarios where this error occurs */
  examples?: string[];
  
  /** Related error codes */
  relatedErrors?: string[];
}

/**
 * Error documentation registry
 * 
 * Comprehensive documentation for all error codes in the build system.
 */
export const ERROR_DOCUMENTATION: Record<string, ErrorDocumentation> = {
  // Configuration Errors
  [ErrorCodes.CONFIG_INVALID_PLATFORM]: {
    code: ErrorCodes.CONFIG_INVALID_PLATFORM,
    description: 'Invalid platform specified in build configuration',
    cause: 'The platform specified in the build configuration is not supported. Valid platforms are: ios, android, web.',
    suggestions: [
      'Check the platform value in your build configuration',
      'Ensure platform is one of: "ios", "android", or "web"',
      'Verify there are no typos in the platform name',
      'Review the BuildConfig interface for valid platform values',
    ],
    documentationLinks: [
      'docs/configuration/build-config.md#platforms',
      'docs/getting-started/supported-platforms.md',
    ],
    examples: [
      'Invalid: { platforms: ["iOS"] } - platform names are lowercase',
      'Invalid: { platforms: ["react-native"] } - not a supported platform',
      'Valid: { platforms: ["ios", "android", "web"] }',
    ],
    relatedErrors: [ErrorCodes.CONFIG_MISSING_REQUIRED],
  },
  
  [ErrorCodes.CONFIG_MISSING_REQUIRED]: {
    code: ErrorCodes.CONFIG_MISSING_REQUIRED,
    description: 'Required configuration field is missing',
    cause: 'A required field in the build configuration is missing or undefined.',
    suggestions: [
      'Review the BuildConfig interface for required fields',
      'Ensure all required fields are provided in your configuration',
      'Check for typos in configuration field names',
      'Validate your configuration against the schema',
    ],
    documentationLinks: [
      'docs/configuration/build-config.md#required-fields',
      'docs/configuration/validation.md',
    ],
    examples: [
      'Missing platforms: { outputDir: "./dist" } - platforms is required',
      'Missing outputDir: { platforms: ["web"] } - outputDir is required',
    ],
    relatedErrors: [ErrorCodes.CONFIG_INVALID_PLATFORM, ErrorCodes.CONFIG_INVALID_OUTPUT_DIR],
  },
  
  [ErrorCodes.CONFIG_CONFLICTING_OPTIONS]: {
    code: ErrorCodes.CONFIG_CONFLICTING_OPTIONS,
    description: 'Conflicting options in build configuration',
    cause: 'Two or more configuration options conflict with each other and cannot be used together.',
    suggestions: [
      'Review the conflicting options mentioned in the error context',
      'Choose one option or adjust configuration to resolve conflict',
      'Consult documentation for mutually exclusive options',
      'Consider using separate build configurations for different scenarios',
    ],
    documentationLinks: [
      'docs/configuration/build-config.md#option-compatibility',
      'docs/configuration/advanced-options.md',
    ],
    examples: [
      'Conflicting: { parallel: true, incremental: true } - not supported together',
      'Conflicting: { mode: "production", sourceMaps: true } - source maps disabled in production',
    ],
    relatedErrors: [ErrorCodes.CONFIG_MISSING_REQUIRED],
  },
  
  [ErrorCodes.CONFIG_INVALID_OUTPUT_DIR]: {
    code: ErrorCodes.CONFIG_INVALID_OUTPUT_DIR,
    description: 'Invalid output directory specified',
    cause: 'The output directory path is invalid, inaccessible, or cannot be created.',
    suggestions: [
      'Verify the output directory path is valid',
      'Ensure you have write permissions for the output directory',
      'Check that parent directories exist',
      'Use absolute paths or paths relative to project root',
      'Avoid special characters in directory paths',
    ],
    documentationLinks: [
      'docs/configuration/build-config.md#output-directory',
      'docs/troubleshooting/file-system-errors.md',
    ],
    examples: [
      'Invalid: { outputDir: "/root/protected" } - permission denied',
      'Invalid: { outputDir: "../../outside-project" } - outside project root',
      'Valid: { outputDir: "./dist" } or { outputDir: "./build/output" }',
    ],
    relatedErrors: [ErrorCodes.BUILD_PACKAGE_GENERATION_FAILED],
  },
  
  // Build Errors
  [ErrorCodes.BUILD_COMPILATION_FAILED]: {
    code: ErrorCodes.BUILD_COMPILATION_FAILED,
    description: 'Platform-specific code compilation failed',
    cause: 'The generated platform-specific code failed to compile due to syntax errors, type errors, or missing dependencies.',
    suggestions: [
      'Review the compilation error details in the error context',
      'Check the generated source files for syntax errors',
      'Verify all platform-specific dependencies are installed',
      'Ensure component interfaces are correctly defined',
      'Run platform-specific validation before building',
    ],
    documentationLinks: [
      'docs/platforms/ios/compilation.md',
      'docs/platforms/android/compilation.md',
      'docs/platforms/web/compilation.md',
      'docs/troubleshooting/compilation-errors.md',
    ],
    examples: [
      'Swift compilation error: Missing required protocol method',
      'Kotlin compilation error: Type mismatch in function signature',
      'TypeScript compilation error: Cannot find module',
    ],
    relatedErrors: [ErrorCodes.BUILD_MISSING_DEPENDENCY, ErrorCodes.INTERFACE_METHOD_MISMATCH],
  },
  
  [ErrorCodes.BUILD_MISSING_DEPENDENCY]: {
    code: ErrorCodes.BUILD_MISSING_DEPENDENCY,
    description: 'Required build dependency is missing',
    cause: 'A required dependency for the platform build is not installed or cannot be found.',
    suggestions: [
      'Install the missing dependency mentioned in the error context',
      'Run platform-specific dependency installation (npm install, pod install, etc.)',
      'Verify dependency versions match requirements',
      'Check that dependency is listed in platform configuration',
      'Clear dependency cache and reinstall if needed',
    ],
    documentationLinks: [
      'docs/getting-started/installation.md',
      'docs/platforms/ios/dependencies.md',
      'docs/platforms/android/dependencies.md',
      'docs/platforms/web/dependencies.md',
    ],
    examples: [
      'iOS: Missing CocoaPods dependency',
      'Android: Missing Gradle dependency',
      'Web: Missing npm package',
    ],
    relatedErrors: [ErrorCodes.BUILD_COMPILATION_FAILED],
  },
  
  [ErrorCodes.BUILD_INVALID_SOURCE]: {
    code: ErrorCodes.BUILD_INVALID_SOURCE,
    description: 'Invalid source file or component definition',
    cause: 'A source file or component definition is malformed, missing required fields, or violates interface contracts.',
    suggestions: [
      'Validate the source file mentioned in the error context',
      'Ensure component definition includes all required fields',
      'Check that interface contracts are properly defined',
      'Verify component follows the expected structure',
      'Run interface validation before building',
    ],
    documentationLinks: [
      'docs/components/component-definition.md',
      'docs/components/interface-contracts.md',
      'docs/validation/source-validation.md',
    ],
    examples: [
      'Missing interface definition in component',
      'Invalid token reference in component',
      'Malformed component metadata',
    ],
    relatedErrors: [ErrorCodes.INTERFACE_MISSING_IMPLEMENTATION, ErrorCodes.TOKEN_NOT_FOUND],
  },
  
  [ErrorCodes.BUILD_PACKAGE_GENERATION_FAILED]: {
    code: ErrorCodes.BUILD_PACKAGE_GENERATION_FAILED,
    description: 'Failed to generate platform-specific package',
    cause: 'The build system failed to generate the platform-specific package (Swift Package, AAR, NPM package) due to packaging errors.',
    suggestions: [
      'Review the packaging error details in the error context',
      'Verify output directory is writable',
      'Check that all required files are generated',
      'Ensure package manifest is valid',
      'Try cleaning build artifacts and rebuilding',
    ],
    documentationLinks: [
      'docs/platforms/ios/packaging.md',
      'docs/platforms/android/packaging.md',
      'docs/platforms/web/packaging.md',
      'docs/troubleshooting/packaging-errors.md',
    ],
    examples: [
      'iOS: Invalid Package.swift manifest',
      'Android: Gradle packaging error',
      'Web: NPM package.json validation failed',
    ],
    relatedErrors: [ErrorCodes.BUILD_COMPILATION_FAILED, ErrorCodes.CONFIG_INVALID_OUTPUT_DIR],
  },
  
  // Token Errors
  [ErrorCodes.TOKEN_NOT_FOUND]: {
    code: ErrorCodes.TOKEN_NOT_FOUND,
    description: 'Referenced token does not exist in F1 token system',
    cause: 'A component references a token that does not exist in the F1 primitive or semantic token registries.',
    suggestions: [
      'Verify the token name is correct',
      'Check that the token exists in F1 token system',
      'Ensure token is properly registered in primitive or semantic registry',
      'Review token naming conventions',
      'Consider creating the token if it should exist',
    ],
    documentationLinks: [
      'docs/tokens/token-integration.md',
      'docs/tokens/f1-integration.md',
      'docs/tokens/token-naming.md',
    ],
    examples: [
      'Token "space999" not found - invalid token name',
      'Token "color.tertiary" not found - not defined in semantic registry',
      'Token "fontSize.huge" not found - typo in token name',
    ],
    relatedErrors: [ErrorCodes.TOKEN_INVALID_SELECTION],
  },
  
  [ErrorCodes.TOKEN_INVALID_SELECTION]: {
    code: ErrorCodes.TOKEN_INVALID_SELECTION,
    description: 'Invalid token selection priority or reasoning',
    cause: 'The token selection does not follow the required priority (semantic → primitive → component) or lacks proper reasoning.',
    suggestions: [
      'Follow token selection priority: semantic first, then primitive, then component',
      'Provide clear reasoning for token selection',
      'Document why semantic tokens were not used if using primitive tokens',
      'Document why primitive tokens were insufficient if creating component tokens',
      'Review token selection guidelines',
    ],
    documentationLinks: [
      'docs/tokens/token-selection-priority.md',
      'docs/tokens/component-tokens.md',
      'docs/design/token-philosophy.md',
    ],
    examples: [
      'Invalid: Using primitive token without checking semantic tokens first',
      'Invalid: Creating component token without documenting why existing tokens insufficient',
      'Valid: Using semantic token with reasoning',
    ],
    relatedErrors: [ErrorCodes.TOKEN_NOT_FOUND],
  },
  
  [ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY]: {
    code: ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY,
    description: 'Token values are mathematically inconsistent across platforms',
    cause: 'Token values do not maintain mathematical relationships across platforms, violating cross-platform consistency requirements.',
    suggestions: [
      'Review token values across all platforms',
      'Ensure mathematical relationships are preserved',
      'Check unit conversion logic for errors',
      'Verify baseline grid alignment',
      'Run F1 mathematical validation',
    ],
    documentationLinks: [
      'docs/tokens/mathematical-consistency.md',
      'docs/tokens/cross-platform-validation.md',
      'docs/tokens/f1-validation.md',
    ],
    examples: [
      'space100 converts to different visual sizes on different platforms',
      'Token violates baseline grid alignment',
      'Mathematical relationship broken in conversion',
    ],
    relatedErrors: [ErrorCodes.TOKEN_CONVERSION_FAILED],
  },
  
  [ErrorCodes.TOKEN_CONVERSION_FAILED]: {
    code: ErrorCodes.TOKEN_CONVERSION_FAILED,
    description: 'Failed to convert token to platform-specific value',
    cause: 'The token conversion from unitless base value to platform-specific units (pt, dp, px, rem) failed.',
    suggestions: [
      'Verify token has valid base value',
      'Check unit conversion logic for the platform',
      'Ensure platform-specific conversion rules are defined',
      'Review token type and category',
      'Check for edge cases in conversion logic',
    ],
    documentationLinks: [
      'docs/tokens/unit-conversion.md',
      'docs/platforms/ios/token-conversion.md',
      'docs/platforms/android/token-conversion.md',
      'docs/platforms/web/token-conversion.md',
    ],
    examples: [
      'Failed to convert color token to platform format',
      'Invalid base value for spacing token',
      'Unsupported token type for platform',
    ],
    relatedErrors: [ErrorCodes.TOKEN_MATHEMATICAL_INCONSISTENCY],
  },
  
  // Interface Errors
  [ErrorCodes.INTERFACE_METHOD_MISMATCH]: {
    code: ErrorCodes.INTERFACE_METHOD_MISMATCH,
    description: 'Method signatures do not match across platforms',
    cause: 'A component method has different signatures across platform implementations, violating unified interface contracts.',
    suggestions: [
      'Review method signatures across all platforms',
      'Ensure parameter types match across platforms',
      'Verify return types are consistent',
      'Check method names are identical',
      'Update platform implementations to match interface contract',
    ],
    documentationLinks: [
      'docs/components/interface-contracts.md',
      'docs/validation/interface-validation.md',
      'docs/platforms/type-mapping.md',
    ],
    examples: [
      'iOS method has different parameter type than Android',
      'Web method missing parameter that exists in iOS/Android',
      'Return type differs between platforms',
    ],
    relatedErrors: [ErrorCodes.INTERFACE_PROPERTY_MISMATCH, ErrorCodes.INTERFACE_BEHAVIORAL_INCONSISTENCY],
  },
  
  [ErrorCodes.INTERFACE_PROPERTY_MISMATCH]: {
    code: ErrorCodes.INTERFACE_PROPERTY_MISMATCH,
    description: 'Property types do not match across platforms',
    cause: 'A component property has different types across platform implementations, violating unified interface contracts.',
    suggestions: [
      'Review property types across all platforms',
      'Ensure property names are identical',
      'Verify property types are equivalent across platforms',
      'Check for optional vs required property mismatches',
      'Update platform implementations to match interface contract',
    ],
    documentationLinks: [
      'docs/components/interface-contracts.md',
      'docs/validation/interface-validation.md',
      'docs/platforms/type-mapping.md',
    ],
    examples: [
      'iOS property is optional but required on Android',
      'Property type is String on iOS but Int on Android',
      'Property name differs between platforms',
    ],
    relatedErrors: [ErrorCodes.INTERFACE_METHOD_MISMATCH, ErrorCodes.INTERFACE_BEHAVIORAL_INCONSISTENCY],
  },
  
  [ErrorCodes.INTERFACE_MISSING_IMPLEMENTATION]: {
    code: ErrorCodes.INTERFACE_MISSING_IMPLEMENTATION,
    description: 'Platform implementation is missing for component',
    cause: 'A component is missing implementation for one or more platforms.',
    suggestions: [
      'Implement the component for all target platforms',
      'Ensure platform-specific files exist',
      'Verify component follows expected directory structure',
      'Check that platform implementations are properly exported',
      'Review component definition for missing platform entries',
    ],
    documentationLinks: [
      'docs/components/component-structure.md',
      'docs/components/platform-implementations.md',
      'docs/getting-started/creating-components.md',
    ],
    examples: [
      'Component has iOS and Android implementations but missing Web',
      'Platform implementation file not found',
      'Component not exported from platform module',
    ],
    relatedErrors: [ErrorCodes.BUILD_INVALID_SOURCE],
  },
  
  [ErrorCodes.INTERFACE_BEHAVIORAL_INCONSISTENCY]: {
    code: ErrorCodes.INTERFACE_BEHAVIORAL_INCONSISTENCY,
    description: 'Component behavior differs across platforms',
    cause: 'Component implementations exhibit different behavior across platforms, violating behavioral consistency requirements.',
    suggestions: [
      'Review component behavior across all platforms',
      'Ensure state management is consistent',
      'Verify event handling matches across platforms',
      'Check that side effects are equivalent',
      'Update implementations to maintain behavioral consistency',
    ],
    documentationLinks: [
      'docs/components/behavioral-consistency.md',
      'docs/validation/behavioral-validation.md',
      'docs/testing/cross-platform-testing.md',
    ],
    examples: [
      'Button click behavior differs between iOS and Android',
      'State updates happen in different order across platforms',
      'Event propagation differs between platforms',
    ],
    relatedErrors: [ErrorCodes.INTERFACE_METHOD_MISMATCH, ErrorCodes.INTERFACE_PROPERTY_MISMATCH],
  },
};

/**
 * Get documentation for an error code
 */
export function getErrorDocumentation(code: string): ErrorDocumentation | undefined {
  return ERROR_DOCUMENTATION[code];
}

/**
 * Enhance a BuildError with comprehensive documentation and suggestions
 */
export function enhanceErrorWithDocumentation(error: BuildError): BuildError {
  const documentation = getErrorDocumentation(error.code);
  
  if (!documentation) {
    // Return error as-is if no documentation found
    return error;
  }
  
  // Merge documentation suggestions with existing suggestions
  const suggestions = [
    ...error.suggestions,
    ...documentation.suggestions.filter(s => !error.suggestions.includes(s)),
  ];
  
  // Merge documentation links with existing links
  const documentationLinks = [
    ...error.documentation,
    ...documentation.documentationLinks.filter(d => !error.documentation.includes(d)),
  ];
  
  // Add documentation context
  const enhancedContext = {
    ...error.context,
    errorDescription: documentation.description,
    errorCause: documentation.cause,
    examples: documentation.examples,
    relatedErrors: documentation.relatedErrors,
  };
  
  return {
    ...error,
    suggestions,
    documentation: documentationLinks,
    context: enhancedContext,
  };
}

/**
 * Format error with file paths and line numbers for debugging
 */
export interface ErrorLocation {
  /** File path where error occurred */
  filePath?: string;
  
  /** Line number where error occurred */
  lineNumber?: number;
  
  /** Column number where error occurred */
  columnNumber?: number;
  
  /** Code snippet around the error location */
  codeSnippet?: string;
}

/**
 * Add location information to error context
 */
export function addErrorLocation(
  error: BuildError,
  location: ErrorLocation
): BuildError {
  return {
    ...error,
    context: {
      ...error.context,
      location,
    },
  };
}

/**
 * Format error message with context for display
 */
export function formatErrorMessage(error: BuildError): string {
  const parts: string[] = [];
  
  // Header
  parts.push(`[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`);
  
  // Platform and component info
  if (error.platform || error.component) {
    const info: string[] = [];
    if (error.platform) info.push(`Platform: ${error.platform}`);
    if (error.component) info.push(`Component: ${error.component}`);
    parts.push(info.join(' | '));
  }
  
  // Location info
  const location = error.context.location as ErrorLocation | undefined;
  if (location?.filePath) {
    let locationStr = `  at ${location.filePath}`;
    if (location.lineNumber) {
      locationStr += `:${location.lineNumber}`;
      if (location.columnNumber) {
        locationStr += `:${location.columnNumber}`;
      }
    }
    parts.push(locationStr);
  }
  
  // Code snippet
  if (location?.codeSnippet) {
    parts.push('\nCode:');
    parts.push(location.codeSnippet);
  }
  
  // Description and cause
  if (error.context.errorDescription) {
    parts.push(`\nDescription: ${error.context.errorDescription}`);
  }
  if (error.context.errorCause) {
    parts.push(`Cause: ${error.context.errorCause}`);
  }
  
  // Suggestions
  if (error.suggestions.length > 0) {
    parts.push('\nSuggestions:');
    error.suggestions.forEach(suggestion => {
      parts.push(`  • ${suggestion}`);
    });
  }
  
  // Documentation links
  if (error.documentation.length > 0) {
    parts.push('\nDocumentation:');
    error.documentation.forEach(doc => {
      parts.push(`  • ${doc}`);
    });
  }
  
  // Examples
  if (error.context.examples && Array.isArray(error.context.examples)) {
    parts.push('\nExamples:');
    (error.context.examples as string[]).forEach(example => {
      parts.push(`  • ${example}`);
    });
  }
  
  // Related errors
  if (error.context.relatedErrors && Array.isArray(error.context.relatedErrors)) {
    parts.push('\nRelated Errors:');
    (error.context.relatedErrors as string[]).forEach(related => {
      parts.push(`  • ${related}`);
    });
  }
  
  return parts.join('\n');
}

/**
 * Generate error report with all errors formatted
 */
export function generateErrorReport(errors: BuildError[]): string {
  if (errors.length === 0) {
    return 'No errors to report.';
  }
  
  const parts: string[] = [];
  
  // Summary
  parts.push('='.repeat(80));
  parts.push('BUILD ERROR REPORT');
  parts.push('='.repeat(80));
  parts.push(`\nTotal Errors: ${errors.length}`);
  
  // Group by severity
  const errorsBySeverity = {
    error: errors.filter(e => e.severity === 'error'),
    warning: errors.filter(e => e.severity === 'warning'),
    info: errors.filter(e => e.severity === 'info'),
  };
  
  parts.push(`  • Critical Errors: ${errorsBySeverity.error.length}`);
  parts.push(`  • Warnings: ${errorsBySeverity.warning.length}`);
  parts.push(`  • Info: ${errorsBySeverity.info.length}`);
  
  // Group by category
  const errorsByCategory: Record<string, BuildError[]> = {};
  errors.forEach(error => {
    if (!errorsByCategory[error.category]) {
      errorsByCategory[error.category] = [];
    }
    errorsByCategory[error.category].push(error);
  });
  
  parts.push('\nErrors by Category:');
  Object.entries(errorsByCategory).forEach(([category, categoryErrors]) => {
    parts.push(`  • ${category}: ${categoryErrors.length}`);
  });
  
  // Detailed errors
  parts.push('\n' + '='.repeat(80));
  parts.push('DETAILED ERRORS');
  parts.push('='.repeat(80));
  
  errors.forEach((error, index) => {
    parts.push(`\n[${index + 1}/${errors.length}]`);
    parts.push(formatErrorMessage(error));
    parts.push('-'.repeat(80));
  });
  
  return parts.join('\n');
}
