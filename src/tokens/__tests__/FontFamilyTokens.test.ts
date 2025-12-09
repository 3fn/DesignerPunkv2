/**
 * Font Family Tokens Unit Tests
 * 
 * Tests for font family token categorical values and platform consistency.
 * Validates font stack definitions and cross-platform compatibility.
 */

import { TokenCategory } from '../../types/PrimitiveToken';
import {
  fontFamilyTokens,
  fontFamilyTokenNames,
  getFontFamilyToken,
  getAllFontFamilyTokens
} from '../FontFamilyTokens';

describe('Font Family Tokens', () => {
  describe('Token Structure and Organization', () => {
    test('should have correct token category for all font family tokens', () => {
      const allTokens = getAllFontFamilyTokens();
      
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every(token => token.category === TokenCategory.FONT_FAMILY)).toBe(true);
    });

    test('should have consistent token naming pattern', () => {
      const tokenNames = fontFamilyTokenNames;
      
      expect(tokenNames).toContain('fontFamilySystem');
      expect(tokenNames).toContain('fontFamilyMono');
      expect(tokenNames).toContain('fontFamilyDisplay');
      expect(tokenNames).toContain('fontFamilyBody');
      
      // All names should start with 'fontFamily'
      expect(tokenNames.every(name => name.startsWith('fontFamily'))).toBe(true);
    });

    test('should have appropriate base values for categorical tokens', () => {
      const allTokens = getAllFontFamilyTokens();
      
      // Font family tokens are categorical, so baseValue and familyBaseValue should be 0
      expect(allTokens.every(token => token.baseValue === 0)).toBe(true);
      expect(allTokens.every(token => token.familyBaseValue === 0)).toBe(true);
    });

    test('should not be strategic flexibility or precision targeted', () => {
      const allTokens = getAllFontFamilyTokens();
      
      expect(allTokens.every(token => !token.isStrategicFlexibility)).toBe(true);
      expect(allTokens.every(token => !token.isPrecisionTargeted)).toBe(true);
    });

    test('should not require baseline grid alignment', () => {
      const allTokens = getAllFontFamilyTokens();
      
      expect(allTokens.every(token => !token.baselineGridAlignment)).toBe(true);
    });
  });

  describe('Font Stack Definitions', () => {
    test('should provide system font stack with platform fallbacks', () => {
      const systemToken = getFontFamilyToken('fontFamilySystem');
      
      expect(systemToken).toBeDefined();
      expect(systemToken?.description).toContain('Platform default font stack');
      
      const fontStack = systemToken?.platforms.web.value as string;
      expect(fontStack).toContain('-apple-system');
      expect(fontStack).toContain('BlinkMacSystemFont');
      expect(fontStack).toContain('Segoe UI');
      expect(fontStack).toContain('Roboto');
      expect(fontStack).toContain('sans-serif');
    });

    test('should provide monospace font stack for code content', () => {
      const monoToken = getFontFamilyToken('fontFamilyMono');
      
      expect(monoToken).toBeDefined();
      expect(monoToken?.description).toContain('Monospace font stack');
      
      const fontStack = monoToken?.platforms.web.value as string;
      expect(fontStack).toContain('SF Mono');
      expect(fontStack).toContain('Monaco');
      expect(fontStack).toContain('Inconsolata');
      expect(fontStack).toContain('Roboto Mono');
      expect(fontStack).toContain('Consolas');
      expect(fontStack).toContain('Courier New');
      expect(fontStack).toContain('monospace');
    });

    test('should provide Rajdhani-based display font stack', () => {
      const displayToken = getFontFamilyToken('fontFamilyDisplay');
      
      expect(displayToken).toBeDefined();
      expect(displayToken?.description).toContain('Display font stack');
      
      const fontStack = displayToken?.platforms.web.value as string;
      expect(fontStack).toContain('Rajdhani');
      expect(fontStack).toContain('-apple-system');
      expect(fontStack).toContain('BlinkMacSystemFont');
      expect(fontStack).toContain('Segoe UI');
      expect(fontStack).toContain('Roboto');
      expect(fontStack).toContain('sans-serif');
    });

    test('should provide Inter-based body font stack', () => {
      const bodyToken = getFontFamilyToken('fontFamilyBody');
      
      expect(bodyToken).toBeDefined();
      expect(bodyToken?.description).toContain('Body font stack');
      
      const fontStack = bodyToken?.platforms.web.value as string;
      expect(fontStack).toContain('Inter');
      expect(fontStack).toContain('-apple-system');
      expect(fontStack).toContain('BlinkMacSystemFont');
      expect(fontStack).toContain('Segoe UI');
      expect(fontStack).toContain('Roboto');
      expect(fontStack).toContain('sans-serif');
    });
  });

  describe('Cross-Platform Consistency', () => {
    test('should have identical font stacks across all platforms', () => {
      const allTokens = getAllFontFamilyTokens();
      
      allTokens.forEach(token => {
        const webValue = token.platforms.web.value;
        const iosValue = token.platforms.ios.value;
        const androidValue = token.platforms.android.value;
        
        expect(webValue).toBe(iosValue);
        expect(iosValue).toBe(androidValue);
        expect(webValue).toBe(androidValue);
      });
    });

    test('should use fontFamily unit type across all platforms', () => {
      const allTokens = getAllFontFamilyTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('fontFamily');
        expect(token.platforms.ios.unit).toBe('fontFamily');
        expect(token.platforms.android.unit).toBe('fontFamily');
      });
    });

    test('should maintain font stack order consistency', () => {
      const displayToken = getFontFamilyToken('fontFamilyDisplay');
      const bodyToken = getFontFamilyToken('fontFamilyBody');
      
      // Display should start with Rajdhani, body should start with Inter
      const displayStack = displayToken?.platforms.web.value as string;
      const bodyStack = bodyToken?.platforms.web.value as string;
      
      expect(displayStack.startsWith('Rajdhani')).toBe(true);
      expect(bodyStack.startsWith('Inter')).toBe(true);
      
      // Both should have same fallback chain after their primary font
      const displayFallbacks = displayStack.split(',').slice(1).map(s => s.trim());
      const bodyFallbacks = bodyStack.split(',').slice(1).map(s => s.trim());
      
      expect(displayFallbacks).toEqual(bodyFallbacks);
    });
  });

  describe('Mathematical Relationships', () => {
    test('should have appropriate mathematical relationship descriptions', () => {
      const allTokens = getAllFontFamilyTokens();
      
      allTokens.forEach(token => {
        expect(token.mathematicalRelationship).toBe('N/A - Categorical value');
      });
    });

    test('should not participate in mathematical calculations', () => {
      const allTokens = getAllFontFamilyTokens();
      
      // Font family tokens are categorical and don't have mathematical relationships
      allTokens.forEach(token => {
        expect(typeof token.platforms.web.value).toBe('string');
        expect(typeof token.platforms.ios.value).toBe('string');
        expect(typeof token.platforms.android.value).toBe('string');
      });
    });
  });

  describe('Token Retrieval Functions', () => {
    test('should retrieve tokens by name correctly', () => {
      const systemToken = getFontFamilyToken('fontFamilySystem');
      const monoToken = getFontFamilyToken('fontFamilyMono');
      const displayToken = getFontFamilyToken('fontFamilyDisplay');
      const bodyToken = getFontFamilyToken('fontFamilyBody');
      
      expect(systemToken?.name).toBe('fontFamilySystem');
      expect(monoToken?.name).toBe('fontFamilyMono');
      expect(displayToken?.name).toBe('fontFamilyDisplay');
      expect(bodyToken?.name).toBe('fontFamilyBody');
    });

    test('should return undefined for non-existent tokens', () => {
      const nonExistent = getFontFamilyToken('fontFamilyNonExistent');
      const invalid = getFontFamilyToken('invalid-name');
      
      expect(nonExistent).toBeUndefined();
      expect(invalid).toBeUndefined();
    });

    test('should return all tokens via getAllFontFamilyTokens', () => {
      const allTokens = getAllFontFamilyTokens();
      const tokenNames = fontFamilyTokenNames;
      
      expect(allTokens.length).toBe(tokenNames.length);
      expect(allTokens.every(token => tokenNames.includes(token.name))).toBe(true);
    });

    test('should have consistent token names array', () => {
      const tokenNames = fontFamilyTokenNames;
      const tokenKeys = Object.keys(fontFamilyTokens);
      
      expect(tokenNames.sort()).toEqual(tokenKeys.sort());
    });
  });

  describe('Font Stack Quality', () => {
    test('should include appropriate fallbacks for each font type', () => {
      const systemToken = getFontFamilyToken('fontFamilySystem');
      const monoToken = getFontFamilyToken('fontFamilyMono');
      
      const systemStack = systemToken?.platforms.web.value as string;
      const monoStack = monoToken?.platforms.web.value as string;
      
      // System stack should end with generic sans-serif
      expect(systemStack.endsWith('sans-serif')).toBe(true);
      
      // Mono stack should end with generic monospace
      expect(monoStack.endsWith('monospace')).toBe(true);
    });

    test('should prioritize modern fonts first', () => {
      const displayToken = getFontFamilyToken('fontFamilyDisplay');
      const bodyToken = getFontFamilyToken('fontFamilyBody');
      
      const displayStack = displayToken?.platforms.web.value as string;
      const bodyStack = bodyToken?.platforms.web.value as string;
      
      // Rajdhani should be first choice for display, Inter for body
      expect(displayStack.startsWith('Rajdhani')).toBe(true);
      expect(bodyStack.startsWith('Inter')).toBe(true);
    });

    test('should include platform-specific system fonts', () => {
      const systemToken = getFontFamilyToken('fontFamilySystem');
      const fontStack = systemToken?.platforms.web.value as string;
      
      // Should include macOS system font
      expect(fontStack).toContain('-apple-system');
      
      // Should include Windows system font
      expect(fontStack).toContain('Segoe UI');
      
      // Should include Chrome OS system font
      expect(fontStack).toContain('BlinkMacSystemFont');
      
      // Should include Android system font
      expect(fontStack).toContain('Roboto');
    });
  });

  describe('Integration with Token System', () => {
    test('should integrate with token registry structure', () => {
      const allTokens = getAllFontFamilyTokens();
      
      // All tokens should have required PrimitiveToken interface properties
      allTokens.forEach(token => {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('baseValue');
        expect(token).toHaveProperty('familyBaseValue');
        expect(token).toHaveProperty('description');
        expect(token).toHaveProperty('mathematicalRelationship');
        expect(token).toHaveProperty('baselineGridAlignment');
        expect(token).toHaveProperty('isStrategicFlexibility');
        expect(token).toHaveProperty('isPrecisionTargeted');
        expect(token).toHaveProperty('platforms');
      });
    });

    test('should have valid platform values structure', () => {
      const allTokens = getAllFontFamilyTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms).toHaveProperty('web');
        expect(token.platforms).toHaveProperty('ios');
        expect(token.platforms).toHaveProperty('android');
        
        expect(token.platforms.web).toHaveProperty('value');
        expect(token.platforms.web).toHaveProperty('unit');
        expect(token.platforms.ios).toHaveProperty('value');
        expect(token.platforms.ios).toHaveProperty('unit');
        expect(token.platforms.android).toHaveProperty('value');
        expect(token.platforms.android).toHaveProperty('unit');
      });
    });
  });
});