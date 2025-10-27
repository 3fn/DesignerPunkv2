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
export type { DetailedValidationReport, ValidationSummary, PlatformValidationDetail, DetailedError, DetailedWarning, PlatformDifference, ActionableSuggestion, } from './ValidationReporter';
export { iOSBuildValidator } from './iOSBuildValidator';
export type { iOSValidationResult } from './iOSBuildValidator';
export { AndroidBuildValidator } from './AndroidBuildValidator';
export { WebBuildValidator } from './WebBuildValidator';
export { MathematicalConsistencyValidator } from './MathematicalConsistencyValidator';
export type { BuildMathematicalConsistencyResult, AccessibilityValidationResult, ContrastRatioIssue, TouchTargetIssue, } from './MathematicalConsistencyValidator';
export { TokenComparator } from './TokenComparator';
export type { TokenComparisonResult, TokenValueDifference, TokenComparisonRequest, TokenComparisonOptions, BatchComparisonResult, } from './TokenComparator';
export { InterfaceContractValidator } from './InterfaceContractValidator';
export type { InterfaceContractValidationResult, ApiDifference, AffectedFile, } from './InterfaceContractValidator';
export type { InterfaceDefinition, PropertyDefinition, MethodSignature, ParameterDefinition, EventDefinition, StateDefinition, Platform, } from './types/InterfaceDefinition';
export type { ValidationResult, ValidationError, ValidationWarning, ValidationReport, ValidationErrorType, ValidationWarningType, } from './types/ValidationResult';
//# sourceMappingURL=index.d.ts.map