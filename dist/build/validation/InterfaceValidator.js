"use strict";
/**
 * Interface Validator
 *
 * Validates that component interfaces match across all platform implementations.
 * Ensures unified API contracts are maintained for cross-platform consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceValidator = void 0;
const MethodSignatureValidator_1 = require("./MethodSignatureValidator");
const PropertyTypeValidator_1 = require("./PropertyTypeValidator");
class InterfaceValidator {
    constructor() {
        this.methodSignatureValidator = new MethodSignatureValidator_1.MethodSignatureValidator();
        this.propertyTypeValidator = new PropertyTypeValidator_1.PropertyTypeValidator();
    }
    /**
     * Validate that interfaces match across all platforms
     */
    validateInterfaces(interfaces) {
        if (interfaces.length === 0) {
            throw new Error('No interfaces provided for validation');
        }
        const componentName = interfaces[0].name;
        const results = [];
        // Validate each platform's interface
        for (const iface of interfaces) {
            const result = this.validateSingleInterface(iface, interfaces);
            results.push(result);
        }
        // Generate summary
        const allErrors = results.flatMap(r => r.errors);
        const allWarnings = results.flatMap(r => r.warnings);
        const errorSummary = this.summarizeErrors(allErrors);
        const warningSummary = this.summarizeWarnings(allWarnings);
        return {
            valid: allErrors.length === 0,
            component: componentName,
            results,
            errorSummary,
            warningSummary,
            timestamp: new Date(),
        };
    }
    /**
     * Validate a single interface against all other platform interfaces
     */
    validateSingleInterface(iface, allInterfaces) {
        const errors = [];
        const warnings = [];
        // Compare with other platforms
        const otherInterfaces = allInterfaces.filter(i => i.platform !== iface.platform);
        for (const other of otherInterfaces) {
            // Validate properties
            const propertyErrors = this.validateProperties(iface.properties, other.properties, iface.platform, other.platform);
            errors.push(...propertyErrors);
            // Validate methods
            const methodErrors = this.validateMethods(iface.methods, other.methods, iface.platform, other.platform);
            errors.push(...methodErrors);
            // Validate events
            const eventErrors = this.validateEvents(iface.events, other.events, iface.platform, other.platform);
            errors.push(...eventErrors);
            // Validate states
            const stateErrors = this.validateStates(iface.states, other.states, iface.platform, other.platform);
            errors.push(...stateErrors);
        }
        return {
            valid: errors.length === 0,
            component: iface.name,
            platform: iface.platform,
            errors,
            warnings,
            timestamp: new Date(),
        };
    }
    /**
     * Validate properties match across platforms
     * Delegates to PropertyTypeValidator for detailed validation
     */
    validateProperties(properties, otherProperties, platform, otherPlatform) {
        const result = this.propertyTypeValidator.validateProperties(properties, otherProperties, platform, otherPlatform);
        return result.errors;
    }
    /**
     * Validate methods match across platforms
     * Delegates to MethodSignatureValidator for detailed validation
     */
    validateMethods(methods, otherMethods, platform, otherPlatform) {
        const result = this.methodSignatureValidator.validateMethodSignatures(methods, otherMethods, platform, otherPlatform);
        return result.errors;
    }
    /**
     * Validate events match across platforms
     */
    validateEvents(events, otherEvents, platform, otherPlatform) {
        const errors = [];
        for (const event of events) {
            const otherEvent = otherEvents.find(e => e.name === event.name);
            if (!otherEvent) {
                errors.push({
                    type: 'event_mismatch',
                    message: `Event "${event.name}" exists in ${platform} but not in ${otherPlatform}`,
                    expected: `Event "${event.name}" in ${otherPlatform}`,
                    actual: 'Event not found',
                    platforms: [platform, otherPlatform],
                    location: event.name,
                    severity: 'error',
                });
                continue;
            }
            if (event.payloadType !== otherEvent.payloadType) {
                errors.push({
                    type: 'type_mismatch',
                    message: `Event "${event.name}" has different payload types: ${platform}="${event.payloadType}", ${otherPlatform}="${otherEvent.payloadType}"`,
                    expected: event.payloadType || 'undefined',
                    actual: otherEvent.payloadType || 'undefined',
                    platforms: [platform, otherPlatform],
                    location: event.name,
                    severity: 'error',
                });
            }
        }
        for (const otherEvent of otherEvents) {
            const event = events.find(e => e.name === otherEvent.name);
            if (!event) {
                errors.push({
                    type: 'event_mismatch',
                    message: `Event "${otherEvent.name}" exists in ${otherPlatform} but not in ${platform}`,
                    expected: `Event "${otherEvent.name}" in ${platform}`,
                    actual: 'Event not found',
                    platforms: [platform, otherPlatform],
                    location: otherEvent.name,
                    severity: 'error',
                });
            }
        }
        return errors;
    }
    /**
     * Validate states match across platforms
     */
    validateStates(states, otherStates, platform, otherPlatform) {
        const errors = [];
        for (const state of states) {
            const otherState = otherStates.find(s => s.name === state.name);
            if (!otherState) {
                errors.push({
                    type: 'state_mismatch',
                    message: `State "${state.name}" exists in ${platform} but not in ${otherPlatform}`,
                    expected: `State "${state.name}" in ${otherPlatform}`,
                    actual: 'State not found',
                    platforms: [platform, otherPlatform],
                    location: state.name,
                    severity: 'error',
                });
                continue;
            }
            if (state.type !== otherState.type) {
                errors.push({
                    type: 'type_mismatch',
                    message: `State "${state.name}" has different types: ${platform}="${state.type}", ${otherPlatform}="${otherState.type}"`,
                    expected: state.type,
                    actual: otherState.type,
                    platforms: [platform, otherPlatform],
                    location: state.name,
                    severity: 'error',
                });
            }
        }
        for (const otherState of otherStates) {
            const state = states.find(s => s.name === otherState.name);
            if (!state) {
                errors.push({
                    type: 'state_mismatch',
                    message: `State "${otherState.name}" exists in ${otherPlatform} but not in ${platform}`,
                    expected: `State "${otherState.name}" in ${platform}`,
                    actual: 'State not found',
                    platforms: [platform, otherPlatform],
                    location: otherState.name,
                    severity: 'error',
                });
            }
        }
        return errors;
    }
    /**
     * Summarize errors by type
     */
    summarizeErrors(errors) {
        const byType = {};
        for (const error of errors) {
            byType[error.type] = (byType[error.type] || 0) + 1;
        }
        return {
            total: errors.length,
            byType: byType,
        };
    }
    /**
     * Summarize warnings by type
     */
    summarizeWarnings(warnings) {
        const byType = {};
        for (const warning of warnings) {
            byType[warning.type] = (byType[warning.type] || 0) + 1;
        }
        return {
            total: warnings.length,
            byType: byType,
        };
    }
}
exports.InterfaceValidator = InterfaceValidator;
//# sourceMappingURL=InterfaceValidator.js.map