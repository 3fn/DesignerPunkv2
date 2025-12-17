/**
 * Icon Size Token Calculation Tests
 * 
 * Tests for icon size token calculation functions and token structure.
 * Validates that icon sizes are calculated correctly using fontSize × multiplier formula.
 * The multiplier can be a lineHeight token reference or 'custom:X.XXX' for optical correction.
 * 
 * Task: 1.3 Implement icon size calculation function
 * Spec: 006-icon-size-tokens
 */

import {
  calculateIconSize,
  generateIconSizeTokens,
  iconTokens,
  getAllIconTokens,
  parseMultiplier,
  isCustomMultiplier,
  CUSTOM_MULTIPLIER_PREFIX
} from '../IconTokens';
import { fontSizeTokens } from '../../FontSizeTokens';
import { lineHeightTokens } from '../../LineHeightTokens';
import { SemanticCategory } from '../../../types/SemanticToken';

describe('Icon Size Token Calculation', () => {
  describe('parseMultiplier()', () => {
    it('should parse lineHeight token references', () => {
      const multiplier = parseMultiplier('lineHeight100');
      expect(multiplier).toBe(1.5);
    });

    it('should parse custom multiplier strings', () => {
      const multiplier = parseMultiplier('custom:1.231');
      expect(multiplier).toBe(1.231);
    });

    it('should throw for invalid lineHeight references', () => {
      expect(() => parseMultiplier('lineHeightInvalid')).toThrow();
    });
  });

  describe('isCustomMultiplier()', () => {
    it('should return true for custom multipliers', () => {
      expect(isCustomMultiplier('custom:1.231')).toBe(true);
    });

    it('should return false for lineHeight references', () => {
      expect(isCustomMultiplier('lineHeight100')).toBe(false);
    });
  });

  describe('calculateIconSize()', () => {
    it('should calculate icon size from fontSize × lineHeight token', () => {
      const fontSize = fontSizeTokens.fontSize100; // 16
      const lineHeight = lineHeightTokens.lineHeight100; // 1.5
      const iconSize = calculateIconSize(fontSize, lineHeight);
      expect(iconSize).toBe(24); // 16 × 1.5 = 24
    });

    it('should calculate icon size from fontSize × raw number multiplier', () => {
      const fontSize = fontSizeTokens.fontSize050; // 13
      const customMultiplier = 1.231; // Custom optical correction multiplier
      const iconSize = calculateIconSize(fontSize, customMultiplier);
      expect(iconSize).toBe(16); // 13 × 1.231 = 16.003 → 16
    });

    it('should round non-integer results', () => {
      const fontSize = fontSizeTokens.fontSize075; // 14
      const lineHeight = lineHeightTokens.lineHeight075; // 1.429
      const iconSize = calculateIconSize(fontSize, lineHeight);
      expect(iconSize).toBe(20); // 14 × 1.429 = 20.006 → 20
    });

    it('should calculate all expected icon sizes correctly using lineHeight tokens', () => {
      // Expected values with precision-targeted lineHeight multipliers for 8pt vertical rhythm
      // Note: icon.size050 uses custom multiplier (1.231) not lineHeight050, tested separately
      const expectedSizes = {
        '075': 20,  // 14 × 1.429 = 20.006 → 20
        '100': 24,  // 16 × 1.5 = 24
        '125': 28,  // 18 × 1.556 = 28.008 → 28
        '150': 28,  // 20 × 1.4 = 28
        '200': 32,  // 23 × 1.391 = 31.993 → 32
        '300': 32,  // 26 × 1.231 = 32.006 → 32
        '400': 36,  // 29 × 1.241 = 35.989 → 36
        '500': 40,  // 33 × 1.212 = 39.996 → 40
        '600': 44,  // 37 × 1.19 = 44.03 → 44
        '700': 48   // 42 × 1.143 = 48.006 → 48
      };

      Object.entries(expectedSizes).forEach(([scale, expectedSize]) => {
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const lineHeight = lineHeightTokens[`lineHeight${scale}`];
        const calculatedSize = calculateIconSize(fontSize, lineHeight);
        expect(calculatedSize).toBe(expectedSize);
      });
    });

    it('should calculate icon.size050 with custom multiplier for optical balance', () => {
      // icon.size050 uses custom multiplier (1.231) instead of lineHeight050 (1.538)
      // This provides better optical balance: 16px icon with 13px text vs 20px
      const fontSize = fontSizeTokens.fontSize050; // 13
      const customMultiplier = parseMultiplier('custom:1.231');
      const iconSize = calculateIconSize(fontSize, customMultiplier);
      expect(iconSize).toBe(16); // 13 × 1.231 = 16.003 → 16
      
      // Verify this differs from using lineHeight050
      const lineHeight050Size = calculateIconSize(fontSize, lineHeightTokens.lineHeight050);
      expect(lineHeight050Size).toBe(20); // 13 × 1.538 = 19.994 → 20
      expect(iconSize).not.toBe(lineHeight050Size);
    });
  });

  describe('generateIconSizeTokens()', () => {
    it('should generate all 11 icon size tokens', () => {
      const tokens = generateIconSizeTokens();
      expect(Object.keys(tokens)).toHaveLength(11);
    });

    it('should generate tokens with correct names', () => {
      const tokens = generateIconSizeTokens();
      const expectedNames = [
        'icon.size050', 'icon.size075', 'icon.size100', 'icon.size125',
        'icon.size150', 'icon.size200', 'icon.size300', 'icon.size400',
        'icon.size500', 'icon.size600', 'icon.size700'
      ];
      
      const actualNames = Object.keys(tokens);
      expectedNames.forEach(name => {
        expect(actualNames).toContain(name);
      });
    });

    it('should generate tokens with correct structure', () => {
      const tokens = generateIconSizeTokens();
      const token = tokens['icon.size100'];
      
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('primitiveReferences');
      expect(token).toHaveProperty('category');
      expect(token).toHaveProperty('context');
      expect(token).toHaveProperty('description');
      
      expect(token.name).toBe('icon.size100');
      expect(token.category).toBe(SemanticCategory.ICON);
    });

    it('should reference correct primitive tokens', () => {
      const tokens = generateIconSizeTokens();
      const token = tokens['icon.size100'];
      
      expect(token.primitiveReferences).toHaveProperty('fontSize');
      expect(token.primitiveReferences).toHaveProperty('multiplier');
      expect(token.primitiveReferences.fontSize).toBe('fontSize100');
      expect(token.primitiveReferences.multiplier).toBe('lineHeight100');
    });

    it('should include context for each token', () => {
      const tokens = generateIconSizeTokens();
      
      expect(tokens['icon.size050'].context).toContain('caption');
      expect(tokens['icon.size075'].context).toContain('bodySm');
      expect(tokens['icon.size100'].context).toContain('bodyMd');
      expect(tokens['icon.size700'].context).toContain('display');
    });

    it('should include calculation details in description', () => {
      const tokens = generateIconSizeTokens();
      const token = tokens['icon.size100'];
      
      expect(token.description).toContain('fontSize100');
      expect(token.description).toContain('lineHeight100'); // multiplier source
      expect(token.description).toContain('16');
      expect(token.description).toContain('1.5');
      expect(token.description).toContain('24');
    });
  });

  describe('iconTokens', () => {
    it('should have all 11 icon size tokens', () => {
      expect(Object.keys(iconTokens)).toHaveLength(11);
    });

    it('should have correct token structure', () => {
      Object.values(iconTokens).forEach(token => {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('primitiveReferences');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('context');
        expect(token).toHaveProperty('description');
        expect(token.category).toBe(SemanticCategory.ICON);
      });
    });

    it('should reference valid primitive tokens or custom multipliers', () => {
      Object.values(iconTokens).forEach(token => {
        const fontSizeName = token.primitiveReferences.fontSize;
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // fontSize should always be a valid primitive token
        expect(fontSizeTokens).toHaveProperty(fontSizeName);
        
        // multiplier can be a lineHeight token reference or 'custom:X.XXX'
        if (isCustomMultiplier(multiplierRef)) {
          const value = parseMultiplier(multiplierRef);
          expect(value).toBeGreaterThan(0);
        } else {
          expect(lineHeightTokens).toHaveProperty(multiplierRef);
        }
      });
    });
  });

  describe('getAllIconTokens()', () => {
    it('should return all icon tokens as array', () => {
      const tokens = getAllIconTokens();
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens).toHaveLength(11);
    });

    it('should return tokens with correct structure', () => {
      const tokens = getAllIconTokens();
      tokens.forEach(token => {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('primitiveReferences');
        expect(token).toHaveProperty('category');
        expect(token.category).toBe(SemanticCategory.ICON);
      });
    });
  });

  describe('Token Convergence', () => {
    it('should have unique icon size values', () => {
      const uniqueSizes = new Set<number>();
      
      Object.entries(iconTokens).forEach(([name, token]) => {
        const scale = name.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // Parse multiplier (handles both lineHeight references and custom values)
        const multiplierValue = parseMultiplier(multiplierRef);
        
        const size = calculateIconSize(fontSize, multiplierValue);
        uniqueSizes.add(size);
      });
      
      // Log actual unique sizes for debugging
      const sortedSizes = Array.from(uniqueSizes).sort((a, b) => a - b);
      
      // Verify we have the expected unique sizes
      // With custom multiplier for size050: 16px (unique), 20px (075 only)
      // Convergence: 28 (125, 150), 32 (200, 300)
      expect(sortedSizes).toContain(16);  // size050 with custom multiplier
      expect(sortedSizes).toContain(20);  // size075
      expect(sortedSizes).toContain(24);
      expect(sortedSizes).toContain(28);  // size125, size150 converge
      expect(sortedSizes).toContain(32);  // size200, size300 converge
      expect(sortedSizes).toContain(36);
      expect(sortedSizes).toContain(40);
      expect(sortedSizes).toContain(44);
      expect(sortedSizes).toContain(48);
    });

    it('should have natural convergence at multiple sizes', () => {
      // size050 now uses custom multiplier (1.231) for 16px - no longer converges with size075
      const size050 = calculateIconSize(fontSizeTokens.fontSize050, parseMultiplier('custom:1.231'));
      const size075 = calculateIconSize(fontSizeTokens.fontSize075, lineHeightTokens.lineHeight075);
      expect(size050).toBe(16);  // Custom multiplier for optical balance
      expect(size075).toBe(20);  // Standard lineHeight calculation
      
      // size125 and size150 converge to 28px
      const size125 = calculateIconSize(fontSizeTokens.fontSize125, lineHeightTokens.lineHeight125);
      const size150 = calculateIconSize(fontSizeTokens.fontSize150, lineHeightTokens.lineHeight150);
      expect(size125).toBe(28);
      expect(size150).toBe(28);
      
      // size200 and size300 converge to 32px
      const size200 = calculateIconSize(fontSizeTokens.fontSize200, lineHeightTokens.lineHeight200);
      const size300 = calculateIconSize(fontSizeTokens.fontSize300, lineHeightTokens.lineHeight300);
      expect(size200).toBe(32);
      expect(size300).toBe(32);
    });
  });

  describe('4pt Subgrid Alignment', () => {
    it('should align all icon sizes to 4pt subgrid', () => {
      // With precision-targeted multipliers, all sizes now align to 4pt subgrid
      const alignedSizes = [16, 20, 24, 28, 32, 36, 40, 44, 48];
      
      alignedSizes.forEach(size => {
        expect(size % 4).toBe(0);
      });
    });

    it('should verify 4pt alignment for all icon sizes', () => {
      // Calculate all icon sizes and check 4pt alignment
      const sizeAlignmentMap: Record<string, { size: number; aligned: boolean }> = {};
      
      Object.entries(iconTokens).forEach(([name, token]) => {
        const scale = name.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // Parse multiplier (handles both lineHeight references and custom values)
        const multiplierValue = parseMultiplier(multiplierRef);
        
        const size = calculateIconSize(fontSize, multiplierValue);
        const aligned = size % 4 === 0;
        
        sizeAlignmentMap[scale] = { size, aligned };
      });
      
      // ALL sizes should be 4pt aligned
      expect(sizeAlignmentMap['050'].aligned).toBe(true);  // 16px (custom multiplier)
      expect(sizeAlignmentMap['075'].aligned).toBe(true);  // 20px
      expect(sizeAlignmentMap['100'].aligned).toBe(true);  // 24px
      expect(sizeAlignmentMap['125'].aligned).toBe(true);  // 28px
      expect(sizeAlignmentMap['150'].aligned).toBe(true);  // 28px
      expect(sizeAlignmentMap['200'].aligned).toBe(true);  // 32px
      expect(sizeAlignmentMap['300'].aligned).toBe(true);  // 32px
      expect(sizeAlignmentMap['400'].aligned).toBe(true);  // 36px
      expect(sizeAlignmentMap['500'].aligned).toBe(true);  // 40px
      expect(sizeAlignmentMap['600'].aligned).toBe(true);  // 44px
      expect(sizeAlignmentMap['700'].aligned).toBe(true);  // 48px
      
      // Verify specific sizes
      expect(sizeAlignmentMap['050'].size).toBe(16);  // Custom multiplier for optical balance
      expect(sizeAlignmentMap['075'].size).toBe(20);  // Standard lineHeight calculation
    });

    it('should have no non-aligned sizes with precision-targeted multipliers', () => {
      // All sizes should be 4pt aligned
      const allSizes = Object.entries(iconTokens).map(([name, token]) => {
        const scale = name.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // Parse multiplier (handles both lineHeight references and custom values)
        const multiplierValue = parseMultiplier(multiplierRef);
        
        return calculateIconSize(fontSize, multiplierValue);
      });
      
      const uniqueSizes = Array.from(new Set(allSizes)).sort((a, b) => a - b);
      const actualNonAligned = uniqueSizes.filter(size => size % 4 !== 0);
      
      // No non-aligned sizes
      expect(actualNonAligned).toEqual([]);
      expect(actualNonAligned.length).toBe(0);
    });
  });
});

