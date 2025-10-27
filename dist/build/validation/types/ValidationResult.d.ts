/**
 * Validation Result Types
 *
 * Defines the structure for validation results including
 * errors and warnings from interface validation.
 */
import { Platform } from './InterfaceDefinition';
export interface ValidationResult {
    /** Whether validation passed */
    valid: boolean;
    /** Component being validated */
    component: string;
    /** Platform being validated */
    platform?: Platform;
    /** Validation errors */
    errors: ValidationError[];
    /** Validation warnings */
    warnings: ValidationWarning[];
    /** Validation timestamp */
    timestamp: Date;
}
export interface ValidationError {
    /** Error type */
    type: ValidationErrorType;
    /** Error message */
    message: string;
    /** Expected value or signature */
    expected: string;
    /** Actual value or signature */
    actual: string;
    /** Platforms involved in the error */
    platforms: Platform[];
    /** Property or method name where error occurred */
    location?: string;
    /** Severity level */
    severity: 'error';
}
export interface ValidationWarning {
    /** Warning type */
    type: ValidationWarningType;
    /** Warning message */
    message: string;
    /** Suggestion for resolution */
    suggestion?: string;
    /** Platforms involved in the warning */
    platforms: Platform[];
    /** Property or method name where warning occurred */
    location?: string;
    /** Severity level */
    severity: 'warning';
}
export type ValidationErrorType = 'method_mismatch' | 'property_mismatch' | 'type_mismatch' | 'parameter_mismatch' | 'return_type_mismatch' | 'event_mismatch' | 'state_mismatch' | 'missing_implementation' | 'signature_mismatch';
export type ValidationWarningType = 'optional_property_difference' | 'description_missing' | 'naming_convention_difference' | 'default_value_difference';
export interface ValidationReport {
    /** Overall validation status */
    valid: boolean;
    /** Component name */
    component: string;
    /** Validation results per platform */
    results: ValidationResult[];
    /** Summary of errors */
    errorSummary: {
        total: number;
        byType: Record<ValidationErrorType, number>;
    };
    /** Summary of warnings */
    warningSummary: {
        total: number;
        byType: Record<ValidationWarningType, number>;
    };
    /** Validation timestamp */
    timestamp: Date;
}
//# sourceMappingURL=ValidationResult.d.ts.map