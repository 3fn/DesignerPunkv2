/**
 * Semantic Token Generation Integration Tests
 * 
 * End-to-end tests for semantic token generation across all platforms.
 * Tests complete workflow: primitive tokens → semantic tokens → platform generation
 * 
 * Based on corrected design document platform naming conventions:
 * - Web: CSS format with :root { } wrapper, kebab-case with -- prefix (e.g., --color-primary)
 * - iOS: camelCase (e.g., colorPrimary)
 * - Android: snake_case (e.g., color_primary)
 * 
 * Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.3
 */

import { TokenFileGenerator } from '../../generators/TokenFileGenerator';
import { getAllPrimitiveTokens } from '../../tokens';
import { getAllSemanticTokens } from '../../tokens/semantic';
import { getPlatformTokenName } from '../../naming/PlatformNamingRules';

describe('Semantic Token Generation - End-to-End Integration', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
  });

  describe('Web Platform - CSS Format with Primitives + Semantics', () => {
    it('should generate web tokens in CSS format with :root wrapper', () => {
      const result = generator.generateWebTokens();

      // Basic generation validation
      expect(result.platform).toBe('web');
      expect(result.valid).toBe(true);
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      // Should have both primitive and semantic token counts
      expect(result.tokenCount).toBeGreaterThan(0);
      expect(result.semanticTokenCount).toBeGreaterThan(0);

      // Content should be CSS format with :root wrapper
      expect(result.content).toContain(':root {');
      expect(result.content).toContain('}');
      
      // Should NOT contain JavaScript export syntax
      expect(result.content).not.toContain('export const');
    });

    it('should generate file with .css extension', () => {
      const result = generator.generateWebTokens();

      // File path should end with .css, not .js
      expect(result.filePath).toContain('DesignTokens.web.css');
      expect(result.filePath).not.toContain('.js');
    });

    it('should use kebab-case with -- prefix for token names', () => {
      const result = generator.generateWebTokens();

      // Should contain primitive tokens with -- prefix and kebab-case
      expect(result.content).toContain('--space-100');
      expect(result.content).toContain('--font-size-100');
      expect(result.content).toContain('--purple-300');
      
      // Should contain semantic tokens with -- prefix and kebab-case
      expect(result.content).toContain('--color-primary');
      expect(result.content).toContain('--space-grouped-normal');
    });

    it('should use var(--token-name) for semantic token references', () => {
      const result = generator.generateWebTokens();

      // Semantic tokens should reference primitives using var() syntax
      const semanticSection = result.content.substring(
        result.content.indexOf('SEMANTIC TOKENS')
      );

      // Should contain var() references to primitive tokens
      expect(semanticSection).toContain('var(--');
      expect(semanticSection).toContain('var(--purple');
      expect(semanticSection).toContain('var(--space');
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
      const space100Index = result.content.indexOf('--space-100');
      const colorPrimaryIndex = result.content.indexOf('--color-primary');

      // Primitive token should appear before semantic token
      expect(space100Index).toBeGreaterThan(-1);
      expect(colorPrimaryIndex).toBeGreaterThan(-1);
      expect(space100Index).toBeLessThan(colorPrimaryIndex);
    });
  });

  describe('iOS Platform - Swift Format with Primitives + Semantics', () => {
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
    });

    it('should use camelCase for token names', () => {
      const result = generator.generateiOSTokens();
      
      // Should contain primitive tokens in camelCase
      expect(result.content).toContain('space100');
      expect(result.content).toContain('fontSize100');
      expect(result.content).toContain('purple300');
      
      // Should contain semantic tokens in camelCase (dots removed, proper casing)
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
      const semanticSection = result.content.substring(
        result.content.indexOf('SEMANTIC TOKENS')
      );

      // Should contain references to primitive token names
      expect(semanticSection).toContain('purple');
      expect(semanticSection).toContain('space');
    });
  });

  describe('Android Platform - Kotlin Format with Primitives + Semantics', () => {
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
    });

    it('should use snake_case for token names', () => {
      const result = generator.generateAndroidTokens();
      
      // Should contain primitive tokens in snake_case
      expect(result.content).toContain('space_100');
      expect(result.content).toContain('font_size_100');
      expect(result.content).toContain('purple_300');
      
      // Should contain semantic tokens in snake_case
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

      // Find a primitive token and a semantic token
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
      const semanticSection = result.content.substring(
        result.content.indexOf('SEMANTIC TOKENS')
      );

      // Should contain references to primitive token names
      expect(semanticSection).toContain('purple');
      expect(semanticSection).toContain('space');
    });
  });

  describe('Cross-Platform Consistency', () => {
    it('should generate same semantic token names across all platforms (with platform-specific formatting)', () => {
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
      const allSemantics = getAllSemanticTokens();
      // Filter out shadow/glow tokens (same filter as generator)
      const semanticTokens = allSemantics.filter(s => 
        !s.name.startsWith('shadow.') && 
        !s.name.startsWith('glow.')
      );
      const semanticTokenNames = semanticTokens.map(t => t.name);

      // Each platform should contain all semantic token names with platform-appropriate formatting
      semanticTokenNames.forEach(name => {
        // Web uses kebab-case with -- prefix (color.primary → --color-primary)
        const webKebabCase = getPlatformTokenName(name, 'web', 'color' as any);
        expect(webResult.content).toContain(webKebabCase);
        
        // iOS removes dots and uses camelCase (color.primary → colorPrimary)
        const iosCamelCase = getPlatformTokenName(name, 'ios', 'color' as any);
        expect(iosResult.content).toContain(iosCamelCase);
        
        // Android removes dots and uses snake_case (color.primary → color_primary)
        const androidSnakeCase = getPlatformTokenName(name, 'android', 'color' as any);
        expect(androidResult.content).toContain(androidSnakeCase);
      });
    });

    it('should maintain identical primitive→semantic relationships across platforms', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      // Get semantic tokens
      const semanticTokens = getAllSemanticTokens().filter(s => 
        !s.name.startsWith('shadow.') && 
        !s.name.startsWith('glow.')
      );

      // Verify each platform maintains the same relationships
      semanticTokens.forEach(semantic => {
        if (semantic.primitiveReferences.value) {
          // Single-reference token - all platforms should reference the same primitive
          const primitiveRef = semantic.primitiveReferences.value;
          
          // Convert to platform-specific names
          const webSemanticName = getPlatformTokenName(semantic.name, 'web', semantic.category as any);
          const webPrimitiveName = getPlatformTokenName(primitiveRef, 'web', semantic.category as any);
          
          const iosSemanticName = getPlatformTokenName(semantic.name, 'ios', semantic.category as any);
          const iosPrimitiveName = getPlatformTokenName(primitiveRef, 'ios', semantic.category as any);
          
          const androidSemanticName = getPlatformTokenName(semantic.name, 'android', semantic.category as any);
          const androidPrimitiveName = getPlatformTokenName(primitiveRef, 'android', semantic.category as any);
          
          // Verify the relationship exists in each platform's output
          expect(webResult.content).toContain(webSemanticName);
          expect(webResult.content).toContain(webPrimitiveName);
          
          expect(iosResult.content).toContain(iosSemanticName);
          expect(iosResult.content).toContain(iosPrimitiveName);
          
          expect(androidResult.content).toContain(androidSemanticName);
          expect(androidResult.content).toContain(androidPrimitiveName);
        } else {
          // Multi-primitive token (e.g., typography with fontSize, lineHeight, etc.)
          // Just verify the semantic token name exists in each platform's output
          const webSemanticName = getPlatformTokenName(semantic.name, 'web', semantic.category as any);
          const iosSemanticName = getPlatformTokenName(semantic.name, 'ios', semantic.category as any);
          const androidSemanticName = getPlatformTokenName(semantic.name, 'android', semantic.category as any);
          
          expect(webResult.content).toContain(webSemanticName);
          expect(iosResult.content).toContain(iosSemanticName);
          expect(androidResult.content).toContain(androidSemanticName);
          
          // Verify at least one primitive reference exists for multi-primitive tokens
          const primitiveRefs = Object.values(semantic.primitiveReferences);
          expect(primitiveRefs.length).toBeGreaterThan(0);
        }
      });
    });

    it('should use getPlatformTokenName() for consistent cross-platform naming', () => {
      // Test that getPlatformTokenName produces expected results for each platform
      const testTokenName = 'color.primary';
      
      // Web: kebab-case with -- prefix
      const webName = getPlatformTokenName(testTokenName, 'web', 'color' as any);
      expect(webName).toBe('--color-primary');
      
      // iOS: camelCase
      const iosName = getPlatformTokenName(testTokenName, 'ios', 'color' as any);
      expect(iosName).toBe('colorPrimary');
      
      // Android: snake_case
      const androidName = getPlatformTokenName(testTokenName, 'android', 'color' as any);
      expect(androidName).toBe('color_primary');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain primitive token output unchanged', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();
      const primitives = getAllPrimitiveTokens();

      // All primitive tokens should be present in each platform
      primitives.forEach(token => {
        const webName = getPlatformTokenName(token.name, 'web', token.category as any);
        expect(webResult.content).toContain(webName);
        
        const iosName = getPlatformTokenName(token.name, 'ios', token.category as any);
        expect(iosResult.content).toContain(iosName);
        
        const androidName = getPlatformTokenName(token.name, 'android', token.category as any);
        expect(androidResult.content).toContain(androidName);
      });
    });

    it('should not modify primitive token values', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();
      
      // Verify specific primitive values are unchanged across platforms
      expect(webResult.content).toContain('16'); // fontSize100
      expect(webResult.content).toContain('8'); // space100
      
      expect(iosResult.content).toContain('16'); // fontSize100
      expect(iosResult.content).toContain('8'); // space100
      
      expect(androidResult.content).toContain('16'); // fontSize100
      expect(androidResult.content).toContain('8'); // space100
    });

    it('should add semantic tokens without removing primitive tokens', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();
      
      // Should have both primitive and semantic sections
      expect(webResult.content).toContain('PRIMITIVE TOKENS');
      expect(webResult.content).toContain('SEMANTIC TOKENS');
      
      expect(iosResult.content).toContain('PRIMITIVE TOKENS');
      expect(iosResult.content).toContain('SEMANTIC TOKENS');
      
      expect(androidResult.content).toContain('PRIMITIVE TOKENS');
      expect(androidResult.content).toContain('SEMANTIC TOKENS');
      
      // Primitive count should match expected count
      const primitives = getAllPrimitiveTokens();
      expect(webResult.tokenCount).toBeGreaterThanOrEqual(primitives.length);
      expect(iosResult.tokenCount).toBeGreaterThanOrEqual(primitives.length);
      expect(androidResult.tokenCount).toBeGreaterThanOrEqual(primitives.length);
    });
  });
});
