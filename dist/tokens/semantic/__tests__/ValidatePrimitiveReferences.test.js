"use strict";
/**
 * Validate Primitive References Test
 *
 * This test validates that all primitiveReferences in semantic tokens
 * point to existing primitive tokens.
 *
 * Task: 4.3 Validate all primitive references exist
 * Spec: 001-token-data-quality-fix
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ColorTokens_1 = require("../ColorTokens");
const TypographyTokens_1 = require("../TypographyTokens");
const ShadowTokens_1 = require("../ShadowTokens");
const SpacingTokens_1 = require("../SpacingTokens");
const OpacityTokens_1 = require("../OpacityTokens");
const BlendTokens_1 = require("../BlendTokens");
const BorderWidthTokens_1 = require("../BorderWidthTokens");
const GridSpacingTokens_1 = require("../GridSpacingTokens");
// Import all primitive token modules
const FontSizeTokens_1 = require("../../FontSizeTokens");
const LineHeightTokens_1 = require("../../LineHeightTokens");
const FontFamilyTokens_1 = require("../../FontFamilyTokens");
const FontWeightTokens_1 = require("../../FontWeightTokens");
const LetterSpacingTokens_1 = require("../../LetterSpacingTokens");
const SpacingTokens_2 = require("../../SpacingTokens");
const ColorTokens_2 = require("../../ColorTokens");
const OpacityTokens_2 = require("../../OpacityTokens");
const ShadowOffsetTokens_1 = require("../../ShadowOffsetTokens");
const ShadowBlurTokens_1 = require("../../ShadowBlurTokens");
const ShadowOpacityTokens_1 = require("../../ShadowOpacityTokens");
const BorderWidthTokens_2 = require("../../BorderWidthTokens");
const BlendTokens_2 = require("../../BlendTokens");
describe('Primitive Reference Validation', () => {
    // Build a comprehensive map of all primitive tokens
    const allPrimitiveTokens = new Set();
    beforeAll(() => {
        // Add all primitive token names to the set
        Object.keys(FontSizeTokens_1.fontSizeTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(LineHeightTokens_1.lineHeightTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(FontFamilyTokens_1.fontFamilyTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(FontWeightTokens_1.fontWeightTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(LetterSpacingTokens_1.letterSpacingTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(SpacingTokens_2.spacingTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(OpacityTokens_2.opacityTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(BorderWidthTokens_2.borderWidthTokens).forEach(name => allPrimitiveTokens.add(name));
        Object.keys(BlendTokens_2.blendTokens).forEach(name => allPrimitiveTokens.add(name));
        // Add shadow tokens with their full names (e.g., "shadowOffsetX.000")
        Object.values(ShadowOffsetTokens_1.shadowOffsetX).forEach(token => allPrimitiveTokens.add(token.name));
        Object.values(ShadowOffsetTokens_1.shadowOffsetY).forEach(token => allPrimitiveTokens.add(token.name));
        Object.values(ShadowBlurTokens_1.shadowBlur).forEach(token => allPrimitiveTokens.add(token.name));
        Object.values(ShadowOpacityTokens_1.shadowOpacityTokens).forEach(token => allPrimitiveTokens.add(token.name));
        // Add all primitive color tokens (including all color families)
        Object.keys(ColorTokens_2.colorTokens).forEach(name => allPrimitiveTokens.add(name));
    });
    describe('Color Tokens', () => {
        it('should have all primitive references exist', () => {
            const colorTokens = (0, ColorTokens_1.getAllColorTokens)();
            const invalidReferences = [];
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
            const typographyTokens = (0, TypographyTokens_1.getAllTypographyTokens)();
            const invalidReferences = [];
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
            const shadowTokens = (0, ShadowTokens_1.getAllShadowTokens)();
            const invalidReferences = [];
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
            const spacingTokensArray = Object.values(SpacingTokens_1.spacingTokens);
            const invalidReferences = [];
            spacingTokensArray.forEach((token) => {
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
            const semanticOpacityTokens = (0, OpacityTokens_1.getAllOpacityTokens)();
            const invalidReferences = [];
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
            const semanticBlendTokens = (0, BlendTokens_1.getAllBlendTokens)();
            const invalidReferences = [];
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
            const borderWidthTokensArray = Object.values(BorderWidthTokens_1.SemanticBorderWidthTokens);
            const invalidReferences = [];
            borderWidthTokensArray.forEach((token) => {
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
            const gridSpacingTokens = (0, GridSpacingTokens_1.getAllGridSpacingTokens)();
            const invalidReferences = [];
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
            const colorTokens = (0, ColorTokens_1.getAllColorTokens)();
            const typographyTokens = (0, TypographyTokens_1.getAllTypographyTokens)();
            const shadowTokens = (0, ShadowTokens_1.getAllShadowTokens)();
            const spacingTokensArray = Object.values(SpacingTokens_1.spacingTokens);
            const opacityTokens = (0, OpacityTokens_1.getAllOpacityTokens)();
            const blendTokens = (0, BlendTokens_1.getAllBlendTokens)();
            const borderWidthTokensArray = Object.values(BorderWidthTokens_1.SemanticBorderWidthTokens);
            const gridSpacingTokens = (0, GridSpacingTokens_1.getAllGridSpacingTokens)();
            const totalSemanticTokens = colorTokens.length +
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
//# sourceMappingURL=ValidatePrimitiveReferences.test.js.map