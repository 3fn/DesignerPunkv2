"use strict";
/**
 * Accessibility Token Generation Tests
 *
 * Tests cross-platform generation of accessibility tokens (focus indicators)
 * for web CSS, iOS Swift, and Android Kotlin platforms.
 *
 * Validates:
 * - Platform-specific token generation
 * - Naming convention consistency
 * - Value consistency across platforms
 * - WCAG compliance documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenFileGenerator_1 = require("../TokenFileGenerator");
describe('Accessibility Token Generation', () => {
    let generator;
    beforeEach(() => {
        generator = new TokenFileGenerator_1.TokenFileGenerator();
    });
    describe('Web CSS Generation', () => {
        it('should generate CSS custom properties for accessibility tokens', () => {
            const result = generator.generateWebTokens();
            expect(result.valid).toBe(true);
            expect(result.content).toBeDefined();
            // Check for accessibility focus offset token
            expect(result.content).toContain('--accessibility-focus-offset');
            expect(result.content).toMatch(/--accessibility-focus-offset:\s*2px/);
        });
        it('should generate focus width token with correct value', () => {
            const result = generator.generateWebTokens();
            expect(result.content).toContain('--accessibility-focus-width');
            expect(result.content).toMatch(/--accessibility-focus-width:\s*2px/);
        });
        it('should generate focus color token referencing color primitive', () => {
            const result = generator.generateWebTokens();
            expect(result.content).toContain('--accessibility-focus-color');
            // Color should reference the primitive color token (purple300)
            expect(result.content).toMatch(/--accessibility-focus-color:\s*var\(--purple-300\)/);
        });
        it('should include WCAG comments when comments enabled', () => {
            const result = generator.generateWebTokens({
                includeComments: true
            });
            // Should contain WCAG references in comments
            expect(result.content).toMatch(/WCAG|2\.4\.7|Focus Visible/i);
        });
        it('should use kebab-case naming convention for CSS', () => {
            const result = generator.generateWebTokens();
            // CSS custom properties should use kebab-case
            expect(result.content).toContain('--accessibility-focus-offset');
            expect(result.content).toContain('--accessibility-focus-width');
            expect(result.content).toContain('--accessibility-focus-color');
            // Should NOT contain camelCase
            expect(result.content).not.toContain('accessibilityFocusOffset');
        });
    });
    describe('iOS Swift Generation', () => {
        it('should generate Swift constants for accessibility tokens', () => {
            const result = generator.generateiOSTokens();
            expect(result.valid).toBe(true);
            expect(result.content).toBeDefined();
            // Check for accessibility focus offset token
            expect(result.content).toContain('accessibilityFocusOffset');
            expect(result.content).toMatch(/let accessibilityFocusOffset:\s*CGFloat\s*=\s*2/);
        });
        it('should generate focus width token with CGFloat type', () => {
            const result = generator.generateiOSTokens();
            expect(result.content).toContain('accessibilityFocusWidth');
            expect(result.content).toMatch(/let accessibilityFocusWidth:\s*CGFloat\s*=\s*2/);
        });
        it('should generate focus color token referencing color primitive', () => {
            const result = generator.generateiOSTokens();
            expect(result.content).toContain('accessibilityFocusColor');
            // Color should reference the primitive color constant
            expect(result.content).toMatch(/let accessibilityFocusColor.*=.*purple300/);
        });
        it('should include WCAG comments when comments enabled', () => {
            const result = generator.generateiOSTokens({
                includeComments: true
            });
            // Should contain WCAG references in comments
            expect(result.content).toMatch(/WCAG|2\.4\.7|Focus Visible/i);
        });
        it('should use camelCase naming convention for Swift', () => {
            const result = generator.generateiOSTokens();
            // Swift constants should use camelCase
            expect(result.content).toContain('accessibilityFocusOffset');
            expect(result.content).toContain('accessibilityFocusWidth');
            expect(result.content).toContain('accessibilityFocusColor');
            // Should NOT contain kebab-case
            expect(result.content).not.toContain('accessibility-focus-offset');
        });
    });
    describe('Android Kotlin Generation', () => {
        it('should generate Kotlin constants for accessibility tokens', () => {
            const result = generator.generateAndroidTokens();
            expect(result.valid).toBe(true);
            expect(result.content).toBeDefined();
            // Check for accessibility focus offset token
            expect(result.content).toContain('accessibilityFocusOffset');
            expect(result.content).toMatch(/val accessibilityFocusOffset\s*=\s*2\.dp/);
        });
        it('should generate focus width token with dp unit', () => {
            const result = generator.generateAndroidTokens();
            expect(result.content).toContain('accessibilityFocusWidth');
            expect(result.content).toMatch(/val accessibilityFocusWidth\s*=\s*2\.dp/);
        });
        it('should generate focus color token referencing color primitive', () => {
            const result = generator.generateAndroidTokens();
            expect(result.content).toContain('accessibilityFocusColor');
            // Color should reference the primitive color constant
            expect(result.content).toMatch(/val accessibilityFocusColor\s*=\s*purple300/);
        });
        it('should include WCAG comments when comments enabled', () => {
            const result = generator.generateAndroidTokens({
                includeComments: true
            });
            // Should contain WCAG references in comments
            expect(result.content).toMatch(/WCAG|2\.4\.7|Focus Visible/i);
        });
        it('should use camelCase naming convention for Kotlin', () => {
            const result = generator.generateAndroidTokens();
            // Kotlin constants should use camelCase
            expect(result.content).toContain('accessibilityFocusOffset');
            expect(result.content).toContain('accessibilityFocusWidth');
            expect(result.content).toContain('accessibilityFocusColor');
            // Should NOT contain kebab-case
            expect(result.content).not.toContain('accessibility-focus-offset');
        });
    });
    describe('Cross-Platform Consistency', () => {
        it('should generate accessibility tokens for all platforms', () => {
            const results = generator.generateAll();
            expect(results).toHaveLength(3);
            // All platforms should include accessibility tokens
            results.forEach(result => {
                expect(result.valid).toBe(true);
                expect(result.content).toMatch(/accessibility.*focus.*offset/i);
                expect(result.content).toMatch(/accessibility.*focus.*width/i);
                expect(result.content).toMatch(/accessibility.*focus.*color/i);
            });
        });
        it('should maintain identical values across platforms', () => {
            const results = generator.generateAll();
            // Extract offset values from each platform
            const webOffset = results[0].content.match(/--accessibility-focus-offset:\s*(\d+)px/)?.[1];
            const iosOffset = results[1].content.match(/accessibilityFocusOffset:\s*CGFloat\s*=\s*(\d+)/)?.[1];
            const androidOffset = results[2].content.match(/accessibilityFocusOffset\s*=\s*(\d+)\.dp/)?.[1];
            // All platforms should have same offset value (2)
            expect(webOffset).toBe('2');
            expect(iosOffset).toBe('2');
            expect(androidOffset).toBe('2');
            // Extract width values from each platform
            const webWidth = results[0].content.match(/--accessibility-focus-width:\s*(\d+)px/)?.[1];
            const iosWidth = results[1].content.match(/accessibilityFocusWidth:\s*CGFloat\s*=\s*(\d+)/)?.[1];
            const androidWidth = results[2].content.match(/accessibilityFocusWidth\s*=\s*(\d+)\.dp/)?.[1];
            // All platforms should have same width value (2)
            expect(webWidth).toBe('2');
            expect(iosWidth).toBe('2');
            expect(androidWidth).toBe('2');
        });
        it('should reference same primitive color token across platforms', () => {
            const results = generator.generateAll();
            // All platforms should reference purple300 for focus color
            expect(results[0].content).toMatch(/--accessibility-focus-color:\s*var\(--purple-300\)/);
            expect(results[1].content).toMatch(/accessibilityFocusColor.*purple300/);
            expect(results[2].content).toMatch(/accessibilityFocusColor\s*=\s*purple300/);
        });
        it('should follow platform-specific naming conventions', () => {
            const results = generator.generateAll();
            // Web: kebab-case with -- prefix
            expect(results[0].content).toContain('--accessibility-focus-offset');
            expect(results[0].content).toContain('--accessibility-focus-width');
            expect(results[0].content).toContain('--accessibility-focus-color');
            // iOS: camelCase
            expect(results[1].content).toContain('accessibilityFocusOffset');
            expect(results[1].content).toContain('accessibilityFocusWidth');
            expect(results[1].content).toContain('accessibilityFocusColor');
            // Android: camelCase
            expect(results[2].content).toContain('accessibilityFocusOffset');
            expect(results[2].content).toContain('accessibilityFocusWidth');
            expect(results[2].content).toContain('accessibilityFocusColor');
        });
        it('should use platform-specific units', () => {
            const results = generator.generateAll();
            // Web: px units
            expect(results[0].content).toMatch(/--accessibility-focus-offset:\s*2px/);
            expect(results[0].content).toMatch(/--accessibility-focus-width:\s*2px/);
            // iOS: unitless CGFloat
            expect(results[1].content).toMatch(/accessibilityFocusOffset:\s*CGFloat\s*=\s*2/);
            expect(results[1].content).toMatch(/accessibilityFocusWidth:\s*CGFloat\s*=\s*2/);
            // Android: dp units
            expect(results[2].content).toMatch(/accessibilityFocusOffset\s*=\s*2\.dp/);
            expect(results[2].content).toMatch(/accessibilityFocusWidth\s*=\s*2\.dp/);
        });
        it('should validate cross-platform consistency', () => {
            const results = generator.generateAll();
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
    });
    describe('Platform-Specific Syntax', () => {
        it('should generate valid CSS syntax for web', () => {
            const result = generator.generateWebTokens();
            // CSS should have :root selector
            expect(result.content).toContain(':root');
            // CSS custom properties should have -- prefix
            expect(result.content).toMatch(/--accessibility-focus-offset:\s*2px;/);
            expect(result.content).toMatch(/--accessibility-focus-width:\s*2px;/);
            // CSS should use var() for color references
            expect(result.content).toMatch(/--accessibility-focus-color:\s*var\(--purple-300\);/);
        });
        it('should generate valid Swift syntax for iOS', () => {
            const result = generator.generateiOSTokens();
            // Swift should have struct definition
            expect(result.content).toContain('struct DesignTokens');
            // Swift should use static let
            expect(result.content).toMatch(/static let accessibilityFocusOffset:\s*CGFloat\s*=\s*2/);
            expect(result.content).toMatch(/static let accessibilityFocusWidth:\s*CGFloat\s*=\s*2/);
            // Swift should reference color constant
            expect(result.content).toMatch(/static let accessibilityFocusColor.*=.*purple300/);
        });
        it('should generate valid Kotlin syntax for Android', () => {
            const result = generator.generateAndroidTokens();
            // Kotlin should have object definition
            expect(result.content).toContain('object DesignTokens');
            // Kotlin should use const val
            expect(result.content).toMatch(/const val accessibilityFocusOffset\s*=\s*2\.dp/);
            expect(result.content).toMatch(/const val accessibilityFocusWidth\s*=\s*2\.dp/);
            // Kotlin should reference color constant
            expect(result.content).toMatch(/const val accessibilityFocusColor\s*=\s*purple300/);
        });
    });
    describe('WCAG Documentation', () => {
        it('should include WCAG 2.4.7 reference in comments', () => {
            const webResult = generator.generateWebTokens({ includeComments: true });
            const iosResult = generator.generateiOSTokens({ includeComments: true });
            const androidResult = generator.generateAndroidTokens({ includeComments: true });
            // All platforms should reference WCAG 2.4.7
            expect(webResult.content).toMatch(/2\.4\.7/);
            expect(iosResult.content).toMatch(/2\.4\.7/);
            expect(androidResult.content).toMatch(/2\.4\.7/);
        });
        it('should include Focus Visible criterion in comments', () => {
            const webResult = generator.generateWebTokens({ includeComments: true });
            const iosResult = generator.generateiOSTokens({ includeComments: true });
            const androidResult = generator.generateAndroidTokens({ includeComments: true });
            // All platforms should mention Focus Visible
            expect(webResult.content).toMatch(/Focus Visible/i);
            expect(iosResult.content).toMatch(/Focus Visible/i);
            expect(androidResult.content).toMatch(/Focus Visible/i);
        });
    });
    describe('Token Count Validation', () => {
        it('should include accessibility tokens in semantic token count', () => {
            const result = generator.generateWebTokens();
            // Semantic token count should include accessibility tokens
            expect(result.semanticTokenCount).toBeGreaterThan(0);
            // Should have at least 3 accessibility tokens (offset, width, color)
            const accessibilityTokenMatches = result.content.match(/accessibility-focus/g);
            expect(accessibilityTokenMatches).toBeTruthy();
            expect(accessibilityTokenMatches.length).toBeGreaterThanOrEqual(3);
        });
        it('should maintain consistent semantic token count across platforms', () => {
            const results = generator.generateAll();
            const semanticCounts = results.map(r => r.semanticTokenCount);
            const uniqueCounts = new Set(semanticCounts);
            // All platforms should have same semantic token count
            expect(uniqueCounts.size).toBe(1);
        });
    });
});
//# sourceMappingURL=AccessibilityTokenGeneration.test.js.map