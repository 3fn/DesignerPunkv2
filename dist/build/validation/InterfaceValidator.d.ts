/**
 * Interface Validator
 *
 * Validates that component interfaces match across all platform implementations.
 * Ensures unified API contracts are maintained for cross-platform consistency.
 */
import { InterfaceDefinition, PropertyDefinition, MethodSignature, EventDefinition, StateDefinition, Platform } from './types/InterfaceDefinition';
import { ValidationError, ValidationReport } from './types/ValidationResult';
export declare class InterfaceValidator {
    private methodSignatureValidator;
    private propertyTypeValidator;
    constructor();
    /**
     * Validate that interfaces match across all platforms
     */
    validateInterfaces(interfaces: InterfaceDefinition[]): ValidationReport;
    /**
     * Validate a single interface against all other platform interfaces
     */
    private validateSingleInterface;
    /**
     * Validate properties match across platforms
     * Delegates to PropertyTypeValidator for detailed validation
     */
    validateProperties(properties: PropertyDefinition[], otherProperties: PropertyDefinition[], platform: Platform, otherPlatform: Platform): ValidationError[];
    /**
     * Validate methods match across platforms
     * Delegates to MethodSignatureValidator for detailed validation
     */
    validateMethods(methods: MethodSignature[], otherMethods: MethodSignature[], platform: Platform, otherPlatform: Platform): ValidationError[];
    /**
     * Validate events match across platforms
     */
    validateEvents(events: EventDefinition[], otherEvents: EventDefinition[], platform: Platform, otherPlatform: Platform): ValidationError[];
    /**
     * Validate states match across platforms
     */
    validateStates(states: StateDefinition[], otherStates: StateDefinition[], platform: Platform, otherPlatform: Platform): ValidationError[];
    /**
     * Summarize errors by type
     */
    private summarizeErrors;
    /**
     * Summarize warnings by type
     */
    private summarizeWarnings;
}
//# sourceMappingURL=InterfaceValidator.d.ts.map