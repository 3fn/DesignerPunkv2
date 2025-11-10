"use strict";
/**
 * Grid Spacing Token Generation Tests
 *
 * Tests that grid spacing semantic tokens are correctly generated for all platforms
 * with proper naming conventions and primitive token references.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenFileGenerator_1 = require("../TokenFileGenerator");
const GridSpacingTokens_1 = require("../../tokens/semantic/GridSpacingTokens");
describe('Grid Spacing Token Generation', () => {
    let generator;
    beforeEach(() => {
        generator = new TokenFileGenerator_1.TokenFileGenerator();
    });
    describe('Grid Spacing Token Availability', () => {
        it('should have grid spacing tokens in the semantic token registry', () => {
            const gridSpacingTokens = (0, GridSpacingTokens_1.getAllGridSpacingTokens)();
            expect(gridSpacingTokens).toBeDefined();
            expect(gridSpacingTokens.length).toBe(10); // 8 web tokens + 2 native tokens
            // Verify all grid spacing tokens exist
            const tokenNames = gridSpacingTokens.map(t => t.name);
            // Web gutter tokens
            expect(tokenNames).toContain('gridGutterXs');
            expect(tokenNames).toContain('gridGutterSm');
            expect(tokenNames).toContain('gridGutterMd');
            expect(tokenNames).toContain('gridGutterLg');
            // Web margin tokens
            expect(tokenNames).toContain('gridMarginXs');
            expect(tokenNames).toContain('gridMarginSm');
            expect(tokenNames).toContain('gridMarginMd');
            expect(tokenNames).toContain('gridMarginLg');
            // Native tokens
            expect(tokenNames).toContain('gridGutterNative');
            expect(tokenNames).toContain('gridMarginNative');
        });
        it('should reference correct primitive spacing tokens', () => {
            const gridSpacingTokens = (0, GridSpacingTokens_1.getAllGridSpacingTokens)();
            const gutterXs = gridSpacingTokens.find(t => t.name === 'gridGutterXs');
            const gutterSm = gridSpacingTokens.find(t => t.name === 'gridGutterSm');
            const gutterMd = gridSpacingTokens.find(t => t.name === 'gridGutterMd');
            const gutterLg = gridSpacingTokens.find(t => t.name === 'gridGutterLg');
            expect(gutterXs?.primitiveReferences.spacing).toBe('space200'); // 16px
            expect(gutterSm?.primitiveReferences.spacing).toBe('space250'); // 20px
            expect(gutterMd?.primitiveReferences.spacing).toBe('space300'); // 24px
            expect(gutterLg?.primitiveReferences.spacing).toBe('space400'); // 32px
            const marginXs = gridSpacingTokens.find(t => t.name === 'gridMarginXs');
            const marginSm = gridSpacingTokens.find(t => t.name === 'gridMarginSm');
            const marginMd = gridSpacingTokens.find(t => t.name === 'gridMarginMd');
            const marginLg = gridSpacingTokens.find(t => t.name === 'gridMarginLg');
            expect(marginXs?.primitiveReferences.spacing).toBe('space300'); // 24px
            expect(marginSm?.primitiveReferences.spacing).toBe('space300'); // 24px (using existing token)
            expect(marginMd?.primitiveReferences.spacing).toBe('space400'); // 32px
            expect(marginLg?.primitiveReferences.spacing).toBe('space500'); // 40px
        });
    });
    describe('Web Platform Generation', () => {
        it('should generate grid spacing tokens for web with proper CSS custom property naming', () => {
            const result = generator.generateWebTokens();
            expect(result.valid).toBe(true);
            // Check gutter tokens
            expect(result.content).toContain('--grid-gutter-xs:');
            expect(result.content).toContain('--grid-gutter-sm:');
            expect(result.content).toContain('--grid-gutter-md:');
            expect(result.content).toContain('--grid-gutter-lg:');
            // Check margin tokens
            expect(result.content).toContain('--grid-margin-xs:');
            expect(result.content).toContain('--grid-margin-sm:');
            expect(result.content).toContain('--grid-margin-md:');
            expect(result.content).toContain('--grid-margin-lg:');
            // Check native tokens
            expect(result.content).toContain('--grid-gutter-native:');
            expect(result.content).toContain('--grid-margin-native:');
        });
        it('should reference primitive spacing tokens using CSS var() syntax', () => {
            const result = generator.generateWebTokens();
            // Grid spacing tokens should reference primitive spacing tokens
            // Example: --grid-gutter-xs: var(--space-200);
            expect(result.content).toMatch(/--grid-gutter-xs:\s*var\(--space-200\)/);
            expect(result.content).toMatch(/--grid-gutter-sm:\s*var\(--space-250\)/);
            expect(result.content).toMatch(/--grid-gutter-md:\s*var\(--space-300\)/);
            expect(result.content).toMatch(/--grid-gutter-lg:\s*var\(--space-400\)/);
        });
        it('should include grid spacing tokens in semantic token count', () => {
            const result = generator.generateWebTokens();
            // Semantic token count should include the 10 grid spacing tokens
            expect(result.semanticTokenCount).toBeGreaterThanOrEqual(10);
        });
    });
    describe('iOS Platform Generation', () => {
        it('should generate grid spacing tokens for iOS with camelCase naming', () => {
            const result = generator.generateiOSTokens();
            expect(result.valid).toBe(true);
            // Check gutter tokens (camelCase)
            expect(result.content).toContain('gridGutterXs');
            expect(result.content).toContain('gridGutterSm');
            expect(result.content).toContain('gridGutterMd');
            expect(result.content).toContain('gridGutterLg');
            // Check margin tokens (camelCase)
            expect(result.content).toContain('gridMarginXs');
            expect(result.content).toContain('gridMarginSm');
            expect(result.content).toContain('gridMarginMd');
            expect(result.content).toContain('gridMarginLg');
            // Check native tokens (camelCase)
            expect(result.content).toContain('gridGutterNative');
            expect(result.content).toContain('gridMarginNative');
        });
        it('should include grid spacing tokens in semantic token count', () => {
            const result = generator.generateiOSTokens();
            // Semantic token count should include the 10 grid spacing tokens
            expect(result.semanticTokenCount).toBeGreaterThanOrEqual(10);
        });
    });
    describe('Android Platform Generation', () => {
        it('should generate grid spacing tokens for Android with snake_case naming', () => {
            const result = generator.generateAndroidTokens();
            expect(result.valid).toBe(true);
            // Check gutter tokens (snake_case)
            expect(result.content).toContain('grid_gutter_xs');
            expect(result.content).toContain('grid_gutter_sm');
            expect(result.content).toContain('grid_gutter_md');
            expect(result.content).toContain('grid_gutter_lg');
            // Check margin tokens (snake_case)
            expect(result.content).toContain('grid_margin_xs');
            expect(result.content).toContain('grid_margin_sm');
            expect(result.content).toContain('grid_margin_md');
            expect(result.content).toContain('grid_margin_lg');
            // Check native tokens (snake_case)
            expect(result.content).toContain('grid_gutter_native');
            expect(result.content).toContain('grid_margin_native');
        });
        it('should include grid spacing tokens in semantic token count', () => {
            const result = generator.generateAndroidTokens();
            // Semantic token count should include the 10 grid spacing tokens
            expect(result.semanticTokenCount).toBeGreaterThanOrEqual(10);
        });
    });
    describe('Cross-Platform Consistency', () => {
        it('should generate same grid spacing token count across all platforms', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // All platforms should have the same semantic token count
            expect(webResult.semanticTokenCount).toBe(iosResult.semanticTokenCount);
            expect(iosResult.semanticTokenCount).toBe(androidResult.semanticTokenCount);
            // All platforms should be valid
            expect(webResult.valid).toBe(true);
            expect(iosResult.valid).toBe(true);
            expect(androidResult.valid).toBe(true);
        });
        it('should maintain primitive token references across platforms', () => {
            const results = generator.generateAll();
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
    });
    describe('Naming Convention Validation', () => {
        it('should use kebab-case with -- prefix for web CSS custom properties', () => {
            const result = generator.generateWebTokens();
            // All grid spacing tokens should follow --grid-* pattern
            const gridTokenMatches = result.content.match(/--grid-[a-z-]+:/g);
            expect(gridTokenMatches).toBeTruthy();
            expect(gridTokenMatches.length).toBeGreaterThanOrEqual(10);
            // Verify no camelCase in CSS custom properties
            expect(result.content).not.toMatch(/--gridGutter/);
            expect(result.content).not.toMatch(/--gridMargin/);
        });
        it('should use camelCase for iOS Swift constants', () => {
            const result = generator.generateiOSTokens();
            // All grid spacing tokens should use camelCase
            expect(result.content).toMatch(/gridGutterXs/);
            expect(result.content).toMatch(/gridGutterSm/);
            expect(result.content).toMatch(/gridMarginNative/);
            // Verify no kebab-case in Swift
            expect(result.content).not.toMatch(/grid-gutter/);
            expect(result.content).not.toMatch(/grid-margin/);
        });
        it('should use snake_case for Android Kotlin constants', () => {
            const result = generator.generateAndroidTokens();
            // All grid spacing tokens should use snake_case
            expect(result.content).toMatch(/grid_gutter_xs/);
            expect(result.content).toMatch(/grid_gutter_sm/);
            expect(result.content).toMatch(/grid_margin_native/);
            // Verify no camelCase or kebab-case in Kotlin
            expect(result.content).not.toMatch(/gridGutter/);
            expect(result.content).not.toMatch(/grid-gutter/);
        });
    });
});
//# sourceMappingURL=GridSpacingTokenGeneration.test.js.map