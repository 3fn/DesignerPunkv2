/**
 * Interface Contract Validator
 *
 * F2-specific validation that validates generated platform code interfaces.
 * Ensures all platforms implement the same API by parsing Swift/Kotlin/TypeScript
 * interfaces and comparing method signatures, return types, and property types.
 *
 * This is distinct from F1 validation (which validates mathematical consistency)
 * and focuses on API contract consistency across generated platform code.
 */
import { InterfaceDefinition, PropertyDefinition, MethodSignature, Platform } from './types/InterfaceDefinition';
import { ValidationReport } from './types/ValidationResult';
export interface InterfaceContractValidationResult {
    /** Whether all platforms implement the same API */
    valid: boolean;
    /** Component being validated */
    component: string;
    /** Detailed validation report */
    report: ValidationReport;
    /** Specific API differences found */
    apiDifferences: ApiDifference[];
    /** File paths where issues were found */
    affectedFiles: AffectedFile[];
}
export interface ApiDifference {
    /** Type of difference */
    type: 'method' | 'property' | 'event' | 'state';
    /** Name of the API element */
    name: string;
    /** Platforms where difference exists */
    platforms: Platform[];
    /** Description of the difference */
    description: string;
    /** Expected signature or type */
    expected: string;
    /** Actual signature or type */
    actual: string;
}
export interface AffectedFile {
    /** Platform */
    platform: Platform;
    /** File path */
    path: string;
    /** Line number (if available) */
    lineNumber?: number;
    /** API element name */
    element: string;
}
export declare class InterfaceContractValidator {
    private interfaceValidator;
    constructor();
    /**
     * Validate that all platforms implement the same API
     *
     * This is the main entry point for Task 8.3 validation.
     * It parses interfaces from all platforms and validates consistency.
     */
    validateInterfaceContracts(interfaces: InterfaceDefinition[]): InterfaceContractValidationResult;
    /**
     * Check if method signatures match across platforms
     *
     * Compares parameter types and return types to ensure consistency.
     */
    validateMethodSignatures(methods: Map<Platform, MethodSignature[]>): ApiDifference[];
    /**
     * Verify property types match across platforms
     *
     * Ensures type equivalence for all properties.
     */
    validatePropertyTypes(properties: Map<Platform, PropertyDefinition[]>): ApiDifference[];
    /**
     * Report specific API differences with file paths and line numbers
     *
     * Provides actionable error messages for developers.
     */
    generateDifferenceReport(result: InterfaceContractValidationResult): string;
    /**
     * Extract API differences from validation report
     */
    private extractApiDifferences;
    /**
     * Generate affected file information from interfaces and validation report
     */
    private generateAffectedFiles;
    /**
     * Generate platform-specific file path
     */
    private generateFilePath;
    /**
     * Map validation error type to API difference type
     */
    private mapErrorTypeToApiType;
    /**
     * Format method signature for display
     */
    private formatMethodSignature;
    /**
     * Group differences by type
     */
    private groupDifferencesByType;
}
//# sourceMappingURL=InterfaceContractValidator.d.ts.map