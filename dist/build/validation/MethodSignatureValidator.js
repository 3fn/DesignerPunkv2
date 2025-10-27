"use strict";
/**
 * Method Signature Validator
 *
 * Validates that method signatures match across platform implementations.
 * Ensures consistent method definitions across iOS, Android, and Web.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodSignatureValidator = void 0;
class MethodSignatureValidator {
    /**
     * Parse method signatures from platform-specific code
     * This is a placeholder for future implementation that would parse actual code
     */
    parseMethodSignatures(code, platform) {
        // TODO: Implement platform-specific parsing
        // For now, this is a placeholder that would be implemented with:
        // - Swift parser for iOS
        // - Kotlin parser for Android  
        // - TypeScript parser for Web
        throw new Error('Method signature parsing not yet implemented');
    }
    /**
     * Validate method signatures across all platforms
     */
    validateMethodSignatures(methods, otherMethods, platform, otherPlatform) {
        const errors = [];
        let comparisonCount = 0;
        // Check for missing methods
        for (const method of methods) {
            const otherMethod = otherMethods.find(m => m.name === method.name);
            if (!otherMethod) {
                errors.push(this.createMethodMissingError(method, platform, otherPlatform));
                comparisonCount++;
                continue;
            }
            // Validate method components
            const methodErrors = this.compareMethods({
                method,
                platform,
                otherMethod,
                otherPlatform,
            });
            errors.push(...methodErrors);
            comparisonCount++;
        }
        // Check for extra methods in other platform
        for (const otherMethod of otherMethods) {
            const method = methods.find(m => m.name === otherMethod.name);
            if (!method) {
                errors.push(this.createMethodMissingError(otherMethod, otherPlatform, platform));
                comparisonCount++;
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            comparisonCount,
        };
    }
    /**
     * Compare two method signatures and generate errors for mismatches
     */
    compareMethods(comparison) {
        const errors = [];
        const { method, platform, otherMethod, otherPlatform } = comparison;
        // Compare method names (should already match, but validate)
        if (method.name !== otherMethod.name) {
            errors.push({
                type: 'method_mismatch',
                message: `Method name mismatch: ${platform}="${method.name}", ${otherPlatform}="${otherMethod.name}"`,
                expected: method.name,
                actual: otherMethod.name,
                platforms: [platform, otherPlatform],
                location: method.name,
                severity: 'error',
            });
        }
        // Compare return types
        const returnTypeErrors = this.compareReturnTypes(comparison);
        errors.push(...returnTypeErrors);
        // Compare parameters
        const parameterErrors = this.compareParameters(comparison);
        errors.push(...parameterErrors);
        return errors;
    }
    /**
     * Compare return types between method signatures
     */
    compareReturnTypes(comparison) {
        const { method, platform, otherMethod, otherPlatform } = comparison;
        const errors = [];
        if (method.returnType !== otherMethod.returnType) {
            errors.push({
                type: 'return_type_mismatch',
                message: `Method "${method.name}" has different return types: ${platform}="${method.returnType}", ${otherPlatform}="${otherMethod.returnType}"`,
                expected: method.returnType,
                actual: otherMethod.returnType,
                platforms: [platform, otherPlatform],
                location: method.name,
                severity: 'error',
            });
        }
        return errors;
    }
    /**
     * Compare parameters between method signatures
     */
    compareParameters(comparison) {
        const { method, platform, otherMethod, otherPlatform } = comparison;
        const errors = [];
        // Check parameter count
        if (method.parameters.length !== otherMethod.parameters.length) {
            errors.push({
                type: 'method_mismatch',
                message: `Method "${method.name}" has different parameter counts: ${platform}=${method.parameters.length}, ${otherPlatform}=${otherMethod.parameters.length}`,
                expected: `${method.parameters.length} parameters`,
                actual: `${otherMethod.parameters.length} parameters`,
                platforms: [platform, otherPlatform],
                location: method.name,
                severity: 'error',
            });
        }
        // Compare each parameter
        const maxLength = Math.max(method.parameters.length, otherMethod.parameters.length);
        for (let i = 0; i < maxLength; i++) {
            const param = method.parameters[i];
            const otherParam = otherMethod.parameters[i];
            if (!param || !otherParam) {
                continue; // Already reported parameter count mismatch
            }
            const paramErrors = this.compareParameter(param, otherParam, method.name, i, platform, otherPlatform);
            errors.push(...paramErrors);
        }
        return errors;
    }
    /**
     * Compare individual parameters
     */
    compareParameter(param, otherParam, methodName, paramIndex, platform, otherPlatform) {
        const errors = [];
        const location = `${methodName}[param ${paramIndex}]`;
        // Compare parameter names
        if (param.name !== otherParam.name) {
            errors.push({
                type: 'parameter_mismatch',
                message: `Method "${methodName}" parameter ${paramIndex} has different names: ${platform}="${param.name}", ${otherPlatform}="${otherParam.name}"`,
                expected: param.name,
                actual: otherParam.name,
                platforms: [platform, otherPlatform],
                location,
                severity: 'error',
            });
        }
        // Compare parameter types
        if (param.type !== otherParam.type) {
            errors.push({
                type: 'parameter_mismatch',
                message: `Method "${methodName}" parameter "${param.name}" has different types: ${platform}="${param.type}", ${otherPlatform}="${otherParam.type}"`,
                expected: param.type,
                actual: otherParam.type,
                platforms: [platform, otherPlatform],
                location,
                severity: 'error',
            });
        }
        // Compare required flag
        if (param.required !== otherParam.required) {
            errors.push({
                type: 'parameter_mismatch',
                message: `Method "${methodName}" parameter "${param.name}" required mismatch: ${platform}=${param.required}, ${otherPlatform}=${otherParam.required}`,
                expected: `required: ${param.required}`,
                actual: `required: ${otherParam.required}`,
                platforms: [platform, otherPlatform],
                location,
                severity: 'error',
            });
        }
        // Compare default values
        if ((param.defaultValue === undefined) !== (otherParam.defaultValue === undefined)) {
            errors.push({
                type: 'parameter_mismatch',
                message: `Method "${methodName}" parameter "${param.name}" default value mismatch: ${platform}="${param.defaultValue}", ${otherPlatform}="${otherParam.defaultValue}"`,
                expected: `default: ${param.defaultValue}`,
                actual: `default: ${otherParam.defaultValue}`,
                platforms: [platform, otherPlatform],
                location,
                severity: 'error',
            });
        }
        else if (param.defaultValue !== undefined && otherParam.defaultValue !== undefined) {
            // Both have defaults - compare them
            if (JSON.stringify(param.defaultValue) !== JSON.stringify(otherParam.defaultValue)) {
                errors.push({
                    type: 'parameter_mismatch',
                    message: `Method "${methodName}" parameter "${param.name}" has different default values: ${platform}="${JSON.stringify(param.defaultValue)}", ${otherPlatform}="${JSON.stringify(otherParam.defaultValue)}"`,
                    expected: `default: ${JSON.stringify(param.defaultValue)}`,
                    actual: `default: ${JSON.stringify(otherParam.defaultValue)}`,
                    platforms: [platform, otherPlatform],
                    location,
                    severity: 'error',
                });
            }
        }
        return errors;
    }
    /**
     * Create error for missing method
     */
    createMethodMissingError(method, existsInPlatform, missingInPlatform) {
        return {
            type: 'method_mismatch',
            message: `Method "${method.name}" exists in ${existsInPlatform} but not in ${missingInPlatform}`,
            expected: `Method "${method.name}" in ${missingInPlatform}`,
            actual: 'Method not found',
            platforms: [existsInPlatform, missingInPlatform],
            location: method.name,
            severity: 'error',
        };
    }
    /**
     * Generate a human-readable method signature string
     */
    generateMethodSignatureString(method) {
        const params = method.parameters
            .map(p => {
            const required = p.required ? '' : '?';
            const defaultVal = p.defaultValue !== undefined ? ` = ${JSON.stringify(p.defaultValue)}` : '';
            return `${p.name}${required}: ${p.type}${defaultVal}`;
        })
            .join(', ');
        return `${method.name}(${params}): ${method.returnType}`;
    }
    /**
     * Compare method names across platforms
     */
    compareMethodNames(methods, otherMethods) {
        const firstNames = new Set(methods.map(m => m.name));
        const secondNames = new Set(otherMethods.map(m => m.name));
        const matching = [];
        const onlyInFirst = [];
        const onlyInSecond = [];
        for (const name of firstNames) {
            if (secondNames.has(name)) {
                matching.push(name);
            }
            else {
                onlyInFirst.push(name);
            }
        }
        for (const name of secondNames) {
            if (!firstNames.has(name)) {
                onlyInSecond.push(name);
            }
        }
        return { matching, onlyInFirst, onlyInSecond };
    }
    /**
     * Get method signature statistics across platforms
     */
    getMethodSignatureStatistics(methods) {
        const returnTypeDistribution = {};
        const parameterTypeDistribution = {};
        let totalParameters = 0;
        for (const method of methods) {
            // Track return type distribution
            returnTypeDistribution[method.returnType] = (returnTypeDistribution[method.returnType] || 0) + 1;
            // Track parameter types
            for (const param of method.parameters) {
                parameterTypeDistribution[param.type] = (parameterTypeDistribution[param.type] || 0) + 1;
                totalParameters++;
            }
        }
        return {
            totalMethods: methods.length,
            averageParameterCount: methods.length > 0 ? totalParameters / methods.length : 0,
            returnTypeDistribution,
            parameterTypeDistribution,
        };
    }
}
exports.MethodSignatureValidator = MethodSignatureValidator;
//# sourceMappingURL=MethodSignatureValidator.js.map