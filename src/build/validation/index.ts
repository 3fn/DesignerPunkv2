/**
 * Build Validation Module
 * 
 * Exports interface validation functionality for cross-platform
 * API contract validation and platform-specific build validators.
 */

export { InterfaceValidator } from './InterfaceValidator';
export { MethodSignatureValidator } from './MethodSignatureValidator';
export type { MethodComparison, MethodValidationResult } from './MethodSignatureValidator';
export { PropertyTypeValidator } from './PropertyTypeValidator';
export type { PropertyComparison, PropertyValidationResult } from './PropertyTypeValidator';
export { ValidationReporter } from './ValidationReporter';
export type {
  DetailedValidationReport,
  ValidationSummary,
  PlatformValidationDetail,
  DetailedError,
  DetailedWarning,
  PlatformDifference,
  ActionableSuggestion,
} from './ValidationReporter';

// Platform-specific build validators
export { iOSBuildValidator } from './iOSBuildValidator';
export type { iOSValidationResult } from './iOSBuildValidator';
export { AndroidBuildValidator } from './AndroidBuildValidator';
export { WebBuildValidator } from './WebBuildValidator';

// Cross-platform mathematical consistency validator
export { MathematicalConsistencyValidator } from './MathematicalConsistencyValidator';
export type {
  BuildMathematicalConsistencyResult,
  AccessibilityValidationResult,
  ContrastRatioIssue,
  TouchTargetIssue,
} from './MathematicalConsistencyValidator';

export type {
  InterfaceDefinition,
  PropertyDefinition,
  MethodSignature,
  ParameterDefinition,
  EventDefinition,
  StateDefinition,
  Platform,
} from './types/InterfaceDefinition';

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationReport,
  ValidationErrorType,
  ValidationWarningType,
} from './types/ValidationResult';
