/**
 * TEMPORARY TEST - Delete after cleanup complete
 * 
 * TextInputField Token Cleanup Validation
 * 
 * This test file validates that TextInputField components use design tokens
 * instead of hard-coded values. These tests provide immediate feedback
 * during the cleanup process and should be deleted once cleanup is complete.
 * 
 * Validates:
 * - Web: Fallback pattern removal (|| '250ms', || 8), CSS custom properties
 * - iOS: Color token usage (no hard-coded Color(red:green:blue:))
 * - Android: Color token usage (no hard-coded Color(0xRRGGBB))
 * - Motion tokens: motionFloatLabelDuration usage across platforms
 * 
 * Requirements: 1.1, 1.3, 1.5, 8.1
 */

import { readFileSync } from 'fs';
import { join } from 'path';

describe('TextInputField Token Cleanup - TEMPORARY', () => {
  describe('Web Platform', () => {
    const webFilePath = join(__dirname, '../platforms/web/TextInputField.web.ts');
    let webContent: string;

    beforeAll(() => {
      webContent = readFileSync(webFilePath, 'utf-8');
    });

    it('should not have fallback pattern || "250ms" for motion duration', () => {
      // Requirement 1.3: Remove fallback patterns for motion tokens
      
      // Check that fallback pattern || '250ms' or || "250ms" is NOT present
      const fallbackPattern = /\|\|\s*['"]250ms['"]/;
      expect(webContent).not.toMatch(fallbackPattern);
    });

    it('should not have fallback pattern || 8 for spacing values', () => {
      // Requirement 1.3: Remove fallback patterns for spacing tokens
      
      // Check that fallback pattern || 8 is NOT present
      const fallbackPattern = /\|\|\s*8(?!\d)/;
      expect(webContent).not.toMatch(fallbackPattern);
    });

    it('should use CSS custom properties for motion tokens', () => {
      // Requirement 1.5: Use CSS custom properties for motion tokens
      
      // Verify --motion-float-label-duration is used
      expect(webContent).toMatch(/var\(--motion-float-label-duration\)/);
      
      // Verify --motion-float-label-easing is used
      expect(webContent).toMatch(/var\(--motion-float-label-easing\)/);
    });

    it('should use CSS custom properties for all color tokens', () => {
      // Requirement 1.1: Use CSS custom properties for colors
      
      // Verify CSS custom properties are used for colors
      const colorProperties = [
        '--color-text-muted',
        '--color-text-default',
        '--color-primary',
        '--color-error',
        '--color-success-strong',
        '--color-border',
        '--color-background'
      ];

      colorProperties.forEach(prop => {
        expect(webContent).toMatch(new RegExp(`var\\(${prop}\\)`));
      });
    });

    it('should fail loudly when motion token is missing', () => {
      // Requirement 1.5, 7.1: Fail loudly when tokens missing (no fallback patterns)
      
      // Verify getAnimationDuration method exists
      expect(webContent).toMatch(/getAnimationDuration/);
      
      // Verify it throws error when token is missing
      expect(webContent).toMatch(/throw new Error.*motion token missing/i);
      
      // Verify it logs error before throwing
      expect(webContent).toMatch(/console\.error.*motion-float-label-duration/);
      
      // Verify NO fallback return value (should throw instead)
      const fallbackReturnPattern = /return\s+250\s*;?\s*\/\/.*fallback/i;
      expect(webContent).not.toMatch(fallbackReturnPattern);
    });

    it('should document motion token usage in comments', () => {
      // Requirement 8.1: Document motion token usage
      
      // Verify motion.floatLabel token is documented
      expect(webContent).toMatch(/motion\.floatLabel/);
    });
  });

  describe('iOS Platform', () => {
    const iosFilePath = join(__dirname, '../platforms/ios/TextInputField.ios.swift');
    let iosContent: string;

    beforeAll(() => {
      iosContent = readFileSync(iosFilePath, 'utf-8');
    });

    it('should not have any hard-coded Color(red:green:blue:) patterns', () => {
      // Requirement 1.1: No hard-coded RGB color values
      
      // Check for any Color(red:green:blue:) pattern
      const anyRGBPattern = /Color\(red:\s*[\d.]+,\s*green:\s*[\d.]+,\s*blue:\s*[\d.]+\)/;
      expect(iosContent).not.toMatch(anyRGBPattern);
    });

    it('should use semantic color tokens for all colors', () => {
      // Requirement 1.1: Use semantic color tokens
      
      const colorTokens = [
        'colorTextMuted',
        'colorTextDefault',
        'colorPrimary',
        'colorError',
        'colorSuccessStrong',
        'colorBorder',
        'colorBackground'
      ];

      colorTokens.forEach(token => {
        expect(iosContent).toMatch(new RegExp(token));
      });
    });

    it('should use motionFloatLabelDuration token for animations', () => {
      // Requirement 1.5: Use motion token for animation duration
      
      // Verify motionFloatLabelDuration is used
      expect(iosContent).toMatch(/motionFloatLabelDuration/);
      
      // Verify it's used in animation timing
      expect(iosContent).toMatch(/duration:\s*motionFloatLabelDuration/);
    });

    it('should use motion token in DispatchQueue.asyncAfter', () => {
      // Requirement 1.5: Use motion token for animation completion timing
      
      // Verify DispatchQueue.asyncAfter uses motionFloatLabelDuration
      expect(iosContent).toMatch(/DispatchQueue\.main\.asyncAfter.*motionFloatLabelDuration/s);
    });

    it('should document motion token constants', () => {
      // Requirement 8.1: Document motion token usage
      
      // Verify motion.floatLabel token is documented in comments
      expect(iosContent).toMatch(/motion\.floatLabel/);
    });
  });

  describe('Android Platform', () => {
    const androidFilePath = join(__dirname, '../platforms/android/TextInputField.android.kt');
    let androidContent: string;

    beforeAll(() => {
      androidContent = readFileSync(androidFilePath, 'utf-8');
    });

    it('should not have any hard-coded Color(0xRRGGBB) patterns', () => {
      // Requirement 1.1: No hard-coded hex color values
      
      // Check for any Color(0xRRGGBB) pattern
      const anyHexColorPattern = /Color\(0x[0-9A-F]{6,8}\)/;
      expect(androidContent).not.toMatch(anyHexColorPattern);
    });

    it('should use semantic color tokens for all colors', () => {
      // Requirement 1.1: Use semantic color tokens
      
      const colorTokens = [
        'colorTextMuted',
        'colorTextDefault',
        'colorPrimary',
        'colorError',
        'colorSuccessStrong',
        'colorBorder',
        'colorBackground'
      ];

      colorTokens.forEach(token => {
        expect(androidContent).toMatch(new RegExp(token));
      });
    });

    it('should use motionFloatLabelDuration token for animations', () => {
      // Requirement 1.5: Use motion token for animation duration
      
      // Verify motionFloatLabelDuration is used
      expect(androidContent).toMatch(/motionFloatLabelDuration/);
      
      // Verify it's used in animation timing
      expect(androidContent).toMatch(/durationMillis\s*=\s*motionFloatLabelDuration/);
    });

    it('should use motion token in kotlinx.coroutines.delay', () => {
      // Requirement 1.5: Use motion token for animation completion timing
      
      // Verify kotlinx.coroutines.delay uses motionFloatLabelDuration
      expect(androidContent).toMatch(/kotlinx\.coroutines\.delay.*motionFloatLabelDuration/s);
    });

    it('should document motion token constants', () => {
      // Requirement 8.1: Document motion token usage
      
      // Verify motion.floatLabel token is documented in comments
      expect(androidContent).toMatch(/motion\.floatLabel/);
    });
  });

  describe('Cross-Platform Motion Token Consistency', () => {
    it('should use consistent motion token naming across platforms', () => {
      // Requirement 1.5: Consistent motion token usage across platforms
      
      const webFilePath = join(__dirname, '../platforms/web/TextInputField.web.ts');
      const iosFilePath = join(__dirname, '../platforms/ios/TextInputField.ios.swift');
      const androidFilePath = join(__dirname, '../platforms/android/TextInputField.android.kt');

      const webContent = readFileSync(webFilePath, 'utf-8');
      const iosContent = readFileSync(iosFilePath, 'utf-8');
      const androidContent = readFileSync(androidFilePath, 'utf-8');

      // Web should use --motion-float-label-duration
      expect(webContent).toMatch(/--motion-float-label-duration/);

      // iOS should use motionFloatLabelDuration
      expect(iosContent).toMatch(/motionFloatLabelDuration/);

      // Android should use motionFloatLabelDuration
      expect(androidContent).toMatch(/motionFloatLabelDuration/);
    });

    it('should not have hard-coded duration values across platforms', () => {
      // Requirement 1.5: No hard-coded duration values
      
      const webFilePath = join(__dirname, '../platforms/web/TextInputField.web.ts');
      const iosFilePath = join(__dirname, '../platforms/ios/TextInputField.ios.swift');
      const androidFilePath = join(__dirname, '../platforms/android/TextInputField.android.kt');

      const webContent = readFileSync(webFilePath, 'utf-8');
      const iosContent = readFileSync(iosFilePath, 'utf-8');
      const androidContent = readFileSync(androidFilePath, 'utf-8');

      // Check for hard-coded 250ms or 0.25s patterns in animation contexts
      // Allow 250 as fallback value in error handling, but not in animation definitions
      
      // Web: Should not have hard-coded duration in transition properties
      const webTransitionPattern = /transition:.*250ms/;
      expect(webContent).not.toMatch(webTransitionPattern);

      // iOS: Should not have hard-coded duration in animation definitions
      const iosAnimationPattern = /\.animation.*duration:\s*0\.25/;
      expect(iosContent).not.toMatch(iosAnimationPattern);

      // Android: Should not have hard-coded duration in tween definitions
      const androidTweenPattern = /tween.*durationMillis\s*=\s*250/;
      expect(androidContent).not.toMatch(androidTweenPattern);
    });
  });
});
