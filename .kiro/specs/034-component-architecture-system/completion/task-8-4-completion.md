# Task 8.4 Completion: Create Error Guidance System

**Date**: 2026-01-02
**Task**: 8.4 Create error guidance system
**Type**: Implementation
**Status**: Complete
**Organization**: spec-completion
**Scope**: 034-component-architecture-system

## Summary

Implemented a comprehensive error guidance system that provides unified error message templates with correction guidance, documentation links, and IDE integration for real-time feedback across all Stemma System validators.

## Implementation Details

### New Module: `StemmaErrorGuidanceSystem.ts`

Created a unified error guidance system with the following capabilities:

**Type Definitions:**
- `ErrorSeverity`: 'error' | 'warning' | 'info' | 'hint'
- `ErrorCategory`: 'naming' | 'token-usage' | 'property' | 'accessibility' | 'schema' | 'documentation'
- `ErrorGuidance`: Comprehensive error guidance entry with code, title, description, guidance steps, documentation links, quick fixes, and WCAG references
- `QuickFix`: Quick fix suggestion for IDE integration
- `IDEDiagnostic`: VS Code/ESLint compatible diagnostic format
- `AggregatedValidationResult`: Combined results from all validators

**Documentation Links:**
- Links to Stemma System principles, Component Quick Reference, Component Development Guide
- Links to component family documentation (form inputs, buttons, containers, icons)
- Links to Token Quick Reference
- Links to WCAG guidelines

**Error Message Templates:**

| Template Set | Error Count | Warning Count | Category |
|--------------|-------------|---------------|----------|
| NAMING_ERROR_TEMPLATES | 8 | - | naming |
| NAMING_WARNING_TEMPLATES | - | 3 | naming |
| TOKEN_USAGE_ERROR_TEMPLATES | 10 | - | token-usage |
| TOKEN_USAGE_WARNING_TEMPLATES | - | 7 | token-usage |
| PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES | 10 | - | property/accessibility/schema |
| PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES | - | 5 | property/accessibility |

**Core Functions:**
- `getErrorGuidance(code)`: Get guidance for a specific error code
- `getGuidanceByCategory(category)`: Get all guidance entries for a category
- `getGuidanceBySeverity(severity)`: Get all guidance entries for a severity level
- `createIDEDiagnostic(guidance, filePath, line, column)`: Create IDE-compatible diagnostic

**Conversion Functions:**
- `convertNamingResultToGuidance(result)`: Convert naming validation results
- `convertTokenUsageResultToGuidance(result)`: Convert token usage validation results
- `convertPropertyAccessibilityResultToGuidance(result)`: Convert property/accessibility validation results
- `aggregateValidationResults(naming?, tokenUsage?, propertyAccessibility?)`: Combine all validation results

**Formatting Functions:**
- `formatErrorGuidanceForConsole(guidance)`: Console output with icons and colors
- `formatErrorGuidanceForMarkdown(guidance)`: Markdown output for documentation
- `formatErrorGuidanceForJSON(guidance)`: JSON output for programmatic use
- `formatAggregatedResultForConsole(result)`: Full report for console
- `formatAggregatedResultForMarkdown(result)`: Full report for markdown

**IDE Integration Helpers:**
- `getAllErrorCodes()`: Get all error codes as a Map
- `getDocumentationLink(code)`: Get documentation link for an error code
- `getQuickFix(code)`: Get quick fix for an error code
- `hasAutoFix(code)`: Check if error has auto-applicable fix
- `getWCAGReference(code)`: Get WCAG reference for accessibility errors
- `getRelatedCodes(code)`: Get related error codes
- `exportDiagnosticsForVSCode(diagnostics, uri)`: Export in VS Code format
- `exportDiagnosticsForESLint(diagnostics, filePath)`: Export in ESLint format

### Files Created/Modified

1. **Created**: `src/validators/StemmaErrorGuidanceSystem.ts`
   - Main error guidance system implementation
   - ~1600 lines of TypeScript
   - Comprehensive type definitions and templates

2. **Updated**: `src/validators/index.ts`
   - Added exports for all new functions and types
   - 30+ new exports for error guidance system

3. **Created**: `src/validators/__tests__/StemmaErrorGuidanceSystem.test.ts`
   - 50+ test cases covering all functionality
   - Tests for templates, core functions, conversion, formatting, and IDE integration

## Validation Results

**Test Results**: All 6030 tests passing (256 test suites)
- StemmaErrorGuidanceSystem tests: All passing
- No regressions in existing validators

## Requirements Satisfied

- **R8**: Health Guardrails and Validation
  - ✅ Create error message templates with correction guidance
  - ✅ Link errors to relevant documentation
  - ✅ Integrate with IDE for real-time feedback

## Key Features

### Error Templates with Correction Guidance

Each error template includes:
- Unique error code for programmatic handling
- Category for grouping related errors
- Severity level for prioritization
- Short title and detailed description
- Step-by-step guidance for fixing the error
- Link to relevant documentation
- Quick fix suggestion (where applicable)
- Related error codes for context
- WCAG reference (for accessibility errors)

### Documentation Links

All error templates link to relevant documentation:
- Stemma System principles for naming errors
- Token Quick Reference for token usage errors
- Component Development Guide for property errors
- WCAG guidelines for accessibility errors

### IDE Integration

The system provides:
- VS Code compatible diagnostic format
- ESLint compatible output format
- Quick fix suggestions with auto-applicability flags
- Related information with documentation links
- Code actions for automated fixes

## Example Usage

```typescript
import {
  getErrorGuidance,
  aggregateValidationResults,
  formatAggregatedResultForConsole,
  exportDiagnosticsForVSCode
} from './validators';

// Get guidance for a specific error
const guidance = getErrorGuidance('MISSING_HYPHENS');
console.log(guidance?.title); // "Missing Hyphens in Component Name"
console.log(guidance?.guidance); // Step-by-step fix instructions

// Aggregate results from all validators
const result = aggregateValidationResults(
  namingResult,
  tokenUsageResult,
  propertyAccessibilityResult
);

// Format for console output
console.log(formatAggregatedResultForConsole(result));

// Export for VS Code
const vscodeOutput = exportDiagnosticsForVSCode(
  result.diagnostics,
  'file:///path/to/component.ts'
);
```

## WCAG Coverage

All accessibility errors include WCAG references:

| Error Code | WCAG Criterion | Level |
|------------|----------------|-------|
| MISSING_ACCESSIBILITY_LABEL | 4.1.2 | A |
| MISSING_FOCUS_INDICATOR | 2.4.7 | AA |
| INSUFFICIENT_TOUCH_TARGET | 2.5.8 | AA |
| MISSING_ERROR_IDENTIFICATION | 3.3.1 | A |
| MISSING_KEYBOARD_SUPPORT | 2.1.1 | A |
| TOUCH_TARGET_SUBOPTIMAL | 2.5.5 | AAA |
| MISSING_HELPER_TEXT | 3.3.2 | A |
