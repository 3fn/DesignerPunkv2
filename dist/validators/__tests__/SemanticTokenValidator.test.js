"use strict";
/**
 * Semantic Token Validator Tests
 *
 * Comprehensive test coverage for semantic token validation including
 * primitive reference validation, composition patterns, and validation statistics.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const SemanticTokenValidator_1 = require("../SemanticTokenValidator");
const PrimitiveTokenRegistry_1 = require("../../registries/PrimitiveTokenRegistry");
const SemanticTokenRegistry_1 = require("../../registries/SemanticTokenRegistry");
const SemanticToken_1 = require("../../types/SemanticToken");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
(0, globals_1.describe)('SemanticTokenValidator', () => {
    let primitiveRegistry;
    let semanticRegistry;
    let validator;
    (0, globals_1.beforeEach)(() => {
        primitiveRegistry = new PrimitiveTokenRegistry_1.PrimitiveTokenRegistry();
        semanticRegistry = new SemanticTokenRegistry_1.SemanticTokenRegistry(primitiveRegistry);
        validator = new SemanticTokenValidator_1.SemanticTokenValidator(primitiveRegistry, semanticRegistry);
        // Register test primitive tokens
        const space100 = {
            name: 'space100',
            category: PrimitiveToken_1.TokenCategory.SPACING,
            baseValue: 8,
            familyBaseValue: 8,
            description: 'Base spacing',
            mathematicalRelationship: 'base × 1',
            baselineGridAlignment: true,
            isStrategicFlexibility: false,
            isPrecisionTargeted: false,
            platforms: {
                web: { value: 8, unit: 'px' },
                ios: { value: 8, unit: 'pt' },
                android: { value: 8, unit: 'dp' }
            }
        };
        const space200 = {
            name: 'space200',
            category: PrimitiveToken_1.TokenCategory.SPACING,
            baseValue: 16,
            familyBaseValue: 8,
            description: 'Double spacing',
            mathematicalRelationship: 'base × 2',
            baselineGridAlignment: true,
            isStrategicFlexibility: false,
            isPrecisionTargeted: false,
            platforms: {
                web: { value: 16, unit: 'px' },
                ios: { value: 16, unit: 'pt' },
                android: { value: 16, unit: 'dp' }
            }
        };
        primitiveRegistry.register(space100);
        primitiveRegistry.register(space200);
    });
    (0, globals_1.describe)('Comprehensive Validation', () => {
        (0, globals_1.it)('should validate semantic token with valid primitive reference', () => {
            const semanticToken = {
                name: 'space.grouped.normal',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Normal grouped spacing',
                context: 'Spacing between grouped elements'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Pass');
            (0, globals_1.expect)(result.primitiveReferences?.level).toBe('Pass');
            (0, globals_1.expect)(result.details.hasValidReferences).toBe(true);
            (0, globals_1.expect)(result.details.referenceCount).toBe(1);
        });
        (0, globals_1.it)('should validate semantic token with multiple primitive references', () => {
            const semanticToken = {
                name: 'space.multi',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: {
                    horizontal: 'space100',
                    vertical: 'space200'
                },
                description: 'Multi-reference spacing',
                context: 'Different horizontal and vertical spacing'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Pass');
            (0, globals_1.expect)(result.details.referenceCount).toBe(2);
            (0, globals_1.expect)(result.details.hasValidReferences).toBe(true);
        });
        (0, globals_1.it)('should detect invalid primitive references', () => {
            const semanticToken = {
                name: 'space.invalid',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'nonexistent' },
                description: 'Invalid reference',
                context: 'Test invalid'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Error');
            (0, globals_1.expect)(result.primitiveReferences?.level).toBe('Error');
            (0, globals_1.expect)(result.primitiveReferences?.message).toContain('non-existent');
            (0, globals_1.expect)(result.details.hasValidReferences).toBe(false);
        });
        (0, globals_1.it)('should detect missing primitive references', () => {
            const semanticToken = {
                name: 'space.empty',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: {},
                description: 'Empty references',
                context: 'Test empty'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Error');
            (0, globals_1.expect)(result.primitiveReferences?.message).toContain('must reference primitive tokens');
        });
        (0, globals_1.it)('should allow empty references with allowEmptyReferences option', () => {
            const semanticToken = {
                name: 'space.empty',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: {},
                description: 'Empty references',
                context: 'Test empty'
            };
            const result = validator.validate(semanticToken, { allowEmptyReferences: true });
            (0, globals_1.expect)(result.overall.level).toBe('Warning');
            (0, globals_1.expect)(result.primitiveReferences?.level).toBe('Warning');
        });
        (0, globals_1.it)('should validate semantic token structure', () => {
            const semanticToken = {
                name: 'space.valid',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Valid structure',
                context: 'Test structure'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.compositionPattern?.level).toBe('Pass');
            (0, globals_1.expect)(result.compositionPattern?.message).toContain('structure is valid');
        });
        (0, globals_1.it)('should warn about missing description', () => {
            const semanticToken = {
                name: 'space.nodesc',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: '',
                context: 'Test no description'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Warning');
            (0, globals_1.expect)(result.compositionPattern?.level).toBe('Warning');
            (0, globals_1.expect)(result.compositionPattern?.message).toContain('missing description');
        });
        (0, globals_1.it)('should error on missing name', () => {
            const semanticToken = {
                name: '',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Test',
                context: 'Test'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Error');
            (0, globals_1.expect)(result.compositionPattern?.message).toContain('missing required name');
        });
    });
    (0, globals_1.describe)('Validation Options', () => {
        (0, globals_1.it)('should skip primitive reference validation when disabled', () => {
            const semanticToken = {
                name: 'space.skip',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'nonexistent' },
                description: 'Skip validation',
                context: 'Test skip'
            };
            const result = validator.validate(semanticToken, {
                validatePrimitiveReferences: false
            });
            (0, globals_1.expect)(result.primitiveReferences).toBeUndefined();
            (0, globals_1.expect)(result.overall.level).toBe('Pass');
        });
        (0, globals_1.it)('should skip composition pattern validation when disabled', () => {
            const semanticToken = {
                name: '',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Test',
                context: 'Test'
            };
            const result = validator.validate(semanticToken, {
                validateCompositionPatterns: false
            });
            (0, globals_1.expect)(result.compositionPattern).toBeUndefined();
        });
        (0, globals_1.it)('should use strict validation by default', () => {
            const semanticToken = {
                name: 'space.strict',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'nonexistent' },
                description: 'Strict test',
                context: 'Test'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.overall.level).toBe('Error');
        });
    });
    (0, globals_1.describe)('Multiple Token Validation', () => {
        (0, globals_1.it)('should validate multiple semantic tokens', () => {
            const tokens = [
                {
                    name: 'space.valid1',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space100' },
                    description: 'Valid 1',
                    context: 'Test'
                },
                {
                    name: 'space.valid2',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space200' },
                    description: 'Valid 2',
                    context: 'Test'
                },
                {
                    name: 'space.invalid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'nonexistent' },
                    description: 'Invalid',
                    context: 'Test'
                }
            ];
            const results = validator.validateMultiple(tokens);
            (0, globals_1.expect)(results).toHaveLength(3);
            (0, globals_1.expect)(results[0].overall.level).toBe('Pass');
            (0, globals_1.expect)(results[1].overall.level).toBe('Pass');
            (0, globals_1.expect)(results[2].overall.level).toBe('Error');
        });
    });
    (0, globals_1.describe)('Validation Statistics', () => {
        (0, globals_1.it)('should calculate validation statistics', () => {
            const tokens = [
                {
                    name: 'space.pass1',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space100' },
                    description: 'Pass 1',
                    context: 'Test'
                },
                {
                    name: 'space.pass2',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space200' },
                    description: 'Pass 2',
                    context: 'Test'
                },
                {
                    name: 'space.warning',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space100' },
                    description: '',
                    context: 'Test'
                },
                {
                    name: 'space.error',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'nonexistent' },
                    description: 'Error',
                    context: 'Test'
                }
            ];
            const results = validator.validateMultiple(tokens);
            const stats = validator.getValidationStats(results);
            (0, globals_1.expect)(stats.total).toBe(4);
            (0, globals_1.expect)(stats.passed).toBe(2);
            (0, globals_1.expect)(stats.warnings).toBe(1);
            (0, globals_1.expect)(stats.errors).toBe(1);
            (0, globals_1.expect)(stats.passRate).toBe(50);
        });
        (0, globals_1.it)('should track valid references in statistics', () => {
            const tokens = [
                {
                    name: 'space.valid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space100' },
                    description: 'Valid',
                    context: 'Test'
                },
                {
                    name: 'space.invalid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'nonexistent' },
                    description: 'Invalid',
                    context: 'Test'
                }
            ];
            const results = validator.validateMultiple(tokens);
            const stats = validator.getValidationStats(results);
            (0, globals_1.expect)(stats.withValidReferences).toBe(1);
        });
        (0, globals_1.it)('should handle empty validation results', () => {
            const stats = validator.getValidationStats([]);
            (0, globals_1.expect)(stats.total).toBe(0);
            (0, globals_1.expect)(stats.passed).toBe(0);
            (0, globals_1.expect)(stats.passRate).toBe(0);
        });
    });
    (0, globals_1.describe)('Validator Access', () => {
        (0, globals_1.it)('should provide access to primitive reference validator', () => {
            const primitiveValidator = validator.getPrimitiveReferenceValidator();
            (0, globals_1.expect)(primitiveValidator).toBeDefined();
            (0, globals_1.expect)(typeof primitiveValidator.validate).toBe('function');
        });
        (0, globals_1.it)('should provide access to composition pattern validator', () => {
            const compositionValidator = validator.getCompositionPatternValidator();
            (0, globals_1.expect)(compositionValidator).toBeDefined();
            (0, globals_1.expect)(typeof compositionValidator.validateTokenUsage).toBe('function');
        });
    });
    (0, globals_1.describe)('Validation Details', () => {
        (0, globals_1.it)('should include validation timestamp in details', () => {
            const semanticToken = {
                name: 'space.test',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Test',
                context: 'Test'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.details.validationTimestamp).toBeInstanceOf(Date);
        });
        (0, globals_1.it)('should track reference count in details', () => {
            const semanticToken = {
                name: 'space.multi',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: {
                    horizontal: 'space100',
                    vertical: 'space200'
                },
                description: 'Multi',
                context: 'Test'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.details.referenceCount).toBe(2);
        });
        (0, globals_1.it)('should indicate when token has valid references', () => {
            const semanticToken = {
                name: 'space.valid',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Valid',
                context: 'Test'
            };
            const result = validator.validate(semanticToken);
            (0, globals_1.expect)(result.details.hasValidReferences).toBe(true);
        });
    });
    (0, globals_1.describe)('validateSemanticReferences', () => {
        (0, globals_1.it)('should validate all semantic tokens with valid references', () => {
            const semantics = [
                {
                    name: 'space.grouped.normal',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { value: 'space100' },
                    description: 'Normal grouped spacing',
                    context: 'Test'
                },
                {
                    name: 'space.grouped.large',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space200' },
                    description: 'Large grouped spacing',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' },
                { name: 'space200' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Pass');
            (0, globals_1.expect)(result.message).toContain('All semantic token references are valid');
            (0, globals_1.expect)(result.message).toContain('2 tokens validated');
        });
        (0, globals_1.it)('should detect invalid single-reference token with value property', () => {
            const semantics = [
                {
                    name: 'space.invalid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { value: 'nonexistent' },
                    description: 'Invalid reference',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.message).toContain('1 invalid semantic token reference');
            (0, globals_1.expect)(result.rationale).toContain("references non-existent primitive 'nonexistent'");
        });
        (0, globals_1.it)('should detect invalid single-reference token with default property', () => {
            const semantics = [
                {
                    name: 'space.invalid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'missing' },
                    description: 'Invalid reference',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.rationale).toContain("references non-existent primitive 'missing'");
        });
        (0, globals_1.it)('should validate typography tokens with all required properties', () => {
            const semantics = [
                {
                    name: 'typography.body',
                    category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                    primitiveReferences: {
                        fontSize: 'fontSize100',
                        lineHeight: 'lineHeight100',
                        fontFamily: 'fontFamily.system',
                        fontWeight: 'fontWeight400',
                        letterSpacing: 'letterSpacing000'
                    },
                    description: 'Body typography',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'fontSize100' },
                { name: 'lineHeight100' },
                { name: 'fontFamily.system' },
                { name: 'fontWeight400' },
                { name: 'letterSpacing000' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Pass');
        });
        (0, globals_1.it)('should detect missing required typography properties', () => {
            const semantics = [
                {
                    name: 'typography.incomplete',
                    category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                    primitiveReferences: {
                        fontSize: 'fontSize100',
                        lineHeight: 'lineHeight100'
                        // Missing fontFamily, fontWeight, letterSpacing
                    },
                    description: 'Incomplete typography',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'fontSize100' },
                { name: 'lineHeight100' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.rationale).toContain('missing required reference: fontFamily');
            (0, globals_1.expect)(result.rationale).toContain('missing required reference: fontWeight');
            (0, globals_1.expect)(result.rationale).toContain('missing required reference: letterSpacing');
        });
        (0, globals_1.it)('should detect invalid typography property references', () => {
            const semantics = [
                {
                    name: 'typography.invalid',
                    category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                    primitiveReferences: {
                        fontSize: 'invalidFontSize',
                        lineHeight: 'lineHeight100',
                        fontFamily: 'fontFamily.system',
                        fontWeight: 'fontWeight400',
                        letterSpacing: 'letterSpacing000'
                    },
                    description: 'Invalid typography',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'fontSize100' },
                { name: 'lineHeight100' },
                { name: 'fontFamily.system' },
                { name: 'fontWeight400' },
                { name: 'letterSpacing000' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.rationale).toContain("has invalid fontSize reference 'invalidFontSize'");
        });
        (0, globals_1.it)('should validate multi-reference tokens (non-typography)', () => {
            const semantics = [
                {
                    name: 'custom.multi',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: {
                        horizontal: 'space100',
                        vertical: 'space200'
                    },
                    description: 'Multi-reference',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' },
                { name: 'space200' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Pass');
        });
        (0, globals_1.it)('should detect invalid multi-reference token properties', () => {
            const semantics = [
                {
                    name: 'custom.invalid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: {
                        horizontal: 'space100',
                        vertical: 'invalidSpace'
                    },
                    description: 'Invalid multi-reference',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.rationale).toContain("has invalid vertical reference 'invalidSpace'");
        });
        (0, globals_1.it)('should skip tokens without primitiveReferences', () => {
            const semantics = [
                {
                    name: 'zIndex.modal',
                    category: SemanticToken_1.SemanticCategory.LAYERING,
                    primitiveReferences: undefined,
                    description: 'Modal z-index',
                    context: 'Test'
                },
                {
                    name: 'space.valid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { value: 'space100' },
                    description: 'Valid spacing',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Pass');
            (0, globals_1.expect)(result.message).toContain('2 tokens validated');
        });
        (0, globals_1.it)('should provide helpful suggestions for invalid references', () => {
            const semantics = [
                {
                    name: 'space.invalid',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { value: 'nonexistent' },
                    description: 'Invalid',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'space100' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.suggestions).toBeDefined();
            (0, globals_1.expect)(result.suggestions).toContain('Verify that all referenced primitive tokens exist in the primitive token registry');
            (0, globals_1.expect)(result.suggestions).toContain('Check for typos in primitive token names');
        });
        (0, globals_1.it)('should handle empty semantic token array', () => {
            const result = validator.validateSemanticReferences([], [{ name: 'space100' }]);
            (0, globals_1.expect)(result.level).toBe('Pass');
            (0, globals_1.expect)(result.message).toContain('0 tokens validated');
        });
        (0, globals_1.it)('should handle multiple invalid references in single token', () => {
            const semantics = [
                {
                    name: 'typography.multipleErrors',
                    category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                    primitiveReferences: {
                        fontSize: 'invalidFontSize',
                        lineHeight: 'invalidLineHeight',
                        fontFamily: 'fontFamily.system',
                        fontWeight: 'fontWeight400',
                        letterSpacing: 'letterSpacing000'
                    },
                    description: 'Multiple errors',
                    context: 'Test'
                }
            ];
            const primitives = [
                { name: 'fontFamily.system' },
                { name: 'fontWeight400' },
                { name: 'letterSpacing000' }
            ];
            const result = validator.validateSemanticReferences(semantics, primitives);
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.message).toContain('2 invalid semantic token reference');
            (0, globals_1.expect)(result.rationale).toContain('invalidFontSize');
            (0, globals_1.expect)(result.rationale).toContain('invalidLineHeight');
        });
    });
});
//# sourceMappingURL=SemanticTokenValidator.test.js.map