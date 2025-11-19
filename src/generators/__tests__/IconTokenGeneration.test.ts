/**
 * Icon Size Token Cross-Platform Generation Tests
 * 
 * Tests for icon size token generation across web, iOS, and Android platforms.
 * Validates that icon tokens are generated correctly with calculated values.
 * 
 * Task: 4.4 Create cross-platform generation tests
 * Spec: 006-icon-size-tokens
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { TokenFileGenerator } from '../TokenFileGenerator';
import { iconTokens } from '../../tokens/semantic/IconTokens';
import { fontSizeTokens } from '../../tokens/FontSizeTokens';
import { lineHeightTokens } from '../../tokens/LineHeightTokens';

describe('Icon Size Token Cross-Platform Generation', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
  });

  describe('Web Token Generation (TypeScript + CSS)', () => {
    it('should generate web tokens with icon size tokens', () => {
      const result = generator.generateWebTokens();

      expect(result.valid).toBe(true);
      expect(result.platform).toBe('web');
      expect(result.content).toBeTruthy();
    });

    it('should include all icon size tokens in generated content', () => {
      const result = generator.generateWebTokens();

      // Verify all 11 icon size tokens are present
      const iconTokenNames = Object.keys(iconTokens);
      iconTokenNames.forEach(tokenName => {
        // Convert to CSS custom property format: icon.size100 -> --icon-size-100
        const cssName = tokenName.replace('icon.size', '--icon-size-');
        expect(result.content).toContain(cssName);
      });
    });

    it('should generate icon tokens with calculated values', () => {
      const result = generator.generateWebTokens();

      // Test specific icon sizes with known values
      expect(result.content).toContain('--icon-size-050: 13px');  // 13 × 1.0 = 13
      expect(result.content).toContain('--icon-size-075: 18px');  // 14 × 1.25 = 18
      expect(result.content).toContain('--icon-size-100: 24px');  // 16 × 1.5 = 24
      expect(result.content).toContain('--icon-size-125: 32px');  // 18 × 1.75 = 32
      expect(result.content).toContain('--icon-size-700: 48px');  // 42 × 1.143 = 48
    });

    it('should use CSS custom property format', () => {
      const result = generator.generateWebTokens();

      // Icon tokens should use -- prefix and kebab-case
      expect(result.content).toMatch(/--icon-size-\d{3}:\s*\d+px/);
    });

    it('should include icon tokens in semantic token count', () => {
      const result = generator.generateWebTokens();

      // Semantic token count should include the 11 icon size tokens
      expect(result.semanticTokenCount).toBeGreaterThanOrEqual(11);
    });

    it('should include formula and typography pairing in comments', () => {
      const result = generator.generateWebTokens({ includeComments: true });

      // Should include calculation formula in comments
      expect(result.content).toContain('fontSize');
      expect(result.content).toContain('lineHeight');
      expect(result.content).toContain('×');
    });
  });

  describe('iOS Token Generation (Swift)', () => {
    it('should generate iOS tokens with icon size tokens', () => {
      const result = generator.generateiOSTokens();

      expect(result.valid).toBe(true);
      expect(result.platform).toBe('ios');
      expect(result.content).toBeTruthy();
    });

    it('should include all icon size tokens in generated content', () => {
      const result = generator.generateiOSTokens();

      // Verify all 11 icon size tokens are present
      const iconTokenNames = Object.keys(iconTokens);
      iconTokenNames.forEach(tokenName => {
        // Convert to Swift camelCase format: icon.size100 -> iconSize100
        const swiftName = tokenName.replace('icon.size', 'iconSize');
        expect(result.content).toContain(swiftName);
      });
    });

    it('should generate icon tokens with calculated values', () => {
      const result = generator.generateiOSTokens();

      // Test specific icon sizes with known values
      expect(result.content).toContain('iconSize050: CGFloat = 13');  // 13 × 1.0 = 13
      expect(result.content).toContain('iconSize075: CGFloat = 18');  // 14 × 1.25 = 18
      expect(result.content).toContain('iconSize100: CGFloat = 24');  // 16 × 1.5 = 24
      expect(result.content).toContain('iconSize125: CGFloat = 32');  // 18 × 1.75 = 32
      expect(result.content).toContain('iconSize700: CGFloat = 48');  // 42 × 1.143 = 48
    });

    it('should use Swift CGFloat type', () => {
      const result = generator.generateiOSTokens();

      // Icon tokens should use CGFloat type
      expect(result.content).toMatch(/iconSize\d{3}:\s*CGFloat\s*=\s*\d+/);
    });

    it('should include icon tokens in semantic token count', () => {
      const result = generator.generateiOSTokens();

      // Semantic token count should include the 11 icon size tokens
      expect(result.semanticTokenCount).toBeGreaterThanOrEqual(11);
    });

    it('should include formula and typography pairing in comments', () => {
      const result = generator.generateiOSTokens({ includeComments: true });

      // Should include calculation formula in comments
      expect(result.content).toContain('fontSize');
      expect(result.content).toContain('lineHeight');
      expect(result.content).toContain('×');
    });
  });

  describe('Android Token Generation (Kotlin)', () => {
    it('should generate Android tokens with icon size tokens', () => {
      const result = generator.generateAndroidTokens();

      expect(result.valid).toBe(true);
      expect(result.platform).toBe('android');
      expect(result.content).toBeTruthy();
    });

    it('should include all icon size tokens in generated content', () => {
      const result = generator.generateAndroidTokens();

      // Verify all 11 icon size tokens are present
      const iconTokenNames = Object.keys(iconTokens);
      iconTokenNames.forEach(tokenName => {
        // Convert to Kotlin snake_case format: icon.size100 -> icon_size_100
        const kotlinName = tokenName.replace('icon.size', 'icon_size_');
        expect(result.content).toContain(kotlinName);
      });
    });

    it('should generate icon tokens with calculated values', () => {
      const result = generator.generateAndroidTokens();

      // Test specific icon sizes with known values
      expect(result.content).toContain('icon_size_050 = 13.dp');  // 13 × 1.0 = 13
      expect(result.content).toContain('icon_size_075 = 18.dp');  // 14 × 1.25 = 18
      expect(result.content).toContain('icon_size_100 = 24.dp');  // 16 × 1.5 = 24
      expect(result.content).toContain('icon_size_125 = 32.dp');  // 18 × 1.75 = 32
      expect(result.content).toContain('icon_size_700 = 48.dp');  // 42 × 1.143 = 48
    });

    it('should use Kotlin Dp type', () => {
      const result = generator.generateAndroidTokens();

      // Icon tokens should use .dp extension
      expect(result.content).toMatch(/icon_size_\d{3}\s*=\s*\d+\.dp/);
    });

    it('should include icon tokens in semantic token count', () => {
      const result = generator.generateAndroidTokens();

      // Semantic token count should include the 11 icon size tokens
      expect(result.semanticTokenCount).toBeGreaterThanOrEqual(11);
    });

    it('should include formula and typography pairing in comments', () => {
      const result = generator.generateAndroidTokens({ includeComments: true });

      // Should include calculation formula in comments
      expect(result.content).toContain('fontSize');
      expect(result.content).toContain('lineHeight');
      expect(result.content).toContain('×');
    });
  });

  describe('Cross-Platform Consistency', () => {
    it('should generate same icon token count across all platforms', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      // All platforms should include the same number of icon tokens (11)
      const webIconCount = (webResult.content.match(/--icon-size-\d{3}/g) || []).length;
      const iosIconCount = (iosResult.content.match(/iconSize\d{3}/g) || []).length;
      const androidIconCount = (androidResult.content.match(/icon_size_\d{3}/g) || []).length;

      expect(webIconCount).toBe(11);
      expect(iosIconCount).toBe(11);
      expect(androidIconCount).toBe(11);
    });

    it('should generate same calculated values across all platforms', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      // Verify specific values match across platforms
      const testCases = [
        { scale: '050', value: 13 },
        { scale: '075', value: 18 },
        { scale: '100', value: 24 },
        { scale: '125', value: 32 },
        { scale: '700', value: 48 }
      ];

      testCases.forEach(({ scale, value }) => {
        // Web: --icon-size-050: 13px
        expect(webResult.content).toContain(`--icon-size-${scale}: ${value}px`);
        
        // iOS: iconSize050: CGFloat = 13
        expect(iosResult.content).toContain(`iconSize${scale}: CGFloat = ${value}`);
        
        // Android: icon_size_050 = 13.dp
        expect(androidResult.content).toContain(`icon_size_${scale} = ${value}.dp`);
      });
    });

    it('should maintain mathematical relationships across platforms', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      // Extract icon size values from each platform
      const extractIconSizes = (content: string, pattern: RegExp): number[] => {
        const matches = content.match(pattern);
        return matches ? matches.map(m => parseInt(m.match(/\d+/)![0])) : [];
      };

      const webSizes = extractIconSizes(webResult.content, /--icon-size-\d{3}:\s*(\d+)px/g);
      const iosSizes = extractIconSizes(iosResult.content, /iconSize\d{3}:\s*CGFloat\s*=\s*(\d+)/g);
      const androidSizes = extractIconSizes(androidResult.content, /icon_size_\d{3}\s*=\s*(\d+)\.dp/g);

      // All platforms should have the same set of unique values
      const uniqueWebSizes = Array.from(new Set(webSizes)).sort((a, b) => a - b);
      const uniqueIosSizes = Array.from(new Set(iosSizes)).sort((a, b) => a - b);
      const uniqueAndroidSizes = Array.from(new Set(androidSizes)).sort((a, b) => a - b);

      expect(uniqueWebSizes).toEqual(uniqueIosSizes);
      expect(uniqueIosSizes).toEqual(uniqueAndroidSizes);
    });

    it('should validate all platforms generate successfully', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      expect(webResult.valid).toBe(true);
      expect(iosResult.valid).toBe(true);
      expect(androidResult.valid).toBe(true);

      expect(webResult.errors).toBeUndefined();
      expect(iosResult.errors).toBeUndefined();
      expect(androidResult.errors).toBeUndefined();
    });
  });

  describe('Naming Convention Validation', () => {
    it('should use kebab-case with -- prefix for web CSS custom properties', () => {
      const result = generator.generateWebTokens();

      // All icon size tokens should follow --icon-size-* pattern
      const iconTokenPattern = /--icon-size-\d{3}:\s*\d+px/g;
      const matches = result.content.match(iconTokenPattern);

      expect(matches).toBeTruthy();
      expect(matches!.length).toBe(11);

      // Verify specific naming
      expect(result.content).toContain('--icon-size-050');
      expect(result.content).toContain('--icon-size-100');
      expect(result.content).toContain('--icon-size-700');
    });

    it('should use camelCase for iOS Swift constants', () => {
      const result = generator.generateiOSTokens();

      // All icon size tokens should use camelCase
      const iconTokenPattern = /iconSize\d{3}:\s*CGFloat\s*=\s*\d+/g;
      const matches = result.content.match(iconTokenPattern);

      expect(matches).toBeTruthy();
      expect(matches!.length).toBe(11);

      // Verify specific naming
      expect(result.content).toContain('iconSize050');
      expect(result.content).toContain('iconSize100');
      expect(result.content).toContain('iconSize700');
    });

    it('should use snake_case for Android Kotlin constants', () => {
      const result = generator.generateAndroidTokens();

      // All icon size tokens should use snake_case
      const iconTokenPattern = /icon_size_\d{3}\s*=\s*\d+\.dp/g;
      const matches = result.content.match(iconTokenPattern);

      expect(matches).toBeTruthy();
      expect(matches!.length).toBe(11);

      // Verify specific naming
      expect(result.content).toContain('icon_size_050');
      expect(result.content).toContain('icon_size_100');
      expect(result.content).toContain('icon_size_700');
    });
  });

  describe('Calculated Value Verification', () => {
    it('should verify all icon sizes match fontSize × lineHeight formula', () => {
      const webResult = generator.generateWebTokens();

      Object.entries(iconTokens).forEach(([tokenName, token]) => {
        const scale = tokenName.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const lineHeight = lineHeightTokens[`lineHeight${scale}`];
        const expectedSize = Math.round(fontSize.baseValue * lineHeight.baseValue);

        // Verify web generation
        const cssName = `--icon-size-${scale}`;
        expect(webResult.content).toContain(`${cssName}: ${expectedSize}px`);
      });
    });

    it('should verify iOS values match calculated sizes', () => {
      const iosResult = generator.generateiOSTokens();

      Object.entries(iconTokens).forEach(([tokenName, token]) => {
        const scale = tokenName.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const lineHeight = lineHeightTokens[`lineHeight${scale}`];
        const expectedSize = Math.round(fontSize.baseValue * lineHeight.baseValue);

        // Verify iOS generation
        const swiftName = `iconSize${scale}`;
        expect(iosResult.content).toContain(`${swiftName}: CGFloat = ${expectedSize}`);
      });
    });

    it('should verify Android values match calculated sizes', () => {
      const androidResult = generator.generateAndroidTokens();

      Object.entries(iconTokens).forEach(([tokenName, token]) => {
        const scale = tokenName.replace('icon.size', '');
        const fontSize = fontSizeTokens[`fontSize${scale}`];
        const lineHeight = lineHeightTokens[`lineHeight${scale}`];
        const expectedSize = Math.round(fontSize.baseValue * lineHeight.baseValue);

        // Verify Android generation
        const kotlinName = `icon_size_${scale}`;
        expect(androidResult.content).toContain(`${kotlinName} = ${expectedSize}.dp`);
      });
    });
  });

  describe('Token Convergence Handling', () => {
    it('should handle natural convergence at 32px across platforms', () => {
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      // size125, size200, and size300 all converge to 32px
      const convergentScales = ['125', '200', '300'];

      convergentScales.forEach(scale => {
        // Web
        expect(webResult.content).toContain(`--icon-size-${scale}: 32px`);
        
        // iOS
        expect(iosResult.content).toContain(`iconSize${scale}: CGFloat = 32`);
        
        // Android
        expect(androidResult.content).toContain(`icon_size_${scale} = 32.dp`);
      });
    });

    it('should maintain separate token names despite value convergence', () => {
      const webResult = generator.generateWebTokens();

      // Even though values converge, token names should remain distinct
      expect(webResult.content).toContain('--icon-size-125');
      expect(webResult.content).toContain('--icon-size-200');
      expect(webResult.content).toContain('--icon-size-300');

      // All should have value 32px
      const size125Match = webResult.content.match(/--icon-size-125:\s*(\d+)px/);
      const size200Match = webResult.content.match(/--icon-size-200:\s*(\d+)px/);
      const size300Match = webResult.content.match(/--icon-size-300:\s*(\d+)px/);

      expect(size125Match![1]).toBe('32');
      expect(size200Match![1]).toBe('32');
      expect(size300Match![1]).toBe('32');
    });
  });
});
