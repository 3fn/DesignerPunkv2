"use strict";
/**
 * IValidator Interface Tests
 *
 * Tests to verify the IValidator interface contract and helper functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const IValidator_1 = require("../IValidator");
describe('IValidator Interface', () => {
    describe('Interface Contract', () => {
        it('should allow synchronous validator implementation', () => {
            // Arrange
            class SyncValidator {
                constructor() {
                    this.name = 'SyncValidator';
                }
                validate(input) {
                    return {
                        level: 'Pass',
                        token: `value-${input}`,
                        message: 'Validation passed',
                        rationale: 'Input is valid',
                        mathematicalReasoning: `Value ${input} meets criteria`
                    };
                }
            }
            const validator = new SyncValidator();
            // Act
            const result = validator.validate(8);
            // Assert
            expect(validator.name).toBe('SyncValidator');
            expect(result.level).toBe('Pass');
            expect(result.token).toBe('value-8');
            expect(result.message).toBe('Validation passed');
        });
        it('should allow asynchronous validator implementation', async () => {
            // Arrange
            class AsyncValidator {
                constructor() {
                    this.name = 'AsyncValidator';
                }
                async validate(input) {
                    // Simulate async operation
                    await new Promise(resolve => setTimeout(resolve, 10));
                    return {
                        level: 'Pass',
                        token: input,
                        message: 'Async validation passed',
                        rationale: 'Input is valid after async check',
                        mathematicalReasoning: 'Async validation confirmed'
                    };
                }
            }
            const validator = new AsyncValidator();
            // Act
            const result = await validator.validate('test-token');
            // Assert
            expect(validator.name).toBe('AsyncValidator');
            expect(result.level).toBe('Pass');
            expect(result.token).toBe('test-token');
        });
        it('should support polymorphic validator usage', async () => {
            // Arrange
            class ValidatorA {
                constructor() {
                    this.name = 'ValidatorA';
                }
                validate(input) {
                    return {
                        level: 'Pass',
                        token: `${input}`,
                        message: 'A validated',
                        rationale: 'Valid',
                        mathematicalReasoning: 'Math A'
                    };
                }
            }
            class ValidatorB {
                constructor() {
                    this.name = 'ValidatorB';
                }
                validate(input) {
                    return {
                        level: 'Warning',
                        token: `${input}`,
                        message: 'B validated',
                        rationale: 'Valid with warning',
                        mathematicalReasoning: 'Math B'
                    };
                }
            }
            const validators = [
                new ValidatorA(),
                new ValidatorB()
            ];
            // Act
            const results = await Promise.all(validators.map(async (v) => {
                const result = v.validate(8);
                if (result === null) {
                    return {
                        level: 'Pass',
                        token: 'test',
                        message: 'No issues found',
                        rationale: 'Validation passed',
                        mathematicalReasoning: 'No issues detected'
                    };
                }
                if (result instanceof Promise) {
                    const resolved = await result;
                    if (resolved === null) {
                        return {
                            level: 'Pass',
                            token: 'test',
                            message: 'No issues found',
                            rationale: 'Validation passed',
                            mathematicalReasoning: 'No issues detected'
                        };
                    }
                    return resolved;
                }
                return result;
            }));
            // Assert
            expect(results).toHaveLength(2);
            expect(results[0].level).toBe('Pass');
            expect(results[1].level).toBe('Warning');
        });
    });
    describe('ValidationResult Structure', () => {
        it('should support all required fields', () => {
            // Arrange
            const result = {
                level: 'Pass',
                token: 'test-token',
                message: 'Test message',
                rationale: 'Test rationale',
                mathematicalReasoning: 'Test reasoning'
            };
            // Assert
            expect(result.level).toBe('Pass');
            expect(result.token).toBe('test-token');
            expect(result.message).toBe('Test message');
            expect(result.rationale).toBe('Test rationale');
            expect(result.mathematicalReasoning).toBe('Test reasoning');
        });
        it('should support optional fields', () => {
            // Arrange
            const result = {
                level: 'Error',
                token: 'test-token',
                message: 'Test message',
                rationale: 'Test rationale',
                mathematicalReasoning: 'Test reasoning',
                suggestions: ['Suggestion 1', 'Suggestion 2'],
                errors: ['Error 1'],
                warnings: ['Warning 1'],
                valid: false
            };
            // Assert
            expect(result.suggestions).toHaveLength(2);
            expect(result.errors).toHaveLength(1);
            expect(result.warnings).toHaveLength(1);
            expect(result.valid).toBe(false);
        });
        it('should support all validation levels', () => {
            // Arrange
            const levels = ['Pass', 'Warning', 'Error'];
            // Act & Assert
            levels.forEach(level => {
                const result = {
                    level,
                    token: 'test',
                    message: 'Test',
                    rationale: 'Test',
                    mathematicalReasoning: 'Test'
                };
                expect(result.level).toBe(level);
            });
        });
    });
    describe('Helper Functions', () => {
        describe('isPromiseValidationResult', () => {
            it('should return true for Promise<ValidationResult>', () => {
                // Arrange
                const promiseResult = Promise.resolve({
                    level: 'Pass',
                    token: 'test',
                    message: 'Test',
                    rationale: 'Test',
                    mathematicalReasoning: 'Test'
                });
                // Act & Assert
                expect((0, IValidator_1.isPromiseValidationResult)(promiseResult)).toBe(true);
            });
            it('should return false for ValidationResult', () => {
                // Arrange
                const result = {
                    level: 'Pass',
                    token: 'test',
                    message: 'Test',
                    rationale: 'Test',
                    mathematicalReasoning: 'Test'
                };
                // Act & Assert
                expect((0, IValidator_1.isPromiseValidationResult)(result)).toBe(false);
            });
        });
        describe('awaitValidationResult', () => {
            it('should handle synchronous ValidationResult', async () => {
                // Arrange
                const result = {
                    level: 'Pass',
                    token: 'test',
                    message: 'Test',
                    rationale: 'Test',
                    mathematicalReasoning: 'Test'
                };
                // Act
                const awaited = await (0, IValidator_1.awaitValidationResult)(result);
                // Assert
                expect(awaited).toEqual(result);
            });
            it('should handle Promise<ValidationResult>', async () => {
                // Arrange
                const result = {
                    level: 'Pass',
                    token: 'test',
                    message: 'Test',
                    rationale: 'Test',
                    mathematicalReasoning: 'Test'
                };
                const promiseResult = Promise.resolve(result);
                // Act
                const awaited = await (0, IValidator_1.awaitValidationResult)(promiseResult);
                // Assert
                expect(awaited).toEqual(result);
            });
        });
    });
    describe('Type Safety', () => {
        it('should enforce type safety for input parameter', () => {
            class TypedValidator {
                constructor() {
                    this.name = 'TypedValidator';
                }
                validate(input) {
                    return {
                        level: 'Pass',
                        token: input.name,
                        message: `Validated ${input.value}`,
                        rationale: 'Type-safe validation',
                        mathematicalReasoning: `Value: ${input.value}`
                    };
                }
            }
            const validator = new TypedValidator();
            // Act
            const result = validator.validate({ value: 8, name: 'test' });
            // Assert
            expect(result.token).toBe('test');
            expect(result.message).toBe('Validated 8');
        });
        it('should support generic any type for flexible validators', () => {
            // Arrange
            class FlexibleValidator {
                constructor() {
                    this.name = 'FlexibleValidator';
                }
                validate(input) {
                    return {
                        level: 'Pass',
                        token: String(input),
                        message: 'Flexible validation',
                        rationale: 'Accepts any input',
                        mathematicalReasoning: 'Generic validation'
                    };
                }
            }
            const validator = new FlexibleValidator();
            // Act
            const result1 = validator.validate(8);
            const result2 = validator.validate('test');
            const result3 = validator.validate({ key: 'value' });
            // Assert
            expect(result1.token).toBe('8');
            expect(result2.token).toBe('test');
            expect(result3.token).toBe('[object Object]');
        });
    });
});
//# sourceMappingURL=IValidator.test.js.map