/**
 * Component Typography Token Structure Validation Tests
 * 
 * Validates typography token system integrity:
 * - All typography tokens reference valid primitive font family tokens
 * - Cross-platform consistency (same token references across platforms)
 * - Token structure follows semantic → primitive hierarchy
 * - Font stacks include proper fallbacks
 * 
 * These tests validate SYSTEM INTEGRITY, not design decisions.
 * Design decisions (which styles use which fonts) are flexible and can change.
 * 
 * These tests verify Requirements 4.5, 10.4, 10.5 from Spec 015
 * 
 * Task: 9.3 Validate component typography token structure
 */

import { typographyTokens } from '../../tokens/semantic/TypographyTokens';
import { fontFamilyTokens } from '../../tokens/FontFamilyTokens';

describe('Component Typography Token Structure', () => {
  describe('Token Structure Validation', () => {
    it('should verify all typography tokens reference valid primitive font family tokens', () => {
      const allTokenNames = Object.keys(typographyTokens);
      const validFontFamilyTokens = ['fontFamilyBody', 'fontFamilyDisplay', 'fontFamilyMono'];
      
      allTokenNames.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily reference is a valid primitive token
        expect(validFontFamilyTokens).toContain(fontFamilyRef);
        
        // Verify the referenced primitive token exists
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });

    it('should verify heading tokens (h1-h6) reference font family tokens', () => {
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
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily reference starts with 'fontFamily' (is a primitive token)
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the referenced token exists
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });
  });

  describe('Label Token Structure', () => {
    it('should verify label tokens reference valid font family tokens', () => {
      const labelTokens = [
        'typography.labelXs',
        'typography.labelSm',
        'typography.labelMd',
        'typography.labelMdFloat',
        'typography.labelLg'
      ];

      labelTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily reference is a primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the referenced token exists
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });
  });

  describe('Button Token Structure', () => {
    it('should verify button tokens reference valid font family tokens', () => {
      const buttonTokens = [
        'typography.buttonSm',
        'typography.buttonMd',
        'typography.buttonLg'
      ];

      buttonTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily reference is a primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the referenced token exists
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });
  });

  describe('Body Text Token Structure', () => {
    it('should verify body text tokens reference valid font family tokens', () => {
      const bodyTokens = [
        'typography.bodySm',
        'typography.bodyMd',
        'typography.bodyLg',
        'typography.caption',
        'typography.legal'
      ];

      bodyTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily reference is a primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the referenced token exists
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });
  });

  describe('Code Text Token Structure', () => {
    it('should verify code tokens reference valid font family tokens', () => {
      const codeTokens = [
        'typography.codeSm',
        'typography.codeMd',
        'typography.codeLg'
      ];

      codeTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily reference is a primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the referenced token exists
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });
  });

  describe('Token Inheritance Chain Validation', () => {
    it('should verify all typography tokens follow semantic → primitive hierarchy', () => {
      // Verify the inheritance chain:
      // Component → Typography Token → Font Family Token → Font File
      
      const allTokenNames = Object.keys(typographyTokens);
      
      allTokenNames.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify semantic token references a primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the primitive token exists
        const primitiveToken = fontFamilyTokens[fontFamilyRef];
        expect(primitiveToken).toBeDefined();
        
        // Verify primitive token has platform-specific values
        expect(primitiveToken.platforms.web).toBeDefined();
        expect(primitiveToken.platforms.web.value).toBeDefined();
      });
    });

    it('should verify token references are consistent (no hard-coded values)', () => {
      const allTokenNames = Object.keys(typographyTokens);
      
      allTokenNames.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify fontFamily is a token reference, not a hard-coded value
        // Token references start with 'fontFamily'
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify it's not a hard-coded font name
        expect(fontFamilyRef).not.toMatch(/Inter|Rajdhani|Arial|Helvetica/);
      });
    });
  });

  describe('Font Stack Validation', () => {
    it('should verify all font family tokens include proper fallbacks', () => {
      const fontFamilyTokenNames = Object.keys(fontFamilyTokens);
      
      fontFamilyTokenNames.forEach(tokenName => {
        const fontToken = fontFamilyTokens[tokenName];
        const fontValue = String(fontToken.platforms.web.value);
        
        // Should include generic font family fallback (sans-serif, serif, or monospace)
        const hasGenericFallback = 
          fontValue.includes('sans-serif') ||
          fontValue.includes('serif') ||
          fontValue.includes('monospace');
        expect(hasGenericFallback).toBe(true);
        
        // Should have at least 2 fonts in the stack (primary + fallback)
        const fontCount = fontValue.split(',').length;
        expect(fontCount).toBeGreaterThanOrEqual(2);
      });
    });

    it('should verify font stacks follow best practices', () => {
      const fontFamilyTokenNames = Object.keys(fontFamilyTokens);
      
      fontFamilyTokenNames.forEach(tokenName => {
        const fontToken = fontFamilyTokens[tokenName];
        const fontValue = String(fontToken.platforms.web.value);
        
        // Should not be empty
        expect(fontValue.length).toBeGreaterThan(0);
        
        // Should not have trailing commas
        expect(fontValue).not.toMatch(/,\s*$/);
        
        // Should not have leading commas
        expect(fontValue).not.toMatch(/^\s*,/);
      });
    });
  });

  describe('Cross-Platform Consistency', () => {
    it('should verify all typography tokens have consistent structure across platforms', () => {
      const allTokenNames = Object.keys(typographyTokens);
      
      allTokenNames.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify the primitive token has all required platforms
        const primitiveToken = fontFamilyTokens[fontFamilyRef];
        expect(primitiveToken.platforms.web).toBeDefined();
        expect(primitiveToken.platforms.ios).toBeDefined();
        expect(primitiveToken.platforms.android).toBeDefined();
        
        // Verify each platform has a value
        expect(primitiveToken.platforms.web.value).toBeDefined();
        expect(primitiveToken.platforms.ios.value).toBeDefined();
        expect(primitiveToken.platforms.android.value).toBeDefined();
      });
    });
  });

  describe('Requirements Validation', () => {
    it('should satisfy Requirement 4.5: Typography tokens automatically inherit fonts through token references', () => {
      // Requirement 4.5: WHEN fontFamily tokens are updated THEN all semantic 
      // typography tokens SHALL automatically inherit new fonts through token references
      
      const allTokenNames = Object.keys(typographyTokens);
      
      allTokenNames.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify semantic token references a primitive token (not hard-coded)
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        
        // Verify the primitive token exists and has values
        const primitiveToken = fontFamilyTokens[fontFamilyRef];
        expect(primitiveToken).toBeDefined();
        expect(primitiveToken.platforms.web.value).toBeDefined();
      });
    });

    it('should satisfy Requirement 10.4: Heading tokens reference valid font family tokens', () => {
      const headingTokens = [
        'typography.h1', 'typography.h2', 'typography.h3',
        'typography.h4', 'typography.h5', 'typography.h6'
      ];
      
      headingTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify heading references a valid primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });

    it('should satisfy Requirement 10.4: Label and button tokens reference valid font family tokens', () => {
      const uiTokens = [
        'typography.labelXs', 'typography.labelSm', 'typography.labelMd', 'typography.labelLg',
        'typography.buttonSm', 'typography.buttonMd', 'typography.buttonLg'
      ];
      
      uiTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify UI token references a valid primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });

    it('should satisfy Requirement 10.5: Body text tokens reference valid font family tokens', () => {
      const bodyTokens = [
        'typography.bodySm', 'typography.bodyMd', 'typography.bodyLg',
        'typography.caption', 'typography.legal'
      ];
      
      bodyTokens.forEach(tokenName => {
        const token = typographyTokens[tokenName];
        const fontFamilyRef = token.primitiveReferences.fontFamily;
        
        // Verify body token references a valid primitive token
        expect(fontFamilyRef).toMatch(/^fontFamily/);
        expect(fontFamilyTokens[fontFamilyRef]).toBeDefined();
      });
    });
  });
});
