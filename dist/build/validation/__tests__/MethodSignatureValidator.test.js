"use strict";
/**
 * Method Signature Validator Tests
 *
 * Tests for method signature validation across platforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
const MethodSignatureValidator_1 = require("../MethodSignatureValidator");
describe('MethodSignatureValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new MethodSignatureValidator_1.MethodSignatureValidator();
    });
    describe('validateMethodSignatures', () => {
        it('should validate matching method signatures', () => {
            const iosMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.comparisonCount).toBe(1);
        });
        it('should detect missing methods', () => {
            const iosMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
                {
                    name: 'onHover',
                    parameters: [],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('method_mismatch');
            expect(result.errors[0].message).toContain('onHover');
            expect(result.errors[0].message).toContain('exists in ios but not in android');
        });
        it('should detect extra methods in other platform', () => {
            const iosMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
                {
                    name: 'onLongPress',
                    parameters: [],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('method_mismatch');
            expect(result.errors[0].message).toContain('onLongPress');
            expect(result.errors[0].message).toContain('exists in android but not in ios');
        });
        it('should detect return type mismatches', () => {
            const iosMethods = [
                {
                    name: 'getValue',
                    parameters: [],
                    returnType: 'string',
                },
            ];
            const androidMethods = [
                {
                    name: 'getValue',
                    parameters: [],
                    returnType: 'number',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('return_type_mismatch');
            expect(result.errors[0].message).toContain('getValue');
            expect(result.errors[0].message).toContain('different return types');
            expect(result.errors[0].expected).toBe('string');
            expect(result.errors[0].actual).toBe('number');
        });
        it('should detect parameter count mismatches', () => {
            const iosMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                        { name: 'options', type: 'object', required: false },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('method_mismatch');
            expect(result.errors[0].message).toContain('different parameter counts');
            expect(result.errors[0].expected).toBe('1 parameters');
            expect(result.errors[0].actual).toBe('2 parameters');
        });
        it('should detect parameter name mismatches', () => {
            const iosMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'newValue', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('parameter_mismatch');
            expect(result.errors[0].message).toContain('different names');
            expect(result.errors[0].expected).toBe('value');
            expect(result.errors[0].actual).toBe('newValue');
        });
        it('should detect parameter type mismatches', () => {
            const iosMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'number', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('parameter_mismatch');
            expect(result.errors[0].message).toContain('different types');
            expect(result.errors[0].expected).toBe('string');
            expect(result.errors[0].actual).toBe('number');
        });
        it('should detect parameter required flag mismatches', () => {
            const iosMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: false },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('parameter_mismatch');
            expect(result.errors[0].message).toContain('required mismatch');
        });
        it('should detect parameter default value mismatches', () => {
            const iosMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: false, defaultValue: 'default' },
                    ],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: false, defaultValue: 'other' },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].type).toBe('parameter_mismatch');
            expect(result.errors[0].message).toContain('different default values');
        });
        it('should validate complex method signatures', () => {
            const iosMethods = [
                {
                    name: 'updateUser',
                    parameters: [
                        { name: 'id', type: 'string', required: true },
                        { name: 'name', type: 'string', required: true },
                        { name: 'email', type: 'string', required: false, defaultValue: null },
                        { name: 'options', type: 'object', required: false },
                    ],
                    returnType: 'Promise<User>',
                },
            ];
            const androidMethods = [
                {
                    name: 'updateUser',
                    parameters: [
                        { name: 'id', type: 'string', required: true },
                        { name: 'name', type: 'string', required: true },
                        { name: 'email', type: 'string', required: false, defaultValue: null },
                        { name: 'options', type: 'object', required: false },
                    ],
                    returnType: 'Promise<User>',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should handle multiple method validations', () => {
            const iosMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
                {
                    name: 'getValue',
                    parameters: [],
                    returnType: 'string',
                },
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const androidMethods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
                {
                    name: 'getValue',
                    parameters: [],
                    returnType: 'number', // Mismatch
                },
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.validateMethodSignatures(iosMethods, androidMethods, 'ios', 'android');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.comparisonCount).toBe(3);
        });
    });
    describe('generateMethodSignatureString', () => {
        it('should generate string for method with no parameters', () => {
            const method = {
                name: 'onClick',
                parameters: [],
                returnType: 'void',
            };
            const result = validator.generateMethodSignatureString(method);
            expect(result).toBe('onClick(): void');
        });
        it('should generate string for method with required parameters', () => {
            const method = {
                name: 'setValue',
                parameters: [
                    { name: 'value', type: 'string', required: true },
                ],
                returnType: 'void',
            };
            const result = validator.generateMethodSignatureString(method);
            expect(result).toBe('setValue(value: string): void');
        });
        it('should generate string for method with optional parameters', () => {
            const method = {
                name: 'setValue',
                parameters: [
                    { name: 'value', type: 'string', required: false },
                ],
                returnType: 'void',
            };
            const result = validator.generateMethodSignatureString(method);
            expect(result).toBe('setValue(value?: string): void');
        });
        it('should generate string for method with default values', () => {
            const method = {
                name: 'setValue',
                parameters: [
                    { name: 'value', type: 'string', required: false, defaultValue: 'default' },
                ],
                returnType: 'void',
            };
            const result = validator.generateMethodSignatureString(method);
            expect(result).toBe('setValue(value?: string = "default"): void');
        });
        it('should generate string for complex method signature', () => {
            const method = {
                name: 'updateUser',
                parameters: [
                    { name: 'id', type: 'string', required: true },
                    { name: 'name', type: 'string', required: true },
                    { name: 'email', type: 'string', required: false, defaultValue: null },
                ],
                returnType: 'Promise<User>',
            };
            const result = validator.generateMethodSignatureString(method);
            expect(result).toBe('updateUser(id: string, name: string, email?: string = null): Promise<User>');
        });
    });
    describe('compareMethodNames', () => {
        it('should identify matching method names', () => {
            const methods1 = [
                { name: 'onClick', parameters: [], returnType: 'void' },
                { name: 'getValue', parameters: [], returnType: 'string' },
            ];
            const methods2 = [
                { name: 'onClick', parameters: [], returnType: 'void' },
                { name: 'getValue', parameters: [], returnType: 'string' },
            ];
            const result = validator.compareMethodNames(methods1, methods2);
            expect(result.matching).toEqual(['onClick', 'getValue']);
            expect(result.onlyInFirst).toEqual([]);
            expect(result.onlyInSecond).toEqual([]);
        });
        it('should identify methods only in first set', () => {
            const methods1 = [
                { name: 'onClick', parameters: [], returnType: 'void' },
                { name: 'onHover', parameters: [], returnType: 'void' },
            ];
            const methods2 = [
                { name: 'onClick', parameters: [], returnType: 'void' },
            ];
            const result = validator.compareMethodNames(methods1, methods2);
            expect(result.matching).toEqual(['onClick']);
            expect(result.onlyInFirst).toEqual(['onHover']);
            expect(result.onlyInSecond).toEqual([]);
        });
        it('should identify methods only in second set', () => {
            const methods1 = [
                { name: 'onClick', parameters: [], returnType: 'void' },
            ];
            const methods2 = [
                { name: 'onClick', parameters: [], returnType: 'void' },
                { name: 'onLongPress', parameters: [], returnType: 'void' },
            ];
            const result = validator.compareMethodNames(methods1, methods2);
            expect(result.matching).toEqual(['onClick']);
            expect(result.onlyInFirst).toEqual([]);
            expect(result.onlyInSecond).toEqual(['onLongPress']);
        });
    });
    describe('getMethodSignatureStatistics', () => {
        it('should calculate statistics for empty method list', () => {
            const methods = [];
            const result = validator.getMethodSignatureStatistics(methods);
            expect(result.totalMethods).toBe(0);
            expect(result.averageParameterCount).toBe(0);
            expect(result.returnTypeDistribution).toEqual({});
            expect(result.parameterTypeDistribution).toEqual({});
        });
        it('should calculate statistics for methods', () => {
            const methods = [
                {
                    name: 'onClick',
                    parameters: [],
                    returnType: 'void',
                },
                {
                    name: 'getValue',
                    parameters: [],
                    returnType: 'string',
                },
                {
                    name: 'setValue',
                    parameters: [
                        { name: 'value', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.getMethodSignatureStatistics(methods);
            expect(result.totalMethods).toBe(3);
            expect(result.averageParameterCount).toBeCloseTo(0.33, 2);
            expect(result.returnTypeDistribution).toEqual({
                void: 2,
                string: 1,
            });
            expect(result.parameterTypeDistribution).toEqual({
                string: 1,
            });
        });
        it('should track parameter type distribution', () => {
            const methods = [
                {
                    name: 'updateUser',
                    parameters: [
                        { name: 'id', type: 'string', required: true },
                        { name: 'age', type: 'number', required: true },
                        { name: 'active', type: 'boolean', required: false },
                    ],
                    returnType: 'void',
                },
                {
                    name: 'deleteUser',
                    parameters: [
                        { name: 'id', type: 'string', required: true },
                    ],
                    returnType: 'void',
                },
            ];
            const result = validator.getMethodSignatureStatistics(methods);
            expect(result.totalMethods).toBe(2);
            expect(result.averageParameterCount).toBe(2);
            expect(result.parameterTypeDistribution).toEqual({
                string: 2,
                number: 1,
                boolean: 1,
            });
        });
    });
    describe('parseMethodSignatures', () => {
        it('should throw error for unimplemented parsing', () => {
            expect(() => {
                validator.parseMethodSignatures('code', 'ios');
            }).toThrow('Method signature parsing not yet implemented');
        });
    });
});
//# sourceMappingURL=MethodSignatureValidator.test.js.map