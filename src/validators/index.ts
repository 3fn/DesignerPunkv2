/**
 * Validators Module Exports
 * 
 * Exports all validation components for the Mathematical Token System
 */

// Core validator interface
export type { IValidator, ValidationResult, ValidationLevel } from './IValidator';

export { BaselineGridValidator } from './BaselineGridValidator';
export { CrossPlatformConsistencyValidator } from './CrossPlatformConsistencyValidator';
export { ErrorValidator } from './ErrorValidator';
export { PassValidator } from './PassValidator';
export { PlatformConstraintHandler } from './PlatformConstraintHandler';
export { ThreeTierValidator } from './ThreeTierValidator';
export { ToleranceCalculator } from './ToleranceCalculator';
export { ValidationReasoning } from './ValidationReasoning';
export { WarningValidator } from './WarningValidator';

// Semantic token validation exports
export { SemanticTokenValidator } from './SemanticTokenValidator';
export { CompositionPatternValidator } from './CompositionPatternValidator';
export { PrimitiveReferenceValidator } from './PrimitiveReferenceValidator';

// WCAG accessibility validation exports
export { WCAGValidator } from './WCAGValidator';
export type { WCAGValidationResult } from './WCAGValidator';

// Stemma System component naming validation exports
export {
  validateComponentName,
  validateComponentNames,
  isPascalCase,
  toPascalCase,
  determineComponentType,
  isPrimitiveComponent,
  isSemanticComponent,
  suggestCorrectedName,
  formatValidationErrors,
  formatValidationWarnings,
  RESERVED_KEYWORDS,
  KNOWN_FAMILIES
} from './StemmaComponentNamingValidator';
export type {
  ComponentNameValidationResult,
  ComponentNameSegments,
  ComponentNameError,
  ComponentNameWarning,
  ComponentNameErrorCode,
  ComponentNameWarningCode
} from './StemmaComponentNamingValidator';

// Stemma System token usage validation exports
export {
  validateTokenUsage,
  validateAgainstSchema,
  validateTokenUsageInFiles,
  detectPlatform,
  formatTokenUsageErrors,
  formatTokenUsageWarnings,
  TOKEN_CATEGORIES
} from './StemmaTokenUsageValidator';
export type {
  TokenUsageValidationResult,
  TokenUsageError,
  TokenUsageWarning,
  TokenUsageStats,
  TokenUsageErrorCode,
  TokenUsageWarningCode
} from './StemmaTokenUsageValidator';

// Stemma System property and accessibility validation exports
export {
  validatePropertyAndAccessibility,
  validateProperties,
  validateAccessibility,
  validateMultipleComponents,
  parseComponentSchema,
  loadComponentSchema,
  findSchemaPath,
  determineComponentType as determineComponentTypeFromSchema,
  formatPropertyAccessibilityErrors,
  formatPropertyAccessibilityWarnings,
  WCAG_REQUIREMENTS,
  TOUCH_TARGET_SIZES
} from './StemmaPropertyAccessibilityValidator';
export type {
  PropertyAccessibilityValidationResult,
  PropertyAccessibilityError,
  PropertyAccessibilityWarning,
  PropertyAccessibilityStats,
  PropertyAccessibilityErrorCode,
  PropertyAccessibilityWarningCode,
  ComponentSchema,
  SchemaProperty,
  SchemaContract,
  SchemaAccessibility,
  ComponentProperties
} from './StemmaPropertyAccessibilityValidator';

// Stemma System error guidance system exports
export {
  getErrorGuidance,
  getGuidanceByCategory,
  getGuidanceBySeverity,
  createIDEDiagnostic,
  convertNamingResultToGuidance,
  convertTokenUsageResultToGuidance,
  convertPropertyAccessibilityResultToGuidance,
  aggregateValidationResults,
  formatErrorGuidanceForConsole,
  formatErrorGuidanceForMarkdown,
  formatErrorGuidanceForJSON,
  formatAggregatedResultForConsole,
  formatAggregatedResultForMarkdown,
  getAllErrorCodes,
  getDocumentationLink,
  getQuickFix,
  hasAutoFix,
  getWCAGReference,
  getRelatedCodes,
  exportDiagnosticsForVSCode,
  exportDiagnosticsForESLint,
  DOCUMENTATION_LINKS,
  NAMING_ERROR_TEMPLATES,
  NAMING_WARNING_TEMPLATES,
  TOKEN_USAGE_ERROR_TEMPLATES,
  TOKEN_USAGE_WARNING_TEMPLATES,
  PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES,
  PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES
} from './StemmaErrorGuidanceSystem';
export type {
  ErrorSeverity,
  ErrorCategory,
  ErrorGuidance,
  QuickFix,
  IDEDiagnostic,
  AggregatedValidationResult
} from './StemmaErrorGuidanceSystem';

// Type exports
export type { SemanticValidationOptions, ComprehensiveValidationResult } from './SemanticTokenValidator';
export type { CompositionContext, CompositionValidationOptions } from './CompositionPatternValidator';
export type { PrimitiveReferenceValidationOptions } from './PrimitiveReferenceValidator';
