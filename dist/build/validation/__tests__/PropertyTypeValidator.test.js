"use strict";
/**
 * Property Type Validator Tests
 *
 * Tests for property type validation across platforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PropertyTypeValidator_1 = require("../PropertyTypeValidator");
describe('PropertyTypeValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new PropertyTypeValidator_1.PropertyTypeValidator();
    });
    describe('validateProperties', () => {
        it('should validate matching properties across platforms', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'isEnabled', type: 'Bool', required: false, defaultValue: true },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'isEnabled', type: 'Bool', required: false, defaultValue: true },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.comparisonCount).toBe(2);
        });
        it('should detect missing properties', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'subtitle', type: 'String', required: false },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('property_mismatch');
            expect(result.errors[0].message).toContain('subtitle');
            expect(result.errors[0].message).toContain('exists in ios but not in android');
        });
        it('should detect extra properties in other platform', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'description', type: 'String', required: false },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('property_mismatch');
            expect(result.errors[0].message).toContain('description');
            expect(result.errors[0].message).toContain('exists in android but not in ios');
        });
        it('should detect type mismatches', () => {
            const iosProperties = [
                { name: 'count', type: 'Int', required: true },
            ];
            const androidProperties = [
                { name: 'count', type: 'String', required: true },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('type_mismatch');
            expect(result.errors[0].message).toContain('count');
            expect(result.errors[0].message).toContain('Int');
            expect(result.errors[0].message).toContain('String');
            expect(result.errors[0].expected).toBe('Int');
            expect(result.errors[0].actual).toBe('String');
        });
        it('should detect required flag mismatches', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: false },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('property_mismatch');
            expect(result.errors[0].message).toContain('required mismatch');
            expect(result.errors[0].message).toContain('ios=true');
            expect(result.errors[0].message).toContain('android=false');
        });
        it('should detect default value presence mismatches', () => {
            const iosProperties = [
                { name: 'isEnabled', type: 'Bool', required: false, defaultValue: true },
            ];
            const androidProperties = [
                { name: 'isEnabled', type: 'Bool', required: false },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('property_mismatch');
            expect(result.errors[0].message).toContain('default value mismatch');
        });
        it('should detect different default values', () => {
            const iosProperties = [
                { name: 'count', type: 'Int', required: false, defaultValue: 10 },
            ];
            const androidProperties = [
                { name: 'count', type: 'Int', required: false, defaultValue: 20 },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('property_mismatch');
            expect(result.errors[0].message).toContain('different default values');
            expect(result.errors[0].message).toContain('10');
            expect(result.errors[0].message).toContain('20');
        });
        it('should handle multiple errors for same property', () => {
            const iosProperties = [
                { name: 'value', type: 'Int', required: true, defaultValue: 5 },
            ];
            const androidProperties = [
                { name: 'value', type: 'String', required: false, defaultValue: '10' },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(1);
            const errorTypes = result.errors.map(e => e.type);
            expect(errorTypes).toContain('type_mismatch');
            expect(errorTypes).toContain('property_mismatch');
        });
        it('should handle empty property lists', () => {
            const result = validator.validateProperties([], [], 'ios', 'android');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.comparisonCount).toBe(0);
        });
        it('should handle complex default values', () => {
            const iosProperties = [
                {
                    name: 'config',
                    type: 'Object',
                    required: false,
                    defaultValue: { enabled: true, count: 5 }
                },
            ];
            const androidProperties = [
                {
                    name: 'config',
                    type: 'Object',
                    required: false,
                    defaultValue: { enabled: true, count: 5 }
                },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect differences in complex default values', () => {
            const iosProperties = [
                {
                    name: 'config',
                    type: 'Object',
                    required: false,
                    defaultValue: { enabled: true, count: 5 }
                },
            ];
            const androidProperties = [
                {
                    name: 'config',
                    type: 'Object',
                    required: false,
                    defaultValue: { enabled: false, count: 10 }
                },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('different default values');
        });
    });
    describe('generatePropertyString', () => {
        it('should generate string for required property', () => {
            const property = {
                name: 'title',
                type: 'String',
                required: true,
            };
            const result = validator.generatePropertyString(property);
            expect(result).toBe('title: String');
        });
        it('should generate string for optional property', () => {
            const property = {
                name: 'subtitle',
                type: 'String',
                required: false,
            };
            const result = validator.generatePropertyString(property);
            expect(result).toBe('subtitle?: String');
        });
        it('should generate string for property with default value', () => {
            const property = {
                name: 'count',
                type: 'Int',
                required: false,
                defaultValue: 10,
            };
            const result = validator.generatePropertyString(property);
            expect(result).toBe('count?: Int = 10');
        });
        it('should generate string for property with complex default value', () => {
            const property = {
                name: 'config',
                type: 'Object',
                required: false,
                defaultValue: { enabled: true },
            };
            const result = validator.generatePropertyString(property);
            expect(result).toBe('config?: Object = {"enabled":true}');
        });
    });
    describe('comparePropertyNames', () => {
        it('should identify matching property names', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'count', type: 'Int', required: true },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'count', type: 'Int', required: true },
            ];
            const result = validator.comparePropertyNames(iosProperties, androidProperties);
            expect(result.matching).toEqual(['title', 'count']);
            expect(result.onlyInFirst).toEqual([]);
            expect(result.onlyInSecond).toEqual([]);
        });
        it('should identify properties only in first platform', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'iosOnly', type: 'String', required: false },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
            ];
            const result = validator.comparePropertyNames(iosProperties, androidProperties);
            expect(result.matching).toEqual(['title']);
            expect(result.onlyInFirst).toEqual(['iosOnly']);
            expect(result.onlyInSecond).toEqual([]);
        });
        it('should identify properties only in second platform', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'androidOnly', type: 'String', required: false },
            ];
            const result = validator.comparePropertyNames(iosProperties, androidProperties);
            expect(result.matching).toEqual(['title']);
            expect(result.onlyInFirst).toEqual([]);
            expect(result.onlyInSecond).toEqual(['androidOnly']);
        });
        it('should handle empty property lists', () => {
            const result = validator.comparePropertyNames([], []);
            expect(result.matching).toEqual([]);
            expect(result.onlyInFirst).toEqual([]);
            expect(result.onlyInSecond).toEqual([]);
        });
    });
    describe('getPropertyTypeStatistics', () => {
        it('should calculate statistics for properties', () => {
            const properties = [
                { name: 'title', type: 'String', required: true },
                { name: 'count', type: 'Int', required: true },
                { name: 'isEnabled', type: 'Bool', required: false, defaultValue: true },
                { name: 'description', type: 'String', required: false },
            ];
            const stats = validator.getPropertyTypeStatistics(properties);
            expect(stats.totalProperties).toBe(4);
            expect(stats.requiredCount).toBe(2);
            expect(stats.optionalCount).toBe(2);
            expect(stats.withDefaultsCount).toBe(1);
            expect(stats.typeDistribution).toEqual({
                String: 2,
                Int: 1,
                Bool: 1,
            });
        });
        it('should handle empty property list', () => {
            const stats = validator.getPropertyTypeStatistics([]);
            expect(stats.totalProperties).toBe(0);
            expect(stats.requiredCount).toBe(0);
            expect(stats.optionalCount).toBe(0);
            expect(stats.withDefaultsCount).toBe(0);
            expect(stats.typeDistribution).toEqual({});
        });
        it('should count multiple properties with same type', () => {
            const properties = [
                { name: 'firstName', type: 'String', required: true },
                { name: 'lastName', type: 'String', required: true },
                { name: 'email', type: 'String', required: true },
            ];
            const stats = validator.getPropertyTypeStatistics(properties);
            expect(stats.typeDistribution.String).toBe(3);
        });
    });
    describe('parsePropertyDefinitions', () => {
        it('should throw error for unimplemented parsing', () => {
            expect(() => {
                validator.parsePropertyDefinitions('code', 'ios');
            }).toThrow('Property definition parsing not yet implemented');
        });
    });
    describe('cross-platform validation scenarios', () => {
        it('should validate iOS vs Android properties', () => {
            const iosProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'isEnabled', type: 'Bool', required: false, defaultValue: true },
            ];
            const androidProperties = [
                { name: 'title', type: 'String', required: true },
                { name: 'isEnabled', type: 'Boolean', required: false, defaultValue: true },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors[0].type).toBe('type_mismatch');
            expect(result.errors[0].message).toContain('Bool');
            expect(result.errors[0].message).toContain('Boolean');
        });
        it('should validate iOS vs Web properties', () => {
            const iosProperties = [
                { name: 'onClick', type: '() -> Void', required: true },
            ];
            const webProperties = [
                { name: 'onClick', type: '() => void', required: true },
            ];
            const result = validator.validateProperties(iosProperties, webProperties, 'ios', 'web');
            expect(result.valid).toBe(false);
            expect(result.errors[0].type).toBe('type_mismatch');
        });
        it('should validate Android vs Web properties', () => {
            const androidProperties = [
                { name: 'color', type: 'Color', required: true },
            ];
            const webProperties = [
                { name: 'color', type: 'string', required: true },
            ];
            const result = validator.validateProperties(androidProperties, webProperties, 'android', 'web');
            expect(result.valid).toBe(false);
            expect(result.errors[0].type).toBe('type_mismatch');
        });
    });
    describe('error message quality', () => {
        it('should provide clear error messages with platform context', () => {
            const iosProperties = [
                { name: 'value', type: 'Int', required: true },
            ];
            const androidProperties = [
                { name: 'value', type: 'String', required: false },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            const typeError = result.errors.find(e => e.type === 'type_mismatch');
            expect(typeError?.message).toContain('value');
            expect(typeError?.message).toContain('ios');
            expect(typeError?.message).toContain('android');
            expect(typeError?.platforms).toEqual(['ios', 'android']);
            expect(typeError?.location).toBe('value');
        });
        it('should include expected and actual values in errors', () => {
            const iosProperties = [
                { name: 'count', type: 'Int', required: true },
            ];
            const androidProperties = [
                { name: 'count', type: 'Long', required: true },
            ];
            const result = validator.validateProperties(iosProperties, androidProperties, 'ios', 'android');
            expect(result.errors[0].expected).toBe('Int');
            expect(result.errors[0].actual).toBe('Long');
        });
    });
});
//# sourceMappingURL=PropertyTypeValidator.test.js.map