"use strict";
/**
 * Semantic Token Integration Tests
 *
 * Tests for semantic token barrel export, utility functions, and registry integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Using Jest (configured in package.json)
const index_1 = require("../index");
const SemanticToken_1 = require("../../../types/SemanticToken");
const SemanticTokenRegistry_1 = require("../../../registries/SemanticTokenRegistry");
const PrimitiveTokenRegistry_1 = require("../../../registries/PrimitiveTokenRegistry");
describe('Semantic Token Barrel Export', () => {
    it('should export color tokens', () => {
        expect(index_1.colorTokens).toBeDefined();
        expect(Object.keys(index_1.colorTokens).length).toBeGreaterThan(0);
    });
    it('should export typography tokens', () => {
        expect(index_1.typographyTokens).toBeDefined();
        expect(Object.keys(index_1.typographyTokens).length).toBeGreaterThan(0);
    });
    it('should export spacing tokens', () => {
        expect(index_1.spacingTokens).toBeDefined();
        expect(index_1.spacingTokens.grouped).toBeDefined();
        expect(index_1.spacingTokens.inset).toBeDefined();
    });
});
describe('getSemanticToken', () => {
    it('should retrieve color tokens by name', () => {
        const token = (0, index_1.getSemanticToken)('color.primary');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.primary');
        expect(token?.category).toBe(SemanticToken_1.SemanticCategory.COLOR);
    });
    it('should retrieve typography tokens by name', () => {
        const token = (0, index_1.getSemanticToken)('typography.bodyMd');
        expect(token).toBeDefined();
        expect(token?.name).toBe('typography.bodyMd');
        expect(token?.category).toBe(SemanticToken_1.SemanticCategory.TYPOGRAPHY);
    });
    it('should retrieve spacing tokens by hierarchical path', () => {
        const token = (0, index_1.getSemanticToken)('space.grouped.normal');
        expect(token).toBeDefined();
        expect(token?.name).toBe('space.grouped.normal');
        expect(token?.category).toBe(SemanticToken_1.SemanticCategory.SPACING);
        expect(token?.primitiveReferences.value).toBe('space100');
    });
    it('should retrieve inset spacing tokens', () => {
        const token = (0, index_1.getSemanticToken)('space.inset.comfortable');
        expect(token).toBeDefined();
        expect(token?.name).toBe('space.inset.comfortable');
        expect(token?.primitiveReferences.value).toBe('space150');
    });
    it('should return undefined for non-existent tokens', () => {
        const token = (0, index_1.getSemanticToken)('color.nonexistent');
        expect(token).toBeUndefined();
    });
    it('should return undefined for invalid spacing paths', () => {
        const token = (0, index_1.getSemanticToken)('space.invalid.path');
        expect(token).toBeUndefined();
    });
});
describe('getAllSemanticTokens', () => {
    it('should return all semantic tokens across categories', () => {
        const tokens = (0, index_1.getAllSemanticTokens)();
        expect(tokens.length).toBeGreaterThan(0);
        // Should include color tokens
        const colorCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.COLOR).length;
        expect(colorCount).toBeGreaterThan(0);
        // Should include typography tokens
        const typographyCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.TYPOGRAPHY).length;
        expect(typographyCount).toBeGreaterThan(0);
        // Should include spacing tokens
        const spacingCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.SPACING).length;
        expect(spacingCount).toBeGreaterThan(0);
    });
    it('should include color, spacing, typography, and border tokens', () => {
        const tokens = (0, index_1.getAllSemanticTokens)();
        // Verify color tokens are included
        const colorTokens = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.COLOR);
        expect(colorTokens.length).toBeGreaterThan(0);
        expect(colorTokens.some(t => t.name === 'color.primary')).toBe(true);
        // Verify spacing tokens are included
        const spacingTokens = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.SPACING);
        expect(spacingTokens.length).toBeGreaterThan(0);
        expect(spacingTokens.some(t => t.name === 'space.grouped.normal')).toBe(true);
        expect(spacingTokens.some(t => t.name === 'space.inset.comfortable')).toBe(true);
        // Verify typography tokens are included
        const typographyTokens = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.TYPOGRAPHY);
        expect(typographyTokens.length).toBeGreaterThan(0);
        expect(typographyTokens.some(t => t.name === 'typography.bodyMd')).toBe(true);
        // Verify border tokens are included
        const borderTokens = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.BORDER);
        expect(borderTokens.length).toBeGreaterThan(0);
        expect(borderTokens.some(t => t.name === 'border.borderDefault')).toBe(true);
    });
    it('should return correct count of semantic tokens', () => {
        const tokens = (0, index_1.getAllSemanticTokens)();
        const stats = (0, index_1.getSemanticTokenStats)();
        // Total count should match stats
        expect(tokens.length).toBe(stats.total);
        // Category counts should match
        const colorCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.COLOR).length;
        expect(colorCount).toBe(stats.colorTokens);
        const typographyCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.TYPOGRAPHY).length;
        expect(typographyCount).toBe(stats.typographyTokens);
        const spacingCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.SPACING).length;
        expect(spacingCount).toBe(stats.spacingTokens);
        const borderCount = tokens.filter(t => t.category === SemanticToken_1.SemanticCategory.BORDER).length;
        expect(borderCount).toBe(stats.borderTokens);
    });
    it('should ensure each token has valid structure', () => {
        const tokens = (0, index_1.getAllSemanticTokens)();
        // Verify every token has required fields
        tokens.forEach(token => {
            expect(token.name).toBeDefined();
            expect(typeof token.name).toBe('string');
            expect(token.name.length).toBeGreaterThan(0);
            expect(token.primitiveReferences).toBeDefined();
            expect(typeof token.primitiveReferences).toBe('object');
            expect(Object.keys(token.primitiveReferences).length).toBeGreaterThan(0);
            expect(token.category).toBeDefined();
            expect(Object.values(SemanticToken_1.SemanticCategory)).toContain(token.category);
            expect(token.context).toBeDefined();
            expect(typeof token.context).toBe('string');
            expect(token.description).toBeDefined();
            expect(typeof token.description).toBe('string');
            // Validate structure using utility function
            const validation = (0, index_1.validateSemanticTokenStructure)(token);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
    });
});
describe('getSemanticTokensByCategory', () => {
    it('should return only color tokens', () => {
        const tokens = (0, index_1.getSemanticTokensByCategory)(SemanticToken_1.SemanticCategory.COLOR);
        expect(tokens.length).toBeGreaterThan(0);
        expect(tokens.every(t => t.category === SemanticToken_1.SemanticCategory.COLOR)).toBe(true);
    });
    it('should return only typography tokens', () => {
        const tokens = (0, index_1.getSemanticTokensByCategory)(SemanticToken_1.SemanticCategory.TYPOGRAPHY);
        expect(tokens.length).toBeGreaterThan(0);
        expect(tokens.every(t => t.category === SemanticToken_1.SemanticCategory.TYPOGRAPHY)).toBe(true);
    });
    it('should return only spacing tokens', () => {
        const tokens = (0, index_1.getSemanticTokensByCategory)(SemanticToken_1.SemanticCategory.SPACING);
        expect(tokens.length).toBeGreaterThan(0);
        expect(tokens.every(t => t.category === SemanticToken_1.SemanticCategory.SPACING)).toBe(true);
    });
});
describe('validateSemanticTokenStructure', () => {
    it('should validate correct token structure', () => {
        const token = (0, index_1.getSemanticToken)('color.primary');
        expect(token).toBeDefined();
        const result = (0, index_1.validateSemanticTokenStructure)(token);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    it('should detect missing name', () => {
        const invalidToken = {
            primitiveReferences: { value: 'purple300' },
            category: SemanticToken_1.SemanticCategory.COLOR,
            context: 'test',
            description: 'test'
        };
        const result = (0, index_1.validateSemanticTokenStructure)(invalidToken);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Token must have a valid name');
    });
    it('should detect missing primitive references', () => {
        const invalidToken = {
            name: 'test.token',
            category: SemanticToken_1.SemanticCategory.COLOR,
            context: 'test',
            description: 'test'
        };
        const result = (0, index_1.validateSemanticTokenStructure)(invalidToken);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Token must have primitiveReferences object');
    });
    it('should detect empty primitive references', () => {
        const invalidToken = {
            name: 'test.token',
            primitiveReferences: {},
            category: SemanticToken_1.SemanticCategory.COLOR,
            context: 'test',
            description: 'test'
        };
        const result = (0, index_1.validateSemanticTokenStructure)(invalidToken);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Token must reference at least one primitive token');
    });
});
describe('getSpacingRecommendation', () => {
    it('should recommend inset spacing tokens', () => {
        const recommendations = (0, index_1.getSpacingRecommendation)('inset');
        expect(recommendations).toContain('space.inset.tight');
        expect(recommendations).toContain('space.inset.normal');
        expect(recommendations).toContain('space.inset.comfortable');
        expect(recommendations).toContain('space.inset.spacious');
        expect(recommendations).toContain('space.inset.expansive');
    });
    it('should recommend layout spacing tokens', () => {
        const recommendations = (0, index_1.getSpacingRecommendation)('layout');
        expect(recommendations.length).toBeGreaterThan(0);
        expect(recommendations.some(r => r.startsWith('space.grouped'))).toBe(true);
        expect(recommendations.some(r => r.startsWith('space.related'))).toBe(true);
        expect(recommendations.some(r => r.startsWith('space.separated'))).toBe(true);
        expect(recommendations.some(r => r.startsWith('space.sectioned'))).toBe(true);
    });
    it('should filter layout recommendations by density', () => {
        const recommendations = (0, index_1.getSpacingRecommendation)('layout', 'tight');
        expect(recommendations.every(r => r.endsWith('.tight'))).toBe(true);
    });
});
describe('getTypographyRecommendation', () => {
    it('should recommend heading tokens', () => {
        const recommendations = (0, index_1.getTypographyRecommendation)('heading');
        expect(recommendations).toContain('typography.h1');
        expect(recommendations).toContain('typography.h2');
        expect(recommendations).toContain('typography.h3');
        expect(recommendations).toContain('typography.display');
    });
    it('should recommend body tokens', () => {
        const recommendations = (0, index_1.getTypographyRecommendation)('body');
        expect(recommendations).toContain('typography.bodyMd');
        expect(recommendations).toContain('typography.bodySm');
        expect(recommendations).toContain('typography.bodyLg');
    });
    it('should recommend UI tokens', () => {
        const recommendations = (0, index_1.getTypographyRecommendation)('ui');
        expect(recommendations).toContain('typography.buttonMd');
        expect(recommendations).toContain('typography.input');
        expect(recommendations).toContain('typography.label');
    });
    it('should recommend specialized tokens', () => {
        const recommendations = (0, index_1.getTypographyRecommendation)('specialized');
        expect(recommendations).toContain('typography.caption');
        expect(recommendations).toContain('typography.legal');
    });
});
describe('getSemanticTokenStats', () => {
    it('should return accurate statistics', () => {
        const stats = (0, index_1.getSemanticTokenStats)();
        expect(stats.total).toBeGreaterThan(0);
        expect(stats.colorTokens).toBeGreaterThan(0);
        expect(stats.typographyTokens).toBeGreaterThan(0);
        expect(stats.spacingTokens).toBeGreaterThan(0);
        expect(stats.byCategory).toBeDefined();
    });
    it('should count tokens by category', () => {
        const stats = (0, index_1.getSemanticTokenStats)();
        expect(stats.byCategory[SemanticToken_1.SemanticCategory.COLOR]).toBe(stats.colorTokens);
        expect(stats.byCategory[SemanticToken_1.SemanticCategory.TYPOGRAPHY]).toBe(stats.typographyTokens);
        expect(stats.byCategory[SemanticToken_1.SemanticCategory.SPACING]).toBe(stats.spacingTokens);
    });
});
describe('SemanticTokenRegistry Integration', () => {
    let primitiveRegistry;
    let semanticRegistry;
    beforeEach(() => {
        primitiveRegistry = new PrimitiveTokenRegistry_1.PrimitiveTokenRegistry();
        semanticRegistry = new SemanticTokenRegistry_1.SemanticTokenRegistry(primitiveRegistry);
    });
    it('should register color semantic tokens', () => {
        const token = (0, index_1.getSemanticToken)('color.primary');
        expect(token).toBeDefined();
        // Note: This will fail validation because primitive tokens aren't registered
        // This is expected - just testing the structure
        const result = semanticRegistry.validateToken({
            ...token,
            primitiveTokens: {}
        });
        expect(result).toBeDefined();
        expect(result.token).toBe('color.primary');
    });
    it('should register typography semantic tokens', () => {
        const token = (0, index_1.getSemanticToken)('typography.bodyMd');
        expect(token).toBeDefined();
        const result = semanticRegistry.validateToken({
            ...token,
            primitiveTokens: {}
        });
        expect(result).toBeDefined();
        expect(result.token).toBe('typography.bodyMd');
    });
    it('should handle hierarchical spacing token registration', () => {
        const token = (0, index_1.getSemanticToken)('space.grouped.normal');
        expect(token).toBeDefined();
        const result = semanticRegistry.validateToken({
            ...token,
            primitiveTokens: {}
        });
        expect(result).toBeDefined();
        expect(result.token).toBe('space.grouped.normal');
    });
});
//# sourceMappingURL=SemanticTokenIntegration.test.js.map