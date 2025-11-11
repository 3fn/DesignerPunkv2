"use strict";
/**
 * Semantic Token Registry Tests
 *
 * Comprehensive test coverage for semantic token registration, validation,
 * retrieval, and mode-aware color resolution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const SemanticTokenRegistry_1 = require("../SemanticTokenRegistry");
const PrimitiveTokenRegistry_1 = require("../PrimitiveTokenRegistry");
const SemanticToken_1 = require("../../types/SemanticToken");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
(0, globals_1.describe)('SemanticTokenRegistry', () => {
    let primitiveRegistry;
    let semanticRegistry;
    (0, globals_1.beforeEach)(() => {
        primitiveRegistry = new PrimitiveTokenRegistry_1.PrimitiveTokenRegistry();
        semanticRegistry = new SemanticTokenRegistry_1.SemanticTokenRegistry(primitiveRegistry);
        // Register test primitive tokens
        const space100 = {
            name: 'space100',
            category: PrimitiveToken_1.TokenCategory.SPACING,
            baseValue: 8,
            familyBaseValue: 8,
            description: 'Base spacing unit',
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
            description: 'Double spacing unit',
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
                web: {
                    value: {
                        light: { base: '#A78BFA', wcag: '#8B5CF6' },
                        dark: { base: '#A78BFA', wcag: '#C4B5FD' }
                    },
                    unit: 'hex'
                },
                ios: {
                    value: {
                        light: { base: '#A78BFA', wcag: '#8B5CF6' },
                        dark: { base: '#A78BFA', wcag: '#C4B5FD' }
                    },
                    unit: 'hex'
                },
                android: {
                    value: {
                        light: { base: '#A78BFA', wcag: '#8B5CF6' },
                        dark: { base: '#A78BFA', wcag: '#C4B5FD' }
                    },
                    unit: 'hex'
                }
            }
        };
        primitiveRegistry.register(space100);
        primitiveRegistry.register(space200);
        primitiveRegistry.register(purple300);
    });
    (0, globals_1.describe)('Token Registration', () => {
        (0, globals_1.it)('should register a valid semantic token', () => {
            const semanticToken = {
                name: 'space.grouped.normal',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Normal grouped spacing',
                context: 'Spacing between elements in the same logical group'
            };
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken)).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.has('space.grouped.normal')).toBe(true);
        });
        (0, globals_1.it)('should register semantic token even with invalid primitive reference (validation moved to validators)', () => {
            const semanticToken = {
                name: 'space.invalid',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'nonexistent' },
                description: 'Invalid spacing',
                context: 'Test invalid reference'
            };
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken)).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.has('space.invalid')).toBe(true);
        });
        (0, globals_1.it)('should reject duplicate semantic token registration', () => {
            const semanticToken = {
                name: 'space.duplicate',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Duplicate test',
                context: 'Test duplicate'
            };
            semanticRegistry.register(semanticToken);
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken)).toThrow('already registered');
        });
        (0, globals_1.it)('should allow overwrite with allowOverwrite option', () => {
            const semanticToken = {
                name: 'space.overwrite',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Original',
                context: 'Original context'
            };
            semanticRegistry.register(semanticToken);
            const updatedToken = {
                ...semanticToken,
                description: 'Updated',
                primitiveReferences: { default: 'space200' }
            };
            (0, globals_1.expect)(() => semanticRegistry.register(updatedToken, { allowOverwrite: true })).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.get('space.overwrite')?.description).toBe('Updated');
        });
        (0, globals_1.it)('should skip validation when skipValidation is true', () => {
            const semanticToken = {
                name: 'space.skip',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'nonexistent' },
                description: 'Skip validation test',
                context: 'Test skip'
            };
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken, { skipValidation: true })).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.has('space.skip')).toBe(true);
        });
    });
    (0, globals_1.describe)('Token Retrieval', () => {
        (0, globals_1.beforeEach)(() => {
            const tokens = [
                {
                    name: 'space.grouped.tight',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space100' },
                    description: 'Tight grouped spacing',
                    context: 'Tight grouping'
                },
                {
                    name: 'space.grouped.normal',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space200' },
                    description: 'Normal grouped spacing',
                    context: 'Normal grouping'
                },
                {
                    name: 'color.primary',
                    category: SemanticToken_1.SemanticCategory.COLOR,
                    primitiveReferences: { default: 'purple300' },
                    description: 'Primary brand color',
                    context: 'Primary actions'
                }
            ];
            tokens.forEach(token => semanticRegistry.register(token));
        });
        (0, globals_1.it)('should retrieve semantic token by name', () => {
            const token = semanticRegistry.get('space.grouped.tight');
            (0, globals_1.expect)(token).toBeDefined();
            (0, globals_1.expect)(token?.name).toBe('space.grouped.tight');
            (0, globals_1.expect)(token?.category).toBe(SemanticToken_1.SemanticCategory.SPACING);
        });
        (0, globals_1.it)('should return undefined for non-existent token', () => {
            const token = semanticRegistry.get('nonexistent');
            (0, globals_1.expect)(token).toBeUndefined();
        });
        (0, globals_1.it)('should check token existence', () => {
            (0, globals_1.expect)(semanticRegistry.has('space.grouped.tight')).toBe(true);
            (0, globals_1.expect)(semanticRegistry.has('nonexistent')).toBe(false);
        });
        (0, globals_1.it)('should query tokens by category', () => {
            const spacingTokens = semanticRegistry.query({ category: SemanticToken_1.SemanticCategory.SPACING });
            (0, globals_1.expect)(spacingTokens).toHaveLength(2);
            (0, globals_1.expect)(spacingTokens.every(t => t.category === SemanticToken_1.SemanticCategory.SPACING)).toBe(true);
        });
        (0, globals_1.it)('should query and sort tokens by name', () => {
            const tokens = semanticRegistry.query({ sortBy: 'name' });
            (0, globals_1.expect)(tokens[0].name).toBe('color.primary');
            (0, globals_1.expect)(tokens[1].name).toBe('space.grouped.normal');
            (0, globals_1.expect)(tokens[2].name).toBe('space.grouped.tight');
        });
        (0, globals_1.it)('should get tokens by category', () => {
            const colorTokens = semanticRegistry.getByCategory(SemanticToken_1.SemanticCategory.COLOR);
            (0, globals_1.expect)(colorTokens).toHaveLength(1);
            (0, globals_1.expect)(colorTokens[0].name).toBe('color.primary');
        });
    });
    (0, globals_1.describe)('Storage-Only Behavior', () => {
        (0, globals_1.it)('should store semantic tokens without validation (validation moved to validators)', () => {
            const semanticToken = {
                name: 'space.test',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Test spacing',
                context: 'Test'
            };
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken)).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.has('space.test')).toBe(true);
        });
        (0, globals_1.it)('should store semantic tokens with multiple primitive references', () => {
            const semanticToken = {
                name: 'space.multi',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: {
                    horizontal: 'space100',
                    vertical: 'space200'
                },
                description: 'Multi-reference spacing',
                context: 'Test multiple references'
            };
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken)).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.has('space.multi')).toBe(true);
        });
        (0, globals_1.it)('should store tokens even with invalid primitive references (validation moved to validators)', () => {
            const semanticToken = {
                name: 'space.invalid',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'non-existent' },
                description: 'Invalid reference',
                context: 'Test invalid'
            };
            (0, globals_1.expect)(() => semanticRegistry.register(semanticToken)).not.toThrow();
            (0, globals_1.expect)(semanticRegistry.has('space.invalid')).toBe(true);
        });
        (0, globals_1.it)('should register all tokens without validation', () => {
            semanticRegistry.register({
                name: 'space.valid',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Valid',
                context: 'Valid'
            });
            (0, globals_1.expect)(semanticRegistry.query()).toHaveLength(1);
        });
    });
    (0, globals_1.describe)('Mode-Aware Color Resolution', () => {
        (0, globals_1.beforeEach)(() => {
            const colorToken = {
                name: 'color.primary',
                category: SemanticToken_1.SemanticCategory.COLOR,
                primitiveReferences: { default: 'purple300' },
                description: 'Primary color',
                context: 'Primary actions'
            };
            semanticRegistry.register(colorToken);
        });
        (0, globals_1.it)('should resolve light mode base theme color', () => {
            const token = semanticRegistry.get('color.primary');
            const color = semanticRegistry.resolveColorValue(token, {
                mode: 'light',
                theme: 'base'
            });
            (0, globals_1.expect)(color).toBe('#A78BFA');
        });
        (0, globals_1.it)('should resolve light mode WCAG theme color', () => {
            const token = semanticRegistry.get('color.primary');
            const color = semanticRegistry.resolveColorValue(token, {
                mode: 'light',
                theme: 'wcag'
            });
            (0, globals_1.expect)(color).toBe('#8B5CF6');
        });
        (0, globals_1.it)('should resolve dark mode base theme color', () => {
            const token = semanticRegistry.get('color.primary');
            const color = semanticRegistry.resolveColorValue(token, {
                mode: 'dark',
                theme: 'base'
            });
            (0, globals_1.expect)(color).toBe('#A78BFA');
        });
        (0, globals_1.it)('should resolve dark mode WCAG theme color', () => {
            const token = semanticRegistry.get('color.primary');
            const color = semanticRegistry.resolveColorValue(token, {
                mode: 'dark',
                theme: 'wcag'
            });
            (0, globals_1.expect)(color).toBe('#C4B5FD');
        });
        (0, globals_1.it)('should return null for non-color semantic tokens', () => {
            const spacingToken = {
                name: 'space.test',
                category: SemanticToken_1.SemanticCategory.SPACING,
                primitiveReferences: { default: 'space100' },
                description: 'Test',
                context: 'Test'
            };
            semanticRegistry.register(spacingToken);
            const token = semanticRegistry.get('space.test');
            const color = semanticRegistry.resolveColorValue(token, {
                mode: 'light',
                theme: 'base'
            });
            (0, globals_1.expect)(color).toBeNull();
        });
    });
    (0, globals_1.describe)('Registry Management', () => {
        (0, globals_1.beforeEach)(() => {
            const tokens = [
                {
                    name: 'space.test1',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space100' },
                    description: 'Test 1',
                    context: 'Test'
                },
                {
                    name: 'space.test2',
                    category: SemanticToken_1.SemanticCategory.SPACING,
                    primitiveReferences: { default: 'space200' },
                    description: 'Test 2',
                    context: 'Test'
                },
                {
                    name: 'color.test',
                    category: SemanticToken_1.SemanticCategory.COLOR,
                    primitiveReferences: { default: 'purple300' },
                    description: 'Test color',
                    context: 'Test'
                }
            ];
            tokens.forEach(token => semanticRegistry.register(token));
        });
        (0, globals_1.it)('should get registry statistics', () => {
            const stats = semanticRegistry.getStats();
            (0, globals_1.expect)(stats.totalTokens).toBe(3);
            (0, globals_1.expect)(stats.categoryStats[SemanticToken_1.SemanticCategory.SPACING]).toBe(2);
            (0, globals_1.expect)(stats.categoryStats[SemanticToken_1.SemanticCategory.COLOR]).toBe(1);
        });
        (0, globals_1.it)('should remove semantic token', () => {
            const removed = semanticRegistry.remove('space.test1');
            (0, globals_1.expect)(removed).toBe(true);
            (0, globals_1.expect)(semanticRegistry.has('space.test1')).toBe(false);
            (0, globals_1.expect)(semanticRegistry.getStats().totalTokens).toBe(2);
        });
        (0, globals_1.it)('should return false when removing non-existent token', () => {
            const removed = semanticRegistry.remove('nonexistent');
            (0, globals_1.expect)(removed).toBe(false);
        });
        (0, globals_1.it)('should clear all semantic tokens', () => {
            semanticRegistry.clear();
            (0, globals_1.expect)(semanticRegistry.getStats().totalTokens).toBe(0);
            (0, globals_1.expect)(semanticRegistry.has('space.test1')).toBe(false);
        });
        (0, globals_1.it)('should maintain category index after clear', () => {
            semanticRegistry.clear();
            const spacingTokens = semanticRegistry.getByCategory(SemanticToken_1.SemanticCategory.SPACING);
            (0, globals_1.expect)(spacingTokens).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=SemanticTokenRegistry.test.js.map