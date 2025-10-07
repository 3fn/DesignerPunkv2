/**
 * Build Validation Module
 * 
 * Exports interface validation functionality for cross-platform
 * API contract validation.
 */

export { InterfaceValidator } from './InterfaceValidator';
export { MethodSignatureValidator } from './MethodSignatureValidator';
export type { MethodSignatureComparison, MethodSignatureValidationResult } from './MethodSignatureValidator';
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
