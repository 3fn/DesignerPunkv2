# Build System Error Handling

Comprehensive error handling system with documentation, suggestions, and recovery strategies for the Cross-Platform Build System.

## Overview

The error handling system provides:

- **Comprehensive Documentation**: Every error code has detailed documentation with causes, suggestions, and examples
- **Actionable Suggestions**: Clear, actionable steps to resolve each error type
- **File Locations**: File paths and line numbers for debugging
- **Code Snippets**: Contextual code snippets showing where errors occurred
- **Recovery Strategies**: Automatic recovery strategies (retry, skip, fallback, abort)
- **Error Reports**: Formatted error reports with summaries and detailed information

## Error Categories

### Configuration Errors (`config`)
Errors related to build configuration:
- `CONFIG_INVALID_PLATFORM`: Invalid platform specified
- `CONFIG_MISSING_REQUIRED`: Required configuration field missing
- `CONFIG_CONFLICTING_OPTIONS`: Conflicting configuration options
- `CONFIG_INVALID_OUTPUT_DIR`: Invalid output directory

### Build Errors (`build`)
Errors during build execution:
- `BUILD_COMPILATION_FAILED`: Platform-specific compilation failed
- `BUILD_MISSING_DEPENDENCY`: Required dependency missing
- `BUILD_INVALID_SOURCE`: Invalid source file or component
- `BUILD_PACKAGE_GENERATION_FAILED`: Package generation failed

### Token Errors (`token`)
Errors related to token integration:
- `TOKEN_NOT_FOUND`: Referenced token doesn't exist
- `TOKEN_INVALID_SELECTION`: Invalid token selection priority
- `TOKEN_MATHEMATICAL_INCONSISTENCY`: Mathematical inconsistency across platforms
- `TOKEN_CONVERSION_FAILED`: Token conversion failed

### Interface Errors (`interface`)
Errors related to interface validation:
- `INTERFACE_METHOD_MISMATCH`: Method signatures don't match
- `INTERFACE_PROPERTY_MISMATCH`: Property types don't match
- `INTERFACE_MISSING_IMPLEMENTATION`: Platform implementation missing
- `INTERFACE_BEHAVIORAL_INCONSISTENCY`: Behavior differs across platforms

## Usage

### Basic Error Creation

```typescript
import { createBuildError, ErrorCodes } from './errors';

const error = createBuildError({
  code: ErrorCodes.CONFIG_INVALID_PLATFORM,
  message: 'Invalid platform: "iOS"',
  severity: 'error',
  category: 'config',
});
```

### Enhancing Errors with Documentation

```typescript
import { enhanceErrorWithDocumentation } from './errors';

// Automatically adds suggestions, documentation links, and context
const enhanced = enhanceErrorWithDocumentation(error);
```

### Adding Location Information

```typescript
import { addErrorLocation } from './errors';

const withLocation = addErrorLocation(error, {
  filePath: 'src/components/Button.swift',
  lineNumber: 42,
  columnNumber: 15,
  codeSnippet: '  func onClick() { ... }',
});
```

### Formatting Error Messages

```typescript
import { formatErrorMessage } from './errors';

// Comprehensive formatted error message
const formatted = formatErrorMessage(error);
console.error(formatted);
```

### Generating Error Reports

```typescript
import { generateErrorReport } from './errors';

// Generate report for multiple errors
const report = generateErrorReport(errors);
console.log(report);
```

### Using ErrorHandler

```typescript
import { ErrorHandler } from './errors';

const handler = new ErrorHandler({
  verbose: true,
  maxRetries: 3,
  continueOnPlatformFailure: true,
});

// Handle error (automatically enhances with documentation)
const recovery = handler.handleError(error);

// Attempt recovery
const result = await handler.recover(error, {
  platform: 'ios',
  remainingPlatforms: ['android', 'web'],
});
```

## Error Documentation Structure

Each error code has comprehensive documentation:

