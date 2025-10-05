/**
 * Composition Pattern Validator Tests
 * 
 * Comprehensive test coverage for composition pattern validation including
 * semantic-first enforcement, primitive fallback handling, and usage suggestions.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { CompositionPatternValidator } from '../CompositionPatternValidator';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';
import { TokenCategory } from '../../types/PrimitiveToken';
import type { PrimitiveToken } from '../../types/PrimitiveToken';

describe('CompositionPatternValidator', () => {
    let primitiveRegistry: PrimitiveTokenRegistry;
    let semanticRegistry: SemanticTokenRegistry;
    let validator: CompositionPatternValidator;

    beforeEach(() => {
        primitiveRegistry = new PrimitiveTokenRegistry();
        semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
        validator = new CompositionPatternValidator(semanticRegistry);

        // Register test primitive tokens
        const space100: PrimitiveToken = {
            name: 'space100',
            category: TokenCategory.SPACING,
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

        const space200: PrimitiveToken = {
            name: 'space200',
            category: TokenCategory.SPACING,
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
        const semanticToken: SemanticToken = {
            name: 'space.grouped.normal',
            category: SemanticCategory.SPACING,
            primitiveReferences: { default: 'space100' },
            description: 'Normal grouped spacing',
            context: 'Spacing between grouped elements'
        };

        semanticRegistry.register(semanticToken);
    });

    describe('Semantic Token Usage', () => {
        it('should validate semantic token usage as Pass', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(semanticToken, context);

            expect(result.level).toBe('Pass');
            expect(result.message).toContain('follows best practices');
        });

        it('should include context information in validation', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const context = {
                usageContext: 'card',
                propertyType: 'margin',
                level: 'layout' as const
            };

            const result = validator.validateTokenUsage(semanticToken, context);

            expect(result.rationale).toContain('card');
            expect(result.rationale).toContain('margin');
        });
    });

    describe('Primitive Token Usage', () => {
        it('should warn when using primitive token with semantic alternative', () => {
            const primitiveToken = primitiveRegistry.get('space100')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context);

            expect(result.level).toBe('Warning');
            expect(result.message).toContain('Consider using semantic token');
        });

        it('should provide semantic token suggestions', () => {
            const primitiveToken = primitiveRegistry.get('space100')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context, {
                provideSuggestions: true
            });

            expect(result.suggestions).toBeDefined();
            expect(result.suggestions?.length).toBeGreaterThan(0);
            expect(result.suggestions?.[0]).toContain('space.grouped.normal');
        });

        it('should allow primitive fallback when no semantic exists', () => {
            const primitiveToken = primitiveRegistry.get('space200')!;
            const context = {
                usageContext: 'custom',
                propertyType: 'gap',
                level: 'layout' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context);

            expect(result.level).toBe('Pass');
            expect(result.message).toContain('acceptable');
            expect(result.message).toContain('no semantic alternative');
        });

        it('should not provide suggestions when disabled', () => {
            const primitiveToken = primitiveRegistry.get('space100')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context, {
                provideSuggestions: false
            });

            expect(result.suggestions).toBeUndefined();
        });
    });

    describe('Validation Options', () => {
        it('should enforce semantic-first by default', () => {
            const primitiveToken = primitiveRegistry.get('space100')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context);

            expect(result.level).toBe('Warning');
        });

        it('should allow disabling semantic-first enforcement', () => {
            const primitiveToken = primitiveRegistry.get('space100')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context, {
                enforceSemanticFirst: false
            });

            expect(result.level).toBe('Pass');
        });

        it('should error when primitive fallback not allowed', () => {
            const primitiveToken = primitiveRegistry.get('space200')!;
            const context = {
                usageContext: 'custom',
                propertyType: 'gap',
                level: 'layout' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context, {
                allowPrimitiveFallback: false
            });

            expect(result.level).toBe('Error');
            expect(result.message).toContain('not allowed');
        });
    });

    describe('Multiple Token Composition', () => {
        it('should validate composition of multiple tokens', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const primitiveToken = primitiveRegistry.get('space200')!;

            const tokens = [
                {
                    token: semanticToken,
                    context: {
                        usageContext: 'button',
                        propertyType: 'padding',
                        level: 'component' as const
                    }
                },
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'layout',
                        propertyType: 'gap',
                        level: 'layout' as const
                    }
                }
            ];

            const results = validator.validateComposition(tokens);

            expect(results).toHaveLength(2);
            expect(results[0].level).toBe('Pass');
            expect(results[1].level).toBe('Pass');
        });
    });

    describe('Composition Statistics', () => {
        it('should calculate composition statistics', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const primitiveToken = primitiveRegistry.get('space100')!;

            const tokens = [
                {
                    token: semanticToken,
                    context: {
                        usageContext: 'button',
                        propertyType: 'padding',
                        level: 'component' as const
                    }
                },
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'card',
                        propertyType: 'margin',
                        level: 'component' as const
                    }
                }
            ];

            const results = validator.validateComposition(tokens);
            const stats = validator.getCompositionStats(results);

            expect(stats.total).toBe(2);
            expect(stats.semanticUsage).toBe(1);
            expect(stats.primitiveUsage).toBe(1);
            expect(stats.semanticFirstPercentage).toBe(50);
        });

        it('should track warnings and errors in statistics', () => {
            const primitiveToken = primitiveRegistry.get('space100')!;

            const tokens = [
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'button',
                        propertyType: 'padding',
                        level: 'component' as const
                    }
                },
                {
                    token: primitiveToken,
                    context: {
                        usageContext: 'card',
                        propertyType: 'margin',
                        level: 'component' as const
                    }
                }
            ];

            const results = validator.validateComposition(tokens);
            const stats = validator.getCompositionStats(results);

            expect(stats.warnings).toBe(2);
            expect(stats.errors).toBe(0);
        });

        it('should handle empty composition results', () => {
            const stats = validator.getCompositionStats([]);

            expect(stats.total).toBe(0);
            expect(stats.semanticFirstPercentage).toBe(0);
        });
    });

    describe('Semantic Token Suggestions', () => {
        it('should suggest semantic tokens for spacing context', () => {
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const suggestions = validator.suggestSemanticToken(context);

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].category).toBe(SemanticCategory.SPACING);
        });

        it('should suggest semantic tokens for color context', () => {
            // Register color primitive and semantic
            const purple300: PrimitiveToken = {
                name: 'purple300',
                category: TokenCategory.COLOR,
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

            const colorToken: SemanticToken = {
                name: 'color.primary',
                category: SemanticCategory.COLOR,
                primitiveReferences: { default: 'purple300' },
                description: 'Primary color',
                context: 'Primary actions'
            };

            semanticRegistry.register(colorToken);

            const context = {
                usageContext: 'button',
                propertyType: 'color',
                level: 'component' as const
            };

            const suggestions = validator.suggestSemanticToken(context);

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].category).toBe(SemanticCategory.COLOR);
        });

        it('should return empty array for unknown property types', () => {
            const context = {
                usageContext: 'button',
                propertyType: 'unknown',
                level: 'component' as const
            };

            const suggestions = validator.suggestSemanticToken(context);

            expect(suggestions).toHaveLength(0);
        });
    });

    describe('Context-Aware Validation', () => {
        it('should validate component-level usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(semanticToken, context);

            expect(result.rationale).toContain('button');
            expect(result.rationale).toContain('padding');
        });

        it('should validate layout-level usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const context = {
                usageContext: 'grid',
                propertyType: 'gap',
                level: 'layout' as const
            };

            const result = validator.validateTokenUsage(semanticToken, context);

            expect(result.rationale).toContain('grid');
            expect(result.rationale).toContain('gap');
        });

        it('should validate global-level usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const context = {
                usageContext: 'theme',
                propertyType: 'spacing',
                level: 'global' as const
            };

            const result = validator.validateTokenUsage(semanticToken, context);

            expect(result.rationale).toContain('theme');
            expect(result.rationale).toContain('spacing');
        });
    });

    describe('Mathematical Reasoning', () => {
        it('should provide mathematical reasoning for semantic usage', () => {
            const semanticToken = semanticRegistry.get('space.grouped.normal')!;
            const context = {
                usageContext: 'button',
                propertyType: 'padding',
                level: 'component' as const
            };

            const result = validator.validateTokenUsage(semanticToken, context);

            expect(result.mathematicalReasoning).toContain('mathematical consistency');
        });

        it('should provide mathematical reasoning for primitive fallback', () => {
            const primitiveToken = primitiveRegistry.get('space200')!;
            const context = {
                usageContext: 'custom',
                propertyType: 'gap',
                level: 'layout' as const
            };

            const result = validator.validateTokenUsage(primitiveToken, context);

            expect(result.mathematicalReasoning).toContain('acceptable');
        });
    });
});