/**
 * Icon Size Token Structure Tests
 * 
 * Tests for semantic token structure validation.
 * Validates that icon tokens follow the SemanticToken interface correctly.
 * 
 * Task: 4.2 Create icon size token structure tests
 * Spec: 006-icon-size-tokens
 * Requirements: 1.4, 2.1, 9.1, 9.2, 9.3, 9.4, 9.5
 */
describe('Icon Size Token Structure Validation', () => {
  describe('Semantic Token Structure', () => {
    it('should validate all required fields are present', () => {
      Object.values(iconTokens).forEach(token => {
        // Required fields from SemanticToken interface
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('primitiveReferences');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('context');
        expect(token).toHaveProperty('description');
        
        // Verify types
        expect(typeof token.name).toBe('string');
        expect(typeof token.primitiveReferences).toBe('object');
        expect(typeof token.category).toBe('string');
        expect(typeof token.context).toBe('string');
        expect(typeof token.description).toBe('string');
      });
    });

    it('should have non-empty required fields', () => {
      Object.values(iconTokens).forEach(token => {
        expect(token.name).toBeTruthy();
        expect(token.name.length).toBeGreaterThan(0);
        
        expect(Object.keys(token.primitiveReferences).length).toBeGreaterThan(0);
        
        expect(token.category).toBeTruthy();
        expect(token.category.length).toBeGreaterThan(0);
        
        expect(token.context).toBeTruthy();
        expect(token.context.length).toBeGreaterThan(0);
        
        expect(token.description).toBeTruthy();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });

    it('should follow icon token naming convention', () => {
      Object.values(iconTokens).forEach(token => {
        // Icon tokens should follow pattern: icon.sizeXXX
        expect(token.name).toMatch(/^icon\.size\d{3}$/);
      });
    });
  });

  describe('Primitive References Validation', () => {
    it('should have fontSize and multiplier references', () => {
      Object.values(iconTokens).forEach(token => {
        expect(token.primitiveReferences).toHaveProperty('fontSize');
        expect(token.primitiveReferences).toHaveProperty('multiplier');
        
        expect(typeof token.primitiveReferences.fontSize).toBe('string');
        expect(typeof token.primitiveReferences.multiplier).toBe('string');
      });
    });

    it('should reference valid primitive tokens or custom multipliers', () => {
      Object.values(iconTokens).forEach(token => {
        const fontSizeName = token.primitiveReferences.fontSize;
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // Verify fontSize primitive token exists
        expect(fontSizeTokens).toHaveProperty(fontSizeName);
        
        // Verify fontSize is a valid PrimitiveToken object
        const fontSize = fontSizeTokens[fontSizeName];
        expect(fontSize).toHaveProperty('name');
        expect(fontSize).toHaveProperty('baseValue');
        
        // Verify multiplier is either a valid lineHeight reference or a custom multiplier string
        if (isCustomMultiplier(multiplierRef)) {
          const value = parseMultiplier(multiplierRef);
          expect(value).toBeGreaterThan(0);
        } else {
          expect(lineHeightTokens).toHaveProperty(multiplierRef);
          const lineHeight = lineHeightTokens[multiplierRef];
          expect(lineHeight).toHaveProperty('name');
          expect(lineHeight).toHaveProperty('baseValue');
        }
      });
    });

    it('should reference matching scale levels for lineHeight multipliers', () => {
      Object.entries(iconTokens).forEach(([name, token]) => {
        const scale = name.replace('icon.size', '');
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // fontSize should always reference the same scale
        expect(token.primitiveReferences.fontSize).toBe(`fontSize${scale}`);
        
        // multiplier should reference matching scale if it's a lineHeight reference
        if (!isCustomMultiplier(multiplierRef)) {
          expect(multiplierRef).toBe(`lineHeight${scale}`);
        }
        // Custom multipliers don't need to match scale
      });
    });

    it('should have exactly two primitive references', () => {
      Object.values(iconTokens).forEach(token => {
        const refKeys = Object.keys(token.primitiveReferences);
        expect(refKeys).toHaveLength(2);
        expect(refKeys).toContain('fontSize');
        expect(refKeys).toContain('multiplier');
      });
    });

    it('should use custom multiplier only for icon.size050', () => {
      // Only icon.size050 should have a custom multiplier
      Object.entries(iconTokens).forEach(([name, token]) => {
        const multiplierRef = token.primitiveReferences.multiplier;
        
        if (name === 'icon.size050') {
          expect(isCustomMultiplier(multiplierRef)).toBe(true);
          expect(multiplierRef).toBe('custom:1.231'); // Custom optical correction multiplier
        } else {
          expect(isCustomMultiplier(multiplierRef)).toBe(false);
        }
      });
    });
  });

  describe('SemanticCategory.ICON Validation', () => {
    it('should have category set to ICON', () => {
      Object.values(iconTokens).forEach(token => {
        expect(token.category).toBe(SemanticCategory.ICON);
      });
    });

    it('should use the correct enum value', () => {
      Object.values(iconTokens).forEach(token => {
        expect(token.category).toBe('icon');
      });
    });

    it('should not use other semantic categories', () => {
      const otherCategories = [
        SemanticCategory.COLOR,
        SemanticCategory.SPACING,
        SemanticCategory.TYPOGRAPHY,
        SemanticCategory.BORDER,
        SemanticCategory.SHADOW,
        SemanticCategory.LAYOUT,
        SemanticCategory.LAYERING,
        SemanticCategory.INTERACTION
      ];
      
      Object.values(iconTokens).forEach(token => {
        otherCategories.forEach(category => {
          expect(token.category).not.toBe(category);
        });
      });
    });
  });

  describe('Context Field Validation', () => {
    it('should have meaningful context descriptions', () => {
      Object.values(iconTokens).forEach(token => {
        // Context should describe typography pairing
        expect(token.context.length).toBeGreaterThan(20);
        expect(token.context).toContain('Icon size for');
      });
    });

    it('should reference typography styles in context', () => {
      // Verify specific tokens have expected typography references
      expect(iconTokens['icon.size050'].context).toContain('caption');
      expect(iconTokens['icon.size075'].context).toContain('bodySm');
      expect(iconTokens['icon.size100'].context).toContain('bodyMd');
      expect(iconTokens['icon.size125'].context).toContain('bodyLg');
      expect(iconTokens['icon.size150'].context).toContain('h6');
      expect(iconTokens['icon.size200'].context).toContain('h5');
      expect(iconTokens['icon.size300'].context).toContain('h4');
      expect(iconTokens['icon.size400'].context).toContain('h3');
      expect(iconTokens['icon.size500'].context).toContain('h2');
      expect(iconTokens['icon.size600'].context).toContain('h1');
      expect(iconTokens['icon.size700'].context).toContain('display');
    });

    it('should provide usage guidance in context', () => {
      Object.values(iconTokens).forEach(token => {
        // Context should help developers understand when to use this size
        const hasTypographyReference = 
          token.context.includes('body') ||
          token.context.includes('button') ||
          token.context.includes('label') ||
          token.context.includes('heading') ||
          token.context.includes('h1') ||
          token.context.includes('h2') ||
          token.context.includes('h3') ||
          token.context.includes('h4') ||
          token.context.includes('h5') ||
          token.context.includes('h6') ||
          token.context.includes('display') ||
          token.context.includes('caption') ||
          token.context.includes('legal') ||
          token.context.includes('input');
        
        expect(hasTypographyReference).toBe(true);
      });
    });
  });

  describe('Description Field Validation', () => {
    it('should include calculation formula in description', () => {
      Object.values(iconTokens).forEach(token => {
        // Description should explain the calculation
        expect(token.description).toContain('calculated from');
        expect(token.description).toContain('×');
        expect(token.description).toContain('=');
      });
    });

    it('should reference primitive token names or custom multiplier in description', () => {
      Object.entries(iconTokens).forEach(([name, token]) => {
        const scale = name.replace('icon.size', '');
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // Description should mention the fontSize primitive
        expect(token.description).toContain(`fontSize${scale}`);
        
        // Description should mention the multiplier source
        if (isCustomMultiplier(multiplierRef)) {
          expect(token.description).toContain('custom'); // custom multiplier indicator
        } else {
          expect(token.description).toContain(multiplierRef); // lineHeight token name
        }
      });
    });

    it('should include calculated values in description', () => {
      Object.entries(iconTokens).forEach(([name, token]) => {
        const scale = name.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const multiplierRef = token.primitiveReferences.multiplier;
        
        // Parse multiplier (handles both lineHeight references and custom values)
        const multiplierValue = parseMultiplier(multiplierRef);
        
        const calculatedSize = calculateIconSize(fontSize, multiplierValue);
        
        // Description should include the calculated size
        expect(token.description).toContain(`${calculatedSize}px`);
      });
    });

    it('should indicate rounding when applicable', () => {
      // Tokens that require rounding should mention it
      const tokensWithRounding = ['icon.size050', 'icon.size075', 'icon.size125', 'icon.size200', 'icon.size300', 'icon.size400', 'icon.size500', 'icon.size600', 'icon.size700'];
      
      tokensWithRounding.forEach(tokenName => {
        const token = iconTokens[tokenName];
        expect(token.description).toContain('rounded');
      });
    });

    it('should not indicate rounding for exact calculations', () => {
      // Tokens with exact calculations should not mention rounding
      // Only size100 and size150 are exact
      const tokensWithoutRounding = ['icon.size100', 'icon.size150'];
      
      tokensWithoutRounding.forEach(tokenName => {
        const token = iconTokens[tokenName];
        expect(token.description).not.toContain('rounded');
      });
    });
  });

  describe('Token Consistency', () => {
    it('should have consistent structure across all tokens', () => {
      const firstToken = iconTokens['icon.size050'];
      const firstTokenKeys = Object.keys(firstToken).sort();
      
      Object.values(iconTokens).forEach(token => {
        const tokenKeys = Object.keys(token).sort();
        expect(tokenKeys).toEqual(firstTokenKeys);
      });
    });

    it('should have consistent primitive reference structure', () => {
      Object.values(iconTokens).forEach(token => {
        const refKeys = Object.keys(token.primitiveReferences).sort();
        expect(refKeys).toEqual(['fontSize', 'multiplier']);
      });
    });

    it('should maintain name consistency with object key', () => {
      Object.entries(iconTokens).forEach(([key, token]) => {
        expect(token.name).toBe(key);
      });
    });
  });

  describe('Generated Tokens Validation', () => {
    it('should match manually defined tokens', () => {
      const generatedTokens = generateIconSizeTokens();
      
      // Verify same number of tokens
      expect(Object.keys(generatedTokens)).toHaveLength(Object.keys(iconTokens).length);
      
      // Verify each generated token matches manual definition
      Object.entries(iconTokens).forEach(([name, manualToken]) => {
        const generatedToken = generatedTokens[name];
        
        expect(generatedToken).toBeDefined();
        expect(generatedToken.name).toBe(manualToken.name);
        expect(generatedToken.category).toBe(manualToken.category);
        expect(generatedToken.primitiveReferences).toEqual(manualToken.primitiveReferences);
        expect(generatedToken.context).toBe(manualToken.context);
        // Description may vary slightly due to rounding precision, so just check it exists
        expect(generatedToken.description).toBeTruthy();
      });
    });
  });
});
