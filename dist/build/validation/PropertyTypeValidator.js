"use strict";
/**
 * Property Type Validator
 *
 * Validates that property types match across platform implementations.
 * Ensures consistent property definitions across iOS, Android, and Web.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyTypeValidator = void 0;
class PropertyTypeValidator {
    /**
     * Parse property definitions from platform-specific code
     * This is a placeholder for future implementation that would parse actual code
     */
    parsePropertyDefinitions(code, platform) {
        // TODO: Implement platform-specific parsing
        // For now, this is a placeholder that would be implemented with:
        // - Swift parser for iOS
        // - Kotlin parser for Android  
        // - TypeScript parser for Web
        throw new Error('Property definition parsing not yet implemented');
    }
    /**
     * Validate property definitions across all platforms
     */
    validateProperties(properties, otherProperties, platform, otherPlatform) {
        const errors = [];
        let comparisonCount = 0;
        // Check for missing properties
        for (const property of properties) {
            const otherProperty = otherProperties.find(p => p.name === property.name);
            if (!otherProperty) {
                errors.push(this.createPropertyMissingError(property, platform, otherPlatform));
                comparisonCount++;
                continue;
            }
            // Validate property components
            const propertyErrors = this.compareProperties({
                property,
                platform,
                otherProperty,
                otherPlatform,
            });
            errors.push(...propertyErrors);
            comparisonCount++;
        }
        // Check for extra properties in other platform
        for (const otherProperty of otherProperties) {
            const property = properties.find(p => p.name === otherProperty.name);
            if (!property) {
                errors.push(this.createPropertyMissingError(otherProperty, otherPlatform, platform));
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
     * Compare two property definitions and generate errors for mismatches
     */
    compareProperties(comparison) {
        const errors = [];
        const { property, platform, otherProperty, otherPlatform } = comparison;
        // Compare property names (should already match, but validate)
        if (property.name !== otherProperty.name) {
            errors.push({
                type: 'property_mismatch',
                message: `Property name mismatch: ${platform}="${property.name}", ${otherPlatform}="${otherProperty.name}"`,
                expected: property.name,
                actual: otherProperty.name,
                platforms: [platform, otherPlatform],
                location: property.name,
                severity: 'error',
            });
        }
        // Compare property types
        const typeErrors = this.comparePropertyTypes(comparison);
        errors.push(...typeErrors);
        // Compare required flag
        const requiredErrors = this.compareRequiredFlag(comparison);
        errors.push(...requiredErrors);
        // Compare default values
        const defaultValueErrors = this.compareDefaultValues(comparison);
        errors.push(...defaultValueErrors);
        return errors;
    }
    /**
     * Compare property types between definitions
     */
    comparePropertyTypes(comparison) {
        const { property, platform, otherProperty, otherPlatform } = comparison;
        const errors = [];
        if (property.type !== otherProperty.type) {
            errors.push({
                type: 'type_mismatch',
                message: `Property "${property.name}" has different types: ${platform}="${property.type}", ${otherPlatform}="${otherProperty.type}"`,
                expected: property.type,
                actual: otherProperty.type,
                platforms: [platform, otherPlatform],
                location: property.name,
                severity: 'error',
            });
        }
        return errors;
    }
    /**
     * Compare required flag between property definitions
     */
    compareRequiredFlag(comparison) {
        const { property, platform, otherProperty, otherPlatform } = comparison;
        const errors = [];
        if (property.required !== otherProperty.required) {
            errors.push({
                type: 'property_mismatch',
                message: `Property "${property.name}" required mismatch: ${platform}=${property.required}, ${otherPlatform}=${otherProperty.required}`,
                expected: `required: ${property.required}`,
                actual: `required: ${otherProperty.required}`,
                platforms: [platform, otherPlatform],
                location: property.name,
                severity: 'error',
            });
        }
        return errors;
    }
    /**
     * Compare default values between property definitions
     */
    compareDefaultValues(comparison) {
        const { property, platform, otherProperty, otherPlatform } = comparison;
        const errors = [];
        // Only error if one has a default and the other doesn't
        if ((property.defaultValue === undefined) !== (otherProperty.defaultValue === undefined)) {
            errors.push({
                type: 'property_mismatch',
                message: `Property "${property.name}" default value mismatch: ${platform}="${property.defaultValue}", ${otherPlatform}="${otherProperty.defaultValue}"`,
                expected: `default: ${property.defaultValue}`,
                actual: `default: ${otherProperty.defaultValue}`,
                platforms: [platform, otherPlatform],
                location: property.name,
                severity: 'error',
            });
        }
        else if (property.defaultValue !== undefined && otherProperty.defaultValue !== undefined) {
            // Both have defaults - compare them
            if (JSON.stringify(property.defaultValue) !== JSON.stringify(otherProperty.defaultValue)) {
                errors.push({
                    type: 'property_mismatch',
                    message: `Property "${property.name}" has different default values: ${platform}="${JSON.stringify(property.defaultValue)}", ${otherPlatform}="${JSON.stringify(otherProperty.defaultValue)}"`,
                    expected: `default: ${JSON.stringify(property.defaultValue)}`,
                    actual: `default: ${JSON.stringify(otherProperty.defaultValue)}`,
                    platforms: [platform, otherPlatform],
                    location: property.name,
                    severity: 'error',
                });
            }
        }
        return errors;
    }
    /**
     * Create error for missing property
     */
    createPropertyMissingError(property, existsInPlatform, missingInPlatform) {
        return {
            type: 'property_mismatch',
            message: `Property "${property.name}" exists in ${existsInPlatform} but not in ${missingInPlatform}`,
            expected: `Property "${property.name}" in ${missingInPlatform}`,
            actual: 'Property not found',
            platforms: [existsInPlatform, missingInPlatform],
            location: property.name,
            severity: 'error',
        };
    }
    /**
     * Generate a human-readable property string
     */
    generatePropertyString(property) {
        const required = property.required ? '' : '?';
        const defaultVal = property.defaultValue !== undefined ? ` = ${JSON.stringify(property.defaultValue)}` : '';
        return `${property.name}${required}: ${property.type}${defaultVal}`;
    }
    /**
     * Compare property names across platforms
     */
    comparePropertyNames(properties, otherProperties) {
        const firstNames = new Set(properties.map(p => p.name));
        const secondNames = new Set(otherProperties.map(p => p.name));
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
     * Get property type statistics across platforms
     */
    getPropertyTypeStatistics(properties) {
        const typeDistribution = {};
        let requiredCount = 0;
        let optionalCount = 0;
        let withDefaultsCount = 0;
        for (const property of properties) {
            // Count required vs optional
            if (property.required) {
                requiredCount++;
            }
            else {
                optionalCount++;
            }
            // Count properties with defaults
            if (property.defaultValue !== undefined) {
                withDefaultsCount++;
            }
            // Track type distribution
            typeDistribution[property.type] = (typeDistribution[property.type] || 0) + 1;
        }
        return {
            totalProperties: properties.length,
            requiredCount,
            optionalCount,
            withDefaultsCount,
            typeDistribution,
        };
    }
}
exports.PropertyTypeValidator = PropertyTypeValidator;
//# sourceMappingURL=PropertyTypeValidator.js.map