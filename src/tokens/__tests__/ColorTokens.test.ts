/**
 * Color Tokens Unit Tests
 * 
 * Tests for mode-aware color token structure, systematic color families, and cross-platform consistency.
 * Covers all color families (gray, black, white, yellow, orange, purple, violet, cyan, teal) with
 * light/dark modes and base/wcag themes for comprehensive accessibility and aesthetic validation.
 */

import { TokenCategory, ColorTokenValue, ModeThemeValues } from '../../types/PrimitiveToken';
import {
  colorTokens,
  colorTokenNames,
  getColorToken,
  getAllColorTokens,
  getColorTokensByFamily,
  resolveColorTokenValue,
  grayTokens,
  blackTokens,
  whiteTokens,
  yellowTokens,
  orangeTokens,
  purpleTokens,
  violetTokens,
  cyanTokens,
  tealTokens,
  COLOR_BASE_VALUE,
  COLOR_FAMILIES,
  COLOR_SCALE,
  COLOR_MODES,
  COLOR_THEMES
} from '../ColorTokens';

describe('Color Tokens', () => {
  describe('Mode-Aware Color Token Structure', () => {
    test('should have correct mode-aware structure for all color tokens', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.COLOR);
        
        // Validate mode-aware structure exists
        const colorValue = token.platforms.web.value as ColorTokenValue;
        expect(colorValue).toHaveProperty('light');
        expect(colorValue).toHaveProperty('dark');
        
        // Validate theme structure within each mode
        expect(colorValue.light).toHaveProperty('base');
        expect(colorValue.light).toHaveProperty('wcag');
        expect(colorValue.dark).toHaveProperty('base');
        expect(colorValue.dark).toHaveProperty('wcag');
        
        // Validate all values are valid hex colors
        expect(colorValue.light.base).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.light.wcag).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.dark.base).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.dark.wcag).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    test('should have identical mode-aware structure across all platforms', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        const webValue = token.platforms.web.value as ColorTokenValue;
        const iosValue = token.platforms.ios.value as ColorTokenValue;
        const androidValue = token.platforms.android.value as ColorTokenValue;
        
        // Validate structure consistency across platforms
        expect(webValue.light.base).toBe(iosValue.light.base);
        expect(webValue.light.wcag).toBe(iosValue.light.wcag);
        expect(webValue.dark.base).toBe(iosValue.dark.base);
        expect(webValue.dark.wcag).toBe(iosValue.dark.wcag);
        
        expect(iosValue.light.base).toBe(androidValue.light.base);
        expect(iosValue.light.wcag).toBe(androidValue.light.wcag);
        expect(iosValue.dark.base).toBe(androidValue.dark.base);
        expect(iosValue.dark.wcag).toBe(androidValue.dark.wcag);
        
        // Validate unit consistency
        expect(token.platforms.web.unit).toBe('hex');
        expect(token.platforms.ios.unit).toBe('hex');
        expect(token.platforms.android.unit).toBe('hex');
      });
    });

    test('should support all defined color modes and themes', () => {
      expect(COLOR_MODES).toEqual(['light', 'dark']);
      expect(COLOR_THEMES).toEqual(['base', 'wcag']);
      
      const testToken = getColorToken('purple300');
      
      // Test all mode/theme combinations
      COLOR_MODES.forEach(mode => {
        COLOR_THEMES.forEach(theme => {
          const resolvedValue = resolveColorTokenValue(testToken, mode, theme);
          expect(resolvedValue).toMatch(/^#[0-9A-F]{6}$/i);
        });
      });
    });
  });

  describe('Systematic Color Token Hex Value Accuracy', () => {
    test('should have valid hex color values for all tokens', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        const colorValue = token.platforms.web.value as ColorTokenValue;
        
        // Test all mode/theme combinations for valid hex format
        expect(colorValue.light.base).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.light.wcag).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.dark.base).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.dark.wcag).toMatch(/^#[0-9A-F]{6}$/i);
        
        // Validate hex values are uppercase
        expect(colorValue.light.base).toBe(colorValue.light.base.toUpperCase());
        expect(colorValue.light.wcag).toBe(colorValue.light.wcag.toUpperCase());
        expect(colorValue.dark.base).toBe(colorValue.dark.base.toUpperCase());
        expect(colorValue.dark.wcag).toBe(colorValue.dark.wcag.toUpperCase());
      });
    });

    test('should have consistent hex value formatting across modes and themes', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        const colorValue = token.platforms.web.value as ColorTokenValue;
        
        // All hex values should be 7 characters (#RRGGBB)
        expect(colorValue.light.base).toHaveLength(7);
        expect(colorValue.light.wcag).toHaveLength(7);
        expect(colorValue.dark.base).toHaveLength(7);
        expect(colorValue.dark.wcag).toHaveLength(7);
        
        // All should start with #
        expect(colorValue.light.base).toMatch(/^#/);
        expect(colorValue.light.wcag).toMatch(/^#/);
        expect(colorValue.dark.base).toMatch(/^#/);
        expect(colorValue.dark.wcag).toMatch(/^#/);
      });
    });

    test('should have different values for base and wcag themes where appropriate', () => {
      const allTokens = getAllColorTokens();
      let hasThemeDifferences = false;
      
      allTokens.forEach(token => {
        const colorValue = token.platforms.web.value as ColorTokenValue;
        
        // Check if any tokens have different base vs wcag values
        if (colorValue.light.base !== colorValue.light.wcag ||
            colorValue.dark.base !== colorValue.dark.wcag) {
          hasThemeDifferences = true;
        }
      });
      
      // At least some tokens should have theme differences for accessibility
      expect(hasThemeDifferences).toBe(true);
    });
  });

  describe('Color Scale Progression and Systematic Relationships', () => {
    test('should follow 100-500 scale progression for all color families', () => {
      expect(COLOR_SCALE).toEqual([100, 200, 300, 400, 500]);
      
      Object.values(COLOR_FAMILIES).forEach(family => {
        const familyTokens = getColorTokensByFamily(family as any);
        
        // Each family should have all scale values
        COLOR_SCALE.forEach(scale => {
          const tokenName = `${family}${scale}`;
          const token = familyTokens.find(t => t.name === tokenName);
          expect(token).toBeDefined();
          expect(token?.name).toBe(tokenName);
        });
        
        // Should have exactly 5 tokens per family (100-500)
        expect(familyTokens).toHaveLength(5);
      });
    });

    test('should maintain systematic naming within color families', () => {
      Object.values(COLOR_FAMILIES).forEach(family => {
        const familyTokens = getColorTokensByFamily(family as any);
        
        familyTokens.forEach(token => {
          // Token name should start with family name
          expect(token.name).toMatch(new RegExp(`^${family}\\d{3}$`));
          
          // Should have systematic mathematical relationship description
          expect(token.mathematicalRelationship).toContain(`Systematic ${family} scale progression`);
          
          // Should have appropriate description mentioning the family
          expect(token.description.toLowerCase()).toContain(family);
        });
      });
    });

    test('should have logical progression descriptions within families', () => {
      Object.values(COLOR_FAMILIES).forEach(family => {
        const familyTokens = getColorTokensByFamily(family as any);
        const sortedTokens = familyTokens.sort((a, b) => {
          const aScale = parseInt(a.name.replace(family, ''));
          const bScale = parseInt(b.name.replace(family, ''));
          return aScale - bScale;
        });
        
        // All tokens should have systematic progression descriptions
        sortedTokens.forEach(token => {
          expect(token.mathematicalRelationship).toContain(`Systematic ${family} scale progression`);
        });
        
        // Should have 5 tokens with different progression levels
        expect(sortedTokens).toHaveLength(5);
        
        // Each token should have a unique progression description
        const descriptions = sortedTokens.map(t => t.mathematicalRelationship);
        const uniqueDescriptions = new Set(descriptions);
        expect(uniqueDescriptions.size).toBe(5); // All descriptions should be unique
      });
    });
  });

  describe('Color Token Integration with Token Registry', () => {
    test('should integrate with token registry utilities', () => {
      // Test colorTokens object contains all family tokens
      expect(Object.keys(colorTokens)).toHaveLength(45); // 9 families × 5 scales = 45 tokens
      
      // Test colorTokenNames array matches colorTokens keys
      expect(colorTokenNames).toEqual(Object.keys(colorTokens));
      expect(colorTokenNames).toHaveLength(45);
      
      // Test getAllColorTokens returns all tokens
      const allTokens = getAllColorTokens();
      expect(allTokens).toHaveLength(45);
      expect(allTokens.every(token => token.category === TokenCategory.COLOR)).toBe(true);
    });

    test('should have correct base value and family structure', () => {
      expect(COLOR_BASE_VALUE).toBe(0); // N/A for hex color tokens
      
      const allTokens = getAllColorTokens();
      allTokens.forEach(token => {
        expect(token.baseValue).toBe(0);
        expect(token.familyBaseValue).toBe(COLOR_BASE_VALUE);
        expect(token.category).toBe(TokenCategory.COLOR);
      });
    });

    test('should have appropriate token flags for color tokens', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        // Color tokens should not align with baseline grid
        expect(token.baselineGridAlignment).toBe(false);
        
        // Color tokens should not be strategic flexibility
        expect(token.isStrategicFlexibility).toBe(false);
        
        // Color tokens should not be precision targeted
        expect(token.isPrecisionTargeted).toBe(false);
      });
    });

    test('should retrieve tokens by name correctly', () => {
      // Test valid token retrieval
      const purple300 = getColorToken('purple300');
      expect(purple300.name).toBe('purple300');
      expect(purple300.category).toBe(TokenCategory.COLOR);
      
      // Test error handling for invalid token names
      expect(() => getColorToken('invalidToken' as any)).toThrow('Color token "invalidToken" not found');
    });

    test('should retrieve tokens by family correctly', () => {
      Object.values(COLOR_FAMILIES).forEach(family => {
        const familyTokens = getColorTokensByFamily(family as any);
        
        expect(familyTokens).toHaveLength(5);
        familyTokens.forEach(token => {
          expect(token.name).toMatch(new RegExp(`^${family}\\d{3}$`));
        });
      });
    });
  });

  describe('WCAG Theme Accessibility Compliance', () => {
    test('should provide WCAG theme variants for accessibility compliance', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        const colorValue = token.platforms.web.value as ColorTokenValue;
        
        // WCAG theme should exist for both light and dark modes
        expect(colorValue.light.wcag).toBeDefined();
        expect(colorValue.dark.wcag).toBeDefined();
        
        // WCAG values should be valid hex colors
        expect(colorValue.light.wcag).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.dark.wcag).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    test('should maintain systematic aesthetic integrity in base theme', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        const colorValue = token.platforms.web.value as ColorTokenValue;
        
        // Base theme should exist for both light and dark modes
        expect(colorValue.light.base).toBeDefined();
        expect(colorValue.dark.base).toBeDefined();
        
        // Base values should be valid hex colors
        expect(colorValue.light.base).toMatch(/^#[0-9A-F]{6}$/i);
        expect(colorValue.dark.base).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    test('should support resolveColorTokenValue function for accessibility', () => {
      const testToken = getColorToken('cyan300');
      
      // Test default resolution (light mode, base theme)
      const defaultValue = resolveColorTokenValue(testToken);
      expect(defaultValue).toMatch(/^#[0-9A-F]{6}$/i);
      
      // Test explicit mode and theme resolution
      const lightBase = resolveColorTokenValue(testToken, 'light', 'base');
      const lightWcag = resolveColorTokenValue(testToken, 'light', 'wcag');
      const darkBase = resolveColorTokenValue(testToken, 'dark', 'base');
      const darkWcag = resolveColorTokenValue(testToken, 'dark', 'wcag');
      
      expect(lightBase).toMatch(/^#[0-9A-F]{6}$/i);
      expect(lightWcag).toMatch(/^#[0-9A-F]{6}$/i);
      expect(darkBase).toMatch(/^#[0-9A-F]{6}$/i);
      expect(darkWcag).toMatch(/^#[0-9A-F]{6}$/i);
      
      // Default should match light base
      expect(defaultValue).toBe(lightBase);
    });

    test('should handle invalid tokens in resolveColorTokenValue', () => {
      const nonColorToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Test spacing token',
        mathematicalRelationship: 'Test',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' as const },
          ios: { value: 8, unit: 'pt' as const },
          android: { value: 8, unit: 'dp' as const }
        }
      };
      
      expect(() => resolveColorTokenValue(nonColorToken as any)).toThrow('Token "space100" is not a color token');
    });
  });

  describe('Native Mode Detection and Theme Switching', () => {
    test('should support mode-aware color resolution patterns', () => {
      const testToken = getColorToken('orange300');
      const colorValue = testToken.platforms.web.value as ColorTokenValue;
      
      // Test colorToken[systemMode][userTheme] pattern
      expect(colorValue['light']['base']).toBeDefined();
      expect(colorValue['light']['wcag']).toBeDefined();
      expect(colorValue['dark']['base']).toBeDefined();
      expect(colorValue['dark']['wcag']).toBeDefined();
      
      // Values should be different for different modes/themes
      const lightBase = colorValue.light.base;
      const lightWcag = colorValue.light.wcag;
      const darkBase = colorValue.dark.base;
      const darkWcag = colorValue.dark.wcag;
      
      // At least some combinations should be different
      const allValues = [lightBase, lightWcag, darkBase, darkWcag];
      const uniqueValues = new Set(allValues);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });

    test('should provide consistent mode/theme structure for native implementations', () => {
      const allTokens = getAllColorTokens();
      
      allTokens.forEach(token => {
        // All platforms should have identical mode/theme structure
        const webValue = token.platforms.web.value as ColorTokenValue;
        const iosValue = token.platforms.ios.value as ColorTokenValue;
        const androidValue = token.platforms.android.value as ColorTokenValue;
        
        // Structure should be identical
        expect(Object.keys(webValue)).toEqual(Object.keys(iosValue));
        expect(Object.keys(iosValue)).toEqual(Object.keys(androidValue));
        
        expect(Object.keys(webValue.light)).toEqual(Object.keys(iosValue.light));
        expect(Object.keys(webValue.dark)).toEqual(Object.keys(iosValue.dark));
        
        // Values should be identical for cross-platform consistency
        expect(webValue.light.base).toBe(iosValue.light.base);
        expect(webValue.light.wcag).toBe(iosValue.light.wcag);
        expect(webValue.dark.base).toBe(iosValue.dark.base);
        expect(webValue.dark.wcag).toBe(iosValue.dark.wcag);
      });
    });

    test('should support theme switching capability through structure', () => {
      const testToken = getColorToken('violet200');
      
      // Test that resolveColorTokenValue can switch between themes
      const baseTheme = resolveColorTokenValue(testToken, 'light', 'base');
      const wcagTheme = resolveColorTokenValue(testToken, 'light', 'wcag');
      
      expect(baseTheme).toMatch(/^#[0-9A-F]{6}$/i);
      expect(wcagTheme).toMatch(/^#[0-9A-F]{6}$/i);
      
      // Themes may be different for accessibility compliance
      // (but we don't require them to be different as some colors may be compliant in base theme)
      expect(typeof baseTheme).toBe('string');
      expect(typeof wcagTheme).toBe('string');
    });

    test('should handle default theme selection (base theme as default)', () => {
      const testToken = getColorToken('teal400');
      
      // Test default theme selection
      const defaultResolution = resolveColorTokenValue(testToken, 'light');
      const explicitBase = resolveColorTokenValue(testToken, 'light', 'base');
      
      // Default should be base theme
      expect(defaultResolution).toBe(explicitBase);
      
      // Test default mode selection
      const defaultMode = resolveColorTokenValue(testToken);
      const explicitLight = resolveColorTokenValue(testToken, 'light', 'base');
      
      // Default should be light mode
      expect(defaultMode).toBe(explicitLight);
    });
  });

  describe('Individual Color Family Validation', () => {
    test('should validate gray token family for neutral surfaces and text', () => {
      const grayFamily = Object.values(grayTokens);
      expect(grayFamily).toHaveLength(5);
      
      grayFamily.forEach(token => {
        expect(token.name).toMatch(/^gray[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('gray');
        expect(token.mathematicalRelationship).toContain('Systematic gray scale progression');
      });
    });

    test('should validate black token family for deep backgrounds and containers', () => {
      const blackFamily = Object.values(blackTokens);
      expect(blackFamily).toHaveLength(5);
      
      blackFamily.forEach(token => {
        expect(token.name).toMatch(/^black[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('black');
        expect(token.mathematicalRelationship).toContain('Systematic black scale progression');
      });
    });

    test('should validate white token family for light surfaces and primary text', () => {
      const whiteFamily = Object.values(whiteTokens);
      expect(whiteFamily).toHaveLength(5);
      
      whiteFamily.forEach(token => {
        expect(token.name).toMatch(/^white[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('white');
        expect(token.mathematicalRelationship).toContain('Systematic white scale progression');
      });
    });

    test('should validate yellow token family for high-energy CTAs and warnings', () => {
      const yellowFamily = Object.values(yellowTokens);
      expect(yellowFamily).toHaveLength(5);
      
      yellowFamily.forEach(token => {
        expect(token.name).toMatch(/^yellow[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('yellow');
        expect(token.mathematicalRelationship).toContain('Systematic yellow scale progression');
      });
    });

    test('should validate orange token family for secondary CTAs and approachable error states', () => {
      const orangeFamily = Object.values(orangeTokens);
      expect(orangeFamily).toHaveLength(5);
      
      orangeFamily.forEach(token => {
        expect(token.name).toMatch(/^orange[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('orange');
        expect(token.mathematicalRelationship).toContain('Systematic orange scale progression');
      });
    });

    test('should validate purple token family for primary brand and focus states', () => {
      const purpleFamily = Object.values(purpleTokens);
      expect(purpleFamily).toHaveLength(5);
      
      purpleFamily.forEach(token => {
        expect(token.name).toMatch(/^purple[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('purple');
        expect(token.mathematicalRelationship).toContain('Systematic purple scale progression');
      });
    });

    test('should validate violet token family for depth, hover states, and secondary elements', () => {
      const violetFamily = Object.values(violetTokens);
      expect(violetFamily).toHaveLength(5);
      
      violetFamily.forEach(token => {
        expect(token.name).toMatch(/^violet[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('violet');
        expect(token.mathematicalRelationship).toContain('Systematic violet scale progression');
      });
    });

    test('should validate cyan token family for tech elements, links, and success states', () => {
      const cyanFamily = Object.values(cyanTokens);
      expect(cyanFamily).toHaveLength(5);
      
      cyanFamily.forEach(token => {
        expect(token.name).toMatch(/^cyan[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('cyan');
        expect(token.mathematicalRelationship).toContain('Systematic cyan scale progression');
      });
    });

    test('should validate teal token family for secondary UI elements and alternative success states', () => {
      const tealFamily = Object.values(tealTokens);
      expect(tealFamily).toHaveLength(5);
      
      tealFamily.forEach(token => {
        expect(token.name).toMatch(/^teal[1-5]00$/);
        expect(token.description.toLowerCase()).toContain('teal');
        expect(token.mathematicalRelationship).toContain('Systematic teal scale progression');
      });
    });
  });
});