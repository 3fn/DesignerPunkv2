"use strict";
/**
 * Breakpoint Token Generation Tests
 *
 * Tests that breakpoint tokens are correctly generated for all platforms
 * with proper unit conversion (px, pt, dp).
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenFileGenerator_1 = require("../TokenFileGenerator");
const tokens_1 = require("../../tokens");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
describe('Breakpoint Token Generation', () => {
    let generator;
    beforeEach(() => {
        generator = new TokenFileGenerator_1.TokenFileGenerator();
    });
    describe('Breakpoint Token Availability', () => {
        it('should have breakpoint tokens in the token registry', () => {
            const breakpointTokens = (0, tokens_1.getTokensByCategory)(PrimitiveToken_1.TokenCategory.BREAKPOINT);
            expect(breakpointTokens).toBeDefined();
            expect(breakpointTokens.length).toBe(4);
            // Verify all four breakpoint tokens exist
            const tokenNames = breakpointTokens.map(t => t.name);
            expect(tokenNames).toContain('breakpointXs');
            expect(tokenNames).toContain('breakpointSm');
            expect(tokenNames).toContain('breakpointMd');
            expect(tokenNames).toContain('breakpointLg');
        });
        it('should have correct breakpoint values', () => {
            const breakpointTokens = (0, tokens_1.getTokensByCategory)(PrimitiveToken_1.TokenCategory.BREAKPOINT);
            const xs = breakpointTokens.find(t => t.name === 'breakpointXs');
            const sm = breakpointTokens.find(t => t.name === 'breakpointSm');
            const md = breakpointTokens.find(t => t.name === 'breakpointMd');
            const lg = breakpointTokens.find(t => t.name === 'breakpointLg');
            expect(xs?.baseValue).toBe(320);
            expect(sm?.baseValue).toBe(375);
            expect(md?.baseValue).toBe(1024);
            expect(lg?.baseValue).toBe(1440);
        });
    });
    describe('Web Platform Generation', () => {
        it('should generate breakpoint tokens for web with px units', () => {
            const result = generator.generateWebTokens();
            expect(result.valid).toBe(true);
            expect(result.content).toContain('--breakpoint-xs: 320px');
            expect(result.content).toContain('--breakpoint-sm: 375px');
            expect(result.content).toContain('--breakpoint-md: 1024px');
            expect(result.content).toContain('--breakpoint-lg: 1440px');
        });
        it('should include breakpoint tokens in token count', () => {
            const result = generator.generateWebTokens();
            // Token count should include the 4 breakpoint tokens
            expect(result.tokenCount).toBeGreaterThanOrEqual(4);
        });
        it('should include breakpoint category comment when grouping enabled', () => {
            const result = generator.generateWebTokens({
                groupByCategory: true,
                includeComments: true
            });
            expect(result.content).toContain('BREAKPOINT');
        });
    });
    describe('iOS Platform Generation', () => {
        it('should generate breakpoint tokens for iOS with pt units (CGFloat)', () => {
            const result = generator.generateiOSTokens();
            expect(result.valid).toBe(true);
            expect(result.content).toContain('public static let breakpointXs: CGFloat = 320');
            expect(result.content).toContain('public static let breakpointSm: CGFloat = 375');
            expect(result.content).toContain('public static let breakpointMd: CGFloat = 1024');
            expect(result.content).toContain('public static let breakpointLg: CGFloat = 1440');
        });
        it('should include breakpoint tokens in token count', () => {
            const result = generator.generateiOSTokens();
            // Token count should include the 4 breakpoint tokens
            expect(result.tokenCount).toBeGreaterThanOrEqual(4);
        });
    });
    describe('Android Platform Generation', () => {
        it('should generate breakpoint tokens for Android with dp units (Float)', () => {
            const result = generator.generateAndroidTokens();
            expect(result.valid).toBe(true);
            expect(result.content).toContain('const val breakpoint_xs: Float = 320f');
            expect(result.content).toContain('const val breakpoint_sm: Float = 375f');
            expect(result.content).toContain('const val breakpoint_md: Float = 1024f');
            expect(result.content).toContain('const val breakpoint_lg: Float = 1440f');
        });
        it('should include breakpoint tokens in token count', () => {
            const result = generator.generateAndroidTokens();
            // Token count should include the 4 breakpoint tokens
            expect(result.tokenCount).toBeGreaterThanOrEqual(4);
        });
    });
    describe('Cross-Platform Consistency', () => {
        it('should generate same breakpoint values across all platforms', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // All platforms should have the same token count
            expect(webResult.tokenCount).toBe(iosResult.tokenCount);
            expect(iosResult.tokenCount).toBe(androidResult.tokenCount);
            // All platforms should be valid
            expect(webResult.valid).toBe(true);
            expect(iosResult.valid).toBe(true);
            expect(androidResult.valid).toBe(true);
        });
        it('should maintain mathematical consistency across platforms', () => {
            const results = generator.generateAll();
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
    });
    describe('Unit Conversion', () => {
        it('should use correct units for each platform', () => {
            const breakpointTokens = (0, tokens_1.getTokensByCategory)(PrimitiveToken_1.TokenCategory.BREAKPOINT);
            breakpointTokens.forEach(token => {
                // Web should use px
                expect(token.platforms.web.unit).toBe('px');
                // iOS should use pt
                expect(token.platforms.ios.unit).toBe('pt');
                // Android should use dp
                expect(token.platforms.android.unit).toBe('dp');
            });
        });
        it('should maintain same numeric values across platforms', () => {
            const breakpointTokens = (0, tokens_1.getTokensByCategory)(PrimitiveToken_1.TokenCategory.BREAKPOINT);
            breakpointTokens.forEach(token => {
                const webValue = token.platforms.web.value;
                const iosValue = token.platforms.ios.value;
                const androidValue = token.platforms.android.value;
                // All platforms should have the same numeric value
                expect(webValue).toBe(iosValue);
                expect(iosValue).toBe(androidValue);
            });
        });
    });
});
//# sourceMappingURL=BreakpointTokenGeneration.test.js.map