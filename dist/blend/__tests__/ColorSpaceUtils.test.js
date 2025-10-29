"use strict";
/**
 * Color Space Conversion Utilities Tests
 *
 * Tests for RGB ↔ HSL ↔ Hex color space conversions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ColorSpaceUtils_1 = require("../ColorSpaceUtils");
describe('ColorSpaceUtils', () => {
    describe('hexToRgb', () => {
        test('converts 6-digit hex with # prefix to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('#A855F7');
            expect(result).toEqual({ r: 168, g: 85, b: 247 });
        });
        test('converts 6-digit hex without # prefix to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('A855F7');
            expect(result).toEqual({ r: 168, g: 85, b: 247 });
        });
        test('converts 3-digit hex with # prefix to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('#ABC');
            expect(result).toEqual({ r: 170, g: 187, b: 204 });
        });
        test('converts 3-digit hex without # prefix to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('ABC');
            expect(result).toEqual({ r: 170, g: 187, b: 204 });
        });
        test('converts black (#000000) to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('#000000');
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        test('converts white (#FFFFFF) to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('#FFFFFF');
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        test('handles lowercase hex values', () => {
            const result = (0, ColorSpaceUtils_1.hexToRgb)('#a855f7');
            expect(result).toEqual({ r: 168, g: 85, b: 247 });
        });
        test('throws error for invalid hex string', () => {
            expect(() => (0, ColorSpaceUtils_1.hexToRgb)('invalid')).toThrow('Invalid hex color');
            expect(() => (0, ColorSpaceUtils_1.hexToRgb)('#GG0000')).toThrow('Invalid hex color');
            expect(() => (0, ColorSpaceUtils_1.hexToRgb)('#12')).toThrow('Invalid hex color');
            expect(() => (0, ColorSpaceUtils_1.hexToRgb)('#1234567')).toThrow('Invalid hex color');
        });
    });
    describe('rgbToHex', () => {
        test('converts RGB to 6-digit hex with # prefix', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHex)({ r: 168, g: 85, b: 247 });
            expect(result).toBe('#A855F7');
        });
        test('converts black RGB to hex', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHex)({ r: 0, g: 0, b: 0 });
            expect(result).toBe('#000000');
        });
        test('converts white RGB to hex', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHex)({ r: 255, g: 255, b: 255 });
            expect(result).toBe('#FFFFFF');
        });
        test('pads single-digit hex values with zero', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHex)({ r: 1, g: 2, b: 3 });
            expect(result).toBe('#010203');
        });
        test('clamps values below 0 to 0', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHex)({ r: -10, g: 100, b: 200 });
            expect(result).toBe('#0064C8');
        });
        test('clamps values above 255 to 255', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHex)({ r: 300, g: 100, b: 200 });
            expect(result).toBe('#FF64C8');
        });
    });
    describe('rgbToHsl', () => {
        test('converts purple RGB to HSL', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 168, g: 85, b: 247 });
            // RGB(168, 85, 247) converts to approximately HSL(271°, 91%, 65%)
            expect(result.h).toBeCloseTo(271, 1);
            expect(result.s).toBeCloseTo(0.91, 2);
            expect(result.l).toBeCloseTo(0.65, 2);
        });
        test('converts black RGB to HSL', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 0, g: 0, b: 0 });
            expect(result).toEqual({ h: 0, s: 0, l: 0 });
        });
        test('converts white RGB to HSL', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 255, g: 255, b: 255 });
            expect(result).toEqual({ h: 0, s: 0, l: 1 });
        });
        test('converts gray RGB to HSL (achromatic)', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 128, g: 128, b: 128 });
            expect(result.h).toBe(0);
            expect(result.s).toBe(0);
            expect(result.l).toBeCloseTo(0.50, 2);
        });
        test('converts red RGB to HSL', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 255, g: 0, b: 0 });
            expect(result.h).toBe(0);
            expect(result.s).toBe(1);
            expect(result.l).toBe(0.5);
        });
        test('converts green RGB to HSL', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 0, g: 255, b: 0 });
            expect(result.h).toBe(120);
            expect(result.s).toBe(1);
            expect(result.l).toBe(0.5);
        });
        test('converts blue RGB to HSL', () => {
            const result = (0, ColorSpaceUtils_1.rgbToHsl)({ r: 0, g: 0, b: 255 });
            expect(result.h).toBe(240);
            expect(result.s).toBe(1);
            expect(result.l).toBe(0.5);
        });
    });
    describe('hslToRgb', () => {
        test('converts purple HSL to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 271, s: 0.91, l: 0.65 });
            // HSL(271°, 91%, 65%) converts to approximately RGB(168, 85, 247)
            expect(result.r).toBeCloseTo(168, 0);
            expect(result.g).toBeCloseTo(85, 0);
            expect(result.b).toBeCloseTo(247, 0);
        });
        test('converts black HSL to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 0, s: 0, l: 0 });
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        test('converts white HSL to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 0, s: 0, l: 1 });
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        test('converts gray HSL to RGB (achromatic)', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 0, s: 0, l: 0.5 });
            expect(result.r).toBeCloseTo(128, 0);
            expect(result.g).toBeCloseTo(128, 0);
            expect(result.b).toBeCloseTo(128, 0);
        });
        test('converts red HSL to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 0, s: 1, l: 0.5 });
            expect(result).toEqual({ r: 255, g: 0, b: 0 });
        });
        test('converts green HSL to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 120, s: 1, l: 0.5 });
            expect(result).toEqual({ r: 0, g: 255, b: 0 });
        });
        test('converts blue HSL to RGB', () => {
            const result = (0, ColorSpaceUtils_1.hslToRgb)({ h: 240, s: 1, l: 0.5 });
            expect(result).toEqual({ r: 0, g: 0, b: 255 });
        });
    });
    describe('round-trip conversions', () => {
        test('RGB → HSL → RGB preserves color', () => {
            const original = { r: 168, g: 85, b: 247 };
            const hsl = (0, ColorSpaceUtils_1.rgbToHsl)(original);
            const result = (0, ColorSpaceUtils_1.hslToRgb)(hsl);
            // Allow 1 unit difference due to rounding in conversions
            expect(result.r).toBeCloseTo(original.r, -0.5);
            expect(result.g).toBeCloseTo(original.g, -0.5);
            expect(result.b).toBeCloseTo(original.b, -0.5);
        });
        test('HSL → RGB → HSL preserves color', () => {
            const original = { h: 271, s: 0.91, l: 0.65 };
            const rgb = (0, ColorSpaceUtils_1.hslToRgb)(original);
            const result = (0, ColorSpaceUtils_1.rgbToHsl)(rgb);
            expect(result.h).toBeCloseTo(original.h, 0);
            expect(result.s).toBeCloseTo(original.s, 2);
            expect(result.l).toBeCloseTo(original.l, 2);
        });
        test('Hex → RGB → Hex preserves color', () => {
            const original = '#A855F7';
            const rgb = (0, ColorSpaceUtils_1.hexToRgb)(original);
            const result = (0, ColorSpaceUtils_1.rgbToHex)(rgb);
            expect(result).toBe(original);
        });
        test('RGB → Hex → RGB preserves color', () => {
            const original = { r: 168, g: 85, b: 247 };
            const hex = (0, ColorSpaceUtils_1.rgbToHex)(original);
            const result = (0, ColorSpaceUtils_1.hexToRgb)(hex);
            expect(result).toEqual(original);
        });
    });
    describe('edge cases', () => {
        test('handles maximum saturation', () => {
            const hsl = { h: 180, s: 1.0, l: 0.5 };
            const rgb = (0, ColorSpaceUtils_1.hslToRgb)(hsl);
            const result = (0, ColorSpaceUtils_1.rgbToHsl)(rgb);
            expect(result.s).toBeCloseTo(1.0, 2);
        });
        test('handles minimum saturation', () => {
            const hsl = { h: 180, s: 0.0, l: 0.5 };
            const rgb = (0, ColorSpaceUtils_1.hslToRgb)(hsl);
            const result = (0, ColorSpaceUtils_1.rgbToHsl)(rgb);
            expect(result.s).toBe(0);
        });
        test('handles hue wraparound at 360 degrees', () => {
            const hsl1 = (0, ColorSpaceUtils_1.hslToRgb)({ h: 0, s: 1, l: 0.5 });
            const hsl2 = (0, ColorSpaceUtils_1.hslToRgb)({ h: 360, s: 1, l: 0.5 });
            expect(hsl1).toEqual(hsl2);
        });
    });
    describe('calculateDarkerBlend', () => {
        test('darkens purple500 by 8% (blend200)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.08);
            // Verify result is darker than original
            expect(result.r).toBeLessThan(baseColor.r);
            expect(result.g).toBeLessThan(baseColor.g);
            expect(result.b).toBeLessThan(baseColor.b);
            // Verify specific values (baseColor * 0.92)
            expect(result.r).toBe(Math.round(168 * 0.92)); // 155
            expect(result.g).toBe(Math.round(85 * 0.92)); // 78
            expect(result.b).toBe(Math.round(247 * 0.92)); // 227
        });
        test('darkens blue500 by 12% (blend300)', () => {
            const baseColor = { r: 59, g: 130, b: 246 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.12);
            // Verify result is darker than original
            expect(result.r).toBeLessThan(baseColor.r);
            expect(result.g).toBeLessThan(baseColor.g);
            expect(result.b).toBeLessThan(baseColor.b);
            // Verify specific values (baseColor * 0.88)
            expect(result.r).toBe(Math.round(59 * 0.88)); // 52
            expect(result.g).toBe(Math.round(130 * 0.88)); // 114
            expect(result.b).toBe(Math.round(246 * 0.88)); // 216
        });
        test('darkens red by 4% (blend100)', () => {
            const baseColor = { r: 255, g: 0, b: 0 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.04);
            // Verify result is darker
            expect(result.r).toBeLessThan(baseColor.r);
            expect(result.g).toBe(0); // Already at minimum
            expect(result.b).toBe(0); // Already at minimum
            // Verify specific value (255 * 0.96)
            expect(result.r).toBe(Math.round(255 * 0.96)); // 245
        });
        test('darkens white by 20% (blend500)', () => {
            const baseColor = { r: 255, g: 255, b: 255 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.20);
            // Verify result is darker
            expect(result.r).toBeLessThan(baseColor.r);
            expect(result.g).toBeLessThan(baseColor.g);
            expect(result.b).toBeLessThan(baseColor.b);
            // Verify specific values (255 * 0.80)
            expect(result.r).toBe(Math.round(255 * 0.80)); // 204
            expect(result.g).toBe(Math.round(255 * 0.80)); // 204
            expect(result.b).toBe(Math.round(255 * 0.80)); // 204
        });
        test('handles black color (no change possible)', () => {
            const baseColor = { r: 0, g: 0, b: 0 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.08);
            // Black stays black
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        test('clamps RGB values to 0-255 range', () => {
            const baseColor = { r: 10, g: 5, b: 3 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.50);
            // Verify values are clamped to valid range
            expect(result.r).toBeGreaterThanOrEqual(0);
            expect(result.r).toBeLessThanOrEqual(255);
            expect(result.g).toBeGreaterThanOrEqual(0);
            expect(result.g).toBeLessThanOrEqual(255);
            expect(result.b).toBeGreaterThanOrEqual(0);
            expect(result.b).toBeLessThanOrEqual(255);
            // Verify specific values (very dark colors)
            expect(result.r).toBe(Math.round(10 * 0.50)); // 5
            expect(result.g).toBe(Math.round(5 * 0.50)); // 3
            expect(result.b).toBe(Math.round(3 * 0.50)); // 2
        });
        test('handles zero blend value (no change)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.0);
            // No darkening should occur
            expect(result).toEqual(baseColor);
        });
        test('handles maximum blend value (complete darkening)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 1.0);
            // Complete darkening results in black
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        test('produces darker colors for all RGB components', () => {
            const baseColor = { r: 100, g: 150, b: 200 };
            const result = (0, ColorSpaceUtils_1.calculateDarkerBlend)(baseColor, 0.10);
            // All components should be darker
            expect(result.r).toBeLessThan(baseColor.r);
            expect(result.g).toBeLessThan(baseColor.g);
            expect(result.b).toBeLessThan(baseColor.b);
            // Verify proportional darkening
            expect(result.r).toBe(Math.round(100 * 0.90)); // 90
            expect(result.g).toBe(Math.round(150 * 0.90)); // 135
            expect(result.b).toBe(Math.round(200 * 0.90)); // 180
        });
    });
    describe('calculateLighterBlend', () => {
        test('lightens purple500 by 8% (blend200)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.08);
            // Verify result is lighter than original
            expect(result.r).toBeGreaterThan(baseColor.r);
            expect(result.g).toBeGreaterThan(baseColor.g);
            expect(result.b).toBeGreaterThan(baseColor.b);
            // Verify specific values (baseColor * 0.92 + white * 0.08)
            expect(result.r).toBe(Math.round(168 * 0.92 + 255 * 0.08)); // 175
            expect(result.g).toBe(Math.round(85 * 0.92 + 255 * 0.08)); // 98
            expect(result.b).toBe(Math.round(247 * 0.92 + 255 * 0.08)); // 248
        });
        test('lightens blue500 by 12% (blend300)', () => {
            const baseColor = { r: 59, g: 130, b: 246 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.12);
            // Verify result is lighter than original
            expect(result.r).toBeGreaterThan(baseColor.r);
            expect(result.g).toBeGreaterThan(baseColor.g);
            expect(result.b).toBeGreaterThan(baseColor.b);
            // Verify specific values (baseColor * 0.88 + white * 0.12)
            expect(result.r).toBe(Math.round(59 * 0.88 + 255 * 0.12)); // 83
            expect(result.g).toBe(Math.round(130 * 0.88 + 255 * 0.12)); // 145
            expect(result.b).toBe(Math.round(246 * 0.88 + 255 * 0.12)); // 247
        });
        test('lightens red by 4% (blend100)', () => {
            const baseColor = { r: 255, g: 0, b: 0 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.04);
            // Verify result is lighter (or same for already-max red)
            expect(result.r).toBe(255); // Already at maximum
            expect(result.g).toBeGreaterThan(baseColor.g);
            expect(result.b).toBeGreaterThan(baseColor.b);
            // Verify specific values
            expect(result.r).toBe(Math.round(255 * 0.96 + 255 * 0.04)); // 255
            expect(result.g).toBe(Math.round(0 * 0.96 + 255 * 0.04)); // 10
            expect(result.b).toBe(Math.round(0 * 0.96 + 255 * 0.04)); // 10
        });
        test('lightens black by 20% (blend500)', () => {
            const baseColor = { r: 0, g: 0, b: 0 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.20);
            // Verify result is lighter
            expect(result.r).toBeGreaterThan(baseColor.r);
            expect(result.g).toBeGreaterThan(baseColor.g);
            expect(result.b).toBeGreaterThan(baseColor.b);
            // Verify specific values (0 * 0.80 + 255 * 0.20)
            expect(result.r).toBe(Math.round(255 * 0.20)); // 51
            expect(result.g).toBe(Math.round(255 * 0.20)); // 51
            expect(result.b).toBe(Math.round(255 * 0.20)); // 51
        });
        test('handles white color (no change possible)', () => {
            const baseColor = { r: 255, g: 255, b: 255 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.08);
            // White stays white
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        test('clamps RGB values to 0-255 range', () => {
            const baseColor = { r: 250, g: 245, b: 240 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.50);
            // Verify values are clamped to valid range
            expect(result.r).toBeGreaterThanOrEqual(0);
            expect(result.r).toBeLessThanOrEqual(255);
            expect(result.g).toBeGreaterThanOrEqual(0);
            expect(result.g).toBeLessThanOrEqual(255);
            expect(result.b).toBeGreaterThanOrEqual(0);
            expect(result.b).toBeLessThanOrEqual(255);
            // Verify specific values (very light colors)
            expect(result.r).toBe(Math.round(250 * 0.50 + 255 * 0.50)); // 253
            expect(result.g).toBe(Math.round(245 * 0.50 + 255 * 0.50)); // 250
            expect(result.b).toBe(Math.round(240 * 0.50 + 255 * 0.50)); // 248
        });
        test('handles zero blend value (no change)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.0);
            // No lightening should occur
            expect(result).toEqual(baseColor);
        });
        test('handles maximum blend value (complete lightening)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 1.0);
            // Complete lightening results in white
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        test('produces lighter colors for all RGB components', () => {
            const baseColor = { r: 100, g: 150, b: 200 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.10);
            // All components should be lighter
            expect(result.r).toBeGreaterThan(baseColor.r);
            expect(result.g).toBeGreaterThan(baseColor.g);
            expect(result.b).toBeGreaterThan(baseColor.b);
            // Verify proportional lightening
            expect(result.r).toBe(Math.round(100 * 0.90 + 255 * 0.10)); // 116
            expect(result.g).toBe(Math.round(150 * 0.90 + 255 * 0.10)); // 161
            expect(result.b).toBe(Math.round(200 * 0.90 + 255 * 0.10)); // 206
        });
        test('lightens dark purple on dark background', () => {
            const baseColor = { r: 80, g: 40, b: 120 };
            const result = (0, ColorSpaceUtils_1.calculateLighterBlend)(baseColor, 0.08);
            // Verify result is lighter
            expect(result.r).toBeGreaterThan(baseColor.r);
            expect(result.g).toBeGreaterThan(baseColor.g);
            expect(result.b).toBeGreaterThan(baseColor.b);
            // Verify specific values
            expect(result.r).toBe(Math.round(80 * 0.92 + 255 * 0.08)); // 94
            expect(result.g).toBe(Math.round(40 * 0.92 + 255 * 0.08)); // 57
            expect(result.b).toBe(Math.round(120 * 0.92 + 255 * 0.08)); // 131
        });
    });
    describe('calculateSaturateBlend', () => {
        test('saturates purple500 by 8% (blend200)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.08);
            // Convert to HSL to verify saturation increased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Verify saturation increased
            expect(resultHsl.s).toBeGreaterThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s + 0.08, 2);
            // Verify hue and lightness remain similar
            expect(resultHsl.h).toBeCloseTo(originalHsl.h, 0);
            expect(resultHsl.l).toBeCloseTo(originalHsl.l, 2);
        });
        test('saturates blue500 by 12% (blend300)', () => {
            const baseColor = { r: 59, g: 130, b: 246 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.12);
            // Convert to HSL to verify saturation increased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Verify saturation increased
            expect(resultHsl.s).toBeGreaterThan(originalHsl.s);
            // If original saturation + 0.12 would exceed 1.0, it should be clamped to 1.0
            const expectedSaturation = Math.min(1.0, originalHsl.s + 0.12);
            expect(resultHsl.s).toBeCloseTo(expectedSaturation, 2);
            // Verify hue and lightness remain similar
            expect(resultHsl.h).toBeCloseTo(originalHsl.h, 0);
            expect(resultHsl.l).toBeCloseTo(originalHsl.l, 2);
        });
        test('saturates desaturated color by 20% (blend500)', () => {
            const baseColor = { r: 150, g: 120, b: 180 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.20);
            // Convert to HSL to verify saturation increased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Verify saturation increased
            expect(resultHsl.s).toBeGreaterThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s + 0.20, 2);
        });
        test('clamps saturation to maximum 1.0', () => {
            const baseColor = { r: 255, g: 0, b: 0 }; // Pure red, saturation = 1.0
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.20);
            // Convert to HSL to verify saturation is clamped
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should be clamped at 1.0
            expect(resultHsl.s).toBe(1.0);
        });
        test('clamps saturation to minimum 0.0', () => {
            const baseColor = { r: 128, g: 128, b: 128 }; // Gray, saturation = 0.0
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, -0.20);
            // Convert to HSL to verify saturation is clamped
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should be clamped at 0.0
            expect(resultHsl.s).toBe(0.0);
        });
        test('handles zero blend value (no change)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.0);
            // Convert to HSL to verify no saturation change
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should remain the same
            expect(resultHsl.s).toBeCloseTo(originalHsl.s, 4);
        });
        test('handles grayscale color (saturation = 0)', () => {
            const baseColor = { r: 128, g: 128, b: 128 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.08);
            // Convert to HSL to verify saturation increased from 0
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Original should be 0, result should be 0.08
            expect(originalHsl.s).toBe(0);
            expect(resultHsl.s).toBeCloseTo(0.08, 2);
        });
        test('handles black color', () => {
            const baseColor = { r: 0, g: 0, b: 0 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.08);
            // Black has no saturation to increase
            // Result should still be black
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        test('handles white color', () => {
            const baseColor = { r: 255, g: 255, b: 255 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.08);
            // White has no saturation to increase
            // Result should still be white
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        test('produces more vibrant colors', () => {
            const baseColor = { r: 100, g: 150, b: 200 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.15);
            // Convert to HSL to verify increased vibrancy
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should increase, making color more vibrant
            expect(resultHsl.s).toBeGreaterThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s + 0.15, 2);
            // Hue should remain the same (same color family)
            expect(resultHsl.h).toBeCloseTo(originalHsl.h, 0);
        });
        test('saturates already saturated color', () => {
            const baseColor = { r: 200, g: 50, b: 50 }; // Already fairly saturated red
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.10);
            // Convert to HSL to verify saturation increased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should increase
            expect(resultHsl.s).toBeGreaterThan(originalHsl.s);
            // But should not exceed 1.0
            expect(resultHsl.s).toBeLessThanOrEqual(1.0);
        });
        test('returns valid RGB values', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateSaturateBlend)(baseColor, 0.08);
            // Verify all RGB values are in valid range
            expect(result.r).toBeGreaterThanOrEqual(0);
            expect(result.r).toBeLessThanOrEqual(255);
            expect(result.g).toBeGreaterThanOrEqual(0);
            expect(result.g).toBeLessThanOrEqual(255);
            expect(result.b).toBeGreaterThanOrEqual(0);
            expect(result.b).toBeLessThanOrEqual(255);
            // Verify values are integers
            expect(Number.isInteger(result.r)).toBe(true);
            expect(Number.isInteger(result.g)).toBe(true);
            expect(Number.isInteger(result.b)).toBe(true);
        });
    });
    describe('calculateDesaturateBlend', () => {
        test('desaturates purple500 by 8% (blend200)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.08);
            // Convert to HSL to verify saturation decreased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Verify saturation decreased
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s - 0.08, 2);
            // Verify hue and lightness remain similar
            expect(resultHsl.h).toBeCloseTo(originalHsl.h, 0);
            expect(resultHsl.l).toBeCloseTo(originalHsl.l, 2);
        });
        test('desaturates blue500 by 12% (blend300) for disabled state', () => {
            const baseColor = { r: 59, g: 130, b: 246 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.12);
            // Convert to HSL to verify saturation decreased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Verify saturation decreased
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
            // If original saturation - 0.12 would go below 0.0, it should be clamped to 0.0
            const expectedSaturation = Math.max(0.0, originalHsl.s - 0.12);
            expect(resultHsl.s).toBeCloseTo(expectedSaturation, 2);
            // Verify hue and lightness remain similar
            expect(resultHsl.h).toBeCloseTo(originalHsl.h, 0);
            expect(resultHsl.l).toBeCloseTo(originalHsl.l, 2);
        });
        test('desaturates vibrant color by 20% (blend500)', () => {
            const baseColor = { r: 255, g: 50, b: 50 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.20);
            // Convert to HSL to verify saturation decreased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Verify saturation decreased
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s - 0.20, 2);
        });
        test('clamps saturation to minimum 0.0', () => {
            const baseColor = { r: 200, g: 180, b: 190 }; // Low saturation color
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.50);
            // Convert to HSL to verify saturation is clamped
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should be clamped at 0.0
            expect(resultHsl.s).toBeGreaterThanOrEqual(0.0);
            expect(resultHsl.s).toBeLessThanOrEqual(1.0);
        });
        test('clamps saturation to maximum 1.0', () => {
            const baseColor = { r: 255, g: 0, b: 0 }; // Pure red, saturation = 1.0
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, -0.20);
            // Convert to HSL to verify saturation is clamped
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should be clamped at 1.0
            expect(resultHsl.s).toBeLessThanOrEqual(1.0);
        });
        test('handles zero blend value (no change)', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.0);
            // Convert to HSL to verify no saturation change
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should remain the same
            expect(resultHsl.s).toBeCloseTo(originalHsl.s, 4);
        });
        test('handles grayscale color (saturation = 0)', () => {
            const baseColor = { r: 128, g: 128, b: 128 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.08);
            // Convert to HSL to verify saturation remains at 0
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Original should be 0, result should still be 0 (can't desaturate further)
            expect(originalHsl.s).toBe(0);
            expect(resultHsl.s).toBe(0);
        });
        test('handles black color', () => {
            const baseColor = { r: 0, g: 0, b: 0 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.08);
            // Black has no saturation to decrease
            // Result should still be black
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        test('handles white color', () => {
            const baseColor = { r: 255, g: 255, b: 255 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.08);
            // White has no saturation to decrease
            // Result should still be white
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        test('produces more muted colors', () => {
            const baseColor = { r: 100, g: 150, b: 200 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.15);
            // Convert to HSL to verify decreased vibrancy
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should decrease, making color more muted
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s - 0.15, 2);
            // Hue should remain the same (same color family)
            expect(resultHsl.h).toBeCloseTo(originalHsl.h, 0);
        });
        test('desaturates already desaturated color', () => {
            const baseColor = { r: 150, g: 140, b: 145 }; // Already fairly desaturated
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.10);
            // Convert to HSL to verify saturation decreased
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should decrease
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
            // But should not go below 0.0
            expect(resultHsl.s).toBeGreaterThanOrEqual(0.0);
        });
        test('creates disabled state appearance', () => {
            const baseColor = { r: 59, g: 130, b: 246 }; // Blue500
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.12);
            // Convert to HSL to verify muted appearance
            const originalHsl = (0, ColorSpaceUtils_1.rgbToHsl)(baseColor);
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should decrease significantly for disabled appearance
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
            expect(resultHsl.s).toBeCloseTo(originalHsl.s - 0.12, 2);
            // Color should appear more gray/muted
            expect(resultHsl.s).toBeLessThan(originalHsl.s);
        });
        test('returns valid RGB values', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 0.08);
            // Verify all RGB values are in valid range
            expect(result.r).toBeGreaterThanOrEqual(0);
            expect(result.r).toBeLessThanOrEqual(255);
            expect(result.g).toBeGreaterThanOrEqual(0);
            expect(result.g).toBeLessThanOrEqual(255);
            expect(result.b).toBeGreaterThanOrEqual(0);
            expect(result.b).toBeLessThanOrEqual(255);
            // Verify values are integers
            expect(Number.isInteger(result.r)).toBe(true);
            expect(Number.isInteger(result.g)).toBe(true);
            expect(Number.isInteger(result.b)).toBe(true);
        });
        test('desaturate and saturate are inverse operations', () => {
            const baseColor = { r: 168, g: 85, b: 247 };
            const blendValue = 0.08;
            // Desaturate then saturate
            const desaturated = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, blendValue);
            const resaturated = (0, ColorSpaceUtils_1.calculateSaturateBlend)(desaturated, blendValue);
            // Should approximately return to original color (allow 1-2 units difference due to rounding)
            expect(Math.abs(resaturated.r - baseColor.r)).toBeLessThanOrEqual(2);
            expect(Math.abs(resaturated.g - baseColor.g)).toBeLessThanOrEqual(2);
            expect(Math.abs(resaturated.b - baseColor.b)).toBeLessThanOrEqual(2);
        });
        test('handles maximum desaturation (approaching grayscale)', () => {
            const baseColor = { r: 200, g: 50, b: 50 }; // Saturated red
            const result = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(baseColor, 1.0);
            // Convert to HSL to verify complete desaturation
            const resultHsl = (0, ColorSpaceUtils_1.rgbToHsl)(result);
            // Saturation should be 0 (grayscale)
            expect(resultHsl.s).toBe(0);
            // Result should be a shade of gray
            expect(result.r).toBe(result.g);
            expect(result.g).toBe(result.b);
        });
    });
});
//# sourceMappingURL=ColorSpaceUtils.test.js.map