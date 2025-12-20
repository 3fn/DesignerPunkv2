/**
 * @category evergreen
 * @purpose Verify SemanticToken registry provides correct token lookup and management
 */
/**
 * Semantic Token Registry Tests
 * 
 * Comprehensive test coverage for semantic token registration, validation,
 * retrieval, and mode-aware color resolution.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { SemanticTokenRegistry } from '../SemanticTokenRegistry';
import { PrimitiveTokenRegistry } from '../PrimitiveTokenRegistry';
import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';
import { TokenCategory } from '../../types/PrimitiveToken';
import type { PrimitiveToken } from '../../types/PrimitiveToken';

describe('SemanticTokenRegistry', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);

    // Register test primitive tokens
    const space100: PrimitiveToken = {
      name: 'space100',
      category: TokenCategory.SPACING,
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

    const space200: PrimitiveToken = {
      name: 'space200',
      category: TokenCategory.SPACING,
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

  describe('Token Registration', () => {
    it('should register a valid semantic token', () => {
      const semanticToken: SemanticToken = {
        name: 'space.grouped.normal',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Normal grouped spacing',
        context: 'Spacing between elements in the same logical group'
      };

      expect(() => semanticRegistry.register(semanticToken)).not.toThrow();
      expect(semanticRegistry.has('space.grouped.normal')).toBe(true);
    });

    it('should register semantic token even with invalid primitive reference (validation moved to validators)', () => {
      const semanticToken: SemanticToken = {
        name: 'space.invalid',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'nonexistent' },
        description: 'Invalid spacing',
        context: 'Test invalid reference'
      };

      expect(() => semanticRegistry.register(semanticToken)).not.toThrow();
      expect(semanticRegistry.has('space.invalid')).toBe(true);
    });

    it('should reject duplicate semantic token registration', () => {
      const semanticToken: SemanticToken = {
        name: 'space.duplicate',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Duplicate test',
        context: 'Test duplicate'
      };

      semanticRegistry.register(semanticToken);
      
      expect(() => semanticRegistry.register(semanticToken)).toThrow('already registered');
    });

    it('should allow overwrite with allowOverwrite option', () => {
      const semanticToken: SemanticToken = {
        name: 'space.overwrite',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Original',
        context: 'Original context'
      };

      semanticRegistry.register(semanticToken);

      const updatedToken: SemanticToken = {
        ...semanticToken,
        description: 'Updated',
        primitiveReferences: { default: 'space200' }
      };

      expect(() => semanticRegistry.register(updatedToken, { allowOverwrite: true })).not.toThrow();
      expect(semanticRegistry.get('space.overwrite')?.description).toBe('Updated');
    });

    it('should skip validation when skipValidation is true', () => {
      const semanticToken: SemanticToken = {
        name: 'space.skip',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'nonexistent' },
        description: 'Skip validation test',
        context: 'Test skip'
      };

      expect(() => semanticRegistry.register(semanticToken, { skipValidation: true })).not.toThrow();
      expect(semanticRegistry.has('space.skip')).toBe(true);
    });
  });

  describe('Token Retrieval', () => {
    beforeEach(() => {
      const tokens: SemanticToken[] = [
        {
          name: 'space.grouped.tight',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space100' },
          description: 'Tight grouped spacing',
          context: 'Tight grouping'
        },
        {
          name: 'space.grouped.normal',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space200' },
          description: 'Normal grouped spacing',
          context: 'Normal grouping'
        },
        {
          name: 'color.primary',
          category: SemanticCategory.COLOR,
          primitiveReferences: { default: 'purple300' },
          description: 'Primary brand color',
          context: 'Primary actions'
        }
      ];

      tokens.forEach(token => semanticRegistry.register(token));
    });

    it('should retrieve semantic token by name', () => {
      const token = semanticRegistry.get('space.grouped.tight');

      expect(token).toBeDefined();
      expect(token?.name).toBe('space.grouped.tight');
      expect(token?.category).toBe(SemanticCategory.SPACING);
    });

    it('should return undefined for non-existent token', () => {
      const token = semanticRegistry.get('nonexistent');

      expect(token).toBeUndefined();
    });

    it('should check token existence', () => {
      expect(semanticRegistry.has('space.grouped.tight')).toBe(true);
      expect(semanticRegistry.has('nonexistent')).toBe(false);
    });

    it('should query tokens by category', () => {
      const spacingTokens = semanticRegistry.query({ category: SemanticCategory.SPACING });

      expect(spacingTokens).toHaveLength(2);
      expect(spacingTokens.every(t => t.category === SemanticCategory.SPACING)).toBe(true);
    });

    it('should query and sort tokens by name', () => {
      const tokens = semanticRegistry.query({ sortBy: 'name' });

      expect(tokens[0].name).toBe('color.primary');
      expect(tokens[1].name).toBe('space.grouped.normal');
      expect(tokens[2].name).toBe('space.grouped.tight');
    });

    it('should get tokens by category', () => {
      const colorTokens = semanticRegistry.getByCategory(SemanticCategory.COLOR);

      expect(colorTokens).toHaveLength(1);
      expect(colorTokens[0].name).toBe('color.primary');
    });
  });

  describe('Storage-Only Behavior', () => {
    it('should store semantic tokens without validation (validation moved to validators)', () => {
      const semanticToken: SemanticToken = {
        name: 'space.test',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Test spacing',
        context: 'Test'
      };

      expect(() => semanticRegistry.register(semanticToken)).not.toThrow();
      expect(semanticRegistry.has('space.test')).toBe(true);
    });

    it('should store semantic tokens with multiple primitive references', () => {
      const semanticToken: SemanticToken = {
        name: 'space.multi',
        category: SemanticCategory.SPACING,
        primitiveReferences: {
          horizontal: 'space100',
          vertical: 'space200'
        },
        description: 'Multi-reference spacing',
        context: 'Test multiple references'
      };

      expect(() => semanticRegistry.register(semanticToken)).not.toThrow();
      expect(semanticRegistry.has('space.multi')).toBe(true);
    });

    it('should store tokens even with invalid primitive references (validation moved to validators)', () => {
      const semanticToken: SemanticToken = {
        name: 'space.invalid',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'non-existent' },
        description: 'Invalid reference',
        context: 'Test invalid'
      };

      expect(() => semanticRegistry.register(semanticToken)).not.toThrow();
      expect(semanticRegistry.has('space.invalid')).toBe(true);
    });

    it('should register all tokens without validation', () => {
      semanticRegistry.register({
        name: 'space.valid',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Valid',
        context: 'Valid'
      });

      expect(semanticRegistry.query()).toHaveLength(1);
    });
  });

  describe('Mode-Aware Color Resolution', () => {
    beforeEach(() => {
      const colorToken: SemanticToken = {
        name: 'color.primary',
        category: SemanticCategory.COLOR,
        primitiveReferences: { default: 'purple300' },
        description: 'Primary color',
        context: 'Primary actions'
      };

      semanticRegistry.register(colorToken);
    });

    it('should resolve light mode base theme color', () => {
      const token = semanticRegistry.get('color.primary')!;
      const color = semanticRegistry.resolveColorValue(token, {
        mode: 'light',
        theme: 'base'
      });

      expect(color).toBe('#A78BFA');
    });

    it('should resolve light mode WCAG theme color', () => {
      const token = semanticRegistry.get('color.primary')!;
      const color = semanticRegistry.resolveColorValue(token, {
        mode: 'light',
        theme: 'wcag'
      });

      expect(color).toBe('#8B5CF6');
    });

    it('should resolve dark mode base theme color', () => {
      const token = semanticRegistry.get('color.primary')!;
      const color = semanticRegistry.resolveColorValue(token, {
        mode: 'dark',
        theme: 'base'
      });

      expect(color).toBe('#A78BFA');
    });

    it('should resolve dark mode WCAG theme color', () => {
      const token = semanticRegistry.get('color.primary')!;
      const color = semanticRegistry.resolveColorValue(token, {
        mode: 'dark',
        theme: 'wcag'
      });

      expect(color).toBe('#C4B5FD');
    });

    it('should return null for non-color semantic tokens', () => {
      const spacingToken: SemanticToken = {
        name: 'space.test',
        category: SemanticCategory.SPACING,
        primitiveReferences: { default: 'space100' },
        description: 'Test',
        context: 'Test'
      };

      semanticRegistry.register(spacingToken);
      const token = semanticRegistry.get('space.test')!;
      const color = semanticRegistry.resolveColorValue(token, {
        mode: 'light',
        theme: 'base'
      });

      expect(color).toBeNull();
    });
  });

  describe('Registry Management', () => {
    beforeEach(() => {
      const tokens: SemanticToken[] = [
        {
          name: 'space.test1',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space100' },
          description: 'Test 1',
          context: 'Test'
        },
        {
          name: 'space.test2',
          category: SemanticCategory.SPACING,
          primitiveReferences: { default: 'space200' },
          description: 'Test 2',
          context: 'Test'
        },
        {
          name: 'color.test',
          category: SemanticCategory.COLOR,
          primitiveReferences: { default: 'purple300' },
          description: 'Test color',
          context: 'Test'
        }
      ];

      tokens.forEach(token => semanticRegistry.register(token));
    });

    it('should get registry statistics', () => {
      const stats = semanticRegistry.getStats();

      expect(stats.totalTokens).toBe(3);
      expect(stats.categoryStats[SemanticCategory.SPACING]).toBe(2);
      expect(stats.categoryStats[SemanticCategory.COLOR]).toBe(1);
    });

    it('should remove semantic token', () => {
      const removed = semanticRegistry.remove('space.test1');

      expect(removed).toBe(true);
      expect(semanticRegistry.has('space.test1')).toBe(false);
      expect(semanticRegistry.getStats().totalTokens).toBe(2);
    });

    it('should return false when removing non-existent token', () => {
      const removed = semanticRegistry.remove('nonexistent');

      expect(removed).toBe(false);
    });

    it('should clear all semantic tokens', () => {
      semanticRegistry.clear();

      expect(semanticRegistry.getStats().totalTokens).toBe(0);
      expect(semanticRegistry.has('space.test1')).toBe(false);
    });

    it('should maintain category index after clear', () => {
      semanticRegistry.clear();
      
      const spacingTokens = semanticRegistry.getByCategory(SemanticCategory.SPACING);
      expect(spacingTokens).toHaveLength(0);
    });
  });
});
