/**
 * Method Signature Validator
 *
 * Validates that method signatures match across platform implementations.
 * Ensures consistent method definitions across iOS, Android, and Web.
 */
import { MethodSignature, Platform } from './types/InterfaceDefinition';
import { ValidationError } from './types/ValidationResult';
export interface MethodComparison {
    method: MethodSignature;
    platform: Platform;
    otherMethod: MethodSignature;
    otherPlatform: Platform;
}
export interface MethodValidationResult {
    valid: boolean;
    errors: ValidationError[];
    comparisonCount: number;
}
export declare class MethodSignatureValidator {
    /**
     * Parse method signatures from platform-specific code
     * This is a placeholder for future implementation that would parse actual code
     */
    parseMethodSignatures(code: string, platform: Platform): MethodSignature[];
    /**
     * Validate method signatures across all platforms
     */
    validateMethodSignatures(methods: MethodSignature[], otherMethods: MethodSignature[], platform: Platform, otherPlatform: Platform): MethodValidationResult;
    /**
     * Compare two method signatures and generate errors for mismatches
     */
    private compareMethods;
    /**
     * Compare return types between method signatures
     */
    private compareReturnTypes;
    /**
     * Compare parameters between method signatures
     */
    private compareParameters;
    /**
     * Compare individual parameters
     */
    private compareParameter;
    /**
     * Create error for missing method
     */
    private createMethodMissingError;
    /**
     * Generate a human-readable method signature string
     */
    generateMethodSignatureString(method: MethodSignature): string;
    /**
     * Compare method names across platforms
     */
    compareMethodNames(methods: MethodSignature[], otherMethods: MethodSignature[]): {
        matching: string[];
        onlyInFirst: string[];
        onlyInSecond: string[];
    };
    /**
     * Get method signature statistics across platforms
     */
    getMethodSignatureStatistics(methods: MethodSignature[]): {
        totalMethods: number;
        averageParameterCount: number;
        returnTypeDistribution: Record<string, number>;
        parameterTypeDistribution: Record<string, number>;
    };
}
//# sourceMappingURL=MethodSignatureValidator.d.ts.map