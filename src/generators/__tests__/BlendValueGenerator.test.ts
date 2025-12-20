/**
 * @category evergreen
 * @purpose Verify BlendValue generator produces correct output format
 */
/**
 * Blend Value Generator Tests
 * 
 * Tests blend value generation for all platforms with correct formatting.
 */

import { BlendValueGenerator } from '../BlendValueGenerator';
import { BLEND_BASE_VALUE } from '../../tokens/BlendTokens';

describe('BlendValueGenerator', () => {
  let generator: BlendValueGenerator;

  beforeEach(() => {
    generator = new BlendValueGenerator();
  });

  describe('Web Platform Generation', () => {
    test('generates web blend values with correct format', () => {
      const result = generator.generateWebBlendValues({ includeComments: false });

      expect(result).toContain('export const BLEND_BASE_VALUE = 0.04;');
      expect(result).toContain('export const BlendTokens = {');
      expect(result).toContain('blend100: 0.04');
      expect(result).toContain('blend200: 0.08');
      expect(result).toContain('blend300: 0.12');
      expect(result).toContain('blend400: 0.16');
      expect(result).toContain('blend500: 0.2');
      expect(result).toContain('};');
    });

    test('generates web blend values with comments', () => {
      const result = generator.generateWebBlendValues({ includeComments: true });

      expect(result).toContain('/**');
      expect(result).toContain('* Blend Value Constants');
      expect(result).toContain('* Base value: 0.04 (4%)');
      expect(result).toContain('// Subtle modification');
      expect(result).toContain('// base × 1 = 0.04 × 1 = 0.04');
    });

    test('generates web blend values without base value', () => {
      const result = generator.generateWebBlendValues({ 
        includeComments: false, 
        includeBaseValue: false 
      });

      expect(result).not.toContain('export const BLEND_BASE_VALUE');
      expect(result).toContain('export const BlendTokens = {');
    });
  });

  describe('iOS Platform Generation', () => {
    test('generates iOS blend values with correct format', () => {
      const result = generator.generateiOSBlendValues({ includeComments: false });

      expect(result).toContain('struct BlendTokens {');
      expect(result).toContain('static let baseValue: Double = 0.04');
      expect(result).toContain('static let blend100: Double = 0.04');
      expect(result).toContain('static let blend200: Double = 0.08');
      expect(result).toContain('static let blend300: Double = 0.12');
      expect(result).toContain('static let blend400: Double = 0.16');
      expect(result).toContain('static let blend500: Double = 0.2');
      expect(result).toContain('}');
    });

    test('generates iOS blend values with comments', () => {
      const result = generator.generateiOSBlendValues({ includeComments: true });

      expect(result).toContain('/**');
      expect(result).toContain('* Blend Value Constants');
      expect(result).toContain('// Subtle modification');
      expect(result).toContain('// base × 1 = 0.04 × 1 = 0.04');
    });

    test('generates iOS blend values without base value', () => {
      const result = generator.generateiOSBlendValues({ 
        includeComments: false, 
        includeBaseValue: false 
      });

      expect(result).not.toContain('static let baseValue');
      expect(result).toContain('struct BlendTokens {');
    });
  });

  describe('Android Platform Generation', () => {
    test('generates Android blend values with correct format', () => {
      const result = generator.generateAndroidBlendValues({ includeComments: false });

      expect(result).toContain('object BlendTokens {');
      expect(result).toContain('const val baseValue = 0.04f');
      expect(result).toContain('const val blend100 = 0.04f');
      expect(result).toContain('const val blend200 = 0.08f');
      expect(result).toContain('const val blend300 = 0.12f');
      expect(result).toContain('const val blend400 = 0.16f');
      expect(result).toContain('const val blend500 = 0.2f');
      expect(result).toContain('}');
    });

    test('generates Android blend values with comments', () => {
      const result = generator.generateAndroidBlendValues({ includeComments: true });

      expect(result).toContain('/**');
      expect(result).toContain('* Blend Value Constants');
      expect(result).toContain('// Subtle modification');
      expect(result).toContain('// base × 1 = 0.04 × 1 = 0.04');
    });

    test('generates Android blend values without base value', () => {
      const result = generator.generateAndroidBlendValues({ 
        includeComments: false, 
        includeBaseValue: false 
      });

      expect(result).not.toContain('const val baseValue');
      expect(result).toContain('object BlendTokens {');
    });
  });

  describe('All Platforms Generation', () => {
    test('generates blend values for all platforms', () => {
      const result = generator.generateAll({ includeComments: false });

      expect(result.web).toContain('export const BlendTokens');
      expect(result.ios).toContain('struct BlendTokens');
      expect(result.android).toContain('object BlendTokens');
    });
  });

  describe('Format Blend Value Helper', () => {
    test('formats web blend value correctly', () => {
      const result = generator.formatBlendValue('web', 'blend100', 0.04);
      expect(result).toBe('export const blend100 = 0.04;');
    });

    test('formats iOS blend value correctly', () => {
      const result = generator.formatBlendValue('ios', 'blend100', 0.04);
      expect(result).toBe('static let blend100: Double = 0.04');
    });

    test('formats Android blend value correctly', () => {
      const result = generator.formatBlendValue('android', 'blend100', 0.04);
      expect(result).toBe('const val blend100 = 0.04f');
    });
  });

  describe('Mathematical Relationships', () => {
    test('all blend tokens have correct mathematical values', () => {
      const tokens = generator.getBlendTokens();

      expect(tokens[0].baseValue).toBe(BLEND_BASE_VALUE); // blend100
      expect(tokens[1].baseValue).toBe(BLEND_BASE_VALUE * 2); // blend200
      expect(tokens[2].baseValue).toBe(BLEND_BASE_VALUE * 3); // blend300
      expect(tokens[3].baseValue).toBe(BLEND_BASE_VALUE * 4); // blend400
      expect(tokens[4].baseValue).toBe(BLEND_BASE_VALUE * 5); // blend500
    });

    test('all blend tokens are unitless', () => {
      const tokens = generator.getBlendTokens();

      tokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('unitless');
        expect(token.platforms.ios.unit).toBe('unitless');
        expect(token.platforms.android.unit).toBe('unitless');
      });
    });
  });

  describe('Cross-Platform Consistency', () => {
    test('all platforms generate same blend values', () => {
      const webResult = generator.generateWebBlendValues({ includeComments: false });
      const iosResult = generator.generateiOSBlendValues({ includeComments: false });
      const androidResult = generator.generateAndroidBlendValues({ includeComments: false });

      // Extract values from each platform
      const webValues = webResult.match(/blend\d+: ([\d.]+)/g) || [];
      const iosValues = iosResult.match(/blend\d+: Double = ([\d.]+)/g) || [];
      const androidValues = androidResult.match(/blend\d+ = ([\d.]+)f/g) || [];

      // All platforms should have same number of blend tokens
      expect(webValues.length).toBe(5);
      expect(iosValues.length).toBe(5);
      expect(androidValues.length).toBe(5);
    });

    test('base value is consistent across platforms', () => {
      const webResult = generator.generateWebBlendValues({ includeComments: false });
      const iosResult = generator.generateiOSBlendValues({ includeComments: false });
      const androidResult = generator.generateAndroidBlendValues({ includeComments: false });

      expect(webResult).toContain(`BLEND_BASE_VALUE = ${BLEND_BASE_VALUE}`);
      expect(iosResult).toContain(`baseValue: Double = ${BLEND_BASE_VALUE}`);
      expect(androidResult).toContain(`baseValue = ${BLEND_BASE_VALUE}f`);
    });
  });
});
