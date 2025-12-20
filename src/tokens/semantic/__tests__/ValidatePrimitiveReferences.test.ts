/**
 * @category evergreen
 * @purpose Verify ValidatePrimitiveReferences tokens are correctly defined and structured
 */
/**
 * Validate Primitive References Test
 * 
 * This test validates that all primitiveReferences in semantic tokens
 * point to existing primitive tokens.
 * 
 * Task: 4.3 Validate all primitive references exist
 * Spec: 001-token-data-quality-fix
 */

import { getAllColorTokens } from '../ColorTokens';
import { getAllTypographyTokens } from '../TypographyTokens';
import { getAllShadowTokens } from '../ShadowTokens';
import { spacingTokens as semanticSpacingTokens } from '../SpacingTokens';
import { getAllOpacityTokens } from '../OpacityTokens';
import { getAllBlendTokens } from '../BlendTokens';
import { SemanticBorderWidthTokens } from '../BorderWidthTokens';
import { getAllGridSpacingTokens } from '../GridSpacingTokens';

// Import all primitive token modules
import { fontSizeTokens } from '../../FontSizeTokens';
import { lineHeightTokens } from '../../LineHeightTokens';
import { fontFamilyTokens } from '../../FontFamilyTokens';
import { fontWeightTokens } from '../../FontWeightTokens';
import { letterSpacingTokens } from '../../LetterSpacingTokens';
import { spacingTokens } from '../../SpacingTokens';
import { colorTokens as primitiveColorTokens } from '../../ColorTokens';
import { opacityTokens } from '../../OpacityTokens';
import { shadowOffsetX, shadowOffsetY } from '../../ShadowOffsetTokens';
import { shadowBlur } from '../../ShadowBlurTokens';
import { shadowOpacityTokens } from '../../ShadowOpacityTokens';
import { borderWidthTokens } from '../../BorderWidthTokens';
import { blendTokens } from '../../BlendTokens';

describe('Primitive Reference Validation', () => {
  // Build a comprehensive map of all primitive tokens
  const allPrimitiveTokens = new Set<string>();

  beforeAll(() => {
    // Add all primitive token names to the set
    Object.keys(fontSizeTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(lineHeightTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(fontFamilyTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(fontWeightTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(letterSpacingTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(spacingTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(opacityTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(borderWidthTokens).forEach(name => allPrimitiveTokens.add(name));
    Object.keys(blendTokens).forEach(name => allPrimitiveTokens.add(name));

    // Add shadow tokens with their full names (e.g., "shadowOffsetX.000")
    Object.values(shadowOffsetX).forEach(token => allPrimitiveTokens.add(token.name));
    Object.values(shadowOffsetY).forEach(token => allPrimitiveTokens.add(token.name));
    Object.values(shadowBlur).forEach(token => allPrimitiveTokens.add(token.name));
    Object.values(shadowOpacityTokens).forEach(token => allPrimitiveTokens.add(token.name));

    // Add all primitive color tokens (including all color families)
    Object.keys(primitiveColorTokens).forEach(name => allPrimitiveTokens.add(name));
  });

  describe('Color Tokens', () => {
    it('should have all primitive references exist', () => {
      const colorTokens = getAllColorTokens();
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      colorTokens.forEach(token => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in color tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Typography Tokens', () => {
    it('should have all primitive references exist', () => {
      const typographyTokens = getAllTypographyTokens();
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      typographyTokens.forEach(token => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in typography tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Shadow Tokens', () => {
    it('should have all primitive references exist', () => {
      const shadowTokens = getAllShadowTokens();
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      shadowTokens.forEach(token => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in shadow tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Spacing Tokens', () => {
    it('should have all primitive references exist', () => {
      const spacingTokensArray = Object.values(semanticSpacingTokens);
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      spacingTokensArray.forEach((token: any) => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName as string)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName as string,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in spacing tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences.length).toBe(0);
    });
  });

  describe('Opacity Tokens', () => {
    it('should have all primitive references exist', () => {
      const semanticOpacityTokens = getAllOpacityTokens();
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      semanticOpacityTokens.forEach(token => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in opacity tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Blend Tokens', () => {
    it('should have all primitive references exist', () => {
      const semanticBlendTokens = getAllBlendTokens();
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      semanticBlendTokens.forEach(token => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in blend tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Border Width Tokens', () => {
    it('should have all primitive references exist', () => {
      const borderWidthTokensArray = Object.values(SemanticBorderWidthTokens);
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      borderWidthTokensArray.forEach((token: any) => {
        // Border width tokens use { value: 'primitiveName' } structure
        if (token.value) {
          const primitiveName = token.value;
          if (!allPrimitiveTokens.has(primitiveName)) {
            invalidReferences.push({
              token: 'border token',
              reference: primitiveName,
              key: 'value'
            });
          }
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in border width tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Grid Spacing Tokens', () => {
    it('should have all primitive references exist', () => {
      const gridSpacingTokens = getAllGridSpacingTokens();
      const invalidReferences: Array<{ token: string; reference: string; key: string }> = [];

      gridSpacingTokens.forEach(token => {
        if (token.primitiveReferences) {
          Object.entries(token.primitiveReferences).forEach(([key, primitiveName]) => {
            if (!allPrimitiveTokens.has(primitiveName)) {
              invalidReferences.push({
                token: token.name,
                reference: primitiveName,
                key
              });
            }
          });
        }
      });

      if (invalidReferences.length > 0) {
        console.error('Invalid primitive references in grid spacing tokens:');
        invalidReferences.forEach(({ token, reference, key }) => {
          console.error(`  - ${token}.primitiveReferences.${key} = "${reference}" (NOT FOUND)`);
        });
      }

      expect(invalidReferences).toHaveLength(0);
    });
  });

  describe('Summary', () => {
    it('should provide a summary of all validated tokens', () => {
      const colorTokens = getAllColorTokens();
      const typographyTokens = getAllTypographyTokens();
      const shadowTokens = getAllShadowTokens();
      const spacingTokensArray = Object.values(semanticSpacingTokens);
      const opacityTokens = getAllOpacityTokens();
      const blendTokens = getAllBlendTokens();
      const borderWidthTokensArray = Object.values(SemanticBorderWidthTokens);
      const gridSpacingTokens = getAllGridSpacingTokens();

      const totalSemanticTokens = 
        colorTokens.length +
        typographyTokens.length +
        shadowTokens.length +
        spacingTokensArray.length +
        opacityTokens.length +
        blendTokens.length +
        borderWidthTokensArray.length +
        gridSpacingTokens.length;

      console.log('\n=== Primitive Reference Validation Summary ===');
      console.log(`Total primitive tokens available: ${allPrimitiveTokens.size}`);
      console.log(`Total semantic tokens validated: ${totalSemanticTokens}`);
      console.log(`  - Color tokens: ${colorTokens.length}`);
      console.log(`  - Typography tokens: ${typographyTokens.length}`);
      console.log(`  - Shadow tokens: ${shadowTokens.length}`);
      console.log(`  - Spacing tokens: ${spacingTokensArray.length}`);
      console.log(`  - Opacity tokens: ${opacityTokens.length}`);
      console.log(`  - Blend tokens: ${blendTokens.length}`);
      console.log(`  - Border width tokens: ${borderWidthTokensArray.length}`);
      console.log(`  - Grid spacing tokens: ${gridSpacingTokens.length}`);
      console.log('==============================================\n');

      // This test always passes - it's just for reporting
      expect(true).toBe(true);
    });
  });
});
