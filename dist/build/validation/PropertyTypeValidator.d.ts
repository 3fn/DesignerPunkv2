/**
 * Property Type Validator
 *
 * Validates that property types match across platform implementations.
 * Ensures consistent property definitions across iOS, Android, and Web.
 */
import { PropertyDefinition, Platform } from './types/InterfaceDefinition';
import { ValidationError } from './types/ValidationResult';
export interface PropertyComparison {
    property: PropertyDefinition;
    platform: Platform;
    otherProperty: PropertyDefinition;
    otherPlatform: Platform;
}
export interface PropertyValidationResult {
    valid: boolean;
    errors: ValidationError[];
    comparisonCount: number;
}
export declare class PropertyTypeValidator {
    /**
     * Parse property definitions from platform-specific code
     * This is a placeholder for future implementation that would parse actual code
     */
    parsePropertyDefinitions(code: string, platform: Platform): PropertyDefinition[];
    /**
     * Validate property definitions across all platforms
     */
    validateProperties(properties: PropertyDefinition[], otherProperties: PropertyDefinition[], platform: Platform, otherPlatform: Platform): PropertyValidationResult;
    /**
     * Compare two property definitions and generate errors for mismatches
     */
    private compareProperties;
    /**
     * Compare property types between definitions
     */
    private comparePropertyTypes;
    /**
     * Compare required flag between property definitions
     */
    private compareRequiredFlag;
    /**
     * Compare default values between property definitions
     */
    private compareDefaultValues;
    /**
     * Create error for missing property
     */
    private createPropertyMissingError;
    /**
     * Generate a human-readable property string
     */
    generatePropertyString(property: PropertyDefinition): string;
    /**
     * Compare property names across platforms
     */
    comparePropertyNames(properties: PropertyDefinition[], otherProperties: PropertyDefinition[]): {
        matching: string[];
        onlyInFirst: string[];
        onlyInSecond: string[];
    };
    /**
     * Get property type statistics across platforms
     */
    getPropertyTypeStatistics(properties: PropertyDefinition[]): {
        totalProperties: number;
        requiredCount: number;
        optionalCount: number;
        withDefaultsCount: number;
        typeDistribution: Record<string, number>;
    };
}
//# sourceMappingURL=PropertyTypeValidator.d.ts.map