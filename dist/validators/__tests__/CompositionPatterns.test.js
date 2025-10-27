"use strict";
/**
 * Composition Pattern Validator Tests
 *
 * Comprehensive test coverage for composition pattern validation including
 * semantic-first enforcement, primitive fallback handling, and usage suggestions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const CompositionPatternValidator_1 = require("../CompositionPatternValidator");
const PrimitiveTokenRegistry_1 = require("../../registries/PrimitiveTokenRegistry");
const SemanticTokenRegistry_1 = require("../../registries/SemanticTokenRegistry");
const SemanticToken_1 = require("../../types/SemanticToken");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
(0, globals_1.describe)('CompositionPatternValidator', () => {
    let primitiveRegistry;
    let semanticRegistry;
    let validator;
    (0, globals_1.beforeEach)(() => {
        primitiveRegistry = new PrimitiveTokenRegistry_1.PrimitiveTokenRegistry();
        semanticRegistry = new SemanticTokenRegistry_1.SemanticTokenRegistry(primitiveRegistry);
        validator = new CompositionPatternValidator_1.CompositionPatternValidator(semanticRegistry);
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
        // Register semantic tokens
        const semanticToken = {
            name: 'space.grouped.normal',
            category: SemanticToken_1.SemanticCategory.SPACING,
            primitiveReferences: { default: 'space100' },
            description: 'Normal grouped spacing',
            context: 'Spacing between grouped elements'
        };
        semanticRegistry.register(semanticToken);
    });
    (0, globals_1.describe)('Semantic Token Usage', () => {
        (0, globals_1.it)('should validate semantic token usage as Pass', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(semanticToken, context);
            (0, globals_1.expect)(result.level).toBe('Pass');
            (0, globals_1.expect)(result.message).toContain('follows best practices');
        });
        (0, globals_1.it)('should include context information in validation', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const context = {
                usageContext: 'card',
                propertyType: 'margin',
                level: 'layout'
            };
            const result = validator.validateTokenUsage(semanticToken, context);
            (0, globals_1.expect)(result.rationale).toContain('card');
            (0, globals_1.expect)(result.rationale).toContain('margin');
        });
    });
    (0, globals_1.describe)('Primitive Token Usage', () => {
        (0, globals_1.it)('should warn when using primitive token with semantic alternative', () => {
            const primitiveToken = primitiveRegistry.get('space100');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(primitiveToken, context);
            (0, globals_1.expect)(result.level).toBe('Warning');
            (0, globals_1.expect)(result.message).toContain('Consider using semantic token');
        });
        (0, globals_1.it)('should provide semantic token suggestions', () => {
            const primitiveToken = primitiveRegistry.get('space100');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(primitiveToken, context, {
                provideSuggestions: true
            });
            (0, globals_1.expect)(result.suggestions).toBeDefined();
            (0, globals_1.expect)(result.suggestions?.length).toBeGreaterThan(0);
            (0, globals_1.expect)(result.suggestions?.[0]).toContain('space.grouped.normal');
        });
        (0, globals_1.it)('should allow primitive fallback when no semantic exists', () => {
            const primitiveToken = primitiveRegistry.get('space200');
            const context = {
                usageContext: 'custom',
                propertyType: 'gap',
                level: 'layout'
            };
            const result = validator.validateTokenUsage(primitiveToken, context);
            (0, globals_1.expect)(result.level).toBe('Pass');
            (0, globals_1.expect)(result.message).toContain('acceptable');
            (0, globals_1.expect)(result.message).toContain('no semantic alternative');
        });
        (0, globals_1.it)('should not provide suggestions when disabled', () => {
            const primitiveToken = primitiveRegistry.get('space100');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(primitiveToken, context, {
                provideSuggestions: false
            });
            (0, globals_1.expect)(result.suggestions).toBeUndefined();
        });
    });
    (0, globals_1.describe)('Validation Options', () => {
        (0, globals_1.it)('should enforce semantic-first by default', () => {
            const primitiveToken = primitiveRegistry.get('space100');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(primitiveToken, context);
            (0, globals_1.expect)(result.level).toBe('Warning');
        });
        (0, globals_1.it)('should allow disabling semantic-first enforcement', () => {
            const primitiveToken = primitiveRegistry.get('space100');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(primitiveToken, context, {
                enforceSemanticFirst: false
            });
            (0, globals_1.expect)(result.level).toBe('Pass');
        });
        (0, globals_1.it)('should error when primitive fallback not allowed', () => {
            const primitiveToken = primitiveRegistry.get('space200');
            const context = {
                usageContext: 'custom',
                propertyType: 'gap',
                level: 'layout'
            };
            const result = validator.validateTokenUsage(primitiveToken, context, {
                allowPrimitiveFallback: false
            });
            (0, globals_1.expect)(result.level).toBe('Error');
            (0, globals_1.expect)(result.message).toContain('not allowed');
        });
    });
    (0, globals_1.describe)('Multiple Token Composition', () => {
        (0, globals_1.it)('should validate composition of multiple tokens', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const primitiveToken = primitiveRegistry.get('space200');
            const tokens = [
                {
                    token: semanticToken,
                    context: {
                        usageContext: 'button',
                        propertyType: 'padding',
                        level: 'component'
                    }
                },
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'layout',
                        propertyType: 'gap',
                        level: 'layout'
                    }
                }
            ];
            const results = validator.validateComposition(tokens);
            (0, globals_1.expect)(results).toHaveLength(2);
            (0, globals_1.expect)(results[0].level).toBe('Pass');
            (0, globals_1.expect)(results[1].level).toBe('Pass');
        });
    });
    (0, globals_1.describe)('Composition Statistics', () => {
        (0, globals_1.it)('should calculate composition statistics', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const primitiveToken = primitiveRegistry.get('space100');
            const tokens = [
                {
                    token: semanticToken,
                    context: {
                        usageContext: 'button',
                        propertyType: 'padding',
                        level: 'component'
                    }
                },
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'card',
                        propertyType: 'margin',
                        level: 'component'
                    }
                }
            ];
            const results = validator.validateComposition(tokens);
            const stats = validator.getCompositionStats(results);
            (0, globals_1.expect)(stats.total).toBe(2);
            (0, globals_1.expect)(stats.semanticUsage).toBe(1);
            (0, globals_1.expect)(stats.primitiveUsage).toBe(1);
            (0, globals_1.expect)(stats.semanticFirstPercentage).toBe(50);
        });
        (0, globals_1.it)('should track warnings and errors in statistics', () => {
            const primitiveToken = primitiveRegistry.get('space100');
            const tokens = [
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'button',
                        propertyType: 'padding',
                        level: 'component'
                    }
                },
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'card',
                        propertyType: 'margin',
                        level: 'component'
                    }
                }
            ];
            const results = validator.validateComposition(tokens);
            const stats = validator.getCompositionStats(results);
            (0, globals_1.expect)(stats.warnings).toBe(2);
            (0, globals_1.expect)(stats.errors).toBe(0);
        });
        (0, globals_1.it)('should handle empty composition results', () => {
            const stats = validator.getCompositionStats([]);
            (0, globals_1.expect)(stats.total).toBe(0);
            (0, globals_1.expect)(stats.semanticFirstPercentage).toBe(0);
        });
    });
    (0, globals_1.describe)('Semantic Token Suggestions', () => {
        (0, globals_1.it)('should suggest semantic tokens for spacing context', () => {
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const suggestions = validator.suggestSemanticToken(context);
            (0, globals_1.expect)(suggestions.length).toBeGreaterThan(0);
            (0, globals_1.expect)(suggestions[0].category).toBe(SemanticToken_1.SemanticCategory.SPACING);
        });
        (0, globals_1.it)('should suggest semantic tokens for color context', () => {
            // Register color primitive and semantic
            const purple300 = {
                name: 'purple300',
                category: PrimitiveToken_1.TokenCategory.COLOR,
                baseValue: 0,
                familyBaseValue: 0,
                description: 'Purple 300',
                mathematicalRelationship: 'color scale',
                baselineGridAlignment: false,
                isStrategicFlexibility: false,
                isPrecisionTargeted: false,
                platforms: {
                    web: { value: '#A78BFA', unit: 'hex' },
                    ios: { value: '#A78BFA', unit: 'hex' },
                    android: { value: '#A78BFA', unit: 'hex' }
                }
            };
            primitiveRegistry.register(purple300);
            const colorToken = {
                name: 'color.primary',
                category: SemanticToken_1.SemanticCategory.COLOR,
                primitiveReferences: { default: 'purple300' },
                description: 'Primary color',
                context: 'Primary actions'
            };
            semanticRegistry.register(colorToken);
            const context = {
                usageContext: 'button',
                propertyType: 'color',
                level: 'component'
            };
            const suggestions = validator.suggestSemanticToken(context);
            (0, globals_1.expect)(suggestions.length).toBeGreaterThan(0);
            (0, globals_1.expect)(suggestions[0].category).toBe(SemanticToken_1.SemanticCategory.COLOR);
        });
        (0, globals_1.it)('should return empty array for unknown property types', () => {
            const context = {
                usageContext: 'button',
                propertyType: 'unknown',
                level: 'component'
            };
            const suggestions = validator.suggestSemanticToken(context);
            (0, globals_1.expect)(suggestions).toHaveLength(0);
        });
    });
    (0, globals_1.describe)('Context-Aware Validation', () => {
        (0, globals_1.it)('should validate component-level usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(semanticToken, context);
            (0, globals_1.expect)(result.rationale).toContain('button');
            (0, globals_1.expect)(result.rationale).toContain('padding');
        });
        (0, globals_1.it)('should validate layout-level usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const context = {
                usageContext: 'grid',
                propertyType: 'gap',
                level: 'layout'
            };
            const result = validator.validateTokenUsage(semanticToken, context);
            (0, globals_1.expect)(result.rationale).toContain('grid');
            (0, globals_1.expect)(result.rationale).toContain('gap');
        });
        (0, globals_1.it)('should validate global-level usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const context = {
                usageContext: 'theme',
                propertyType: 'spacing',
                level: 'global'
            };
            const result = validator.validateTokenUsage(semanticToken, context);
            (0, globals_1.expect)(result.rationale).toContain('theme');
            (0, globals_1.expect)(result.rationale).toContain('spacing');
        });
    });
    (0, globals_1.describe)('Mathematical Reasoning', () => {
        (0, globals_1.it)('should provide mathematical reasoning for semantic usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal');
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component'
            };
            const result = validator.validateTokenUsage(semanticToken, context);
            (0, globals_1.expect)(result.mathematicalReasoning).toContain('mathematical consistency');
        });
        (0, globals_1.it)('should provide mathematical reasoning for primitive fallback', () => {
            const primitiveToken = primitiveRegistry.get('space200');
            const context = {
                usageContext: 'custom',
                propertyType: 'gap',
                level: 'layout'
            };
            const result = validator.validateTokenUsage(primitiveToken, context);
            (0, globals_1.expect)(result.mathematicalReasoning).toContain('acceptable');
        });
    });
});
//# sourceMappingURL=CompositionPatterns.test.js.map