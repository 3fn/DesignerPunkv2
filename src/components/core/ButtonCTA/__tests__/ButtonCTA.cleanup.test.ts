/**
 * TEMPORARY TEST - Delete after cleanup complete
 * 
 * ButtonCTA Token Cleanup Validation
 * 
 * This test file validates that ButtonCTA components use design tokens
 * instead of hard-coded values. These tests provide immediate feedback
 * during the cleanup process and should be deleted once cleanup is complete.
 * 
 * Validates:
 * - iOS: Color token usage (colorPrimary, colorTextDefault)
 * - Web: CSS custom property usage
 * - Android: Color token usage
 * 
 * Requirements: 1.1, 1.6, 8.1
 */

import { readFileSync } from 'fs';
import { join } from 'path';

describe('ButtonCTA Token Cleanup - TEMPORARY', () => {
  describe('iOS Platform', () => {
    const iosFilePath = join(__dirname, '../platforms/ios/ButtonCTA.ios.swift');
    let iosContent: string;

    beforeAll(() => {
      iosContent = readFileSync(iosFilePath, 'utf-8');
    });

    it('should use colorPrimary token instead of Color(red:green:blue:) for primary color', () => {
      // Requirement 1.1: Replace hard-coded RGB colors with semantic tokens
      
      // Check that hard-coded Color(red: 0.404, green: 0.314, blue: 0.643) is NOT present
      const hardCodedPrimaryPattern = /Color\(red:\s*0\.404,\s*green:\s*0\.314,\s*blue:\s*0\.643\)/;
      expect(iosContent).not.toMatch(hardCodedPrimaryPattern);
      
      // Verify colorPrimary token is used instead
      expect(iosContent).toMatch(/colorPrimary/);
    });

    it('should use colorBackground token instead of Color(red: 1.0, green: 1.0, blue: 1.0)', () => {
      // Requirement 1.1: Replace hard-coded RGB colors with semantic tokens
      
      // Check that hard-coded white Color(red: 1.0, green: 1.0, blue: 1.0) is NOT present
      const hardCodedWhitePattern = /Color\(red:\s*1\.0,\s*green:\s*1\.0,\s*blue:\s*1\.0\)/;
      expect(iosContent).not.toMatch(hardCodedWhitePattern);
      
      // Verify colorBackground token is used instead
      expect(iosContent).toMatch(/colorBackground/);
    });

    it('should use colorTextDefault token for text color', () => {
      // Requirement 1.6: Use semantic tokens for text colors
      
      // Verify colorTextDefault or colorTextOnPrimary tokens are used
      const hasTextTokens = /colorTextDefault|colorTextOnPrimary/.test(iosContent);
      expect(hasTextTokens).toBe(true);
    });

    it('should use color tokens for icon optical balance', () => {
      // Requirement 1.6: Use semantic tokens for icon colors
      
      // Check that hard-coded Color(red: 0.506, green: 0.424, blue: 0.722) is NOT present
      const hardCodedOpticalBalancePattern = /Color\(red:\s*0\.506,\s*green:\s*0\.424,\s*blue:\s*0\.722\)/;
      expect(iosContent).not.toMatch(hardCodedOpticalBalancePattern);
      
      // Verify color tokens are used for icons
      const hasIconColorTokens = /colorPrimary|colorTextOnPrimary/.test(iosContent);
      expect(hasIconColorTokens).toBe(true);
    });

    it('should not have any hard-coded Color(red:green:blue:) patterns', () => {
      // Requirement 1.1: No hard-coded RGB color values
      
      // Check for any Color(red:green:blue:) pattern
      const anyRGBPattern = /Color\(red:\s*[\d.]+,\s*green:\s*[\d.]+,\s*blue:\s*[\d.]+\)/;
      expect(iosContent).not.toMatch(anyRGBPattern);
    });
  });

  describe('Web Platform', () => {
    const webFilePath = join(__dirname, '../platforms/web/ButtonCTA.web.ts');
    let webContent: string;

    beforeAll(() => {
      webContent = readFileSync(webFilePath, 'utf-8');
    });

    it('should use CSS custom properties for colors', () => {
      // Requirement 1.1: Use CSS custom properties instead of hard-coded colors
      
      // Verify CSS custom properties are used for colors
      const hasCSSColorProperties = /var\(--color-[a-z-]+\)/.test(webContent);
      expect(hasCSSColorProperties).toBe(true);
    });

    it('should document icon size token references', () => {
      // Requirement 8.1: Document icon size token usage
      
      // Verify icon sizing logic is documented with token references
      const hasIconSizeTokenComment = /icon\.size100|icon\.size125/.test(webContent);
      expect(hasIconSizeTokenComment).toBe(true);
      
      // Verify icon size logic is present
      const hasIconSizeLogic = /iconSize/.test(webContent);
      expect(hasIconSizeLogic).toBe(true);
    });
  });

  describe('Android Platform', () => {
    const androidFilePath = join(__dirname, '../platforms/android/ButtonCTA.android.kt');
    let androidContent: string;

    beforeAll(() => {
      androidContent = readFileSync(androidFilePath, 'utf-8');
    });

    it('should use DesignTokens.color_primary instead of Color(0xRRGGBB)', () => {
      // Requirement 1.1: Use semantic color tokens instead of hard-coded hex colors
      
      // Check that hard-coded Color(0xRRGGBB) patterns are NOT present
      const hardCodedColorPattern = /Color\(0x[0-9A-F]{8}\)/;
      expect(androidContent).not.toMatch(hardCodedColorPattern);
      
      // Verify DesignTokens.color_primary is used
      expect(androidContent).toMatch(/DesignTokens\.color_primary/);
    });

    it('should use semantic color tokens for all color properties', () => {
      // Requirement 1.6: Use semantic tokens for colors
      
      // Verify semantic color tokens are used
      const hasSemanticColorTokens = /DesignTokens\.color_[a-z_]+/.test(androidContent);
      expect(hasSemanticColorTokens).toBe(true);
    });

    it('should not have any hard-coded Color(0xRRGGBB) patterns', () => {
      // Requirement 1.1: No hard-coded hex color values
      
      // Check for any Color(0xRRGGBB) pattern
      const anyHexColorPattern = /Color\(0x[0-9A-F]{6,8}\)/;
      expect(androidContent).not.toMatch(anyHexColorPattern);
    });
  });

  describe('Cross-Platform Token Consistency', () => {
    it('should use consistent token naming across platforms', () => {
      // Requirement 1.6: Consistent token usage across platforms
      
      const iosFilePath = join(__dirname, '../platforms/ios/ButtonCTA.ios.swift');
      const webFilePath = join(__dirname, '../platforms/web/ButtonCTA.web.ts');
      const androidFilePath = join(__dirname, '../platforms/android/ButtonCTA.android.kt');

      const iosContent = readFileSync(iosFilePath, 'utf-8');
      const webContent = readFileSync(webFilePath, 'utf-8');
      const androidContent = readFileSync(androidFilePath, 'utf-8');

      // iOS should use colorPrimary
      expect(iosContent).toMatch(/colorPrimary/);

      // Web should use --color-primary
      expect(webContent).toMatch(/--color-primary/);

      // Android should use DesignTokens.color_primary
      expect(androidContent).toMatch(/DesignTokens\.color_primary/);
    });
  });
});
