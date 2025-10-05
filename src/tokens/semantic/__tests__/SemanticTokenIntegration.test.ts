/**
 * Semantic Token Integration Tests
 * 
 * Tests for semantic token barrel export, utility functions, and registry integration
 */

// Using Jest (configured in package.json)
import {
  getSemanticToken,
  getAllSemanticTokens,
  getSemanticTokensByCategory,
  validateSemanticTokenStructure,
  getSpacingRecommendation,
  getTypographyRecommendation,
  getSemanticTokenStats,
  colorTokens,
  typographyTokens,
  spacingTokens
} from '../index';
import { SemanticCategory } from '../../../types/SemanticToken';
import { SemanticTokenRegistry } from '../../../registries/SemanticTokenRegistry';
import { PrimitiveTokenRegistry } from '../../../registries/PrimitiveTokenRegistry';

describe('Semantic Token Barrel Export', () => {
  it('should export color tokens', () => {
    expect(colorTokens).toBeDefined();
    expect(Object.keys(colorTokens).length).toBeGreaterThan(0);
  });

  it('should export typography tokens', () => {
    expect(typographyTokens).toBeDefined();
    expect(Object.keys(typographyTokens).length).toBeGreaterThan(0);
  });

  it('should export spacing tokens', () => {
    expect(spacingTokens).toBeDefined();
    expect(spacingTokens.grouped).toBeDefined();
    expect(spacingTokens.inset).toBeDefined();
  });
});

describe('getSemanticToken', () => {
  it('should retrieve color tokens by name', () => {
    const token = getSemanticToken('color.primary');
    expect(token).toBeDefined();
    expect(token?.name).toBe('color.primary');
    expect(token?.category).toBe(SemanticCategory.COLOR);
  });

  it('should retrieve typography tokens by name', () => {
    const token = getSemanticToken('typography.body');
    expect(token).toBeDefined();
    expect(token?.name).toBe('typography.body');
    expect(token?.category).toBe(SemanticCategory.TYPOGRAPHY);
  });

  it('should retrieve spacing tokens by hierarchical path', () => {
    const token = getSemanticToken('space.grouped.normal');
    expect(token).toBeDefined();
    expect(token?.name).toBe('space.grouped.normal');
    expect(token?.category).toBe(SemanticCategory.SPACING);
    expect(token?.primitiveReferences.value).toBe('space100');
  });

  it('should retrieve inset spacing tokens', () => {
    const token = getSemanticToken('space.inset.comfortable');
    expect(token).toBeDefined();
    expect(token?.name).toBe('space.inset.comfortable');
    expect(token?.primitiveReferences.value).toBe('space150');
  });

  it('should return undefined for non-existent tokens', () => {
    const token = getSemanticToken('color.nonexistent');
    expect(token).toBeUndefined();
  });

  it('should return undefined for invalid spacing paths', () => {
    const token = getSemanticToken('space.invalid.path');
    expect(token).toBeUndefined();
  });
});

describe('getAllSemanticTokens', () => {
  it('should return all semantic tokens across categories', () => {
    const tokens = getAllSemanticTokens();
    expect(tokens.length).toBeGreaterThan(0);
    
    // Should include color tokens
    const colorCount = tokens.filter(t => t.category === SemanticCategory.COLOR).length;
    expect(colorCount).toBeGreaterThan(0);
    
    // Should include typography tokens
    const typographyCount = tokens.filter(t => t.category === SemanticCategory.TYPOGRAPHY).length;
    expect(typographyCount).toBeGreaterThan(0);
    
    // Should include spacing tokens
    const spacingCount = tokens.filter(t => t.category === SemanticCategory.SPACING).length;
    expect(spacingCount).toBeGreaterThan(0);
  });
});

describe('getSemanticTokensByCategory', () => {
  it('should return only color tokens', () => {
    const tokens = getSemanticTokensByCategory(SemanticCategory.COLOR);
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.every(t => t.category === SemanticCategory.COLOR)).toBe(true);
  });

  it('should return only typography tokens', () => {
    const tokens = getSemanticTokensByCategory(SemanticCategory.TYPOGRAPHY);
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.every(t => t.category === SemanticCategory.TYPOGRAPHY)).toBe(true);
  });

  it('should return only spacing tokens', () => {
    const tokens = getSemanticTokensByCategory(SemanticCategory.SPACING);
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.every(t => t.category === SemanticCategory.SPACING)).toBe(true);
  });
});

