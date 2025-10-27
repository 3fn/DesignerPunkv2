"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceContractValidator = void 0;
const InterfaceValidator_1 = require("./InterfaceValidator");
class InterfaceContractValidator {
    constructor() {
        this.interfaceValidator = new InterfaceValidator_1.InterfaceValidator();
    }
    /**
     * Validate that all platforms implement the same API
     *
     * This is the main entry point for Task 8.3 validation.
     * It parses interfaces from all platforms and validates consistency.
     */
    validateInterfaceContracts(interfaces) {
        // Validate using the core InterfaceValidator
        const report = this.interfaceValidator.validateInterfaces(interfaces);
        // Extract API differences from validation errors
        const apiDifferences = this.extractApiDifferences(report);
        // Generate affected file information
        const affectedFiles = this.generateAffectedFiles(interfaces, report);
        return {
            valid: report.valid,
            component: report.component,
            report,
            apiDifferences,
            affectedFiles,
        };
    }
    /**
     * Check if method signatures match across platforms
     *
     * Compares parameter types and return types to ensure consistency.
     */
    validateMethodSignatures(methods) {
        const differences = [];
        const platforms = Array.from(methods.keys());
        if (platforms.length < 2) {
            return differences;
        }
        // Get reference platform (first one)
        const referencePlatform = platforms[0];
        const referenceMethods = methods.get(referencePlatform);
        // Compare each method across platforms
        for (const refMethod of referenceMethods) {
            for (let i = 1; i < platforms.length; i++) {
                const comparePlatform = platforms[i];
                const compareMethods = methods.get(comparePlatform);
                const compareMethod = compareMethods.find(m => m.name === refMethod.name);
                if (!compareMethod) {
                    differences.push({
                        type: 'method',
                        name: refMethod.name,
                        platforms: [referencePlatform, comparePlatform],
                        description: `Method "${refMethod.name}" exists in ${referencePlatform} but not in ${comparePlatform}`,
                        expected: this.formatMethodSignature(refMethod),
                        actual: 'Method not found',
                    });
                    continue;
                }
                // Compare return types
                if (refMethod.returnType !== compareMethod.returnType) {
                    differences.push({
                        type: 'method',
                        name: refMethod.name,
                        platforms: [referencePlatform, comparePlatform],
                        description: `Method "${refMethod.name}" has different return types`,
                        expected: `${refMethod.name}(...): ${refMethod.returnType}`,
                        actual: `${compareMethod.name}(...): ${compareMethod.returnType}`,
                    });
                }
                // Compare parameter types
                if (refMethod.parameters.length !== compareMethod.parameters.length) {
                    differences.push({
                        type: 'method',
                        name: refMethod.name,
                        platforms: [referencePlatform, comparePlatform],
                        description: `Method "${refMethod.name}" has different parameter counts`,
                        expected: this.formatMethodSignature(refMethod),
                        actual: this.formatMethodSignature(compareMethod),
                    });
                }
                else {
                    for (let j = 0; j < refMethod.parameters.length; j++) {
                        const refParam = refMethod.parameters[j];
                        const compareParam = compareMethod.parameters[j];
                        if (refParam.type !== compareParam.type) {
                            differences.push({
                                type: 'method',
                                name: refMethod.name,
                                platforms: [referencePlatform, comparePlatform],
                                description: `Method "${refMethod.name}" parameter "${refParam.name}" has different types`,
                                expected: `${refParam.name}: ${refParam.type}`,
                                actual: `${compareParam.name}: ${compareParam.type}`,
                            });
                        }
                    }
                }
            }
        }
        return differences;
    }
    /**
     * Verify property types match across platforms
     *
     * Ensures type equivalence for all properties.
     */
    validatePropertyTypes(properties) {
        const differences = [];
        const platforms = Array.from(properties.keys());
        if (platforms.length < 2) {
            return differences;
        }
        // Get reference platform (first one)
        const referencePlatform = platforms[0];
        const referenceProperties = properties.get(referencePlatform);
        // Compare each property across platforms
        for (const refProp of referenceProperties) {
            for (let i = 1; i < platforms.length; i++) {
                const comparePlatform = platforms[i];
                const compareProperties = properties.get(comparePlatform);
                const compareProp = compareProperties.find(p => p.name === refProp.name);
                if (!compareProp) {
                    differences.push({
                        type: 'property',
                        name: refProp.name,
                        platforms: [referencePlatform, comparePlatform],
                        description: `Property "${refProp.name}" exists in ${referencePlatform} but not in ${comparePlatform}`,
                        expected: `${refProp.name}: ${refProp.type}`,
                        actual: 'Property not found',
                    });
                    continue;
                }
                // Compare types
                if (refProp.type !== compareProp.type) {
                    differences.push({
                        type: 'property',
                        name: refProp.name,
                        platforms: [referencePlatform, comparePlatform],
                        description: `Property "${refProp.name}" has different types`,
                        expected: `${refProp.name}: ${refProp.type}`,
                        actual: `${compareProp.name}: ${compareProp.type}`,
                    });
                }
                // Compare required status
                if (refProp.required !== compareProp.required) {
                    differences.push({
                        type: 'property',
                        name: refProp.name,
                        platforms: [referencePlatform, comparePlatform],
                        description: `Property "${refProp.name}" has different required status`,
                        expected: `${refProp.name} (required: ${refProp.required})`,
                        actual: `${compareProp.name} (required: ${compareProp.required})`,
                    });
                }
            }
        }
        return differences;
    }
    /**
     * Report specific API differences with file paths and line numbers
     *
     * Provides actionable error messages for developers.
     */
    generateDifferenceReport(result) {
        const lines = [];
        lines.push(`Interface Contract Validation Report`);
        lines.push(`Component: ${result.component}`);
        lines.push(`Status: ${result.valid ? 'VALID' : 'INVALID'}`);
        lines.push('');
        if (result.apiDifferences.length === 0) {
            lines.push('✓ All platforms implement the same API');
            return lines.join('\n');
        }
        lines.push(`Found ${result.apiDifferences.length} API difference(s):`);
        lines.push('');
        // Group differences by type
        const byType = this.groupDifferencesByType(result.apiDifferences);
        for (const [type, diffs] of Object.entries(byType)) {
            lines.push(`${type.toUpperCase()} DIFFERENCES:`);
            for (const diff of diffs) {
                lines.push(`  • ${diff.name}`);
                lines.push(`    Platforms: ${diff.platforms.join(', ')}`);
                lines.push(`    Issue: ${diff.description}`);
                lines.push(`    Expected: ${diff.expected}`);
                lines.push(`    Actual: ${diff.actual}`);
                // Add affected files
                const files = result.affectedFiles.filter(f => f.element === diff.name);
                if (files.length > 0) {
                    lines.push(`    Affected files:`);
                    for (const file of files) {
                        const location = file.lineNumber ? `:${file.lineNumber}` : '';
                        lines.push(`      - ${file.platform}: ${file.path}${location}`);
                    }
                }
                lines.push('');
            }
        }
        return lines.join('\n');
    }
    /**
     * Extract API differences from validation report
     */
    extractApiDifferences(report) {
        const differences = [];
        for (const result of report.results) {
            for (const error of result.errors) {
                differences.push({
                    type: this.mapErrorTypeToApiType(error.type),
                    name: error.location || 'unknown',
                    platforms: error.platforms,
                    description: error.message,
                    expected: error.expected,
                    actual: error.actual,
                });
            }
        }
        return differences;
    }
    /**
     * Generate affected file information from interfaces and validation report
     */
    generateAffectedFiles(interfaces, report) {
        const files = [];
        for (const result of report.results) {
            if (!result.platform)
                continue;
            for (const error of result.errors) {
                files.push({
                    platform: result.platform,
                    path: this.generateFilePath(result.platform, result.component),
                    element: error.location || 'unknown',
                    // Line numbers would come from actual file parsing in real implementation
                    lineNumber: undefined,
                });
            }
        }
        return files;
    }
    /**
     * Generate platform-specific file path
     */
    generateFilePath(platform, component) {
        switch (platform) {
            case 'ios':
                return `platforms/ios/${component}.swift`;
            case 'android':
                return `platforms/android/${component}.kt`;
            case 'web':
                return `platforms/web/${component}.ts`;
        }
    }
    /**
     * Map validation error type to API difference type
     */
    mapErrorTypeToApiType(errorType) {
        // Check for method-related errors first (including return_type_mismatch)
        if (errorType.includes('method') || errorType.includes('return_type') || errorType.includes('parameter')) {
            return 'method';
        }
        if (errorType.includes('property'))
            return 'property';
        if (errorType.includes('event'))
            return 'event';
        if (errorType.includes('state'))
            return 'state';
        return 'property'; // default
    }
    /**
     * Format method signature for display
     */
    formatMethodSignature(method) {
        const params = method.parameters
            .map(p => `${p.name}: ${p.type}`)
            .join(', ');
        return `${method.name}(${params}): ${method.returnType}`;
    }
    /**
     * Group differences by type
     */
    groupDifferencesByType(differences) {
        const grouped = {};
        for (const diff of differences) {
            if (!grouped[diff.type]) {
                grouped[diff.type] = [];
            }
            grouped[diff.type].push(diff);
        }
        return grouped;
    }
}
exports.InterfaceContractValidator = InterfaceContractValidator;
//# sourceMappingURL=InterfaceContractValidator.js.map