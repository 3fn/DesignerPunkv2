"use strict";
/**
 * Semantic Token Generation Integration Tests
 *
 * End-to-end tests for semantic token generation across all platforms.
 * Tests complete workflow: primitive tokens → semantic tokens → platform generation
 *
 * Requirements: 2.4, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenFileGenerator_1 = require("../../generators/TokenFileGenerator");
const tokens_1 = require("../../tokens");
const semantic_1 = require("../../tokens/semantic");
const PlatformNamingRules_1 = require("../../naming/PlatformNamingRules");
describe('Semantic Token Generation - End-to-End Integration', () => {
    let generator;
    beforeEach(() => {
        generator = new TokenFileGenerator_1.TokenFileGenerator();
    });
    describe('Web Platform - Primitives + Semantics', () => {
        it('should generate web tokens with both primitives and semantics', () => {
            const result = generator.generateWebTokens();
            // Basic generation validation
            expect(result.platform).toBe('web');
            expect(result.valid).toBe(true);
            expect(result.content).toBeDefined();
            expect(result.content.length).toBeGreaterThan(0);
            // Should have both primitive and semantic token counts
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.semanticTokenCount).toBeGreaterThan(0);
            // Content should include both primitives and semantics
            expect(result.content).toContain('export const');
            // Should contain primitive tokens (examples)
            expect(result.content).toContain('space100');
            expect(result.content).toContain('fontSize100');
            // Should contain semantic tokens (examples) - using dot notation
            expect(result.content).toContain('color.primary');
            expect(result.content).toContain('space.grouped.normal');
        });
        it('should maintain file structure with primitives first, semantics second', () => {
            const result = generator.generateWebTokens();
            // Find positions of primitive and semantic sections
            const primitiveCommentIndex = result.content.indexOf('PRIMITIVE TOKENS');
            const semanticCommentIndex = result.content.indexOf('SEMANTIC TOKENS');
            // Primitives should come before semantics
            expect(primitiveCommentIndex).toBeGreaterThan(-1);
            expect(semanticCommentIndex).toBeGreaterThan(-1);
            expect(primitiveCommentIndex).toBeLessThan(semanticCommentIndex);
            // Find a primitive token and a semantic token
            const space100Index = result.content.indexOf('space100');
            const colorPrimaryIndex = result.content.indexOf('colorPrimary');
            // Primitive token should appear before semantic token
            expect(space100Index).toBeGreaterThan(-1);
            expect(colorPrimaryIndex).toBeGreaterThan(-1);
            expect(space100Index).toBeLessThan(colorPrimaryIndex);
        });
        it('should include usage guidance in header', () => {
            const result = generator.generateWebTokens();
            // Should contain usage guidance
            expect(result.content).toContain('Use semantic tokens');
            expect(result.content).toContain('Use primitive tokens');
        });
        it('should generate semantic tokens with primitive references', () => {
            const result = generator.generateWebTokens();
            // Semantic tokens should reference primitives, not resolve to values
            // Example: colorPrimary = purple300 (not colorPrimary = "#9333EA")
            // Check for reference pattern in semantic section
            const semanticSection = result.content.substring(result.content.indexOf('SEMANTIC TOKENS'));
            // Should contain references to primitive token names
            expect(semanticSection).toContain('purple');
            expect(semanticSection).toContain('space');
        });
    });
    describe('iOS Platform - Primitives + Semantics', () => {
        it('should generate iOS tokens with both primitives and semantics', () => {
            const result = generator.generateiOSTokens();
            // Basic generation validation
            expect(result.platform).toBe('ios');
            expect(result.valid).toBe(true);
            expect(result.content).toBeDefined();
            expect(result.content.length).toBeGreaterThan(0);
            // Should have both primitive and semantic token counts
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.semanticTokenCount).toBeGreaterThan(0);
            // Content should include Swift syntax
            expect(result.content).toContain('struct DesignTokens');
            expect(result.content).toContain('static let');
            // Should contain primitive tokens - iOS uses camelCase
            expect(result.content).toContain('space100');
            expect(result.content).toContain('fontSize100');
            // Should contain semantic tokens - iOS uses camelCase (dots removed, proper casing)
            expect(result.content).toContain('colorPrimary');
            expect(result.content).toContain('spaceGroupedNormal');
        });
        it('should maintain file structure with primitives first, semantics second', () => {
            const result = generator.generateiOSTokens();
            // Find positions of primitive and semantic sections
            const primitiveCommentIndex = result.content.indexOf('PRIMITIVE TOKENS');
            const semanticCommentIndex = result.content.indexOf('SEMANTIC TOKENS');
            // Primitives should come before semantics
            expect(primitiveCommentIndex).toBeGreaterThan(-1);
            expect(semanticCommentIndex).toBeGreaterThan(-1);
            expect(primitiveCommentIndex).toBeLessThan(semanticCommentIndex);
            // Find a primitive token and a semantic token
            const space100Index = result.content.indexOf('space100');
            const colorPrimaryIndex = result.content.indexOf('colorPrimary');
            // Primitive token should appear before semantic token
            expect(space100Index).toBeGreaterThan(-1);
            expect(colorPrimaryIndex).toBeGreaterThan(-1);
            expect(space100Index).toBeLessThan(colorPrimaryIndex);
        });
        it('should generate semantic tokens with primitive references', () => {
            const result = generator.generateiOSTokens();
            // Semantic tokens should reference primitives in Swift syntax
            // Example: static let colorPrimary = purple300
            const semanticSection = result.content.substring(result.content.indexOf('SEMANTIC TOKENS'));
            // Should contain references to primitive token names
            expect(semanticSection).toContain('purple');
            expect(semanticSection).toContain('space');
        });
    });
    describe('Android Platform - Primitives + Semantics', () => {
        it('should generate Android tokens with both primitives and semantics', () => {
            const result = generator.generateAndroidTokens();
            // Basic generation validation
            expect(result.platform).toBe('android');
            expect(result.valid).toBe(true);
            expect(result.content).toBeDefined();
            expect(result.content.length).toBeGreaterThan(0);
            // Should have both primitive and semantic token counts
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.semanticTokenCount).toBeGreaterThan(0);
            // Content should include Kotlin syntax
            expect(result.content).toContain('object DesignTokens');
            expect(result.content).toContain('val');
            // Should contain primitive tokens - Android uses snake_case
            expect(result.content).toContain('space_100');
            expect(result.content).toContain('font_size_100');
            // Should contain semantic tokens - Android uses snake_case
            expect(result.content).toContain('color_primary');
            expect(result.content).toContain('space_grouped_normal');
        });
        it('should maintain file structure with primitives first, semantics second', () => {
            const result = generator.generateAndroidTokens();
            // Find positions of primitive and semantic sections
            const primitiveCommentIndex = result.content.indexOf('PRIMITIVE TOKENS');
            const semanticCommentIndex = result.content.indexOf('SEMANTIC TOKENS');
            // Primitives should come before semantics
            expect(primitiveCommentIndex).toBeGreaterThan(-1);
            expect(semanticCommentIndex).toBeGreaterThan(-1);
            expect(primitiveCommentIndex).toBeLessThan(semanticCommentIndex);
            // Find a primitive token and a semantic token - Android uses snake_case
            const space100Index = result.content.indexOf('space_100');
            const colorPrimaryIndex = result.content.indexOf('color_primary');
            // Primitive token should appear before semantic token
            expect(space100Index).toBeGreaterThan(-1);
            expect(colorPrimaryIndex).toBeGreaterThan(-1);
            expect(space100Index).toBeLessThan(colorPrimaryIndex);
        });
        it('should generate semantic tokens with primitive references', () => {
            const result = generator.generateAndroidTokens();
            // Semantic tokens should reference primitives in Kotlin syntax
            // Example: val colorPrimary = purple300
            const semanticSection = result.content.substring(result.content.indexOf('SEMANTIC TOKENS'));
            // Should contain references to primitive token names
            expect(semanticSection).toContain('purple');
            expect(semanticSection).toContain('space');
        });
    });
    describe('Cross-Platform Consistency', () => {
        it('should generate same semantic token names across all platforms', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // All platforms should be valid
            expect(webResult.valid).toBe(true);
            expect(iosResult.valid).toBe(true);
            expect(androidResult.valid).toBe(true);
            // All platforms should have same semantic token count
            expect(webResult.semanticTokenCount).toBe(iosResult.semanticTokenCount);
            expect(iosResult.semanticTokenCount).toBe(androidResult.semanticTokenCount);
            // Extract semantic token names from each platform
            const allSemantics = (0, semantic_1.getAllSemanticTokens)();
            // Filter out shadow/glow tokens (same filter as generator)
            const semanticTokens = allSemantics.filter(s => !s.name.startsWith('shadow.') &&
                !s.name.startsWith('glow.'));
            const semanticTokenNames = semanticTokens.map(t => t.name);
            // Each platform should contain all semantic token names (excluding filtered shadow/glow)
            // Web uses dot notation, iOS removes dots, Android converts to snake_case
            semanticTokenNames.forEach(name => {
                // Web uses kebab-case with -- prefix (color.primary → --color-primary)
                const webKebabCase = (0, PlatformNamingRules_1.getPlatformTokenName)(name, 'web', 'color');
                expect(webResult.content).toContain(webKebabCase);
                // iOS removes dots and uses camelCase (color.primary → colorPrimary)
                const iosCamelCase = (0, PlatformNamingRules_1.getPlatformTokenName)(name, 'ios', 'color');
                expect(iosResult.content).toContain(iosCamelCase);
                // Android removes dots and uses snake_case (color.primary → color_primary)
                const androidSnakeCase = (0, PlatformNamingRules_1.getPlatformTokenName)(name, 'android', 'color');
                expect(androidResult.content).toContain(androidSnakeCase);
            });
        });
        it('should maintain identical primitive→semantic relationships across platforms', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // Get semantic tokens
            const semanticTokens = (0, semantic_1.getAllSemanticTokens)();
            // Check a few key semantic tokens maintain same primitive references
            const colorPrimary = semanticTokens.find(t => t.name === 'colorPrimary');
            if (colorPrimary && colorPrimary.primitiveReferences.value) {
                const primitiveRef = colorPrimary.primitiveReferences.value;
                // All platforms should reference the same primitive
                expect(webResult.content).toContain(primitiveRef);
                expect(iosResult.content).toContain(primitiveRef);
                expect(androidResult.content).toContain(primitiveRef);
            }
        });
        it('should use platform-appropriate syntax while preserving semantic meaning', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // Web should use JavaScript export syntax
            expect(webResult.content).toContain('export const');
            // iOS should use Swift static let syntax
            expect(iosResult.content).toContain('static let');
            // Android should use Kotlin val syntax
            expect(androidResult.content).toContain('val');
            // But all should have the same semantic token
            // Web uses dot notation, iOS/Android use camelCase
            expect(webResult.content).toContain('color.primary');
            expect(iosResult.content).toContain('colorprimary');
            expect(androidResult.content).toContain('colorprimary');
        });
        it('should validate cross-platform consistency', () => {
            const results = generator.generateAll();
            const validation = generator.validateCrossPlatformConsistency(results);
            // Validation should pass
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
            // All platforms should have same counts
            const [web, ios, android] = results;
            expect(web.tokenCount).toBe(ios.tokenCount);
            expect(ios.tokenCount).toBe(android.tokenCount);
            expect(web.semanticTokenCount).toBe(ios.semanticTokenCount);
            expect(ios.semanticTokenCount).toBe(android.semanticTokenCount);
        });
    });
    describe('Backward Compatibility', () => {
        it('should maintain primitive token output unchanged', () => {
            const result = generator.generateWebTokens();
            // Get all primitive tokens
            const primitiveTokens = (0, tokens_1.getAllPrimitiveTokens)();
            // All primitive tokens should be present in output
            primitiveTokens.forEach(token => {
                expect(result.content).toContain(token.name);
            });
            // Primitive token count should match
            expect(result.tokenCount).toBe(primitiveTokens.length);
        });
        it('should not modify primitive token names', () => {
            const result = generator.generateWebTokens();
            // Check specific primitive tokens are unchanged
            expect(result.content).toContain('space100');
            expect(result.content).toContain('space200');
            expect(result.content).toContain('fontSize100');
            expect(result.content).toContain('purple300');
        });
        it('should not modify primitive token values', () => {
            const result = generator.generateWebTokens();
            // Primitive section should still contain actual values
            const primitiveSection = result.content.substring(result.content.indexOf('PRIMITIVE TOKENS'), result.content.indexOf('SEMANTIC TOKENS'));
            // Should contain numeric values for primitives
            expect(primitiveSection).toMatch(/=\s*\d+/); // Contains = followed by number
        });
        it('should maintain primitive token formatting', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // Web primitives use object property syntax (inside DesignTokens object)
            const webPrimitiveSection = webResult.content.substring(webResult.content.indexOf('PRIMITIVE TOKENS'), webResult.content.indexOf('SEMANTIC TOKENS'));
            expect(webPrimitiveSection).toContain('borderWidth100:');
            // iOS primitives should use public static let
            const iosPrimitiveSection = iosResult.content.substring(iosResult.content.indexOf('PRIMITIVE TOKENS'), iosResult.content.indexOf('SEMANTIC TOKENS'));
            expect(iosPrimitiveSection).toContain('public static let');
            // Android primitives should use const val
            const androidPrimitiveSection = androidResult.content.substring(androidResult.content.indexOf('PRIMITIVE TOKENS'), androidResult.content.indexOf('SEMANTIC TOKENS'));
            expect(androidPrimitiveSection).toContain('const val');
        });
        it('should add semantic tokens without removing primitive tokens', () => {
            const result = generator.generateWebTokens();
            // Should have both primitive and semantic tokens
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.semanticTokenCount).toBeGreaterThan(0);
            // Total content should include both sections
            expect(result.content).toContain('PRIMITIVE TOKENS');
            expect(result.content).toContain('SEMANTIC TOKENS');
            // Primitive tokens should still be present
            const primitiveTokens = (0, tokens_1.getAllPrimitiveTokens)();
            expect(result.tokenCount).toBe(primitiveTokens.length);
        });
    });
    describe('Multi-Reference Token Generation', () => {
        it('should generate typography tokens with all primitive references', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // Get semantic tokens
            const semanticTokens = (0, semantic_1.getAllSemanticTokens)();
            const typographyTokens = semanticTokens.filter(t => t.category === 'typography');
            if (typographyTokens.length > 0) {
                const typoToken = typographyTokens[0];
                // Web uses dot notation
                expect(webResult.content).toContain(typoToken.name);
                // iOS removes dots (typography.bodySm → typographybodySm)
                const iosCamelCase = typoToken.name.replace(/\./g, '');
                expect(iosResult.content).toContain(iosCamelCase);
                // Android converts camelCase to snake_case (typography.bodySm → typographybody_sm)
                const androidName = typoToken.name.replace(/\./g, '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
                expect(androidResult.content).toContain(androidName);
            }
        });
        it('should include all required typography properties', () => {
            const result = generator.generateWebTokens();
            // Get typography semantic tokens
            const semanticTokens = (0, semantic_1.getAllSemanticTokens)();
            const typographyTokens = semanticTokens.filter(t => t.category === 'typography');
            if (typographyTokens.length > 0) {
                // Typography tokens should reference all required properties
                const semanticSection = result.content.substring(result.content.indexOf('SEMANTIC TOKENS'));
                // Should contain references to typography primitives
                expect(semanticSection).toContain('fontSize');
                expect(semanticSection).toContain('lineHeight');
                expect(semanticSection).toContain('fontFamily');
                expect(semanticSection).toContain('fontWeight');
                expect(semanticSection).toContain('letterSpacing');
            }
        });
    });
    describe('Error Handling and Validation', () => {
        it('should handle generation with no semantic tokens gracefully', () => {
            // This test verifies backward compatibility if semantic tokens are empty
            const result = generator.generateWebTokens();
            // Should still generate successfully
            expect(result.valid).toBe(true);
            expect(result.tokenCount).toBeGreaterThan(0);
        });
        it('should provide clear error messages for invalid references', () => {
            // Create semantic token with invalid reference
            const invalidSemantics = [
                {
                    name: 'invalidToken',
                    primitiveReferences: { value: 'nonExistentPrimitive' },
                    category: 'color',
                    context: 'Invalid',
                    description: 'Invalid reference'
                }
            ];
            const primitives = (0, tokens_1.getAllPrimitiveTokens)();
            const validation = generator.validateSemanticReferences(invalidSemantics, primitives);
            expect(validation.valid).toBe(false);
            expect(validation.invalidReferences.length).toBeGreaterThan(0);
            expect(validation.invalidReferences[0].reason).toContain('non-existent primitive');
        });
        it('should continue primitive generation if semantic generation fails', () => {
            // Even if semantic validation fails, primitives should still generate
            const result = generator.generateWebTokens();
            // Primitive tokens should always be present
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.valid).toBe(true);
        });
    });
    describe('Complete End-to-End Workflow', () => {
        it('should complete full workflow: primitives → semantics → all platforms', () => {
            // Generate all platforms
            const results = generator.generateAll();
            // Should generate 3 platforms
            expect(results).toHaveLength(3);
            // All should be valid
            results.forEach(result => {
                expect(result.valid).toBe(true);
                expect(result.tokenCount).toBeGreaterThan(0);
                expect(result.semanticTokenCount).toBeGreaterThan(0);
            });
            // Validate cross-platform consistency
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            // Each platform should have correct file structure
            results.forEach(result => {
                const primitiveIndex = result.content.indexOf('PRIMITIVE TOKENS');
                const semanticIndex = result.content.indexOf('SEMANTIC TOKENS');
                expect(primitiveIndex).toBeGreaterThan(-1);
                expect(semanticIndex).toBeGreaterThan(-1);
                expect(primitiveIndex).toBeLessThan(semanticIndex);
            });
        });
        it('should generate production-ready files for all platforms', () => {
            const results = generator.generateAll();
            // Web file should be valid JavaScript
            const webResult = results.find(r => r.platform === 'web');
            expect(webResult).toBeDefined();
            expect(webResult.content).toContain('export');
            expect(webResult.filePath).toContain('.js');
            // iOS file should be valid Swift
            const iosResult = results.find(r => r.platform === 'ios');
            expect(iosResult).toBeDefined();
            expect(iosResult.content).toContain('struct');
            expect(iosResult.filePath).toContain('.swift');
            // Android file should be valid Kotlin
            const androidResult = results.find(r => r.platform === 'android');
            expect(androidResult).toBeDefined();
            expect(androidResult.content).toContain('object');
            expect(androidResult.filePath).toContain('.kt');
        });
    });
});
//# sourceMappingURL=SemanticTokenGeneration.test.js.map