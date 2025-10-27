"use strict";
/**
 * Unit Provider Services Unit Tests
 *
 * Tests for mathematical accuracy of unit conversions across web, iOS, and Android platforms.
 * Covers unit conversion algorithms, platform-specific logic, and mathematical consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebUnitConverter_1 = require("../WebUnitConverter");
const iOSUnitConverter_1 = require("../iOSUnitConverter");
const AndroidUnitConverter_1 = require("../AndroidUnitConverter");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
// Mock token factory for testing
const createMockToken = (overrides = {}) => ({
    name: 'test-token',
    category: PrimitiveToken_1.TokenCategory.SPACING,
    baseValue: 8,
    familyBaseValue: 8,
    description: 'Test token',
    mathematicalRelationship: 'base × 1 = 8',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
        web: { value: 8, unit: 'px' },
        ios: { value: 8, unit: 'pt' },
        android: { value: 8, unit: 'dp' }
    },
    ...overrides
});
describe('Unit Provider Services', () => {
    describe('WebUnitConverter', () => {
        let webConverter;
        beforeEach(() => {
            webConverter = new WebUnitConverter_1.WebUnitConverter();
        });
        describe('Unit Conversion Accuracy', () => {
            test('should convert spacing tokens to pixels with 1:1 ratio', () => {
                const spacingToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.SPACING,
                    baseValue: 16
                });
                const result = webConverter.convertToken(spacingToken);
                expect(result.value).toBe(16);
                expect(result.unit).toBe('px');
            });
            test('should convert fontSize tokens to REM with correct division', () => {
                const fontSizeToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16
                });
                const result = webConverter.convertToken(fontSizeToken);
                expect(result.value).toBe(1); // 16 ÷ 16 = 1
                expect(result.unit).toBe('rem');
            });
            test('should convert fontSize tokens with precision rounding', () => {
                const fontSizeToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 18
                });
                const result = webConverter.convertToken(fontSizeToken);
                expect(result.value).toBe(1.125); // 18 ÷ 16 = 1.125
                expect(result.unit).toBe('rem');
            });
            test('should handle radius tokens as pixels', () => {
                const radiusToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.RADIUS,
                    baseValue: 8
                });
                const result = webConverter.convertToken(radiusToken);
                expect(result.value).toBe(8);
                expect(result.unit).toBe('px');
            });
            test('should handle tapArea tokens as pixels', () => {
                const tapAreaToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.TAP_AREA,
                    baseValue: 44
                });
                const result = webConverter.convertToken(tapAreaToken);
                expect(result.value).toBe(44);
                expect(result.unit).toBe('px');
            });
            test('should handle lineHeight tokens as unitless', () => {
                const lineHeightToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
                    baseValue: 1.5
                });
                const result = webConverter.convertToken(lineHeightToken);
                expect(result.value).toBe(1.5);
                expect(result.unit).toBe('unitless');
            });
            test('should handle density tokens as unitless', () => {
                const densityToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.DENSITY,
                    baseValue: 1.0
                });
                const result = webConverter.convertToken(densityToken);
                expect(result.value).toBe(1.0);
                expect(result.unit).toBe('unitless');
            });
            test('should handle fontFamily tokens as strings', () => {
                const fontFamilyToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
                    baseValue: 0, // N/A for categorical
                    platforms: {
                        web: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        ios: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        android: { value: 'Inter, sans-serif', unit: 'fontFamily' }
                    }
                });
                const result = webConverter.convertToken(fontFamilyToken);
                expect(result.value).toBe('Inter, sans-serif');
                expect(result.unit).toBe('fontFamily');
            });
            test('should handle fontWeight tokens as numeric', () => {
                const fontWeightToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
                    baseValue: 400
                });
                const result = webConverter.convertToken(fontWeightToken);
                expect(result.value).toBe(400);
                expect(result.unit).toBe('fontWeight');
            });
            test('should handle letterSpacing tokens as em units', () => {
                const letterSpacingToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.LETTER_SPACING,
                    baseValue: 0.025
                });
                const result = webConverter.convertToken(letterSpacingToken);
                expect(result.value).toBe(0.025);
                expect(result.unit).toBe('em');
            });
        });
        describe('Direct Value Conversion', () => {
            test('should convert raw values by category', () => {
                expect(webConverter.convertValue(16, 'spacing')).toEqual({ value: 16, unit: 'px' });
                expect(webConverter.convertValue(16, 'fontSize')).toEqual({ value: 1, unit: 'rem' });
                expect(webConverter.convertValue(1.5, 'lineHeight')).toEqual({ value: 1.5, unit: 'unitless' });
                expect(webConverter.convertValue('Inter, sans-serif', 'fontFamily')).toEqual({
                    value: 'Inter, sans-serif',
                    unit: 'fontFamily'
                });
            });
            test('should handle unknown categories with default pixels', () => {
                const result = webConverter.convertValue(10, 'unknown');
                expect(result.value).toBe(10);
                expect(result.unit).toBe('px');
            });
        });
        describe('Conversion Factors', () => {
            test('should provide correct conversion factors for each category', () => {
                expect(webConverter.getConversionFactor('spacing')).toEqual({ factor: 1, unit: 'px' });
                expect(webConverter.getConversionFactor('fontSize')).toEqual({ factor: 1 / 16, unit: 'rem' });
                expect(webConverter.getConversionFactor('lineHeight')).toEqual({ factor: 1, unit: 'unitless' });
                expect(webConverter.getConversionFactor('fontFamily')).toEqual({ factor: 1, unit: 'fontFamily' });
                expect(webConverter.getConversionFactor('fontWeight')).toEqual({ factor: 1, unit: 'fontWeight' });
                expect(webConverter.getConversionFactor('letterSpacing')).toEqual({ factor: 1, unit: 'em' });
            });
        });
        describe('Custom Configuration', () => {
            test('should use custom base font size for REM calculations', () => {
                const customConverter = new WebUnitConverter_1.WebUnitConverter({ baseFontSize: 14 });
                const result = customConverter.convertValue(14, 'fontSize');
                expect(result.value).toBe(1); // 14 ÷ 14 = 1
                expect(result.unit).toBe('rem');
            });
            test('should provide utility methods for REM conversion', () => {
                expect(webConverter.pxToRem(16)).toBe(1);
                expect(webConverter.pxToRem(24)).toBe(1.5);
                expect(webConverter.remToPx(1)).toBe(16);
                expect(webConverter.remToPx(1.5)).toBe(24);
            });
        });
        describe('Validation', () => {
            test('should validate numeric conversions correctly', () => {
                expect(webConverter.validateConversion(16, { value: 16, unit: 'px' }, 'spacing')).toBe(true);
                expect(webConverter.validateConversion(16, { value: 1, unit: 'rem' }, 'fontSize')).toBe(true);
                expect(webConverter.validateConversion(1.5, { value: 1.5, unit: 'unitless' }, 'lineHeight')).toBe(true);
            });
            test('should validate string conversions correctly', () => {
                const fontFamily = 'Inter, sans-serif';
                expect(webConverter.validateConversion(fontFamily, { value: fontFamily, unit: 'fontFamily' }, 'fontFamily')).toBe(true);
                expect(webConverter.validateConversion(fontFamily, { value: 'Different Font', unit: 'fontFamily' }, 'fontFamily')).toBe(false);
            });
            test('should reject invalid conversions', () => {
                expect(webConverter.validateConversion(16, { value: -1, unit: 'px' }, 'spacing')).toBe(false);
                expect(webConverter.validateConversion(16, { value: 2, unit: 'rem' }, 'fontSize')).toBe(false);
            });
        });
    });
    describe('iOSUnitConverter', () => {
        let iosConverter;
        beforeEach(() => {
            iosConverter = new iOSUnitConverter_1.iOSUnitConverter();
        });
        describe('Unit Conversion Accuracy', () => {
            test('should convert spacing tokens to points with 1:1 ratio', () => {
                const spacingToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.SPACING,
                    baseValue: 16
                });
                const result = iosConverter.convertToken(spacingToken);
                expect(result.value).toBe(16);
                expect(result.unit).toBe('pt');
            });
            test('should convert fontSize tokens to points', () => {
                const fontSizeToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16
                });
                const result = iosConverter.convertToken(fontSizeToken);
                expect(result.value).toBe(16);
                expect(result.unit).toBe('pt');
            });
            test('should convert radius tokens to points', () => {
                const radiusToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.RADIUS,
                    baseValue: 8
                });
                const result = iosConverter.convertToken(radiusToken);
                expect(result.value).toBe(8);
                expect(result.unit).toBe('pt');
            });
            test('should convert tapArea tokens to points', () => {
                const tapAreaToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.TAP_AREA,
                    baseValue: 44
                });
                const result = iosConverter.convertToken(tapAreaToken);
                expect(result.value).toBe(44);
                expect(result.unit).toBe('pt');
            });
            test('should handle lineHeight tokens as unitless', () => {
                const lineHeightToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
                    baseValue: 1.5
                });
                const result = iosConverter.convertToken(lineHeightToken);
                expect(result.value).toBe(1.5);
                expect(result.unit).toBe('unitless');
            });
            test('should handle density tokens as unitless', () => {
                const densityToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.DENSITY,
                    baseValue: 1.0
                });
                const result = iosConverter.convertToken(densityToken);
                expect(result.value).toBe(1.0);
                expect(result.unit).toBe('unitless');
            });
        });
        describe('Display Scale Handling', () => {
            test('should use default @1x display scale', () => {
                expect(iosConverter.getDisplayScale()).toBe(1.0);
            });
            test('should support custom display scales', () => {
                const retina2xConverter = new iOSUnitConverter_1.iOSUnitConverter({ displayScale: 2.0 });
                const retina3xConverter = new iOSUnitConverter_1.iOSUnitConverter({ displayScale: 3.0 });
                expect(retina2xConverter.getDisplayScale()).toBe(2.0);
                expect(retina3xConverter.getDisplayScale()).toBe(3.0);
            });
            test('should convert points to pixels correctly', () => {
                expect(iosConverter.pointsToPixels(44, 1.0)).toBe(44); // @1x
                expect(iosConverter.pointsToPixels(44, 2.0)).toBe(88); // @2x
                expect(iosConverter.pointsToPixels(44, 3.0)).toBe(132); // @3x
            });
            test('should convert pixels to points correctly', () => {
                expect(iosConverter.pixelsToPoints(44, 1.0)).toBe(44); // @1x
                expect(iosConverter.pixelsToPoints(88, 2.0)).toBe(44); // @2x
                expect(iosConverter.pixelsToPoints(132, 3.0)).toBe(44); // @3x
            });
        });
        describe('Density Considerations', () => {
            test('should apply density considerations for tap areas', () => {
                const result = iosConverter.applyDensityConsiderations(44, 'tapArea');
                expect(result).toBe(44); // iOS maintains consistent point values
            });
            test('should maintain consistent values for other categories', () => {
                expect(iosConverter.applyDensityConsiderations(16, 'spacing')).toBe(16);
                expect(iosConverter.applyDensityConsiderations(16, 'fontSize')).toBe(16);
                expect(iosConverter.applyDensityConsiderations(8, 'radius')).toBe(8);
            });
        });
        describe('Conversion Factors', () => {
            test('should provide correct conversion factors', () => {
                expect(iosConverter.getConversionFactor('spacing')).toEqual({ factor: 1, unit: 'pt' });
                expect(iosConverter.getConversionFactor('fontSize')).toEqual({ factor: 1, unit: 'pt' });
                expect(iosConverter.getConversionFactor('radius')).toEqual({ factor: 1, unit: 'pt' });
                expect(iosConverter.getConversionFactor('tapArea')).toEqual({ factor: 1, unit: 'pt' });
                expect(iosConverter.getConversionFactor('lineHeight')).toEqual({ factor: 1, unit: 'unitless' });
                expect(iosConverter.getConversionFactor('density')).toEqual({ factor: 1, unit: 'unitless' });
            });
        });
    });
    describe('AndroidUnitConverter', () => {
        let androidConverter;
        beforeEach(() => {
            androidConverter = new AndroidUnitConverter_1.AndroidUnitConverter();
        });
        describe('Unit Conversion Accuracy', () => {
            test('should convert spacing tokens to dp', () => {
                const spacingToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.SPACING,
                    baseValue: 16
                });
                const result = androidConverter.convertToken(spacingToken);
                expect(result.value).toBe(16);
                expect(result.unit).toBe('dp');
            });
            test('should convert fontSize tokens to sp', () => {
                const fontSizeToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16
                });
                const result = androidConverter.convertToken(fontSizeToken);
                expect(result.value).toBe(16);
                expect(result.unit).toBe('sp');
            });
            test('should convert radius tokens to dp', () => {
                const radiusToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.RADIUS,
                    baseValue: 8
                });
                const result = androidConverter.convertToken(radiusToken);
                expect(result.value).toBe(8);
                expect(result.unit).toBe('dp');
            });
            test('should convert tapArea tokens to dp', () => {
                const tapAreaToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.TAP_AREA,
                    baseValue: 44
                });
                const result = androidConverter.convertToken(tapAreaToken);
                expect(result.value).toBe(44);
                expect(result.unit).toBe('dp');
            });
            test('should handle lineHeight tokens as unitless', () => {
                const lineHeightToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
                    baseValue: 1.5
                });
                const result = androidConverter.convertToken(lineHeightToken);
                expect(result.value).toBe(1.5);
                expect(result.unit).toBe('unitless');
            });
            test('should handle density tokens as unitless', () => {
                const densityToken = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.DENSITY,
                    baseValue: 1.0
                });
                const result = androidConverter.convertToken(densityToken);
                expect(result.value).toBe(1.0);
                expect(result.unit).toBe('unitless');
            });
        });
        describe('Android Density Buckets', () => {
            test('should use MDPI as default density', () => {
                expect(androidConverter.getDensityFactor()).toBe(AndroidUnitConverter_1.AndroidDensity.MDPI);
            });
            test('should support all density buckets', () => {
                expect(AndroidUnitConverter_1.AndroidDensity.LDPI).toBe(0.75);
                expect(AndroidUnitConverter_1.AndroidDensity.MDPI).toBe(1.0);
                expect(AndroidUnitConverter_1.AndroidDensity.HDPI).toBe(1.5);
                expect(AndroidUnitConverter_1.AndroidDensity.XHDPI).toBe(2.0);
                expect(AndroidUnitConverter_1.AndroidDensity.XXHDPI).toBe(3.0);
                expect(AndroidUnitConverter_1.AndroidDensity.XXXHDPI).toBe(4.0);
            });
            test('should convert dp to pixels correctly for different densities', () => {
                expect(androidConverter.dpToPixels(48, AndroidUnitConverter_1.AndroidDensity.LDPI)).toBe(36); // 48 × 0.75
                expect(androidConverter.dpToPixels(48, AndroidUnitConverter_1.AndroidDensity.MDPI)).toBe(48); // 48 × 1.0
                expect(androidConverter.dpToPixels(48, AndroidUnitConverter_1.AndroidDensity.HDPI)).toBe(72); // 48 × 1.5
                expect(androidConverter.dpToPixels(48, AndroidUnitConverter_1.AndroidDensity.XHDPI)).toBe(96); // 48 × 2.0
                expect(androidConverter.dpToPixels(48, AndroidUnitConverter_1.AndroidDensity.XXHDPI)).toBe(144); // 48 × 3.0
                expect(androidConverter.dpToPixels(48, AndroidUnitConverter_1.AndroidDensity.XXXHDPI)).toBe(192); // 48 × 4.0
            });
            test('should convert pixels to dp correctly for different densities', () => {
                expect(androidConverter.pixelsToDp(48, AndroidUnitConverter_1.AndroidDensity.MDPI)).toBe(48); // 48 ÷ 1.0
                expect(androidConverter.pixelsToDp(96, AndroidUnitConverter_1.AndroidDensity.XHDPI)).toBe(48); // 96 ÷ 2.0
                expect(androidConverter.pixelsToDp(144, AndroidUnitConverter_1.AndroidDensity.XXHDPI)).toBe(48); // 144 ÷ 3.0
            });
            test('should convert sp to pixels with font scale consideration', () => {
                expect(androidConverter.spToPixels(16, AndroidUnitConverter_1.AndroidDensity.MDPI, 1.0)).toBe(16); // Normal scale
                expect(androidConverter.spToPixels(16, AndroidUnitConverter_1.AndroidDensity.MDPI, 1.5)).toBe(24); // Large text
                expect(androidConverter.spToPixels(16, AndroidUnitConverter_1.AndroidDensity.XHDPI, 1.0)).toBe(32); // High density
                expect(androidConverter.spToPixels(16, AndroidUnitConverter_1.AndroidDensity.XHDPI, 1.5)).toBe(48); // High density + large text
            });
        });
        describe('Density Bucket Handling', () => {
            test('should handle density buckets for different categories', () => {
                const spacingResults = androidConverter.handleDensityBuckets(16, 'spacing');
                const fontSizeResults = androidConverter.handleDensityBuckets(16, 'fontSize');
                // All density buckets should maintain consistent dp/sp values
                Object.values(spacingResults).forEach(value => {
                    expect(value).toBe(16);
                });
                Object.values(fontSizeResults).forEach(value => {
                    expect(value).toBe(16);
                });
            });
            test('should validate values across density buckets', () => {
                expect(androidConverter.validateAcrossDensities(16, 'spacing')).toBe(true);
                expect(androidConverter.validateAcrossDensities(16, 'fontSize')).toBe(true);
                expect(androidConverter.validateAcrossDensities(-5, 'spacing')).toBe(false); // Negative value
                expect(androidConverter.validateAcrossDensities(10000, 'spacing')).toBe(false); // Too large
            });
        });
        describe('Conversion Factors', () => {
            test('should provide correct conversion factors', () => {
                expect(androidConverter.getConversionFactor('spacing')).toEqual({ factor: 1, unit: 'dp' });
                expect(androidConverter.getConversionFactor('fontSize')).toEqual({ factor: 1, unit: 'sp' });
                expect(androidConverter.getConversionFactor('radius')).toEqual({ factor: 1, unit: 'dp' });
                expect(androidConverter.getConversionFactor('tapArea')).toEqual({ factor: 1, unit: 'dp' });
                expect(androidConverter.getConversionFactor('lineHeight')).toEqual({ factor: 1, unit: 'unitless' });
                expect(androidConverter.getConversionFactor('density')).toEqual({ factor: 1, unit: 'unitless' });
            });
        });
    });
    describe('Cross-Platform Mathematical Consistency', () => {
        let webConverter;
        let iosConverter;
        let androidConverter;
        beforeEach(() => {
            webConverter = new WebUnitConverter_1.WebUnitConverter();
            iosConverter = new iOSUnitConverter_1.iOSUnitConverter();
            androidConverter = new AndroidUnitConverter_1.AndroidUnitConverter();
        });
        describe('Proportional Relationships', () => {
            test('should maintain proportional relationships for spacing tokens', () => {
                const spacing8 = createMockToken({ category: PrimitiveToken_1.TokenCategory.SPACING, baseValue: 8 });
                const spacing16 = createMockToken({ category: PrimitiveToken_1.TokenCategory.SPACING, baseValue: 16 });
                const web8 = webConverter.convertToken(spacing8);
                const web16 = webConverter.convertToken(spacing16);
                const ios8 = iosConverter.convertToken(spacing8);
                const ios16 = iosConverter.convertToken(spacing16);
                const android8 = androidConverter.convertToken(spacing8);
                const android16 = androidConverter.convertToken(spacing16);
                // All platforms should maintain 2:1 ratio
                expect(web16.value / web8.value).toBe(2);
                expect(ios16.value / ios8.value).toBe(2);
                expect(android16.value / android8.value).toBe(2);
            });
            test('should maintain proportional relationships for fontSize tokens', () => {
                const fontSize16 = createMockToken({ category: PrimitiveToken_1.TokenCategory.FONT_SIZE, baseValue: 16 });
                const fontSize18 = createMockToken({ category: PrimitiveToken_1.TokenCategory.FONT_SIZE, baseValue: 18 });
                const web16 = webConverter.convertToken(fontSize16);
                const web18 = webConverter.convertToken(fontSize18);
                const ios16 = iosConverter.convertToken(fontSize16);
                const ios18 = iosConverter.convertToken(fontSize18);
                const android16 = androidConverter.convertToken(fontSize16);
                const android18 = androidConverter.convertToken(fontSize18);
                // Calculate ratios
                const webRatio = web18.value / web16.value;
                const iosRatio = ios18.value / ios16.value;
                const androidRatio = android18.value / android16.value;
                // All platforms should maintain the same proportional relationship
                expect(Math.abs(webRatio - iosRatio)).toBeLessThan(0.001);
                expect(Math.abs(iosRatio - androidRatio)).toBeLessThan(0.001);
            });
            test('should maintain identical values for unitless tokens', () => {
                const lineHeight = createMockToken({ category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT, baseValue: 1.5 });
                const density = createMockToken({ category: PrimitiveToken_1.TokenCategory.DENSITY, baseValue: 1.0 });
                const webLineHeight = webConverter.convertToken(lineHeight);
                const iosLineHeight = iosConverter.convertToken(lineHeight);
                const androidLineHeight = androidConverter.convertToken(lineHeight);
                const webDensity = webConverter.convertToken(density);
                const iosDensity = iosConverter.convertToken(density);
                const androidDensity = androidConverter.convertToken(density);
                // Unitless values should be identical across platforms
                expect(webLineHeight.value).toBe(iosLineHeight.value);
                expect(iosLineHeight.value).toBe(androidLineHeight.value);
                expect(webDensity.value).toBe(iosDensity.value);
                expect(iosDensity.value).toBe(androidDensity.value);
            });
        });
        describe('Mathematical Equivalence', () => {
            test('should achieve mathematical equivalence within tolerance for spacing', () => {
                const spacing16 = createMockToken({ category: PrimitiveToken_1.TokenCategory.SPACING, baseValue: 16 });
                const webResult = webConverter.convertToken(spacing16);
                const iosResult = iosConverter.convertToken(spacing16);
                const androidResult = androidConverter.convertToken(spacing16);
                // All should be 16 in their respective units (px, pt, dp)
                expect(webResult.value).toBe(16);
                expect(iosResult.value).toBe(16);
                expect(androidResult.value).toBe(16);
            });
            test('should handle REM conversion precision correctly', () => {
                const fontSize24 = createMockToken({ category: PrimitiveToken_1.TokenCategory.FONT_SIZE, baseValue: 24 });
                const webResult = webConverter.convertToken(fontSize24);
                const iosResult = iosConverter.convertToken(fontSize24);
                const androidResult = androidConverter.convertToken(fontSize24);
                // Web: 24 ÷ 16 = 1.5rem, iOS/Android: 24pt/sp
                expect(webResult.value).toBe(1.5);
                expect(webResult.unit).toBe('rem');
                expect(iosResult.value).toBe(24);
                expect(iosResult.unit).toBe('pt');
                expect(androidResult.value).toBe(24);
                expect(androidResult.unit).toBe('sp');
                // Mathematical equivalence: 1.5rem × 16px = 24px ≈ 24pt ≈ 24sp
                const webPixelEquivalent = webResult.value * 16;
                expect(webPixelEquivalent).toBe(iosResult.value);
                expect(webPixelEquivalent).toBe(androidResult.value);
            });
        });
        describe('String Value Consistency', () => {
            test('should maintain identical string values across platforms', () => {
                // Test direct value conversion for string values
                const webResult = webConverter.convertValue('Inter, sans-serif', 'fontFamily');
                const iosResult = iosConverter.convertValue('Inter, sans-serif', 'fontFamily');
                const androidResult = androidConverter.convertValue('Inter, sans-serif', 'fontFamily');
                expect(webResult.value).toBe('Inter, sans-serif');
                expect(iosResult.value).toBe('Inter, sans-serif');
                expect(androidResult.value).toBe('Inter, sans-serif');
            });
            test('should maintain identical numeric values for font weights', () => {
                const fontWeight = createMockToken({
                    category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
                    baseValue: 600
                });
                const webResult = webConverter.convertToken(fontWeight);
                const iosResult = iosConverter.convertToken(fontWeight);
                const androidResult = androidConverter.convertToken(fontWeight);
                expect(webResult.value).toBe(600);
                expect(iosResult.value).toBe(600);
                expect(androidResult.value).toBe(600);
            });
        });
    });
    describe('Error Handling and Edge Cases', () => {
        let webConverter;
        let iosConverter;
        let androidConverter;
        beforeEach(() => {
            webConverter = new WebUnitConverter_1.WebUnitConverter();
            iosConverter = new iOSUnitConverter_1.iOSUnitConverter();
            androidConverter = new AndroidUnitConverter_1.AndroidUnitConverter();
        });
        test('should handle zero values correctly', () => {
            const zeroToken = createMockToken({ baseValue: 0 });
            expect(webConverter.convertToken(zeroToken).value).toBe(0);
            expect(iosConverter.convertToken(zeroToken).value).toBe(0);
            expect(androidConverter.convertToken(zeroToken).value).toBe(0);
        });
        test('should handle very large values', () => {
            const largeToken = createMockToken({ baseValue: 9999 });
            expect(webConverter.convertToken(largeToken).value).toBe(9999);
            expect(iosConverter.convertToken(largeToken).value).toBe(9999);
            expect(androidConverter.convertToken(largeToken).value).toBe(9999);
        });
        test('should handle decimal values with precision', () => {
            const decimalToken = createMockToken({
                category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
                baseValue: 1.375
            });
            const webResult = webConverter.convertToken(decimalToken);
            const iosResult = iosConverter.convertToken(decimalToken);
            const androidResult = androidConverter.convertToken(decimalToken);
            expect(webResult.value).toBe(1.375);
            expect(iosResult.value).toBe(1.375);
            expect(androidResult.value).toBe(1.375);
        });
        test('should handle unknown categories gracefully', () => {
            expect(webConverter.convertValue(10, 'unknown')).toEqual({ value: 10, unit: 'px' });
            expect(iosConverter.convertValue(10, 'unknown')).toEqual({ value: 10, unit: 'pt' });
            expect(androidConverter.convertValue(10, 'unknown')).toEqual({ value: 10, unit: 'dp' });
        });
        test('should validate conversion accuracy', () => {
            const providers = [webConverter, iosConverter, androidConverter];
            providers.forEach(provider => {
                // Valid conversions
                expect(provider.validateConversion(16, { value: 16, unit: 'px' }, 'spacing')).toBe(true);
                expect(provider.validateConversion(1.5, { value: 1.5, unit: 'unitless' }, 'lineHeight')).toBe(true);
                // Invalid conversions
                expect(provider.validateConversion(16, { value: -1, unit: 'px' }, 'spacing')).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=UnitProviders.test.js.map