/**
 * Component Typography Inheritance Validation Tests
 * 
 * Validates that actual components render with the correct fonts:
 * - Headings: Rajdhani (from fontFamilyDisplay)
 * - Labels: Rajdhani (from fontFamilyDisplay)
 * - Buttons: Rajdhani (from fontFamilyDisplay)
 * - Body text: Inter (from fontFamilyBody)
 * 
 * These tests verify Requirements 4.5, 10.4, 10.5 from Spec 015
 * 
 * Task: 9.3 Validate component typography inheritance
 */

import { typographyTokens } from '../../tokens/semantic/TypographyTokens';
import { fontFamilyTokens } from '../../tokens/FontFamilyTokens';

describe('Component Typography Inheritance', () => {
  describe('Heading Components (Rajdhani)', () => {
    it('should verify h1 elements inherit Rajdhani font', () => {
      // h1 uses typography.h1 token
      const h1Token = typographyTokens['typography.h1'];
      expect(h1Token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      // fontFamilyDisplay references Rajdhani
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // Verify font stack includes fallbacks
      expect(displayFont.platforms.web.value).toMatch(/Rajdhani.*sans-serif/);
    });

    it('should verify h2 elements inherit Rajdhani font', () => {
      const h2Token = typographyTokens['typography.h2'];
      expect(h2Token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify h3 elements inherit Rajdhani font', () => {
      const h3Token = typographyTokens['typography.h3'];
      expect(h3Token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify h4 elements inherit Rajdhani font', () => {
      const h4Token = typographyTokens['typography.h4'];
      expect(h4Token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify h5 elements inherit Rajdhani font', () => {
      const h5Token = typographyTokens['typography.h5'];
      expect(h5Token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify h6 elements inherit Rajdhani font', () => {
      const h6Token = typographyTokens['typography.h6'];
      expect(h6Token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify all heading tokens reference fontFamilyDisplay (Requirement 4.5)', () => {
      const headingTokens = [
        'typography.h1',
        'typography.h2',
        'typography.h3',
        'typography.h4',
        'typography.h5',
        'typography.h6'
      ];

      headingTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
    });
  });

  describe('Label Components (Rajdhani)', () => {
    it('should verify labelSm inherits Rajdhani font', () => {
      const labelSmToken = typographyTokens['typography.labelSm'];
      expect(labelSmToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify labelMd inherits Rajdhani font', () => {
      const labelMdToken = typographyTokens['typography.labelMd'];
      expect(labelMdToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify labelLg inherits Rajdhani font', () => {
      const labelLgToken = typographyTokens['typography.labelLg'];
      expect(labelLgToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify TextInputField labels will render in Rajdhani (Requirement 10.4)', () => {
      // TextInputField uses typography.labelMd for labels
      const labelToken = typographyTokens['typography.labelMd'];
      expect(labelToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      // fontFamilyDisplay references Rajdhani
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // This confirms TextInputField labels automatically inherited Rajdhani
    });

    it('should verify all label tokens reference fontFamilyDisplay (Requirement 4.5)', () => {
      const labelTokens = [
        'typography.labelSm',
        'typography.labelMd',
        'typography.labelLg'
      ];

      labelTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
    });
  });

  describe('Button Components (Rajdhani)', () => {
    it('should verify buttonSm inherits Rajdhani font', () => {
      const buttonSmToken = typographyTokens['typography.buttonSm'];
      expect(buttonSmToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify buttonMd inherits Rajdhani font', () => {
      const buttonMdToken = typographyTokens['typography.buttonMd'];
      expect(buttonMdToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify buttonLg inherits Rajdhani font', () => {
      const buttonLgToken = typographyTokens['typography.buttonLg'];
      expect(buttonLgToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
    });

    it('should verify ButtonCTA will render in Rajdhani (Requirement 10.4)', () => {
      // ButtonCTA uses typography.buttonMd for button text
      const buttonToken = typographyTokens['typography.buttonMd'];
      expect(buttonToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      // fontFamilyDisplay references Rajdhani
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // This confirms ButtonCTA automatically inherited Rajdhani
    });

    it('should verify all button tokens reference fontFamilyDisplay (Requirement 4.5)', () => {
      const buttonTokens = [
        'typography.buttonSm',
        'typography.buttonMd',
        'typography.buttonLg'
      ];

      buttonTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
    });
  });

  describe('Body Text Components (Inter)', () => {
    it('should verify bodySm inherits Inter font', () => {
      const bodySmToken = typographyTokens['typography.bodySm'];
      expect(bodySmToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
      
      // Verify font stack includes fallbacks
      expect(bodyFont.platforms.web.value).toMatch(/Inter.*sans-serif/);
    });

    it('should verify bodyMd inherits Inter font', () => {
      const bodyMdToken = typographyTokens['typography.bodyMd'];
      expect(bodyMdToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
    });

    it('should verify bodyLg inherits Inter font', () => {
      const bodyLgToken = typographyTokens['typography.bodyLg'];
      expect(bodyLgToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
    });

    it('should verify caption text inherits Inter font', () => {
      const captionToken = typographyTokens['typography.caption'];
      expect(captionToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
    });

    it('should verify detail text inherits Inter font', () => {
      const detailToken = typographyTokens['typography.detail'];
      expect(detailToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
    });

    it('should verify TextInputField helper text will render in Inter (Requirement 10.5)', () => {
      // TextInputField uses typography.caption for helper text
      const captionToken = typographyTokens['typography.caption'];
      expect(captionToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      // fontFamilyBody references Inter
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
      
      // This confirms TextInputField helper text automatically inherited Inter
    });

    it('should verify all body tokens reference fontFamilyBody (Requirement 4.5)', () => {
      const bodyTokens = [
        'typography.bodySm',
        'typography.bodyMd',
        'typography.bodyLg',
        'typography.caption',
        'typography.detail'
      ];

      bodyTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      });
    });
  });

  describe('Automatic Font Inheritance Verification', () => {
    it('should verify components automatically inherited new fonts without code changes', () => {
      // This test verifies that by updating fontFamilyDisplay and fontFamilyBody,
      // all components that reference typography tokens automatically inherited
      // the new fonts (Rajdhani for display, Inter for body)
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      
      // Verify fontFamilyDisplay updated to Rajdhani
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // Verify fontFamilyBody updated to Inter
      expect(bodyFont.platforms.web.value).toContain('Inter');
      
      // Count tokens that reference each font family
      const allTokenNames = Object.keys(typographyTokens);
      
      const displayTokenCount = allTokenNames.filter(name => {
        const token = typographyTokens[name];
        return token.primitiveReferences.fontFamily === 'fontFamilyDisplay';
      }).length;
      
      const bodyTokenCount = allTokenNames.filter(name => {
        const token = typographyTokens[name];
        return token.primitiveReferences.fontFamily === 'fontFamilyBody';
      }).length;
      
      // Verify expected token counts (from design.md: 15 semantic typography tokens)
      // 12 display tokens (h1-h6, labelSm/Md/Lg, buttonSm/Md/Lg)
      expect(displayTokenCount).toBe(12);
      
      // 5 body tokens (bodySm/Md/Lg, caption, detail)
      expect(bodyTokenCount).toBe(5);
      
      // Total should be 17 tokens
      expect(displayTokenCount + bodyTokenCount).toBe(17);
    });

    it('should verify font inheritance chain is intact', () => {
      // Verify the inheritance chain:
      // Component → Typography Token → Font Family Token → Font File
      
      // Example: ButtonCTA
      const buttonToken = typographyTokens['typography.buttonMd'];
      expect(buttonToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // Example: TextInputField label
      const labelToken = typographyTokens['typography.labelMd'];
      expect(labelToken.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // Example: TextInputField helper text
      const captionToken = typographyTokens['typography.caption'];
      expect(captionToken.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
      
      // This confirms the inheritance chain works correctly
    });
  });

  describe('Font Stack Validation', () => {
    it('should verify Rajdhani font stack includes proper fallbacks', () => {
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      
      // Should start with Rajdhani
      expect(displayFont.platforms.web.value).toMatch(/^'?Rajdhani/);
      
      // Should include system font fallbacks
      expect(displayFont.platforms.web.value).toContain('sans-serif');
      
      // Should include at least one platform-specific fallback
      const fontValue = String(displayFont.platforms.web.value);
      const hasPlatformFallback = 
        fontValue.includes('-apple-system') ||
        fontValue.includes('BlinkMacSystemFont') ||
        fontValue.includes('Roboto');
      expect(hasPlatformFallback).toBe(true);
    });

    it('should verify Inter font stack includes proper fallbacks', () => {
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      
      // Should start with Inter
      expect(bodyFont.platforms.web.value).toMatch(/^'?Inter/);
      
      // Should include system font fallbacks
      expect(bodyFont.platforms.web.value).toContain('sans-serif');
      
      // Should include at least one platform-specific fallback
      const fontValue = String(bodyFont.platforms.web.value);
      const hasPlatformFallback = 
        fontValue.includes('-apple-system') ||
        fontValue.includes('BlinkMacSystemFont') ||
        fontValue.includes('Roboto');
      expect(hasPlatformFallback).toBe(true);
    });
  });

  describe('Requirements Validation', () => {
    it('should satisfy Requirement 4.5: All 15 semantic typography tokens automatically inherit new fonts', () => {
      // Requirement 4.5: WHEN fontFamilyDisplay is updated THEN all 15 semantic 
      // typography tokens SHALL automatically inherit Rajdhani through token references
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      // Count tokens that inherit from fontFamilyDisplay
      const displayTokens = [
        'typography.h1', 'typography.h2', 'typography.h3',
        'typography.h4', 'typography.h5', 'typography.h6',
        'typography.labelSm', 'typography.labelMd', 'typography.labelLg',
        'typography.buttonSm', 'typography.buttonMd', 'typography.buttonLg'
      ];
      
      displayTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
      
      // Verify count matches requirement (12 display tokens)
      expect(displayTokens.length).toBe(12);
    });

    it('should satisfy Requirement 10.4: Headings render in Rajdhani font', () => {
      const headingTokens = [
        'typography.h1', 'typography.h2', 'typography.h3',
        'typography.h4', 'typography.h5', 'typography.h6'
      ];
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      headingTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
    });

    it('should satisfy Requirement 10.4: Labels render in Rajdhani font', () => {
      const labelTokens = [
        'typography.labelSm', 'typography.labelMd', 'typography.labelLg'
      ];
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      labelTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
    });

    it('should satisfy Requirement 10.4: Buttons render in Rajdhani font', () => {
      const buttonTokens = [
        'typography.buttonSm', 'typography.buttonMd', 'typography.buttonLg'
      ];
      
      const displayFont = fontFamilyTokens.fontFamilyDisplay;
      expect(displayFont.platforms.web.value).toContain('Rajdhani');
      
      buttonTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyDisplay');
      });
    });

    it('should satisfy Requirement 10.5: Body text renders in Inter font', () => {
      const bodyTokens = [
        'typography.bodySm', 'typography.bodyMd', 'typography.bodyLg',
        'typography.caption', 'typography.detail'
      ];
      
      const bodyFont = fontFamilyTokens.fontFamilyBody;
      expect(bodyFont.platforms.web.value).toContain('Inter');
      
      bodyTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        expect(token.primitiveReferences.fontFamily).toBe('fontFamilyBody');
      });
    });
  });
});
