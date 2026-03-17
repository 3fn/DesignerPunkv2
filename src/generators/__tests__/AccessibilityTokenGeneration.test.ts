/**
 * @category evergreen
 * @purpose Verify AccessibilityTokenGeneration generator produces correct output format
 */
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

import { TokenFileGenerator } from '../TokenFileGenerator';
import { defaultSemanticOptions } from './helpers/defaultSemanticOptions';

describe('Accessibility Token Generation', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
  });

  describe('Web CSS Generation', () => {
    it('should generate CSS custom properties for accessibility tokens', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());

      expect(result.valid).toBe(true);
      expect(result.content).toBeDefined();
      
      // Check for accessibility focus offset token
      expect(result.content).toContain('--accessibility-focus-offset');
      expect(result.content).toMatch(/--accessibility-focus-offset:\s*var\(--space-025\)/);
    });

    it('should generate focus width token with correct value', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());

      expect(result.content).toContain('--accessibility-focus-width');
      expect(result.content).toMatch(/--accessibility-focus-width:\s*var\(--border-width-200\)/);
    });

    it('should generate focus color token referencing color primitive', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());

      expect(result.content).toContain('--accessibility-focus-color');
      // Color tokens are now resolved to rgba values (Spec 080 D9 Option B)
      expect(result.content).toMatch(/--accessibility-focus-color:\s*rgba\(/);
    });

    it('should include WCAG comments when comments enabled', () => {
      const result = generator.generateWebTokens({ ...defaultSemanticOptions(), includeComments: true });

      // Should contain WCAG references in comments
      expect(result.content).toMatch(/WCAG|2\.4\.7|Focus Visible/i);
    });

    it('should use kebab-case naming convention for CSS', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());

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
      const result = generator.generateiOSTokens(defaultSemanticOptions());

      expect(result.valid).toBe(true);
      expect(result.content).toBeDefined();
      
      // Check for accessibility focus offset token
      expect(result.content).toContain('accessibilityFocusOffset');
      expect(result.content).toMatch(/let accessibilityFocusOffset\s*=\s*space025/);
    });

    it('should generate focus width token with CGFloat type', () => {
      const result = generator.generateiOSTokens(defaultSemanticOptions());

      expect(result.content).toContain('accessibilityFocusWidth');
      expect(result.content).toMatch(/let accessibilityFocusWidth\s*=\s*borderWidth200/);
    });

    it('should generate focus color token referencing color primitive', () => {
      const result = generator.generateiOSTokens(defaultSemanticOptions());

      expect(result.content).toContain('accessibilityFocusColor');
      // Color tokens are now resolved to UIColor values (Spec 080 D9 Option B)
      expect(result.content).toMatch(/accessibilityFocusColor.*UIColor\(/);
    });

    it('should include WCAG comments when comments enabled', () => {
      const result = generator.generateiOSTokens({ ...defaultSemanticOptions(), includeComments: true });

      // Should contain WCAG references in comments
      expect(result.content).toMatch(/WCAG|2\.4\.7|Focus Visible/i);
    });

    it('should use camelCase naming convention for Swift', () => {
      const result = generator.generateiOSTokens(defaultSemanticOptions());

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
      const result = generator.generateAndroidTokens(defaultSemanticOptions());

      expect(result.valid).toBe(true);
      expect(result.content).toBeDefined();
      
      // Check for accessibility focus offset token
      expect(result.content).toContain('accessibility_focus_offset');
      expect(result.content).toMatch(/val accessibility_focus_offset\s*=\s*space_025/);
    });

    it('should generate focus width token with dp unit', () => {
      const result = generator.generateAndroidTokens(defaultSemanticOptions());

      expect(result.content).toContain('accessibility_focus_width');
      expect(result.content).toMatch(/val accessibility_focus_width\s*=\s*border_width_200/);
    });

    it('should generate focus color token referencing color primitive', () => {
      const result = generator.generateAndroidTokens(defaultSemanticOptions());

      expect(result.content).toContain('accessibility_focus_color');
      // Color tokens are now resolved to Color.argb values (Spec 080 D9 Option B)
      expect(result.content).toMatch(/accessibility_focus_color\s*=\s*Color\.argb\(/);
    });

    it('should include WCAG comments when comments enabled', () => {
      const result = generator.generateAndroidTokens({ ...defaultSemanticOptions(), includeComments: true });

      // Should contain WCAG references in comments
      expect(result.content).toMatch(/WCAG|2\.4\.7|Focus Visible/i);
    });

    it('should use snake_case naming convention for Kotlin', () => {
      const result = generator.generateAndroidTokens(defaultSemanticOptions());

      // Kotlin constants should use snake_case
      expect(result.content).toContain('accessibility_focus_offset');
      expect(result.content).toContain('accessibility_focus_width');
      expect(result.content).toContain('accessibility_focus_color');
      
      // Should NOT contain kebab-case
      expect(result.content).not.toContain('accessibility-focus-offset');
    });
  });

  describe('Cross-Platform Consistency', () => {
    it('should generate accessibility tokens for all platforms', () => {
      const results = generator.generateAll(defaultSemanticOptions());

      expect(results).toHaveLength(3);
      
      // All platforms should include accessibility tokens
      results.forEach(result => {
        expect(result.valid).toBe(true);
        expect(result.content).toMatch(/accessibility.*focus.*offset/i);
        expect(result.content).toMatch(/accessibility.*focus.*width/i);
        expect(result.content).toMatch(/accessibility.*focus.*color/i);
      });
    });

    it('should maintain identical primitive references across platforms', () => {
      const results = generator.generateAll(defaultSemanticOptions());

      // All platforms should reference the same primitive tokens
      // Web uses CSS var() syntax, iOS/Android use direct references
      
      // Check offset references space025
      expect(results[0].content).toMatch(/--accessibility-focus-offset:\s*var\(--space-025\)/);
      expect(results[1].content).toMatch(/accessibilityFocusOffset\s*=\s*space025/);
      expect(results[2].content).toMatch(/accessibility_focus_offset\s*=\s*space_025/);

      // Check width references borderWidth200
      expect(results[0].content).toMatch(/--accessibility-focus-width:\s*var\(--border-width-200\)/);
      expect(results[1].content).toMatch(/accessibilityFocusWidth\s*=\s*borderWidth200/);
      expect(results[2].content).toMatch(/accessibility_focus_width\s*=\s*border_width_200/);
    });

    it('should reference same primitive color token across platforms', () => {
      const results = generator.generateAll(defaultSemanticOptions());

      // All platforms should output resolved color values (Spec 080 D9 Option B)
      expect(results[0].content).toMatch(/--accessibility-focus-color:\s*rgba\(/);
      expect(results[1].content).toMatch(/accessibilityFocusColor.*UIColor\(/);
      expect(results[2].content).toMatch(/accessibility_focus_color\s*=\s*Color\.argb\(/);
    });

    it('should follow platform-specific naming conventions', () => {
      const results = generator.generateAll(defaultSemanticOptions());

      // Web: kebab-case with -- prefix
      expect(results[0].content).toContain('--accessibility-focus-offset');
      expect(results[0].content).toContain('--accessibility-focus-width');
      expect(results[0].content).toContain('--accessibility-focus-color');

      // iOS: camelCase
      expect(results[1].content).toContain('accessibilityFocusOffset');
      expect(results[1].content).toContain('accessibilityFocusWidth');
      expect(results[1].content).toContain('accessibilityFocusColor');

      // Android: snake_case
      expect(results[2].content).toContain('accessibility_focus_offset');
      expect(results[2].content).toContain('accessibility_focus_width');
      expect(results[2].content).toContain('accessibility_focus_color');
    });

    it('should reference primitive tokens (not resolved values)', () => {
      const results = generator.generateAll(defaultSemanticOptions());

      // Semantic tokens should reference primitive tokens, not resolved values
      // This follows compositional architecture pattern
      
      // Web: CSS var() references
      expect(results[0].content).toMatch(/--accessibility-focus-offset:\s*var\(--space-025\)/);
      expect(results[0].content).toMatch(/--accessibility-focus-width:\s*var\(--border-width-200\)/);

      // iOS: Direct primitive references
      expect(results[1].content).toMatch(/accessibilityFocusOffset\s*=\s*space025/);
      expect(results[1].content).toMatch(/accessibilityFocusWidth\s*=\s*borderWidth200/);

      // Android: Direct primitive references with snake_case
      expect(results[2].content).toMatch(/accessibility_focus_offset\s*=\s*space_025/);
      expect(results[2].content).toMatch(/accessibility_focus_width\s*=\s*border_width_200/);
    });

    it('should validate cross-platform consistency', () => {
      const results = generator.generateAll(defaultSemanticOptions());
      const validation = generator.validateCrossPlatformConsistency(results);

      expect(validation.consistent).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });
  });

  describe('Platform-Specific Syntax', () => {
    it('should generate valid CSS syntax for web', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());

      // CSS should have :root selector
      expect(result.content).toContain(':root');
      
      // CSS custom properties should have -- prefix and reference primitives (non-color)
      expect(result.content).toMatch(/--accessibility-focus-offset:\s*var\(--space-025\);/);
      expect(result.content).toMatch(/--accessibility-focus-width:\s*var\(--border-width-200\);/);
      
      // Color tokens are resolved to rgba values (Spec 080 D9 Option B)
      expect(result.content).toMatch(/--accessibility-focus-color:\s*rgba\(/);
    });

    it('should generate valid Swift syntax for iOS', () => {
      const result = generator.generateiOSTokens(defaultSemanticOptions());

      // Swift should have struct definition
      expect(result.content).toContain('struct DesignTokens');
      
      // Swift should use public static let and reference primitives (non-color)
      expect(result.content).toMatch(/public static let accessibilityFocusOffset\s*=\s*space025/);
      expect(result.content).toMatch(/public static let accessibilityFocusWidth\s*=\s*borderWidth200/);
      
      // Color tokens are resolved to UIColor values (Spec 080 D9 Option B)
      expect(result.content).toMatch(/accessibilityFocusColor.*UIColor\(/);
    });

    it('should generate valid Kotlin syntax for Android', () => {
      const result = generator.generateAndroidTokens(defaultSemanticOptions());

      // Kotlin should have object definition
      expect(result.content).toContain('object DesignTokens');
      
      // Kotlin should use val and reference primitives with snake_case (non-color)
      expect(result.content).toMatch(/val accessibility_focus_offset\s*=\s*space_025/);
      expect(result.content).toMatch(/val accessibility_focus_width\s*=\s*border_width_200/);
      
      // Color tokens are resolved to Color.argb values (Spec 080 D9 Option B)
      expect(result.content).toMatch(/accessibility_focus_color\s*=\s*Color\.argb\(/);
    });
  });

  describe('WCAG Documentation', () => {
    it('should include WCAG 2.4.7 reference in comments', () => {
      const webResult = generator.generateWebTokens({ ...defaultSemanticOptions(), includeComments: true });
      const iosResult = generator.generateiOSTokens({ ...defaultSemanticOptions(), includeComments: true });
      const androidResult = generator.generateAndroidTokens({ ...defaultSemanticOptions(), includeComments: true });

      // All platforms should reference WCAG 2.4.7
      expect(webResult.content).toMatch(/2\.4\.7/);
      expect(iosResult.content).toMatch(/2\.4\.7/);
      expect(androidResult.content).toMatch(/2\.4\.7/);
    });

    it('should include Focus Visible criterion in comments', () => {
      const webResult = generator.generateWebTokens({ ...defaultSemanticOptions(), includeComments: true });
      const iosResult = generator.generateiOSTokens({ ...defaultSemanticOptions(), includeComments: true });
      const androidResult = generator.generateAndroidTokens({ ...defaultSemanticOptions(), includeComments: true });

      // All platforms should mention Focus Visible
      expect(webResult.content).toMatch(/Focus Visible/i);
      expect(iosResult.content).toMatch(/Focus Visible/i);
      expect(androidResult.content).toMatch(/Focus Visible/i);
    });
  });

  describe('Token Count Validation', () => {
    it('should include accessibility tokens in semantic token count', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());

      // Semantic token count should include accessibility tokens
      expect(result.semanticTokenCount).toBeGreaterThan(0);
      
      // Should have at least 3 accessibility tokens (offset, width, color)
      const accessibilityTokenMatches = result.content.match(/accessibility-focus/g);
      expect(accessibilityTokenMatches).toBeTruthy();
      expect(accessibilityTokenMatches!.length).toBeGreaterThanOrEqual(3);
    });

    it('should maintain consistent semantic token count across platforms', () => {
      const results = generator.generateAll(defaultSemanticOptions());

      // Use validateCrossPlatformConsistency for nuanced comparison
      // This accounts for documented platform-specific tokens (e.g., Android elevation.none)
      const validation = generator.validateCrossPlatformConsistency(results);

      // Validation should pass (accounts for documented platform-specific tokens)
      expect(validation.consistent).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });
  });
});
