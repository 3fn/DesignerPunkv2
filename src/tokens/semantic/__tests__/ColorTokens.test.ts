/**
 * Semantic Color Token Tests
 * 
 * Tests for semantic color token updates as part of color palette refresh.
 * Validates that color tokens reference correct primitives after palette update.
 * 
 * Task: 2.6 Write unit tests for semantic token updates
 * Spec: 015-color-palette-update
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import {
  colorTokens,
  colorTokenNames,
  getColorToken,
  getAllColorTokens,
  validateColorTokenCount
} from '../ColorTokens';
import { colorTokens as primitiveColorTokens } from '../../ColorTokens';
import { SemanticCategory } from '../../../types/SemanticToken';

describe('Semantic Color Tokens - Palette Update', () => {
  describe('Success Tokens Reference Green Primitives', () => {
    it('should have color.success.strong token', () => {
      expect(colorTokens['color.success.strong']).toBeDefined();
    });

    it('should reference green400 primitive for strong success', () => {
      const token = colorTokens['color.success.strong'];
      expect(token.primitiveReferences.value).toBe('green400');
    });

    it('should have color.success.subtle token', () => {
      expect(colorTokens['color.success.subtle']).toBeDefined();
    });

    it('should reference green100 primitive for subtle success', () => {
      const token = colorTokens['color.success.subtle'];
      expect(token.primitiveReferences.value).toBe('green100');
    });

    it('should verify green400 primitive exists', () => {
      const token = colorTokens['color.success.strong'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify green100 primitive exists', () => {
      const token = colorTokens['color.success.subtle'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for success tokens', () => {
      expect(colorTokens['color.success.strong'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.success.subtle'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for success tokens', () => {
      const strongToken = colorTokens['color.success.strong'];
      expect(strongToken.context).toBeTruthy();
      expect(strongToken.context).toContain('success');

      const subtleToken = colorTokens['color.success.subtle'];
      expect(subtleToken.context).toBeTruthy();
      expect(subtleToken.context).toContain('success');
    });
  });

  describe('Error Tokens Reference Pink Primitives', () => {
    it('should have color.error.strong token', () => {
      expect(colorTokens['color.error.strong']).toBeDefined();
    });

    it('should reference pink400 primitive for strong error', () => {
      const token = colorTokens['color.error.strong'];
      expect(token.primitiveReferences.value).toBe('pink400');
    });

    it('should have color.error.subtle token', () => {
      expect(colorTokens['color.error.subtle']).toBeDefined();
    });

    it('should reference pink100 primitive for subtle error', () => {
      const token = colorTokens['color.error.subtle'];
      expect(token.primitiveReferences.value).toBe('pink100');
    });

    it('should verify pink400 primitive exists', () => {
      const token = colorTokens['color.error.strong'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify pink100 primitive exists', () => {
      const token = colorTokens['color.error.subtle'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for error tokens', () => {
      expect(colorTokens['color.error.strong'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.error.subtle'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for error tokens', () => {
      const strongToken = colorTokens['color.error.strong'];
      expect(strongToken.context).toBeTruthy();
      expect(strongToken.context).toContain('error');

      const subtleToken = colorTokens['color.error.subtle'];
      expect(subtleToken.context).toBeTruthy();
      expect(subtleToken.context).toContain('error');
    });
  });

  describe('Warning Tokens Reference Amber Primitives', () => {
    it('should have color.warning.strong token', () => {
      expect(colorTokens['color.warning.strong']).toBeDefined();
    });

    it('should reference orange400 primitive for strong warning (amber)', () => {
      const token = colorTokens['color.warning.strong'];
      expect(token.primitiveReferences.value).toBe('orange400');
    });

    it('should have color.warning.subtle token', () => {
      expect(colorTokens['color.warning.subtle']).toBeDefined();
    });

    it('should reference orange100 primitive for subtle warning (amber)', () => {
      const token = colorTokens['color.warning.subtle'];
      expect(token.primitiveReferences.value).toBe('orange100');
    });

    it('should verify orange400 primitive exists', () => {
      const token = colorTokens['color.warning.strong'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify orange100 primitive exists', () => {
      const token = colorTokens['color.warning.subtle'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for warning tokens', () => {
      expect(colorTokens['color.warning.strong'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.warning.subtle'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for warning tokens', () => {
      const strongToken = colorTokens['color.warning.strong'];
      expect(strongToken.context).toBeTruthy();
      expect(strongToken.context).toContain('warning');

      const subtleToken = colorTokens['color.warning.subtle'];
      expect(subtleToken.context).toBeTruthy();
      expect(subtleToken.context).toContain('warning');
    });
  });

  describe('New Attention and Highlight Tokens Exist', () => {
    it('should have color.attention token', () => {
      expect(colorTokens['color.attention']).toBeDefined();
    });

    it('should reference yellow400 primitive for attention', () => {
      const token = colorTokens['color.attention'];
      expect(token.primitiveReferences.value).toBe('yellow400');
    });

    it('should have color.highlight token', () => {
      expect(colorTokens['color.highlight']).toBeDefined();
    });

    it('should reference yellow300 primitive for highlight', () => {
      const token = colorTokens['color.highlight'];
      expect(token.primitiveReferences.value).toBe('yellow300');
    });

    it('should verify yellow400 primitive exists', () => {
      const token = colorTokens['color.attention'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify yellow300 primitive exists', () => {
      const token = colorTokens['color.highlight'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for attention/highlight tokens', () => {
      expect(colorTokens['color.attention'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.highlight'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for attention token', () => {
      const token = colorTokens['color.attention'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('attention');
    });

    it('should have meaningful context for highlight token', () => {
      const token = colorTokens['color.highlight'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('highlight');
    });
  });

  describe('New Tech and Data Tokens Exist', () => {
    it('should have color.tech token', () => {
      expect(colorTokens['color.tech']).toBeDefined();
    });

    it('should reference cyan400 primitive for tech', () => {
      const token = colorTokens['color.tech'];
      expect(token.primitiveReferences.value).toBe('cyan400');
    });

    it('should have color.data token', () => {
      expect(colorTokens['color.data']).toBeDefined();
    });

    it('should reference cyan300 primitive for data', () => {
      const token = colorTokens['color.data'];
      expect(token.primitiveReferences.value).toBe('cyan300');
    });

    it('should verify cyan400 primitive exists', () => {
      const token = colorTokens['color.tech'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify cyan300 primitive exists', () => {
      const token = colorTokens['color.data'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for tech/data tokens', () => {
      expect(colorTokens['color.tech'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.data'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for tech token', () => {
      const token = colorTokens['color.tech'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('tech');
    });

    it('should have meaningful context for data token', () => {
      const token = colorTokens['color.data'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('data');
    });
  });

  describe('Canvas Token Exists', () => {
    it('should have color.canvas token', () => {
      expect(colorTokens['color.canvas']).toBeDefined();
    });

    it('should reference white100 primitive for canvas', () => {
      const token = colorTokens['color.canvas'];
      expect(token.primitiveReferences.value).toBe('white100');
    });

    it('should verify white100 primitive exists', () => {
      const token = colorTokens['color.canvas'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for canvas token', () => {
      expect(colorTokens['color.canvas'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for canvas token', () => {
      const token = colorTokens['color.canvas'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('canvas');
    });

    it('should describe canvas as default surface for pages', () => {
      const token = colorTokens['color.canvas'];
      expect(token.description).toBeTruthy();
      expect(token.description.toLowerCase()).toContain('canvas');
      expect(token.description.toLowerCase()).toContain('background');
    });
  });

  describe('New Glow Tokens Exist', () => {
    it('should have glow.neonGreen token', () => {
      expect(colorTokens['glow.neonGreen']).toBeDefined();
    });

    it('should reference green500 primitive for neon green glow', () => {
      const token = colorTokens['glow.neonGreen'];
      expect(token.primitiveReferences.value).toBe('green500');
    });

    it('should have glow.neonPink token', () => {
      expect(colorTokens['glow.neonPink']).toBeDefined();
    });

    it('should reference pink500 primitive for neon pink glow', () => {
      const token = colorTokens['glow.neonPink'];
      expect(token.primitiveReferences.value).toBe('pink500');
    });

    it('should verify green500 primitive exists', () => {
      const token = colorTokens['glow.neonGreen'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify pink500 primitive exists', () => {
      const token = colorTokens['glow.neonPink'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for glow tokens', () => {
      expect(colorTokens['glow.neonGreen'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['glow.neonPink'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for glow tokens', () => {
      const greenToken = colorTokens['glow.neonGreen'];
      expect(greenToken.context).toBeTruthy();
      expect(greenToken.context.toLowerCase()).toContain('glow');

      const pinkToken = colorTokens['glow.neonPink'];
      expect(pinkToken.context).toBeTruthy();
      expect(pinkToken.context.toLowerCase()).toContain('glow');
    });
  });

  describe('Color.secondary Token Removed', () => {
    it('should not have color.secondary token', () => {
      expect(colorTokens['color.secondary']).toBeUndefined();
    });

    it('should not include color.secondary in token names array', () => {
      expect(colorTokenNames).not.toContain('color.secondary');
    });

    it('should return undefined when getting color.secondary', () => {
      const token = getColorToken('color.secondary');
      expect(token).toBeUndefined();
    });

    it('should not include color.secondary in all tokens array', () => {
      const allTokens = getAllColorTokens();
      const secondaryToken = allTokens.find(t => t.name === 'color.secondary');
      expect(secondaryToken).toBeUndefined();
    });
  });

  describe('Token Count Validation', () => {
    it('should have exactly 28 color tokens', () => {
      expect(colorTokenNames.length).toBe(28);
    });

    it('should pass validateColorTokenCount()', () => {
      expect(validateColorTokenCount()).toBe(true);
    });

    it('should have correct token count breakdown', () => {
      // 1 brand + 2 success + 2 warning + 2 error + 2 info + 2 attention/highlight + 2 tech/data + 4 text + 4 surfaces + 1 icon + 1 print + 5 glow = 28
      const brandTokens = colorTokenNames.filter(n => n === 'color.primary');
      const successTokens = colorTokenNames.filter(n => n.startsWith('color.success'));
      const warningTokens = colorTokenNames.filter(n => n.startsWith('color.warning'));
      const errorTokens = colorTokenNames.filter(n => n.startsWith('color.error'));
      const infoTokens = colorTokenNames.filter(n => n.startsWith('color.info'));
      const attentionTokens = colorTokenNames.filter(n => n === 'color.attention' || n === 'color.highlight');
      const techDataTokens = colorTokenNames.filter(n => n === 'color.tech' || n === 'color.data');
      const textTokens = colorTokenNames.filter(n => n.startsWith('color.text'));
      const surfaceTokens = colorTokenNames.filter(n => n === 'color.canvas' || n === 'color.background' || n === 'color.surface' || n === 'color.border');
      const glowTokens = colorTokenNames.filter(n => n.startsWith('glow.'));

      expect(brandTokens.length).toBe(1);
      expect(successTokens.length).toBe(2);
      expect(warningTokens.length).toBe(2);
      expect(errorTokens.length).toBe(2);
      expect(infoTokens.length).toBe(2);
      expect(attentionTokens.length).toBe(2);
      expect(techDataTokens.length).toBe(2);
      expect(textTokens.length).toBe(4);
      expect(surfaceTokens.length).toBe(4);
      expect(glowTokens.length).toBe(5);
    });
  });

  describe('Utility Functions', () => {
    describe('getColorToken()', () => {
      it('should return color.success.strong token', () => {
        const token = getColorToken('color.success.strong');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.success.strong');
      });

      it('should return color.error.strong token', () => {
        const token = getColorToken('color.error.strong');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.error.strong');
      });

      it('should return color.warning.strong token', () => {
        const token = getColorToken('color.warning.strong');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.warning.strong');
      });

      it('should return color.attention token', () => {
        const token = getColorToken('color.attention');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.attention');
      });

      it('should return color.tech token', () => {
        const token = getColorToken('color.tech');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.tech');
      });

      it('should return glow.neonGreen token', () => {
        const token = getColorToken('glow.neonGreen');
        expect(token).toBeDefined();
        expect(token?.name).toBe('glow.neonGreen');
      });

      it('should return undefined for non-existent token', () => {
        const token = getColorToken('color.nonexistent');
        expect(token).toBeUndefined();
      });
    });

    describe('getAllColorTokens()', () => {
      it('should return array of color tokens', () => {
        const tokens = getAllColorTokens();
        expect(Array.isArray(tokens)).toBe(true);
      });

      it('should return exactly 28 tokens', () => {
        const tokens = getAllColorTokens();
        expect(tokens.length).toBe(28);
      });

      it('should include all new tokens', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.attention');
        expect(tokenNames).toContain('color.highlight');
        expect(tokenNames).toContain('color.tech');
        expect(tokenNames).toContain('color.data');
        expect(tokenNames).toContain('glow.neonGreen');
        expect(tokenNames).toContain('glow.neonPink');
      });

      it('should not include color.secondary', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);
        expect(tokenNames).not.toContain('color.secondary');
      });

      it('should return tokens with correct structure', () => {
        const tokens = getAllColorTokens();

        tokens.forEach(token => {
          expect(token).toHaveProperty('name');
          expect(token).toHaveProperty('primitiveReferences');
          expect(token).toHaveProperty('category');
          expect(token).toHaveProperty('context');
          expect(token).toHaveProperty('description');
        });
      });
    });
  });

  describe('Token Structure Consistency', () => {
    it('should have consistent structure across all tokens', () => {
      const tokens = getAllColorTokens();
      const firstToken = tokens[0];
      const firstTokenKeys = Object.keys(firstToken).sort();

      tokens.forEach(token => {
        const tokenKeys = Object.keys(token).sort();
        expect(tokenKeys).toEqual(firstTokenKeys);
      });
    });

    it('should maintain name consistency with object key', () => {
      Object.entries(colorTokens).forEach(([key, token]) => {
        expect(token.name).toBe(key);
      });
    });

    it('should have non-empty required fields', () => {
      const tokens = getAllColorTokens();

      tokens.forEach(token => {
        expect(token.name).toBeTruthy();
        expect(token.name.length).toBeGreaterThan(0);

        expect(token.primitiveReferences.value).toBeTruthy();
        expect(token.primitiveReferences.value.length).toBeGreaterThan(0);

        expect(token.category).toBeTruthy();
        expect(token.category).toBe(SemanticCategory.COLOR);

        expect(token.context).toBeTruthy();
        expect(token.context.length).toBeGreaterThan(0);

        expect(token.description).toBeTruthy();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });

    it('should have valid primitive references', () => {
      const tokens = getAllColorTokens();

      tokens.forEach(token => {
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });
    });
  });

  describe('Palette Update Requirements Coverage', () => {
    it('should satisfy Requirement 2.1: Success tokens reference green', () => {
      expect(colorTokens['color.success.strong'].primitiveReferences.value).toBe('green400');
      expect(colorTokens['color.success.subtle'].primitiveReferences.value).toBe('green100');
    });

    it('should satisfy Requirement 2.2: Error tokens reference pink', () => {
      expect(colorTokens['color.error.strong'].primitiveReferences.value).toBe('pink400');
      expect(colorTokens['color.error.subtle'].primitiveReferences.value).toBe('pink100');
    });

    it('should satisfy Requirement 2.3: Warning tokens reference amber (orange)', () => {
      expect(colorTokens['color.warning.strong'].primitiveReferences.value).toBe('orange400');
      expect(colorTokens['color.warning.subtle'].primitiveReferences.value).toBe('orange100');
    });

    it('should satisfy Requirement 2.4: New attention/highlight/tech/data tokens exist', () => {
      expect(colorTokens['color.attention']).toBeDefined();
      expect(colorTokens['color.highlight']).toBeDefined();
      expect(colorTokens['color.tech']).toBeDefined();
      expect(colorTokens['color.data']).toBeDefined();
    });

    it('should satisfy Requirement 2.5: New glow tokens exist', () => {
      expect(colorTokens['glow.neonGreen']).toBeDefined();
      expect(colorTokens['glow.neonPink']).toBeDefined();
    });

    it('should satisfy Requirement 2.6: color.secondary is removed', () => {
      expect(colorTokens['color.secondary']).toBeUndefined();
    });
  });
});