```typescript
{
  code: 'ERROR_CODE',
  description: 'Brief description',
  cause: 'Detailed explanation of what causes this error',
  suggestions: [
    'Actionable suggestion 1',
    'Actionable suggestion 2',
  ],
  documentationLinks: [
    'docs/path/to/relevant-doc.md',
  ],
  examples: [
    'Example of when this error occurs',
  ],
  relatedErrors: [
    'RELATED_ERROR_CODE',
  ],
}
```

## Recovery Strategies

### Retry Strategy
Attempts operation again for transient errors:
- Network timeouts
- File locks
- Temporary resource unavailability
- Uses exponential backoff with jitter

### Skip Strategy
Skips problematic platform and continues:
- Platform-specific build failures
- Continues with remaining platforms
- Useful for partial builds

### Fallback Strategy
Uses cached artifacts or defaults:
- Cached build artifacts
- Default configuration
- Degraded functionality

### Abort Strategy
Stops build immediately:
- Critical configuration errors
- Non-recoverable errors
- Requires manual intervention

## Error Message Format

Formatted error messages include:

```
[ERROR] CONFIG_INVALID_PLATFORM: Invalid platform specified
Platform: ios | Component: Button
  at src/config/build.ts:42:15

Code:
  platforms: ["iOS", "android"]

Description: Invalid platform specified in build configuration
Cause: The platform specified in the build configuration is not supported...

Suggestions:
  • Check the platform value in your build configuration
  • Ensure platform is one of: "ios", "android", or "web"
  • Verify there are no typos in the platform name

Documentation:
  • docs/configuration/build-config.md#platforms
  • docs/getting-started/supported-platforms.md

Examples:
  • Invalid: { platforms: ["iOS"] } - platform names are lowercase
  • Valid: { platforms: ["ios", "android", "web"] }

Related Errors:
  • CONFIG_MISSING_REQUIRED
```

## Best Practices

### 1. Always Enhance Errors
```typescript
// ✅ Good: Enhance with documentation
const enhanced = enhanceErrorWithDocumentation(error);
throw enhanced;

// ❌ Bad: Throw raw error
throw error;
```

### 2. Add Location Information
```typescript
// ✅ Good: Include file location
const withLocation = addErrorLocation(error, {
  filePath: file.path,
  lineNumber: error.line,
});

// ❌ Bad: No location context
throw error;
```

### 3. Use ErrorHandler for Consistency
```typescript
// ✅ Good: Use ErrorHandler
const handler = new ErrorHandler();
const recovery = handler.handleError(error);

// ❌ Bad: Manual error handling
console.error(error.message);
```

### 4. Provide Context
```typescript
// ✅ Good: Rich context
const error = createBuildError({
  code: ErrorCodes.TOKEN_NOT_FOUND,
  message: 'Token not found',
  context: {
    requestedToken: 'space999',
    availableTokens: ['space100', 'space150'],
    component: 'Button',
  },
});

// ❌ Bad: No context
const error = createBuildError({
  code: ErrorCodes.TOKEN_NOT_FOUND,
  message: 'Token not found',
});
```

### 5. Generate Reports for Multiple Errors
```typescript
// ✅ Good: Comprehensive report
const report = generateErrorReport(errors);
console.log(report);

// ❌ Bad: Individual error logs
errors.forEach(e => console.error(e.message));
```

## Testing

Run error documentation tests:

```bash
npm test -- src/build/errors/__tests__/ErrorDocumentation.test.ts
```

See examples:

```bash
# View example file
cat src/build/errors/__tests__/ErrorDocumentation.example.ts
```

## Documentation Links

- [Build Configuration](../../../docs/configuration/build-config.md)
- [Token Integration](../../../docs/tokens/token-integration.md)
- [Interface Validation](../../../docs/validation/interface-validation.md)
- [Troubleshooting Guide](../../../docs/troubleshooting/README.md)

## Requirements

This implementation satisfies:
- **Requirement 10.3**: Actionable suggestions for each error type
- **Requirement 10.4**: Links to relevant documentation
- **Requirement 10.7**: Clear error messages with context
- File paths and line numbers for debugging


## Error Reporting

The error reporting system generates comprehensive reports for build failures, including:

