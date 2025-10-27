"use strict";
/**
 * Unit Converter Tests
 *
 * Validates cross-platform unit conversion from F1 unitless baseValues
 * to platform-specific units (pt, dp/sp, px/rem).
 */
Object.defineProperty(exports, "__esModule", { value: true });
const UnitConverter_1 = require("../UnitConverter");
describe('UnitConverter', () => {
    let converter;
    beforeEach(() => {
        converter = new UnitConverter_1.UnitConverter();
    });
    describe('iOS Conversion (pt)', () => {
        it('should convert baseValue to pt with 1:1 ratio', () => {
            const result = converter.convertToiOS(8, 'space100');
            expect(result.value).toBe(8);
            expect(result.unit).toBe('pt');
            expect(result.token).toBe('space100');
        });
        it('should handle decimal values with precision', () => {
            const result = converter.convertToiOS(12.5, 'space150', { precision: 1 });
            expect(result.value).toBe(12.5);
            expect(result.unit).toBe('pt');
        });
        it('should round to default precision (2 decimals)', () => {
            const result = converter.convertToiOS(8.12345, 'space100');
            expect(result.value).toBe(8.12);
            expect(result.unit).toBe('pt');
        });
        it('should handle strategic flexibility tokens', () => {
            const result = converter.convertToiOS(6, 'space075');
            expect(result.value).toBe(6);
            expect(result.unit).toBe('pt');
        });
    });
    describe('Android Conversion (dp/sp)', () => {
        it('should convert spacing tokens to dp', () => {
            const result = converter.convertToAndroid(8, 'space100');
            expect(result.value).toBe(8);
            expect(result.unit).toBe('dp');
            expect(result.token).toBe('space100');
        });
        it('should convert typography tokens to sp', () => {
            const result = converter.convertToAndroid(16, 'fontSize100', {
                category: 'typography',
            });
            expect(result.value).toBe(16);
            expect(result.unit).toBe('sp');
            expect(result.token).toBe('fontSize100');
        });
        it('should detect typography tokens by name pattern', () => {
            const fontSizeResult = converter.convertToAndroid(16, 'font.size.body');
            expect(fontSizeResult.unit).toBe('sp');
            const lineHeightResult = converter.convertToAndroid(24, 'lineHeight.normal');
            expect(lineHeightResult.unit).toBe('sp');
            const letterSpacingResult = converter.convertToAndroid(0.5, 'letterSpacing.tight');
            expect(letterSpacingResult.unit).toBe('sp');
        });
        it('should use dp for non-typography tokens', () => {
            const spacingResult = converter.convertToAndroid(8, 'space100');
            expect(spacingResult.unit).toBe('dp');
            const radiusResult = converter.convertToAndroid(4, 'radius050');
            expect(radiusResult.unit).toBe('dp');
            const colorResult = converter.convertToAndroid(255, 'color.blue500');
            expect(colorResult.unit).toBe('dp');
        });
        it('should handle decimal values with precision', () => {
            const result = converter.convertToAndroid(12.5, 'space150', { precision: 1 });
            expect(result.value).toBe(12.5);
            expect(result.unit).toBe('dp');
        });
    });
    describe('Web Conversion (px/rem)', () => {
        it('should convert spacing tokens to px', () => {
            const result = converter.convertToWeb(8, 'space100');
            expect(result.value).toBe(8);
            expect(result.unit).toBe('px');
            expect(result.token).toBe('space100');
        });
        it('should convert typography tokens to rem', () => {
            const result = converter.convertToWeb(16, 'fontSize100', {
                category: 'typography',
            });
            expect(result.value).toBe(1); // 16 / 16 = 1rem
            expect(result.unit).toBe('rem');
            expect(result.token).toBe('fontSize100');
        });
        it('should detect typography tokens by name pattern', () => {
            const fontSizeResult = converter.convertToWeb(16, 'font.size.body');
            expect(fontSizeResult.unit).toBe('rem');
            expect(fontSizeResult.value).toBe(1); // 16 / 16 = 1rem
            const lineHeightResult = converter.convertToWeb(24, 'lineHeight.normal');
            expect(lineHeightResult.unit).toBe('rem');
            expect(lineHeightResult.value).toBe(1.5); // 24 / 16 = 1.5rem
        });
        it('should use px for non-typography tokens', () => {
            const spacingResult = converter.convertToWeb(8, 'space100');
            expect(spacingResult.unit).toBe('px');
            expect(spacingResult.value).toBe(8);
            const radiusResult = converter.convertToWeb(4, 'radius050');
            expect(radiusResult.unit).toBe('px');
            expect(radiusResult.value).toBe(4);
        });
        it('should use custom web base font size for rem conversion', () => {
            const result = converter.convertToWeb(20, 'fontSize100', {
                category: 'typography',
                webBaseFontSize: 20,
            });
            expect(result.value).toBe(1); // 20 / 20 = 1rem
            expect(result.unit).toBe('rem');
        });
        it('should handle decimal rem values with precision', () => {
            const result = converter.convertToWeb(18, 'fontSize100', {
                category: 'typography',
                webBaseFontSize: 16,
                precision: 3,
            });
            expect(result.value).toBe(1.125); // 18 / 16 = 1.125rem
            expect(result.unit).toBe('rem');
        });
    });
    describe('Cross-Platform Conversion', () => {
        it('should convert to all platforms simultaneously', () => {
            const result = converter.convertToAllPlatforms(8, 'space100');
            expect(result.ios.value).toBe(8);
            expect(result.ios.unit).toBe('pt');
            expect(result.android.value).toBe(8);
            expect(result.android.unit).toBe('dp');
            expect(result.web.value).toBe(8);
            expect(result.web.unit).toBe('px');
            expect(result.mathematicallyConsistent).toBe(true);
        });
        it('should maintain mathematical consistency for spacing tokens', () => {
            const result = converter.convertToAllPlatforms(12, 'space150');
            expect(result.mathematicallyConsistent).toBe(true);
            expect(result.reasoning).toContain('All platforms maintain mathematical consistency');
            expect(result.reasoning).toContain('baseValue 12');
        });
        it('should maintain mathematical consistency for typography tokens', () => {
            const result = converter.convertToAllPlatforms(16, 'fontSize100', {
                category: 'typography',
            });
            expect(result.ios.value).toBe(16);
            expect(result.ios.unit).toBe('pt');
            expect(result.android.value).toBe(16);
            expect(result.android.unit).toBe('sp');
            expect(result.web.value).toBe(1); // 16 / 16 = 1rem
            expect(result.web.unit).toBe('rem');
            expect(result.mathematicallyConsistent).toBe(true);
        });
        it('should handle strategic flexibility tokens consistently', () => {
            const result = converter.convertToAllPlatforms(6, 'space075');
            expect(result.ios.value).toBe(6);
            expect(result.android.value).toBe(6);
            expect(result.web.value).toBe(6);
            expect(result.mathematicallyConsistent).toBe(true);
        });
    });
    describe('Mathematical Consistency Validation', () => {
        it('should validate consistency for matching values', () => {
            const result = converter.convertToAllPlatforms(8, 'space100');
            expect(result.mathematicallyConsistent).toBe(true);
            expect(result.reasoning).toContain('All platforms maintain mathematical consistency');
        });
        it('should validate consistency for typography with rem conversion', () => {
            const result = converter.convertToAllPlatforms(24, 'lineHeight.normal', {
                category: 'typography',
            });
            // iOS: 24pt, Android: 24sp, Web: 1.5rem (24/16)
            expect(result.mathematicallyConsistent).toBe(true);
        });
        it('should handle custom web base font size in validation', () => {
            const result = converter.convertToAllPlatforms(20, 'fontSize100', {
                category: 'typography',
                webBaseFontSize: 20,
            });
            // iOS: 20pt, Android: 20sp, Web: 1rem (20/20)
            expect(result.mathematicallyConsistent).toBe(true);
        });
    });
    describe('Platform-Specific Conversion', () => {
        it('should convert to specific platform', () => {
            const iosResult = converter.convertToPlatform(8, 'space100', 'ios');
            expect(iosResult.unit).toBe('pt');
            expect(iosResult.value).toBe(8);
            const androidResult = converter.convertToPlatform(8, 'space100', 'android');
            expect(androidResult.unit).toBe('dp');
            expect(androidResult.value).toBe(8);
            const webResult = converter.convertToPlatform(8, 'space100', 'web');
            expect(webResult.unit).toBe('px');
            expect(webResult.value).toBe(8);
        });
        it('should throw error for unknown platform', () => {
            expect(() => {
                converter.convertToPlatform(8, 'space100', 'unknown');
            }).toThrow('Unknown platform: unknown');
        });
    });
    describe('Precision Handling', () => {
        it('should round to specified precision', () => {
            const result = converter.convertToiOS(8.12345, 'space100', { precision: 2 });
            expect(result.value).toBe(8.12);
        });
        it('should handle zero precision (integers only)', () => {
            const result = converter.convertToiOS(8.7, 'space100', { precision: 0 });
            expect(result.value).toBe(9);
        });
        it('should handle high precision', () => {
            const result = converter.convertToiOS(8.123456789, 'space100', { precision: 5 });
            expect(result.value).toBe(8.12346);
        });
    });
    describe('Real-World Token Examples', () => {
        it('should convert F1 spacing tokens correctly', () => {
            // space100 = 8
            const space100 = converter.convertToAllPlatforms(8, 'space100');
            expect(space100.ios.value).toBe(8);
            expect(space100.android.value).toBe(8);
            expect(space100.web.value).toBe(8);
            // space150 = 12
            const space150 = converter.convertToAllPlatforms(12, 'space150');
            expect(space150.ios.value).toBe(12);
            expect(space150.android.value).toBe(12);
            expect(space150.web.value).toBe(12);
            // space200 = 16
            const space200 = converter.convertToAllPlatforms(16, 'space200');
            expect(space200.ios.value).toBe(16);
            expect(space200.android.value).toBe(16);
            expect(space200.web.value).toBe(16);
        });
        it('should convert F1 typography tokens correctly', () => {
            // fontSize100 = 16
            const fontSize100 = converter.convertToAllPlatforms(16, 'fontSize100', {
                category: 'typography',
            });
            expect(fontSize100.ios.value).toBe(16);
            expect(fontSize100.ios.unit).toBe('pt');
            expect(fontSize100.android.value).toBe(16);
            expect(fontSize100.android.unit).toBe('sp');
            expect(fontSize100.web.value).toBe(1);
            expect(fontSize100.web.unit).toBe('rem');
            // lineHeight150 = 24
            const lineHeight150 = converter.convertToAllPlatforms(24, 'lineHeight150', {
                category: 'typography',
            });
            expect(lineHeight150.ios.value).toBe(24);
            expect(lineHeight150.android.value).toBe(24);
            expect(lineHeight150.web.value).toBe(1.5); // 24 / 16 = 1.5rem
        });
        it('should convert strategic flexibility tokens correctly', () => {
            // space075 = 6 (strategic flexibility)
            const space075 = converter.convertToAllPlatforms(6, 'space075');
            expect(space075.ios.value).toBe(6);
            expect(space075.android.value).toBe(6);
            expect(space075.web.value).toBe(6);
            expect(space075.mathematicallyConsistent).toBe(true);
        });
    });
});
//# sourceMappingURL=UnitConverter.test.js.map