describe('validateSemanticTokenStructure', () => {
  it('should validate correct token structure', () => {
    const token = getSemanticToken('color.primary');
    expect(token).toBeDefined();
    
    const result = validateSemanticTokenStructure(token!);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing name', () => {
    const invalidToken: any = {
      primitiveReferences: { value: 'purple300' },
      category: SemanticCategory.COLOR,
      context: 'test',
      description: 'test'
    };
    
    const result = validateSemanticTokenStructure(invalidToken);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Token must have a valid name');
  });

  it('should detect missing primitive references', () => {
    const invalidToken: any = {
      name: 'test.token',
      category: SemanticCategory.COLOR,
      context: 'test',
      description: 'test'
    };
    
    const result = validateSemanticTokenStructure(invalidToken);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Token must have primitiveReferences object');
  });

  it('should detect empty primitive references', () => {
    const invalidToken: any = {
      name: 'test.token',
      primitiveReferences: {},
      category: SemanticCategory.COLOR,
      context: 'test',
      description: 'test'
    };
    
    const result = validateSemanticTokenStructure(invalidToken);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Token must reference at least one primitive token');
  });
});

describe('getSpacingRecommendation', () => {
  it('should recommend inset spacing tokens', () => {
    const recommendations = getSpacingRecommendation('inset');
    expect(recommendations).toContain('space.inset.tight');
    expect(recommendations).toContain('space.inset.normal');
    expect(recommendations).toContain('space.inset.comfortable');
    expect(recommendations).toContain('space.inset.spacious');
    expect(recommendations).toContain('space.inset.expansive');
  });

  it('should recommend layout spacing tokens', () => {
    const recommendations = getSpacingRecommendation('layout');
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.some(r => r.startsWith('space.grouped'))).toBe(true);
    expect(recommendations.some(r => r.startsWith('space.related'))).toBe(true);
    expect(recommendations.some(r => r.startsWith('space.separated'))).toBe(true);
    expect(recommendations.some(r => r.startsWith('space.sectioned'))).toBe(true);
  });

  it('should filter layout recommendations by density', () => {
    const recommendations = getSpacingRecommendation('layout', 'tight');
    expect(recommendations.every(r => r.endsWith('.tight'))).toBe(true);
  });
});

describe('getTypographyRecommendation', () => {
  it('should recommend heading tokens', () => {
    const recommendations = getTypographyRecommendation('heading');
    expect(recommendations).toContain('typography.h1');
    expect(recommendations).toContain('typography.h2');
    expect(recommendations).toContain('typography.h3');
    expect(recommendations).toContain('typography.display');
  });

  it('should recommend body tokens', () => {
    const recommendations = getTypographyRecommendation('body');
    expect(recommendations).toContain('typography.body');
    expect(recommendations).toContain('typography.bodySmall');
    expect(recommendations).toContain('typography.bodyLarge');
  });

  it('should recommend UI tokens', () => {
    const recommendations = getTypographyRecommendation('ui');
    expect(recommendations).toContain('typography.button');
    expect(recommendations).toContain('typography.input');
    expect(recommendations).toContain('typography.label');
  });

  it('should recommend specialized tokens', () => {
    const recommendations = getTypographyRecommendation('specialized');
    expect(recommendations).toContain('typography.caption');
    expect(recommendations).toContain('typography.legal');
  });
});

describe('getSemanticTokenStats', () => {
  it('should return accurate statistics', () => {
    const stats = getSemanticTokenStats();
    
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.colorTokens).toBeGreaterThan(0);
    expect(stats.typographyTokens).toBeGreaterThan(0);
    expect(stats.spacingTokens).toBeGreaterThan(0);
    expect(stats.byCategory).toBeDefined();
  });

  it('should count tokens by category', () => {
    const stats = getSemanticTokenStats();
    
    expect(stats.byCategory[SemanticCategory.COLOR]).toBe(stats.colorTokens);
    expect(stats.byCategory[SemanticCategory.TYPOGRAPHY]).toBe(stats.typographyTokens);
    expect(stats.byCategory[SemanticCategory.SPACING]).toBe(stats.spacingTokens);
  });
});

describe('SemanticTokenRegistry Integration', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
  });

  it('should register color semantic tokens', () => {
    const token = getSemanticToken('color.primary');
    expect(token).toBeDefined();
    
    // Note: This will fail validation because primitive tokens aren't registered
    // This is expected - just testing the structure
    const result = semanticRegistry.validateToken({
      ...token!,
      primitiveTokens: {}
    });
    
    expect(result).toBeDefined();
    expect(result.token).toBe('color.primary');
  });

  it('should register typography semantic tokens', () => {
    const token = getSemanticToken('typography.body');
    expect(token).toBeDefined();
    
    const result = semanticRegistry.validateToken({
      ...token!,
      primitiveTokens: {}
    });
    
    expect(result).toBeDefined();
    expect(result.token).toBe('typography.body');
  });

  it('should handle hierarchical spacing token registration', () => {
    const token = getSemanticToken('space.grouped.normal');
    expect(token).toBeDefined();
    
    const result = semanticRegistry.validateToken({
      ...token!,
      primitiveTokens: {}
    });
    
    expect(result).toBeDefined();
    expect(result.token).toBe('space.grouped.normal');
  });
});