- **Error statistics**: Counts by severity, category, and platform
- **Critical error details**: Full context and stack traces for critical errors
- **Recovery recommendations**: Actionable suggestions based on error patterns
- **Build summaries**: Overall build status and platform results
- **Multiple formats**: Text, JSON, and Markdown output formats

### Example Usage

```typescript
import { ErrorHandler, ErrorReporter, BuildResultSummary } from './errors';

const handler = new ErrorHandler({ verbose: true });

// Log some errors during build
handler.handleError(error1);
handler.handleError(error2);

// Generate comprehensive report
const buildSummary: BuildResultSummary = {
  totalPlatforms: 3,
  successfulPlatforms: ['android', 'web'],
  failedPlatforms: ['ios'],
  duration: 5000,
  status: 'partial',
};

const report = handler.generateReport(buildSummary);

// Output formatted report
console.log(report.formattedReport);

// Or get specific information
console.log(`Total errors: ${report.totalErrors}`);
console.log(`Critical errors: ${report.criticalErrors.length}`);
console.log(`Recommendations: ${report.recommendations.join('\n')}`);
```

### Report Formats

The error reporter supports multiple output formats:

**Text Format** (default):
```
================================================================================
BUILD ERROR REPORT
================================================================================

Generated: 2025-01-10T12:00:00.000Z

SUMMARY
--------------------------------------------------------------------------------
Build Status: PARTIAL
Platforms: 2/3 successful
Duration: 5.00s
Failed Platforms: ios

Total Issues: 5
  Errors: 3
  Warnings: 2
  Info: 0

CRITICAL ERRORS
--------------------------------------------------------------------------------
[1] BUILD_COMPILATION_FAILED: iOS build failed
...
```

**JSON Format**:
```json
{
  "timestamp": "2025-01-10T12:00:00.000Z",
  "totalErrors": 5,
  "errorsBySeverity": {
    "error": 3,
    "warning": 2,
    "info": 0
  },
  "criticalErrors": [...],
  "recommendations": [...]
}
```

**Markdown Format**:
```markdown
# Build Error Report

**Generated:** 2025-01-10T12:00:00.000Z

## Summary
...

## Critical Errors
...

## Recommendations
...
```

### Customizing Reports

```typescript
// Create reporter with custom options
const reporter = new ErrorReporter({
  includeStackTraces: true,
  includeContext: true,
  includeRecommendations: true,
  maxDetailedErrors: 10,
  format: 'markdown',
});

// Generate report
const report = reporter.generateReport(errors, buildSummary);

// Or update options on existing handler
handler.setReporterOptions({
  format: 'json',
  includeStackTraces: false,
});
```

### Error Summary

For quick build status, use the error summary:

```typescript
const summary = handler.generateErrorSummary();
// "Build completed with 3 errors, 2 warnings."
```

### Report Components

**Error Statistics**:
- Total error count
- Breakdown by severity (error, warning, info)
- Breakdown by category (config, build, token, interface)
- Breakdown by platform (ios, android, web)

**Critical Errors**:
- Full error details for all critical (error severity) issues
- Error context and stack traces (when enabled)
- Suggestions and documentation links
- Limited to `maxDetailedErrors` (default: 10)

**Recommendations**:
- Actionable suggestions based on error patterns
- Platform-specific guidance for failed builds
- Configuration fixes for config errors
- Token validation guidance for token errors
- Interface consistency checks for interface errors

**Build Summary**:
- Overall build status (success, partial, failed)
- Platform success/failure breakdown
- Build duration
- Failed platform list

### Testing Error Reports

Run error reporter tests:

```bash
npm test -- src/build/errors/__tests__/ErrorReporter.test.ts
```

Run integration tests:

```bash
npm test -- src/build/errors/__tests__/ErrorHandler.integration.test.ts
```

## Requirements Satisfied

This error reporting implementation satisfies:
- **Requirement 10.1**: Error codes, messages, and context
- **Requirement 10.2**: Platform-specific failure indication
- **Requirement 10.3**: Actionable suggestions for fixing errors
- **Requirement 10.4**: Links to relevant documentation
- **Requirement 10.7**: Clear error messages with context
- Detailed error reports with comprehensive information
- Build result summaries for overall status
