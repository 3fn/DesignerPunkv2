/**
 * @category evergreen
 * @purpose Verify platform output format generators produce correct RGBA/color output
 */
/**
 * Platform Output Format Tests
 * 
 * Tests for platform-specific color output format generation.
 * Validates RGBA parsing, conversion, and alpha channel preservation
 * across Web (CSS), iOS (Swift/UIColor), and Android (Kotlin/Color.argb).
 * 
 * **Validates: Requirements 8.3** - Platform output format tests
 * 
 * Task 9.2: Update platform output tests
 */

import { WebFormatGenerator } from '../WebFormatGenerator';
import { iOSFormatGenerator } from '../iOSFormatGenerator';
import { AndroidFormatGenerator } from '../AndroidFormatGenerator';

describe('Platform Output Format Tests', () => {
  describe('Web Platform - RGBA Format', () => {
    let generator: WebFormatGenerator;

    beforeEach(() => {
      generator = new WebFormatGenerator();
    });

    describe('parseRgbaString', () => {
      test('should parse standard RGBA string with full opacity', () => {
        const result = generator.parseRgbaString('rgba(184, 182, 200, 1)');
        
        expect(result).not.toBeNull();
        expect(result?.r).toBe(184);
        expect(result?.g).toBe(182);
        expect(result?.b).toBe(200);
        expect(result?.a).toBe(1);
      });

      test('should parse RGBA string with partial opacity', () => {
        const result = generator.parseRgbaString('rgba(184, 182, 200, 0.48)');
        
        expect(result).not.toBeNull();
        expect(result?.r).toBe(184);
        expect(result?.g).toBe(182);
        expect(result?.b).toBe(200);
        expect(result?.a).toBe(0.48);
      });

      test('should parse RGBA string with zero opacity', () => {
        const result = generator.parseRgbaString('rgba(255, 0, 0, 0)');
        
        expect(result).not.toBeNull();
        expect(result?.r).toBe(255);
        expect(result?.g).toBe(0);
        expect(result?.b).toBe(0);
        expect(result?.a).toBe(0);
      });

      test('should handle RGBA string with extra whitespace', () => {
        const result = generator.parseRgbaString('rgba( 184 , 182 , 200 , 0.48 )');
        
        expect(result).not.toBeNull();
        expect(result?.r).toBe(184);
        expect(result?.g).toBe(182);
        expect(result?.b).toBe(200);
        expect(result?.a).toBe(0.48);
      });

      test('should return null for invalid RGBA string', () => {
        expect(generator.parseRgbaString('rgb(184, 182, 200)')).toBeNull();
        expect(generator.parseRgbaString('#B8B6C8')).toBeNull();
        expect(generator.parseRgbaString('invalid')).toBeNull();
      });

      test('should handle edge case RGB values (0 and 255)', () => {
        const black = generator.parseRgbaString('rgba(0, 0, 0, 1)');
        expect(black?.r).toBe(0);
        expect(black?.g).toBe(0);
        expect(black?.b).toBe(0);

        const white = generator.parseRgbaString('rgba(255, 255, 255, 1)');
        expect(white?.r).toBe(255);
        expect(white?.g).toBe(255);
        expect(white?.b).toBe(255);
      });
    });

    describe('generateRgbaAlpha', () => {
      test('should generate correct RGBA format: rgba(r, g, b, a)', () => {
        const result = generator.generateRgbaAlpha(74, 222, 128, 1);
        expect(result).toBe('rgba(74, 222, 128, 1)');
      });

      test('should preserve alpha channel in output', () => {
        const result = generator.generateRgbaAlpha(184, 182, 200, 0.48);
        expect(result).toBe('rgba(184, 182, 200, 0.48)');
        expect(result).toContain('0.48');
      });

      test('should handle zero alpha (fully transparent)', () => {
        const result = generator.generateRgbaAlpha(255, 0, 0, 0);
        expect(result).toBe('rgba(255, 0, 0, 0)');
      });

      test('should handle full alpha (fully opaque)', () => {
        const result = generator.generateRgbaAlpha(0, 255, 0, 1);
        expect(result).toBe('rgba(0, 255, 0, 1)');
      });
    });

    describe('formatColorValue', () => {
      test('should return RGBA string as-is', () => {
        const result = generator.formatColorValue('rgba(184, 182, 200, 0.48)');
        expect(result).toBe('rgba(184, 182, 200, 0.48)');
      });

      test('should extract light/base value from mode-aware object', () => {
        const modeAwareColor = {
          light: { base: 'rgba(184, 182, 200, 1)' },
          dark: { base: 'rgba(100, 100, 100, 1)' }
        };
        const result = generator.formatColorValue(modeAwareColor);
        expect(result).toBe('rgba(184, 182, 200, 1)');
      });
    });
  });

  describe('iOS Platform - UIColor Format', () => {
    let generator: iOSFormatGenerator;

    beforeEach(() => {
      generator = new iOSFormatGenerator();
    });

    describe('parseRgbaString', () => {
      test('should parse standard RGBA string', () => {
        const result = generator.parseRgbaString('rgba(184, 182, 200, 1)');
        
        expect(result).not.toBeNull();
        expect(result?.r).toBe(184);
        expect(result?.g).toBe(182);
        expect(result?.b).toBe(200);
        expect(result?.a).toBe(1);
      });

      test('should parse RGBA string with partial opacity', () => {
        const result = generator.parseRgbaString('rgba(184, 182, 200, 0.48)');
        
        expect(result).not.toBeNull();
        expect(result?.a).toBe(0.48);
      });

      test('should return null for invalid input', () => {
        expect(generator.parseRgbaString('invalid')).toBeNull();
      });
    });

    describe('rgbaStringToUIColor', () => {
      test('should convert RGBA to UIColor format: UIColor(red:green:blue:alpha:)', () => {
        const result = generator.rgbaStringToUIColor('rgba(184, 182, 200, 1)');
        
        // UIColor uses 0-1 range for RGB values
        expect(result).toContain('UIColor(red:');
        expect(result).toContain('green:');
        expect(result).toContain('blue:');
        expect(result).toContain('alpha:');
      });

      test('should normalize RGB values from 0-255 to 0-1 range', () => {
        const result = generator.rgbaStringToUIColor('rgba(255, 128, 0, 1)');
        
        // 255/255 = 1.00, 128/255 ≈ 0.50, 0/255 = 0.00
        expect(result).toContain('red: 1.00');
        expect(result).toContain('green: 0.50');
        expect(result).toContain('blue: 0.00');
      });

      test('should preserve alpha channel value', () => {
        const result = generator.rgbaStringToUIColor('rgba(184, 182, 200, 0.48)');
        
        expect(result).toContain('alpha: 0.48');
      });

      test('should handle full opacity', () => {
        const result = generator.rgbaStringToUIColor('rgba(74, 222, 128, 1)');
        
        expect(result).toContain('alpha: 1.00');
      });

      test('should handle zero opacity', () => {
        const result = generator.rgbaStringToUIColor('rgba(255, 0, 0, 0)');
        
        expect(result).toContain('alpha: 0.00');
      });

      test('should return UIColor.clear for invalid RGBA string', () => {
        const result = generator.rgbaStringToUIColor('invalid');
        
        expect(result).toContain('UIColor.clear');
      });

      test('should produce correct format for green-400 (feedback success)', () => {
        // green-400 = rgba(0, 255, 136, 1)
        const result = generator.rgbaStringToUIColor('rgba(0, 255, 136, 1)');
        
        expect(result).toContain('red: 0.00');
        expect(result).toContain('green: 1.00');
        expect(result).toContain('blue: 0.53'); // 136/255 ≈ 0.53
        expect(result).toContain('alpha: 1.00');
      });
    });

    describe('generateColorWithOpacity', () => {
      test('should generate SwiftUI Color format', () => {
        const result = generator.generateColorWithOpacity(0.72, 0.71, 0.78, 0.48);
        
        expect(result).toBe('Color(red: 0.72, green: 0.71, blue: 0.78, opacity: 0.48)');
      });

      test('should preserve opacity parameter', () => {
        const result = generator.generateColorWithOpacity(0.5, 0.5, 0.5, 0.32);
        
        expect(result).toContain('opacity: 0.32');
      });
    });
  });

  describe('Android Platform - Color.argb Format', () => {
    let generator: AndroidFormatGenerator;

    beforeEach(() => {
      generator = new AndroidFormatGenerator('kotlin');
    });

    describe('parseRgbaString', () => {
      test('should parse standard RGBA string', () => {
        const result = generator.parseRgbaString('rgba(184, 182, 200, 1)');
        
        expect(result).not.toBeNull();
        expect(result?.r).toBe(184);
        expect(result?.g).toBe(182);
        expect(result?.b).toBe(200);
        expect(result?.a).toBe(1);
      });

      test('should parse RGBA string with partial opacity', () => {
        const result = generator.parseRgbaString('rgba(184, 182, 200, 0.48)');
        
        expect(result).not.toBeNull();
        expect(result?.a).toBe(0.48);
      });

      test('should return null for invalid input', () => {
        expect(generator.parseRgbaString('invalid')).toBeNull();
      });
    });

    describe('rgbaStringToColorArgb', () => {
      test('should convert RGBA to Color.argb format: Color.argb(a, r, g, b)', () => {
        const result = generator.rgbaStringToColorArgb('rgba(184, 182, 200, 1)');
        
        // Full opacity: alpha = 255
        expect(result).toBe('Color.argb(255, 184, 182, 200)');
      });

      test('should convert alpha from 0-1 to 0-255 range', () => {
        const result = generator.rgbaStringToColorArgb('rgba(184, 182, 200, 0.48)');
        
        // 0.48 * 255 = 122.4 → 122
        expect(result).toBe('Color.argb(122, 184, 182, 200)');
      });

      test('should handle zero alpha (fully transparent)', () => {
        const result = generator.rgbaStringToColorArgb('rgba(255, 0, 0, 0)');
        
        expect(result).toBe('Color.argb(0, 255, 0, 0)');
      });

      test('should handle full alpha (fully opaque)', () => {
        const result = generator.rgbaStringToColorArgb('rgba(0, 255, 0, 1)');
        
        expect(result).toBe('Color.argb(255, 0, 255, 0)');
      });

      test('should return Color.TRANSPARENT for invalid RGBA string', () => {
        const result = generator.rgbaStringToColorArgb('invalid');
        
        expect(result).toContain('Color.TRANSPARENT');
      });

      test('should produce correct format for green-400 (feedback success)', () => {
        // green-400 = rgba(0, 255, 136, 1)
        const result = generator.rgbaStringToColorArgb('rgba(0, 255, 136, 1)');
        
        expect(result).toBe('Color.argb(255, 0, 255, 136)');
      });

      test('should produce correct format for border.subtle with baked-in alpha', () => {
        // color.structure.border.subtle = rgba(184, 182, 200, 0.48)
        const result = generator.rgbaStringToColorArgb('rgba(184, 182, 200, 0.48)');
        
        // 0.48 * 255 = 122.4 → 122
        expect(result).toBe('Color.argb(122, 184, 182, 200)');
      });
    });

    describe('generateColorWithAlpha', () => {
      test('should generate Jetpack Compose Color.copy format', () => {
        const result = generator.generateColorWithAlpha('0xFF6B50A4', 0.48);
        
        expect(result).toBe('Color(0xFF6B50A4).copy(alpha = 0.48f)');
      });

      test('should preserve alpha parameter with f suffix', () => {
        const result = generator.generateColorWithAlpha('0xFFB8B6C8', 0.32);
        
        expect(result).toContain('alpha = 0.32f');
      });
    });
  });

  describe('Alpha Channel Preservation', () => {
    test('Web should preserve alpha in RGBA output', () => {
      const generator = new WebFormatGenerator();
      
      // Test various alpha values
      const alphaValues = [0, 0.08, 0.16, 0.32, 0.48, 0.64, 0.80, 0.88, 1];
      
      alphaValues.forEach(alpha => {
        const result = generator.generateRgbaAlpha(128, 128, 128, alpha);
        expect(result).toContain(alpha.toString());
      });
    });

    test('iOS should preserve alpha in UIColor output', () => {
      const generator = new iOSFormatGenerator();
      
      // Test baked-in alpha value (0.48)
      const result = generator.rgbaStringToUIColor('rgba(184, 182, 200, 0.48)');
      expect(result).toContain('alpha: 0.48');
    });

    test('Android should convert and preserve alpha in Color.argb output', () => {
      const generator = new AndroidFormatGenerator('kotlin');
      
      // Test various alpha values and their 0-255 conversions
      const testCases = [
        { alpha: 0, expected: 0 },
        { alpha: 0.48, expected: 122 },  // 0.48 * 255 = 122.4 → 122
        { alpha: 0.5, expected: 128 },   // 0.5 * 255 = 127.5 → 128
        { alpha: 1, expected: 255 }
      ];
      
      testCases.forEach(({ alpha, expected }) => {
        const result = generator.rgbaStringToColorArgb(`rgba(128, 128, 128, ${alpha})`);
        expect(result).toContain(`Color.argb(${expected},`);
      });
    });
  });

  describe('Cross-Platform Format Consistency', () => {
    test('all platforms should parse the same RGBA input correctly', () => {
      const webGenerator = new WebFormatGenerator();
      const iosGenerator = new iOSFormatGenerator();
      const androidGenerator = new AndroidFormatGenerator('kotlin');
      
      const testRgba = 'rgba(184, 182, 200, 0.48)';
      
      const webParsed = webGenerator.parseRgbaString(testRgba);
      const iosParsed = iosGenerator.parseRgbaString(testRgba);
      const androidParsed = androidGenerator.parseRgbaString(testRgba);
      
      // All should parse to same values
      expect(webParsed?.r).toBe(184);
      expect(iosParsed?.r).toBe(184);
      expect(androidParsed?.r).toBe(184);
      
      expect(webParsed?.a).toBe(0.48);
      expect(iosParsed?.a).toBe(0.48);
      expect(androidParsed?.a).toBe(0.48);
    });

    test('all platforms should produce valid output for semantic color tokens', () => {
      const webGenerator = new WebFormatGenerator();
      const iosGenerator = new iOSFormatGenerator();
      const androidGenerator = new AndroidFormatGenerator('kotlin');
      
      // Test color.structure.border.subtle with baked-in alpha
      const borderSubtle = 'rgba(184, 182, 200, 0.48)';
      
      // Web: should output rgba format directly
      const webResult = webGenerator.formatColorValue(borderSubtle);
      expect(webResult).toBe('rgba(184, 182, 200, 0.48)');
      
      // iOS: should convert to UIColor format
      const iosResult = iosGenerator.rgbaStringToUIColor(borderSubtle);
      expect(iosResult).toContain('UIColor(red:');
      expect(iosResult).toContain('alpha: 0.48');
      
      // Android: should convert to Color.argb format
      const androidResult = androidGenerator.rgbaStringToColorArgb(borderSubtle);
      expect(androidResult).toBe('Color.argb(122, 184, 182, 200)');
    });
  });

  describe('Opacity Composition Resolution', () => {
    /**
     * Tests for opacity composition pattern: { color: 'gray100', opacity: 'opacity600' }
     * Validates that generators resolve color + opacity primitives to RGBA output
     * 
     * **Validates: Requirements 1.3, 5.4** - Platform generators resolve opacity composition
     */

    describe('Web Platform - Opacity Composition', () => {
      let generator: WebFormatGenerator;

      beforeEach(() => {
        generator = new WebFormatGenerator();
      });

      test('should resolve opacity composition to rgba format', () => {
        // Create a semantic token with opacity composition
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border with transparency',
          description: 'Semi-transparent border'
        };

        const result = generator.formatSingleReferenceToken(semanticToken as any);

        // Should contain the CSS custom property name
        expect(result).toContain('--color-structure-border-subtle');
        // Should contain rgba format with resolved values
        // gray100 = rgba(184, 182, 200, 1), opacity600 = 0.48
        expect(result).toContain('rgba(184, 182, 200, 0.48)');
      });

      test('should produce correct CSS output format', () => {
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border',
          description: 'Semi-transparent border'
        };

        const result = generator.formatSingleReferenceToken(semanticToken as any);

        // Verify CSS custom property format
        expect(result).toMatch(/--color-structure-border-subtle:\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\);/);
      });
    });

    describe('iOS Platform - Opacity Composition', () => {
      let generator: iOSFormatGenerator;

      beforeEach(() => {
        generator = new iOSFormatGenerator();
      });

      test('should resolve opacity composition to UIColor format', () => {
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border with transparency',
          description: 'Semi-transparent border'
        };

        const result = generator.formatSingleReferenceToken(semanticToken as any);

        // Should contain the Swift constant name
        expect(result).toContain('colorStructureBorderSubtle');
        // Should contain UIColor format
        expect(result).toContain('UIColor(red:');
        // Should contain the resolved alpha value (0.48)
        expect(result).toContain('alpha: 0.48');
      });

      test('should produce correct Swift output format', () => {
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border',
          description: 'Semi-transparent border'
        };

        const result = generator.formatSingleReferenceToken(semanticToken as any);

        // Verify Swift constant format with UIColor
        expect(result).toMatch(/public static let colorStructureBorderSubtle: UIColor = UIColor\(red:/);
      });
    });

    describe('Android Platform - Opacity Composition', () => {
      let generator: AndroidFormatGenerator;

      beforeEach(() => {
        generator = new AndroidFormatGenerator('kotlin');
      });

      test('should resolve opacity composition to Color.argb format', () => {
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border with transparency',
          description: 'Semi-transparent border'
        };

        const result = generator.formatSingleReferenceToken(semanticToken as any);

        // Should contain the Kotlin constant name (snake_case)
        expect(result).toContain('color_structure_border_subtle');
        // Should contain Color.argb format
        expect(result).toContain('Color.argb(');
        // opacity600 = 0.48, 0.48 * 255 = 122.4 → 122
        expect(result).toContain('Color.argb(122,');
      });

      test('should produce correct Kotlin output format', () => {
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border',
          description: 'Semi-transparent border'
        };

        const result = generator.formatSingleReferenceToken(semanticToken as any);

        // Verify Kotlin val format with Color.argb
        expect(result).toMatch(/val color_structure_border_subtle = Color\.argb\(\d+, \d+, \d+, \d+\)/);
      });

      test('should produce correct XML output format', () => {
        const xmlGenerator = new AndroidFormatGenerator('xml');
        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border',
          description: 'Semi-transparent border'
        };

        const result = xmlGenerator.formatSingleReferenceToken(semanticToken as any);

        // Verify XML color format with hex ARGB
        // opacity600 = 0.48, 0.48 * 255 = 122 = 0x7A
        expect(result).toContain('<color name="color_structure_border_subtle">');
        expect(result).toMatch(/#[0-9A-F]{8}/); // ARGB hex format
      });
    });

    describe('Cross-Platform Opacity Composition Consistency', () => {
      test('all platforms should resolve same opacity composition to equivalent values', () => {
        const webGenerator = new WebFormatGenerator();
        const iosGenerator = new iOSFormatGenerator();
        const androidGenerator = new AndroidFormatGenerator('kotlin');

        const semanticToken = {
          name: 'color.structure.border.subtle',
          primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
          category: 'color',
          context: 'Subtle border',
          description: 'Semi-transparent border'
        };

        const webResult = webGenerator.formatSingleReferenceToken(semanticToken as any);
        const iosResult = iosGenerator.formatSingleReferenceToken(semanticToken as any);
        const androidResult = androidGenerator.formatSingleReferenceToken(semanticToken as any);

        // All should resolve gray100 (184, 182, 200) with opacity600 (0.48)
        
        // Web: rgba(184, 182, 200, 0.48)
        expect(webResult).toContain('rgba(184, 182, 200, 0.48)');
        
        // iOS: UIColor with alpha: 0.48
        expect(iosResult).toContain('alpha: 0.48');
        
        // Android: Color.argb(122, ...) where 122 = 0.48 * 255
        expect(androidResult).toContain('Color.argb(122,');
      });
    });
  });
});
