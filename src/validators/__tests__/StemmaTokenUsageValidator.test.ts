/**
 * StemmaTokenUsageValidator Tests
 * 
 * Tests for the token usage validation functionality that detects
 * inline styles, hardcoded values, and validates token usage patterns.
 * 
 * @see src/validators/StemmaTokenUsageValidator.ts
 */

import {
  validateTokenUsage,
  validateAgainstSchema,
  detectPlatform,
  formatTokenUsageErrors,
  formatTokenUsageWarnings,
  TokenUsageValidationResult,
  TokenUsageError,
  TokenUsageWarning,
  TOKEN_CATEGORIES,
} from '../StemmaTokenUsageValidator';

describe('StemmaTokenUsageValidator', () => {
  describe('Platform Detection', () => {
    it('should detect web platform from file path', () => {
      expect(detectPlatform('src/components/Button/platforms/web/Button.web.ts')).toBe('web');
      expect(detectPlatform('src/components/Button/platforms/web/styles.css')).toBe('web');
    });

    it('should detect iOS platform from file path', () => {
      expect(detectPlatform('src/components/Button/platforms/ios/Button.ios.swift')).toBe('ios');
      expect(detectPlatform('src/components/Button/Button.swift')).toBe('ios');
    });

    it('should detect Android platform from file path', () => {
      expect(detectPlatform('src/components/Button/platforms/android/Button.android.kt')).toBe('android');
      expect(detectPlatform('src/components/Button/Button.kt')).toBe('android');
    });

    it('should return unknown for unrecognized platform', () => {
      expect(detectPlatform('src/components/Button/Button.ts')).toBe('unknown');
      expect(detectPlatform('src/utils/helpers.js')).toBe('unknown');
    });
  });

  describe('Inline Style Detection - Web', () => {
    it('should detect inline color styles', () => {
      const code = `
        .button {
          color: #FF0000;
          background-color: rgb(255, 0, 0);
        }
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_COLOR')).toBe(true);
    });

    it('should detect inline spacing styles', () => {
      const code = `
        .button {
          padding: 16px;
          margin: 8px;
        }
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_SPACING')).toBe(true);
    });

    it('should detect inline typography styles', () => {
      const code = `
        .button {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        }
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_TYPOGRAPHY')).toBe(true);
    });

    it('should detect inline border styles', () => {
      const code = `
        .button {
          border-radius: 4px;
          border-width: 1px;
        }
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_BORDER')).toBe(true);
    });
  });

  describe('Inline Style Detection - iOS', () => {
    it('should detect Color usage', () => {
      const code = `
        .foregroundColor(Color(red: 1.0, green: 0, blue: 0))
        .background(Color(#FF0000))
      `;
      const result = validateTokenUsage(code, 'Button.ios.swift');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_COLOR')).toBe(true);
    });

    it('should detect inline spacing values', () => {
      const code = `
        .padding(16)
        .frame(width: 100, height: 50)
      `;
      const result = validateTokenUsage(code, 'Button.ios.swift');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_SPACING')).toBe(true);
    });

    it('should detect inline font usage', () => {
      const code = `
        .font(.system(size: 14))
        Font.system(size: 16)
      `;
      const result = validateTokenUsage(code, 'Button.ios.swift');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_TYPOGRAPHY')).toBe(true);
    });

    it('should detect inline border radius', () => {
      const code = `
        .cornerRadius(8)
        RoundedRectangle(cornerRadius: 12)
      `;
      const result = validateTokenUsage(code, 'Button.ios.swift');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_BORDER')).toBe(true);
    });
  });

  describe('Inline Style Detection - Android', () => {
    it('should detect Color class usage', () => {
      const code = `
        Color(0xFFFF0000)
        Color.rgb(255, 0, 0)
      `;
      const result = validateTokenUsage(code, 'Button.android.kt');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_COLOR')).toBe(true);
    });

    it('should detect dp/sp values', () => {
      const code = `
        .padding(16.dp)
        .width(100.dp)
      `;
      const result = validateTokenUsage(code, 'Button.android.kt');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_SPACING')).toBe(true);
    });

    it('should detect inline typography values', () => {
      const code = `
        fontSize = 14.sp
        lineHeight = 20.sp
      `;
      const result = validateTokenUsage(code, 'Button.android.kt');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_TYPOGRAPHY')).toBe(true);
    });

    it('should detect inline border radius', () => {
      const code = `
        RoundedCornerShape(8.dp)
        .clip(RoundedCornerShape(12.dp))
      `;
      const result = validateTokenUsage(code, 'Button.android.kt');
      expect(result.errors.some(e => e.code === 'INLINE_STYLE_BORDER')).toBe(true);
    });
  });

  describe('Hardcoded Value Detection', () => {
    it('should detect hex color values', () => {
      const code = `const primary = #3498db;`;
      const result = validateTokenUsage(code, 'Button.web.ts');
      expect(result.errors.some(e => e.code === 'HARDCODED_COLOR')).toBe(true);
    });

    it('should detect rgb/rgba color values in CSS', () => {
      const code = `color: rgba(52, 152, 219, 0.5);`;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.some(e => e.code.includes('COLOR'))).toBe(true);
    });
  });

  describe('Workaround Pattern Detection', () => {
    it('should warn about opacity workarounds', () => {
      const code = `opacity: 0.5;`;
      const result = validateTokenUsage(code, 'Button.web.ts');
      expect(result.warnings.some(w => w.code === 'OPACITY_WORKAROUND')).toBe(true);
    });

    it('should warn about filter brightness workarounds', () => {
      const code = `filter: brightness(1.1);`;
      const result = validateTokenUsage(code, 'Button.web.ts');
      expect(result.warnings.some(w => w.code === 'FILTERBRIGHTNESS_WORKAROUND')).toBe(true);
    });

    it('should warn about iOS scaleEffect workarounds', () => {
      const code = `.scaleEffect(0.95)`;
      const result = validateTokenUsage(code, 'Button.ios.swift');
      expect(result.warnings.some(w => w.code === 'SCALEEFFECT_WORKAROUND')).toBe(true);
    });

    it('should warn about Android ripple workarounds', () => {
      const code = `rememberRipple(bounded = true)`;
      const result = validateTokenUsage(code, 'Button.android.kt');
      expect(result.warnings.some(w => w.code === 'RIPPLE_WORKAROUND')).toBe(true);
    });
  });

  describe('Token Reference Counting', () => {
    it('should count CSS variable references', () => {
      const code = `
        .button {
          color: var(--color-primary);
          padding: var(--space-md);
        }
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.stats.tokenReferencesFound).toBeGreaterThan(0);
    });

    it('should count iOS token references', () => {
      const code = `
        let color = DesignTokens.color.primary
        let spacing = Tokens.spacing.md
      `;
      const result = validateTokenUsage(code, 'Button.ios.swift');
      expect(result.stats.tokenReferencesFound).toBeGreaterThan(0);
    });

    it('should count Android token references', () => {
      const code = `
        val color = DesignTokens.color.primary
        val spacing = MaterialTheme.spacing.md
      `;
      const result = validateTokenUsage(code, 'Button.android.kt');
      expect(result.stats.tokenReferencesFound).toBeGreaterThan(0);
    });
  });

  describe('Schema Validation', () => {
    it('should validate token dependencies against schema', () => {
      const code = `
        // Using tokens from schema
        val color = DesignTokens.color.primary
      `;
      const schemaTokens = ['color.primary', 'color.secondary'];
      const result = validateAgainstSchema(code, 'Button.android.kt', schemaTokens);
      // Should find color.primary but not color.secondary
      expect(result.errors.some(e => e.code === 'MISSING_REQUIRED_TOKEN')).toBe(true);
    });

    it('should report missing required tokens', () => {
      const code = `
        // Missing required token usage
        const styles = {};
      `;
      const schemaTokens = ['color.primary'];
      const result = validateAgainstSchema(code, 'Button.web.ts', schemaTokens);
      expect(result.errors.some(e => e.code === 'MISSING_REQUIRED_TOKEN')).toBe(true);
    });

    it('should pass when all required tokens are present', () => {
      const code = `
        color: var(--color-primary);
        background: var(--color-secondary);
      `;
      const schemaTokens = ['color-primary', 'color-secondary'];
      const result = validateAgainstSchema(code, 'Button.web.css', schemaTokens);
      const missingTokenErrors = result.errors.filter(e => e.code === 'MISSING_REQUIRED_TOKEN');
      expect(missingTokenErrors.length).toBe(0);
    });
  });

  describe('Suggestion Generation', () => {
    it('should provide suggestions for color violations', () => {
      const code = `color: #3498db;`;
      const result = validateTokenUsage(code, 'Button.web.css');
      const colorError = result.errors.find(e => e.code.includes('COLOR'));
      expect(colorError?.suggestion).toBeDefined();
      expect(colorError?.suggestion).toContain('color');
    });

    it('should provide suggestions for spacing violations', () => {
      const code = `padding: 16px;`;
      const result = validateTokenUsage(code, 'Button.web.css');
      const spacingError = result.errors.find(e => e.code.includes('SPACING'));
      expect(spacingError?.suggestion).toBeDefined();
      expect(spacingError?.suggestion).toContain('space');
    });
  });

  describe('Error Formatting', () => {
    it('should format errors with line numbers', () => {
      const code = `line1\ncolor: #FF0000;\nline3`;
      const result = validateTokenUsage(code, 'Button.web.css');
      const error = result.errors.find(e => e.code.includes('COLOR'));
      expect(error?.line).toBe(2);
    });

    it('should include matched value in error snippet', () => {
      const code = `color: #FF0000;`;
      const result = validateTokenUsage(code, 'Button.web.css');
      const error = result.errors.find(e => e.code.includes('COLOR'));
      expect(error?.snippet).toBeDefined();
    });

    it('should format errors for display', () => {
      const code = `color: #FF0000;`;
      const result = validateTokenUsage(code, 'Button.web.css');
      const formatted = formatTokenUsageErrors(result);
      expect(formatted).toContain('violation');
      expect(formatted).toContain('Line');
    });

    it('should format warnings for display', () => {
      const code = `opacity: 0.5;`;
      const result = validateTokenUsage(code, 'Button.web.ts');
      const formatted = formatTokenUsageWarnings(result);
      expect(formatted).toContain('Warning');
    });
  });

  describe('Validation Result Structure', () => {
    it('should return complete validation result', () => {
      const code = `color: #FF0000;`;
      const result = validateTokenUsage(code, 'Button.web.css');
      
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('filePath');
    });

    it('should be valid when no errors', () => {
      const code = `
        /* Using CSS variables */
        .button {
          color: var(--color-primary);
        }
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      // May have warnings but should be valid if no errors
      expect(result.valid).toBe(result.errors.length === 0);
    });

    it('should be invalid when errors exist', () => {
      const code = `color: #FF0000;`;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should include stats in result', () => {
      const code = `
        color: #FF0000;
        padding: 16px;
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.stats).toHaveProperty('linesAnalyzed');
      expect(result.stats).toHaveProperty('inlineStyleViolations');
      expect(result.stats).toHaveProperty('hardcodedValueViolations');
      expect(result.stats).toHaveProperty('tokenReferencesFound');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty code', () => {
      const result = validateTokenUsage('', 'Button.web.ts');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle code with only comments', () => {
      const code = `
        // This is a comment
        /* Multi-line
           comment */
      `;
      const result = validateTokenUsage(code, 'Button.web.ts');
      expect(result.valid).toBe(true);
    });

    it('should not flag token references as hardcoded values', () => {
      const code = `
        color: var(--color-primary);
        padding: var(--space-md);
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.filter(e => e.code === 'HARDCODED_COLOR')).toHaveLength(0);
    });

    it('should handle mixed valid and invalid code', () => {
      const code = `
        color: var(--color-primary);
        background: #FF0000;
        padding: var(--space-md);
        margin: 16px;
      `;
      const result = validateTokenUsage(code, 'Button.web.css');
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.stats.tokenReferencesFound).toBeGreaterThan(0);
    });
  });

  describe('TOKEN_CATEGORIES', () => {
    it('should have color category', () => {
      expect(TOKEN_CATEGORIES.color).toBeDefined();
      expect(TOKEN_CATEGORIES.color.length).toBeGreaterThan(0);
    });

    it('should have spacing category', () => {
      expect(TOKEN_CATEGORIES.spacing).toBeDefined();
      expect(TOKEN_CATEGORIES.spacing.length).toBeGreaterThan(0);
    });

    it('should have typography category', () => {
      expect(TOKEN_CATEGORIES.typography).toBeDefined();
      expect(TOKEN_CATEGORIES.typography.length).toBeGreaterThan(0);
    });

    it('should have border category', () => {
      expect(TOKEN_CATEGORIES.border).toBeDefined();
      expect(TOKEN_CATEGORIES.border.length).toBeGreaterThan(0);
    });

    it('should have blend category', () => {
      expect(TOKEN_CATEGORIES.blend).toBeDefined();
      expect(TOKEN_CATEGORIES.blend.length).toBeGreaterThan(0);
    });
  });
});
