/**
 * @category evergreen
 * @purpose Verify SemanticTokenIntegration tokens are correctly defined and structured
 */
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
    const token = getSemanticToken('typography.bodyMd');
    expect(token).toBeDefined();
    expect(token?.name).toBe('typography.bodyMd');
    expect(token?.category).toBe(SemanticCategory.TYPOGRAPHY);
  });

  it('should retrieve spacing tokens by hierarchical path', () => {
    const token = getSemanticToken('space.grouped.normal');
    expect(token).toBeDefined();
    expect(token?.name).toBe('space.grouped.normal');
    expect(token?.category).toBe(SemanticCategory.SPACING);
    expect(token?.primitiveReferences.value).toBe('space100');
  });

  it('should retrieve inset spacing tokens with numeric names', () => {
    const token = getSemanticToken('space.inset.150');
    expect(token).toBeDefined();
    expect(token?.name).toBe('space.inset.150');
    expect(token?.primitiveReferences.value).toBe('space150');
  });

  it('should verify all numeric inset token names exist', () => {
    // Test all numeric inset token names (050, 100, 150, 200, 300, 400)
    const numericTokens = ['050', '100', '150', '200', '300', '400'];
    
    numericTokens.forEach(tokenName => {
      const token = getSemanticToken(`space.inset.${tokenName}`);
      expect(token).toBeDefined();
      expect(token?.name).toBe(`space.inset.${tokenName}`);
      expect(token?.category).toBe(SemanticCategory.SPACING);
    });
  });

  it('should verify old synonym names do not exist', () => {
    // Test that old names (tight, normal, comfortable, spacious, expansive, generous) don't exist
    const oldNames = ['tight', 'normal', 'comfortable', 'spacious', 'expansive', 'generous'];
    
    oldNames.forEach(oldName => {
      const token = getSemanticToken(`space.inset.${oldName}`);
      expect(token).toBeUndefined();
    });
  });

  it('should verify inset tokens reference correct primitives', () => {
    // Verify primitive references are unchanged (space050, space100, etc.)
    const tokenMappings = [
      { name: '050', primitive: 'space050' },
      { name: '100', primitive: 'space100' },
      { name: '150', primitive: 'space150' },
      { name: '200', primitive: 'space200' },
      { name: '300', primitive: 'space300' },
      { name: '400', primitive: 'space400' }
    ];
    
    tokenMappings.forEach(({ name, primitive }) => {
      const token = getSemanticToken(`space.inset.${name}`);
      expect(token).toBeDefined();
      expect(token?.primitiveReferences.value).toBe(primitive);
    });
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

  it('should include color, spacing, typography, and border tokens', () => {
    const tokens = getAllSemanticTokens();
    
    // Verify color tokens are included
    const colorTokens = tokens.filter(t => t.category === SemanticCategory.COLOR);
    expect(colorTokens.length).toBeGreaterThan(0);
    expect(colorTokens.some(t => t.name === 'color.primary')).toBe(true);
    
    // Verify spacing tokens are included
    const spacingTokens = tokens.filter(t => t.category === SemanticCategory.SPACING);
    expect(spacingTokens.length).toBeGreaterThan(0);
    expect(spacingTokens.some(t => t.name === 'space.grouped.normal')).toBe(true);
    expect(spacingTokens.some(t => t.name === 'space.inset.150')).toBe(true);
    
    // Verify typography tokens are included
    const typographyTokens = tokens.filter(t => t.category === SemanticCategory.TYPOGRAPHY);
    expect(typographyTokens.length).toBeGreaterThan(0);
    expect(typographyTokens.some(t => t.name === 'typography.bodyMd')).toBe(true);
    
    // Verify border tokens are included
    const borderTokens = tokens.filter(t => t.category === SemanticCategory.BORDER);
    expect(borderTokens.length).toBeGreaterThan(0);
    // Note: Key is 'default' but prefix 'border.' is added, so name is 'border.default'
    expect(borderTokens.some(t => t.name === 'border.default')).toBe(true);
  });

  it('should return correct count of semantic tokens', () => {
    const tokens = getAllSemanticTokens();
    const stats = getSemanticTokenStats();
    
    // Total count should match stats
    expect(tokens.length).toBe(stats.total);
    
    // Category counts should match
    const colorCount = tokens.filter(t => t.category === SemanticCategory.COLOR).length;
    expect(colorCount).toBe(stats.colorTokens);
    
    const typographyCount = tokens.filter(t => t.category === SemanticCategory.TYPOGRAPHY).length;
    expect(typographyCount).toBe(stats.typographyTokens);
    
    const spacingCount = tokens.filter(t => t.category === SemanticCategory.SPACING).length;
    expect(spacingCount).toBe(stats.spacingTokens);
    
    const borderCount = tokens.filter(t => t.category === SemanticCategory.BORDER).length;
    expect(borderCount).toBe(stats.borderTokens);
  });

  it('should ensure each token has valid structure', () => {
    const tokens = getAllSemanticTokens();
    
    // Verify every token has required fields
    tokens.forEach(token => {
      expect(token.name).toBeDefined();
      expect(typeof token.name).toBe('string');
      expect(token.name.length).toBeGreaterThan(0);
      
      // Architectural exception: Layering tokens (zIndex, elevation) use direct values
      // rather than primitive references because they represent ordinal ordering,
      // not mathematical relationships. See: ZIndexTokens.ts, ElevationTokens.ts
      if (token.category !== SemanticCategory.LAYERING) {
        expect(token.primitiveReferences).toBeDefined();
        expect(typeof token.primitiveReferences).toBe('object');
        expect(Object.keys(token.primitiveReferences).length).toBeGreaterThan(0);
      }
      
      expect(token.category).toBeDefined();
      expect(Object.values(SemanticCategory)).toContain(token.category);
      
      expect(token.context).toBeDefined();
      expect(typeof token.context).toBe('string');
      
      expect(token.description).toBeDefined();
      expect(typeof token.description).toBe('string');
      
      // Validate structure using utility function (skip for layering tokens)
      if (token.category !== SemanticCategory.LAYERING) {
        const validation = validateSemanticTokenStructure(token);
        expect(validation.valid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      }
    });
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
  it('should recommend inset spacing tokens with numeric names', () => {
    const recommendations = getSpacingRecommendation('inset');
    expect(recommendations).toContain('space.inset.050');
    expect(recommendations).toContain('space.inset.100');
    expect(recommendations).toContain('space.inset.150');
    expect(recommendations).toContain('space.inset.200');
    expect(recommendations).toContain('space.inset.300');
    expect(recommendations).toContain('space.inset.400');
  });

  it('should not recommend old synonym names', () => {
    const recommendations = getSpacingRecommendation('inset');
    const oldNames = ['tight', 'normal', 'comfortable', 'spacious', 'expansive', 'generous'];
    
    oldNames.forEach(oldName => {
      expect(recommendations).not.toContain(`space.inset.${oldName}`);
    });
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
    expect(recommendations).toContain('typography.bodyMd');
    expect(recommendations).toContain('typography.bodySm');
    expect(recommendations).toContain('typography.bodyLg');
  });

  it('should recommend UI tokens', () => {
    const recommendations = getTypographyRecommendation('ui');
    expect(recommendations).toContain('typography.buttonMd');
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
    
    // Registry just stores tokens (validation moved to validators)
    semanticRegistry.register(token!);
    
    expect(semanticRegistry.has('color.primary')).toBe(true);
    expect(semanticRegistry.get('color.primary')).toEqual(token);
  });

  it('should register typography semantic tokens', () => {
    const token = getSemanticToken('typography.bodyMd');
    expect(token).toBeDefined();
    
    // Registry just stores tokens (validation moved to validators)
    semanticRegistry.register(token!);
    
    expect(semanticRegistry.has('typography.bodyMd')).toBe(true);
    expect(semanticRegistry.get('typography.bodyMd')).toEqual(token);
  });

  it('should handle hierarchical spacing token registration', () => {
    const token = getSemanticToken('space.grouped.normal');
    expect(token).toBeDefined();
    
    // Registry just stores tokens (validation moved to validators)
    semanticRegistry.register(token!);
    
    expect(semanticRegistry.has('space.grouped.normal')).toBe(true);
    expect(semanticRegistry.get('space.grouped.normal')).toEqual(token);
  });
});
